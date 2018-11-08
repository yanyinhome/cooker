import Vue from 'vue';
import Router from 'vue-router';
import index from '../page/index';                        //首页
import cooker from '../page/cooker';                      //厨师
import order from '../page/order';                        //订单
import usercenter from '../page/usercenter';              //我的
import login from '../page/login';                        //登录
import register from '../page/register';                  //注册
import forget from '../page/forget';                      //忘记密码

import fabu from '../page/fabu';                          //发布
import dingwei from '../page/dingwei';                    //定位地址
import myaddress from '../page/myaddress';                //地址
import cookerDetail from '../page/cookerDetail';          //厨师详情
import sureOrder from '../page/sureOrder';                //确认订单
import waitOrder from '../page/waitOrder';                //等待接单
import addAddress from '../page/addAddress';              //添加地址，修改地址
import chooseAddress from '../page/chooseAddress';        //选择地址
import evaluate from '../page/evaluate';                  //评价厨师

import information from '../page/information';             //个人资料
import collection from '../page/collection';               //我的收藏
import certification from '../page/certification';         //认证厨师
import cookerCheck from '../page/cookerCheck';             //厨师审核
import qiangOrder from '../page/qiangOrder';               //我要抢单
import serverOrder from '../page/serverOrder';             //服务订单
import setPassword from '../page/setPassword';             //设置密码

import protocol from '../page/protocol';                   //协议

import city from '../page/city';                           //三级联动




Vue.use(Router);


export default new Router({
	mode: 'history',
	base: '/',
	routes: [
		{
			path: '/index',
			component: index,
			name: 'index'
		}, {
			path: '/cooker',
			component: cooker,
			name: 'cooker'
		}, {
			path: '/order',
			component: order,
			name: 'order'
		}, {
			path: '/usercenter',
			component: usercenter,
			name: 'usercenter'
		}, {
			path: '/',
			component: login,
			name: 'login'
		}, {
			path: '/register',
			component: register,
			name: 'register'
		}, {
			path: '/forget',
			component: forget,
			name: 'forget'
		}, {
			path: '/fabu',
			component: fabu,
			name: 'fabu'
		}, {
			path: '/dingwei',
			component: dingwei,
			name: 'dingwei'
		}, {
			path: '/myaddress',
			component: myaddress,
			name: 'myaddress'
		}, {
			path: '/cookerDetail',
			component: cookerDetail,
			name: 'cookerDetail'
		}, {
			path: '/sureOrder',
			component: sureOrder,
			name: 'sureOrder'
		}, {
			path: '/addAddress',
			component: addAddress,
			name: 'addAddress'
		}, {
			path: '/chooseAddress',
			component: chooseAddress,
			name: 'chooseAddress'
		}, {
			path: '/evaluate',
			component: evaluate,
			name: 'evaluate'
		}, {
			path: '/information',
			component: information,
			name: 'information'
		}, {
			path: '/collection',
			component: collection,
			name: 'collection'
		}, {
			path: '/certification',
			component: certification,
			name: 'certification'
		}, {
			path: '/qiangOrder',
			component: qiangOrder,
			name: 'qiangOrder'
		}, {
			path: '/serverOrder',
			component: serverOrder,
			name: 'serverOrder'
		}, {
			path: '/setPassword',
			component: setPassword,
			name: 'setPassword'
		}, {
			path: '/cookerCheck',
			component: cookerCheck,
			name: 'cookerCheck'
		}, {
			path: '/waitOrder',
			component: waitOrder,
			name: 'waitOrder'
		}, {
			path: '/city',
			component: city,
			name: 'city'
		}, {
			path: '/protocol',
			component: protocol,
			name: 'protocol'
		},
	],
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			document.scrollingElement.scrollTop = 0;
		}
	}
});