// pages/getmoney/getmoney.js
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cashoutmoney:"",
    banklist:[],
    selectindex:-1,
    balnace:"0.00",
    mindrawals:"1"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getmindrawals();
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
    this.getcardlist();
    this.getbanlance();
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
  toaddcard:function(){
    wx.navigateTo({
      url: '/pages/amounttomoney/amounttomoney',
    })
  },
  tocardmanage:function(){
    wx.navigateTo({
      url: '/pages/cardmanage/cardmanage',
    })
  },
  putall:function(){
    this.setData({
      cashoutmoney: this.data.balance
    })
  },
  cashmoneyinput:function(e){
    this.setData({
      cashoutmoney:e.detail.value
    })
  },
  confirmcashout:function(){
    var price = this.data.cashoutmoney;
    var selectindex = this.data.selectindex;
    if(price==""||price==null)
    {
      wx.showToast({
        title: '请输入提现金额',
        icon:"none"
      })
      return false;
    }
    if (parseFloat(price) < parseFloat(this.data.mindrawals))
    {
      wx.showToast({
        title: '提现金额不得小于最低提现金额',
        icon: "none"
      })
      return false;
    }
    if(selectindex==-1)
    {
      wx.showToast({
        title: '请选择您的银行卡',
        icon: "none"
      })
      return false;
    }
    var bankId = this.data.banklist[selectindex].id;
    if(bankId==null)
    {
      wx.showToast({
        title: '请选择您的银行卡',
        icon: "none"
      })
      return false;
    }
    var data={
      price: price,
      bankId: bankId
    }
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    dayuanren.Tpost("wallet/withdrawals", data, accesstoken, function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        wx.showToast({
          title: res.errmsg,
          duration:1500,
          complete:function(){
            setTimeout(function(){
              wx.navigateTo({
                url: '/pages/cashout/cashout',
              })
            },1000)
          }
        })
      }else{
        wx.showToast({
          title: res.errmsg,
          icon:"none"
        })
      }
    })
  },
  cardselect:function(e){
    this.setData({
      selectindex: e.currentTarget.dataset.index
    })
  },
  getcardlist: function () {
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    dayuanren.Tget("wallet/bankList", "", accesstoken, function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        var data=res.data;
        for(var i=0;i<data.length;i++)
        {
          data[i].lastnum = data[i].bank_num.substr(data[i].bank_num.length-4,4);
        }
        _this.setData({
          banklist:data
        })
      }else{
        wx.showToast({
          title: '获取银行卡列表失败,请重试',
          icon:"none"
        })
      }
    })
  },
  getbanlance:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    dayuanren.Tget("wallet/getBalance","",accesstoken,function(res){
      wx.hideLoading();
      if(res.errno==0)
      {
        var data = res.data.balance;
        _this.setData({
          balance:data
        })
      }
    })
  },
  getmindrawals:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    dayuanren.ctget("wallet/minWithdrawals", "", accesstoken, function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        var data = res.data.minPrice;
        _this.setData({
          mindrawals: data
        })
      }
    })
  }
})