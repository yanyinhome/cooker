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
      <div @click="wornmes" class="box"><div class="img"><img src="../assets/image/cimg2.png"></div><p>会员中心</p></div>
      <div @click="wornmes" class="box"><div class="img"><img src="../assets/image/cimg4.png"></div><p>优惠券</p></div>
      <div @click="wornmes" class="box"><div class="img"><img src="../assets/image/cimg1.png"></div><p>意见反馈</p></div>
      <div @click="navVisible" class="box"><div class="img"><img src="../assets/image/cimg3.png"></div><p>联系客服</p></div>
       <router-link to="putForward" tag="div" class="box"><div class="img"><i class="iconfont icon-jinbitixian"></i></div><p>退款</p></router-link>
      <!-- <div class="box box2"><div class="img"><img src="../assets/image/cimg3.png"></div> <a href="tel://19995246697">客服1</a>&emsp;<a href="tel://19995247697">客服2</a></div> -->
      <!-- <router-link to="setPassword" tag="div" class="box"><div class="img"><img src="../assets/image/password.png"></div><p>密码设置</p></router-link> -->
      <!-- <div @click="signOut" class="box"><div class="img"><img src="../assets/image/tuichu.png"></div><p>退出登录</p></div> -->
    </div>

    <div class="comAlert" v-show="show">
         <div class="alertbox">
             <div class="alerttop">
                 <div class="box1"><a href="tel://19995246697">19995246697</a></div>
                 <div class="box1 box2" ><a href="tel://19995247697">19995247697</a></div>
             </div>
             <div class="alertfoot" @click="show=false">取消</div>
         </div>
     </div> 

    <com-foot :select="4"></com-foot>
  </div>
</template>

<script>
export default {
  name: "usercenter",
  data() {
    return {
      show: false,
      active:false,
      message: {
        name: "",
        img1: '',
        img2: '',
        phone: "",
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
    navVisible() {
      this.show = true;
    },
    toOrder () {
      this.$router.push('sureOrder');
    },
    wornmes () {
      this.$bus.$emit('toast', '功能开放中');
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
      line-height: 40px;
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
        .iconfont {
          font-size: 55px;
          color: #ff7116;
        }
      }
      p {
        font-size: 26px;
      }
    }
  }
  .comAlert {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 50;
    background: rgba(4, 4, 15, 0.4);
    .alertbox {
      width: 686px;
      height: 312px;
      position: absolute;
      bottom: 20px;
      left: 32px;
      .alerttop {
        height: 202px;
        background-color: rgba(255, 255, 255, 1);
        border-radius: 10px;
        text-align: center;
        .box1 {
          height: 100px;
          line-height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            font-size: 28px;
          }
          img {
            width: 30px;
            height: 30px;
          }
           a {
            text-decoration:none; 
            color:#222; 
          }
        }
        .box2 {
          border-top: 1Px solid #eee;
          img {
            width: 40px;
            height: 36px;
          }
        }
      }
      .alertfoot {
        margin-top: 10px;
        height: 100px;
        font-size: 32px;
        text-align: center;
        line-height: 100px;
        background: rgba(255, 255, 255, 1);
        border-radius: 10px;
      }
    }
  }
}
</style>