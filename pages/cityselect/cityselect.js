// pages/cityselect/cityselect.js
// const hotcity=[
//   { cityloc: { lat: 39.90469, lng: 116.40717 }, cityname: "北京",select:false },
//   { cityloc: { lat: 39.0851, lng: 117.19937 }, cityname: "天津" },
//   { cityloc: { lat: 31.23037, lng: 121.4737}, cityname: "上海" },
//   { cityloc: { lat: 23.12908, lng: 113.26436}, cityname: "广州" },
//   { cityloc: { lat: 22.54286, lng: 114.05956}, cityname: "深圳" },
//   { cityloc: { lat: 29.56471, lng: 106.55073}, cityname:"重庆"},
// ];

var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    locatcity:"正在定位···",
    locatp:null,//当前城市坐标
    hotcities: [],
    cityblocklist:null,
    selectid:-1,//选中的城市
    toView:"HOT",
    highlightcity:"",
    searchcity:"",
    abcs: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getcitylist();
    this.getlocation();
  },
  cityselect:function(e){
    var loc=e.currentTarget.dataset.value;
    if(loc)
    {
      dayuanren.setStorage("cityname", loc);
      wx.navigateBack({
        
      })
    }
  },
  scrooltopos:function(e){
    var _id = e.currentTarget.dataset.value;
    this.setData({
      toView: _id
    })
  },
  getcitylist:function(){
    wx.showLoading({
      title: '数据加载中',
    })
    var _this=this;
    dayuanren.cget("login/getCityList",'',function (res) {
      wx.hideLoading();
      if(res.errno==0)
      {
        var hotcity = res.data.hostData;
        var citylist=res.data.citydata;
        var cityarr = [];
        for(var i=0;i<citylist.length;i++)
        {
          var al = { ind: i, abc: citylist[i].pinyin, value: citylist[i].children}
          cityarr.push(al);
        }
        _this.setData({
          hotcities: hotcity,
          cityblocklist: cityarr,
        })
      }else{
        wx.showToast({
          title: '数据加载失败',
          icon:"none"
        })
      }
    })
  },
  // getcitylist:function(){
  //   wx.showLoading({
  //     title: '数据加载中',
  //   })
  //   var chda = dayuanren.cacheread("getcitylist", "citylist");
  //   if(chda)
  //   {
  //     this.setData({
  //       cityblocklist: chda,
  //     })
  //     wx.hideLoading();
  //   }
  //   var abcslist = {"A":[], "B":[], "C":[], "D":[], "E":[], "F":[], "G":[], "H":[], "I":[], "J":[], "K":[], "L":[], "M":[], "N":[], "O":[], "P":[], "Q":[], "R":[], "S":[],"T":[], "U":[], "V":[], "W":[], "X":[], "Y":[], "Z":[]};
  //   var _this=this;
  //   app.globalData.qqmapsdk.getCityList({
  //     success: function (res) {
  //       var resultlist=res.result;
  //       var pylist=[];
  //       for (var i = 1; i < resultlist.length-1;i++)
  //       {
  //         for (var j = 0; j < resultlist[i].length;j++)
  //         {
  //           var uper = resultlist[i][j].pinyin[0].slice(0, 1).toUpperCase();
  //           if(pylist.indexOf(uper)==-1)
  //           {
  //             pylist.push(uper);
  //           }
  //           abcslist[uper].push(resultlist[i][j]);
  //         }
  //       }
  //       var cityarr=[];
  //       var ind=0;
  //       for (let i in abcslist) {
  //         var al = { ind: ind,abc: i, value: abcslist[i]}
  //         ind++;
  //         cityarr.push(al);
  //       }
  //       if (JSON.stringify(cityarr) != JSON.stringify(chda)) {
  //         dayuanren.cachewrite("getcitylist", "citylist", cityarr);
  //       }
  //       console.log(cityarr);
  //       _this.setData({
  //         cityblocklist: cityarr,
  //       })
  //       wx.hideLoading();
  //     },
  //     fail: function (res) {
  //       wx.showToast({
  //         title: '获取城市列表失败,请重试',
  //         icon:"none"
  //       })
  //     }
  //   })
  // },
  getlocation: function () {
    var _this = this;
    app.getLocationposInfo(function (res) {
      var lat = res.latitude;
      var lgt = res.longitude;  
      app.getlocationinfo(lgt, lat, function (posres) {
        var userlocationcity = posres.result.address_component.city;
        _this.setData({
          locatcity: userlocationcity,//用户当前城市定位
          locatp: posres.result.location
        })
      });
    })
  },//获取定位信息的函数
  searchcity:function(e){
    var city=e.detail.value;
    this.setData({
      searchcity: city,
    })
  },//搜索城市
  confirmsearch:function(){
    var city = this.data.searchcity;
    if(city=="")
    {
      return false;
    }
    var blocklist = this.data.cityblocklist;
    for (var i = 0; i < blocklist.length; i++) {
      for (var j = 0; j < blocklist[i].value.length; j++) {
        if (blocklist[i].value[j].name.indexOf(city) > -1) {
          var _id = blocklist[i].abc;
          this.setData({
            toView: _id,
            highlightcity: blocklist[i].value[j].name
          })
          return false;
        }
      }
    }
  }
})