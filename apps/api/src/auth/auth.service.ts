import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import type { AuthResponse } from '@arviora/shared';
import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService, toPublicUser } from '../users/users.service';
import { TokenService } from './token.service';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly users: UsersService,
    private readonly tokens: TokenService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /** Build the { accessToken, user } body plus a fresh refresh token. */
  private async issueSession(
    user: User,
  ): Promise<{ body: AuthResponse; refreshToken: string }> {
    const accessToken = this.tokens.signAccessToken(user);
    const refreshToken = await this.tokens.issueRefreshToken(user.id);
    return { body: { accessToken, user: toPublicUser(user) }, refreshToken };
  }

  async register(input: { name: string; email: string; password: string }) {
    const existing = await this.users.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }
    const passwordHash = await argon2.hash(input.password, {
      type: argon2.argon2id,
    });
    const user = await this.users.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });
    return this.issueSession(user);
  }

  async login(input: { email: string; password: string }) {
    const user = await this.users.findByEmail(input.email);
    // Always run a hash comparison to keep timing roughly constant.
    const valid =
      user && (await argon2.verify(user.passwordHash, input.password));
    if (!user || !valid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is disabled');
    }
    await this.users.markLoggedIn(user.id);
    return this.issueSession(user);
  }

  async updateProfile(userId: string, name: string) {
    const user = await this.users.updateName(userId, name);
    return toPublicUser(user);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.users.findById(userId);
    const valid =
      user && (await argon2.verify(user.passwordHash, currentPassword));
    if (!user || !valid) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    const passwordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
    });
    await this.users.updatePassword(user.id, passwordHash);
    // Force re-login everywhere else after a password change.
    await this.tokens.revokeAllForUser(user.id);
  }

  async refresh(rawToken: string | undefined) {
    if (!rawToken) throw new UnauthorizedException('Missing refresh token');
    const { user, refreshToken } =
      await this.tokens.rotateRefreshToken(rawToken);
    const accessToken = this.tokens.signAccessToken(user);
    const body: AuthResponse = { accessToken, user: toPublicUser(user) };
    return { body, refreshToken };
  }

  async logout(rawToken: string | undefined) {
    if (rawToken) await this.tokens.revokeRefreshToken(rawToken);
  }

  /**
   * Always succeeds from the caller's view (no user enumeration). If the email
   * exists, create a single-use reset token and log the link (dev stub).
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await this.users.findByEmail(email);
    if (!user) return;

    const token = randomBytes(32).toString('hex');
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: sha256(token),
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const webUrl = this.config.get<string>(
      'APP_WEB_URL',
      'http://localhost:5173',
    );
    const link = `${webUrl}/reset-password?token=${token}`;
    // Dev stub: a real email provider goes here later.
    this.logger.log(`Password reset link for ${user.email}: ${link}`);
  }

  async resetPassword(rawToken: string, newPassword: string): Promise<void> {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: sha256(rawToken) },
    });
    if (!record || record.usedAt || record.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const passwordHash = await argon2.hash(newPassword, {
      type: argon2.argon2id,
    });
    await this.prisma.$transaction([
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
    ]);
    // Force re-login everywhere after a password change.
    await this.tokens.revokeAllForUser(record.userId);
  }
}
