import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from './strategies/jwt.strategy';

/** sha256 hex digest — we only ever store hashes of opaque tokens. */
function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /** Short-lived access token (carried in the Authorization header). */
  signAccessToken(user: User): string {
    const payload: JwtPayload = { sub: user.id, role: user.role };
    const options: JwtSignOptions = {
      secret: this.config.get<string>('JWT_ACCESS_SECRET', 'dev-access-secret'),
      // ttl is a config string like "15m"; jsonwebtoken accepts this at runtime.
      expiresIn: this.config.get<string>('JWT_ACCESS_TTL', '15m'),
    } as JwtSignOptions;
    return this.jwt.sign(payload, options);
  }

  private refreshTtlMs(): number {
    const days = Number(this.config.get('REFRESH_TOKEN_TTL_DAYS', 7));
    return days * 24 * 60 * 60 * 1000;
  }

  /** Mint a new opaque refresh token, store its hash, return the raw token. */
  async issueRefreshToken(userId: string): Promise<string> {
    const token = randomBytes(48).toString('hex');
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: sha256(token),
        expiresAt: new Date(Date.now() + this.refreshTtlMs()),
      },
    });
    return token;
  }

  /**
   * Validate a refresh token and rotate it: revoke the old row and issue a new
   * one. Throws if the token is unknown, expired, or already revoked/used.
   */
  async rotateRefreshToken(
    rawToken: string,
  ): Promise<{ user: User; refreshToken: string }> {
    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: sha256(rawToken) },
      include: { user: true },
    });

    if (
      !record ||
      record.revokedAt ||
      record.expiresAt.getTime() < Date.now()
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    const refreshToken = await this.issueRefreshToken(record.userId);
    return { user: record.user, refreshToken };
  }

  /** Revoke a single refresh token (logout). Silent if it doesn't exist. */
  async revokeRefreshToken(rawToken: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: sha256(rawToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  /** Revoke every active refresh token for a user (password reset, etc.). */
  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  cookieMaxAgeMs(): number {
    return this.refreshTtlMs();
  }
}

export { sha256 };
