import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import type { User as PublicUser } from '@arviora/shared';
import { PrismaService } from '../prisma/prisma.service';
import { normalizeEmail } from '../common/strings';

/** Strip sensitive fields before sending a user to the client. */
export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
  };
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: normalizeEmail(email) },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: {
    email: string;
    name: string;
    passwordHash: string;
    role?: Prisma.UserCreateInput['role'];
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: normalizeEmail(data.email),
        name: data.name.trim(),
        passwordHash: data.passwordHash,
        role: data.role,
      },
    });
  }

  updatePassword(userId: string, passwordHash: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  updateName(userId: string, name: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
    });
  }

  markLoggedIn(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }
}
