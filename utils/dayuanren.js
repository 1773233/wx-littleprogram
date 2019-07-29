var access_token = "xxxx";
var openid = "";
var userinfo = null;
var apiurl = "https://api.cdpaotui.com/api/";

function init() {
  get_access_token();
  get_userinfo();
}
//保存access_token 不  
function save_access_token(value) {
  access_token = value;
  setStorage("access_token", value);
}
//获取access_token
function get_access_token() {
  access_token = getStorage("access_token");
  return access_token;
}
//保存用户信息
function save_userinfo(value) {
  userinfo = value;
  setStorage("userinfo", value);
}
//获取用户信息
function get_userinfo() {
  userinfo = getStorage("userinfo");
  return userinfo;
}
//保存用户信息
function save_openid(value) {
  openid = value;
  setStorage("openid", value);
}
//获取用户信息
function get_openid() {
  openid = getStorage("openid");
  return openid;
}
//设置Storage
function setStorage(key, value, isSync = true) {
  if (isSync) {
    try {
      wx.setStorageSync(key, value);
    } catch (e) {
      wx.showToast({
        title: e,
        duration: 2000
      });
    }
  } else {
    wx.setStorage({
      key: key,
      data: value
    });
  }
}

//获取Storage
function getStorage(key, isSync = true) {
  if (isSync) {
    try {
      var value = wx.getStorageSync(key);
      if (value) {
        return value;
      }
    } catch (e) {
      wx.showToast({
        title: e,
        duration: 2000
      });
    }
  } else {
    wx.getStorage({
      key: key,
      success: function (res) {
        return res.data;
      },
      fail: function () {
        return '';
      }
    });
  }
}
//post请求
function dpost(method, data, callback) {
  wx.request({
    url: apiurl + method, //仅为示例，并非真实的接口地址
    data: data,
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        wx.hideLoading();
        callback(res.data);
      } else {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    },
    fail: function () {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '网络连接异常',
        icon: "none"
      })
    }
  })
}
function Tpost(method, data, token, callback) {
  wx.request({
    url: apiurl + method, //仅为示例，并非真实的接口地址
    data: data,
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'token':token
    },
    success: function (res) {
      if (res.statusCode == 200) {
        wx.hideLoading();
        wx.stopPullDownRefresh();        
        callback(res.data);
      } else {
        wx.hideLoading();
        wx.stopPullDownRefresh();        
        callback(res.data);
        wx.showToast({
          title: '意料之外的问题，请重试',
          icon: "none"
        })
      }
    },
    fail:function(){
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '网络连接异常',
        icon:"none"
      })
    }
  })
}
//get请求
function dget(method, data, callback) {
  wx.request({
    url: apiurl + method, //仅为示例，并非真实的接口地址
    data: data,
    method: "GET",
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        wx.hideLoading();
        callback(res.data);
      } else {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    },
    fail: function () {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '网络连接异常',
        icon: "none"
      })
    }
  })
}
function Tget(method, data, token, callback) {
  wx.request({
    url: apiurl + method, //仅为示例，并非真实的接口地址
    data: data,
    method: "GET",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'token':token
    },
    success: function (res) {
      if (res.statusCode == 200) {
        wx.hideLoading();
        callback(res.data);
      } else {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        wx.showToast({
          title: '意料之外的问题，请重试',
          icon: "none"
        })
      }
    },
    fail: function () {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '网络连接异常',
        icon: "none"
      })
    }
  })
}
//post请求
function cpost(method, data, callback) {
  var chda = cacheread(method, data);
  if (chda) {
    callback(chda);
  }
  wx.request({
    url: apiurl + method, //仅为示例，并非真实的接口地址
    data: data,
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    success: function (res) {
      wx.hideLoading();
      if (res.statusCode == 200) {
        if (JSON.stringify(res.data) != JSON.stringify(chda)) {
          cachewrite(method, data, res.data);
          callback(res.data);
        }
      } else {
        wx.showToast({
          title: '意料之外的问题，请重试',
          icon: "none"
        })
      }
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showToast({
        title: "网络连接异常",
        icon:"none",
        duration: 2000
      });
    }
  })
}
//get请求
function cget(method, data, callback) {
  var chda = cacheread(method, data);
  if (chda) {
    callback(chda);
  }
  wx.request({
    url: apiurl + method, //仅为示例，并非真实的接口地址
    data: data,
    method: "GET",
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      wx.hideLoading();
      if (res.statusCode == 200) {
        if (JSON.stringify(res.data) != JSON.stringify(chda)) {
          cachewrite(method, data, res.data);
          callback(res.data);
        }
      } else {
        wx.showToast({
          title: '意料之外的问题，请重试',
          icon: "none"
        })
      }
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showToast({
        title: "网络连接异常",
        icon: "none",
        duration: 2000
      });
    }
  })
}
function ctget(method, data,token, callback) {
  var chda = cacheread(method, data);
  if (chda) {
    callback(chda);
  }
  wx.request({
    url: apiurl + method, //仅为示例，并非真实的接口地址
    data: data,
    method: "GET",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'token': token
    },
    success: function (res) {
      wx.hideLoading();
      if (res.statusCode == 200) {
        if (JSON.stringify(res.data) != JSON.stringify(chda)) {
          cachewrite(method, data, res.data);
          callback(res.data);
        }
      } else {
        wx.showToast({
          title: '意料之外的问题，请重试',
          icon: "none"
        })
      }
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showToast({
        title: "网络连接异常",
        icon: "none",
        duration: 2000
      });
    }
  })
}
function ctpost(method, data, token, callback) {
  var chda = cacheread(method, data);
  if (chda) {
    callback(chda);
  }
  wx.request({
    url: apiurl + method, //仅为示例，并非真实的接口地址
    data: data,
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'token': token
    },
    success: function (res) {
      wx.hideLoading();
      if (res.statusCode == 200) {
        if (JSON.stringify(res.data) != JSON.stringify(chda)) {
          cachewrite(method, data, res.data);
          callback(res.data);
        }
      } else {
        wx.showToast({
          title: '意料之外的问题，请重试',
          icon: "none"
        })
      }
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showToast({
        title: "网络连接异常",
        icon: "none",
        duration: 2000
      });
    }
  })
}
//文件上传
function Tupload(method,data,token,callback){
  wx.uploadFile({
    url: apiurl + method,      //此处换上你的接口地址
    filePath: data,//选用wx.chooseimage这个API的返回值tempFilePaths[0]最佳
    name: 'file',
    header: {
      "Content-Type": "multipart/form-data",
      'accept': 'application/json',
      'token': token    //若有token，此处换上你的token，没有的话省略
    },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      } else {
        wx.hideLoading();
        wx.showToast({
          title: "网络连接异常",
          icon: "none",
          duration: 2000
        });
      }
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showToast({
        title: "网络连接异常",
        icon: "none",
        duration: 2000
      });
    }
  })
}

