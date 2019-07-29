// pages/cashout/cashout.js
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cashoutdetail:[],
    nowpage:1,
    totalpage:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdrawalsList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.nowpage + 1 <= this.data.totalpage) {
      this.setData({
        nowpage: this.data.nowpage + 1
      })
      this.getdrawalsList()
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: "none"
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getdrawalsList:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    var newdata = this.data.cashoutdetail;
    dayuanren.Tpost("wallet/withdrawalsList?page=" + _this.data.nowpage, "", accesstoken, function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        var datalist=res.data.data;
        var tp = res.data.totalPages;
        for (var i = 0; i < datalist.length;i++)
        {
          datalist[i].create_time = dayuanren.timestamptostr(datalist[i].create_time);
        }
        newdata=newdata.concat(datalist);
        _this.setData({
          totalpage:tp,
          cashoutdetail: newdata
        })
      }else{
        wx.showToast({
          title: '获取提现列表失败',
          icon:"none"
        })
      }
    })
  }
})