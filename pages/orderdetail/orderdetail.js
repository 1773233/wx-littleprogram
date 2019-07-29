// pages/orderdetail/orderdetail.js

var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:null,
    rider:null,
    comment:null,
    useravatar:null,//用户头像
    username:null,//用户名字
    orderstatus:null,//订单状态
    createtime:null,//下单时间
    commentimgs:[],//评论图片
    tpimgpath:[],//取件或购买的证明图片
    commenttime:null,//评论时间
    deletcontrolswitch: false,//删除订单的按钮显示与隐藏开关
    loglist:[],//订单日志
    activelogs:false,//查看日志
    orderid:null,//订单id
    riderstatus:null,//游侠状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id)
    {
      this.setData({
        orderid:options.id
      })
      this.getorderdetail(options.id);
    }
  },
  onShow:function(){
    if (this.data.orderid)
    {
      this.getorderdetail(this.data.orderid);
    }
  },
  getorderdetail:function(id){
    var accesstoken = dayuanren.get_access_token();
    var userinfo = dayuanren.get_userinfo();
    this.setData({
      username:userinfo.username,
      useravatar: userinfo.headimg
    });
    var _this = this;
    var _id=id;
    if(accesstoken)
    {
      wx.showLoading({
        title: '数据加载中',
      })
      dayuanren.Tget("order/orderInfo", { order_id: _id},accesstoken,function(res){
          wx.hideLoading();
          if(res.errno==0)
          {
            var info=res.data.info;
            if (info.requirement_info == null || info.requirement_info=="")
            {
              info.requirement_info="无";
            }
            var rider=res.data.ranger;
            var comment=res.data.comment;
            var loglist = res.data.logList;
            var ctime = "",ttime = "", ftime = "", reftime = "", extime = "";//评论时间,取件时间,完成时间，退款时间,预计到达时间
            for(var i=0;i<loglist.length;i++)
            {
              loglist[i].create_time = app.datetostr(loglist[i].create_time,"DHM");
              if(i==0)
              {
                loglist[i].select=true;
              }
            }
            if (comment.create_time)
            {
              ctime = dayuanren.timestamptostr(comment.create_time);
            }
            var creattime = dayuanren.timestamptostr(info.create_time);//下单时间
            if (info.take_time!=null&&info.take_time!="")
            {
              ttime = dayuanren.timestamptostr(info.take_time);//预约取件时间
            }
            if (info.finish_time != null && info.finish_time!="")
            {
              ftime = dayuanren.timestamptostr(info.finish_time);//完成时间
            }
            if (info.refund_time != null && info.refund_time != "") {
              reftime = dayuanren.timestamptostr(info.refund_time);//退款时间
            }
            if (info.expect_time != null && info.expect_time != "") {
              extime = dayuanren.timestamptostr(info.expect_time);//预计完成时间
            }
            var imgs=[];
            if (comment.imgpath != null && comment.imgpath!="")
            {
              imgs = comment.imgpath.split(",");
            }
            var tpimgpath=[];
            if (rider.tpimgpath!=null&&rider.tpimgpath!="")
            {
              tpimgpath = rider.tpimgpath.split(",");
            }
            _this.setorderstatus(info.status);
            if(info.status==0||info.status==6)
            {
              _this.setData({
                deletcontrolswitch:true
              })
            }
            var riderstatus = _this.riderstatusjudge(info.service_type, info.ranger_status);
            wx.hideLoading();
            _this.setData({
              info:info,
              rider:rider,
              comment:comment,
              commenttime: ctime,
              commentimgs:imgs,
              tpimgpath: tpimgpath,
              createtime:creattime,
              taketime:ttime,
              finishtime:ftime,
              refundtime:reftime,
              expecttime: extime,
              loglist: loglist,
              riderstatus: riderstatus
            })
          } else {
            wx.showToast({
              title: '未找到该订单信息',
              icon: "none",
              complete: function () {
                setTimeout(function(){
                  wx.navigateBack({
                  })
                },1500)
              }
            })
          }
      })
    }
  },
  setorderstatus:function(status){
    var orderstatus="";
    switch(status){
      case 0:
        orderstatus= '已取消';
        break;
      case 1:
        orderstatus = '待支付';
        break;
      case 2:
        orderstatus= '待接单';
        break;
      case 3:
        orderstatus= '进行中';
        break;
      case 4:
        orderstatus = '待评价';
        break;
      case 5:
        orderstatus= '已完成';
        break;
      case 6:
        orderstatus = '已取消';
        break;
      default:
        orderstatus="";
    }
    this.setData({
      orderstatus: orderstatus
    })
  },//订单状态判断
  riderstatusjudge: function (service_type, status){
    //1已接单0取消2致电取件人3取件4致电收货人5我已送达6完成
    switch (status) {
      case 1:
        return '游侠已接单，请耐心等待送达';
        break;
      case 2:
        return service_type == 1 ? '请等待游侠取件' : '请等待游侠购买物品';
        break;
      case 3:
        return service_type == 1 ? '游侠已成功取件，请耐心等待送达' : '游侠已成功购买，请耐心等待送达';
        break;
      case 4:
        return '游侠已成功取件，请耐心等待送达';
        break;
      case 5:
        return '游侠已成功送达，记得把确认码告诉他哦';
        break;
      case 6:
        return '感谢您对518的信任,期待再次光临';
        break;
      default:
        return '';
    }
  },
  deleteorder:function(e){
    var rnumber = e.currentTarget.dataset.value;
    var _this = this;
    wx.showModal({
      title: '您确认要删除订单吗？',
      content: "订单删除后将不再显示",
      confirmColor: "#fe8702",
      success: function (res) {
        if (res.confirm) {
          var accesstoken = dayuanren.get_access_token();
          if (accesstoken) {
            wx.showLoading({
              title: '删除订单中',
            })
            dayuanren.Tget("order/deleteOrder", { order_number: rnumber }, accesstoken, function (orderres) {
              wx.hideLoading();
              if (orderres.errno == 0) {
                wx.showToast({
                  title: '订单已删除',
                  complete: function () {
                    setTimeout(function(){
                      wx.navigateBack({
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
  },//删除订单
  tocomment:function(e){
    var ordernum = e.currentTarget.dataset.value;
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/comment/comment?ordernum=' + ordernum + "&orderid=" + id,
    })
  },//评价订单
  cancelorder:function(e){
    var rnumber = e.currentTarget.dataset.value;
    var _this = this;
    wx.showModal({
      title: '您确认要取消订单吗？',
      confirmColor: "#fe8702",
      success: function (res) {
        if (res.confirm) {
          var accesstoken = dayuanren.get_access_token();
          if (accesstoken) {
            wx.showLoading({
              title: '订单取消中',
            })
            dayuanren.Tget("order/cancelOrder", { order_number: rnumber }, accesstoken, function (orderres) {
              wx.hideLoading();
              if (orderres.errno == 0) {
                wx.showToast({
                  title: '订单已取消',
                  complete: function () {
                    setTimeout(function () {
                      wx.navigateTo({
                        url: '/pages/cancelreson/cancelreson?orderid=' + rnumber,
                      })
                    }, 1500)
                  }
                })
              }else{
                wx.showToast({
                  title: '操作失败',
                  icon: "none"
                })
              }
            })
          }
        } else if (res.cancel) {

        }
      }
    })
  },//取消订单
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
                      wx.navigateBack({
                      })
                    }, 1500)
                  }
                })
              } else {
                wx.showToast({
                  title: '操作失败',
                  icon: "none"
                })
              }
            })
          }
        } else if (res.cancel) {

        }
      }
    })
  },//确认订单
  makecall:function(){
    var _this=this;
    wx.makePhoneCall({
      phoneNumber: _this.data.rider.mobile,
      success: function(res) {},
    })
  },//打电话
  toindex:function(){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  toriderdetail:function(e){
    var id=e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/riderdetail/riderdetail?id='+id,
    })
  },//跳转到游侠主页
  orderlog:function(){
    this.setData({
      activelogs:true
    })
  },
  hidecustompicker:function(){
    this.setData({
      activelogs: false
    })
  },
  previewimg:function(e){
    var img=e.currentTarget.dataset.value;
    var _this=this;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: _this.data.commentimgs // 需要预览的图片http链接列表
    })
  },
  previewProveimg:function(e){
    var img = e.currentTarget.dataset.value;
    var _this = this;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: _this.data.tpimgpath // 需要预览的图片http链接列表
    })
  },
  /**
   * 分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'menu') {
      return {
        title: '分享订单给好友',
        path: '/pages/orderdetail/orderdetail?id=' + this.data.orderid,
        success: (res) => {
          wx.showToast({
            title: '分享成功',
            icon:"none"
          })
        },
        fail: (res) => {
          wx.showToast({
            title: '分享失败',
            icon: "none"
          })
        }

      }
    }
  },
  gotohome:function(){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  }
})