// pages/moneydetail/moneydetail.js

var dayuanren = require('../../utils/dayuanren.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneydetail:[],
    nowpage: 1,//数据传给后台响应的页面，默认为1，第一页
    totalpage: 1//总页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getmoneydetail();
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
  getmoneydetail:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '数据加载中',
      })
      dayuanren.Tpost("wallet/balanceLog?page=" + _this.data.nowpage,"", accesstoken, function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          var list = _this.data.moneydetail;
          var newdata=res.data.data;
          for(var i=0;i<newdata.length;i++)
          {
            newdata[i].create_time = app.datetostr(newdata[i].create_time,"YMDHM");
            list.push(newdata[i]);
          }
          _this.setData({
            moneydetail: list
          })
        }else{
          wx.showToast({
            title: '数据加载失败',
            icon:"none"
          })
        }
      })
    }
  },
  refreshmoneydetail: function () {
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '数据加载中',
      })
      dayuanren.Tpost("wallet/balanceLog?page=1","", accesstoken, function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.errno == 0) {
          var list = [];
          var newdata = res.data.data;
          for (var i = 0; i < newdata.length; i++) {
            newdata[i].create_time = app.datetostr(newdata[i].create_time,"YMDHM");
            list.push(newdata[i]);
          }
          _this.setData({
            moneydetail: list
          })
        }else{
          wx.showToast({
            title: '数据加载失败',
            icon: "none"
          })
        }
      })
    }
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    if (this.data.nowpage + 1 <= this.data.totalpage) {
      this.setData({
        nowpage: this.data.nowpage + 1
      })
      this.getmoneydetail()
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: "none"
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      nowpage: 1
    })
    this.refreshmoneydetail();
  },
})