// pages/cancelreson/cancelreson.js
const resons=[
  { id: 0, title: "暂时不需要邮寄了", select: true },
  { id: 1, title: "准备使用其他平台", select: false },
  { id: 2, title: "联系不上游侠", select: false },
  { id: 3, title: "和游侠协商好取消订单", select: false },
];
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resons:resons,
    content:"",
    ordernum:null,//订单号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getcancelreson();
    if(options.orderid)
    {
      this.setData({
        ordernum: options.orderid
      })
    }else{
      wx.navigateBack({
      })
    }
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
  resonselect:function(e){
    var id=e.currentTarget.id;
    var rs=this.data.resons;
    for (var i = 0; i < rs.length; i++) {
      rs[i].select = false;
    }
    for(var i=0;i<rs.length;i++)
    {
      if(rs[i].id==id)
      {
        rs[i].select=true;
        break;
      }
    }
    this.setData({
      resons:rs
    })
  },
  backtoorder:function(){
    wx.navigateBack({
      
    })
  },
  resoncontent:function(e){
    this.setData({
      content:e.detail.value
    })
  },
  submitreson:function(){
    wx.showLoading({
      title: '正在提交原因',
    })
    var rs=this.data.resons;
    var content="";
    for (var i = 0; i < rs.length;i++)
    {
      if(rs[i].select==true)
      {
        content=rs[i].title;
        break;
      }
    }
    if(this.data.content!="")
    {
      content+=","+this.data.content;
    }
    if (this.data.ordernum==null)
    {
      wx.showToast({
        title: '未选择订单',
        icon:"none"
      })
      return false;
    }
    var data = { order_number: this.data.ordernum, cancel_reason: content};
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    wx.showLoading({
      title: '原因提交中',
    })
    if (accesstoken) {
      dayuanren.Tpost("order/cancelReason", data, accesstoken, function (res) {     
        if(res.errno==0)
        {
          wx.hideLoading();
          wx.showToast({
            title: '提交成功',
            icon:"none",
            complete:function(){
              setTimeout(function(){
                wx.navigateBack({
                })
              },1500)
            }
          })
        }
      })
    }
  },
  getcancelreson:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    wx.showLoading({
      title: '数据加载中',
    })
    dayuanren.Tget("order/getCancelReason", "", accesstoken, function (res) { 
      wx.hideLoading();
      if(res.errno==0)
      {
        var resonlist=[];
        var index=0;
        for(let obj in res.data)
        {
          var select=false;
          if(index==0)
          {
            select = true;
          }
          var re = { id: index, title: res.data[obj], select: select };
          resonlist.push(re);
          index++;
        }
        _this.setData({
          resons: resonlist
        })
      }else{
        wx.showToast({
          title: res.errmsg,
          icon:"none"
        })
      }
    })
  }
})