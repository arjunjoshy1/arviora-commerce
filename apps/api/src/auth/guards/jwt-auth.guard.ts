import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Requires a valid access JWT (Authorization: Bearer <token>). */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
