import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

// 数据
const state={
    count: '123122',
    myaddress: {},  //选中地址
    readdress: {},  //修改地址
    dingwei: {},    //定位地址
}

// mutations方法
const mutations={
    // 接收存入的值
    increment (state, payload) {
      state.myaddress = payload.myaddress;
      state.readdress = payload.readdress;
      state.dingwei = payload.dingwei;
    },   
}

// getters方法
const getters = {
}

// actions方法
const actions ={
}

export default new Vuex.Store({
	state,mutations,getters,actions
})