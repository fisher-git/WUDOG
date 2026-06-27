import { MessageType } from './enums';

export interface SystemMessageInfo {
  id: number;
  userId: number | null;
  type: MessageType;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface SendMessageRequest {
  type: MessageType;
  title: string;
  content: string;
  userIds?: number[];
  sendAll?: boolean;
}

export interface MessageTemplateInfo {
  id: number;
  code: string;
  name: string;
  titleTemplate: string;
  contentTemplate: string;
  type: MessageType;
  updatedAt: string;
}

export interface MessageTemplateRequest {
  code: string;
  name: string;
  titleTemplate: string;
  contentTemplate: string;
  type: MessageType;
}
