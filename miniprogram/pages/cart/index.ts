Page({
  data: {
    items: [] as any[],
    selectedIds: new Set<number>(),
    allSelected: false,
    totalPrice: 0,
  },
  onShow() {
    this.loadCart();
  },
  loadCart() {
    const cart = wx.getStorageSync('cart') || [];
    this.setData({ items: cart });
    this.calcTotal();
  },
  onSelectAll(e: any) {
    const checked = e.detail.value.includes('all');
    const selectedIds = checked ? new Set(this.data.items.map((i: any) => i.id)) : new Set<number>();
    this.setData({ selectedIds, allSelected: checked });
    this.calcTotal();
  },
  onSelectItem(e: any) {
    const id = e.currentTarget.dataset.id;
    const checked = e.detail.value.includes(String(id));
    const selectedIds = new Set(this.data.selectedIds);
    checked ? selectedIds.add(id) : selectedIds.delete(id);
    const allSelected = selectedIds.size === this.data.items.length;
    this.setData({ selectedIds, allSelected });
    this.calcTotal();
  },
  onChangeQuantity(e: any) {
    const { id, action } = e.currentTarget.dataset;
    const items = this.data.items.map((item: any) => {
      if (item.id === id) {
        item.quantity = action === 'plus' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
      }
      return item;
    });
    this.setData({ items });
    wx.setStorageSync('cart', items);
    this.calcTotal();
  },
  onDelete(e: any) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({ title: '确认删除', content: '确定要删除该商品吗？', success: (res) => {
      if (res.confirm) {
        const items = this.data.items.filter((i: any) => i.id !== id);
        this.setData({ items });
        wx.setStorageSync('cart', items);
        this.calcTotal();
      }
    }});
  },
  calcTotal() {
    let totalPrice = 0;
    this.data.items.forEach((item: any) => {
      if (this.data.selectedIds.has(item.id)) {
        totalPrice += item.price * item.quantity;
      }
    });
    this.setData({ totalPrice: Math.round(totalPrice * 100) / 100 });
  },
  onCheckout() {
    if (this.data.selectedIds.size === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },
});
