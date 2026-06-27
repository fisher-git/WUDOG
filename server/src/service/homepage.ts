import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from '../entity/banner';
import { Announcement } from '../entity/announcement';
import { ActivityBanner } from '../entity/activity_banner';
import { RecommendationSlot } from '../entity/recommendation_slot';
import { ApiResponse, PaginatedData, BannerInfo, AnnouncementInfo, ActivityBannerInfo, RecommendationSlotInfo } from '@wudong/shared';

@Provide()
export class HomepageService {
  @InjectEntityModel(Banner) bannerRepo: Repository<Banner>;
  @InjectEntityModel(Announcement) announcementRepo: Repository<Announcement>;
  @InjectEntityModel(ActivityBanner) activityBannerRepo: Repository<ActivityBanner>;
  @InjectEntityModel(RecommendationSlot) slotRepo: Repository<RecommendationSlot>;

  // ========== 轮播图 ==========
  async getBanners(page: number, pageSize: number): Promise<ApiResponse<PaginatedData<BannerInfo>>> {
    const [list, total] = await this.bannerRepo.findAndCount({
      skip: (page - 1) * pageSize, take: pageSize, order: { sortOrder: 'ASC' },
    });
    return {
      code: 200, message: '查询成功',
      data: { list: list.map(formatBanner), total, page, pageSize },
    };
  }

  async createBanner(data: any): Promise<ApiResponse<BannerInfo>> {
    const banner = await this.bannerRepo.save(data);
    return { code: 200, message: '创建成功', data: formatBanner(banner) };
  }

  async updateBanner(id: number, data: any): Promise<ApiResponse<BannerInfo>> {
    await this.bannerRepo.update(id, data);
    const banner = await this.bannerRepo.findOne({ where: { id } });
    return { code: 200, message: '更新成功', data: formatBanner(banner!) };
  }

  async deleteBanner(id: number): Promise<ApiResponse<null>> {
    await this.bannerRepo.delete(id);
    return { code: 200, message: '删除成功', data: null };
  }

  // ========== 公告 ==========
  async getAnnouncements(page: number, pageSize: number): Promise<ApiResponse<PaginatedData<AnnouncementInfo>>> {
    const [list, total] = await this.announcementRepo.findAndCount({
      skip: (page - 1) * pageSize, take: pageSize, order: { createdAt: 'DESC' },
    });
    return {
      code: 200, message: '查询成功',
      data: { list: list.map(formatAnnouncement), total, page, pageSize },
    };
  }

  async createAnnouncement(data: any): Promise<ApiResponse<AnnouncementInfo>> {
    if (data.status === 'published') data.publishedAt = new Date();
    const ann = await this.announcementRepo.save(data);
    return { code: 200, message: '创建成功', data: formatAnnouncement(ann) };
  }

  async updateAnnouncement(id: number, data: any): Promise<ApiResponse<AnnouncementInfo>> {
    if (data.status === 'published') data.publishedAt = new Date();
    await this.announcementRepo.update(id, data);
    const ann = await this.announcementRepo.findOne({ where: { id } });
    return { code: 200, message: '更新成功', data: formatAnnouncement(ann!) };
  }

  async deleteAnnouncement(id: number): Promise<ApiResponse<null>> {
    await this.announcementRepo.delete(id);
    return { code: 200, message: '删除成功', data: null };
  }

  // ========== 活动横幅 ==========
  async getActivityBanners(page: number, pageSize: number): Promise<ApiResponse<PaginatedData<ActivityBannerInfo>>> {
    const [list, total] = await this.activityBannerRepo.findAndCount({
      skip: (page - 1) * pageSize, take: pageSize, order: { createdAt: 'DESC' },
    });
    return {
      code: 200, message: '查询成功',
      data: { list: list.map(formatActivityBanner), total, page, pageSize },
    };
  }

  async createActivityBanner(data: any): Promise<ApiResponse<ActivityBannerInfo>> {
    const ab = await this.activityBannerRepo.save(data);
    return { code: 200, message: '创建成功', data: formatActivityBanner(ab) };
  }

