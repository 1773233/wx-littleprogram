// pages/invoicemanage/invoicemanage.js

var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoice:[],//发票列表
    applycould:false,//申请发票按钮是否启用
    totalmoney:0,//合计价钱
    selectall:false,//全选
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onShow: function () {
    this.getinvoicelist();
    this.setData({
      applycould:false,
      selectall:false,
      totalmoney:0
    })
  },
  getinvoicelist:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this=this;
    if(accesstoken)
    {
      wx.showLoading({
        title: '数据加载中',
      })
      dayuanren.Tget("user/billMoneyList","",accesstoken,function(res){
        wx.hideLoading();
        if(res.errno==0)
        {
          var orderdata = res.data;
          for (var i = 0; i < orderdata.length; i++) {
            orderdata[i].create_time = dayuanren.timestamptostr(orderdata[i].create_time);
            orderdata[i].select = false;
          }
          wx.hideLoading();
          _this.setData({
            invoice: orderdata
          })
        }else if(res.errno==1){
          _this.setData({
            invoice: []
          })
        }
      })
    }
  },
  invoiceselect:function(e){
    var id=e.currentTarget.dataset.value;
    var invoicedata=this.data.invoice;
    var selectcount=0;
    var active=false;
    var totalmoney=0;
    for (var i = 0; i < invoicedata.length; i++) {
      if (invoicedata[i].id==id)
      {
        invoicedata[i].select = !invoicedata[i].select;
      }
      if (invoicedata[i].select == true) {
        selectcount++;
        totalmoney += invoicedata[i].total_price;
      }
    }
    if(selectcount!=0){
      active=true;
    }
    if(selectcount==0)
    {
      this.setData({
        selectall:false
      })
    }
    if (selectcount == invoicedata.length)
    {
      this.setData({
        selectall: true
      })
    }
    totalmoney = parseFloat(totalmoney.toFixed(2));
    this.setData({
      invoice: invoicedata,
      applycould:active,
      totalmoney: totalmoney
    })
  },
  applynow:function(){
    if (this.data.applycould==false)
    {
      wx.showToast({
        title: '请选择您要申请发票的订单',
        icon:"none"
      })
      return false;
    }else{
      var ids="";
      var indata = this.data.invoice;
      for (var i = 0; i < indata.length;i++)
      {
        if (indata[i].select==true)
        {
          ids += indata[i].order_number+",";
        }
      }
      wx.navigateTo({
        url: '/pages/invoiceapply/invoiceapply?ids=' + ids + '&money=' + this.data.totalmoney,
      })
    }
  },
  selectall:function(){
    this.setData({
      selectall: !this.data.selectall
    })
    var selectcount = 0;
    var active=false;
    var invoicedata = this.data.invoice;
    var totalmoney = 0;
    for (var i = 0; i < invoicedata.length; i++) {
      invoicedata[i].select = this.data.selectall;
      if (invoicedata[i].select == true) {
        selectcount++;
        totalmoney += parseFloat(invoicedata[i].total_price.toFixed(2));
      }
    }
    if (selectcount != 0) {
      active = true;
    }
    this.setData({
      invoice: invoicedata,
      applycould: active,
      totalmoney: totalmoney
    })
  },
})