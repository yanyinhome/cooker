<template>
  <div id='forget'>
      <!-- <div class="login_top"></div>
      <div class="login_inp">
          <div class="box1"><img src="../assets/image/login2.png" ></div>
          <input type="text" v-model="phone" placeholder="请验证你注册的手机号">
      </div>
      <div class="login_inp yanzheng">
          <div class="box1"><img src="../assets/image/reg2.png" ></div>
          <input type="text" placeholder="请输入验证码" v-model="verify">
          <button class="verify" @click="verification" :disabled='isSend' :class="{'send-sms' : isSend}">{{btntxt}}</button>
      </div>
      <div class="login_inp logn_mima">
          <div class="box1"><img src="../assets/image/login3.png" ></div>
          <input type="password" v-model="password" placeholder="请输入新的密码">
      </div>
      <com-button :click="register">确定</com-button> -->
  </div>
</template>
<script>
export default {
  name: "forget",
  data() {
    return {
      phone: "",
      password: "",
      btntxt: "获取验证码",
      sendSMSTime: 0,
      isSend: false,
      verify: ''
    };
  },
  created() {},
  mounted() {},
  methods: {
    verification() {
      if (!this.phone) {
        this.$bus.$emit("toast", "手机号不能为空");
      } else {
        this.axios.post('login/getcode',{
          type:'resetpwd',
          user_mobile: this.phone
        })
          .then(({data}) => {
            console.log(data)
            if (data.code === '200') {
              this.$bus.$emit('toast', data.msg);
              this.sendSMSTime = 60;
              this.isSend = true;
              this.disabled = true;
              this.btntxt = "已发送(" + this.sendSMSTime + ")s";
              this.timer();
            } else if (data.code === '201') {
              this.disabled = false;
              this.$bus.$emit('toast', data.msg);
            }
          })
          .catch((error) => {
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
        this.sendSMSTime = 0;
        this.btntxt = "重新获取";
        this.isSend = false;
      }
    },
    register() {
      this.axios.post('login/resetpwd',{
          code: this.verify,
          user_mobile: this.phone,
          user_pwd: this.password
        })
          .then(({data}) => {
            console.log(data)
            if (data.code === '200') {
              this.$router.push("/");              
              this.$bus.$emit('toast', data.msg);
            } else if (data.code === '201') {
              this.$bus.$emit('toast', data.msg);
            }
          })
          .catch((error) => {
            console.log(error);
          });
    }
  }
};
</script>
<style lang='scss' scoped>
#forget {
  padding-top: 140px;
  // padding-bottom: 30px;
  text-align: center;
  .login_top {
    width: 357px;
    height: 390px;
    margin: 0 auto;
    box-sizing: border-box;
    background: url("../assets/image/forget.png");
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
}
</style>
