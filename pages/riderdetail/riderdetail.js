// pages/riderdetail/riderdetail.js

var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rider:null,//游侠信息
    comments:[],//评价
    getmore:false,//是否获取了所有评价
    riderid:null,//游侠id
    nowpage:1,//所以评论的当前页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id)
    {
      this.getriderdetail(options.id);
      this.setData({
        riderid:options.id
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
  getallcomment:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '数据加载中',
      })
      dayuanren.Tpost("user/rangerEvaList?page=" + _this.data.nowpage, { ranger_id: _this.data.riderid}, accesstoken, function (res) {
        wx.hideLoading();
        if(res.errno==0)
        {
          var comments=res.data.data;
          for (var i = 0; i < comments.length; i++) {
            comments[i].create_time = app.datetostr(comments[i].create_time, "YMDHM");
            if (comments[i].imgpath != null && comments[i].imgpath != "") {
              comments[i].commentimgs = comments[i].imgpath.split(",");
            }
          }
          _this.setData({
            getmore: true,
            comments: comments
          })
        }
      })
    }
  },
  getriderdetail:function(id){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '数据加载中',
      })
      dayuanren.ctget("user/rangerInfo", { ranger_id: id }, accesstoken, function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          var comments = res.data.comment;
          for(var i=0;i<comments.length;i++)
          {
            if(comments[i].create_time!=""&&comments[i].create_time!=null)
            {
              comments[i].create_time = app.datetostr(comments[i].create_time,"YMDHM");
            }
            if (comments[i].imgpath != null && comments[i].imgpath !="")
            {
              comments[i].commentimgs = comments[i].imgpath.split(",");
            }
          }
          _this.setData({
            rider:res.data.ranger,
            comments: comments
          })
        }else{
          wx.showToast({
            title: '未找到该游侠信息',
            icon: "none",
            complete: function () {
              setTimeout(function () {
                wx.navigateBack({
                })
              }, 1500)
            }
          })
        }
      })
    }
  },
  makecall:function(){
    var _this=this;
    wx.makePhoneCall({
      phoneNumber: _this.data.rider.mobile,
      success: function(res) {},
    })
  },
  previewimg: function (e) {
    var img = e.currentTarget.dataset.value;
    var allimg = e.currentTarget.dataset.allvalue
    var _this = this;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: allimg // 需要预览的图片http链接列表
    })
  }
})