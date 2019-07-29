// pages/placeorder/placeorder.js
const goodstype = [
];
var hours = [];
var minuts = [];
var date = new Date();
var mt = date.getMinutes();
var nowh = date.getHours();
for (let i = nowh; i <= 23; i++) {
  hours.push(i)
}
for (let i = mt; i <= 59; i++) {
  minuts.push(i)
}
const fixhours=[];
const fixminuts=[];
for (let i = 0; i <= 23; i++) {
  fixhours.push(i)
}
for (let i = 0; i <= 59; i++) {
  fixminuts.push(i)
}
const gratuities = [
  { id: 0, value: 2 },
  { id: 1, value: 5 },
  { id: 2, value: 10 },
  { id: 3, value: 15 },
  { id: 4, value: 20 },
  { id: 5, value: 50 }
];
const rechargetypes = [
  { id: 0, name: "账户余额支付", url: "/images/m.png" },
  { id: 1, name: "微信支付", url: "/images/weixin.png", rechgetypeselected: true}
];
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({
  data: {
      goodstypes: goodstype,//送货的图标信息集合

      orderactive: false,//控制下单按钮可用与否的开关

      ordersubmited:false,//防止用户连续点击下单

      paysubmited:false,//防止用户连续点击支付

      totalmoney: 0,//总价

      days: ["今天", "明天","后天"],//送货时间选择器中的送货日

      hours: hours,//送货时间选择器中的送货时

      minuts: fixminuts,//送货时间选择器中的送货分

      gratuities: gratuities,//小费的数额定义

      showcustompicker: false,//控制送货时间选择器显示与隐藏

      hidegratuityinput: true,//控制小费输入框的隐藏与显示

      sendPosinfoSwitch:false,//控制寄出地址提示信息与地址详情显示与隐藏的开关

      receivePosinfoSwitch: false,//控制送达地址提示与地址详情切换的开关

      selectrechargetype: false,

      rechargetypes: rechargetypes,

      timepickervalue: [0, 1, 0],//默认选中发货时间选择器中的每一列的第一项

      sendtime: "立即",//发货时间

      weightindex:-1,//物品重量

      weightlist:[],//物品重量列表

      Sensitivewords:[],//敏感词汇

      gratuity: 0,//小费

      selectgratuity:0,//选中的小费

      selectedGratuityindex: 99,//被选中的小费样式控制

      pickertype: "time",//自定义选择器类别

      fromaddress:"请选择寄出地址",//寄出地址

      sendtoaddress:"送去哪儿",//送达地址

      selectedSendPosinfo:null,//已选中的寄出地址信息或购买地址

      selectedreceivePosinfo: null,//已选中的送达地址

      selectedservicetype:1,//默认的服务类型,帮我送，2帮我买

      ticketid:null,//选中的优惠券id

      ticketprice:0,//选中的优惠券价格

      leavemessage:'',//备注

      needmessage:null,//需求留言

      goodsprice:0,//垫付费用

      ordernumber:null,//临时保存的订单号，方便取消支付时删除订单

      banlance:0,//余额

      discounttip:"请选择优惠券",//优惠券选择的提示信息,没有可用优惠券时变成没有可用优惠券

      canIjump:true,
    
      pricedetail:"费用明细",
      
      errrmsg:"请填写完相关信息再下单",

      orderid:null,//下的订单的id

      formIdString:"",//forimid字符串

      formId:'',

      showPayPwdInput: false,  //是否展示密码输入层

      pwdVal: '',  //输入的密码

      payFocus: true, //文本框焦点

      showSetPwdInput:false,

      setpwdVal:'',//设置密码

      setFocus:true,//设置密码的焦点

      sendifcall:1,

      receiveifcall:1,

      pwderr:false,

      pwdlocked:false,

      pwderrmsg:''
  },
  onLoad: function (options) {
    if (options.servicetypeid)
    {
      this.clearpagestorage();
      this.setData({
        selectedservicetype: options.servicetypeid
      })
      if (options.servicetypeid==1)
      {
        wx.setNavigationBarTitle({
          title: '帮我送'
        })
      }else{
        wx.setNavigationBarTitle({
          title: '帮我买'
        })
        this.setData({
          fromaddress:"请选择购买地址"
        })
      }
      //帮我送帮我买的判断
    }
    this.getdetailservicetype();//获取服务详情类型列表
    this.getbanlance();//获取余额，显示在付款的余额付款那里
    this.getgratutitylist();//获取小费列表
  },
  onShow:function(){
    var key1 = 'sendposid';
    var key2 ='receiveposid';
    var key3 = 'ticketid';
    var key4 = 'ticketprice';
    var key5 ='buyaddress';
    var key6 = 'tempsendaddress';
    var key7 ='tempreceiveaddress';
    var key8 = 'sendifcall';
    var key9 = 'receiveifcall';

    var sendposid = dayuanren.getStorage(key1);//选中的已保存的发货地址id
    var receiveposid = dayuanren.getStorage(key2);//选中的已保存的收货地址id
    var ticketid = dayuanren.getStorage(key3);//选中的优惠券id
    var ticketprice = dayuanren.getStorage(key4);//选中的优惠券价格
    var buyaddress = dayuanren.getStorage(key5);//选中的购买地址
    var tempsendaddress = dayuanren.getStorage(key6);//选中的未保存发货地址
    var tempreceiveaddress = dayuanren.getStorage(key7);//选中的未保存收获地址
    var sendifcall = dayuanren.getStorage(key8);//选中的发货人电话是否可拨打
    var receiveifcall = dayuanren.getStorage(key9);//选中的收货人电话是否可拨打

    if (sendposid!=null)
    {
      if (sendifcall!=null)
      {
        this.setData({
          sendifcall: sendifcall == "call" ? 1 : 0
        })
      }
      wx.removeStorageSync('sendposid');
      wx.removeStorageSync('ticketid');
      wx.removeStorageSync('ticketprice');
      this.getdetailaddress(0, sendposid);
    }
    if (receiveposid != null) {
      if (receiveifcall != null) {
        this.setData({
          receiveifcall: receiveifcall=="call"?1:0
        })
      }
      wx.removeStorageSync('receiveposid');
      wx.removeStorageSync('ticketid');
      wx.removeStorageSync('ticketprice');
      this.getdetailaddress(1, receiveposid);
    }
    if (tempsendaddress!=null)
    {
      if (sendifcall != null) {
        this.setData({
          sendifcall: sendifcall == "call" ? 1 : 0
        })
      }
      var lgt = tempsendaddress.lon_lat.split(",")[0];
      var lat = tempsendaddress.lon_lat.split(",")[1];
      var adinfo = { province: tempsendaddress.province, city: tempsendaddress.city, country: tempsendaddress.county, address: tempsendaddress.address, sender: tempsendaddress.name, floor: tempsendaddress.address_info, tel: tempsendaddress.mobile, longitude: lgt, latitude: lat };
      this.setData({
        selectedSendPosinfo: adinfo,
        sendPosinfoSwitch: true
      })
      this.getorderdiscount();
      this.runpricecaculate();
      this.valuecheck();
    }
    if (tempreceiveaddress != null) {
      if (receiveifcall != null) {
        this.setData({
          receiveifcall: receiveifcall == "call" ? 1 : 0
        })
      }
      var lgt = tempreceiveaddress.lon_lat.split(",")[0];
      var lat = tempreceiveaddress.lon_lat.split(",")[1];
      var adinfo = { province: tempreceiveaddress.province, city: tempreceiveaddress.city, country: tempreceiveaddress.county, address: tempreceiveaddress.address, sender: tempreceiveaddress.name, floor: tempreceiveaddress.address_info, tel: tempreceiveaddress.mobile, longitude: lgt, latitude: lat };
      this.setData({
        selectedreceivePosinfo: adinfo,
        receivePosinfoSwitch: true
      })
      this.getorderdiscount();
      this.runpricecaculate();
      this.valuecheck();
    }
    if (ticketid!=null)
    {
      this.setData({
        ticketid: ticketid
      })
    }
    if (ticketprice != null) {
      var oldticketprice = this.data.ticketprice;
      var totalm = parseFloat(this.data.totalmoney);
      totalm += parseFloat(oldticketprice);
      totalm-=parseFloat(ticketprice);
      this.setData({
        ticketprice: ticketprice,
        totalmoney: totalm.toFixed(2)
      })
    }else{
      var oldticketprice = this.data.ticketprice;
      if (oldticketprice != 0 && this.data.ticketid!=null) {
        var totalm = parseFloat(this.data.totalmoney);
        totalm += parseFloat(oldticketprice);
        this.setData({
          ticketprice: 0,
          ticketid: null,
          discounttip: "请选择优惠券",
          totalmoney: totalm.toFixed(2)
        })
      }
    }
    if (buyaddress!=null)
    {
      wx.removeStorageSync('buyaddress');
      var sendposinfo = { province: buyaddress.province, city: buyaddress.city, country: buyaddress.country,address: buyaddress.address, sender: null, floor: buyaddress.addressinfo, tel: null,longitude:buyaddress.longitude,latitude:buyaddress.latitude};
      this.setData({
        selectedSendPosinfo:sendposinfo,
        sendPosinfoSwitch: true
      })
      this.getorderdiscount();
      this.runpricecaculate();
      this.valuecheck();
    }
    if (this.data.ordersubmited==true)//订单提交并付款后页面从订单中心跳转回来，这里让它再次跳转回首页
    {
      wx.navigateBack({
      })
    }
    this.setData({
      payFocus:true,
      pwderr:false,
      pwdlocked:false,
      pwderrmsg:"",
      pwdVal:"",
    })
  },//每次页面显示时加载出临时储存的各项值，比如收货地址id，取件地址id等
  goodstypeselect: function (e) {
      var goodstype = this.data.goodstypes;
      for (var i = 0; i < goodstype.length; i++) {
          goodstype[i].select = false;
      }
      for (var i = 0; i < goodstype.length; i++) {
          if (goodstype[i].title == e.currentTarget.dataset.name) {
              goodstype[i].select = true;
          }
      }
      this.setData({
          goodstypes: goodstype
      })
  },//送货类型的选择
  navtodiscount: function () {
    var selectedSendPosinfo = this.data.selectedSendPosinfo;
    var selectedreceivePosinfo = this.data.selectedreceivePosinfo;
    var servtype = this.data.selectedservicetype;
    var tips ="请选择寄出地址";
    if (servtype==2)
    {
      tips="请选择购买地址";
    }
    if (selectedSendPosinfo == null) {
      wx.showToast({
        title: tips,
        icon: "none"
      })
      return false;
    }
    if (selectedreceivePosinfo == null) {
      wx.showToast({
        title: '请选择送达地址',
        icon: "none"
      })
      return false;
    }
    if (this.data.weightindex == -1) {
      wx.showToast({
        title: '请选择物品重量',
        icon: "none"
      })
      return false;
    }
    if(this.data.canIjump==true)
    {
      var weight_key = parseInt(this.data.weightindex) + 1;
      var datetype = this.data.sendtime.day == null ? "" : this.data.sendtime.day;

      if (datetype == "今天") {
        datetype = 1;
      } else if (datetype == "明天") {
        datetype = 2;
      } else if (datetype == "后天") {
        datetype = 3;
      }

      var hour = this.data.sendtime.hour == null ? "" : this.data.sendtime.hour;
      var minute = this.data.sendtime.minut == null ? "" : this.data.sendtime.minut;
      wx.navigateTo({
        url: '/pages/discount/discount?needselect=1&slgt=' + selectedSendPosinfo.longitude + "&slat=" + selectedSendPosinfo.latitude +
          "&rlgt=" + selectedreceivePosinfo.longitude + "&rlat=" + selectedreceivePosinfo.latitude + "&weight_key=" + weightkey + "&datetype=" + datetype + "&hour=" + hour + "&minute=" + minute,
      })
    }
  },//跳转到discount页面
  getorderdiscount:function(){
    var selectedSendPosinfo = this.data.selectedSendPosinfo;
    var selectedreceivePosinfo = this.data.selectedreceivePosinfo;
    if(selectedSendPosinfo==null)
    {
      return false;
    }
    if (selectedreceivePosinfo==null)
    {
      return false;
    }
    if (this.data.weightindex == -1) {
      return false;
    }
    var weight_key = parseInt(this.data.weightindex) + 1;
    var datetype = this.data.sendtime.day == null ? "" : this.data.sendtime.day;

    if (datetype == "今天") {
      datetype = 1;
    } else if (datetype == "明天") {
      datetype = 2;
    } else if (datetype == "后天") {
      datetype = 3;
    }

    var hour = this.data.sendtime.hour == null ? "" : this.data.sendtime.hour;
    var minute = this.data.sendtime.minut == null ? "" : this.data.sendtime.minut;
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    var data = { start_lat: selectedSendPosinfo.latitude, start_lon: selectedSendPosinfo.longitude, end_lat: selectedreceivePosinfo.latitude, end_lon: selectedreceivePosinfo.longitude, start_city: app.globalData.loccity, is_change: 1, weight_key: weight_key, datetype: datetype, hour: hour, minute: minute };
    if (accesstoken) {
      dayuanren.Tpost("order/orderCoupons", data, accesstoken, function (res) {
        if (res.errno == 1) {
          _this.setData({
            discounttip:"暂无可用优惠券",
            ticketprice:0,
            ticketid: null,
            canIjump:false
          })
        }else if(res.errno==0){
          _this.setData({
            discounttip: "请选择优惠券",
            ticketprice:0,
            ticketid: null,
            canIjump: true
          })
        }
      })
    }
  },//获取所下订单位置的可用优惠券
  activecustompicker: function (e) {
      var pickertype = e.currentTarget.dataset.picktype;
      if (pickertype == "time") {
          this.setData({
            pickertype: "time"
          })
      } else if (pickertype == "gratuity") {
          this.setData({
            pickertype: "gratuity"
          })
      }
      this.setData({
          showcustompicker: true
      })
  },//显示发货时间选择器
  hidecustompicker: function () {
      this.setData({
        showcustompicker: false,
        selectgratuity:0,
        hidegratuityinput: true,
        selectedGratuityindex: 99
      })
  },//隐藏发货时间选择器
  bindtimepickerChange: function (e) {
      var val = e.detail.value
      if (val[0] == 0)
      {
        this.setData({
          hours: hours,
        })
        if(val[1]!=0)
        {
          this.setData({
            minuts: fixminuts,
          })
        }else{
          this.setData({
            minuts: minuts,
          })
        }
      }else{
        this.setData({
          hours: fixhours,
          minuts: fixminuts,
        })
      }
      var newvalue = [val[0], val[1], val[2]];
      this.setData({
          timepickervalue: newvalue,
      })
  },//发货时间选择器的值选择
  specialtimeselect: function () {
      this.setData({
          sendtime: "立即",
          showcustompicker: false
      })
  },//立即发货的选择
  activegratuityinput: function () {
      this.setData({
          hidegratuityinput: false,
          selectedGratuityindex: 99
      })
  },//激活小费输入框
  gratuityselect: function (e) {
      var val = e.currentTarget.dataset.value;
      var gratuity1 = parseFloat(this.data.gratuities[val].value);
      gratuity1 = parseFloat(gratuity1);
      this.setData({
          selectgratuity: gratuity1,
          selectedGratuityindex: val,
          hidegratuityinput: true,
      })
  },//小费选择
  bindweightChange:function(e){
      this.setData({
        weightindex: e.detail.value
      })
      this.getorderdiscount();
      this.runpricecaculate();
      this.valuecheck();
  },//重量选择处理
  gratuityinput: function (e) {
      var money = e.detail.value.trim();
      money=parseFloat(money);
      if(money.toString()=="NaN")
      {
        money=0;
      }
      this.setData({
          selectgratuity: money,
      })
  },//小费输入
  confrimgratuity:function(){
    if (this.data.pickertype =="time")
    {
      var time = {};
      time.day = this.data.days[this.data.timepickervalue[0]];
      time.hour = this.data.hours[this.data.timepickervalue[1]];
      time.minut = this.data.minuts[this.data.timepickervalue[2]];
      var date = new Date();
      var hour=date.getHours();
      var mt = date.getMinutes();
      if(time.day=="今天")
      {
        if (time.hour < hour) {
          wx.showToast({
            title: '预约时间不能小于当前时间',
            icon: "none"
          })
          return false;
        }
        if (time.hour == hour && time.minut < mt) {
          wx.showToast({
            title: '预约时间不能小于当前时间',
            icon: "none"
          })
          return false;
        }
      }
      this.setData({
        sendtime: time,
      })
      this.hidecustompicker();
    }else{     
      var total = parseFloat(this.data.totalmoney);
      var gratuity = parseFloat(this.data.gratuity);
      var selectgratuity = parseFloat(this.data.selectgratuity);
      var newtotal = total - gratuity;
      var totalmoney = selectgratuity + newtotal;
      this.setData({
        selectgratuity: 0,
        gratuity: selectgratuity,
        showcustompicker: false,
        hidegratuityinput: true,
        totalmoney: totalmoney.toFixed(2),
        selectedGratuityindex: 99
      })
    }
  },//确认选好的小费
  selectaddress:function(e){
    var backid=e.currentTarget.dataset.id;
    if (this.data.selectedservicetype==2)
    {
      if(backid==0)
      {
        wx.navigateTo({
          url: '/pages/receiver/receiver',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }else{
        wx.navigateTo({
          url: '/pages/addressselect/addressselect?back=1',
          //进到地址选择页面,选择的信息返回给送达地址(back=1)
        })
      }
    }else{
      wx.navigateTo({
        url: '/pages/addressselect/addressselect?back='+backid,
        //进到地址选择页面,选择的信息返回给对应的地址
      })
    }
  },//选择寄出地址
  getdetailservicetype: function () {
    var _this=this;
    dayuanren.cget("login/serviseTypeSon", { id: _this.data.selectedservicetype }, function (res) {
      if (res.errno == 0) {
        var servicetype = res.data;
        for (var i = 0; i < servicetype.length; i++) {
          servicetype[i].select = false;
        }
        servicetype[0].select = true;
        _this.setData({
          goodstypes: servicetype
        })
      }
    })
  },//获取跑腿详细子业务类型
  getdetailaddress:function(back,addid){
    var adid=addid;
    var _this=this;
    var backid=back;
    this.setData({
      ticketprice: 0,
      ticketid: null,
    })
    app.getdetailaddress(adid,function(res){
      var lgt = res.data.lon_lat.split(",")[0];
      var lat = res.data.lon_lat.split(",")[1];
      var adinfo = { province: res.data.province, city: res.data.city, country: res.data.county,address: res.data.address, sender: res.data.name, floor: res.data.address_info, tel: res.data.mobile,longitude:lgt,latitude:lat};
      if (backid==0)
      {
        _this.setData({
          selectedSendPosinfo: adinfo,
          sendPosinfoSwitch: true
        })
      }else{
        _this.setData({
          selectedreceivePosinfo: adinfo,
          receivePosinfoSwitch: true
        })
      }
      _this.getorderdiscount();
      _this.runpricecaculate();
      _this.valuecheck();
    })
  },//获取地址详情
  setsendifcall:function(){
    this.setData({
      sendifcall: this.data.sendifcall==1?0:1
    })
  },//设置发货人电话是否可拨打
  setreceiveifcall:function(){
    this.setData({
      receiveifcall: this.data.receiveifcall == 1 ? 0 : 1
    })
    if (this.data.selectedservicetype==2)
    {
      this.setData({
        sendifcall: this.data.receiveifcall
      })
    }
  },//设置收货人电话是否可拨打
  messageinput:function(e){
    var value = e.detail.value;
    var arrmg = this.data.Sensitivewords;
    for (var i = 0; i < arrmg.length;i++)
    {
      var r = new RegExp(arrmg[i],"ig");
      value=value.replace(r,"*");
    }
    this.setData({
      leavemessage: value
    })
  },//备注输入
  needmessageinput:function(e){
    var value = e.detail.value;
    var arrmg = this.data.Sensitivewords;
    for (var i = 0; i < arrmg.length; i++) {
      var r = new RegExp(arrmg[i], "ig");
      value = value.replace(r, "*");
    }
    this.setData({
      needmessage: value
    })
    this.valuecheck();
  },//需求输入
  goodspriceinput:function(e){
    var money = e.detail.value.trim();
    money = parseFloat(money);
    if (money.toString() == "NaN") {
      money = 0;
    }
    var total = parseFloat(this.data.totalmoney);
    var goodsprice = parseFloat(this.data.goodsprice);
    var newtotal = total - goodsprice;
    var totalmoney = money + newtotal;
    this.setData({
      goodsprice: money,
      totalmoney: totalmoney.toFixed(2)
    })
    this.valuecheck();
  },//商品垫付费用输入
  runpricecaculate:function(){
    if (this.data.selectedSendPosinfo == null) {
      return false;
    }
    if (this.data.selectedreceivePosinfo == null) {
      return false;
    }
    if (this.data.weightindex == -1) {
      return false;
    }
    var weight_key=parseInt(this.data.weightindex)+1;
    var datetype = this.data.sendtime.day == null ? "" : this.data.sendtime.day;
    if (datetype == "今天") {
      datetype = 1;
    } else if (datetype == "明天") {
      datetype = 2;
    } else if (datetype == "后天") {
      datetype = 3;
    }
    var hour = this.data.sendtime.hour == null ? "" : this.data.sendtime.hour;
    var minute = this.data.sendtime.minut == null ? "" : this.data.sendtime.minut;
    this.setData({
      pricedetail: "正在计算费用"
    })
    wx.showLoading({
      title: '正在计算跑腿费',
    })
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    var data = { start_lat: this.data.selectedSendPosinfo.latitude, start_lon: this.data.selectedSendPosinfo.longitude, end_lat: this.data.selectedreceivePosinfo.latitude, end_lon: this.data.selectedreceivePosinfo.longitude, start_city: app.globalData.loccity, is_change: 1, weight_key:weight_key, datetype: datetype, hour: hour, minute:minute}
    if (accesstoken) {
      dayuanren.Tpost("order/customerGetRunPrice", data, accesstoken, function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          var total = parseFloat(res.data.runPrice);
          if (_this.data.gratutity != 0) {
            total += parseFloat(_this.data.gratuity);
          }
          if (_this.data.goodsprice != 0) {
            total += parseFloat(_this.data.goodsprice);
          }
          _this.setData({
            totalmoney: total.toFixed(2),
            pricedetail: "费用明细"
          })
        }
      })
    }//跑腿费计算
  },//计算跑腿费，需要已选择了发货地址，收货地址，物品重量
  valuecheck:function(){
    var typeid=null;
    for (var i = 0; i < this.data.goodstypes.length; i++) {
      if (this.data.goodstypes[i].select == true) {
        typeid = this.data.goodstypes[i].id;
        break;
      }
    }
    if (typeid == null) {
      this.setData({
        errrmsg: "请选择服务类型"
      })
      return false;
    }
    if (this.data.selectedSendPosinfo == null) {
      this.setData({
        errrmsg: this.data.selectedservicetype==1?"请选择寄出地址":"请选择购买地址"
      })
      return false;
    }
    if (this.data.selectedreceivePosinfo == null) {
      this.setData({
        errrmsg: "请选择送达地址"
      })
      return false;
    }
    if(this.data.weightindex==-1)
    {
      this.setData({
        errrmsg: "请选择物品重量"
      })
      return false;
    } 
    if (this.data.selectedservicetype == 2) {
      if (this.data.needmessage == null || this.data.needmessage == "") {
        this.setData({
          errrmsg:"请填写购买需求",
          orderactive: false
        })
        return false;
      }
      if (this.data.goodsprice == null || this.data.goodsprice == "") {
        this.setData({
          errrmsg: "请输入商品垫付费用",
          orderactive: false
        })
        return false;
      }
    }
    this.setData({
      orderactive: true
    })
  },//检测下单按钮是否可用以及跑腿费计算
  placeorder:function(){
    this.valuecheck();
    var msg = this.data.errrmsg;
    if (this.data.orderactive == false) {
      wx.showToast({
        title: msg,
        icon: "none"
      })
      return false;
    }
    var _this = this;
    wx.showModal({
      title: '温馨提示',
      content:"是否确认信息无误并提交？",
      confirmColor: "#fe8702",
      success: function (res) {
        if (res.confirm) {
          if (_this.data.ordersubmited == false) {
            _this.setData({
              ordersubmited: true
            })
          } else {
            return false;
          }
          var service_type_id = null;
          for (var i = 0; i < _this.data.goodstypes.length; i++) {
            if (_this.data.goodstypes[i].select == true) {
              service_type_id = _this.data.goodstypes[i].id;
              break;
            }
          }
          var send_name = _this.data.selectedSendPosinfo.sender;
          var send_mobile = _this.data.selectedSendPosinfo.tel;
          var remark = _this.data.leavemessage;
          var goods_weight = _this.data.weightlist[_this.data.weightindex];
          var receiver_name = _this.data.selectedreceivePosinfo.sender;
          var receiver_mobile = _this.data.selectedreceivePosinfo.tel;
          var start_address = _this.data.selectedSendPosinfo.address;
          var end_address = _this.data.selectedreceivePosinfo.address;
          var start_address_son = _this.data.selectedSendPosinfo.floor;
          var end_address_son = _this.data.selectedreceivePosinfo.floor;

          var start_province = _this.data.selectedSendPosinfo.province;
          var start_city = _this.data.selectedSendPosinfo.city;
          var start_county = _this.data.selectedSendPosinfo.country;
          var end_province = _this.data.selectedreceivePosinfo.province;
          var end_city = _this.data.selectedreceivePosinfo.city;
          var end_county = _this.data.selectedreceivePosinfo.country;

          var start_lon = _this.data.selectedSendPosinfo.longitude;
          var start_lat = _this.data.selectedSendPosinfo.latitude;
          var cou_id = _this.data.ticketid;
          var goods_price = _this.data.goodsprice;
          var first_price = _this.data.gratuity;
          var requirement_info = _this.data.needmessage;
          var end_lon = _this.data.selectedreceivePosinfo.longitude;
          var end_lat = _this.data.selectedreceivePosinfo.latitude;
          var datetype = _this.data.sendtime.day;
          var hour = _this.data.sendtime.hour;
          var minute = _this.data.sendtime.minut;
          var accesstoken = dayuanren.get_access_token();
          var weight_key = parseInt(_this.data.weightindex) + 1;
          var orderdata = {
            service_type_id: service_type_id,
            goods_weight: goods_weight,
            receiver_name: receiver_name,
            receiver_mobile: receiver_mobile,
            start_address: start_address,
            start_province: start_province,
            start_city: start_city,
            start_county: start_county,
            end_province: end_province,
            end_city: end_city,
            end_county: end_county,
            end_address: end_address,
            start_address_son: start_address_son,
            end_address_son: end_address_son,
            start_lon: start_lon,
            start_lat: start_lat,
            end_lon: end_lon,
            end_lat: end_lat,
            is_change: 1,
            service_type: _this.data.selectedservicetype,
            start_city: app.globalData.loccity,
            start_call: _this.data.sendifcall,
            end_call: _this.data.receiveifcall,
            weight_key: weight_key
          };
          if (send_name != null) {
            orderdata.send_name = send_name;
          }
          if (send_mobile != null) {
            orderdata.send_mobile = send_mobile;
          }
          if (remark != null) {
            orderdata.remark = remark;
          }
          if (cou_id != null) {
            orderdata.cou_id = cou_id;
          }
          if (goods_price != null) {
            orderdata.goods_price = goods_price;
          }
          if (first_price != null) {
            orderdata.first_price = first_price;
          }
          if (requirement_info != null) {
            orderdata.requirement_info = requirement_info;
          }
          if (datetype != null) {
            if (datetype=="今天")
            {
              datetype=1;
            }else if(datetype=="明天")
            {
              datetype = 2;
            }else if(datetype=="后天")
            {
              datetype = 3;
            }
            orderdata.datetype = datetype;
          }
          if (hour != null) {
            orderdata.hour = hour;
          }
          if (minute != null) {
            orderdata.minute = minute;
          }
          wx.showLoading({
            title: '正在下单',
          })
          if (accesstoken) {
            dayuanren.Tpost("order/addOrder", orderdata, accesstoken, function (res) {
              if (res.errno == 0) {
                _this.setData({
                  ordernumber: res.data
                })
                _this.getordersoninfo(res.data,accesstoken);
              }else{
                wx.hideLoading();
                wx.showToast({
                  title: '下单失败',
                  icon:"none"
                })
                _this.setData({
                  ordersubmited: false
                })
              }
            })
          }
        }
      }
    })
  },//点击下单
  cancelpay:function(){
    wx.showToast({
      title: '您取消了支付',
      icon:"none"
    })
    if (this.data.ordersubmited == true) {
      this.setData({
        ordersubmited: false
      })
    }
    this.setData({
      selectrechargetype: false,
    })
  },//取消付款
  getordersoninfo: function (id, accesstoken){
    var _this=this;
    dayuanren.Tpost("order/orderSonInfo", { order_son_id:id}, accesstoken, function (res) {
      if (res.errno == 0) {
        wx.hideLoading();
        _this.setData({
          selectrechargetype: true,
          orderid: res.data.order.order_id
        })
      } else {
        wx.hideLoading();
        wx.showToast({
          title: '支付信息有误,支付已取消',
          icon: "none"
        })
        _this.setData({
          ordersubmited: false
        })
      }
    })
  },//获取生成的订单的子订单信息，该信息用于付款处理
  paynow:function(){
    if (this.data.paysubmited==false)
    {
      this.setData({
        paysubmited: true,
      })
    }else{
      return false;
    }
    var newrechargetypes = this.data.rechargetypes;
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    for (var i = 0; i < newrechargetypes.length; i++) {
      if (newrechargetypes[i].rechgetypeselected == true) {
        if (newrechargetypes[i].id==0)
        {
          this.gethasBalancePas();
        }
        else{
          wx.showLoading({
            title: '正在支付中',
          })
          if (accesstoken) {
            dayuanren.Tpost("order/wxappletpay", { orderId: _this.data.ordernumber, type: 1, formId: this.data.formId}, accesstoken, function (res) {
              wx.hideLoading();
              if(res==null)
              {
                wx.showToast({
                  title: '发起支付失败',
                  icon: "none",
                })
                _this.setData({
                  selectrechargetype: false,
                  paysubmited: false,
                  ordersubmited: false
                })
              }
              if (res.errno == 0) {
                _this.wxpay(res.data);
              } else {
                wx.showToast({
                  title: '支付失败',
                  icon: "none",
                })
                _this.setData({
                  selectrechargetype: false,
                  paysubmited: false,
                  ordersubmited: false
                })
              }
            })
          }
        }
      }
    }
  },//订单支付
  wxpay: function (data) {
    var _this=this;
    this.setData({
      ordersubmited: false
    })
    wx.requestPayment({
      'timeStamp': data.timeStamp,
      'nonceStr': data.nonceStr,
      'package': data.package,
      'signType': 'MD5',
      'paySign': data.paySign,
      'success': function (res) {
        setTimeout(function () {
          wx.showToast({
            title: '支付成功',
            complete:function(){
              _this.setData({
                selectrechargetype: false,
              })
            }
          })
        }, 500)
        _this.clearpagestorage();
        setTimeout(function () {
          _this.setData({
            paysubmited: false,
            ordersubmited: true
          })
          wx.navigateTo({
            url: '/pages/orderdetail/orderdetail?id=' + _this.data.orderid,
          })
        }, 1500)
      },
      'fail': function (res) {
        setTimeout(function(){
          wx.showToast({
            title: '微信支付已取消',
            icon: "none",
            complete: function () {
              _this.setData({
                paysubmited: false,
                formId:""
              })
            }
          })
        },500)
      }
    })
  },//发起微信支付
  rechargetypeselected: function (e) {
    var id = e.currentTarget.dataset.value;
    if (id == 0) {
      if (parseFloat(this.data.banlance) < parseFloat(this.data.totalmoney)) {
        return false;
      }
    }
    var newrechargetypes = this.data.rechargetypes;
    for (var i = 0, lenI = newrechargetypes.length; i < lenI; ++i) {
      newrechargetypes[i].rechgetypeselected = false;
    }
    for (var i = 0; i < newrechargetypes.length; i++) {
      if (newrechargetypes[i].id == id) {
        newrechargetypes[i].rechgetypeselected = true;
      }
    }
    this.setData({
      rechargetypes: newrechargetypes
    })
  },//支付方式选择
  getbanlance:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      dayuanren.Tpost("wallet/getBalance","", accesstoken, function (res) {
        if(res.errno==0)
        {
          _this.setData({
            banlance:res.data.balance
          })
        }
      })
    }
  },//获取账户余额
  getgratutitylist:function(){
    var _this=this;
    dayuanren.cget("login/freeList","", function (res) {
      if (res.errno == 0) {
        var gdata=res.data.free;
        var wdata=res.data.weight;
        var kdata = res.data.aliveWords;
        var arrdata=[];
        var weightlist=[];
        var keywords =[];
        var index=0;
        for (let i in gdata) {
          var arr = { id: index,value:gdata[i]};
          index++;
          arrdata.push(arr);
        }
        for (let j in wdata) {
          weightlist.push(wdata[j]);
        }
        for (let k in kdata){
          keywords.push(kdata[k]);
        }
        _this.setData({
          gratuities: arrdata,
          weightlist: weightlist,
          Sensitivewords: keywords
        })
      }
    })
  },//获取小费和重量列表
  getaddresslistcount:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      dayuanren.Tget("user/hasAddressList", "", accesstoken, function (res) {
        if(res.errno==1)
        {
          _this.setData({
            hasaddress: false
          })
        } else if (res.errno == 0){
          _this.setData({
            hasaddress: true
          })
        }
      })
    }
  },//判断用户是否有地址
  topricedetail:function(){
    var selectedSendPosinfo = this.data.selectedSendPosinfo;
    var selectedreceivePosinfo = this.data.selectedreceivePosinfo;
    var weightkey = parseInt(this.data.weightindex) + 1;
    if(weightkey==null)
    {
      weightkey=1;
    }
    if (this.data.orderactive == true)
    {
      var datetype = this.data.sendtime.day == null ? "" : this.data.sendtime.day;
      if (datetype == "今天") {
        datetype = 1;
      } else if (datetype == "明天") {
        datetype = 2;
      } else if (datetype == "后天") {
        datetype = 3;
      }
      var hour = this.data.sendtime.hour == null ? "" : this.data.sendtime.hour;
      var minute = this.data.sendtime.minut == null ? "" : this.data.sendtime.minut;
      var url ='/pages/pricedetail/pricedetail?slgt=' + selectedSendPosinfo.longitude + "&slat=" + selectedSendPosinfo.latitude +
        "&elgt=" + selectedreceivePosinfo.longitude + "&elat=" + selectedreceivePosinfo.latitude + "&gratutity=" + this.data.gratuity + "&dfmoney=" + this.data.goodsprice + "&type=" + this.data.selectedservicetype + "&ticketprice=" + this.data.ticketprice + "&weight_key=" + weightkey + "&datetype=" + datetype + "&hour=" + hour + "&minute=" + minute;
      wx.navigateTo({
        url: url,
      })
    }else{
      var msg = this.data.errrmsg;
      wx.showToast({
        title: msg,
        icon:"none"
      })
    }
  },//跳转到费用详情
  onUnload: function () {
    this.clearpagestorage();
  },//页面被卸载
  clearpagestorage:function(){
    wx.removeStorageSync('sendposid');
    wx.removeStorageSync('receiveposid');
    wx.removeStorageSync('ticketid');
    wx.removeStorageSync('ticketprice');
    wx.removeStorageSync('buyaddress');
    wx.removeStorageSync('tempsendaddress');
    wx.removeStorageSync('tempreceiveaddress');
    wx.removeStorageSync('selectsendaddid');
    wx.removeStorageSync('selectreceiveaddid');
    wx.removeStorageSync('sendifcall');
    wx.removeStorageSync('receiveifcall');
    this.data.formId="";
  },//清楚当前页的storage
  formidSubmit:function (e) {
    if (this.data.formId.split(',').length == 6) {
      this.setData({
        formId: ""
      })
    }
    if (e.detail.formId != 'the formId is a mock one')
    {
      this.setData({
        formId: e.detail.formId + "," + this.data.formId
      })
    }
  },//拥有微信支付的formid处理
  /*余额支付输入支付密码*/
  showInputLayer: function () {
    this.setData({ showPayPwdInput: true, payFocus: true });
  },//显示支付密码输入层
  hidePayLayer: function () {
    this.setData({ 
      showPayPwdInput: false,
       payFocus: false, 
       paysubmited: false, 
       pwdVal: '',
      pwderr: false,
      pwdlocked: false,
      pwderrmsg: "",
    });
  },//隐藏支付密码输入层
  /**
   * 获取焦点
   */
  getFocus: function () {
    this.setData({ payFocus: true });
  },//让密码输入框获取焦点
  /**
   * 输入密码监听
   */
  inputPwd: function (e) {
    if(this.data.pwdlocked==true){
      return false;
    }
    this.setData({ pwdVal: e.detail.value });

    if (e.detail.value.length >= 6) {
      this.judgeBalancePas();
    }
  },//输入密码处理
  usebalancepay:function(){
    wx.showLoading({
      title: '正在支付中',
    })
    var _this=this;
    var accesstoken = dayuanren.get_access_token();
    if (accesstoken) {
      dayuanren.Tpost("order/balancePay", { order_son_id: _this.data.ordernumber }, accesstoken, function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          _this.setData({
            selectrechargetype: false,
          })
          wx.showToast({
            title: '支付成功',
            icon: "success",
          })
          _this.clearpagestorage();
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/orderdetail/orderdetail?id=' + _this.data.orderid,
            })
          }, 1500)
        } else {
          wx.showToast({
            title: res.errmsg,
            icon: "none"
          })
          _this.setData({
            selectrechargetype: false,
            paysubmited: false,
            ordersubmited: false
          })
        }
      })
    }
  },//余额付款
  judgeBalancePas:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    var pwd = this.data.pwdVal;
    if (accesstoken) {
      wx.showLoading({
        title: '正在确认',
      })
      dayuanren.Tpost("user/judgeBalancePas", { password: pwd}, accesstoken, function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          _this.setData({ showPayPwdInput: false, payFocus: false, pwdVal: '', pwderr: false, pwderrmsg: "", pwdlocked:false});
          _this.usebalancepay();
        } else if(res.errno==2){
          _this.setData({
            pwdVal:'',
            pwderr:true,
            pwderrmsg: '密码错误，您还有' + res.data.subnum + '次机会'
          })
          wx.showToast({
            title: '密码错误，还有'+res.data.subnum+'次机会',
            icon:"none"
          })
        } else if (res.errno==1){
          _this.setData({
            pwdVal: '',
            pwderr: true,
            pwdlocked: true,
            pwderrmsg: '支付密码已锁定, 请修改密码'
          })
          wx.showToast({
            title: '输错密码次数超过限制,密码已锁定',
            icon: "none"
          })
        }
      })
    }
  },//判断支付密码是否正确
  /*支付密码*/
  gethasBalancePas:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if(accesstoken)
    {
      dayuanren.Tget("user/hasBalancePas",'', accesstoken, function (res) {
        if (res.errno == 0) {
          _this.showInputLayer();
        } else if(res.errno==3){
          _this.showInputLayer();
          wx.showToast({
            title: '支付密码已锁定,请修改密码',
            icon:"none"
          })
          _this.setData({
            pwderr: true,
            pwdlocked:true,
            pwderrmsg:'支付密码已锁定, 请修改密码'
          })
        }else{
          _this.setData({
            paysubmited: false
          })
          _this.showSetPwdInput();
        }
      })
    }
  },//判断是否有支付密码
  /*设置支付密码*/
  showSetPwdInput: function () {
    this.setData({ showSetPwdInput: true, setFocus: true });
  },//显示设置密码层
  getsetFocus: function () {
    this.setData({ setFocus: true });
  },//让设置密码输入框获取焦点
  hideSetLayer: function () {
    this.setData({ showSetPwdInput: false, setFocus: false, setpwdVal: '' });
  },//隐藏设置密码输入层
  inputsetPwd:function(e){
    this.setData({ setpwdVal: e.detail.value });
    if (e.detail.value.length >= 6) {
      this.startsetpaypwd();
    }
  },//设置密码输入处理
  startsetpaypwd:function(){
    var pwd = this.data.setpwdVal;
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    wx.showLoading({
      title: '请稍后',
    })
    if (accesstoken) {
      dayuanren.Tpost("user/setBalancePasFirst", { password: pwd}, accesstoken, function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          wx.showToast({
            title: '支付密码设置成功',
          })
          _this.hideSetLayer();
        } else {
          wx.showToast({
            title: '支付密码设置失败',
            icon:"none"
          })
        }
      })
    }
  },//设置支付密码
  /*设置支付密码*/
  tochangepassword:function(){
    this.setData({
      ordersubmited: false
    })
    wx.navigateTo({
      url: '/pages/changepassword/changepassword',
    })
  }//跳转到修改支付密码页面
})