Page({
  data: {
    items: [],
    selectedIds: {},
    allSelected: false,
    totalPrice: 0,
  },
  onShow: function() {
    this.loadCart();
  },
  loadCart: function() {
    var cart = wx.getStorageSync('cart') || [];
    this.setData({ items: cart });
    this.calcTotal();
  },
  onSelectAll: function(e) {
    var checked = e.detail.value.indexOf('all') >= 0;
    var selectedIds = {};
    if (checked) {
      this.data.items.forEach(function(item) {
        selectedIds[item.id] = true;
      });
    }
    this.setData({ selectedIds: selectedIds, allSelected: checked });
    this.calcTotal();
  },
  onSelectItem: function(e) {
    var id = e.currentTarget.dataset.id;
    var checked = e.detail.value.indexOf(String(id)) >= 0;
    var selectedIds = Object.assign({}, this.data.selectedIds);
    if (checked) {
      selectedIds[id] = true;
    } else {
      delete selectedIds[id];
    }
    var allSelected = Object.keys(selectedIds).length === this.data.items.length;
    this.setData({ selectedIds: selectedIds, allSelected: allSelected });
    this.calcTotal();
  },
  onChangeQuantity: function(e) {
    var id = e.currentTarget.dataset.id;
    var action = e.currentTarget.dataset.action;
    var items = this.data.items.map(function(item) {
      if (item.id === id) {
        item.quantity = action === 'plus' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
      }
      return item;
    });
    this.setData({ items: items });
    wx.setStorageSync('cart', items);
    this.calcTotal();
  },
  onDelete: function(e) {
    var id = e.currentTarget.dataset.id;
    var self = this;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该商品吗？',
      success: function(res) {
        if (res.confirm) {
          var items = self.data.items.filter(function(i) { return i.id !== id; });
          self.setData({ items: items });
          wx.setStorageSync('cart', items);
          self.calcTotal();
        }
      }
    });
  },
  calcTotal: function() {
    var self = this;
    var totalPrice = 0;
    this.data.items.forEach(function(item) {
      if (self.data.selectedIds[item.id]) {
        totalPrice += item.price * item.quantity;
      }
    });
    this.setData({ totalPrice: Math.round(totalPrice * 100) / 100 });
  },
  onCheckout: function() {
    if (Object.keys(this.data.selectedIds).length === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },
});
