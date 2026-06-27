var request = require('../../utils/api').request;

Page({
  data: {
    banners: [],
    announcements: [],
    activities: [],
    recommendations: [],
    culturalStories: [],
    travelogues: [],
    traveloguePage: 1,
    travelogueTotal: 0,
    loading: true,
    travelogueLoading: false,
  },

  onLoad: function() {
    this.fetchHomepageData();
    this.fetchTravelogues();
  },

  onPullDownRefresh: function() {
    this.setData({ loading: true, traveloguePage: 1 });
    var self = this;
    Promise.all([self.fetchHomepageData(), self.fetchTravelogues()]).then(function() {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom: function() {
    if (this.data.travelogues.length < this.data.travelogueTotal) {
      this.fetchTravelogues(true);
    }
  },

  fetchHomepageData: function() {
    var self = this;
    return request({ url: '/public/homepage' }).then(function(res) {
      var data = res.data || {};
      self.setData({
        banners: data.banners || [],
        announcements: data.announcements || [],
        activities: data.activities || [],
        recommendations: data.recommendations || [],
        loading: false,
      });
    }).catch(function() {
      self.setData({ loading: false });
    });
  },

  fetchTravelogues: function(append) {
    if (!append) this.setData({ travelogueLoading: true });
    var page = append ? this.data.traveloguePage + 1 : 1;
    var self = this;
    return request({ url: '/public/travelogues/hot?page=' + page + '&pageSize=10' }).then(function(res) {
      var data = res.data || {};
      self.setData({
        travelogues: append ? self.data.travelogues.concat(data.list || []) : (data.list || []),
        traveloguePage: page,
        travelogueTotal: data.total || 0,
        travelogueLoading: false,
      });
    }).catch(function() {
      self.setData({ travelogueLoading: false });
    });
  },

  onBannerTap: function(e) {
    var item = e.currentTarget.dataset.item;
    if (item.linkUrl) {
      wx.navigateTo({ url: item.linkUrl });
    }
  },

  onCategoryTap: function(e) {
    var module = e.currentTarget.dataset.module;
    wx.switchTab({ url: '/pages/search/index?module=' + module });
  },

  onTravelogueTap: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/travelogue/detail?id=' + id });
  },

  onSearchTap: function() {
    wx.switchTab({ url: '/pages/search/index' });
  },
});
