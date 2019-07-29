// pages/helpdetail/helpdetail.js
var dayuanren = require('../../utils/dayuanren.js');
var WxParse = require('../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ques:null,
    hpid:null,
    title:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id)
    {
      this.setData({
        hpid:options.id
      })
      this.gethelpdetail(options.id);
    }
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  gethelpdetail: function (id) {
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '数据加载中',
      })
      dayuanren.Tpost("user/helpDetail", { id: id},accesstoken, function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          _this.setData({
            title:res.data.title
          })
          WxParse.wxParse('ques', 'html', res.data.description, _this, 5);
        }else{
          wx.showToast({
            title: '数据加载失败',
            icon:"none"
          })
        }
      })
    }
  },
  dosomething:function(e){
    var ttype=e.currentTarget.dataset.type;
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '正在提交',
      })
      dayuanren.Tpost("user/helpDeal", { id: this.data.hpid, type: ttype }, accesstoken, function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          wx.showToast({
            title: res.errmsg,
            icon:"none"
          })
        }
      })
    }
  },
})