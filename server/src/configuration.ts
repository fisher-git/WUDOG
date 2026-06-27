import { Configuration, App, Inject } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as typeorm from '@midwayjs/typeorm';
import * as swagger from '@midwayjs/swagger';
import * as validate from '@midwayjs/validate';
import { join } from 'path';
import { DefaultFilter } from './filter/default';
import { AuthMiddleware } from './middleware/auth';

@Configuration({
  imports: [koa, typeorm, swagger, validate],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa') app: koa.Application;

  async onReady() {
    this.app.useMiddleware([AuthMiddleware]);
    this.app.useFilter([DefaultFilter]);
  }
}