function cachedir(url, param) {
  url = url.replace("http://", "");
  url = url.replace("https://", "");
  url = url.replace(/\./g, "");
  url = url.replace(/\?/g, "");
  url = url.replace(/\=/g, "");
  url = url.replace(/\:/g, "");
  url = url.replace(/\//g, "");

  var value = "default";
  if (param) {
    value = hexMD5(JSON.stringify(param));
  }
  return url + value;
}
function cachewrite(url, param, data) {
  wx.setStorage({
    key: cachedir(url, param),
    data: data
  })
}
function cacheread(url, param) {
  return wx.getStorageSync(cachedir(url, param));
}

//时间戳转时间字符串
function timestamptostr(timestamp) {
  var date = new Date(parseInt(timestamp) * 1000);
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
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute;// ':' + second;
}

function datastamptostr(timestamp) {
  var date = new Date(parseInt(timestamp) * 1000);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  return y + '.' + m + '.' + d;
}

//判断是否为空，包括{}和[]
function judgeNull(value) {
  if (value == null || value == undefined) return true
  if (this.judgeString(value)) {
    if (value.trim().length == 0) return true
  } else if (this.judgeArray(value)) {
    if (value.length == 0) return true
  } else if (this.judgeObject(value)) {
    for (let name in value) return false
    return true
  }
  return false;
}
//判断是否为字符串类型
function judgeString(value) {
  return value != null && value != undefined && value.constructor == String
}
//判断是否为数字类型
function judgeNumber(value) {
  return value != null && value != undefined && value.constructor == Number
}
//判断是否为布尔类型
function judgeBoolean(value) {
  return value != null && value != undefined && value.constructor == Boolean
}
//判断是否为数组类型
function judgeArray(value) {
  return value != null && value != undefined && value.constructor == Array
}
//判断是否为对象类型
function judgeObject(value) {
  return value != null && value != undefined && value.constructor == Object
}
//判断是否为方法类型
function judgeFunction(value) {
  return value != null && value != undefined && value.constructor == Function
}
//合并对象，深层克隆 参数ob1,ob2...
function mergeObject() {
  let newObject = {}
  for (let a = 0; a < arguments.length; a++) {
    let mergeObject = arguments[a]
    for (let prototype in mergeObject) {
      let mergeObjectPrototype = mergeObject[prototype]
      if (this.judgeObject(mergeObjectPrototype)) {
        newObject[prototype] = this.mergeObject({}, mergeObjectPrototype)
      } else if (this.judgeArray(mergeObjectPrototype) && this.judgeObject(mergeObjectPrototype[0])) {
        let newArray = []
        for (let b = 0; b < mergeObjectPrototype.length; b++) {
          newArray.push(this.mergeObject({}, mergeObjectPrototype[a]))
        }
        newObject[prototype] = newArray
      } else {
        newObject[prototype] = mergeObjectPrototype
      }
    }
  }
  return newObject
}
//同微信官方getApp
function getApp() {
  return getApp()
}
//同微信官方getCurrentPages
function getCurrentPages() {
  return getCurrentPages()
}
//获取当前页
function getCurrentPage() {
  let pages = this.getCurrentPages()
  return pages[pages.length - 1]
}
//获取当前页路径
function getCurrentPath() {
  return this.getCurrentPage().__route__
}
function getPath(targetPath) {
  let currentPath = this.getCurrentPath()
  return this.getRelativePath(currentPath, targetPath)
}
//	获取两个路径之间相对路径
function getRelativePath(currentPath, targetPath) {
  let currentPathArray = currentPath.split('/')
  let targetPathArray = targetPath.split('/')
  let samePath = false
  let levelNumber = 0
  let relativePath = ''
  for (let a = 0; a < currentPathArray.length; a++) {
    let currentPathData = currentPathArray[a]
    for (let b = 0; b < targetPathArray.length; b++) {
      let targetPathData = targetPathArray[b]
      if (targetPathData == currentPathData) {
        levelNumber = currentPathArray.length - b - 1
        samePath = true
        break
      }
    }
  }
  if (samePath) {
    for (let a = 0; a < levelNumber - 1; a++) {
      relativePath += '../'
    }
    for (let a = levelNumber; a > 0; a--) {
      let targetPathData = targetPathArray[a]
      if (a == 1) relativePath += targetPathData
      else relativePath += targetPathData + '/'
    }
  } else {
    levelNumber = currentPathArray.length - 1
    for (let a = 0; a < levelNumber; a++) {
      relativePath += '../'
    }
    for (let a = 0; a < targetPathArray.length; a++) {
      let targetPathData = targetPathArray[a]
      if (a == targetPathArray.length - 1) relativePath += targetPathData
      else relativePath += targetPathData + '/'
    }
  }
  return relativePath
}
//获取时间戳
function getTimestamp() {
  return Date.parse(new Date())
}

function safe_add(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF)
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
  return (msw << 16) | (lsw & 0xFFFF)
}

