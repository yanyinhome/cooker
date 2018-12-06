<template>
  <div id="putForward">
    <com-head :opacity="0">退款</com-head>
    <div class="bookcoin">
      <p>可提现金额</p>
      <p>{{money}}</p>
      <!-- <div class="box item">
        <span>提现金额</span>
        <input type="text" v-model="money" placeholder="请输入提现金额">
      </div> -->
      <div class="selecttype box ">
        <span>请选择提现方式</span>
        支付宝
        <input type="radio" id="1" value="1" v-model="checked">
        银行卡
        <input type="radio" id="2" value="2" v-model="checked">
      </div>
      <div class="item" v-if="checked==='1'">
        <span>支付宝</span>
        <input type="text" v-model="zhifubao" placeholder="请输入支付宝账号">
      </div>
      <div class="item" v-if="checked==='1'">
        <span>账户名</span>
        <input type="text" v-model="zhifuname" placeholder="请输入支付宝名字">
      </div>
      <div class="item" v-if="checked==='2'">
        <span>银行卡号</span>
        <input type="text" v-model="cardnum" placeholder="请输入银行卡号">
      </div>
      <div class="item" v-if="checked==='2'">
        <span>开户行</span>
        <input type="text" v-model="bank" placeholder="请输入开户行">
      </div>
      <div class="item" v-if="checked==='2'">
        <span>持卡人</span>
        <input type="text" v-model="bankname" placeholder="请输入持卡人姓名">
      </div>
      <div class="beizhu">
        <textarea
          style="resize:none"
          border
          maxlength="50"
          placeholder="备注信息"
          v-model="content"
          cols="80"
          rows="5"
        ></textarea>
      </div>
      <com-button class="btn" :click="putForward">确定</com-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "putForward",
  data() {
    return {
      checked: "1",
      zhifubao: "",
      zhifuname: "",
      type: '',
      money: "0",
      cardnum: "",
      bank: "",
      bankname: "",
      content: ""
    };
  },

  computed: {},

  created() {},

  mounted() {
    this.loading();
  },

  methods: {
    loading() {
      this.axios
        .post("user/lose", {
          token: this.token()
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.money = data.data;
            this.type = '1'; //厨师
          } else if (data.code === "201") {
            this.money = data.data;
            this.type = '0'; //会员
          } else if (data.code === "204") {
            this.$bus.$emit("toast", data.msg);            
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    putForward() {
      if (this.checked === "1") {
        // 支付宝提现
        if (!this.money || !this.zhifubao || !this.zhifuname) {
          this.$bus.$emit("toast", "输入信息不能为空");
        } else {
          this.axios
            .post("user/cash", {
              token: this.token(),
              type: "1",
              cash_kind: this.type,
              cash_alipay_name: this.zhifuname,
              cash_alipay_no: this.zhifubao,
              cash_amount: this.money,
              cash_comm: this.content
            })
            .then(({ data }) => {
              console.log(data);
              if (data.code === "200") {
                this.$bus.$emit("toast", data.msg);
                this.$router.push('usercenter');   
              } else if (data.code === "201") {
                this.$bus.$emit("toast", data.msg);
              } else if (data.code === "204") {
                this.$bus.$emit("toast", data.msg);
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      } else if (this.checked === "2") {
        // 银行卡提现
        if (
          !this.money ||
          !this.bankname ||
          !this.cardnum ||
          !this.bank
        ) {
          this.$bus.$emit("toast", "输入信息不能为空");
        } else {
          this.axios
            .post("user/cash", {
              token: this.token(),
              type: "0",
              cash_kind: this.type,
              cash_appli: this.bankname,
              cash_alipay_no: this.cardnum,
              cash_bank: this.bank,
              cash_amount: this.money,
              cash_comm: this.content
            })
            .then(({ data }) => {
              console.log(data);
              if (data.code === "200") {
                this.$bus.$emit("toast", data.msg);
                this.$router.push('usercenter');   
              } else if (data.code === "201") {
                this.$bus.$emit("toast", data.msg);
              } else if (data.code === "204") {
                this.$bus.$emit("toast", data.msg);
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
#putForward {
  text-align: center;
  background-color: #fff;
  .bookcoin {
    background-color: #fff;
    padding-top: 100px;
    p:nth-of-type(1) {
      margin-top: 30px;
      font-size: 34px;
      font-family: Didot-Bold;
    //   font-weight: bold;
      color: #222;
      line-height: 78px;
    }
    p:nth-of-type(2) {
      font-size: 34px;
      color: #222;
      line-height: 80px;
      font-weight: bold;
    }
    .selecttype {
      margin: 120px 30px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 102px;
      border-bottom: 1Px solid rgba(238, 238, 238, 1);
      span {
        width: 300px;
        text-align: left;
      }
      input {
        width: 30px;
        height: 30px;
      }
    }
    .item {
      margin: 0px 30px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1Px solid rgba(238, 238, 238, 1);
      line-height: 102px;
      span {
        width: 150px;
        text-align: left;
      }
      input {
        width: 500px;
        // height: 52px;
        text-align: right;
        font-size: 30px;
        margin-right: 0;
        color: #222;
        padding: 10px;
        box-sizing: border-box;
      }
      input::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #999;
      }
      input:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #999;
      }

      input::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #999;
      }

      input:-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #999;
      }
    }
    .beizhu {
      textarea {
        width: 690px;
        margin-top: 20px;
        padding: 10px;
        font-size: 30px;
        border: 1Px solid rgba(238, 238, 238, 1);
        box-sizing: border-box;
      }
    }
    .btn {
      margin-top: 100px;
    }
  }
  .warm {
    margin: 100px 32px 0;
    font-size: 28px;
    color: rgba(85, 85, 85, 1);
    text-align: left;
  }
}
</style>