// pages/amounttomoney/amounttomoney.js
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardtypelist: [],
    cardbanklist:[],
    selectcardtype:-1,
    name:"",
    cardnumber:"",
    cardid:null,
    getname:"",
    getcode:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.cdid)
    {
      var cardid = options.cdid;
      this.setData({
        cardid: cardid
      })
      this.getbankinfo(cardid);
    }
    this.getcardcode();
  },
  todetail:function(){
    wx.navigateTo({
      url: '/pages/cashout/cashout',
    })
  },//跳转到体现明细
  cardtypechange:function(e){
    var index=e.detail.value;
    this.setData({
      selectcardtype:index
    })
  },
  cardnumberinput:function(e){
    var value = e.detail.value;
    value = value.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    this.setData({
      cardnumber: value,
    })
  },
  nameinput:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  getcardcode:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    dayuanren.Tget("wallet/getBankCode", "", accesstoken, function (res) {
      if (res.errno == 0) {
        var bankdata=res.data;
        var tbanklist=[];
        var banklist=[];
        for(var i in bankdata)
        {
          var bank={code:i,name:bankdata[i]};
          tbanklist.push(bankdata[i]);
          banklist.push(bank);
        }
        _this.setData({
          cardtypelist: tbanklist,
          cardbanklist: banklist
        })
      }else{
        wx.showToast({
          title: '获取银行类型列表失败,请重试',
          icon:"none"
        })
      }
    })
  },
  getbankinfo:function(id){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    dayuanren.Tpost("wallet/infobank",{id:id}, accesstoken, function (res) {
      wx.hideLoading();
      if (res.errno == 0) {
        var bank_num = res.data.bank_num;
        var value = bank_num;
        var sth = "";
        value = value.replace(/\s/g, "");
        for (var i = 0; i < value.length; i++) {
          sth += value[i];
          if ((i + 1) % 4 == 0) {
            sth += " ";
          }
        }
        _this.setData({
          cardnumber: sth,
          name: res.data.holder,
          getname: res.data.bank_name,
          getcode: res.data.bank_code
        })
      } else {
        wx.showToast({
          title: '获取银行卡信息失败,请重试',
          icon: "none"
        })
      }
    })
  },
  confirm:function(){
    var name=this.data.name;
    var cardnumber=this.data.cardnumber;
    cardnumber = cardnumber.replace(/\s/g, "");
    var index = this.data.selectcardtype;
    if(name==null||name=="")
    {
      wx.showToast({
        title: '请输入持有人姓名',
        icon:"none"
      })
      return false;
    }
    if (cardnumber == null || cardnumber == "") {
      wx.showToast({
        title: '请输入银行卡号',
        icon: "none"
      })
      return false;
    }
    if (index == -1 && this.data.getname=="") {
      wx.showToast({
        title: '请选择银行类型',
        icon: "none"
      })
      return false;
    }
    var code, bankname;
    if (this.data.getname==""&&this.data.getcode=="")
    {
      code = this.data.cardbanklist[index].code;
      bankname = this.data.cardbanklist[index].name;
    }else{
      code = this.data.getcode;
      bankname = this.data.getname;
    }
    if(code==null||bankname==null)
    {
      wx.showToast({
        title: '请选择银行类型',
        icon: "none"
      })
      return false;
    }
    var data={
      bank_num: cardnumber,
      bank_name:bankname,
      bank_code:code,
      holder:name,
    }
    if (this.data.cardid!=null)
    {
      data.id=this.data.cardid;
    }
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    wx.showLoading({
      title: '正在提交',
    })
    dayuanren.Tpost("wallet/addbank",data,accesstoken,function(res){
      wx.hideLoading();
      if(res.errno==0)
      {
        wx.showToast({
          title: '操作成功',
          icon:"none",
          complete:function(){
            setTimeout(function(){
              wx.navigateBack({
              })
            },1500)
          }
        })
      }else{
        wx.showToast({
          title: '操作失败,请重试',
          icon: "none",
        })
      }
    })
  }
})