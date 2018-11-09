<template>
  <div id='fabu'>
    <com-head :opacity='1'></com-head>
    <div class="outside">
        <p>发布订单</p>
        <p>选择您喜欢的菜式来预约厨师吧，发布订单后需等待厨师接单哦！</p>
        <div class="item" @click="addressTo"><span>选择地址</span><input type="text" v-model="address" placeholder="请选择"><i class="iconfont icon-xiayi"></i></div>
        <div class="item" @click="loading1"><span>菜系</span><input type="text" v-model="vegetable" readonly="readonly" placeholder="请选择"><i class="iconfont icon-xiayi"></i></div>
        <div class="item"  @click="loading2"><span>预约时间</span><input type="text" v-model="time"  readonly="readonly" placeholder="请选择"><i class="iconfont icon-xiayi"></i></div>
        <!-- <div class="item"><span>姓名</span><input type="text" v-model="name" placeholder="请输入你的名字"></div>
        <div class="item"><span>手机号</span><input type="text" v-model="phone" placeholder="请输入手机号"></div> -->
        <div class="beizhu"><textarea style="resize:none" border maxlength=50  placeholder="备注信息" v-model="content" cols="80" rows="5"></textarea>
        <span class="number">{{number}}/50</span></div>
        <com-button :click="fabu">确定发布</com-button>
    </div>
    <!-- 菜系弹窗 -->
    <div class="mask" v-show="mask1"  @click="mask1=false">
      <div class="box">
        <div class="title">请选择菜系</div>
        <div class="content">
          <div v-for="(item,index) in item" :key="index"><div class="item"  @click="chooce(index,item.d_id)">{{item.name}}</div></div>  
        </div>
      </div>
    </div> 
    <!-- 时间弹窗 -->
    <div class="mask" v-show="mask2"  @click="mask2=false">
      <div class="box">
        <div class="title">请选择预约时间</div>
        <div class="content"> 
           <mt-picker ref="picker" :slots="slots" @change="onValuesChange"  :visibleItemCount=3></mt-picker>
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
      d_id: "", //菜系id
      addr_id: "", //地址id
      defaultTime: "",
      datas: [],
      canReq: true,
      noMore: false,
      vegetable: "",
      content: "",
      time: "",
      address: "",
      item: {},
      mask1: false,
      mask2: false,
      pickerVisible: "",
      number: "0",
      slots: [
        {
          flex: 1,
          values: ["今天", "明天", "03", "04", "05", "06"],
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
            "00:00",
            "01:00",
            "02:00",
            "03:00",
            "04:00",
            "05:00",
            "06:00",
            "07:00",
            "08:00",
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
            "19:00",
            "20:00",
            "21:00",
            "22:00",
            "23:00"
          ],
          className: "slot3",
          textAlign: "left",
          defaultIndex: 1
        }
      ]
    };
  },
  created() {
    // var thetime = '2018-04-17 19:09:00';
    //     var d=new   Date(Date.parse(thetime .replace(/-/g,"/")));
    //       console.log(d);
    //     var  curDate=new  Date();
    // if(d <=curDate){
    //     alert("小于当前时间");
    // }else{
    //     alert("大于当前时间");
    // }

    // this.loading2();

    // if (localStorage.token) {
    //   this.time = localStorage.getItem('time');
    //   this.vegetable = localStorage.getItem('vegetable');
    // }
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
    console.log(this.dingwei);
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
    loading2() {
      this.mask2 = true;
      this.axios
        .post("index/apiTime")
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.slots[0].values = data.data;
          } else if (data.code === "201") {
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 发布订单
    fabu() {
      var myDate = new Date();
      var year = myDate.getFullYear(); 
      this.axios
        .post("index/release", {
          token: this.token(),
          addr_id: this.addr_id,
          d_id: this.d_id,
          dinner: year + '-' + this.time,
          order_remark: this.content
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.$router.push({ path: "./index" });
            this.$bus.$emit("toast", data.msg);
            // 移除菜系和时间
            localStorage.removeItem("time");
            localStorage.removeItem("vegetable");
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onValuesChange(picker, values) {
      if (picker.getSlotValue(0)) {
        this.time = picker.getSlotValue(0) + " " + picker.getSlotValue(1);
      }
      console.log(picker.getSlotValue(0) + ":" + picker.getSlotValue(1));
       // 存储时间
      // if (!localStorage.time) {
      //   // localStorage.removeItem("time");
      //   localStorage.setItem("time", this.time);
      // } 
    },
    addressTo() {
      this.$router.push({ path: "./dingwei" });
    },
    chooce(index, id) {
      console.log(index);
      this.mask1 = false;
      this.d_id = id;
      this.vegetable = this.item[index].name;
       // 存储菜系
      // if (localStorage.vegetable) {
      //   localStorage.removeItem("vegetable");
      //   localStorage.setItem("vegetable", this.vegetable);
      // } else {
      //   localStorage.setItem("vegetable", this.vegetable);
      // }
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
      border-bottom: 1Px solid rgba(238, 238, 238, 1);
      line-height: 102px;
      span {
        width: 120px;
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
    .item:nth-of-type(1) {
      input {
        padding-left: 70px;
        box-sizing: border-box;
      }
    }
    .beizhu {
      position: relative;
      textarea {
        width: 630px;
        margin-top: 20px;
        padding: 10px;
        border: 1Px solid rgba(238, 238, 238, 1);
        box-sizing: border-box;
      }
      .number {
        color: #ddd;
        position: absolute;
        bottom: 8px;
        right: 8px;
      }
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
          border: 1Px solid rgba(153, 153, 153, 1);
        }
      }
    }
    .picker {
      width: 630px;
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