/*  
 * Bitwise rotate a 32-bit number to the left.  
 */
function rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt))
}

/*  
 * These functions implement the four basic operations the algorithm uses.  
 */
function cmn(q, a, b, x, s, t) {
  return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
}
function ff(a, b, c, d, x, s, t) {
  return cmn((b & c) | ((~b) & d), a, b, x, s, t)
}
function gg(a, b, c, d, x, s, t) {
  return cmn((b & d) | (c & (~d)), a, b, x, s, t)
}
function hh(a, b, c, d, x, s, t) {
  return cmn(b ^ c ^ d, a, b, x, s, t)
}
function ii(a, b, c, d, x, s, t) {
  return cmn(c ^ (b | (~d)), a, b, x, s, t)
}

/*  
 * Calculate the MD5 of an array of little-endian words, producing an array  
 * of little-endian words.  
 */
function coreMD5(x) {
  var a = 1732584193
  var b = -271733879
  var c = -1732584194
  var d = 271733878

  for (var i = 0; i < x.length; i += 16) {
    var olda = a
    var oldb = b
    var oldc = c
    var oldd = d

    a = ff(a, b, c, d, x[i + 0], 7, -680876936)
    d = ff(d, a, b, c, x[i + 1], 12, -389564586)
    c = ff(c, d, a, b, x[i + 2], 17, 606105819)
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330)
    a = ff(a, b, c, d, x[i + 4], 7, -176418897)
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426)
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341)
    b = ff(b, c, d, a, x[i + 7], 22, -45705983)
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416)
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417)
    c = ff(c, d, a, b, x[i + 10], 17, -42063)
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162)
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682)
    d = ff(d, a, b, c, x[i + 13], 12, -40341101)
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290)
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329)

    a = gg(a, b, c, d, x[i + 1], 5, -165796510)
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632)
    c = gg(c, d, a, b, x[i + 11], 14, 643717713)
    b = gg(b, c, d, a, x[i + 0], 20, -373897302)
    a = gg(a, b, c, d, x[i + 5], 5, -701558691)
    d = gg(d, a, b, c, x[i + 10], 9, 38016083)
    c = gg(c, d, a, b, x[i + 15], 14, -660478335)
    b = gg(b, c, d, a, x[i + 4], 20, -405537848)
    a = gg(a, b, c, d, x[i + 9], 5, 568446438)
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690)
    c = gg(c, d, a, b, x[i + 3], 14, -187363961)
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501)
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467)
    d = gg(d, a, b, c, x[i + 2], 9, -51403784)
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473)
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734)

    a = hh(a, b, c, d, x[i + 5], 4, -378558)
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463)
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562)
    b = hh(b, c, d, a, x[i + 14], 23, -35309556)
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060)
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353)
    c = hh(c, d, a, b, x[i + 7], 16, -155497632)
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640)
    a = hh(a, b, c, d, x[i + 13], 4, 681279174)
    d = hh(d, a, b, c, x[i + 0], 11, -358537222)
    c = hh(c, d, a, b, x[i + 3], 16, -722521979)
    b = hh(b, c, d, a, x[i + 6], 23, 76029189)
    a = hh(a, b, c, d, x[i + 9], 4, -640364487)
    d = hh(d, a, b, c, x[i + 12], 11, -421815835)
    c = hh(c, d, a, b, x[i + 15], 16, 530742520)
    b = hh(b, c, d, a, x[i + 2], 23, -995338651)

    a = ii(a, b, c, d, x[i + 0], 6, -198630844)
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415)
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905)
    b = ii(b, c, d, a, x[i + 5], 21, -57434055)
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571)
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606)
    c = ii(c, d, a, b, x[i + 10], 15, -1051523)
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799)
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359)
    d = ii(d, a, b, c, x[i + 15], 10, -30611744)
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380)
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649)
    a = ii(a, b, c, d, x[i + 4], 6, -145523070)
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379)
    c = ii(c, d, a, b, x[i + 2], 15, 718787259)
    b = ii(b, c, d, a, x[i + 9], 21, -343485551)

    a = safe_add(a, olda)
    b = safe_add(b, oldb)
    c = safe_add(c, oldc)
    d = safe_add(d, oldd)
  }
  return [a, b, c, d]
}

