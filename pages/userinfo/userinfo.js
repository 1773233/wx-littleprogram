// pages/userinfo/userinfo.js

/*
  author:llg
  2018/7/12编写用户个人信息页面功能
  2018/7/12编写完用户个人信息页面功能
*/


var dayuanren = require('../../utils/dayuanren.js');
const app = getApp()
Page({

  data: {
    userinfo: { avatar:"/images/himg.png",name:"五一八快运",tel:""},//未能成功获取用户信息后默认显示的信息
    startchangename:false,//控制修改昵称的输入框显示与隐藏
    newusername: null,//储存新的昵称
    identitystatus:0,//默认为未认证
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userinforender();
  },
  onShow:function(){
  },
  userinforender: function () {
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '数据加载中',
      })
      app.refreshuserinfo(function(uinfo){
        wx.hideLoading();
        var info = { avatar: uinfo.data.headimg, name: uinfo.data.username, tel: uinfo.data.mobile };
        _this.setData({
          userinfo: info,
          identitystatus: uinfo.data.real_status
        })
      })
    } else {
      //app。js内获取失败的处理
    }
  },//获取用户信息的函数
  changeusername:function(){
    this.setData({
      startchangename:true
    })
  },//点击昵称切换出输入框
  usernameinput:function(e){
    this.setData({
      newusername:e.detail.value
    })
  },//保存输入的新昵称
  usernamechanged: function (e) {
    var newuser = this.data.userinfo;
    if(e.detail.value=="")
    {
      this.setData({
        startchangename:false
      })
      return false;
    }
    newuser.name = e.detail.value;
    this.setData({
      newusername: e.detail.value,
      userinfo: newuser
    })
  },//昵称输入完毕
  changepassword: function () {
    wx.navigateTo({
      url: '/pages/changepassword/changepassword',
    })
  },//跳转到修改密码页面
  torealname: function () {
    wx.navigateTo({
      url: '/pages/realname/realname',
    })
  },//跳转到实名认证页面
  savechange:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this=this;
    if(this.data.newusername)
    {
      wx.showLoading({
        title: '正在修改',
      })
      dayuanren.Tpost("user/upName", { username: this.data.newusername }, accesstoken,function(res){
        wx.hideLoading();
        if (res.errno==0)
        {
          wx.showToast({
            title: '昵称修改成功',
            icon:"none"
          })
          var userinfo = dayuanren.get_userinfo();
          userinfo.username=_this.data.newusername;
          dayuanren.save_userinfo(userinfo);
          _this.setData({
            startchangename:false,
          })
        }else{
          wx.showToast({
            title: '操作失败',
            icon: "none"
          })
        }
      })
    }
  },//保存修改
})