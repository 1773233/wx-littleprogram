// pages/pricedetail/pricedetail.js
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapscale:14,//地图缩放等级
    longitude: "116.398773",
    latitude: "39.909210",
    mapCtx:null,
    slgt:null,
    slat: null,
    elgt: null,
    elat: null,
    moneydetail:null,//计价格明细类
    lichen:0,//里程距离
    morepirce:"0.00",//里程费
    markers:[],
    distance:0,
    gratutity:0,//小费
    dfmoney:0,//垫付费用
    yjpercent:0,//溢价比
    totalmoney:0,
    ticketprice:0,//优惠券
    includepoints:[],
    weight_key:"",
    datetype:"",
    hour: "",
    minute:"",
    weightprice:"",
    nightprice:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.mapCtx = wx.createMapContext('map');
    if(options.slgt)
    {
      this.setData({
        slgt:options.slgt,
        slat: options.slat,
        elgt: options.elgt,
        elat: options.elat,
        weight_key: options.weight_key,
        datetype: options.datetype,
        hour: options.hour,
        minute: options.minute
      })
      var stype = options.type;
      if(stype==null)
      {
        stype=1;
      }
      var img1 ="/images/ji.png";
      if(stype==2)
      {
        img1 = "/images/mai.png";
      }
      var marker = [{
        id: 0,
        iconPath: img1,
        latitude: options.slat,
        longitude: options.slgt,
        width: 24,
        height: 32
      }, 
      {
        id: 1,
        iconPath: '/images/shou.png',
        latitude: options.elat,
        longitude: options.elgt,
        width: 24,
        height: 32
      }]
      this.setData({
        markers:marker
      })
      this.showlocatmarkers();
      this.getmoneydetail();
    }
    if (options.gratutity)
    {
      this.setData({
        gratutity: parseFloat(options.gratutity)
      })
    }
    if (options.dfmoney)
    {
      this.setData({
        dfmoney: parseFloat(options.dfmoney)
      })
    }
    if (options.ticketprice)
    {
      this.setData({
        ticketprice: options.ticketprice
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
  topricerule:function(){
    wx.navigateTo({
      url: '/pages/pricerule/pricerule',
    })
  },
  showlocatmarkers:function(){
    var points = [{ latitude: this.data.slat, longitude: this.data.slgt }, { latitude: this.data.elat, longitude: this.data.elgt }];
    this.setData({
      includepoints:points
    })
  },
  getmoneydetail:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    wx.showLoading({
      title: '正在计算',
    })
    var data = { start_lat: this.data.slat, start_lon: this.data.slgt, end_lat: this.data.elat, end_lon: this.data.elgt, start_city: app.globalData.loccity, is_change: 1, weight_key: this.data.weight_key, datetype: this.data.datetype, hour: this.data.hour, minute: this.data.minute };
    if (accesstoken) {
      dayuanren.Tpost("order/getSet", data, accesstoken, function (res) {
        wx.hideLoading();
        if(res.errno==0)
        {
          var lichen=0;
          if (res.data.km > res.data.startKm)
          {
            lichen = parseFloat(res.data.km) - parseFloat(res.data.startKm);
          }
          lichen=lichen.toFixed(2);
          var lichenfei = parseFloat(lichen) * parseFloat(res.data.freightPrice);
          lichenfei = Math.ceil(lichenfei.toFixed(2));
          var yjb = parseInt(res.data.premium)/100-1;
          var zljj=parseFloat(res.data.weightPrice);
          var nightprice = parseFloat(res.data.nightPrice);
          var totalmoney = parseFloat(yjb * res.data.km) + parseFloat(_this.data.dfmoney) + parseFloat(_this.data.gratutity) + parseFloat(lichenfei) + parseFloat(res.data.startPrice) - parseFloat(_this.data.ticketprice) + zljj + nightprice;
          _this.setData({
            moneydetail:res.data,
            lichen:lichen,
            moreprice:lichenfei,
            yjpercent: yjb,
            totalmoney: parseFloat(totalmoney.toFixed(2)),
            weightprice: zljj,
            nightprice: nightprice,
          })
        }
      })
    }
  },//获取各种费用明细
})