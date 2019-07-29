//app.js
/*
llg
*/
var dayuanren=require('/utils/dayuanren.js');
var QQMapWX = require('/utils/qqmap-wx-jssdk.min.js');
var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var qqmapsdk;
App({
  onLaunch: function () {
    qqmapsdk = new QQMapWX({
      key: '5OCBZ-2RAKO-2TOWC-SWL6P-2SSDS-2ZFMH'
    });
    this.globalData.qqmapsdk = qqmapsdk;
    this.getcitylist(function(res){});
  },
  userloginjudge:function(cb){
    var _this=this;
    if(this.globalData.iflogin==true)
    {
      typeof cb == "function" && cb(this.globalData.iflogin);
    }else{
      wx.login({
        success: function (res) {
          if (res.code) {
            //这里发送code到后台判断是否已登录,
            var data = { code: res.code };
            wx.showLoading({
              title: '微信登录中···',
            })
            wx.request({
              url: dayuanren.apiurl + "login/wxxcLogin",
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: data,
              success: function (res) {
                wx.hideLoading();
                if (res.statusCode == 200) {
                  if (res.data.errno == 0) {
                    _this.globalData.iflogin = true;
                    //成功后的执行
                    dayuanren.save_userinfo(res.data.data.userinfo);
                    dayuanren.save_access_token(res.data.data.token);
                    typeof cb == "function" && cb(_this.globalData.iflogin);
                  } else {
                    //失败后的执行
                    _this.globalData.iflogin = false;
                    _this.globalData.session_key = res.data.errmsg; 
                    typeof cb == "function" && cb(_this.globalData.iflogin);
                  }
                } else {
                  //失败后的执行
                  wx.showModal({
                    title: '登录异常,是否重新登录?',
                    success: function (res) {
                      if (res.confirm) {
                        _this.onLaunch();
                      }
                    }
                  })
                }
              },
              fail: function (res) {
                wx.hideLoading();
                wx.showToast({
                  title: '网络异常',
                  icon: "none"
                })
                //失败后的执行
              }
            })
          }
        }
      })
    }

  },//用户是否登录判断
  datetostr: function (date, dtype) {
    var date = new Date(parseInt(date) * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    var datetime = "";
    if (dtype == "YMD") {
      datetime += y + '-' + m + '-' + d;
    }
    if (dtype == "HM") {
      datetime += h + ':' + minute;
    }
    if (dtype == "YMDHM") {
      datetime += y + '-' + m + '-' + d + ' ' + h + ':' + minute;
    }
    if (dtype == "S") {
      datetime += second;
    }
    if (dtype == "DHM") {
      datetime += d + '日' + h + ':' + minute;
    }
    return datetime;
  },
  postlocation:function(){
    var _this = this;
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        _this.globalData.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            var province = res.result.ad_info.province;
            var city = res.result.ad_info.city;
            var country = res.result.ad_info.district;
            var accesstoken = dayuanren.get_access_token();
            dayuanren.Tpost("user/saveLocal", { localcity: city, localprovice: province, localcounty: country }, accesstoken, function (rinfo) {
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '获取地址信息失败',
              icon: "none"
            })
          }
        });
      },
      fail: function () {
        wx.showToast({
          title: '定位失败',
          icon: "none"
        })
      }
    })
  },
  getLocationposInfo: function (cb) {
    var _this = this;
    if (this.globalData.locationinfo) {
      typeof cb == "function" && cb(this.globalData.locationinfo);
    } else {
      wx.getLocation({
        type: "gcj02",
        success: function (res) {
          _this.globalData.locationinfo = res;
          cb(_this.globalData.locationinfo);
        },
        fail: function () {
          wx.hideLoading();
          wx.showToast({
            title: '定位失败',
            icon: "none"
          })
        }
      })
    }
  },
  getWxSystemInfo: function (cb) {
    var _this = this;
    if (this.globalData.systeminfo) {
      typeof cb == "function" && cb(this.globalData.systeminfo);
    } else {
      wx.getSystemInfo({
        success: function (res) {
          _this.globalData.systeminfo = res;
          cb(_this.globalData.systeminfo);
        },
        fail: function () {
          wx.showToast({
            title: '获取系统信息失败',
            icon: "none"
          })
        }
      })
    }
  },
  getlocationinfo: function (longitude, latitude, cb) {
    var lat = latitude;
    var lgt = longitude;
    this.globalData.qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lgt
      },
      success: function (res) {
        typeof cb == "function" && cb(res);
      },
      fail: function (res) {
        wx.showToast({
          title: '获取地址失败',
          icon:"none"
        })
      }
    });
  },
  getnearAddressinfo:function(latitude,longitude,cb)
  {
    var lat = latitude;
    var lgt=longitude;
    this.globalData.qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lgt
      },
      success: function (res) {
        typeof cb == "function" && cb(res);
      },
      fail: function (res) {

      }
    })
  },
  getsearchSuggestion: function (addressname, cb){
    var name = addressname;
    this.globalData.qqmapsdk.search({
      keyword: name,
      region:"",
      region_fix:1,//搜索范围固定在当前城市
      policy:1,
      success: function (res) {
        typeof cb == "function" && cb(res);
      },
      fail: function (res) {

      }
    })
  },
  getserachinfo: function (addressname,cb){
    var name = addressname;
    this.globalData.qqmapsdk.search({
      keyword: name,
      success: function (res) {
        typeof cb == "function" && cb(res);
      },
      fail: function (res) {

      }
    })
  },
  getcitylocation: function (cityname, cb) {
    var name = cityname;
    var _this=this;
    var seareched = false;
    if (this.globalData.citylist.length==0)
    {
      this.getcitylist(function (res) {
        var citylist = _this.globalData.citylist;
        for (var i = 0; i < citylist.length;i++)
        {
          if (citylist[i].name.search(name)!=-1)
          {
            var result = {result:{location:citylist[i].location}};
            seareched=true;
            typeof cb == "function" && cb(result);
            break;
          }
        }
        if(seareched==false)
        {
          this.globalData.qqmapsdk.geocoder({
            address: name,
            success: function (res) {
              typeof cb == "function" && cb(res);
            },
            fail: function (res) {
              wx.hideLoading();
              wx.showToast({
                title: '获取当前城市坐标失败，请重试',
                icon: "none"
              })
            }
          })
        }
      });
    }else{
      var citylist = _this.globalData.citylist;
      for (var i = 0; i < citylist.length; i++) {
        if (citylist[i].name.search(name)!=-1) {
          var result = { result: { location: citylist[i].location } };
          seareched = true;
          typeof cb == "function" && cb(result);
          break;
        }
      }
      if (seareched == false) {
        this.globalData.qqmapsdk.geocoder({
          address: name,
          success: function (res) {
            typeof cb == "function" && cb(res);
          },
          fail: function (res) {
            wx.hideLoading();
            wx.showToast({
              title: '获取当前城市坐标失败，请重试',
              icon: "none"
            })
          }
        })
      }
    }
  },
  getnearRunmancount:function(lgt,lat,cityname,cb)
  {
    var _this=this;
    dayuanren.dpost("login/isRanger", { lon: lgt, lat: lat, is_change: 1, city: cityname}, function (rinfo) {
      typeof cb == "function" && cb(rinfo);
    })
  },//api网络请求,获取附近的跑男数量
  refreshuserinfo:function(cb){
    var accesstoken = dayuanren.get_access_token();
    if (accesstoken)
    {
      dayuanren.ctget("user/info", "", accesstoken, function (uinfo) {
        if(uinfo.errno==0)
        {
          typeof cb == "function" && cb(uinfo);
        }else{
          wx.showToast({
            title: '获取用户信息失败',
            icon:"none"
          })
        }
      })
    }else{
      wx.showToast({
        title: '用户未登录',
        icon: "none"
      })
    } 
  },//即使获取用户信息,用户用户对个人信息做出操作时更新页面数据
  getAddressArea:function(cb){
    var accesstoken = dayuanren.get_access_token();
    if (accesstoken) {
      dayuanren.Tget("user/getArea", "", accesstoken, function (adinfo) {
        if (adinfo.errno == 0) {
          typeof cb == "function" && cb(adinfo);
        } else {
          wx.showToast({
            title: '获取地址信息失败',
            icon: "none"
          })
        }
      })
    } else {
      wx.showToast({
        title: '用户未登录',
        icon: "none"
      })
    } 
  },//获取地区列表
  getdetailaddress:function(adid,cb){
    var accesstoken = dayuanren.get_access_token();
    if (accesstoken) {
      dayuanren.Tget("user/addressInfo", { id: adid, is_change: 1}, accesstoken, function (adinfo) {
        if (adinfo.errno == 0) {
          typeof cb == "function" && cb(adinfo);
        } else {
          wx.showToast({
            title: '获取地址信息详情失败',
            icon: "none"
          })
        }
      })
    } else {
      wx.showToast({
        title: '用户未登录',
        icon: "none"
      })
    }
  },
  getcitylist:function(cb){
    var chda = dayuanren.cacheread("getcitylist", "citylist");
    if(chda)
    {
      this.globalData.citylist = chda;
      typeof cb == "function" && cb(true);
    }
    var _this=this;
    var arr=[];
    this.globalData.qqmapsdk.getCityList({
      success: function (res) {
        var ret = res.result[0].concat(res.result[1]);
        for (var j = 0; j < ret.length; j++)
        {
          var city = { name: ret[j].fullname,location:ret[j].location};
          arr.push(city);
        }
        _this.globalData.citylist = arr;
        if (JSON.stringify(arr) != JSON.stringify(chda)) {
          dayuanren.cachewrite("getcitylist", "citylist", arr);
        }
        typeof cb == "function" && cb(true);
      },
      fail: function (res) {
        wx.showToast({
          title: '获取城市列表失败,请重试',
          icon:"none"
        })
      }
    })
  },
  globalData: {
    iflogin: false,//判断用户是否已登录
    locationinfo: "",
    systeminfo: "",
    loccity:"北京市",
    qqmapsdk: "",
    citylist:[],
    session_key:null,
  }
})