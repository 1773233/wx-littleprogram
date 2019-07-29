// pages/changepassword/changepassword.js

/*
  author:llg
  2018/7/12编写修改密码功能
  2018/7/12完成修改密码功能  未对输入的值进行前端校验
*/

var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      usertel:null,//用户手机号

      code: null,//验证码

      password: null,//密码

      setFocus:true,

      couldchange:false,//能否设置

      codemessage:"发送验证码",

      stage:1,//1为手机验证，2为修改密码

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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  getyzmcode:function(){
      var accesstoken = dayuanren.get_access_token();
      var _this = this;
      var tel = this.data.usertel;
      if(tel==null)
      {
        wx.showToast({
          title: '请输入您的手机号',
          icon:"none"
        })
        return false;
      }
      wx.showLoading({
        title: '验证码发送中',
      })
      if (accesstoken) {
        var userleavetel = dayuanren.get_userinfo().mobile;
        if (userleavetel != null && userleavetel!="")
        {
            if (userleavetel != tel) {
                wx.showToast({
                  title: '请输入您注册时的手机号',
                  icon: "none"
                })
                return false;
            }//确保用户输入的手机号码是注册时所用的手机号码

            dayuanren.dpost("login/sendSms", { mobile: tel }, function (res) {
                wx.hideLoading();
                if(res.errno==0)
                {
                  wx.showToast({
                    title: '验证码已发送',
                    icon: "none"
                  })
                  _this.resetgetcode();
                }
            })

        } else {//可能微信登录的用户没有手机号

          dayuanren.dpost("login/sendSms", { mobile: tel }, function (res) {
              wx.hideLoading();
              if (res.errno == 0) {
                wx.showToast({
                  title: '验证码已发送',
                  icon: "none"
                })
                _this.resetgetcode();
              }
          })

        }
      }
  },//获取验证码
  changepassword:function(){
    if (this.data.stage==1)
    {
      /*手机验证*/
      var tel = this.data.usertel;
      var code = this.data.code;
      if (tel == null||tel=="") {
        wx.showToast({
          title: '请输入手机号',
          icon: "none"
        })
        return false;
      }
      if (this.validatemobile(tel)==false)
      {
        return false;
      }
      if (code == null || code=="") {
        wx.showToast({
          title: '请输入验证码',
          icon: "none"
        })
        return false;
      }
      var accesstoken = dayuanren.get_access_token();
      var _this = this;
      wx.showLoading({
        title: '正在验证'
      })
      dayuanren.Tpost("user/judgeMobile",{code:code,mobile:tel}, accesstoken, function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          _this.setData({
            stage: 2
          })
        }else{
          wx.showToast({
            title: '验证失败,请重试',
            icon:"none"
          })
        }
      })
    }else if(this.data.stage==2)
    {
      /*密码修改*/
      if (this.data.couldchange==false)
      {
        wx.showToast({
          title: '密码长度不足',
          icon:"none"
        })
        return false;
      }
      var accesstoken = dayuanren.get_access_token();
      var _this = this;
      wx.showLoading({
        title: '修改中',
      })
      dayuanren.Tpost("user/setBalancePas", { password: this.data.password}, accesstoken,function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          wx.showToast({
            title: '密码修改成功',
            icon: 'success',
            complete: function () {
              setTimeout(function(){
                wx.navigateBack({
                })
              },1500)
            }
          })
        }else{
          wx.showToast({
            title: '密码修改失败,请重试',
            icon:"none"
          })
        }
      })
    }
  },//提交修改密码的信息以修改密码
  telinput:function(e){
    this.setData({
      usertel:e.detail.value
    })
  },
  yzminput:function(e){
    this.setData({
      code: e.detail.value
    })
  },
  passwordinput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  confirminput: function (e) {
    this.setData({
      confirmpwd: e.detail.value
    })
  },
  resetgetcode:function(){
    var time = 60;
    var _this=this;
    var times = setInterval(function () {
      if (time <= 0) {
        clearInterval(times);
        _this.setData({
          codemessage:"发送验证码"
        })
      } else {
        time = time - 1;
        var code_msg = '还剩' + time + '秒';
        _this.setData({
          codemessage: code_msg
        })
      }
    }, 1000)
  },//获取验证码后倒计时60s重新获取
  validatemobile: function (mobile) {
    mobile = mobile+"";
    if (mobile.length == 0) {
      wx.showToast({
        title: '请输入手机号！',
        icon: "none"
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
  },
  getsetFocus: function () {
    this.setData({ setFocus: true });
  },
  inputsetPwd: function (e) {
    this.setData({ password: e.detail.value });
    if (e.detail.value.length >= 6) {
      this.setData({
        couldchange:true
      })
    }
  },
})