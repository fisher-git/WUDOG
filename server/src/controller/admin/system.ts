import { Controller, Get, Post, Put, Delete, Param, Query, Body, Inject } from '@midwayjs/core';
import { SystemService } from '../../service/system';

@Controller('/admin/system')
export class AdminSystemController {
  @Inject() systemService: SystemService;

  @Get('/config')
  async getConfig(@Query('key') key: string) { return this.systemService.getConfig(key); }

  @Put('/config')
  async setConfig(@Body() body: { key: string; value: string }) { return this.systemService.setConfig(body.key, body.value); }

  @Get('/commission')
  async getCommissions() { return this.systemService.getCommissionConfigs(); }

  @Put('/commission/:id')
  async updateCommission(@Param('id') id: number, @Body() body: { rate: number }) { return this.systemService.updateCommissionConfig(id, body.rate); }

  @Get('/sensitive-words')
  async getSensitiveWords(@Query('page') p = 1, @Query('pageSize') ps = 20) { return this.systemService.getSensitiveWords(+p, +ps); }

  @Post('/sensitive-words')
  async addSensitiveWord(@Body() body: { word: string; category?: string }) { return this.systemService.addSensitiveWord(body.word, body.category); }

  @Delete('/sensitive-words/:id')
  async deleteSensitiveWord(@Param('id') id: number) { return this.systemService.deleteSensitiveWord(id); }

  @Post('/sensitive-words/batch')
  async batchImport(@Body() body: { words: string[] }) { return this.systemService.batchImportSensitiveWords(body.words); }

  @Get('/shipping')
  async getShipping() { return this.systemService.getShippingTemplates(); }

  @Post('/shipping')
  async createShipping(@Body() body: any) { return this.systemService.createShippingTemplate(body); }

  @Put('/shipping/:id')
  async updateShipping(@Param('id') id: number, @Body() body: any) { return this.systemService.updateShippingTemplate(id, body); }
}
