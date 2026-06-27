import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { SystemMessage } from '../entity/system_message';
import { MessageTemplate } from '../entity/message_template';
import { ApiResponse, PaginatedData, SystemMessageInfo, MessageTemplateInfo } from '@wudong/shared';

@Provide()
export class MessageService {
  @InjectEntityModel(SystemMessage)
  messageRepo: Repository<SystemMessage>;

  @InjectEntityModel(MessageTemplate)
  templateRepo: Repository<MessageTemplate>;

  async sendMessage(type: string, title: string, content: string, userIds?: number[], sendAll?: boolean): Promise<ApiResponse<null>> {
    if (sendAll) {
      await this.messageRepo.save({ userId: null, type, title, content, isRead: false });
    } else if (userIds && userIds.length > 0) {
      const messages = userIds.map(uid => ({ userId: uid, type, title, content, isRead: false }));
      await this.messageRepo.save(messages);
    }
    return { code: 200, message: '发送成功', data: null };
  }

  async getMessageHistory(page: number, pageSize: number, type?: string): Promise<ApiResponse<PaginatedData<SystemMessageInfo>>> {
    const where: any = {};
    if (type) where.type = type;

    const [list, total] = await this.messageRepo.findAndCount({
      where, skip: (page - 1) * pageSize, take: pageSize, order: { createdAt: 'DESC' },
    });

    return {
      code: 200, message: '查询成功',
      data: {
        list: list.map(m => ({ id: m.id, userId: m.userId, type: m.type as any, title: m.title, content: m.content, isRead: m.isRead, createdAt: m.createdAt.toISOString() })),
        total, page, pageSize,
      },
    };
  }

  async getTemplateList(): Promise<ApiResponse<MessageTemplateInfo[]>> {
    const templates = await this.templateRepo.find({ order: { createdAt: 'DESC' } });
    return {
      code: 200, message: '查询成功',
      data: templates.map(t => ({ id: t.id, code: t.code, name: t.name, titleTemplate: t.titleTemplate, contentTemplate: t.contentTemplate, type: t.type as any, updatedAt: t.updatedAt.toISOString() })),
    };
  }

  async createTemplate(data: any): Promise<ApiResponse<MessageTemplateInfo>> {
    const tpl = await this.templateRepo.save(data);
    return { code: 200, message: '创建成功', data: { id: tpl.id, code: tpl.code, name: tpl.name, titleTemplate: tpl.titleTemplate, contentTemplate: tpl.contentTemplate, type: tpl.type as any, updatedAt: tpl.updatedAt.toISOString() } };
  }

  async updateTemplate(id: number, data: any): Promise<ApiResponse<MessageTemplateInfo>> {
    await this.templateRepo.update(id, data);
    const tpl = await this.templateRepo.findOne({ where: { id } });
    return { code: 200, message: '更新成功', data: tpl ? { id: tpl.id, code: tpl.code, name: tpl.name, titleTemplate: tpl.titleTemplate, contentTemplate: tpl.contentTemplate, type: tpl.type as any, updatedAt: tpl.updatedAt.toISOString() } : null as any };
  }
}
