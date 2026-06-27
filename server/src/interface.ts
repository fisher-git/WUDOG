import { JwtPayload } from './utils/jwt';

declare module '@midwayjs/koa' {
  interface Context {
    currentUser: JwtPayload;
  }
}
