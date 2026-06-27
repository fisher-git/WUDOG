import * as jwt from 'jsonwebtoken';
import { Config } from '@midwayjs/core';

export interface JwtPayload {
  userId: number;
  username: string;
  role: 'admin' | 'merchant' | 'user';
  roleId: number;
}

export class JwtUtil {
  @Config('jwt.secret')
  private secret: string;

  @Config('jwt.expiresIn')
  private expiresIn: string;

  @Config('jwt.refreshExpiresIn')
  private refreshExpiresIn: string;

  private blacklist: Set<string> = new Set();

  signToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  signRefreshToken(payload: JwtPayload): string {
    return jwt.sign({ ...payload, type: 'refresh' }, this.secret, { expiresIn: this.refreshExpiresIn });
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch {
      return null;
    }
  }

  addToBlacklist(token: string): void {
    this.blacklist.add(token);
  }

  isBlacklisted(token: string): boolean {
    return this.blacklist.has(token);
  }
}
