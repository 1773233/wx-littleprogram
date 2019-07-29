// pages/invoiceapply/invoiceapply.js

var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeselected: true,//发票类型，true为电子发票，false为纸质发票
    titletype: true,//发票抬头类型，true为个人，false为企业
    checkboxItems: [
      { name: '企业单位', value: '0', checked: false },
      { name: '个人/非企业单位', value: '1', checked: true }
    ],
    invoicemoney:0,
    selectinvoicecontent:-1,//选中的发票内容，默认为都不选
    invoicecontent:["服务费","派送费"],
    leastinvoicemoney:0,//最低发票申请金额
    billpostmoney:500,//小于这个就得付邮费
    invoiceorderids:null,//申请开发票的订单id，逗号隔开
    receiver:null,//收件人姓名
    address:null,//邮寄地址
    mobile:null,//联系电话
    taxnum:null,//税号
    email:null,//邮箱
    title:null,//发票抬头
    appling:false,//防止重复点击
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.ids)
    {
      var ids=options.ids;
      var money=options.money;
      ids=ids.slice(0,ids.length-1);
      this.setData({
        invoiceorderids:ids,
        invoicemoney:money
      })
      this.getleastinvoicemoney();
      this.getinvoicecontent();
    }else{
      wx.showToast({
        title: '未选择可开发票的订单',
        duration:1500,
        icon:"none",
        complete:function(){
          setTimeout(function(){
            wx.navigateBack({
              
            })
          },1000)
        }
      })
    }
  },
  onShow:function(){
    var key = 'tempinvoiceaddress';
    var tempinvoiceaddress = dayuanren.getStorage(key);
    if (tempinvoiceaddress != null) {

      // this.getdetailaddress(invoiceaddid);

      this.setData({
        receiver: tempinvoiceaddress.name,
        mobile: tempinvoiceaddress.mobile,
        address: tempinvoiceaddress.address + tempinvoiceaddress.address_info
      })
      wx.removeStorage({
        key: 'tempinvoiceaddress',
        success: function (res) {
        }
      })
    }
    if(this.data.appling==true)
    {
      this.setData({
        appling:false
      })
      wx.navigateBack({
        
      })
    }
  },
  checkboxChange: function (e) {
    if (e.detail.value==0)
    {
      this.setData({
        titletype:false
      })
    }else{
      this.setData({
        titletype: true
      })
    }
    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },//抬头类型选择处理
  typeselectchange:function(e){
      var ttype = e.currentTarget.dataset.type;
      var ss=true;
      if(ttype=="paper")
      {
          ss=false;
      }
      this.setData({
        typeselected: ss
      })
  },//发票类型选择处理
  invoicecontentchange:function(e){
    this.setData({
      selectinvoicecontent:e.detail.value
    })
  },//发票内容选择
  getleastinvoicemoney:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken)
    {
      dayuanren.Tget("user/getBillMinMoney","",accesstoken,function(res){
        if(res.errno==0)
        {
          _this.setData({
            leastinvoicemoney: res.data.billMinMoney,
            billpostmoney: res.data.billPostMoney
          })
        }
      })
    }
  },
  getinvoicecontent:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      dayuanren.Tget("user/getBillContent", "", accesstoken, function (res) {
        if (res.errno == 0) {
          var content=[];
          for (let i in res.data) {
            content.push(res.data[i]);
          }
          _this.setData({
            invoicecontent: content
          })
        }
      })
    }
  },
  applynow:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (parseFloat(this.data.invoicemoney) < parseFloat(this.data.leastinvoicemoney))
    {
      wx.showToast({
        title: '申请开发票的金额不得小于最少申请的金额',
        icon:"none"
      })
      setTimeout(function(){
        wx.navigateBack({
          
        })
      },2000);
      return false;
    }
    if (accesstoken) {
      var orderid = this.data.invoiceorderids;
      var name=this.data.receiver;
      var mobile=this.data.mobile;
      var address = this.data.address;
      var invoicetype = this.data.typeselected==true?1:2;
      var headtype = this.data.titletype == true ? 2 : 1;
      var taxnum = this.data.taxnum;
      if (this.data.selectinvoicecontent==-1)
      {
        wx.showToast({
          title: '请选择发票内容',
          icon:"none"
        })
        return false;
      }
      var content = this.data.invoicecontent[this.data.selectinvoicecontent];
      var email = this.data.email;
      var title=this.data.title;
      if (invoicetype==null)
      {
        wx.showToast({
          title: '请选择发票类型',
          icon: "none"
        })
        return false;
      }
      if (invoicetype==2)
      {
        if(address==null)
        {
          wx.showToast({
            title: '请选择收票地址',
            icon: "none"
          })
          return false;
        }
        
      }
      if(invoicetype==1)
      {
        if (email == null||email=="") {
          wx.showToast({
            title: '请填写收票人邮箱',
            icon: "none"
          })
          return false;
        }
        if (this.emailcheck(email)==false)
        {
          wx.showToast({
            title: '请填写正确的邮箱格式',
            icon: "none"
          })
          return false;
        }
      }
      if (headtype==null)
      {
        wx.showToast({
          title: '请选择抬头类型',
          icon: "none"
        })
        return false;
      }
      if (headtype == 1) {
        if (title==null||title=="")
        {
          wx.showToast({
            title: '请填写公司/单位名称',
            icon: "none"
          })
          return false;
        }
        if(taxnum==null||taxnum=="")
        {
          wx.showToast({
            title: '请填写税号',
            icon: "none"
          })
          return false;
        }
      }
      if (headtype == 2) {
        if (title == null||title=="") {
          wx.showToast({
            title: '请填写发票抬头',
            icon: "none"
          })
          return false;
        }
      }
      if (content==null)
      {
        wx.showToast({
          title: '请选择发票内容',
          icon: "none"
        })
        return false;
      }
      var passdata={
        order_number: orderid,
        type: invoicetype,
        head_type: headtype,
        content:content,
        title: title,
      };
      if(name!=null)
      {
        passdata.name=name;
      }
      if (mobile != null) {
        passdata.mobile = mobile;
      }
      if(address!=null)
      {
        passdata.address=address;
      }
      if(taxnum!=null)
      {
        passdata.tax_num=taxnum;
      }
      if (email!=null){
        passdata.email = email;
      }
      if (_this.data.appling==false)
      {
        _this.setData({
          appling:true
        })
      }else{
        return false;
      }
      dayuanren.Tpost("user/bill", passdata,accesstoken,function(res){
        if(res.errno==0)
        {
          wx.showToast({
            title: '提交成功',
            complete:function(){
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/invoicehistory/invoicehistory',
                })
              }, 2000)
            }
          })
        }else{
          wx.showToast({
            title: '提交失败',
            icon:"none"
          })
          _this.setData({
            appling: false
          })
        }
      })
    }
  },
  titleinput:function(e){
    this.setData({
      title:e.detail.value
    })
  },//发票抬头输入
  taxnuminput:function(e){
    this.setData({
      taxnum: e.detail.value
    })
  },//税号输入
  emailinput:function(e){
    this.setData({
      email: e.detail.value
    })
  },
  selectaddress:function(){
    wx.navigateTo({
      url: '/pages/addressselect/addressselect?invoice=1',
    })
  },//选择收货地址
  getdetailaddress: function (addid) {
    var adid = addid;
    var _this = this;
    app.getdetailaddress(adid, function (res) {
      _this.setData({
        receiver:res.data.name,
        mobile: res.data.mobile,
        address:res.data.address + res.data.address_info
      })
    })
  },//获取地址详情
  emailcheck:function(obj){
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    if (!reg.test(obj)) { //正则验证不通过，格式不对
      return false;
    } else {
      return true;
    }
  },//邮箱验证
})