// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router/app';
import axios from 'axios';
import Qs from 'qs';
import store from './vuex/store';

// 引入组件
import './assets/js/component';
import './assets/js/compress';
require('animate.css');

//引入mint-ui
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
Vue.use(Mint);

// 引入百度地图
// import BaiduMap from 'vue-baidu-map';
// Vue.use(BaiduMap, {
//   ak: 'ZYLW9so4V2ypx7az6smCreNeVwZE8Ohk'
// })

// import BScroll from "better-scroll";
// Vue.use(BScroll);

Vue.config.productionTip = false;

// 创建全局eventbus
Vue.prototype.$bus = new Vue();

// 限制跳转
// const Other = ['login', 'register', 'forget', 'index', 'cooker', 'cookerDetail', 'index'];
// router.beforeEach((to, from, next) => {
//   // 跳转前判断是否登录
//   if (Other.join('*').match(to.fullPath.replace('/', '')) || Other.join('*').match(to.name) !== null) {
//     next();
//   } else {
//     Vue.prototype.axios.post('login/verifylogin',{
//       token: localStorage.getItem('token')
//     })
//       .then(({data}) => {
//         console.log(data);
//         // 如果返回值为201，则跳转到绑定
//         if (data.code === '201') {
//           router.push('register');
//         } else {
//           next();
//         }
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }
// });

//设置cookie,增加到vue实例方便全局调用
Vue.prototype.setCookie = function (cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
};
// 获取
Vue.prototype.getCookie = function (cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
  }
  return "";
};
// 删除
Vue.prototype.delCookie = function (name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = this.getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
// 是否是微信浏览器
Vue.prototype.IsWechat = () => {
  if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) {
    return true;
  } else {
    return false;
  }
};

// 获取token
Vue.prototype.token = function () {
  if (localStorage.token) {
    var getToken = localStorage.getItem('token');
  }
  return getToken;
};

// 获取openid
Vue.prototype.openid = function () {
  if (!localStorage.openid) {
    var getopenid = localStorage.getItem('openid');
    return getopenid;
  } else {
    return false;
  }
};
// 计算当前时间
Vue.prototype.loadingTime = function () {
  var timeArray = [];
  for (var i = 0; i < 30; i++) {
    var weekDayArr = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六"
    ]; //星期映射数组
    var myDate = new Date();
    var milliseconds = myDate.getTime() + 1000 * 60 * 60 * 24 * i; //当i为0代表当前日期，为1时可以得到明天的日期，以此类推
    var newMyDate = new Date(milliseconds);
    var weekDay = newMyDate.getDay(); //获取当前星期X(0-6,0代表星期天)
    var year = newMyDate.getFullYear(); //获取当前年
    var month = newMyDate.getMonth() + 1; //获取当前月
    var month1;
    month < 10 ? (month1 = "0" + month) : (month1 = month);
    var day = newMyDate.getDate(); //获取当前日
    var day1;
    day < 10 ? (day1 = "0" + day) : (day1 = day);
    var timelis = month1 + "-" + day1;
    //  console.log(year+'/'+month+'/'+day+weekDayArr[weekDay])
    timeArray.push(timelis);
  }
  // console.log(timeArray);
  this.slots[0].values = timeArray;
},
// 获取当前月份天数
Vue.prototype.monthnum =function (){
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var d = new Date(year, month, 0);
  return d.getDate();
}
  // 计算当前时间
Vue.prototype.today = function () {
    var time = new Date();
    var m = time.getMonth() + 1;
    var t = time.getFullYear() + "-" + m + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()
    return t;
};
// 计算当前时间(时)
Vue.prototype.today1 = function () {
  var time = new Date();
  var m = time.getMonth() + 1;
  var t = m + "-" + time.getDate() + " " + time.getHours() + ":00"
  return t;
};
// 时间前半段
Vue.prototype.nowTime = function () {
  var time = new Date();
  var m = time.getMonth() + 1;
  var t = time.getFullYear() + "-" + m + "-"
  return t;
};

Vue.prototype.$axios = axios;

// 全局过滤器，手机号中间四位隐藏
Vue.filter('hideTel', function (value) {
  if (!value) {
    return;
  }
  if (typeof (value) !== 'string') {
    value = value.toString();
  }
  return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
});

// 局部过滤器，隐藏地址
Vue.filter('hideAddress', function (value) {
  if (!value) {
    return;
  }
  if (typeof value !== "string") {
    value = value.toString();
  }
  return value.slice(0, value.indexOf("市") + 1).concat("****");
});
// 厨师等级
Vue.filter('grade', function (value) {
  const grade = ['普通','初级','中级','高级','技师','高级技师']
  return grade[value];
});

// axios请求
Vue.prototype.axios = axios.create({
  baseURL: 'http://cschushi.cadhx.com/api/',
  timeout: 10000,
  withCredentials: true,
  transformRequest: [function (data) {
    data = Qs.stringify(data);
    return data;
  }],
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

window.hasgo = true;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