/*  
 * Convert an array of little-endian words to a hex string.  
 */
function binl2hex(binarray) {
  var hex_tab = "0123456789abcdef"
  var str = ""
  for (var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
      hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF)
  }
  return str
}

/*  
 * Convert an array of little-endian words to a base64 encoded string.  
 */
function binl2b64(binarray) {
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  var str = ""
  for (var i = 0; i < binarray.length * 32; i += 6) {
    str += tab.charAt(((binarray[i >> 5] << (i % 32)) & 0x3F) |
      ((binarray[i >> 5 + 1] >> (32 - i % 32)) & 0x3F))
  }
  return str
}

/*  
 * Convert an 8-bit character string to a sequence of 16-word blocks, stored  
 * as an array, and append appropriate padding for MD4/5 calculation.  
 * If any of the characters are >255, the high byte is silently ignored.  
 */
function str2binl(str) {
  var nblk = ((str.length + 8) >> 6) + 1 // number of 16-word blocks    
  var blks = new Array(nblk * 16)
  for (var i = 0; i < nblk * 16; i++) blks[i] = 0
  for (var i = 0; i < str.length; i++)
    blks[i >> 2] |= (str.charCodeAt(i) & 0xFF) << ((i % 4) * 8)
  blks[i >> 2] |= 0x80 << ((i % 4) * 8)
  blks[nblk * 16 - 2] = str.length * 8
  return blks
}

