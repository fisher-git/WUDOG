import { request } from '../../utils/api';

Page({
  data: {
    keyword: '',
    history: [] as string[],
    hotWords: ['苗族银饰', '苗寨民宿', '长桌宴', '蜡染体验', '梯田徒步', '苗绣'],
    suggestions: [] as string[],
    results: [] as any[],
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

  onLoad() {
    const history = wx.getStorageSync('search_history') || [];
    this.setData({ history });
  },

  onSearchInput(e: any) {
    const keyword = e.detail.value;
    this.setData({ keyword });
    if (keyword.trim()) {
      this.fetchSuggestions(keyword);
    } else {
      this.setData({ suggestions: [] });
    }
  },

  fetchSuggestions(keyword: string) {
    clearTimeout((this as any)._debounceTimer);
    (this as any)._debounceTimer = setTimeout(async () => {
      try {
        const res: any = await request({ url: `/public/search/suggestions?q=${encodeURIComponent(keyword)}` });
        this.setData({ suggestions: (res?.data || []).slice(0, 8) });
      } catch {
        // suggestions are optional
      }
    }, 300);
  },

  onSearch(e?: any) {
    const keyword = e?.detail?.value || this.data.keyword;
    if (!keyword.trim()) return;
    this.setData({ keyword, loading: true, hasSearched: true, suggestions: [] });
    this.saveHistory(keyword);
    this.doSearch(keyword);
  },

  async doSearch(keyword: string) {
    try {
      const res: any = await request({ url: `/public/search?q=${encodeURIComponent(keyword)}&type=${this.data.activeTab}` });
      this.setData({ results: res?.data?.list || [], loading: false });
    } catch {
      this.setData({ results: [], loading: false });
    }
  },

  saveHistory(keyword: string) {
    let history = this.data.history.filter(h => h !== keyword);
    history.unshift(keyword);
    if (history.length > 10) history = history.slice(0, 10);
    this.setData({ history });
    wx.setStorageSync('search_history', history);
  },

  onClearHistory() {
    this.setData({ history: [] });
    wx.removeStorageSync('search_history');
  },

  onHistoryTap(e: any) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword });
    this.onSearch();
  },

  onHotWordTap(e: any) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword });
    this.onSearch();
  },

  onTabChange(e: any) {
    const tab = e.currentTarget.dataset.key;
    this.setData({ activeTab: tab });
    if (this.data.keyword.trim()) {
      this.doSearch(this.data.keyword);
    }
  },

  onClearKeyword() {
    this.setData({ keyword: '', suggestions: [], results: [], hasSearched: false });
  },
});
