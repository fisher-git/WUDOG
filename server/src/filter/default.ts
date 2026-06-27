import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultFilter {
  async catch(err: Error, ctx: Context) {
    ctx.logger.error('Unhandled error:', err);

    const status = (err as any).status || 500;
    ctx.status = status;
    ctx.body = {
      code: status,
      message: status === 500 ? '服务器内部错误' : err.message,
      data: null,
    };
  }
}
