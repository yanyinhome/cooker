<template>
  <div id="fabu">
    <com-head :opacity="1"></com-head>
    <div class="outside">
      <p>下单</p>
      <p>选择您喜欢的菜式来预约厨师吧，发布订单后需等待厨师接单哦！</p>
      <div class="item" @click="addressTo">
        <span>选择地址</span>
        <input type="text" v-model="address" placeholder="请选择">
        <i class="iconfont icon-xiayi"></i>
      </div>
      <div class="xiaogong">
        <span>请选择</span>
        清真
        <input type="radio" id="1" value="1" v-model="checked2">
        汉餐
        <input type="radio" id="2" value="2" v-model="checked2">
      </div>
      <div class="item" @click="loading1" v-if="checked2==2">
        <span>菜系</span>
        <input type="text" v-model="vegetable1" readonly="readonly" placeholder="请选择">
        <i class="iconfont icon-xiayi"></i>
      </div>

      <div class="item" @click="mask2 = true">
        <span>预约时间</span>
        <input type="text" v-model="time" readonly="readonly" placeholder="请选择">
        <i class="iconfont icon-xiayi"></i>
      </div>
      <!-- <div class="item"><span>姓名</span><input type="text" v-model="name" placeholder="请输入你的名字"></div>
      <div class="item"><span>手机号</span><input type="text" v-model="phone" placeholder="请输入手机号"></div>-->
      <div class="item">
        <span>用餐人数</span>
        <input type="text" v-model="num" placeholder="请输入用餐人数">
      </div>
      <div class="xiaogong">
        <span>小工（￥150/次）</span>
        需要
        <input type="radio" id="1" value="150" v-model="checked1">
        不需要
        <input type="radio" id="2" value v-model="checked1">
      </div>
      <!-- <div class="item" v-show="checked1==='1'"><span>小工服务费</span><input type="text" v-model="servermoney" placeholder="请输入小工服务费"></div>         -->
      <div class="xiaogong grade">
        <span>请选择厨师级别</span>
        <select v-model="selected">
          <option disabled>请选择等级服务费</option>
          <option v-for="(item,index) in grade" :value="item.id" :key="index">{{item.severgrade}}</option>
        </select>
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
        <span class="number">{{number}}/50</span>
      </div>
      <com-button class="btn" :disabled="isDisable" :click="fabu">确定发布</com-button>
    </div>
    <!-- 菜系弹窗 -->
    <div class="mask" v-show="mask1">
      <div class="box">
        <div class="title">
          <span>请选择菜系</span>
          <span @click="mask1=false">&emsp;&emsp;&emsp;确定&emsp;</span>
        </div>
        <div class="content">
          <div v-for="(item,index) in item" :key="index">
            <div
              class="item"
              :class="{activeCai: activeCai1 == item.d_id || activeCai2 == item.d_id }"
              @click="chooce(index,item.d_id)"
            >{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 时间弹窗 -->
    <div class="mask" v-show="mask2" @click="mask2=false">
      <div class="box">
        <div class="title">请选择预约时间
          <span @click="mask2=false">&emsp;&emsp;&emsp;确定&emsp;</span>
        </div>
        <div class="content">
          <mt-picker ref="picker" :slots="slots" @change="onValuesChange" :visibleItemCount="3"></mt-picker>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "fabu",
  data() {
    return {
      isDisable: false,
      d_id: "", //菜系id
      addr_id: "", //地址id
      defaultTime: "",
      datas: [],
      canReq: true,
      noMore: false,
      num: "",
      checked1: "",
      checked2: "1",
      servermoney: "",
      selected: "请选择等级服务费",
      vegetable: "",
      vegetable1: "", //值
      vegetable2: [], //数组
      vegetableId: [],
      dish_id: "",
      content: "",
      time: "",
      address: "",
      item: {},
      mask1: false,
      mask2: false,
      pickerVisible: "",
      number: "0",
      grade: [],
      slots: [
        {
          flex: 1,
          values: [],
          className: "slot1",
          textAlign: "right",
          defaultIndex: 1
        },
        {
          divider: true,
          content: "————",
          className: "slot2"
        },
        {
          flex: 1,
          values: [
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
            "19:00",
            "20:00"
          ],
          className: "slot3",
          textAlign: "left",
          defaultIndex: 1
        }
      ]
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.axios.post('login/verifylogin',{
        token: localStorage.getItem('token')
      })
        .then(({data}) => {
          console.log(data);
          // 如果返回值为201，则跳转到绑定
          if (data.code === '201') {
            vm.$bus.$emit("toast", "请先绑定手机号");
            vm.$router.push('register');
          } else {
            next();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      });
  },
  created() {
    this.loadingTime();
    this.loading3();
    if (this.dingwei.addr_receiver) {
      this.address =
        this.dingwei.addr_receiver +
        " " +
        this.dingwei.addr_phone +
        " " +
        this.dingwei.pmc +
        this.dingwei.addr_cont;
      this.addr_id = this.dingwei.addr_id;
    }
  },
  mounted() {
    // console.log(this.dingwei);
  },
  computed: {
    ...mapState(["dingwei"])
  },
  watch: {
    content: function(a, b) {
      this.number = a.length;
      console.log(this.number);
      if (this.number > 49) {
        this.$bus.$emit("toast", "字数不能超过50");
      }
    }
  },
  methods: {
    // 菜系
    loading1() {
      this.mask1 = true;
      this.axios
        .post("index/dish_list")
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.item = data.data;
          } else if (data.code === "201") {
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 预约时间
    // loading2() {
    //   this.mask2 = true;
    //   this.axios
    //     .post("index/apiTime")
    //     .then(({ data }) => {
    //       console.log(data);
    //       if (data.code === "200") {
    //         this.slots[0].values = data.data;
    //       } else if (data.code === "201") {
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    // 等级
    loading3() {
      this.axios
        .post("index/serverGrade")
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.grade = data.data;
          } else if (data.code === "201") {
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    fabu() {
      if (!this.addr_id || !this.time ||!this.num) {
        this.$bus.$emit("toast", "请完善发布信息");
      } else if ( this.selected == '请选择等级服务费') {
        this.$bus.$emit("toast", "请选择厨师等级");
      } else {
        this.fabu1();
      }
    },
    // 发布订单
    fabu1() {
      this.isDisable = true;
      setTimeout(() => {
      this.isDisable = false;
      }, 1000)
      var myDate = new Date();
      var year = myDate.getFullYear();
      this.axios
        .post("index/release", {
          token: this.token(),
          addr_id: this.addr_id,
          dish_id: this.dish_id,
          dinner: year + "-" + this.time,
          order_remark: this.content,
          isiamic: this.checked2,
          number: this.num,
          coolie: this.checked1,
          grade_id: this.selected
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            // this.$router.push({ path: "./index" });
            this.$bus.$emit("toast", data.msg);
            const jsApiParameters = data.data;
            this.jsSdk(jsApiParameters);
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          } else if (data.code === "204") {
            this.$bus.$emit("toast", data.msg);
            this.$router.push('order');
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 支付
    jsSdk(jsApiParameters) {
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: jsApiParameters.appId,
          package: jsApiParameters.package,
          nonceStr: jsApiParameters.nonceStr,
          timeStamp: jsApiParameters.timeStamp,
          signType: jsApiParameters.signType,
          paySign: jsApiParameters.paySign
        },
        // jsApiParameters,
        function(res) {
          WeixinJSBridge.log(res.err_msg);
          var result = res.err_msg;
          if (result == "get_brand_wcpay_request:ok") {
            alert("支付成功");
            // var url = "http://www.hnprkj.com/#/userCenter";
            var url = "http://chushiq.cadhx.com/order";
          } else {
            alert("你取消了支付");
            // var url = "http://www.hnprkj.com/#/userCenter";
            var url = "http://chushiq.cadhx.com/fabu";
          }
          window.location.href = url;
        }
      );
    },
    onValuesChange(picker, values) {
      if (picker.getSlotValue(0)) {
        this.time = picker.getSlotValue(0) + " " + picker.getSlotValue(1);
      } else {
        this.time = this.today1();
      }
    },
    addressTo() {
      this.$router.push({ path: "./dingwei" });
    },
    chooce(index, id) {
      this.d_id = id;
      if (this.vegetableId[1] != this.item[index].d_id) {
        this.vegetableId.push(this.item[index].d_id);
        this.vegetable2.push(this.item[index].name);
      }

      console.log(this.vegetableId);
      if (this.vegetableId.length > 2) {
        this.vegetableId.splice(0, 1).push(this.item[index].d_id);
        this.vegetable2.splice(0, 1).push(this.item[index].name);
      }
      this.activeCai1 = this.vegetableId[0];
      this.activeCai2 = this.vegetableId[1];
      if (this.vegetable2[1]) {
        this.vegetable1 = this.vegetable2[0] + "," + this.vegetable2[1];
      } else {
        this.vegetable1 = this.vegetable2[0];
      }
      if (this.vegetableId[1]) {
        this.dish_id = `${this.vegetableId[0]},${this.vegetableId[1]},`;
      } else {
        this.dish_id = `${this.vegetableId[0]},`;
      }
    }
  }
};
</script>
<style lang='scss'>
#fabu {
  padding-top: 100px;
  padding-bottom: 30px;
  background: url("../assets/image/navbg.png") no-repeat;
  background-size: 100%;
  #pageHead {
    color: #fff;
    background-color: #212121;
    .icon-fanhui {
      color: #fff;
    }
  }
  .com_button {
    margin-top: 250px;
  }
  .outside {
    width: 690px;
    height: 100%;
    margin: 0 auto;
    padding: 30px 30px;
    background-color: #fff;
    border-radius: 15px;
    text-align: center;
    box-sizing: border-box;
    p:nth-of-type(1) {
      font-size: 34px;
      font-family: PingFangSC-Medium;
      font-weight: 700;
      color: rgba(0, 0, 0, 1);
      line-height: 90px;
    }
    p:nth-of-type(2) {
      font-size: 26px;
      font-family: PingFangSC-Medium;
      color: #666;
      padding: 0 60px;
      box-sizing: border-box;
    }
    .item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgba(238, 238, 238, 1);
      line-height: 102px;
      span {
        width: 200px;
        text-align: left;
      }
      input {
        width: 450px;
        // height: 52px;
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
    .item:nth-of-type(1) {
      input {
        padding-left: 70px;
        box-sizing: border-box;
      }
    }
    .xiaogong {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 102px;
      border-bottom: 1px solid rgba(238, 238, 238, 1);
      span {
        width: 300px;
        text-align: left;
      }
      input {
        width: 30px;
        height: 30px;
      }
    }
    .grade {
      select {
        width: 360px;
        height: 60px;
        text-align: right;
        font-size: 30px;
        margin-right: 0;
        color: #666;
      }
    }
    .beizhu {
      position: relative;
      textarea {
        width: 630px;
        margin-top: 20px;
        padding: 10px;
        border: 1px solid rgba(238, 238, 238, 1);
        box-sizing: border-box;
      }
      .number {
        color: #ddd;
        position: absolute;
        bottom: 8px;
        right: 8px;
      }
    }
    .btn {
      margin-top: 30px;
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    .box {
      width: 630px;
      // height:418px;
      margin: 30vh auto;
      background: rgba(255, 255, 255, 1);
      border-radius: 20px;
      .title {
        text-align: center;
        line-height: 100px;
        font-size: 34px;
      }
      .content {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .item {
          width: 130px;
          height: 60px;
          // float: left;
          margin: 20px 33px;
          text-align: center;
          line-height: 60px;
          border-radius: 6px;
          border: 1px solid rgba(153, 153, 153, 1);
        }
        .activeCai {
          background-color: #ffb84b;
          color: #fff;
        }
      }
    }
    .picker {
      width: 630px;
      padding: 30px;
      font-size: 30px;
      .picker-center-highlight {
        // border-top: 1Px solid #eee;
        border-bottom: 1px solid #eee;
      }
      .picker-slot-divider {
        color: #666;
      }
      .picker-slot {
        text-align: center;
      }
    }
  }
}
</style>
