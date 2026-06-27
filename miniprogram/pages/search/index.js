var request = require('../../utils/api').request;

Page({
  data: {
    keyword: '',
    history: [],
    hotWords: ['苗族银饰', '苗寨民宿', '长桌宴', '蜡染体验', '梯田徒步', '苗绣'],
    suggestions: [],
    results: [],
    activeTab: 'all',
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'clothing', label: '商品' },
      { key: 'food', label: '餐厅' },
      { key: 'lodging', label: '民宿' },
      { key: 'travel', label: '路线' },
      { key: 'community', label: '游记' },
    ],
    hasSearched: false,
    loading: false,
  },

  onLoad: function() {
    var history = wx.getStorageSync('search_history') || [];
    this.setData({ history: history });
  },

  onSearchInput: function(e) {
    var keyword = e.detail.value;
    this.setData({ keyword: keyword });
    if (keyword.trim()) {
      this.fetchSuggestions(keyword);
    } else {
      this.setData({ suggestions: [] });
    }
  },

  fetchSuggestions: function(keyword) {
    var self = this;
    clearTimeout(this._debounceTimer);
    this._debounceTimer = setTimeout(function() {
      request({ url: '/public/search/suggestions?q=' + encodeURIComponent(keyword) }).then(function(res) {
        self.setData({ suggestions: (res && res.data || []).slice(0, 8) });
      }).catch(function() {
        // suggestions are optional
      });
    }, 300);
  },

  onSearch: function(e) {
    var keyword = (e && e.detail && e.detail.value) || this.data.keyword;
    if (!keyword.trim()) return;
    this.setData({ keyword: keyword, loading: true, hasSearched: true, suggestions: [] });
    this.saveHistory(keyword);
    this.doSearch(keyword);
  },

  doSearch: function(keyword) {
    var self = this;
    request({ url: '/public/search?q=' + encodeURIComponent(keyword) + '&type=' + this.data.activeTab }).then(function(res) {
      var data = res && res.data || {};
      self.setData({ results: data.list || [], loading: false });
    }).catch(function() {
      self.setData({ results: [], loading: false });
    });
  },

  saveHistory: function(keyword) {
    var history = this.data.history.filter(function(h) { return h !== keyword; });
    history.unshift(keyword);
    if (history.length > 10) history = history.slice(0, 10);
    this.setData({ history: history });
    wx.setStorageSync('search_history', history);
  },

  onClearHistory: function() {
    this.setData({ history: [] });
    wx.removeStorageSync('search_history');
  },

  onHistoryTap: function(e) {
    var keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword: keyword });
    this.onSearch();
  },

  onHotWordTap: function(e) {
    var keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword: keyword });
    this.onSearch();
  },

  onTabChange: function(e) {
    var tab = e.currentTarget.dataset.key;
    this.setData({ activeTab: tab });
    if (this.data.keyword.trim()) {
      this.doSearch(this.data.keyword);
    }
  },

  onClearKeyword: function() {
    this.setData({ keyword: '', suggestions: [], results: [], hasSearched: false });
  },
});
