// pages/cardmanage/cardmanage.js
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deleteready:false,
    banklist:[],
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
    this.getcardlist();
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
  carddeleteready:function(){
    this.setData({
      deleteready: !this.data.deleteready
    })
  },
  cardselect:function(e){
    var index=e.currentTarget.dataset.index;
    var bl = this.data.banklist;
    bl[index].select = !bl[index].select;
    this.setData({
      banklist: bl
    })
  },
  toaddcard:function(){
    wx.navigateTo({
      url: '/pages/amounttomoney/amounttomoney',
    })
  },
  tocardedit:function(e){
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/amounttomoney/amounttomoney?cdid='+id,
    })
  },
  getcardlist:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    dayuanren.Tget("wallet/bankList", "", accesstoken, function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        var data = res.data;
        for (var i = 0; i < data.length; i++) {
          data[i].lastnum = data[i].bank_num.substr(data[i].bank_num.length - 4, 4);
          data[i].select=false;
        }
        _this.setData({
          banklist: data
        })
      } else {
        wx.showToast({
          title: '获取银行卡列表失败,请重试',
          icon: "none"
        })
      }
    })
  },
  deletecard:function(){
    var ids="";
    var bklist = this.data.banklist;
    for (var i = 0; i < bklist.length;i++)
    {
      if(bklist[i].select==true)
      {
        ids+=","+bklist[i].id;
      }
    }
    if(ids=="")
    {
      wx.showToast({
        title: '请选择银行卡',
        icon:"none"
      })
      return false;
    }
    ids = ids.slice(1, ids.length);
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    dayuanren.Tpost("wallet/delbank",{ids:ids}, accesstoken, function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        wx.showToast({
          title: '删除成功',
          icon:"none",
          complete:function(){
            _this.getcardlist();
          }
        })
      } else {
        wx.showToast({
          title: '删除银行卡失败,请重试',
          icon: "none"
        })
      }
    })
  }
})