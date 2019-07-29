// pages/share/share.js
const shareitems=[
];
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showcustompicker:false,
    shareitems: shareitems,
    invitation_code:null,
    shareurl:null,
    shareridertitle:"518游侠",
    shareridertext:"分享即可获得奖励金",
    shareusertitle: "518快运",
    shareusertext: "分享即可获得奖励金",
    shareimg:"",
    qrcoderider:null,
    qrcodeuser:null,
    money:0,//分享后所得金钱
    totalmoney:0,//总共分享所得金额
    hide:true,//页面刚加载时隐藏，延迟500ms后显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    setTimeout(function(){
      _this.setData({
        hide:false
      })
    },500);
    var uinfo = dayuanren.get_userinfo();
    var qrcode1 = uinfo.qrcode;
    var qrcode2 = uinfo.qrcode_ranger;
    var endindex1=qrcode1.split('src="')[1].indexOf('"');
    var endindex2 = qrcode2.split('src="')[1].indexOf('"');
    qrcode1 = qrcode1.split('src="')[1].slice(0, endindex1);
    qrcode2 = qrcode2.split('src="')[1].slice(0, endindex2);
    this.setData({
      invitation_code: uinfo.invitation_code,
      qrcoderider: qrcode2,
      qrcodeuser:qrcode1
    })
    this.getsharedetail();
    this.getsharemoney();
  },
  toshareprize:function(){
      wx.navigateTo({
        url: '/pages/shareprize/shareprize',
      })
  },
  moreinvite:function(){
      
  },
  hidecustompicker:function(){
      
  },
  torule:function(){
    wx.navigateTo({
      url: '/pages/sharerule/sharerule',
    })
  },//跳转到规则
  /**
   * 分享
   */
  onShareAppMessage: function (res) {
    var _this = this;
    if (res.from === 'button') {
      var id = res.target.id;
      var pathurl = "";
      if (id == "torider") {
        if (this.data.shareurl == null) {
          wx.showToast({
            title: '获取分享信息失败,请刷新页面重试',
            icon: "none"
          })
          return false;
        }
        pathurl = '/pages/sharecallback/sharecallback?url=index/shareranger.html&fcode=' + _this.data.invitation_code + '&type=2';
        return {
          title: _this.data.shareridertitle,
          desc: _this.data.shareridertext,
          path: pathurl,
          // imageUrl: _this.data.shareimg,
          success: (res) => {
          },
          fail: (res) => {
          }
        }
      } else {
        pathurl = '/pages/index/index?fcode=' + _this.data.invitation_code + '&type=1';
        return {
          title: _this.data.shareusertitle,
          desc: _this.data.shareusertext,
          path: pathurl,
          imageUrl:'http://qiniu.cdpaotui.com/1536285188.jpg',
          success: (res) => {
          },
          fail: (res) => {
          }
        }
      }
    }
  },
  getsharedetail:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    dayuanren.Tget("user/shareConfig","", accesstoken, function (res) {
      if(res.errno==0)
      {
        _this.setData({
          shareridertitle: res.data.config.ranger_title,
          shareridertext: res.data.config.ranger_description,
          shareusertitle: res.data.config.title,
          shareusertext: res.data.config.description,
          shareurl:res.data.url,
          shareimg:res.data.img,
          money:res.data.config.money
        })
      }else{
        wx.showToast({
          title: '获取分享配置失败',
          icon:"none"
        })
      }
    })
  },
  getsharemoney:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    dayuanren.Tget("user/mineShareMoney", "", accesstoken, function (res) {
      if (res.errno == 0) {
        _this.setData({
          totalmoney:res.data
        })
      }
    })
  }
})