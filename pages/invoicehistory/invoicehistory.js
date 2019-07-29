// pages/invoicehistory/invoicehistory.js
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoice:[],//申请记录
    nowpage:1,//申请发票数据传给后台响应的页面，默认为1，第一页
    totalpage:1//总页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getinvoicelist();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  getinvoicelist:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '数据加载中',
      })
      dayuanren.Tget("user/billList?page=" + _this.data.nowpage, "", accesstoken, function (res) {
        wx.hideLoading();
        if(res.errno==0)
        {
          var newdata = _this.data.invoice;
          var resdata=res.data.data;
          for(var i=0;i<resdata.length;i++)
          {
            resdata[i].create_time = app.datetostr(resdata[i].create_time,"YMDHM");
            newdata.push(resdata[i]);
          }
          _this.setData({
            invoice: newdata,
            totalpage: res.data.totalPages
          })
        }
      })
    }
  },
  refreshinvoicelist:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '数据加载中',
      })
      dayuanren.Tget("user/billList?page=1", "", accesstoken, function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.errno == 0) {
          var newdata = [];
          var resdata = res.data.data;
          for (var i = 0; i < resdata.length; i++) {
            resdata[i].create_time = app.datetostr(resdata[i].create_time, "YMDHM");
            newdata.push(resdata[i]);
          }
          wx.hideLoading();
          _this.setData({
            invoice: newdata,
            totalpage: res.data.totalPages
          })
        }
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.nowpage+1<=this.data.totalpage)
    {
      this.setData({
        nowpage: this.data.nowpage + 1
      })
      this.getinvoicelist()
    }else{
      wx.showToast({
        title: '没有更多数据了',
        icon:"none"
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '正在刷新',
    })
    this.setData({
      nowpage:1
    })
    this.refreshinvoicelist();
  },
})