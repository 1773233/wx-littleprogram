// pages/becomerider/becomerider.js

/*
  author:llg
  2018/7/12编写成为游侠功能
  2018/7/13完成成为游侠功能
*/

var dayuanren = require('../../utils/dayuanren.js');
const app = getApp();
const sexvalue = [{ value: "男", selected: true }, { value: "女", selected: false }];
Page({

  /**
   * 页面的初始数据
   */
  data: {

    riderstatus: -1,//用户提交的状态,0禁用，1审核成功并启用,-1未提交过,3审核中，4审核失败

    failstatusreson:null,//审核失败原因

    picselect: false,//处理微信小程序选择图片后也会调用一次onshow函数的bug

    logname: null,//登录名

    realname:null,//真实姓名

    sex: sexvalue,//性别选择按钮切换

    selectedsex:0,//选中的性别,默认为男

    phone:null,//手机号

    idcardnumber: null,//身份证号码

    sfzzmurl: null,//身份证正面

    sfzfmurl: null,//身份证背面

    handsfzurl: null,//手拿身份证

    sfzzmselected: false,//身份证正面是否选择

    sfzfmselected: false,//身份证背面是否选择

    handsfzselected: false,//手持身份证是否选择

    provincearray: [],//省

    cityarray:[],//市

    countryarray:[],//县

    regionIndex:[0,0,0],//选中的地址,默认为北京市,市辖区,东城区

    regionArray:[],//picker首次显示的地址

    objectregionArray:[],//用于提交的object对象

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userinforender();
  },
  onShow:function(){
    if (!this.data.picselect)
    {
      this.getaddressarea();
    }
  },
  userinforender: function () {
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      app.refreshuserinfo(function (uinfo) {
          _this.setData({
            logname:uinfo.data.username
          })
      })
    } else {
      //app。js内获取信息失败处理
    }
  },//获取用户信息的函数
  judgeriderstatus:function(){
    var accesstoken = dayuanren.get_access_token();
    var _this = this;
    if (accesstoken) {
      dayuanren.Tget("user/isRanger","",accesstoken,function(res){
        if(res.errno==0)//表示有提交过数据
        {
          var status = res.data.status;
          if(status==4)
          {
            _this.setData({
              failstatusreson: res.data.not_pass_reason
            })
          }
          _this.addressindexcheck(res.data.province, res.data.city, res.data.county);
          var sex = [
            { value: "男", selected: res.data.sex==0?true:false },
            { value: "女", selected: res.data.sex == 1 ? true : false }
          ];
          _this.setData({
            riderstatus: status,
            sfzzmurl:res.data.card_pic_1,
            sfzfmurl:res.data.card_pic_2,
            handsfzurl: res.data.hold_pic,
            idcardnumber: res.data.id_number,
            sex: sex,
            phone:res.data.mobile,
            realname:res.data.name
          })
        } else {//表示没有提交过数据
        }
      })
    }
  },//判断用户的游侠申请状态
  getaddressarea:function(){
    var _this=this;
    app.getAddressArea(function(res){
      var provs=[];
      var citlist=[];
      var countrylist=[];
      var objprovs = [];
      var objcitlist = [];
      var objcountrylist = [];
      for(var i=0;i<res.data.length;i++)
      {
        provs.push(res.data[i].name);
        objprovs.push({id:res.data[i].id,name:res.data[i].name});
        var cits=[];
        var countrys=[];
        var objcits=[];
        var objcountry=[];
        for(var j=0;j<res.data[i].sub.length;j++)
        {
          cits.push(res.data[i].sub[j].name);
          objcits.push({ id: res.data[i].sub[j].id, name: res.data[i].sub[j].name });
          var couts=[];
          var objcounts=[];
          for(var k=0;k<res.data[i].sub[j].sub.length;k++)
          {
            couts.push(res.data[i].sub[j].sub[k].name);
            objcounts.push({ id: res.data[i].sub[j].sub[k].id, name: res.data[i].sub[j].sub[k].name});
          }
          countrys.push(couts);
          objcountry.push(objcounts);
        }
        citlist.push(cits);
        countrylist.push(countrys);
        objcitlist.push(objcits);
        objcountrylist.push(objcountry);
      }
      _this.setData({
        provincearray: provs,
        cityarray: citlist,
        countryarray: countrylist,
        regionArray: [provs, citlist[0], countrylist[0][0]],
        objectregionArray: [objprovs, objcitlist, objcountrylist]
      })
      _this.judgeriderstatus();
    })
  },//获取地区列表
  addressindexcheck:function(pid,ctid,cid){
    var objectregionArray = this.data.objectregionArray;
    var provincearray = this.data.provincearray;
    var cityarray = this.data.cityarray;
    var countryarray = this.data.countryarray;
    var regionindex=[0,0,0];
    for(var i=0;i<objectregionArray[0].length;i++)
    {
      if (objectregionArray[0][i].id==pid)
      {
        regionindex[0]=i;
      }
    }
    for (var i = 0; i < objectregionArray[1][regionindex[0]].length; i++) {
      if (objectregionArray[1][regionindex[0]][i].id == ctid) {
        regionindex[1] = i;
      }
    }
    for (var i = 0; i < objectregionArray[2][regionindex[0]][regionindex[1]].length; i++) {
      if (objectregionArray[2][regionindex[0]][regionindex[1]][i].id == cid) {
        regionindex[2] = i;
      }
    }
    this.setData({
      regionIndex: regionindex,
      regionArray: [provincearray, cityarray[regionindex[0]], countryarray[regionindex[0]][regionindex[1]]]
    })
  },//根据地区id获取地区地址下标
  choosesfzzmimage:function(){
    if (this.data.riderstatus == -1) {
      var _this = this;
      this.setData({
        picselect: true
      }) 
      wx.chooseImage({
        count:1,
        success: function (res) {
          _this.setData({
            sfzzmurl: res.tempFilePaths,
            sfzzmselected: true,
            picselect:false
          })
        },
      })
    }
  },//身份证正面选择
  choosesfzfmimage: function () {
    if (this.data.riderstatus == -1) {
      this.setData({
        picselect: true
      })
      var _this = this;
      wx.chooseImage({
        count: 1,
        success: function (res) {
          _this.setData({
            sfzfmurl: res.tempFilePaths,
            sfzfmselected: true,
            picselect:false
          })
        },
      })
    }
  },//身份证反面选择
  choosehandimage: function () {
    if (this.data.riderstatus == -1) {
      var _this = this;
      this.setData({
        picselect: true
      })
      wx.chooseImage({
        count: 1,
        success: function (res) {
          _this.setData({
            handsfzurl: res.tempFilePaths,
            handsfzselected: true,
            picselect:false
          })
        },
      })
    }
  },//手持身份证选择
  sexselected:function(e){
    if (this.data.riderstatus==-1)
    {
      var sex = e.currentTarget.dataset.value;
      var sexs = sexvalue;
      var selectsex = 0;
      for (var i = 0; i < sexvalue.length; i++) {
        sexs[i].selected = false;
      }
      for (var i = 0; i < sexvalue.length; i++) {
        if (sexs[i].value == sex) {
          sexs[i].selected = true;
          selectsex = sexs[i].value=="男"?0:1;
        }
      }
      this.setData({
        sex: sexs,
        selectedsex: selectsex
      })
    }
  },//性别选择
  nameinput:function(e){
    this.setData({
      realname:e.detail.value
    })
  },//姓名输入
  telinput:function(e){
    this.setData({
      phone: e.detail.value
    })
  },//电话输入
  idcardinput:function(e){
    this.setData({
      idcardnumber: e.detail.value
    })
  },//身份证号码输入
  submit:function(){
    var _this=this;
    var objectregionArray = this.data.objectregionArray;
    var name = this.data.realname;
    var province = objectregionArray[0][this.data.regionIndex[0]].id;
    var city = objectregionArray[1][this.data.regionIndex[0]][this.data.regionIndex[1]].id;
    var region = objectregionArray[2][this.data.regionIndex[0]][this.data.regionIndex[1]][this.data.regionIndex[2]].id;
    var phone = this.data.phone;
    var sex = this.data.selectedsex;
    var idcard = this.data.idcardnumber;
    var sfzfront = this.data.sfzzmurl;
    var sfzback = this.data.sfzfmurl;
    var sfzhand = this.data.handsfzurl;
    if (province == null) {
      wx.showToast({
        title: '请选择地区',
        icon: "none"
      })
      return false;
    }
    if (city == null) {
      wx.showToast({
        title: '请选择地区',
        icon: "none"
      })
      return false;
    }
    if (region == null) {
      wx.showToast({
        title: '请选择地区',
        icon: "none"
      })
      return false;
    }
    if (name == null) {
      wx.showToast({
        title: '请输入您的姓名',
        icon: "none"
      })
      return false;
    }
    if (phone == null) {
      wx.showToast({
        title: '请输入您的手机号',
        icon: "none"
      })
      return false;
    }
    if (sex == null) {
      wx.showToast({
        title: '请选择您的性别',
        icon: "none"
      })
      return false;
    }
    if (idcard == null) {
      wx.showToast({
        title: '请输入您的身份证号码',
        icon: "none"
      })
      return false;
    }
    if (sfzfront == null) {
      wx.showToast({
        title: '请选择您的身份证正面照',
        icon: "none"
      })
      return false;
    }
    if (sfzback == null) {
      wx.showToast({
        title: '请选择您的身份证背面照',
        icon: "none"
      })
      return false;
    }
    if (sfzhand == null) {
      wx.showToast({
        title: '请选择您的手持身份证照片',
        icon: "none"
      })
      return false;
    }
    var data={
      name:name,
      mobile: phone,
      card_pic_1: sfzfront,
      card_pic_2: sfzback,
      sex: sex,
      hold_pic: sfzhand,
      id_number: idcard,
      province: province,
      city:city,
      county:region
    };
    var accesstoken = dayuanren.get_access_token();
    if(accesstoken)
    {
        dayuanren.Tpost("user/applyRanger", data,accesstoken,function(res){
           if(res.errno==0)
           {
             wx.showToast({
               title: "提交成功",
               icon: "none"
             })
             _this.setData({
               riderstatus:3
             })
           }else{
             if(res.errmsg)
             {
               wx.showToast({
                 title: res.errmsg,
                 icon: "none"
               })
             }
           }
        })
    }
  },//游侠信息提交
  resubmit:function(){
    this.setData({
      riderstatus: -1,
      sfzzmurl:null,
      sfzfmurl: null,
      handsfzurl: null,
      idcardnumber: null,
      sex: sexvalue,
      phone: null,
      realname: null,
    })
  },//重新提交
  regionChange: function (e) {
    this.setData({
      regionindex: e.detail.value
    })
  },//地区选择
  regioncolumnchange:function(e)
  {
    var regionArray= this.data.regionArray;
    var regionIndex= this.data.regionIndex;
    var cityarray=this.data.cityarray;
    var countryarray = this.data.countryarray;
    var provincearray = this.data.provincearray;
    regionIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0://当前选中的是第一列
        regionArray[1] = cityarray[regionIndex[e.detail.column]];
        regionArray[2] = countryarray[regionIndex[e.detail.column]][0];
        //选中第一列的省  加载第二列的所有的市的数据以及第三列的第一个市对应的区
        regionIndex[1] = 0;
        regionIndex[2] = 0;
        break;
      case 1://当前选中的是第二列
        regionArray[2] = countryarray[regionIndex[0]][regionIndex[e.detail.column]];
        //选中第二列的市  加载第三列的当前省的当前市的所有的区的数据
        regionIndex[2] = 0;
        break;
    }
    this.setData({
      regionArray: regionArray,
      regionIndex: regionIndex
    });
  }//地址选择的渲染
})