import api from './api';
import type {
  ApiResponse,
  PaginatedData,
  BannerInfo,
  BannerRequest,
  AnnouncementInfo,
  AnnouncementRequest,
  ActivityBannerInfo,
  ActivityBannerRequest,
  RecommendationSlotInfo,
  RecommendationSlotRequest,
  PageQuery,
} from '@wudong/shared';

// Banner 管理
export function getBanners(params: PageQuery) {
  return api.get<ApiResponse<PaginatedData<BannerInfo>>>('/admin/homepage/banners', { params });
}
export function createBanner(data: BannerRequest) {
  return api.post<ApiResponse<BannerInfo>>('/admin/homepage/banners', data);
}
export function updateBanner(id: number, data: Partial<BannerRequest>) {
  return api.put<ApiResponse<BannerInfo>>(`/admin/homepage/banners/${id}`, data);
}
export function deleteBanner(id: number) {
  return api.delete<ApiResponse<null>>(`/admin/homepage/banners/${id}`);
}

// 公告管理
export function getAnnouncements(params: PageQuery) {
  return api.get<ApiResponse<PaginatedData<AnnouncementInfo>>>('/admin/homepage/announcements', { params });
}
export function createAnnouncement(data: AnnouncementRequest) {
  return api.post<ApiResponse<AnnouncementInfo>>('/admin/homepage/announcements', data);
}
export function updateAnnouncement(id: number, data: Partial<AnnouncementRequest>) {
  return api.put<ApiResponse<AnnouncementInfo>>(`/admin/homepage/announcements/${id}`, data);
}
export function deleteAnnouncement(id: number) {
  return api.delete<ApiResponse<null>>(`/admin/homepage/announcements/${id}`);
}

// 活动管理
export function getActivities(params: PageQuery) {
  return api.get<ApiResponse<PaginatedData<ActivityBannerInfo>>>('/admin/homepage/activities', { params });
}
export function createActivity(data: ActivityBannerRequest) {
  return api.post<ApiResponse<ActivityBannerInfo>>('/admin/homepage/activities', data);
}
export function updateActivity(id: number, data: Partial<ActivityBannerRequest>) {
  return api.put<ApiResponse<ActivityBannerInfo>>(`/admin/homepage/activities/${id}`, data);
}
export function deleteActivity(id: number) {
  return api.delete<ApiResponse<null>>(`/admin/homepage/activities/${id}`);
}

// 推荐位管理
export function getRecommendations(params: PageQuery) {
  return api.get<ApiResponse<PaginatedData<RecommendationSlotInfo>>>('/admin/homepage/recommendations', { params });
}
export function createRecommendation(data: RecommendationSlotRequest) {
  return api.post<ApiResponse<RecommendationSlotInfo>>('/admin/homepage/recommendations', data);
}
export function updateRecommendation(id: number, data: Partial<RecommendationSlotRequest>) {
  return api.put<ApiResponse<RecommendationSlotInfo>>(`/admin/homepage/recommendations/${id}`, data);
}
export function deleteRecommendation(id: number) {
  return api.delete<ApiResponse<null>>(`/admin/homepage/recommendations/${id}`);
}
