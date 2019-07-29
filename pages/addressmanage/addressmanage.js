// pages/addressmanage/addressmanage.js

/*
  author:llg
  2018/7/13编写地址列表功能
*/


var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresslist:[],

    tipmessage:"您还没有保存过地址",//没有地址时的提示消息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onShow:function(){
    this.getaddresslist();
  },
  addressselect:function(id){
    var adlist = this.data.addresslist;
    for (var i = 0; i < adlist.length; i++) {
        adlist[i].selected = false;
    }
    for (var i = 0; i < adlist.length;i++)
    {
      if(adlist[i].id==id)
      {
        adlist[i].selected=true;
      }
    }
    this.setData({
      addresslist: adlist
    })
  },
  getaddresslist:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '数据加载中',
      })
      dayuanren.Tget("user/addressList", { is_change: 1},accesstoken,function(res){
        wx.hideLoading();
        if(res.errno==0)
        {
          if (res.data == null) {
            _this.setData({
              tipmessage: "您还没有保存过地址"
            })
          } else {
            var address = res.data;
            for (var i = 0; i < address.length; i++) {
              if (address[i].default == 1) {
                address[i].selected = true;
              }
            }
            _this.setData({
              addresslist: address
            })
          }
        }else{
          wx.showToast({
            title: res.errmsg,
            icon:"none"
          })
        }
      })
    }
  },
  setdefault:function(e){
    var id=e.currentTarget.dataset.value;
    this.addressselect(id);
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      dayuanren.Tpost("user/setAddress", {id:id}, accesstoken, function (res) {
        if(res.errno==0)
        {
          wx.showToast({
            title: '设置默认地址成功',
            icon:"none"
          })
        }
      })
    }
  },
  editaddress:function(e){
    var id = e.currentTarget.dataset.value;
    wx.navigateTo({
      url: '/pages/sender/sender?editid='+id,
    })
  },
  deletaddress:function(e){
    var id = e.currentTarget.dataset.value;
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showModal({
        title: '您确认要删除该地址吗？',
        confirmColor: "#fe8702",
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '正在删除地址',
            })
            dayuanren.Tget("user/delAddress", { id: id }, accesstoken, function (res) {
              wx.hideLoading();
              if (res.errno == 0) {
                _this.removedataaddress(id);
                wx.showToast({
                  title: '地址删除成功',
                  icon: "none",
                  duration:2000
                })
              }
            })
          }
        }
      })
    }
  },
  tosenderaddress:function(e){
    var id = e.currentTarget.dataset.value;
    wx.navigateTo({
      url: '/pages/sender/sender',
    })
  },//添加新地址
  removedataaddress:function(id){
    var adds = this.data.addresslist;
    for (var i = 0; i < adds.length;i++)
    {
      if(adds[i].id==id)
      {
        adds.splice(i,1);
        break;
      }
    }
    this.setData({
      addresslist:adds
    })
  }
})