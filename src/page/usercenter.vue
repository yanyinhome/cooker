<template>
  <div id='usercenter'>
    <com-head :opacity='1'>{{message.user_name}}</com-head>
    <div class="detailhead">
      <div class="headimg"><img :src="message.user_avat"></div>
      <p>{{message.user_name}}</p>
      <p>{{message.user_mobile}}</p>
      <div class="lianjie"><img src="../assets/image/lianjie.png"></div>
      <div class="lianjie2"><img src="../assets/image/lianjie.png"></div>
    </div>
    <div class="centernav">
      <router-link to="information" tag="div" class="box"><div class="img"><img src="../assets/image/person.png"></div><p>个人资料</p></router-link>
      <router-link to="myaddress" tag="div" class="box"><div class="img"><img src="../assets/image/address.png"></div><p>地址管理</p></router-link>
      <router-link to="collection" tag="div" class="box"><div class="img"><img src="../assets/image/shoucang.png"></div><p>我的收藏</p></router-link>
      <router-link to="certification" tag="div" class="box"><div class="img"><img src="../assets/image/cookers.png"></div><p>认证厨师</p></router-link>
      <router-link v-if="message.status=='1'" to="qiangOrder" tag="div" class="box"><div class="img"><img src="../assets/image/qiangdan.png"></div><p>厨师抢单</p></router-link>
      <router-link v-if="message.status=='1'" to="serverOrder" tag="div" class="box"><div class="img"><img src="../assets/image/server.png"></div><p>我的订单</p></router-link>
      <router-link to="setPassword" tag="div" class="box"><div class="img"><img src="../assets/image/password.png"></div><p>密码设置</p></router-link>
      <div @click="signOut" class="box"><div class="img"><img src="../assets/image/tuichu.png"></div><p>退出登录</p></div>
    </div>
    <com-foot :select="4"></com-foot>
  </div>
</template>

<script>
export default {
  name: "usercenter",
  data() {
    return {
      active:false,
      message: {
        name: "张三",
        img1: require("../assets/image/zanshi/touxiang.jpg"),
        img2: require("../assets/image/login1.png"),
        phone: "188888888888",
      },
    };
  },

  computed: {},

  created() {
  },

  mounted() {
    this.loading();
  },

  methods: {
    loading () {
      this.axios.post('user/index',{
        token: this.token()
      })
        .then(({data}) => {
          console.log(data)
          if (data.code === '200') {
            this.message = data.data;
          } else if (data.code === '201') {
            this.$bus.$emit('toast', data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    signOut () {
      this.axios.post('login/outLogin',{
        token: this.token()
      })
        .then(({data}) => {
          console.log(data)
          if (data.code === '200') {
            this.$router.push('/');
            this.$bus.$emit('toast', data.msg);
          } else if (data.code === '201') {
            this.$bus.$emit('toast', data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    toOrder () {
      this.$router.push('sureOrder');
    }  
 }
};
</script>
<style lang='scss'>
#usercenter {
  padding-bottom: 100px;
  padding-top: 120px;
  background: url("../assets/image/navbg.png") no-repeat;
  background-size: 100%;
  #pageHead {
    color: #fff;
    background: #212121;
    .icon-fanhui {
      display: none;
    }
  }
  .detailhead {
    width:690px;
    height:336px;
    margin: 0 auto;
    padding-top: 40px;
    box-sizing: border-box;
    border-radius:20px;
    background-color: #fff;
    padding-bottom: 20px;
    text-align: center;
    position: relative;
    .headimg {
      margin: 0 auto;
      width: 160px;
      height: 160px;
      border-radius: 80px;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    p:nth-of-type(1) {
      font-size: 32px;
      line-height: 70px;
    }
    p:nth-of-type(2) {
      font-size: 30px;
      line-height: 40px;
    }
    .lianjie {
      width: 24px;
      height: 114px;
      position: absolute;
      bottom: -70px;
      left: 56px;
      img {
        width: 100%;
      }
    }
    .lianjie2 {
      @extend .lianjie;
      left: 602px;
    }
  }
  .centernav {
    width:690px;
    // height:642px;
    margin: 30px auto;
    padding-top: 50px;
    background:rgba(255,255,255,1);
    border-radius:20px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .box {
      width: 110px;
      height: 110px;
      margin: 40px 60px;
      text-align: center;
      .img {
        margin: 0 auto;
        width: 55px;
        height: 55px;
        overflow: hidden;
        img {
          height: 100%;
        }
      }
      p {
        font-size: 26px;
      }
    }
  }
}
</style>