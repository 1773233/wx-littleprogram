// pages/getuserinfo/getuserinfo.js
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:null,//用户登录后返回的code
    lat:null,//用户经纬度
    lgt: null,//用户经纬度
    hasuserinfo:false,
    tipmessage:"您即将授权并登录518快运小程序",
    userinfo:null,
    isgeting:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fakelogin();
    this.getposinfo();
  },
  getposinfo: function () {
    var _this = this;
    wx.showToast({
      title: '正在获取您的位置信息',
      icon: "none"
    })
    app.getLocationposInfo(function (res) {
      wx.hideLoading();
      var lat = res.latitude;
      var lgt = res.longitude;
      _this.setData({
        lat: lat,
        lgt: lgt
      })
    })
  },
  getPhoneNumber: function (e) {
    if (this.data.isgeting == false) {
      this.setData({
        isgeting: true
      })
    } else {
      return false;
    }
    this.fakelogin();
    var encryptedData = e.detail.encryptedData;
    var iv = e.detail.iv;
    var data = { code: this.data.code, encryptedData: encryptedData, iv: iv };
    var _this = this;
    wx.showLoading({
      title: '处理中',
      icon: "none"
    })
    wx.request({
      url: dayuanren.apiurl + "login/decrypt", //仅为示例，并非真实的接口地址
      data: data,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.errno == 0) {
          var mobilenumber = res.data.data.purePhoneNumber;
          _this.reallogin(mobilenumber);
          //处理成功
        } else {
          wx.showToast({
            title: '处理失败' + res.data.errmsg,
            icon: "none"
          })
          _this.setData({
            isgeting: false
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        _this.setData({
          isgeting: false
        })
        wx.showToast({
          title: '网络连接异常',
          icon: "none"
        })
      }
    })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    var uinfo = e.detail.userInfo;
    if (uinfo == null) {
      wx.showToast({
        title: '获取用户信息失败',
        icon: "none"
      })
      return false;
    } else {
      wx.showToast({
        title: '授权成功',
        icon: "none"
      })
    }
    this.setData({
      userinfo: uinfo,
      hasuserinfo: true,
      tipmessage: "您即将授权518快运小程序绑定您的手机号"
    })
  },
  reallogin: function (tel) {
    var uinfo = this.data.userinfo;
    var data = { code: this.data.code, nickName: uinfo.nickName, mobile: tel, avatarUrl: uinfo.avatarUrl };
    if (this.data.lat != null) {
      data.lat = this.data.lat;
      data.lon = this.data.lgt;
    }
    var _this = this;
    wx.showLoading({
      title: '正在登录',
      icon: "none"
    })
    wx.request({
      url: dayuanren.apiurl + "login/wxxLogin",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: data,
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode==200)
        {
          if (res.data.errno == 0) {
            //成功后的执行
            dayuanren.save_userinfo(res.data.data.userinfo);
            dayuanren.save_access_token(res.data.data.token);
            wx.showToast({
              title: '登录成功',
              icon: "none",
              complete: function () {
                setTimeout(function(){
                  wx.navigateBack({
                  })
                },1500)
              }
            })
          }else{
            wx.showToast({
              title: '登录失败' + res.data.errmsg,
              icon: "none"
            })
            _this.setData({
              isgeting: false
            })
          } 
        }else{
          wx.showToast({
            title: '登录失败' + res.errmsg,
            icon: "none"
          })
          _this.setData({
            isgeting: false
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        _this.setData({
          isgeting: false
        })
        wx.showToast({
          title: '网络异常',
          icon: "none"
        })
      }
    })
  },
  fakelogin:function(){
    var _this=this;
    wx.login({
      success: res => {
        // 获取res.code，发送到后台换取 openId, sessionKey, unionId
        if (res.code) {
          _this.setData({
            code: res.code
          })
        } else {
          wx.showToast({
            title: '微信验证失败',
            icon: "none"
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常',
          icon: "none"
        })
      }
    }) 
  }
})