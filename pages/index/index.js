//index.js
//获取应用实例
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp()
Page({
  data:{
      pageactive:true,//授权登录页面的显示与隐藏控制开关
      /*登录处理*/
      code: null,//用户登录后返回的code

      lat: null,//用户经纬度

      lgt: null,//用户经纬度

      hasuserinfo: false,

      tipmessage: "您即将授权并登录518快运小程序",

      userinfo: null,

      isgeting: false,
      /*登录处理*/
      cityactive:true,//当前城市是否开通业务

      mapscale: 16,//map的缩放比例

      longitude: 116.40717,//map定位地点经度,初始定位失败时的默认值为北京

      latitude: 39.90469,//map定位地点纬度,初始定位失败时的默认值为北京

      mapCtx:null,//地图组件控制对象,内含多种对地图进行操作的方法

      markers:[],//地图上的标记

      descCVinfo: "附近暂无游侠",//控制标签cover-view的内容切换

      frompos:"从哪里寄出物品",//

      topos:"物品寄到哪里去",//

      descCVswitch: "",//控制标签cover-view("从这里寄出/从这里取货")的显示与隐藏的开关

      selectedSendPosinfo: {
        address: "",//地址
        sender: "",//寄件人
        floor: "",//楼层
        tel: "",//联系电话
        longitude: 104.631472,
        latitude: 28.766794,
        storaged: false//是否已有详细地址的数据储存的判定开关
      },//记录临时选中的位置信息,用于页面数据绑定以及页面间传值

      sendPosinfoSwitch: false,//控制寄出地址信息显示与否的开关

      tapactive: true,//控制帮我送和帮我买的按钮开关

      topnavhide:false,//控制顶部导航条显示隐藏开关

      usercenteractive:true,//控制个人中心隐藏与显示的开关

      userlocationcity:"正在定位···",//用户定位城市,默认是北京市

      userinfo: { avatar: "/images/logo.png",name:"五一八快运"},

      servicetype: [{ id: 1, title: "帮我送" }, { id: 2, title: "帮我买" }],//跑腿业务类型

      selectedservicetype:1,//选中的跑腿业务类型,默认为1,帮我送

      ticketcount:0,//优惠券数量

      yue:"0.00",//默认余额

      cityselect:false,//城市是否选择

      moneybig:"0",//余额大号

      moneysmall:".00",//余额小号

      hasmessage:false,//默认没有消息

      fcode:null,//邀请码

      invitation_code:null,//分享码

      shareusertitle:"五一八快运",//分享title

      shareusertext:"五一八快运",//分享描述

      shareimg:"",//分享图片

      adticket:'暂无可领取的优惠券',//可领取的优惠券提示语

      adticketid:null,//可领取的优惠券id

  },
  onLoad: function (options) 
  {
    if(options.fcode)
    {
      this.setData({
        fcode:options.fcode
      })
    }
    var _this = this;
    _this.data.mapCtx = wx.createMapContext('map');
    /*登录状态判断*/
    if (app.globalData.iflogin==false)
    {
      app.userloginjudge(function(res){
        if(res==true)
        {
          //已登录
          _this.setData({
            pageactive: true//默认为true
          })
          _this.userinforender();
          var key = 'cityname';
          var cityname = dayuanren.getStorage(key);
          if (cityname == null || cityname == "") {
            _this.getlocation();
          }
          _this.gethasmessage();
          _this.getservicetype();
          app.postlocation();//获取省市县
        }else{
          _this.setData({
            pageactive: false
          })
          _this.getposinfo();//获取用户经纬度
          //未登录  先把pageactive设为false，显示授权登录页面,然后开始登录
        }
      })
    }else{
      //已登录
      _this.setData({
        pageactive: true//默认为true
      })
      var key = 'cityname';
      var _this = this;
      var cityname = dayuanren.getStorage(key);
      if (cityname==null||cityname=="") {
        _this.getlocation(); 
      }
      _this.getservicetype();
    }
    /*登录状态判断*/
  },
  onShow: function (options)
  {
    var key = 'cityname';
    var _this=this;
    var cityname = dayuanren.getStorage(key);
    if (cityname != "" && cityname != null) {
      app.globalData.loccity = cityname;
      _this.setData({
        userlocationcity: cityname,
        cityselect: true
      })
      _this.initGetCoupon(cityname);
      wx.showLoading({
        title: '正在获取信息···',
      })
      app.getcitylocation(cityname, function (res) {
        wx.hideLoading();
        var lgt = res.result.location.lng;
        var lat = res.result.location.lat;
        _this.setData({
          longitude: lgt,
          latitude: lat,
        })
        _this.getlocation();
      });
    }
    this.userinforender();
    this.gethasmessage();
  },
  getlocation: function ()  
  {
      var _this = this;
      if (this.data.cityselect==false)
      {
        app.getLocationposInfo(function (res) {
          var lat = res.latitude;
          var lgt = res.longitude;
          _this.setData({
            longitude: lgt,
            latitude: lat
          })//获取定位坐标并让地图加载出当前位置    
          var sendposinfo = {
            address: "",
            sender: "请完善地址信息",
            floor: "",
            tel: "",
            longitude: lgt,
            latitude: lat,
            storaged: false
          };//寄出地址信息类
          app.getlocationinfo(lgt, lat, function (posres) {
            sendposinfo.address = posres.result.formatted_addresses.recommend;
            sendposinfo.sender = "请完善地址信息";
            var userlocationcity = posres.result.address_component.city;
            app.globalData.loccity = userlocationcity;
            _this.setData({
              sendPosinfoSwitch: true,
              selectedSendPosinfo: sendposinfo,
              userlocationcity: userlocationcity,//用户当前城市定位
              // descCVinfo: posres.result.formatted_addresses.recommend
            })
            _this.initGetCoupon(userlocationcity);
            _this.runmancountrender(lgt, lat);
          });//获取当前定位坐标的街道信息并保存然后页面通过数据绑定来显示
        }) 
      }else{
        var lgt = this.data.longitude;
        var lat = this.data.latitude;
        var sendposinfo = {
          address: "",
          sender: "请完善地址信息",
          floor: "",
          tel: "",
          longitude: lgt,
          latitude: lat,
          storaged: false
        };//寄出地址信息类
        app.getlocationinfo(lgt, lat, function (posres) {
          sendposinfo.address = posres.result.formatted_addresses.recommend;
          sendposinfo.sender = "请完善地址信息";
          // var userlocationcity = posres.result.address_component.city;
          _this.setData({
            sendPosinfoSwitch: true,
            selectedSendPosinfo: sendposinfo,
            cityselect:false
          })
          _this.runmancountrender(lgt, lat);
        });
      }
  },//获取定位信息的函数
  loclocation:function(){
    wx.removeStorageSync('cityname');
    this.setData({
      cityselect: false
    })
    this.getlocation();
  },//定位当前位置的函数，点击后就定位,并移除选中的城市记录
  userinforender:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken)//成功登录后，每次显示页面都刷新用户信息
    {
      app.refreshuserinfo(function (uinfo) {
        var money = uinfo.data.balance+"";
        var bigm=money.split(".")[0];
        if (money == null || money == "") {
          bigm = "0";
        }
        var smallm = "";
        if (money.split(".")[1]==null)
        {
          smallm = ".00";
        }else{
          smallm = "." + money.split(".")[1];
        }
        if (bigm == null || bigm =="undefined")
        {
          bigm="0";
        }
        var tuinfo = { avatar: uinfo.data.headimg, name: uinfo.data.username, balance: uinfo.data.balance};
        _this.setData({
          userinfo: tuinfo,
          moneybig:bigm,
          moneysmall:smallm,
          invitation_code: uinfo.data.invitation_code
        })
      })
      _this.getsharedetail();
      dayuanren.Tget("coupons/couponsNum","",accesstoken,function(res){
        if(res.errno==0)
        {
          _this.setData({
            ticketcount:res.data
          })
        }
      })
    }else{
      //app。js内登录失败,
    }
  },//获取用户信息的函数
  regionchange: function (e) 
  {
    var _this = this;
    if (e.type == "begin") {
      this.setData({
        descCVswitch: "hide"
      })//地图拖动时隐藏"从这里寄出"这个cover-view
    }
    if (e.type == "end") {
      this.setData({
        descCVswitch: ""
      })//地图拖动后显示"从这里寄出"这个cover-view
      this.data.mapCtx.getCenterLocation({
        success: function (res) {
          var lat = res.latitude;
          var lgt = res.longitude;
          _this.runmancountrender(lgt, lat);
          var sendposinfo = {
            address: "",
            sender: "",
            floor: "",
            tel: "",
            longitude: lgt,
            latitude: lat,
            storaged: false
          };
          app.getlocationinfo(lgt, lat, function (posres) {
            sendposinfo.address = posres.result.formatted_addresses.recommend;
            sendposinfo.sender = "请完善地址信息";
            var userlocationcity = posres.result.address_component.city;
            _this.setData({
              sendPosinfoSwitch: true,
              selectedSendPosinfo: sendposinfo,
              userlocationcity: userlocationcity
              // descCVinfo: posres.result.formatted_addresses.recommend
            })
          })//获取当前定位地址的街道信息并保存然后页面通过数据绑定来显示
        }
      })
    } //地图拖动后获取当前中心点位置的地址信息
  },//拖动地图的响应事件
  shownearrunman: function (data) {
      var newmarkers=[];
      for(var i=0;i<data.length;i++)
      {
        var newmarker = {
          id: i + 2,
          iconPath: '/images/people.png',
          latitude: data[i].lat,
          longitude: data[i].lon,
          width: 30,
          height: 30
        }
        newmarkers.push(newmarker);
      }
      this.setData({
        markers:newmarkers
      })
  },//显示附近跑男位置
  runmancountrender:function(lgt,lat)
  {
      var _this=this;
      app.getnearRunmancount(lgt, lat, _this.data.userlocationcity,function(res){
          var message="";
          if (res.errno==0)
          {
            message = "附近超过" + res.data.length +"位游侠";   
            _this.setData({
              cityactive: true,
            }) 
            _this.shownearrunman(res.data);
          }else if(res.errno==2){
            message = res.errmsg; 
            _this.setData({
              cityactive: true,
            })
            _this.shownearrunman([]);
          }else{
            message = res.errmsg;
            _this.setData({
              cityactive: false,
            })
            _this.shownearrunman([]);
          }
          _this.setData({
            descCVinfo: message
          })
      })
  },//获取当前定位的附近跑男数量
  getservicetype: function () {
    var _this=this;
    dayuanren.cget("login/serviseType", "", function (res) {
      var stype = [];//不知道这里的跑腿类型后面会不会增加或删除
      for (var i = 0; i < res.data.length; i++) {
        stype.push({ id: res.data[i].id, title: res.data[i].title });
      }
      _this.setData({
        servicetype: stype
      })
    })
  },//获取跑腿业务类型
  menuswitch:function(e)
  {
      if (e.currentTarget.dataset.value=="1")
      {
        var selectedSendPosinfo = this.data.selectedSendPosinfo;
        selectedSendPosinfo.sender = "请完善地址信息";
          this.setData({
              frompos:"从哪里寄出物品",
              topos: "物品寄到哪里去",
              tapactive:true,
              selectedservicetype:1,
              selectedSendPosinfo: selectedSendPosinfo
          }) 
      }else{
          var selectedSendPosinfo = this.data.selectedSendPosinfo;
          selectedSendPosinfo.sender="请完善购买信息";
          this.setData({
              frompos: "从哪里购买物品",
              topos:"物品送到哪里去",
              tapactive: false,
              selectedservicetype: 2,
              selectedSendPosinfo: selectedSendPosinfo
          }) 
      }
  },//帮我送和帮我买的切换
  hideusercenter:function()
  {
    this.setData({
      topnavhide: false,
      usercenteractive:true
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
      animation: {
        duration: 10,
        timingFunc: 'easeIn'
      }
    })
  },//隐藏个人中心
  activeusercenter:function()
  {
      this.setData({
        topnavhide: true,
        usercenteractive: false
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#2c2f40',
        animation: {
          duration: 10,
          timingFunc: 'easeIn'
        }
      })
  },//显示个人中心 
  activesendinputform:function()
  {
      if (this.data.cityactive==true)
      {
          var _this = this;
          //这里得把地址信息传过去
          wx.navigateTo({
            url: '/pages/placeorder/placeorder?servicetypeid=' + _this.data.selectedservicetype,
          }) 
      }else{
        wx.showToast({
          title: this.data.descCVinfo,
          icon: "none"
        })
      }
  },//跳转到下单页面
  toreceiverinfo:function(){
    if (this.data.cityactive == true)
    {
      var _this = this;
      //这里得把地址信息传过去
      wx.navigateTo({
        url: '/pages/placeorder/placeorder?servicetypeid=' + _this.data.selectedservicetype,
      })
    }else{
      wx.showToast({
        title: this.data.descCVinfo,
        icon:"none"
      })
    }
  },//跳转到下单页面
  tomyorder:function(){
      wx.navigateTo({
        url: '/pages/myorder/myorder',
      })
  },//跳转到我的订单页面
  tomywallet:function(){
      wx.navigateTo({
        url: '/pages/wallet/wallet',
      })
  },//跳转到我的优惠券页面
  todiscount:function(){
      wx.navigateTo({
        url: '/pages/discount/discount',
      })
  },//跳转到我的优惠券页面
  becomerider:function(){
      wx.navigateTo({
        url: '/pages/joinrider/joinrider',
      })
  },//跳转到我的优惠券页面
  tosetting:function()
  { 
      wx.navigateTo({
        url: '/pages/setting/setting',
      })
  },//跳转到设置页面
  toshare:function(){
      wx.navigateTo({
        url: '/pages/share/share',
      })
  },//跳转到分享页面
  tonewscenter:function(){
    wx.navigateTo({
      url: '/pages/newscenter/newscenter',
    })
  },//跳转到消息中心
  tocityselectpage:function(){
    wx.navigateTo({
      url: '/pages/cityselect/cityselect',
    })
  },//跳转到城市选择
  touserinfo:function(){
    wx.navigateTo({
      url: '/pages/userinfo/userinfo',
    })
  },//跳转到用户信息页面
  tomyaddress:function(){
    wx.navigateTo({
      url: '/pages/addressmanage/addressmanage',
    })
  },//跳转到用户地址列表页面
  tohelp:function(){
    wx.navigateTo({
      url: '/pages/help/help',
    })
  },//跳转到帮助页面
  gethasmessage:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      dayuanren.Tget("message/hasNoreadMsg", "", accesstoken, function (res) {
        if (res.errno == 0) {
          _this.setData({
            hasmessage:true
          })
        }else{
          _this.setData({
            hasmessage: false
          })
        }
      })
    }
  },//是否有消息
  /*登录相关*/
  getPhoneNumber: function (e) {
    if (this.data.isgeting == false) {
      this.setData({
        isgeting: true
      })
    } else {
      return false;
    }
    var _this=this;
    wx.showLoading({
      title: '处理中',
      icon: "none"
    })
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        var encryptedData = e.detail.encryptedData;
        var iv = e.detail.iv;
        var data = { sessionkey: app.globalData.session_key,encryptedData: encryptedData, iv: iv };
        wx.request({
          url: dayuanren.apiurl + "login/decrypt", //仅为示例，并非真实的接口地址
          data: data,
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.hideLoading();
            if (res.data.errno == 0) {
              var mobilenumber = res.data.data.purePhoneNumber;//这里后面换成正确的值
              _this.fakelogin(mobilenumber);
              //处理成功
            } else {
              console.log(res);
              wx.showToast({
                title: res.data.errmsg,
                icon: "none"
              })
              _this.setData({
                isgeting: false
              })
            }
          },
          fail: function () {
            wx.hideLoading();
            _this.setData({
              isgeting: false
            })
            wx.showToast({
              title: '网络连接异常',
              icon: "none"
            })
          }
        })
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        app.userloginjudge(function (res){
          if (res == false)
          {
            var encryptedData = e.detail.encryptedData;
            var iv = e.detail.iv;
            var data = { sessionkey: app.globalData.session_key, encryptedData: encryptedData, iv: iv };
            wx.request({
              url: dayuanren.apiurl + "login/decrypt", //仅为示例，并非真实的接口地址
              data: data,
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                wx.hideLoading();
                if (res.data.errno == 0) {
                  var mobilenumber = res.data.data.purePhoneNumber;//这里后面换成正确的值
                  _this.fakelogin(mobilenumber);
                  //处理成功
                } else {
                  wx.showToast({
                    title: res.data.errmsg,
                    icon: "none"
                  })
                  _this.setData({
                    isgeting: false
                  })
                }
              },
              fail: function () {
                wx.hideLoading();
                _this.setData({
                  isgeting: false
                })
                wx.showToast({
                  title: '网络连接异常',
                  icon: "none"
                })
              }
            })
          }
        })
      }
    })
  },//获取电话号码
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    var uinfo = e.detail.userInfo;
    if (uinfo == null) {
      wx.showToast({
        title: '获取用户信息失败',
        icon: "none"
      })
      return false;
    } else {
      wx.showToast({
        title: '授权成功',
        icon: "none"
      })
    }
    this.setData({
      userinfo: uinfo,
      hasuserinfo: true,
      tipmessage: "您即将授权518快运小程序绑定您的手机号"
    })
  },//获取微信用户信息
  reallogin: function (tel,code) {
    var uinfo = this.data.userinfo;
    var data = { code: code, nickName: uinfo.nickName, mobile: tel, avatarUrl: uinfo.avatarUrl};
    if(this.data.fcode!=null)
    {
      data.fcode=this.data.fcode;
    }
    if (this.data.lat != null) {
      data.lat = this.data.lat;
      data.lon = this.data.lgt;
    }
    var _this = this;
    wx.showLoading({
      title: '正在登录',
      icon: "none"
    })
    wx.request({
      url: dayuanren.apiurl + "login/wxxLogin",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: data,
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          if (res.data.errno == 0) {
            //成功后的执行
            dayuanren.save_userinfo(res.data.data.userinfo);
            dayuanren.save_access_token(res.data.data.token);
            wx.showToast({
              title: '微信登录成功',
              icon: "none",
              complete: function () {
                setTimeout(function () {
                  app.globalData.iflogin=true;
                  _this.setData({
                    pageactive: true
                  })
                  _this.onLoad({});
                  _this.userinforender();
                  _this.gethasmessage();
                  app.postlocation();
                }, 1500)
              }
            })
          } else {
            wx.showToast({
              title: res.data.errmsg,
              icon: "none"
            })
            _this.setData({
              isgeting: false
            })
          }
        } else {
          wx.showToast({
            title: '登录失败',
            icon: "none"
          })
          _this.setData({
            isgeting: false
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        _this.setData({
          isgeting: false
        })
        wx.showToast({
          title: '网络异常',
          icon: "none"
        })
      }
    })
  },//登录
  fakelogin: function (tel) {
    var _this = this;
    wx.login({
      success: res => {
        // 获取res.code，发送到后台换取 openId, sessionKey, unionId
        if (res.code) {
          _this.reallogin(tel,res.code);
        } else {
          wx.showToast({
            title: '微信验证失败',
            icon: "none"
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常',
          icon: "none"
        })
      }
    })
  },//获取登录的code
  getposinfo: function () {
    var _this = this;
    wx.showToast({
      title: '正在获取位置信息',
      icon: "none"
    })
    app.getLocationposInfo(function (res) {
      wx.hideLoading();
      var lat = res.latitude;
      var lgt = res.longitude;
      _this.setData({
        lat: lat,
        lgt: lgt
      })
    })
  },//获取地址信息
  /*登录相关*/
  /*分享相关*/
  onShareAppMessage: function (res) {
    var _this = this;
    if (_this.data.invitation_code == null) {
      wx.showToast({
        title: '操作失败',
        icon:"none"
      })
      return false;
    }
    if (res.from === 'menu') {
      var pathurl = '/pages/index/index?fcode=' + _this.data.invitation_code + '&type=1';
      return {
        title: _this.data.shareusertitle,
        desc: _this.data.shareusertext,
        path: pathurl,
        imageUrl: _this.data.shareimg,
        success: (res) => {
        },
        fail: (res) => {
        }
      }
    }
  },
  getsharedetail: function () {
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if(accesstoken)
    {
      dayuanren.Tget("user/shareConfig", "", accesstoken, function (res) {
        if (res.errno == 0) {
          _this.setData({
            shareusertitle: res.data.config.title,
            shareusertext: res.data.config.description,
            shareimg: res.data.img,
          })
        } else {
          wx.showToast({
            title: '获取分享配置失败',
            icon: "none"
          })
        }
      })
    }
  },
  /*分享相关*/
  initGetCoupon:function(cityname){//获取首页底部可领取优惠券信息
    var _this=this;
    dayuanren.dpost("login/initGetCoupon", { localcity: cityname}, function (res) {
      if (res.errno == 0) {
        _this.setData({
          adticket:res.data.name,
          adticketid:res.data.id
        })
      }else{
        _this.setData({
          adticket: "暂无可领取的优惠券",
          adticketid:null
        })
      }
    })
  },
  gettheticket:function(){//首页领取优惠券
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken && this.data.adticketid!=null) {
      dayuanren.Tpost("user/toGetCoupon", { id: _this.data.adticketid}, accesstoken, function (res) {
        if (res.errno == 0) {
          wx.showToast({
            title: res.errmsg,
            icon: "none"
          })
          _this.userinforender();
        } else {
          _this.setData({
            adticket:"暂无可领取的优惠券",
            adticketid: null
          })
          wx.showToast({
            title: res.errmsg,
            icon:"none"
          })
        }
      })
    }
  },
})
