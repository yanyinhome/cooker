<template>
  <div id="pageFoot">
    <div class="page_foot_inner">
      <div class="page_foot_nav" :class="{'page_foot_select': select === index}" v-for="(item, index) in routeList" :key="index" @click="footRoute(item.route)">
        <!-- <p :class="[select === index ? item.iconfont1 : item.iconfont, select === index ? 'select' : '', 'page_foot_iconfont', 'iconfont']"></p> -->
        
        <div class="navlist"><img :src="[select === index ? item.iconfont1 : item.iconfont,]" v-if="index!==2"></div>
        <!-- <img :src="item.iconfont1"> -->
        <p :class="[select === index ? 'selectText' : '', 'page_foot_name']" class="" v-if="index!==2">{{ item.name }}</p>
      </div>
      <div class="fabu" @click="fabu()"><img src="../assets/image/fabu.png"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pageFoot',
  data () {
    return {
      routeList: [
        // 底部信息
        {
          iconfont: require("../assets/image/nav2.png"),
          iconfont1: require('../assets/image/nav1.png'),
          name: '首页',
          route: '/index'
        },
        {
          iconfont: require("../assets/image/nav4.png"),
          iconfont1: require("../assets/image/nav3.png"),
          name: '厨师',
          route: '/cooker'
        },
        {
          iconfont: require("../assets/image/fabu.png"),
          iconfont1: require("../assets/image/fabu.png"),
          name: '厨师',
          route: '/cooker'
        },
        {
          iconfont: require("../assets/image/nav6.png"),
          iconfont1: require("../assets/image/nav5.png"),
          name: '订单',
          route: '/order'
        },
        {
          iconfont: require("../assets/image/nav8.png"),
          iconfont1: require("../assets/image/nav7.png"),
          name: '我的',
          route: '/userCenter'
        }
      ]
    };
  },
  methods: {
    footRoute (route) {
      this.$router.push({path: route});
    },
    fabu () {
      this.$router.push('fabu');
    }
  },
  props: [
    'select'
  ]
};
</script>

<style lang="scss">
  @import '../assets/scss/common_style.scss';
  #pageFoot {
    position: fixed;
    top: 100vh;
    left: 50%;
    width: 750px;
    margin-left: -375px;
    .page_foot_inner {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 98px;
      background: #212121;
      .page_foot_nav {
        width: 20%;
        float: left;
        text-align: center;
        color: #AFAFAF;
        // background-color: red;
        .navlist {
          margin: 0 auto;
          margin-top: 13px;
          width: 46px;
          height: 46px;
          img {
          width: 100%;
          height: 100%;
          // font-size: 46px;
          // line-height: 46px;
          // padding-top: 10px;
          // width: 50px;
          // height: 50px;
        }
        }
        .page_foot_name {
          font-size: 20px;
          line-height: 40px;
        }
        &.page_foot_select {
          .page_foot_iconfont {
            color: #FFB84B;
          }
          .page_foot_name {
            color: #FFB84B;
          }
        }
      }
      .fabu {
        width: 120px;
        height: 120px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        img {
          width: 100%;
        }
      }
    }
  }
</style>
