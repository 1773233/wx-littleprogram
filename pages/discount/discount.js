// pages/discount/discount.js

var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    discounttikects: [],

    pagestatus: 0,//0为默认，表示从优惠券管理按钮点进页面，无需任何操作，1为从选择优惠券的按钮点进页面，需要返回优惠券id

    availablelocatinfo:null,//可用优惠券坐标信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options.needselect)
      {
        this.setData({
          pagestatus: options.needselect
        })
        var slgt = options.slgt;
        var slat = options.slat;
        var rlgt = options.rlgt;
        var rlat = options.rlat;
        var weight_key= options.weight_key;
        var datetype= options.datetype;
        var hour= options.hour;
        var minute= options.minute;
        this.setData({
          availablelocatinfo: { start_lat: slat, start_lon: slgt, end_lat: rlat, end_lon: rlgt, start_city: app.globalData.loccity, is_change: 1, weight_key: weight_key, datetype: datetype, hour: hour, minute: minute }
        })
        this.getavailableticketlist();
      }else{
        this.getticketlist();
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
  chooseticket:function(e){
    var tid=e.currentTarget.id;
    var price=e.currentTarget.dataset.price;
    if (this.data.pagestatus==1)
    {
      dayuanren.setStorage("ticketid", tid);
      dayuanren.setStorage("ticketprice", price);
      wx.navigateBack({
        
      })
    }
  },
  getticketlist:function(){
    wx.showLoading({
      title: '正在加载',
    })
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      dayuanren.Tget("coupons/couponsList","",accesstoken,function(res){
        wx.hideLoading();
        if(res.errno==0)
        {
          var list=[];
          for(var i=0;i<res.data.length;i++)
          {
            var stime = dayuanren.timestamptostr(res.data[i].start_time);
            var etime = dayuanren.timestamptostr(res.data[i].end_time);
            var ticket = { city: res.data[i].valid_city,id:res.data[i].id,starttime: stime, endtime: etime, price: res.data[i].price,full:res.data[i].full };
            list.push(ticket);
          }
          wx.hideLoading();
          _this.setData({
            discounttikects:list
          })
        }
      })
    }
  },//获取优惠券列表
  getavailableticketlist:function(){
    wx.showLoading({
      title: '正在加载',
    })
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      dayuanren.Tpost("order/orderCoupons", _this.data.availablelocatinfo, accesstoken, function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          var list = [];
          for (var i = 0; i < res.data.length; i++) {
            var stime = dayuanren.timestamptostr(res.data[i].start_time);
            var etime = dayuanren.timestamptostr(res.data[i].end_time);
            var ticket = { city: res.data[i].valid_city, id: res.data[i].id, starttime: stime, endtime: etime, price: res.data[i].price, full: res.data[i].full  };
            list.push(ticket);
          }
          wx.hideLoading();
          _this.setData({
            discounttikects: list
          })
        }
      })
    }
  },//获取订单可用优惠券列表
  noticketuse:function(){
    wx.removeStorage({
      key: 'ticketid',
      success: function (res) {
        wx.removeStorage({
          key: 'ticketprice',
          success: function (res) {
            wx.navigateBack({
              
            })
          },
          fail: function () {
            wx.showToast({
              title: '意料之外的错误，请重试',
              icon: "none"
            })
          }
        })
      },
      fail:function(){
        wx.showToast({
          title: '意料之外的错误，请重试',
          icon: "none"
        })
      }
    })
  }
})