  async updateActivityBanner(id: number, data: any): Promise<ApiResponse<ActivityBannerInfo>> {
    await this.activityBannerRepo.update(id, data);
    const ab = await this.activityBannerRepo.findOne({ where: { id } });
    return { code: 200, message: '更新成功', data: formatActivityBanner(ab!) };
  }

  async deleteActivityBanner(id: number): Promise<ApiResponse<null>> {
    await this.activityBannerRepo.delete(id);
    return { code: 200, message: '删除成功', data: null };
  }

  // ========== 推荐位 ==========
  async getRecommendationSlots(page: number, pageSize: number): Promise<ApiResponse<PaginatedData<RecommendationSlotInfo>>> {
    const [list, total] = await this.slotRepo.findAndCount({
      skip: (page - 1) * pageSize, take: pageSize, order: { sortOrder: 'ASC' },
    });
    return {
      code: 200, message: '查询成功',
      data: { list: list.map(formatSlot), total, page, pageSize },
    };
  }

  async createRecommendationSlot(data: any): Promise<ApiResponse<RecommendationSlotInfo>> {
    const slot = await this.slotRepo.save(data);
    return { code: 200, message: '创建成功', data: formatSlot(slot) };
  }

  async updateRecommendationSlot(id: number, data: any): Promise<ApiResponse<RecommendationSlotInfo>> {
    await this.slotRepo.update(id, data);
    const slot = await this.slotRepo.findOne({ where: { id } });
    return { code: 200, message: '更新成功', data: formatSlot(slot!) };
  }

  async deleteRecommendationSlot(id: number): Promise<ApiResponse<null>> {
    await this.slotRepo.delete(id);
    return { code: 200, message: '删除成功', data: null };
  }

  // ========== 公开首页聚合数据 ==========
  async getPublicHomepage(): Promise<ApiResponse<any>> {
    const banners = await this.bannerRepo.find({ where: { status: 'published' }, order: { sortOrder: 'ASC' }, take: 5 });
    const announcements = await this.announcementRepo.find({ where: { status: 'published' }, order: { createdAt: 'DESC' }, take: 3 });
    const activities = await this.activityBannerRepo.find({ where: { status: 'published' }, order: { createdAt: 'DESC' }, take: 3 });
    const recommendations = await this.slotRepo.find({ where: { status: 'published' }, order: { sortOrder: 'ASC' }, take: 10 });

    return {
      code: 200, message: '查询成功',
      data: {
        banners: banners.map(formatBanner),
        announcements: announcements.map(formatAnnouncement),
        activities: activities.map(formatActivityBanner),
        recommendations: recommendations.map(formatSlot),
      },
    };
  }
}

// 格式化工具函数
function formatBanner(b: Banner): BannerInfo {
  return { id: b.id, title: b.title, imageUrl: b.imageUrl, linkUrl: b.linkUrl || '', sortOrder: b.sortOrder, status: b.status as any, createdAt: b.createdAt.toISOString() };
}
function formatAnnouncement(a: Announcement): AnnouncementInfo {
  return { id: a.id, title: a.title, content: a.content, publishedAt: a.publishedAt?.toISOString() || '', status: a.status as any, createdAt: a.createdAt.toISOString() };
}
function formatActivityBanner(a: ActivityBanner): ActivityBannerInfo {
  return { id: a.id, title: a.title, imageUrl: a.imageUrl, linkUrl: a.linkUrl || '', startTime: a.startTime.toISOString(), endTime: a.endTime.toISOString(), status: a.status as any, createdAt: a.createdAt.toISOString() };
}
function formatSlot(s: RecommendationSlot): RecommendationSlotInfo {
  return { id: s.id, slotName: s.slotName, contentType: s.contentType, contentId: s.contentId, sortOrder: s.sortOrder, status: s.status as any, createdAt: s.createdAt.toISOString() };
}
