import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject } from '@midwayjs/core';
import { ApiResponse } from '@wudong/shared';
import { HomepageService } from '../../service/homepage';
import { LogOperation } from '../../middleware/operation_log';

@Controller('/admin/homepage')
export class AdminHomepageController {
  @Inject() homepageService: HomepageService;

  @Get('/banners') async getBanners(@Query('page') p = 1, @Query('pageSize') ps = 20) { return this.homepageService.getBanners(+p, +ps); }
  @Post('/banners') @LogOperation('banner_create', 'banner') async createBanner(@Body() b: any) { return this.homepageService.createBanner(b); }
  @Put('/banners/:id') @LogOperation('banner_update', 'banner') async updateBanner(@Param('id') id: number, @Body() b: any) { return this.homepageService.updateBanner(id, b); }
  @Delete('/banners/:id') @LogOperation('banner_delete', 'banner') async deleteBanner(@Param('id') id: number) { return this.homepageService.deleteBanner(id); }

  @Get('/announcements') async getAnnouncements(@Query('page') p = 1, @Query('pageSize') ps = 20) { return this.homepageService.getAnnouncements(+p, +ps); }
  @Post('/announcements') @LogOperation('announcement_create', 'announcement') async createAnnouncement(@Body() b: any) { return this.homepageService.createAnnouncement(b); }
  @Put('/announcements/:id') async updateAnnouncement(@Param('id') id: number, @Body() b: any) { return this.homepageService.updateAnnouncement(id, b); }
  @Delete('/announcements/:id') async deleteAnnouncement(@Param('id') id: number) { return this.homepageService.deleteAnnouncement(id); }

  @Get('/activities') async getActivities(@Query('page') p = 1, @Query('pageSize') ps = 20) { return this.homepageService.getActivityBanners(+p, +ps); }
  @Post('/activities') @LogOperation('activity_create', 'activity_banner') async createActivity(@Body() b: any) { return this.homepageService.createActivityBanner(b); }
  @Put('/activities/:id') async updateActivity(@Param('id') id: number, @Body() b: any) { return this.homepageService.updateActivityBanner(id, b); }
  @Delete('/activities/:id') async deleteActivity(@Param('id') id: number) { return this.homepageService.deleteActivityBanner(id); }

  @Get('/recommendations') async getSlots(@Query('page') p = 1, @Query('pageSize') ps = 20) { return this.homepageService.getRecommendationSlots(+p, +ps); }
  @Post('/recommendations') async createSlot(@Body() b: any) { return this.homepageService.createRecommendationSlot(b); }
  @Put('/recommendations/:id') async updateSlot(@Param('id') id: number, @Body() b: any) { return this.homepageService.updateRecommendationSlot(id, b); }
  @Delete('/recommendations/:id') async deleteSlot(@Param('id') id: number) { return this.homepageService.deleteRecommendationSlot(id); }
}
