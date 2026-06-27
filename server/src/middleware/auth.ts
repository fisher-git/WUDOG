import { Middleware, IMiddleware, Inject } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { JwtUtil } from '../utils/jwt';

@Middleware()
export class AuthMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  jwtUtil: JwtUtil;

  ignore(ctx: Context): boolean {
    const publicPaths = [
      '/api/public/',
      '/api/admin/auth/login',
      '/api/admin/auth/send-sms',
      '/api/merchant/auth/login',
    ];
    return publicPaths.some(p => ctx.path.startsWith(p));
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const authHeader = ctx.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        ctx.status = 401;
        ctx.body = { code: 401, message: '未提供认证令牌', data: null };
        return;
      }

      const token = authHeader.slice(7);
      if (this.jwtUtil.isBlacklisted(token)) {
        ctx.status = 401;
        ctx.body = { code: 401, message: '令牌已失效', data: null };
        return;
      }

      const payload = this.jwtUtil.verifyToken(token);
      if (!payload) {
        ctx.status = 401;
        ctx.body = { code: 401, message: '令牌无效或已过期', data: null };
        return;
      }

      (ctx as any).currentUser = payload;
      await next();
    };
  }
}
