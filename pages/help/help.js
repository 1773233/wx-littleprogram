// pages/help/help.js
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quelist:[],//问题列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gethelplist();
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
  gethelplist:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '数据加载中',
      })
      dayuanren.ctget("user/helpList", "", accesstoken, function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          _this.setData({
            quelist:res.data
          })
        }
      })
    }
  },
  todetailpage:function(e){
    var id=e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/helpdetail/helpdetail?id='+id,
    })
  },
  makephonecall:function(){
    var _this=this;
    wx.showLoading({
      title: '正在获取',
    })
    dayuanren.cget("login/fwTel", "", function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        wx.makePhoneCall({
          phoneNumber: res.data
        })
      }else{
        wx.showToast({
          title: '暂未开通',
          icon:"none"
        })
      }
    })
  }//打电话
})