<template>
  <div id="addressAlert" v-show="show">
    <div class="main">
        <div class="title">所在地区</div>
        <div class="addr">
          <div :class="['city', addressNum === index ? 'active' : '']" v-for="(item, index) in addressAlert" :key="index" @click="addressClick(index)">{{item}}</div>
        </div>
        <div class="list">
          <div class="menu" v-for="(item, index) in addressData" :key="index" @click="cityClick(index, item)">{{item}}</div>
        </div>
      </div>
  </div>
</template>

<script>
import cityData from '../assets/js/city.js';
export default {
  name: 'addressAlert',
  data () {
    return {
      show: false,
      addressAlert: ['请选择', '请选择', '请选择'],
      addressNum: 0,
      addressData: {},
      addressIndex: ''
    };
  },
  created () {
    this.changeShow();
    this.beforeAddress();
  },
  methods: {
    changeShow () { // 监听事件
      this.$bus.$on('addressAlert', config => {
        this.show = config.show;
        this.callback = config.callback;
      });
    },
    // 首次地址
    beforeAddress () {
      this.addressData = cityData[86];
    },
    // 地址点击事件
    cityClick (index, city) {
      this.addressAlert[this.addressNum] = city;
      this.addressIndex = this.addressNum === 0 ? index : this.addressIndex;
      // console.log(!cityData[index]);
      if (!cityData[index] && this.addressNum === 1) {
        this.addressAlert[2] = '市区';
        this.addressNum = 2;
        this.show = false;
        this.addressSubmit();
        return false;
      }
      this.addressData = cityData[index];
      if (this.addressNum === 2) {
        this.show = false;
        this.addressSubmit();
        return false;
      }
      this.addressNum++;
    },
    // 地址提交
    addressSubmit () {
      this.callback(this.addressAlert);
      this.addressNum = 0;
      this.addressData = cityData[86];
      this.addressAlert = ['请选择', '请选择', '请选择'];
    },
    // 清楚选择地址，
    addressClick (index) {
      if (index === 0) {
        this.addressData = cityData[86];
        this.addressNum = 0;
        this.addressAlert = ['请选择', '请选择', '请选择'];
      } else {
        this.addressData = cityData[this.addressIndex];
        console.log(cityData[this.addressIndex]);
        this.addressNum = 1;
        this.addressAlert[index] = '请选择';
      }
    },
    close () {
      this.show = false;
      this.addressNum = 0;
      this.addressAlert = ['请选择', '请选择', '请选择'];
    }
  }
};
</script>

<style lang="scss">
  @import '../assets/scss/common_style.scss';
  #addressAlert{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.4);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    .main{
      width: 100%;
      height: 900px;
      background: #fff;
      position: absolute;
      left: 0;
      bottom: 0;
      .title{
        width: 100%;
        height: 94px;
        line-height: 94px;
        font-size: 28px;
        color: #282828;
        text-align: center;
        position: relative;
        .iconfont{
          position: absolute;
          right: 36px;
          top: 0;
          color: #a6a6a6;
        }
      }
      .addr{
        box-sizing: border-box;
        width: 100%;
        height: 86px;
        line-height: 86px;
        overflow: hidden;
        border-top: 1Px solid #e6e6e6;
        border-bottom: 1Px solid #e6e6e6;
        div{
          box-sizing: border-box;
          font-size: 26px;
          color: #282828;
          float: left;
          padding: 0 30px;
          height: 68px;
          position: relative;
          &.active{
            color: #f38d10;
            &:after{
              content: "";
              display: block;
              width: 110px;
              height: 2px;
              background: #f38d10;
              position: absolute;
              left: 15px;
              top: 80px;
            }
          }
        }
      }
      .list{
        height: 690px;
        overflow: auto;
        text-align: left;
        .top{
          font-size: 24px;
          color: #999;
          margin-left: 38px;
          margin-top: 30px;
        }
        .menu{
          box-sizing: border-box;
          width: 100%;
          height: 86px;
          line-height: 86px;
          font-size: 26px;
          color: #9290ae;
          padding: 0 30px;
          border-bottom: 1Px solid #e6e6e6;
        }
      }
    }
  }
</style>
