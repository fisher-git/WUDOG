import { Controller, Get, Inject } from '@midwayjs/core';
import { HomepageService } from '../../service/homepage';

@Controller('/public')
export class PublicHomeController {
  @Inject() homepageService: HomepageService;

  @Get('/homepage')
  async getHomepage() {
    return this.homepageService.getPublicHomepage();
  }
}
