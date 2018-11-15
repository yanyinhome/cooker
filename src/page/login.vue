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
  

  // if(this.IsWechat()) {
  // 				var wurl = encodeURIComponent(window.location.href);
  // 				if(!window.localStorage.__openId__ || window.localStorage.__openId__ === '') {   
  // 					this.code = this.getQueryString('code');
  // 					if(!this.code || this.code === '') {
  // 						window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.gappId + '&redirect_uri=' + wurl + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
  // 					} else {
  // 						this.getOpenId();
  // 					}
  // 				}
  // 			}

  // created() {
  //   let code = getUrlKey("code");
  //   if (code) {
  //     //调用接口获取openId   参考文档https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842
  //     getOpenIdApi(code)
  //       .then(res => {
  //         let openId = res.openId;
  //         window.location.replace("/#/login");
  //       })
  //       .catch(res => {
  //         window.location.replace("/#/login");
  //       });
  //   } else {
  //     getCodeApi("123");
  //   }
  // },

  created() {
    // this.login();
  },
  mounted() {},
  methods: {
    // getUrlKey: function(name) {
    //   //获取url 参数
    //   return (
    //     decodeURIComponent(
    //       (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
    //         location.href
    //       ) || [, ""])[1].replace(/\+/g, "%20")
    //     ) || null
    //   );
    // },

    // getCodeApi(state) {
    //   //获取code
    //   let urlNow = encodeURIComponent(window.location.href);
    //   let scope = "snsapi_base"; //snsapi_userinfo   //静默授权 用户无感知
    //   let appid = "wx4cc5d5c123123123";
    //   let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${urlNow}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
    //   window.location.replace(url);
    // },
    // login() {
    //   this.axios.post("wechat/set_openid").then(({ data }) => {
    //     console.log(data);
    //     if (data.code === "200") {
    //       this.$router.push('login');
    //       this.$bus.$emit("toast", data.msg);
    //     } else if (data.code === "201") {
    //       this.$bus.$emit("toast", data.msg);
    //     }
    //   });
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
