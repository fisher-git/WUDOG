import { ContentStatus } from './enums';

export interface BannerInfo {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
  status: ContentStatus;
  createdAt: string;
}

export interface BannerRequest {
  title: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
  status: ContentStatus;
}

export interface AnnouncementInfo {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  status: ContentStatus;
  createdAt: string;
}

export interface AnnouncementRequest {
  title: string;
  content: string;
  status: ContentStatus;
}

export interface ActivityBannerInfo {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  startTime: string;
  endTime: string;
  status: ContentStatus;
  createdAt: string;
}

export interface ActivityBannerRequest {
  title: string;
  imageUrl: string;
  linkUrl: string;
  startTime: string;
  endTime: string;
  status: ContentStatus;
}

export interface RecommendationSlotInfo {
  id: number;
  slotName: string;
  contentType: string;
  contentId: number;
  sortOrder: number;
  status: ContentStatus;
  createdAt: string;
}

export interface RecommendationSlotRequest {
  slotName: string;
  contentType: string;
  contentId: number;
  sortOrder: number;
  status: ContentStatus;
}
