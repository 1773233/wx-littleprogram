// pages/newscenter/newscenter.js
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sysmessagecount: 0,//系统消息列表
    ordermessagecount: 0,//订单消息列表
    syscreatime: null,//默认第一条消息时间
    ordercreatetime: null,//默认第一条消息时间
    sysmessagecontent: null,//默认第一条消息内容
    ordermessagecontent:null,//默认第一条消息内容
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
    this.getmessagelist();
  },
  getmessagelist:function(){
    wx.showLoading({
      title: '数据加载中',
    })
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken){
      dayuanren.Tget("message/messageList","",accesstoken,function(res){
        wx.hideLoading();
        if(res.errno==0)
        {
          var msgdata=res.data;
          if (msgdata.order_message!=""&&msgdata.order_message!=null)
          {
            _this.setData({
              ordermessagecount: msgdata.order_message_is_not_read,
              ordercreatetime: app.datetostr(msgdata.order_message.create_time, "HM"),
              ordermessagecontent: msgdata.order_message.content
            })
          }
          if (msgdata.sys_message!=""&&msgdata.sys_message!=null)
          {
            _this.setData({
              sysmessagecount: msgdata.sys_message_is_not_read,
              syscreatime: app.datetostr(msgdata.sys_message.create_time, "HM"),
              sysmessagecontent: msgdata.sys_message.content
            })
          }
        }
      })
    }
  },
  tosysmsglist:function(){
    wx.navigateTo({
      url: '/pages/newslist/newslist?type=0',
    })
  },
  toordermsglist:function(){
    wx.navigateTo({
      url: '/pages/newslist/newslist?type=1',
    })
  }

})