// pages/comment/comment.js
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      comment:null,//评价
      commentimgs:[],//评价的图片
      stars:[],//服务星级
      selectindex:4,//选中的星级，默认五星
      timestar:[],
      selecttimeindex:4,//选中的时效星级
      order_number:null,//订单号
      rider:null,//游侠信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ss=[];
    for(var i=0;i<5;i++)
    {
      var star={id:i,selecturl:"/images/xx.png",notselecturl:"/images/xx2.png"};
      ss.push(star);
    }
    this.setData({
      stars:ss,
      timestar:ss,
    })
    if (options.ordernum)
    {
      if (options.orderid)
      {
        this.getorderdetail(options.orderid);
      }
      this.setData({
        order_number: options.ordernum
      })
    }
  },
  onShow: function () {
  
  },
  commentinput:function(e){
    this.setData({
      comment:e.detail.value
    })
  },
  getorderdetail:function(oid){
    var orderid=oid;
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '数据加载中',
      })
      dayuanren.Tget("order/orderInfo", { order_id: orderid }, accesstoken, function (res) {
        wx.hideLoading();
        if (res.errno == 0) {
          var rider = res.data.ranger;
          var comment = res.data.comment;
          if(comment.id!=null)
          {
            wx.showToast({
              title: '该订单已评价',
              icon:"none",
              complete:function(){
                setTimeout(function(){
                  wx.navigateBack({
                  })
                },1500)
              }
            })
            return false;
          }
          _this.setData({
            rider: rider
          })
        }
        else{
          wx.showToast({
            title: '未找到该订单信息',
            icon: "none",
            complete: function () {
              setTimeout(function () {
                wx.navigateBack({
                })
              }, 1500)
            }
          })
        }
      })
    }
  },
  selectimage:function(){
    var _this=this;
    wx.chooseImage({
      count:6,
      sizeType:"compressed",
      success: function(res) {
        var images = _this.data.commentimgs;
        var index=images.length*1000;
        for (var i = 0; i < res.tempFilePaths.length;i++)
        {
          if(images.length<6)
          {
            images.push({ id: index, url: res.tempFilePaths[i]});
            index++;
          }else{
            wx.showToast({
              title: '最多只能添加6张图片',
              icon:"none"
            })
            break;
          }
        }
        _this.setData({
          commentimgs:images
        })
      },
    })
  },
  removeimg:function(e){
    var id=e.currentTarget.dataset.id;
    var images = this.data.commentimgs;
    for(var i=0;i<images.length;i++)
    {
      if(images[i].id==id)
      {
        images.splice(i,1);
        break;
      }
    }
    this.setData({
      commentimgs: images
    })
  },
  starselect:function(e){
    this.setData({
      selectindex:e.currentTarget.id
    })
  },
  timestarselect: function (e) {
    this.setData({
      selecttimeindex: e.currentTarget.id
    })
  },
  submitcomment:function(){
    var commentimgs = this.data.commentimgs;
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      wx.showLoading({
        title: '正在提交您的评价',
      })
      if (_this.data.comment == null || _this.data.comment=="")
      {
        wx.showToast({
          title: '请输入您的评价内容',
          icon:"none"
        })
        return false;
      }
      var imgpsths=[];
      var count = commentimgs.length;
      for(var i=0;i<commentimgs.length;i++)
      {

        (function (imgpsths){
          dayuanren.Tupload("qiniu/upload", commentimgs[i].url, accesstoken, function (picres) {
            picres = JSON.parse(picres);
            imgpsths.push(picres.data.url);
            _this.datasubmit(accesstoken, imgpsths, count);
          })
        })(imgpsths)

      }
    }
  },
  datasubmit: function (accesstoken, imgpsths,count){
    if (count == imgpsths.length)
    {
      var content = this.data.comment;
      var selectindex = parseInt(this.data.selectindex) + 1;
      var selecttimeindex = parseInt(this.data.selecttimeindex) + 1;
      if(selectindex>5)
      {
        return false;
      }
      if (selecttimeindex>5)
      {
        return false;
      }
      var ordernnum = this.data.order_number;
      if(ordernnum==null)
      {
        wx.showToast({
          title: '评价失败，未获取到订单信息',
          icon:"none"
        })
        return false;
      }
      var data = { imgpath: imgpsths.join(), fstar: selectindex, tstar: selecttimeindex, content: content, order_number: ordernnum};
      dayuanren.Tpost("order/addComment", data, accesstoken, function (res) {
        wx.hideLoading();
        if(res.errno==0)
        {
          wx.showToast({
            title: '评价成功',
            icon:"none",
            complete:function(){
              setTimeout(function(){
                wx.navigateBack({
                })
              },2000)
            }
          })
        }
      })
    }
  }
})