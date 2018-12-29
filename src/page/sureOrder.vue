<template>
  <div id='sureOrder'>
    <com-head  :opacity='0'>确认订单</com-head>
    <!-- <div class="addAddress"><i class="iconfont icon-tianjia" /><span>添加上门地址</span></div> -->
    <router-link to="chooseAddress" tag="div" class="addAddress"  v-if="!myaddress.addr_receiver"><i class="iconfont icon-tianjia" /><span>添加上门地址</span></router-link>
    <div class="addAddress2" v-if="myaddress.addr_receiver">
        <p>{{myaddress.addr_receiver}}&emsp;{{myaddress.addr_phone}} </p>
        <p>{{myaddress.pmc + myaddress.addr_cont}}</p>
        <i class="iconfont icon-bianji1" @click="rewrite"></i>
    </div>
    <div class="server">
       <div class="item"><span>服务厨师</span><span>{{name}}</span></div>
       <div class="xiaogong">
          <span>请选择需求</span>
          清真<input type="radio" id="1" value="1" v-model="checked2">
          非清真<input type="radio" id="2" value="2" v-model="checked2">
      </div> 
       <div class="item"><span>用餐人数</span><input type="text" v-model="num" placeholder="请输入用餐人数"></div>
        <div class="xiaogong">
          <span>小工(￥150/次)</span>
          需要<input type="radio" id="1" value="150" v-model="checked1">
          不需要<input type="radio" id="2" value="" v-model="checked1">
        </div> 
        <!-- <div class="item" v-show="checked1==='1'"><span>小工服务费</span><input type="text" v-model="servermoney" placeholder="请输入小工服务费"></div>         -->
       <div class="item" @click="mask = true"><span>上门时间</span><input type="text" v-model="time"  readonly="readonly" placeholder="请选择"><i class="iconfont icon-xiayi"></i></div>
    </div>

    <div class="beizhu">
        <textarea style="resize:none" border maxlength=50  placeholder="请填写订单备注" v-model="content" cols="80" rows="5"></textarea>
        <span class="number">{{number}}/50</span>
    </div>
    <butFoot :click="bespeak" :disabled="isDisable">确定预约</butFoot>
    <!-- 时间弹窗 -->
    <div class="mask" v-show="mask"  @click="mask = false">
      <div class="box">
        <div class="title">请选择预约时间
          <span @click="mask=false">&emsp;&emsp;&emsp;确定&emsp;</span>
        </div>
        <div class="content"> 
           <mt-picker ref="picker" :slots="slots" @change="onValuesChange"  :visibleItemCount=3></mt-picker>
        </div>
      </div>
    </div> 
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
  name: "sureOrder",
  data() {
    return {
      id: this.$route.query.id,//厨师id
      mask: false,
      isDisable: false,
      name: '',
      content: "",
      number: "0",
      num: '',
      time1: "",
      time2: "",
      time: "",
      checked1: '',
      checked2: '1',
      servermoney: '',
      slots: [
        {
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'right',
          defaultIndex: 1
        }, {
          divider: true,
          content: '————',
          className: 'slot2'
        }, {
          flex: 1,
          values: ["11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
            "19:00",
            "20:00"],
          className: 'slot3',
          textAlign: 'left',
          defaultIndex: 1
        }
      ]
    };
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
  computed: {
    ...mapState(["myaddress", "count"])
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
    this.time = this.nowTime();
    // this.loading();
    this.loading1();
  },

  mounted() {},

  methods: {
    loading1() {
      this.axios
        .post("cook/detail", {
          token: this.token(),
          c_id: this.id
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.name = data.data.user_truename;
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 确定预约
    bespeak() {
      if(this.isDisable){
        this.$bus.$emit("toast", '不能重复操作');
      }
      this.isDisable = true;
      setTimeout(() => {
        this.isDisable = false;
      }, 1000);
      var myDate = new Date();
      var year = myDate.getFullYear(); 
      this.axios.post('cook/apimake',{
        token: this.token(),
        c_id: this.id,
        addr_id: this.myaddress.addr_id,
        dinner:  year + '-' + this.time,
        order_remark: this.content,
        isiamic: this.checked2,
        number: this.num,
        coolie: this.checked1,
      })
        .then(({data}) => {
          console.log(data);
          if (data.code === '200') {
            this.$router.push({name:'waitOrder',query:{id: data.order_id}});
            this.$bus.$emit("toast", data.msg);
            this.active = !this.active;
          } else if (data.code === '201') {
            this.$bus.$emit("toast", data.msg);
            const jsApiParameters = data.data;
            const id = data.order_id;
            const cookerid = data.c_id;
            this.jsSdk(jsApiParameters,id,cookerid);
            this.$bus.$emit("toast", data.msg);            
          } else if (data.code === '204') {
            this.$bus.$emit("toast", data.msg);            
          }
        })
        .catch((error) => {
          console.log(error);
        });      
    },
    // 支付
    jsSdk(jsApiParameters,id,cookerid) {
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
            var url = `http://chushiq.cadhx.com/waitOrder?id=${id}`;
            alert("支付成功");
          } else {
            alert("你取消了支付");
            var url = `http://chushiq.cadhx.com/sureOrder?id=${cookerid}`;
          }
          window.location.href = url;
        }
      );
    },
    rewrite (index) {
      this.$router.push('chooseAddress');
    },
    onValuesChange(picker, values) {
      this.time = picker.getValues()[0]+ " " + picker.getValues()[1];
      // console.log(this.time);
    },
  }
};
</script>
<style lang='scss'>
#sureOrder {
  padding-top: 100px;
  padding-bottom: 30px;
  .addAddress {
    width: 750px;
    text-align: center;
    line-height: 160px;
    border-top: 4px dashed #F5B1B1;
    border-bottom: 4px dashed #F5B1B1;
    background-color: #fff;
    span {
      margin-left: 10px;
      font-size:26px;
      color: #666;
    }
  }
  .addAddress2 {
    padding: 20px 30px;
    box-sizing: border-box;
    border-top: 4px dashed #F5B1B1;
    border-bottom: 4px dashed #F5B1B1;
    background-color: #fff;
    position: relative;
    p:nth-of-type(1) {
      width: 600px;
      font-size:30px; 
      line-height: 60px;
    }
    p:nth-of-type(2) {
      width: 600px;
      font-size:28px;
      line-height: 60px;
      color:rgba(102,102,102,1);
      display: -webkit-box;
       -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden; 
    }
    .iconfont {
      position: absolute;
      top: 50px;
      right: 30px;
      font-size: 40px;
    }
  }
  .server {
    margin-top: 30px;
    background-color: #fff;
    .item {
      margin: 0 30px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1Px solid rgba(238,238,238,1);
      line-height: 102px;
      span { 
        text-align: left;
       }
      input {
      width: 450px;
      text-align: right;
      font-size:30px;
      margin-right: 0;
      color: #666;
      }
    }
    .xiaogong {
      margin: 0 30px;
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
  }
  .beizhu {
      position: relative;
      textarea {
      width: 750px;
      margin-top: 30px;
      padding: 20px;
      box-sizing: border-box;
    }
    .number {
      color: #ddd;
      position: absolute;
      bottom: 12px;
      right: 12px;
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0; 
    width: 100vw;
    height: 100vh;
    background:rgba(0,0,0,0.5);
    .box {
      width:630px;
      // height:418px;
      margin: 30vh auto;
      background:rgba(255,255,255,1);
      border-radius:20px;
      .title {
        text-align: center;
        line-height: 100px;
        font-size:34px;
      }
      .content {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        .item {
          width:140px;
          height:60px;
          // float: left;
          margin: 20px 33px;
          text-align: center;
          line-height: 60px;
          border-radius:6px;
          border:1Px solid rgba(153,153,153,1);
        }
      }
    }
    .picker {
      width:630px;
      padding: 30px;
      font-size: 30px;
      .picker-center-highlight {
        // border-top: 1Px solid #eee;
        border-bottom: 1Px solid #eee;
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