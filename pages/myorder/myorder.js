// pages/myorder/myorder.js

const rechargetypes = [
  { id: 0, name: "账户余额支付", url: "/images/way.png", rechgetypeselected: true },
  { id: 1, name: "微信支付", url: "/images/weixin.png" },
  { id: 2, name: "添加银行卡支付", url: "/images/way.png" }
];
const rechargenumber = [
  { id: 0, value: "2", select: true },
  { id: 1, value: "5" },
  { id: 2, value: "10" },
  { id: 3, value: "15" },
  { id: 4, value: "20" },
  { id: 5, value: "50" }
];

var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();

const sliderWidth = 72;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["全部订单", "预约中", "服务中", "待评价", "已完成"],
      orderstate:[0, 2, 3, 4, 5],
      activeIndex: 0,
      sliderOffset: 0,
      sliderLeft: 0,
      order:[],//订单信息
      rechargetypeselected: false,
      selectrechargetype: false,
      rechargetypes: rechargetypes,
      rechargenumber: rechargenumber,
      hidegratuityinput: true,//控制输入金额input是否显示
      rechargeamount: 0,//临时充值金额
      rechargeorderid:null,//支付的订单的订单号
      nowpage:1,//订单当前页
      totalpage:1,//订单总页数
      status:0,//获取的订单状态,默认为0，所有订单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pagerender();
  },
  onShow:function(){
    this.refreshorderinfo(this.data.status);
  },
  pagerender:function(){
      var that = this;
      wx.getSystemInfo({
          success: function (res) {
              that.setData({
                sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
              });
          }
      });
  },
  getorderinfo:function(state){
      //state为传入的订单状态值,0为全部订单,2为待结单,3为进行中,3待评价，5已完成
      var accesstoken = dayuanren.get_access_token();
      var _this = this;
      if(accesstoken)
      {
        wx.showLoading({
          title: '数据加载中',
        })
        var orderlist = this.data.order;
        var data={};
        if(state!=0)//为0时不传值，后台默认返回所有订单
        {
          data.type=state
        }
        dayuanren.Tpost("order/orderList?page=" + this.data.nowpage,data,accesstoken,function(res){
          wx.hideLoading();
          if(res.errno==0)
          {
              var orderdata=res.data.data;
              for (var i = 0; i < orderdata.length;i++)
              {
                var status="";
                var btntype = "emptyborder"; 
                if (orderdata[i].status==0)
                {
                  status="已取消";
                  btntype = "fullcolor";
                }
                if (orderdata[i].status == 2) 
                {
                  status = "待接单";
                  btntype = "fullcolor";
                }
                if (orderdata[i].status == 3) {
                  status = "进行中";
                  btntype = "emptyborder";
                }
                if (orderdata[i].status == 4) {
                  status = "待评价";
                  btntype = "fullcolor";
                }
                if (orderdata[i].status == 5) {
                  status = "已完成";
                  btntype = "fullcolor";
                }
                var extime = "", ftime="",extaketime="",taketime="";
                if (orderdata[i].expect_time != null && orderdata[i].expect_time!="")
                {
                  extime = _this.datedeel(orderdata[i].expect_time);
                }
                if (orderdata[i].finish_time != null && orderdata[i].finish_time != "") {
                  ftime = _this.datedeel(orderdata[i].finish_time);
                }
                if (orderdata[i].expect_take_time != null && orderdata[i].expect_take_time != "") {
                  extaketime = _this.datedeel(orderdata[i].expect_take_time);
                }
                if (orderdata[i].take_time != null && orderdata[i].take_time != "") {
                  taketime = _this.datedeel(orderdata[i].take_time);//预约取件时间
                }
                var order = {
                  id:orderdata[i].id,
                  ordergoodstype: orderdata[i].title,
                  fromaddress: orderdata[i].start_address,
                  fromdetail: orderdata[i].start_address_son,
                  toaddress: orderdata[i].end_address,
                  todetail: orderdata[i].end_address_son,
                  message: orderdata[i].remark,
                  orderdate: extime,
                  finishtime: ftime,
                  extaketime:extaketime,
                  taketime: taketime,
                  cost: orderdata[i].total_pay_price,
                  orderstate: status,
                  btntype: btntype,
                  ordernum: orderdata[i].order_number,
                  servicetype: orderdata[i].service_type,
                  gratutity: orderdata[i].total_add_price,
                  goods_weight: orderdata[i].goods_weight,
                  receiver_name: orderdata[i].receiver_name,
                  receiver_mobile: orderdata[i].receiver_mobile,
                  send_name: orderdata[i].send_name,
                  send_mobile: orderdata[i].send_mobile,
                  requirement_info: orderdata[i].requirement_info
                };
                orderlist.push(order);
              }
              _this.setData({
                order: orderlist,
                totalpage: res.data.totalPages
              })
          }else{
            wx.showToast({
              title: '获取订单信息失败',
              icon:"none"
            })
          }
        })
      }
  },
  refreshorderinfo: function (state){
    //state为传入的订单状态值,0为全部订单,2为待结单,3为进行中,3待评价，5已完成
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '数据加载中',
      })
      var orderlist = [];
      var data = { };
      if (state != 0)//为0时不传值，后台默认返回所有订单
      {
        data.type = state
      }
      dayuanren.Tpost("order/orderList?page=1", data, accesstoken, function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.errno == 0) {
          var orderdata = res.data.data;
          for (var i = 0; i < orderdata.length; i++) {
            var status = "";
            var btntype = "emptyborder";
            if (orderdata[i].status == 0) {
              status = "已取消";
              btntype = "fullcolor";
            }
            if (orderdata[i].status == 2) {
              status = "待接单";
              btntype = "fullcolor";
            }
            if (orderdata[i].status == 3) {
              status = "进行中";
              btntype = "emptyborder";
            }
            if (orderdata[i].status == 4) {
              status = "待评价";
              btntype = "fullcolor";
            }
            if (orderdata[i].status == 5) {
              status = "已完成";
              btntype = "fullcolor";
            }
            if (orderdata[i].status == 6) {
              status = "已取消";
              btntype = "fullcolor";
            }
            var extime = "", ftime = "", extaketime = "", taketime = "";
            if (orderdata[i].expect_time != null && orderdata[i].expect_time != "") {
              extime = _this.datedeel(orderdata[i].expect_time);
            }
            if (orderdata[i].finish_time != null && orderdata[i].finish_time != "") {
              ftime = _this.datedeel(orderdata[i].finish_time);
            }
            if (orderdata[i].expect_take_time != null && orderdata[i].expect_take_time != "") {
              extaketime = _this.datedeel(orderdata[i].expect_take_time);
            }
            if (orderdata[i].take_time != null && orderdata[i].take_time != "") {
              taketime = _this.datedeel(orderdata[i].take_time);//预约取件时间
            }
            var order = {
              id: orderdata[i].id,
              ordergoodstype: orderdata[i].title,
              fromaddress:  orderdata[i].start_address,
              fromdetail: orderdata[i].start_address_son,
              toaddress: orderdata[i].end_address,
              todetail: orderdata[i].end_address_son,
              message: orderdata[i].remark,
              orderdate: extime,
              finishtime: ftime,
              extaketime: extaketime,
              taketime: taketime,
              cost: orderdata[i].total_pay_price,
              orderstate: status,
              btntype: btntype,
              ordernum: orderdata[i].order_number,
              servicetype: orderdata[i].service_type,
              gratutity: orderdata[i].total_add_price,
              goods_weight: orderdata[i].goods_weight,
              receiver_name: orderdata[i].receiver_name,
              receiver_mobile: orderdata[i].receiver_mobile,
              send_name: orderdata[i].send_name,
              send_mobile: orderdata[i].send_mobile,
              requirement_info: orderdata[i].requirement_info == null ? "无" : orderdata[i].requirement_info
            };
            orderlist.push(order);
          }
          _this.setData({
            order: orderlist,
            totalpage: res.data.totalPages
          })
        }else{
          wx.showToast({
            title: '获取订单信息失败',
            icon:"none"
          })
        }
      })
    }
  },
  tabClick: function (e) {
      this.setData({
        status: this.data.orderstate[e.currentTarget.id],
        order:[]
      })
      this.refreshorderinfo(this.data.status);
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id
      });
  },
  toorderdetail:function(e){
    var id=e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/orderdetail/orderdetail?id=' + id,
    })
  },
  tocomment:function(e){
    var ordernum=e.currentTarget.dataset.value;
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/comment/comment?ordernum=' + ordernum +"&orderid="+id,
    })
  },//去评价
  cancelorder:function(e){
    var rnumber=e.currentTarget.dataset.value;
    var _this = this;
    wx.showModal({
      title: '您确认要取消订单吗？',
      confirmColor:"#fe8702",
      success: function (res) {
        if (res.confirm) {
          var accesstoken = dayuanren.get_access_token();
          if (accesstoken){
            wx.showLoading({
              title: '正在取消订单',
            })
            dayuanren.Tget("order/cancelOrder", { order_number: rnumber},accesstoken,function(orderres){
              wx.hideLoading();
              if(orderres.errno==0)
              {
                wx.showToast({
                  title: '订单已取消',
                  complete:function(){
                    setTimeout(function(){
                      wx.navigateTo({
                        url: '/pages/cancelreson/cancelreson?orderid=' + rnumber,
                      })
                    },1500)
                  }
                })
              }else{
                wx.showToast({
                  title: '操作失败',
                  icon:"none"
                })
              }
            })
          }
        } else if (res.cancel) {
          
        }
      }
    })
  },//取消订单
  deletorder:function(e){
    var rnumber = e.currentTarget.dataset.value;
    var _this = this;
    wx.showModal({
      title: '您确认要删除订单吗？',
      content:"订单删除后将不再显示",
      confirmColor: "#fe8702",
      success: function (res) {
        if (res.confirm) {
          var accesstoken = dayuanren.get_access_token();
          if (accesstoken) {
            wx.showLoading({
              title: '正在删除订单',
            })
            dayuanren.Tget("order/deleteOrder", { order_number: rnumber }, accesstoken, function (orderres) {
              wx.hideLoading();
              if (orderres.errno == 0) {
                wx.showToast({
                  title: '订单已删除',
                  complete: function () {
                    setTimeout(function () {
                      _this.refreshorderinfo(_this.data.status);
                    }, 1500)
                  }
                })
              }else{
                wx.showToast({
                  title: '操作失败',
                  icon:"none"
                })
              }
            })
          }
        } else if (res.cancel) {

        }
      }
    })
  },//删除订单
  topay:function(e){
    var rnumber = e.currentTarget.dataset.value;
    this.setData({
      rechargeorderid: rnumber
    })
    this.showrechargepicker();
  },//支付
  confirmorder:function(e){
    var rnumber = e.currentTarget.dataset.value;
    var _this = this;
    wx.showModal({
      title: '您确认订单已完成了吗？',
      content: "确认完成后可以对游侠评价哦",
      confirmColor: "#fe8702",
      success: function (res) {
        if (res.confirm) {
          var accesstoken = dayuanren.get_access_token();
          if (accesstoken) {
            wx.showLoading({
              title: '确认订单中',
            })
            dayuanren.Tget("order/finishOrder", { order_number: rnumber }, accesstoken, function (orderres) {
              wx.hideLoading();
              if (orderres.errno == 0) {
                wx.showToast({
                  title: '订单已确认完成',
                  complete: function () {
                    setTimeout(function () {
                      _this.refreshorderinfo(this.data.status);
                    }, 1500)
                  },
                })
              }else{
                wx.showToast({
                  title: '操作失败',
                  icon:"none"
                })
              }
            })
          }
        } else if (res.cancel) {

        }
      }
    })
  },//确认完成订单
  /*支付相关*/
  showrechargepicker: function () {
    this.setData({
      selectrechargetype: true
    })
  },
  hidecustompicker: function () {
    if (this.data.rechargetypeselected == true) {
      this.setData({
        rechargetypeselected: false
      })
    } else {
      this.setData({
        selectrechargetype: false
      })
    }
  },
  rechargetypeselected: function (e) {
    var id = e.currentTarget.dataset.value;
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
  },
  chooserechargeamount: function () {
    this.setData({
      rechargetypeselected: true
    })
  },//打开充值金额选择器
  rechargenumberselect: function (e) {
    var id = e.currentTarget.dataset.value;
    var newrechargenumber = this.data.rechargenumber;
    var amount = 0;
    for (var i = 0, lenI = newrechargenumber.length; i < lenI; ++i) {
      newrechargenumber[i].select = false;
    }
    for (var i = 0; i < newrechargenumber.length; i++) {
      if (newrechargenumber[i].id == id) {
        newrechargenumber[i].select = true;
        amount = newrechargenumber[i].value;
      }
    }
    this.setData({
      rechargeamount: amount,
      rechargenumber: newrechargenumber,
      hidegratuityinput: true
    })
  },//充值金额选择
  activerechargenumberinput: function () {
    var newrechargenumber = this.data.rechargenumber;
    for (var i = 0, lenI = newrechargenumber.length; i < lenI; ++i) {
      newrechargenumber[i].select = false;
    }
    this.setData({
      rechargenumber: newrechargenumber,
      hidegratuityinput: false
    })
  },//显示充值输入框
  rechargenumberinput: function (e) {
    var money = e.detail.value.trim();
    this.setData({
      rechargeamount: money
    })
  },//自定义输入充值金额
  paynow: function () {
    this.setData({
      selectrechargetype: false,
      rechargetypeselected: false,
      hidegratuityinput: true
    })
  },//立即支付
  /*支付相关*/
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.nowpage + 1 <= this.data.totalpage) {
      this.setData({
        nowpage: this.data.nowpage + 1
      })
      this.getorderinfo(this.data.status);
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: "none"
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      nowpage: 1
    })
    this.refreshorderinfo(this.data.status);
  },
  datedeel: function (data){
    var date = new Date(data * 1000); //如果date为13位不需要乘1000
    var year = date.getFullYear();
    var month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var day = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    var hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
    var minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var createTime = year + "-" + month + "-" + day + " " + hour + ":" + minute;
    var timeStamp = new Date(new Date().setHours(0, 0, 0, 0));
    //今天凌晨得时间戳
    if (timeStamp > date) {
      return createTime;
    }

    var date0 = this.GetDateStr(0); //今天
    var str0 = date0.split("-");
    str0[1] = str0[1].length == 1 ? '0' + str0[1] : str0[1];
    str0[2] = str0[2].length == 1 ? '0' + str0[2] : str0[2];

    var date1 = this.GetDateStr(1); //明天
    var str1 = date1.split("-");
    str1[1] = str1[1].length == 1 ? '0' + str1[1] : str1[1];
    str1[2] = str1[2].length == 1 ? '0' + str1[2] : str1[2];

    var date2 = this.GetDateStr(2); //后天
    var str2 = date2.split("-");
    str2[1] = str2[1].length == 1 ? '0' + str2[1] : str2[1];
    str2[2] = str2[2].length == 1 ? '0' + str2[2] : str2[2];

    if (year == str0[0] && month == str0[1] && day == str0[2]) {
      return "今天" + " " + hour + ":" + minute
    } else if (year == str1[0] && month == str1[1] && day == str1[2]) {
      return "明天" + " " + hour + ":" + minute
    } else if (year == str2[0] && month == str2[1] && day == str2[2]) {
      return "后天" + " " + hour + ":" + minute
    } else {
      return createTime;
    }
  },
  GetDateStr: function (AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1; //获取当前月份的日期
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
  }
})