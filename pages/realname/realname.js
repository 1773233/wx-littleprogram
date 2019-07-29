// pages/realname/realname.js
/*
  author:llg
  2018/7/11编写实名认证功能
  2018/7/12已完成该页面所有功能
*/
var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sfzzmurl: null,//身份证正面

    sfzfmurl: null,//身份证反面

    sfzzmselected: false,//身份证正面是否选中,用于判断页面中选中的图片是否显示

    sfzfmselected: false,//身份证反面是否选中,用于判断页面中选中的图片是否显示

    picselect: false,//处理微信小程序选择图片后也会调用一次onshow函数的bug

    realname:null,//真实姓名

    idcard:null,//身份证号码

    realnamestatus:0,//实名认证状态,默认为0,为未认证

    messagetip:"请确保所填信息为真实有效",//提示消息

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({
      title: '数据加载中',
    })
    app.refreshuserinfo(function (uinfo) {
      wx.hideLoading();
      var relstatus = uinfo.data.real_status;
      _this.setData({
        realnamestatus: relstatus
      })
      if (relstatus != 0) {
        _this.setData({
          sfzzmurl: uinfo.data.card_pic_1,
          sfzfmurl: uinfo.data.card_pic_2,
          realname: uinfo.data.name,
          idcard: uinfo.data.id_number
        })
      }
      if (relstatus == 1) {
        _this.setData({
          messagetip: "资料审核中"
        })
      }
      if (relstatus == 2) {
        _this.setData({
          messagetip: "认证成功"
        })
      }
      if (relstatus == 3) {
        _this.setData({
          messagetip: uinfo.data.real_status_reason //认证失败，显示后台的失败原因
        })
      }
    })
  },
  onShow: function (options) {
  },//每次进入页面后刷新认证情况
  choosesfzzmimage: function () {
    if (this.data.realnamestatus==0)
    {
      var _this = this;
      this.setData({
        picselect: true
      }) 
      wx.chooseImage({
        count: 1,
        success: function (res) {
          _this.setData({
            sfzzmurl: res.tempFilePaths,
            sfzzmselected: true,
            picselect: false
          })
        },
      })
    }
  },//选择身份证正面
  choosesfzfmimage: function () {
    if (this.data.realnamestatus==0)
    {
      var _this = this;
      this.setData({
        picselect: true
      })
      wx.chooseImage({
        count:1,
        success: function (res) {
          _this.setData({
            sfzfmurl: res.tempFilePaths,
            sfzfmselected: true,
            picselect: false
          })
        },
      })
    }
  },//选择身份证背面
  realnameinput:function(e){
    this.setData({
      realname:e.detail.value
    })
  },//姓名输入
  idcardinput: function (e) {
    this.setData({
      idcard: e.detail.value
    })  
  },//身份证号码输入
  reidentify:function(){
    this.setData({
      realnamestatus:0,
      messagetip:"请确保所填信息为真实有效",
      realname:null,
      idcard: null,
      sfzzmurl: null,
      sfzfmurl:null,
      sfzzmselected:false,
      sfzfmselected:false
    })
  },//重新认证
  submitinfo: function () {
    if (this.data.realnamestatus==0)
    {
      var name = this.data.realname;
      var idcard = this.data.idcard;
      var sfzzmurl = this.data.sfzzmurl;
      var sfzfmurl = this.data.sfzfmurl;
      var _this=this;
      if (name == null||name=="") {
        wx.showToast({
          title: '请填写您的真实姓名',
          icon: "none"
        })
        return false;
      }
      if (idcard == null||idcard=="") {
        wx.showToast({
          title: '请填写您的身份证号码',
          icon: "none"
        })
        return false;
      }
      if(this.isCardNo(idcard)==false)
      {
        return false;
      }
      if (sfzzmurl == null) {
        wx.showToast({
          title: '请选择您的身份证正面照',
          icon: "none"
        })
        return false;
      }
      if (sfzfmurl == null) {
        wx.showToast({
          title: '请选择您的身份证背面照',
          icon: "none"
        })
        return false;
      }
      var accesstoken = dayuanren.get_access_token();
      var idcardfront = null;
      var idcardback = null;
      if (accesstoken) {
        wx.showLoading({
          title: '资料提交中',
        })
        dayuanren.Tupload("qiniu/upload", sfzzmurl[0], accesstoken, function (frontres) {
          //先上传用户提交的图片,再保存上传后返回的地址以作后用
          frontres = JSON.parse(frontres);
          idcardfront = frontres.data.url;

          dayuanren.Tupload("qiniu/upload", sfzfmurl[0], accesstoken, function (backres) {
            //先上传用户提交的图片,再保存上传后返回的地址以作后用
            backres = JSON.parse(backres);
            idcardback = backres.data.url;

            dayuanren.Tpost("user/realName",
              { name: name, id_number: idcard, card_pic_1: idcardfront, card_pic_2: idcardback },
              accesstoken, function (upres) {
                  wx.hideLoading();
                  if (upres.errno==0)
                  {
                    wx.showToast({
                      title: '提交成功',
                      icon:"success"
                    })
                    if (upres.data == 1) {
                      _this.setData({
                        realnamestatus: 1,
                        messagetip: "资料审核中"
                      })
                    }
                  }//提交用户认证的信息
                  else{
                    wx.showToast({
                      title: '操作失败',
                      icon: "none"
                    })
                  }
              })
          })
        })
      }
    }
  },//提交认证信息
  isCardNo:function(card)  
  {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(reg.test(card) === false)
    {
      wx.showToast({
        title: '身份证输入不合法',
        icon:'none'
      })
      return false;
    }
    return true;
  }  
})