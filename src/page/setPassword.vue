<template>
  <div id='setPassword'>
    <!-- <com-head  :opacity='0'>修改密码</com-head>
    <div class="keepdata" @click="verification">保存</div>
    <div class="password">
       <div class="item"><span>原密码</span><input type="password" v-model="password1" placeholder="请输入旧密码"></div>
       <div class="item"><span>新密码</span><input type="password" v-model="password2" placeholder="请输入新的密码"></div>
       <div class="item"><span>确定新密码</span><input type="password" v-model="password3" placeholder="再次确认新密码"></div>
    </div> -->
    
  </div>
</template>

<script>
export default {
  name: "setPassword",
  data() {
    return {
      password1: "",
      password2: "",
      password3: ""
    };
  },

  computed: {},

  created() {},

  mounted() {},

  methods: {
    verification() {
      if (!this.password1 || !this.password2 || !this.password3) {
        this.$bus.$emit("toast", "密码不能为空");
      } else if (this.password2 !== this.password3) {
        this.$bus.$emit("toast", "密码不一致");
      } else {
        this.axios
          .post("user/changepwd", {
            token: this.token(),
            old_user_pwd: this.password1,
            user_pwd: this.password2
          })
          .then(({ data }) => {
            console.log(data);
            if (data.code === "200") {
              this.$bus.$emit("comAlert", {
                title: "温馨提示",
                info: "密码已修改，请牢记密码",
                button: [
                  {
                    text: "确认",
                    callback: () => {
                      this.$router.push('usercenter');
                    }
                  }
                ]
              });
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
#setPassword {
  padding-top: 100px;
  position: relative;
  .keepdata {
    width: 160px;
    height: 80px;
    text-align: center;
    color: #ee0000;
    line-height: 80px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 100;
  }
  .password {
    background-color: #fff;
    .item {
      margin: 0 30px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1Px solid rgba(238, 238, 238, 1);
      line-height: 102px;
      span {
        width: 150px;
        text-align: left;
      }
      input {
        width: 450px;
        text-align: right;
        font-size: 30px;
        margin-right: 0;
        color: #666;
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
  }
}
</style>