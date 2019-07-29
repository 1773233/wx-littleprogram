// pages/shareprize/shareprize.js
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      moneydetail:[],
      totalmoney:0,//总奖金
      nowpage:1,
      totalpage:1,
      invNum:0,
      invSuNum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
      this.getsharecount();
  },
  getsharecount: function () {
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if(accesstoken)
    {
      wx.showLoading({
        title: '数据加载中',
      })
      var oldlist = _this.data.moneydetail;
      dayuanren.Tget("user/mineShareList?page=" + _this.data.nowpage,"", accesstoken, function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          var loglist = res.data.logList.data;
          for(var i=0;i<loglist.length;i++)
          {
            loglist[i].create_time = dayuanren.timestamptostr(loglist[i].create_time);
            oldlist.push(loglist[i]);
          }
          _this.setData({
            moneydetail: oldlist,
            totalpage: res.data.logList.totalPages,
            invNum: res.data.invNum,
            invSuNum: res.data.invSuNum,
            totalmoney: res.data.totalMoney
          })
        }else{
          wx.showToast({
            title: '加载失败，请重试',
            icon:"none"
          })
        }
      })
    }
  },
  onReachBottom: function () {
    if (this.data.nowpage + 1 <= this.data.totalpage) {
      this.setData({
        nowpage: this.data.nowpage + 1
      })
      this.getsharecount()
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: "none"
      })
    }
  },
})