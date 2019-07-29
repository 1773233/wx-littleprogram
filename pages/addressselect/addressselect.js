// pages/addressselect/addressselect.js
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    address: null,

    addressdetail: null,

    name: null,

    tel: null,

    province: null,

    city: null,

    country: null,

    longitude: null,

    latitude: null,

    addresslist: null,

    saveadd:false,

    tipmessage: "您还没有保存过地址",//没有地址时的提示消息

    backid: 0,//0为默认返回的地址信息用于寄出地址，1为送达地址

    toinvoice:false,//选择的地址给申请发票页面

    selectsendaddid:null,

    selectreceiveaddid:null,

    ifcall:1,//是否致电
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.back) {
      this.setData({
        backid: options.back
      })
      var tempsendaddress = dayuanren.getStorage("tempsendaddress");
      var tempreceiveaddress = dayuanren.getStorage("tempreceiveaddress");
      var key8 = 'sendifcall';
      var key9 = 'receiveifcall';
      var sendifcall = dayuanren.getStorage(key8);
      var receiveifcall = dayuanren.getStorage(key9);
      if (tempsendaddress != null) {
        if (this.data.backid == 0) {
          this.setData({
            address: tempsendaddress.address,
            addressdetail: tempsendaddress.address_info,
            name: tempsendaddress.name,
            tel: tempsendaddress.mobile,
            province: tempsendaddress.province,
            city: tempsendaddress.city,
            country: tempsendaddress.county,
            longitude: tempsendaddress.lon_lat.split(',')[0],
            latitude: tempsendaddress.lon_lat.split(',')[1],
          })
          if (sendifcall != null)
          {
            this.setData({
              ifcall:sendifcall=="call"?1:0
            })
          }
        }
      }
      if (tempreceiveaddress != null) {
        if (this.data.backid == 1) {
          this.setData({
            address: tempreceiveaddress.address,
            addressdetail: tempreceiveaddress.address_info,
            name: tempreceiveaddress.name,
            tel: tempreceiveaddress.mobile,
            province: tempreceiveaddress.province,
            city: tempreceiveaddress.city,
            country: tempreceiveaddress.county,
            longitude: tempreceiveaddress.lon_lat.split(',')[0],
            latitude: tempreceiveaddress.lon_lat.split(',')[1],
          })
          if (sendifcall != null) {
            this.setData({
              ifcall: receiveifcall == "call" ? 1 : 0
            })
          }
        }
      }
    }
    if (options.invoice)
    {
      this.setData({
        toinvoice:true
      })
    }
  },
  onShow: function () {
    // var selectsendaddid = dayuanren.getStorage("selectsendaddid");
    // var selectreceiveaddid = dayuanren.getStorage("selectreceiveaddid");
    // if (selectsendaddid != null) {
    //   this.setData({
    //     selectsendaddid: selectsendaddid
    //   })
    // }
    // if (selectreceiveaddid != null) {
    //   this.setData({
    //     selectreceiveaddid: selectreceiveaddid
    //   })
    // }
    this.getaddresslist(); 
  },
  toaddressmanage:function(){
    wx.navigateTo({
      url: '/pages/addressmanage/addressmanage'
    })
  },
  ifsaveadd:function(){
    this.setData({
      saveadd:!this.data.saveadd
    })
  },
  setifcall:function(){
    this.setData({
      ifcall: this.data.ifcall==1?0:1
    })
  },
  getaddresslist: function () {
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '数据加载中',
      })
      dayuanren.ctget("user/addressList", { is_change: 1}, accesstoken, function (res) {
        wx.hideLoading();
        if(res.errno==0)
        {
          if (res.data == null) {
            _this.setData({
              tipmessage: res.errmsg
            })
          } else {
            var address = res.data;
            _this.setData({
              addresslist: address
            })
          }
        }else{
          _this.setData({
            addresslist:null
          })
        }
      })
    }
  },
  infotoplaceorder: function (e) {
    var backid = this.data.backid;
    var id = e.currentTarget.dataset.id;
    var addlist = this.data.addresslist;
    for (var i = 0; i < addlist.length;i++)
    {
      if(addlist[i].id==id)
      {
          this.setData({
            address: addlist[i].address,
            addressdetail: addlist[i].address_info,
            name: addlist[i].name,
            tel: addlist[i].mobile,
            province: addlist[i].province,
            city: addlist[i].city,
            country: addlist[i].county,
            longitude: addlist[i].lon_lat.split(',')[0],
            latitude: addlist[i].lon_lat.split(',')[1]
          })
          break;
      }
    }
    this.setData({
      saveadd: false
    })
    // if (this.data.toinvoice==false)
    // {
    //   if (backid == 0) {
    //     // dayuanren.setStorage("selectsendaddid", id);
    //     // if (id == this.data.selectreceiveaddid) {
    //     //   wx.showToast({
    //     //     title: '不能选择同一个地址下单哦',
    //     //     icon: "none"
    //     //   })
    //     //   return false;
    //     // }
    //   } else{
    //     // dayuanren.setStorage("selectreceiveaddid", id);
    //     // if (id == this.data.selectsendaddid) {
    //     //   wx.showToast({
    //     //     title: '不能选择同一个地址下单哦',
    //     //     icon: "none"
    //     //   })
    //     //   return false;
    //     // }
    //   }
    // }
    // if (this.data.toinvoice == true) {
    //   dayuanren.setStorage("invoiceaddid", id);
    // }else{
    //   if (backid == 0) {
    //     dayuanren.setStorage("sendposid", id);
    //   } else if (backid == 1) {
    //     dayuanren.setStorage("receiveposid", id);
    //   }
    // }
  },//地址选择给下单页面
  toaddressselect: function () {
    var _this = this;
    wx.chooseLocation({
      success: function (res) {
        app.getlocationinfo(res.longitude, res.latitude, function (posres) {
          var p = posres.result.address_component.province;
          var c = posres.result.address_component.city;
          var y = posres.result.address_component.district;
          _this.setData({
            province: p,
            city: c,
            country: y
          })
        })//获取当前定位地址的街道信息并保存然后页面通过数据绑定来显示
        _this.setData({
          address: res.name,
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
    })
  },//跳转到地址选择页面
  addressinput: function (e) {
    this.setData({
      addressdetail: e.detail.value
    })
  },//楼层详情输入
  nameinput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  telinput: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  confirm: function () {
    var address = this.data.address;
    var addressdetail = this.data.addressdetail;
    var name = this.data.name;
    var tel = this.data.tel;
    if (address == null) {
      wx.showToast({
        title: '请选择地址',
        icon: "none"
      })
      return false;
    }
    if (this.data.province == null) {
      wx.showToast({
        title: '获取地址坐标失败，请重新选择地址',
        icon: "none"
      })
      return false;
    }
    if (this.data.city == null) {
      wx.showToast({
        title: '获取地址坐标失败，请重新选择地址',
        icon: "none"
      })
      return false;
    }
    if (this.data.country == null) {
      wx.showToast({
        title: '获取地址坐标失败，请重新选择地址',
        icon: "none"
      })
      return false;
    }
    if (addressdetail == null || addressdetail == "") {
      wx.showToast({
        title: '请填写详细门牌信息',
        icon: "none"
      })
      return false;
    }
    if (name == null || name == "") {
      wx.showToast({
        title: '请填写名字',
        icon: "none"
      })
      return false;
    }
    if (tel == null || tel == "") {
      wx.showToast({
        title: '请填写电话号码',
        icon: "none"
      })
      return false;
    }
    if (this.validatemobile(tel) == false) {
      return false;
    }
    var data = {
      address: address,
      province: this.data.province,
      city: this.data.city,
      county: this.data.country,
      name: name,
      mobile: tel,
      lon_lat: this.data.longitude + "," + this.data.latitude,
      address_info: addressdetail,
      is_change: 1,
    };
    var _this = this;
    if(this.data.saveadd==true)
    {
      var accesstoken = dayuanren.get_access_token();
      if (accesstoken) {
        wx.showLoading({
          title: '正在保存',
        })
        dayuanren.Tpost("user/addAddress", data, accesstoken, function (res) {
          wx.hideLoading();
          if (res.errno == 0) {
            var backid = _this.data.backid;
            var id = res.data.id;
            if (_this.data.toinvoice == true) {
              dayuanren.setStorage("tempinvoiceaddress", data);
            }else{
              if (backid) {
                if (backid == 0) {
                  dayuanren.setStorage("sendposid", id);
                  dayuanren.setStorage("selectsendaddid", id);
                  dayuanren.setStorage("sendifcall", _this.data.ifcall == 1 ? "call" : "nocall");
                } else {
                  dayuanren.setStorage("receiveposid", id);
                  dayuanren.setStorage("selectreceiveaddid", id);
                  dayuanren.setStorage("receiveifcall", _this.data.ifcall == 1 ? "call" : "nocall");
                }
              }
            }
            var msg = "地址保存成功";
            wx.showToast({
              title: msg,
              icon: "none",
              complete: function () {
                setTimeout(function () {
                  wx.navigateBack({
                  })
                }, 1500)
              }
            })
          } else {
            wx.showToast({
              title: '地址保存失败,请重试',
              icon: "none"
            })
          }
        })
      }
    }else{
      if (_this.data.toinvoice==true)
      {
        dayuanren.setStorage("tempinvoiceaddress", data);
        wx.navigateBack({
        })
      }else{
        wx.showLoading({
          title: '处理中',
        })
        app.getnearRunmancount(_this.data.longitude, _this.data.latitude, _this.data.city, function (cres) {
          wx.hideLoading();
          if (cres.errno == 1) {
            wx.showToast({
              title: '该城市暂未开通服务',
              icon: "none"
            })
            return false;
          } else {
            var backid = _this.data.backid;
            var tempsendaddress = dayuanren.getStorage("tempsendaddress");
            var tempreceiveaddress = dayuanren.getStorage("tempreceiveaddress");
            if (backid == 0) {
              if (tempreceiveaddress != null) {
                if (data.city != tempreceiveaddress.city) {
                  wx.showToast({
                    title: '只能在同一个城市下单哦',
                    icon: "none"
                  })
                  return false;
                }
              }
              dayuanren.setStorage("tempsendaddress", data);
              dayuanren.setStorage("sendifcall", _this.data.ifcall == 1 ? "call" : "nocall");
            } else {
              if (tempsendaddress != null) {
                if (data.city != tempsendaddress.city) {
                  wx.showToast({
                    title: '只能在同一个城市下单哦',
                    icon: "none"
                  })
                  return false;
                }
              }
              dayuanren.setStorage("tempreceiveaddress", data);
              dayuanren.setStorage("receiveifcall", _this.data.ifcall == 1 ? "call" : "nocall");
            }
            wx.navigateBack({
            })
          }
        })
      }
    }
  },
  validatemobile: function (mobile) {
    if (mobile.length == 0) {
      wx.showToast({
        title: '请输入手机号！',
        icon: "none"
      })
      return false;
    }
    if (mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: "none"
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: "none"
      })
      return false;
    }
    return true;
  },
})