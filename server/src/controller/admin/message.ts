import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject } from '@midwayjs/core';
import { MessageService } from '../../service/message';

@Controller('/admin/messages')
export class AdminMessageController {
  @Inject() messageService: MessageService;

  @Post('/send')
  async sendMessage(@Body() body: { type: string; title: string; content: string; userIds?: number[]; sendAll?: boolean }) {
    return this.messageService.sendMessage(body.type, body.title, body.content, body.userIds, body.sendAll);
  }

  @Get('/history')
  async getHistory(@Query('page') p = 1, @Query('pageSize') ps = 20, @Query('type') type?: string) {
    return this.messageService.getMessageHistory(+p, +ps, type);
  }

  @Get('/templates')
  async getTemplates() { return this.messageService.getTemplateList(); }

  @Post('/templates')
  async createTemplate(@Body() body: any) { return this.messageService.createTemplate(body); }

  @Put('/templates/:id')
  async updateTemplate(@Param('id') id: number, @Body() body: any) { return this.messageService.updateTemplate(id, body); }
}
