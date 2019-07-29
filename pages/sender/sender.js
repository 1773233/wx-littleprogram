// pages/sender/sender.js

/*
  author:llg
  2018/7/13编写添加地址信息功能
*/
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      address:null,

      addressdetail:null,

      name:null,

      tel:null,

      province:null,

      city:null,

      country:null,

      addressid:null,//地址信息的id,新增地址时就没有

      longitude:null,

      latitude:null,

      backid:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.editid)
    {
      this.setData({
        addressid: options.editid
      })
      this.getaddressdetail(options.editid);
    }
    if (options.back) {
      this.setData({
        backid: options.back
      })
    }
  },
  toaddressselect: function () {
    var _this = this;
    wx.chooseLocation({
      success: function (res) {
        app.getlocationinfo(res.longitude, res.latitude, function (posres) {
          var p = posres.result.address_component.province;
          var c = posres.result.address_component.city;
          var y = posres.result.address_component.district;
          _this.setData({
            province: p,
            city: c,
            country: y
          })
        })//获取当前定位地址的街道信息并保存然后页面通过数据绑定来显示
        _this.setData({
          address: res.name,
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
    })
  },//跳转到地址选择页面
  addressinput:function(e){
    this.setData({
      addressdetail:e.detail.value
    })
  },//楼层详情输入
  nameinput:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  telinput:function(e){
    this.setData({
      tel: e.detail.value
    })
  },
  confirm:function(){
    var address = this.data.address;
    var addressdetail = this.data.addressdetail;
    var name = this.data.name;
    var tel=this.data.tel;
    if(address==null)
    {
      wx.showToast({
        title: '请选择地址',
        icon:"none"
      })
      return false;
    }
    if (this.data.province == null) {
      this.setData({
        province:""
      })
    }
    if (this.data.city  == null) {
      this.setData({
        city: ""
      })
    }
    if (this.data.country  == null) {
      this.setData({
        country: ""
      })
    }
    if (addressdetail==null||addressdetail=="")
    {
      wx.showToast({
        title: '请填写详细门牌信息',
        icon: "none"
      })
      return false;
    }
    if(name==null||name=="")
    {
      wx.showToast({
        title: '请填写名字',
        icon: "none"
      })
      return false;
    }
    if(tel==null||tel=="")
    {
      wx.showToast({
        title: '请填写电话号码',
        icon: "none"
      })
      return false;
    }
    if (this.validatemobile(tel)==false)
    {
      return false;
    }
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    var data={
      address:address,
      province:_this.data.province,
      city:_this.data.city,
      county:_this.data.country,
      name:name,
      mobile:tel,
      lon_lat:this.data.longitude+","+this.data.latitude,
      address_info:addressdetail,
      is_change:1
      };
    if (_this.data.addressid)
    {
      data.id=_this.data.addressid;
    }
    if (accesstoken) {
      wx.showLoading({
        title: '正在提交',
      })
      dayuanren.Tpost("user/addAddress",data , accesstoken,function(res){
        wx.hideLoading();
        if(res.errno==0)
        {
          var backid = _this.data.backid;
          var id=res.data.id;
          if(backid)
          {
            if (backid == 0) {
              dayuanren.setStorage("sendposid", id);
              dayuanren.setStorage("selectsendaddid", id);
            } else {            
              dayuanren.setStorage("receiveposid", id);
              dayuanren.setStorage("selectreceiveaddid", id);
            }
          }
          var msg ="操作成功";
          if (_this.data.addressid)
          {
            msg="地址修改成功";
          }
          else{
            msg = "新增地址成功";
          }
          wx.showToast({
            title: msg,
            icon:"none",
            complete:function(){
              setTimeout(function(){
                wx.navigateBack({
                })
              },1500)
            }
          })
        }else{
          wx.showToast({
            title: '操作失败',
            icon:"none"
          })
        }
      })
    }
  },
  getaddressdetail:function(id){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '正在获取信息',
      })
      dayuanren.Tget("user/addressInfo", { id: id, is_change: 1}, accesstoken, function (res) {
        wx.hideLoading();
        if(res.errno==0)
        {
          _this.setData({
            address: res.data.address,
            addressdetail: res.data.address_info,
            name: res.data.name,
            tel: res.data.mobile,
            province: res.data.province,
            city:res.data.city,
            country:res.data.county,
            longitude:res.data.lon_lat.split(',')[0],
            latitude: res.data.lon_lat.split(',')[1]
          })
        }else{
          wx.showToast({
            title: '信息获取失败',
            icon:"none"
          })
        }
      })
    }
  },
  validatemobile: function (mobile) {
    if (mobile.length == 0) {
      wx.showToast({
        title: '请输入手机号！',
        icon:"none"
      })
      return false;
    }
    if (mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: "none"
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: "none"
      })
      return false;
    }
    return true;
  }
})