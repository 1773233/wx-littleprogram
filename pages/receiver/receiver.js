// pages/receiver/receiver.js

var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      address:null,//定位地址

      addressdetail: null,//地址详细楼层

      longitude:null,

      latitude:null,

      province:null,

      city:null,

      country:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  toaddressselect:function(){
    var _this=this;
    wx.chooseLocation({
      success: function(res) {
        _this.setData({
          address:res.name,
          longitude:res.longitude,
          latitude:res.latitude
        })
        app.getlocationinfo(res.longitude, res.latitude, function (tres) {
          _this.setData({
            province: tres.result.address_component.province,
            city: tres.result.address_component.city,
            country: tres.result.address_component.district,
          })
        })
      },
    })
  },//跳转到地址选择页面
  addressdetailinput:function(e){
    this.setData({
      addressdetail:e.detail.value
    })
  },
  confirmaddress:function(){
    if(this.data.address==null)
    {
      wx.showToast({
        title: '请选择地址',
        icon:"none"
      })
      return false;
    }
    if(this.data.addressdetail==null)
    {
      wx.showToast({
        title: '请填写详细地址信息',
        icon: "none"
      })
      return false;
    }
    if(this.data.province==null)
    {
      wx.showToast({
        title: '意料之外的错误,请重新选择地址',
        icon: "none"
      })
      return false;
    }
    var adinfo = { province: this.data.province, city: this.data.city, country: this.data.country,address: this.data.address, addressinfo: this.data.addressdetail, longitude: this.data.longitude, latitude: this.data.latitude};
    dayuanren.setStorage("buyaddress", adinfo);
    wx.navigateBack({
    })
  }
})