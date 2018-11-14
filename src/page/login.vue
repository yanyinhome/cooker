<template>
  <div id='login'>
      <div class="login_top"></div>
      <div class="login_inp">
          <div class="box1"><img src="../assets/image/login2.png" ></div>
          <input type="text" v-model="phone" placeholder="请输入你的手机号">
      </div>
      <div class="login_inp logn_mima">
          <div class="box1"><img src="../assets/image/login3.png" ></div>
          <input type="password" v-model="password" placeholder="请输入你的密码">
      </div>
      <router-link tag='div' to='forget' class="forget">忘记密码？找回</router-link>
      <com-button :click="loginTo">登录</com-button>
      <div class="register">还没有帐号？<router-link tag='span' to='register'>注册</router-link></div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      phone: "",
      password: ""
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.IsWechat()) {
        vm.$bus.$emit("toast", "是微信浏览器");
        window.location.href = 'http://cschushi.cadhx.com/api/wechat/set_openid';
        // vm.login();
      } else {
        vm.$bus.$emit("toast", "请在微信浏览器中打开");
      }
      
    });
  },
  created() {
    if (this.IsWechat()) {
    } else {
    }
  },
  mounted() {},
  methods: {
    // login () {
    //   alert(1)
    //   this.axios.post("wechat/set_openid")
    //       .then(({ data }) => {
    //         console.log(data);
    //           alert(2)
    //         if (data.code === "200") {
    //           this.$bus.$emit("toast", data.msg);
    //         } else if (data.code === "201") {
    //           this.$bus.$emit("toast", data.msg);
    //         }
    //       })
    // },
    loginTo() {
      if (!this.phone || !this.password) {
        this.$bus.$emit("toast", "账号/密码不能为空");
      } else {
        this.axios
          .post("login/login", {
            user_mobile: this.phone,
            user_pwd: this.password
          })
          .then(({ data }) => {
            console.log(data);
            if (data.code === "200") {
              this.$router.push("index");
              if (localStorage.token) {
                localStorage.removeItem("token");
                localStorage.setItem("token", data.token);
              } else {
                localStorage.setItem("token", data.token);
              }
              this.$bus.$emit("toast", data.msg);
            } else if (data.code === "201") {
              this.$bus.$emit("toast", data.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
#login {
  padding-top: 140px;
  //  padding-bottom: 30px;
  text-align: center;
  .login_top {
    width: 460px;
    height: 390px;
    margin: 0 auto;
    box-sizing: border-box;
    background: url("../assets/image/login1.png");
    background-size: cover;
  }
  .login_inp {
    margin: 120px 60px 0;
    padding: 40px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    .box1 {
      width: 38px;
      height: 46px;
      img {
        // width: 100%;
        height: 100%;
      }
    }
    input {
      width: 550px;
      // height: 60px;
      margin-left: 20px;
      background: #fafafa;
    }
    input::-webkit-input-placeholder {
      /* WebKit browsers */
      color: #ddd;
    }
    input:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #ddd;
    }

    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #ddd;
    }

    input:-ms-input-placeholder {
      /* Internet Explorer 10+ */
      color: #ddd;
    }
  }
  .logn_mima {
    margin-top: 10px;
  }
  .forget {
    text-align: right;
    margin-right: 65px;
    margin-top: 20px;
    color: #888888;
    font-size: 26px;
    font-family: PingFangSC-Regular;
  }
  .register {
    margin-top: 20px;
    color: #333333;
    span {
      color: #ee0000;
    }
  }
}
</style>
