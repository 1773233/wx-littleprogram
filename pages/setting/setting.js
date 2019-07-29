// pages/setting/setting.js
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storagesize:"0kb",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
    this.getstorage();
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
  tomyaddress: function () {
    wx.navigateTo({
      url: '/pages/addressmanage/addressmanage',
    })
  },//跳转到用户地址列表页面
  clearstorage:function(){
    var _this=this;
    var accesstoken = dayuanren.get_access_token();
    wx.showModal({
      title: '您确认要清除缓存吗？',
      success:function(res){
        if(res.confirm)
        {
          wx.clearStorageSync();
          wx.showToast({
            title: '清除缓存成功！',
            icon:"none"
          })
          _this.getstorage();
          dayuanren.save_access_token(accesstoken);
        }
      }
    })
  },
  toabout:function(){
    wx.navigateTo({
      url: '/pages/aboutus/aboutus',
    })
  },
  getstorage:function(){
    var _this = this;
    wx.getStorageInfo({
      success: function (res) {
        var size = (res.currentSize / 1024).toFixed(2);
        var dw = "M";
        if (parseInt(size) == 0) {
          dw = "Kb"
        }
        _this.setData({
          storagesize: size + dw
        })
      },
    })
  },
  tocardmanage:function(){
    wx.navigateTo({
      url: '/pages/cardmanage/cardmanage',
    })
  }
})