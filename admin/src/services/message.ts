import api from './api';
import type {
  ApiResponse,
  PaginatedData,
  SystemMessageInfo,
  SendMessageRequest,
  MessageTemplateInfo,
  MessageTemplateRequest,
  PageQuery,
} from '@wudong/shared';

// 消息发送
export function sendMessage(data: SendMessageRequest) {
  return api.post<ApiResponse<null>>('/admin/messages/send', data);
}

export interface MessageHistoryQuery extends PageQuery {
  type?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
}

export function getHistory(params: MessageHistoryQuery) {
  return api.get<ApiResponse<PaginatedData<SystemMessageInfo>>>('/admin/messages/history', { params });
}

// 消息模板
export function getTemplates(params: PageQuery) {
  return api.get<ApiResponse<PaginatedData<MessageTemplateInfo>>>('/admin/messages/templates', { params });
}
export function createTemplate(data: MessageTemplateRequest) {
  return api.post<ApiResponse<MessageTemplateInfo>>('/admin/messages/templates', data);
}
export function updateTemplate(id: number, data: Partial<MessageTemplateRequest>) {
  return api.put<ApiResponse<MessageTemplateInfo>>(`/admin/messages/templates/${id}`, data);
}
export function deleteTemplate(id: number) {
  return api.delete<ApiResponse<null>>(`/admin/messages/templates/${id}`);
}
