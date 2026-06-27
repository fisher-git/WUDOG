import { request } from '../../utils/api';

Page({
  data: {
    banners: [] as any[],
    announcements: [] as any[],
    activities: [] as any[],
    recommendations: [] as any[],
    culturalStories: [] as any[],
    travelogues: [] as any[],
    traveloguePage: 1,
    travelogueTotal: 0,
    loading: true,
    travelogueLoading: false,
  },

  onLoad() {
    this.fetchHomepageData();
    this.fetchTravelogues();
  },

  onPullDownRefresh() {
    this.setData({ loading: true, traveloguePage: 1 });
    Promise.all([this.fetchHomepageData(), this.fetchTravelogues()]).finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.data.travelogues.length < this.data.travelogueTotal) {
      this.fetchTravelogues(true);
    }
  },

  async fetchHomepageData() {
    try {
      const res: any = await request({ url: '/public/homepage' });
      const data = res.data || {};
      this.setData({
        banners: data.banners || [],
        announcements: data.announcements || [],
        activities: data.activities || [],
        recommendations: data.recommendations || [],
        loading: false,
      });
    } catch {
      this.setData({ loading: false });
    }
  },

  async fetchTravelogues(append = false) {
    if (!append) this.setData({ travelogueLoading: true });
    const page = append ? this.data.traveloguePage + 1 : 1;
    try {
      const res: any = await request({ url: `/public/travelogues/hot?page=${page}&pageSize=10` });
      const data = res.data || {};
      this.setData({
        travelogues: append ? [...this.data.travelogues, ...(data.list || [])] : (data.list || []),
        traveloguePage: page,
        travelogueTotal: data.total || 0,
        travelogueLoading: false,
      });
    } catch {
      this.setData({ travelogueLoading: false });
    }
  },

  onBannerTap(e: any) {
    const item = e.currentTarget.dataset.item;
    if (item.linkUrl) {
      wx.navigateTo({ url: item.linkUrl });
    }
  },

  onCategoryTap(e: any) {
    const module = e.currentTarget.dataset.module;
    wx.switchTab({ url: `/pages/search/index?module=${module}` });
  },

  onTravelogueTap(e: any) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/travelogue/detail?id=${id}` });
  },

  onSearchTap() {
    wx.switchTab({ url: '/pages/search/index' });
  },
});