/*  
 * Convert a wide-character string to a sequence of 16-word blocks, stored as  
 * an array, and append appropriate padding for MD4/5 calculation.  
 */
function strw2binl(str) {
  var nblk = ((str.length + 4) >> 5) + 1 // number of 16-word blocks    
  var blks = new Array(nblk * 16)
  for (var i = 0; i < nblk * 16; i++) blks[i] = 0
  for (var i = 0; i < str.length; i++)
    blks[i >> 1] |= str.charCodeAt(i) << ((i % 2) * 16)
  blks[i >> 1] |= 0x80 << ((i % 2) * 16)
  blks[nblk * 16 - 2] = str.length * 16
  return blks
}

/*  
 * External interface  
 */
function hexMD5(str) { return binl2hex(coreMD5(str2binl(str))) }
function hexMD5w(str) { return binl2hex(coreMD5(strw2binl(str))) }
function b64MD5(str) { return binl2b64(coreMD5(str2binl(str))) }
function b64MD5w(str) { return binl2b64(coreMD5(strw2binl(str))) }
/* Backward compatibility */
function calcMD5(str) { return binl2hex(coreMD5(str2binl(str))) }

module.exports = {
  setStorage: setStorage,
  getStorage: getStorage,
  access_token: access_token,
  apiurl: apiurl,
  userinfo: userinfo,
  get_userinfo:get_userinfo,
  save_userinfo:save_userinfo,
  get_access_token:get_access_token,
  save_access_token:save_access_token,
  openid: openid,
  timestamptostr: timestamptostr,
  datastamptostr:datastamptostr,
  dget: dget,
  dpost: dpost,
  cpost: cpost,
  cget: cget,
  getTimestamp: getTimestamp,
  getRelativePath: getRelativePath,
  getPath: getPath,
  getCurrentPath: getCurrentPath,
  getCurrentPage: getCurrentPage,
  getCurrentPages: getCurrentPages,
  getApp: getApp,
  mergeObject: mergeObject,
  judgeFunction: judgeFunction,
  judgeObject: judgeObject,
  judgeArray: judgeArray,
  judgeBoolean: judgeBoolean,
  judgeNumber: judgeNumber,
  judgeString: judgeString,
  judgeNull: judgeNull,
  hexMD5: hexMD5,
  Tpost:Tpost,//llg add
  Tget:Tget,//llg add
  ctget:ctget,//llg add
  Tupload:Tupload,//llg add
  cachewrite: cachewrite,//llg add
  cacheread: cacheread,//llg add
  ctpost: ctpost
}