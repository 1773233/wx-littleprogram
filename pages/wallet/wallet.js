// pages/wallet/wallet.js
const rechargetypes=[
  { id: 0, name: "微信支付", url: "/images/weixin.png", rechgetypeselected: true}
];
const rechargenumber = [
  { id: 0, value: "2", select: true },
  { id: 1, value: "5", select: false },
  { id: 2, value: "10", select: false },
  { id: 3, value: "15", select: false },
  { id: 4, value: "20", select: false },
  { id: 5, value: "50", select: false }
];
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:"0.00",
    rechargetypeselected:false,
    selectrechargetype:false,
    rechargetypes: rechargetypes,
    rechargenumber: rechargenumber,
    hidegratuityinput:true,//控制输入金额input是否显示
    rechargeamount:0,//临时充值金额
    recharging:false,//支付中
    minrechargeamount:5,//最低充值金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getbanlance();
  },
  onShow:function(){
    this.getrechargenumberlist();
  },
  invoiceapply:function(){
    wx.navigateTo({
      url: '/pages/invoicemanage/invoicemanage',
    })
  },//跳转到申请发票
  showmoneydetail:function(){
      wx.navigateTo({
        url: '/pages/moneydetail/moneydetail',
      })
  },
  showrechargepicker:function(){
    if (this.data.recharging == true)
    {
      wx.showToast({
        title: '支付正在进行中',
        icon:"none"
      })
      return false;
    }
    this.setData({
      selectrechargetype:true
    })
  },
  hidecustompicker:function(){
    var newrechargenumber = this.data.rechargenumber;
    for (var i = 0, lenI = newrechargenumber.length; i < lenI; ++i) {
      newrechargenumber[i].select = false;
    }
    if (this.data.rechargetypeselected==true)
    {
      this.setData({
        rechargenumber: newrechargenumber,
        rechargetypeselected: false,
        hidegratuityinput: true,
        rechargeamount:0
      })
    }else{
      this.setData({
        rechargenumber: newrechargenumber,
        selectrechargetype: false,
        hidegratuityinput: true,
        rechargeamount: 0
      })
    }
  },
  rechargetypeselected:function(e){
    var id=e.currentTarget.dataset.value;
    var newrechargetypes = this.data.rechargetypes;
    for (var i = 0, lenI = newrechargetypes.length; i < lenI; ++i) {
      newrechargetypes[i].rechgetypeselected = false;
    }
    for (var i = 0; i < newrechargetypes.length;i++)
    {
      if (newrechargetypes[i].id==id)
      {
        newrechargetypes[i].rechgetypeselected=true;
      }
    }
    this.setData({
      rechargetypes: newrechargetypes
    })
  },
  chooserechargeamount:function(){
    if (this.data.rechargeamount==0)
    {
      wx.showToast({
        title: '请选择充值金额',
        icon:"none"
      })
      return false;
    }
    if (parseFloat(this.data.rechargeamount) < parseFloat(this.data.minrechargeamount)) {
      wx.showToast({
        title: '最低充值' + this.data.minrechargeamount + "元",
        icon: "none"
      })
      return false;
    }
    var newrechargenumber = this.data.rechargenumber;
    for (var i = 0, lenI = newrechargenumber.length; i < lenI; ++i) {
      newrechargenumber[i].select = false;
    }
    this.setData({
      rechargetypeselected: true,
      rechargenumber: newrechargenumber,
      hidegratuityinput: true,
    })
  },//打开充值金额选择器
  rechargenumberselect:function(e){
    var id = e.currentTarget.dataset.value;
    var newrechargenumber = this.data.rechargenumber;
    var amount=0;
    for (var i = 0, lenI = newrechargenumber.length; i < lenI; ++i) {
      newrechargenumber[i].select = false;
    }
    for (var i = 0; i < newrechargenumber.length; i++) {
      if (newrechargenumber[i].id == id) {
        newrechargenumber[i].select = true;
        amount = newrechargenumber[i].value;
      }
    }
    this.setData({
      rechargeamount: parseFloat(amount),
      rechargenumber:newrechargenumber,
      hidegratuityinput: true
    })
  },//充值金额选择
  activerechargenumberinput:function(){
      var newrechargenumber = this.data.rechargenumber;
      for (var i = 0, lenI = newrechargenumber.length; i < lenI; ++i) {
        newrechargenumber[i].select = false;
      }
      this.setData({
        rechargenumber: newrechargenumber,
        hidegratuityinput:false
      })
  },//显示充值输入框
  rechargenumberinput:function(e){
    var money = e.detail.value.trim();
    this.setData({
      rechargeamount: money
    })
  },//自定义输入充值金额
  togetmoney:function(){
    wx.navigateTo({
      url: '/pages/getmoney/getmoney',
    })
  },
  paynow:function(){
    if(this.data.recharging==false)
    {
      this.setData({
        recharging: true
      })
    }else{
      return false;
    }
    this.setData({
      selectrechargetype: false
    })
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '正在支付中',
      })
      dayuanren.Tpost("wallet/recharge", { price: _this.data.rechargeamount}, accesstoken, function (tres) {
        if (tres.errno == 0) {
          var oid = tres.data;
          dayuanren.Tpost("order/wxappletpay", { orderId: oid,type:2}, accesstoken, function (res) {
            wx.hideLoading();
            _this.setData({
              recharging: false
            })
            if (res.errno == 0) {
              _this.wxpay(res.data);
            } else {
              wx.showToast({
                title: '发起支付失败',
                icon: "none",
                duration: 2500,
                complete:function(){
                  _this.setData({
                    recharging: false,
                    rechargetypeselected: false,
                    selectrechargetype: false,
                    hidegratuityinput: true,
                    rechargeamount: 0,
                  })
                }
              })
            }
          })
        }else{
          wx.hideLoading();
          wx.showToast({
            title: '充值失败',
            icon: "none",
            duration: 2500,
            complete:function(){
              _this.setData({
                recharging: false,
                rechargetypeselected: false,
                selectrechargetype: false,
                hidegratuityinput: true,
                rechargeamount: 0,
              })
            }
          })
        }
      })
    }
  },//立即支付
  getbanlance: function () {
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '数据加载中',
      })
      dayuanren.Tpost("wallet/getBalance", "", accesstoken, function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          _this.setData({
            money: res.data.balance
          })
        }else{
          wx.showToast({
            title: '获取余额信息失败',
            icon:"none"
          })
        }
      })
    }
  },//获取账户余额
  getrechargenumberlist: function () {
    var _this = this;
    dayuanren.cget("login/rechargeList", "", function (res) {
      if (res.errno == 0) {
        var gdata = res.data;
        var arrdata = [];
        var index = 0;
        var minrechargeamount=0;
        for (let i in gdata) {
          if(index==0)
          {
            minrechargeamount = gdata[i];
          }
          if (parseFloat(gdata[i]) < minrechargeamount)
          {
            minrechargeamount = gdata[i];
          }
          var arr = { id: index, value: gdata[i]};
          index++;
          arrdata.push(arr);
        }
        _this.setData({
          rechargenumber: arrdata,
          minrechargeamount: minrechargeamount
        })
      }
    })
  },//获取充值列表
  wxpay:function(data){
    var _this=this;
    wx.requestPayment({
      'timeStamp': data.timeStamp,
      'nonceStr': data.nonceStr,
      'package': data.package,
      'signType': 'MD5',
      'paySign': data.paySign,
      'success': function (res) {
          setTimeout(function () {
            wx.showToast({
              title: '充值成功',
              icon: "success",
              duration: 2500,
              complete: function () {
                _this.setData({
                  money: parseFloat(_this.data.money) + parseFloat(_this.data.rechargeamount),
                  rechargetypeselected: false,
                  selectrechargetype: false,
                  hidegratuityinput: true,
                  rechargeamount: 0,
                })
              }
            })
          },500)
      },
      'fail': function (res) {
        setTimeout(function () {
          wx.showToast({
            title: '支付已取消',
            icon: "none",
            duration: 1500,
            complete: function () {
              _this.setData({
                recharging: false,
                rechargetypeselected: false,
                selectrechargetype: false,
                hidegratuityinput: true,
                rechargeamount: 0,
              })
            }
          })
        }, 500)
      }
    })
  }
})