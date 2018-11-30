<template>
  <div id='register'>
      <div class="login_top"></div>
      <div class="login_inp">
          <div class="box1"><img src="../assets/image/login2.png" ></div>
          <input type="text" v-model="phone" placeholder="请绑定你的手机号">
      </div>
      <div class="login_inp yanzheng">
          <div class="box1"><img src="../assets/image/reg2.png" ></div>
          <input type="text" placeholder="请输入验证码" v-model="verify">
          <button class="verify" @click="getTelcode" :disabled = 'isSend' :class="{'send-sms' : isSend}">{{btntxt}}</button>
      </div>
      <!-- <div class="login_inp logn_mima">
          <div class="box1"><img src="../assets/image/login3.png" ></div>
          <input type="password" v-model="password" placeholder="请输入你的登录密码">
      </div> -->
      <router-link :to="{name: 'protocol',query: {status: '3'}}" tag="a" class="protocol">《信息服务》</router-link> 
      <router-link :to="{name: 'protocol',query: {status: '4'}}" tag="a" class="protocol">《隐私政策》</router-link> 
      <div id="example-4">
        <input type="checkbox" id="1" value="checked" v-model="checked">
        <label for="1">我已阅读并同意</label>
      </div>
      <com-button :click="register" :class="{active: !checked}">确定绑定</com-button>
  </div>
</template>
<script>
export default {
  name: "register",
  data() {
    return {
      checked: false,
      phone: "",
      password: "",
      btntxt: "获取验证码",
      sendSMSTime: 0,
      isSend: false,
      // disabled: false,
      verify: "",
      isclick: true,
    };
  },

  created() {},
  mounted() {},
  methods: {
    login() {
      this.axios.post("wechat/login").then(({ data }) => {
        console.log(data);
        if (data.url) {
          // this.$router.push('login');
          window.location.href = data.url;
        }
      });
    },
    getTelcode (){
      console.log(this.isclick);
      if (this.isclick) {
        this.isclick = false;
        this.verification();
      } else {
        this.$bus.$emit("toast", '不能重复点击');
      }
    },
    verification() {
      let regTel = /^(1[3-9])\d{9}$/;
      if (!this.phone) {
        this.$bus.$emit("toast", "手机号不能为空");
      } else if (!regTel.test(this.phone)) {
        this.$bus.$emit("toast", "手机号码不合法");
      } else {

        this.axios
          .post("login/getcode", {
            type: "register",
            user_mobile: this.phone,
            openid: this.openid()
          })
          .then(({ data }) => {
            console.log(data);
            if (data.code === "200") {
              this.$bus.$emit("toast", data.msg);
              this.sendSMSTime = 60;
              this.isSend = true;
              this.btntxt = "已发送(" + this.sendSMSTime + ")s";
              this.timer();
            } else {
              this.isclick = true;
              this.disabled = false;
              this.$bus.$emit("toast", data.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    timer() {
      if (this.sendSMSTime > 0) {
        this.sendSMSTime--;
        this.btntxt = `已发送(${this.sendSMSTime})s`;
        setTimeout(() => {
          this.timer();
        }, 1000);
      } else {
        this.isclick = true;
        this.sendSMSTime = 0;
        this.btntxt = "重新获取";
        this.isSend = false;
      }
    },
    register() {
      this.axios
        .post("login/register", {
          openid: this.getCookie("openid"),
          code: this.verify,
          user_mobile: this.phone,
          user_pwd: '123456'
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.$router.go(-1);
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
};
</script>
<style lang='scss' scoped>
#register {
  padding-top: 140px;
  // padding-bottom: 30px;
  text-align: center;
  .login_top {
    width: 264px;
    height: 358px;
    margin: 0 auto;
    box-sizing: border-box;
    background: url("../assets/image/reg1.png");
    background-size: cover;
  }
  .login_inp {
    margin: 120px 60px 0;
    padding: 40px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1Px solid rgba(238, 238, 238, 1);
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
      margin-left: 30px;
      font-size: 30px;
      background: #fafafa;
    }
  }
  .logn_mima {
    margin-top: 10px;
    margin-bottom: 30px;
  }
  .yanzheng {
    padding-right: 10px;
    padding-left: 30px;
    margin-top: 10px;
    margin-bottom: 50px;
    .box1 {
      width: 48px;
      height: 46px;
      img {
        // width: 100%;
        height: 80%;
      }
    }
    input {
      width: 340px;
      font-size: 30px;
      margin-left: 30px;
    }
    .verify {
      width: 180px;
      background: none;
      color: #ee0000;
      font-size: 26px;
      font-family: PingFangSC-Regular;
      padding-left: 10px;
      border-left: 1Px solid rgba(221, 221, 221, 1);
    }
    .send-sms {
      color: #999999;
    }
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
  .protocol {
    font-size: 28px;
    color: #0085ff;
  }
  .active {
    background-color: #ddd;
    box-shadow: none;
  }
}
</style>
