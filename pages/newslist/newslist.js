// pages/newslist/newslist.js

var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messagetype:0,//消息类型，0默认为系统消息，1为订单消息
    newslist:[],//消息列表
    nowpage:1,//当前页
    totalpage:1,//总页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type)
    {
      this.setData({
        messagetype: options.type
      })
      this.getmessagelist(options.type);
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
    if (this.data.newslist.length!=0)
    {
      this.setData({
        nowpage: 1,
        newslist:[]
      })
      this.getmessagelist(this.data.messagetype);
    }
  },
  onReachBottom: function () {
    if (this.data.nowpage + 1 <= this.data.totalpage) {
      this.setData({
        nowpage: this.data.nowpage + 1
      })
      this.getmessagelist();
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: "none"
      })
    }
  },
  getmessagelist: function (typeid) {
    wx.showLoading({
      title: '数据加载中',
    })
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    var newslist = this.data.newslist;
    if (accesstoken) {
      if (typeid==0)
      {
        wx.setNavigationBarTitle({
          title: '系统消息',
        })
        dayuanren.Tget("message/sysMessageList?page="+_this.data.nowpage, "", accesstoken, function (res) {
          wx.hideLoading();
          if (res.errno == 0) {
            var news=res.data.data;
            for (var i = 0; i < news.length;i++)
            {
              news[i].create_time = app.datetostr(news[i].create_time,"YMDHM");
              newslist.push(news[i]);
            }
            _this.setData({
              newslist: newslist,
              totalpage: res.data.totalPages
            })
          }
        })
      }else{
        wx.setNavigationBarTitle({
          title: '订单消息',
        })
        dayuanren.Tget("message/orderMessageList?page=" + _this.data.nowpage, "", accesstoken, function (res) {
          wx.hideLoading();
          if (res.errno == 0) {
            var news = res.data.data;
            for (var i = 0; i < news.length; i++) {
              news[i].create_time = app.datetostr(news[i].create_time,"YMDHM");
              newslist.push(news[i]);
            }
            _this.setData({
              newslist: newslist,
              totalpage: res.data.totalPages
            })
          }
        })
      }
    }
  },
  getnewsdetail:function(e){
    var id=e.currentTarget.id;
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      if (this.data.messagetype==0)
      {
        dayuanren.Tget("message/sysMessageInfo", { id: id }, accesstoken, function (res) {
          if (res.errno == 0) {
          }
        })
      }else{
        dayuanren.Tget("message/orderMessageInfo", { id: id }, accesstoken, function (res) {
          if (res.errno == 0) {
          }
        })
      }
    }
  },
  pagejump:function(e){
    if (this.data.messagetype==1)
    {
      var rid = e.currentTarget.dataset.rid;
      var ordernum = e.currentTarget.dataset.ordernum;
      var dotype = e.currentTarget.dataset.dotype;
      var ifdel = e.currentTarget.dataset.ifdel;
      if (ifdel == 1) {
        wx.showToast({
          title: '该订单已删除',
          icon: "none"
        })
        return false;
      }
      if (dotype == 1) {
        if (rid != null && rid != "" && rid != 0) {
          wx.navigateTo({
            url: '/pages/comment/comment?ordernum=' + ordernum + "&orderid=" + rid,
          })
        }
      } else {
        if (rid != null && rid != "" && rid != 0) {
          wx.navigateTo({
            url: '/pages/orderdetail/orderdetail?id=' + rid,
          })
        }
      }
    }else{
      var did = e.currentTarget.dataset.doid;
      wx.navigateTo({
        url: '/pages/webpage/webpage?id=' + did,
      })
    }
  }
})