<template>
  <div id='index'>
    <com-head :opacity='1'>首页<span @click="chooceAddress">{{area}}</span></com-head>
    <div class="outside">
        <div class="lunbo">
            <mt-swipe :auto="3000">
              <mt-swipe-item  v-for="(item,index) in images" :key="index"><img :src="item"></mt-swipe-item>
            </mt-swipe>
        </div>
    </div> 
    <div class="nav_title"><span>———</span><div class="box">新厨推荐</div><span>———</span></div>
    <div class="outside">
      <div class="itemlist recommend" v-for="(item,index) in message1" :key="index"  @click="toDetail(item.c_id)">
        <div class="left"><img :src="item.user_avat"></div>
        <div class="center">
          <div class="box1">{{item.user_truename}}<span>&emsp;LV{{item.grade}}</span></div>
          <div class="box2">{{item.user_sign}}</div>
          <div class="box3"> <div class="cai">{{item.dish[0]}}</div> <div class="cai">{{item.dish[1]}}</div> </div>
        </div>
        <div class="right">
          <div class="box1">{{price}}</div>
          <div class="box2">服务过{{item.family}}家庭</div>
        </div>
      </div>
    </div> 

    <div class="nav_title"><span>———</span><div class="box">猜你喜欢</div><span>———</span></div>
    <div class="outside">
      <div class="itemlist recommend" v-for="(item,index) in message2" :key="index"  @click="toDetail(item.c_id)">
        <div class="left"><img :src="item.user_avat"></div>
        <div class="center">
          <div class="box1">{{item.user_truename}}<span>&emsp;LV{{item.grade}}</span></div>
          <div class="box2">{{item.user_sign}}</div>
          <div class="box3"> <div class="cai">{{item.dish[0]}}</div> <div class="cai">{{item.dish[1]}}</div> </div>
        </div>
        <div class="right">
          <div class="box1">{{price}}</div>
          <div class="box2">服务过{{item.family}}家庭</div>
        </div>
      </div>
    </div>
    <!-- 省市县三级联动 -->
    <div class="mask" @click="cityalert=false" v-if="cityalert">
      <div class="addressAlert">
        <div class="box"><span>所在地区</span><button @click="loading2()">确定</button></div> 
        <mt-picker :slots="myAddressSlots" @change="onMyAddressChange" :visibleItemCount=3></mt-picker>
      </div>
    </div>
    <com-foot :select="0"></com-foot>
  </div>
</template>
<script>
import myaddress from "../assets/js/province.js"; //引入省市区数据
import { mapState } from "vuex";
export default {
  name: "index",
  data() {
    return {
      price: "议价",
      images: [
        require("../assets/image/lunbo.png"),
        require("../assets/image/lunbo.png"),
        require("../assets/image/lunbo.png")
      ],
      message1: [
        // {
        //   img: require("../assets/image/login1.png"),
        //   name: "张三1",
        //   mes: "简介",
        //   cai1: "川菜",
        //   cai2: "豫菜",
        //   price: "议价",
        //   server: "20"
        // },
        // {
        //   img: require("../assets/image/login1.png"),
        //   name: "张三2",
        //   mes: "简介",
        //   cai1: "川菜",
        //   cai2: "豫菜",
        //   price: "议价",
        //   server: "20"
        // }
      ],
      message2: {},
      myAddressSlots: [
        {
          flex: 1,
          defaultIndex: 1,
          values: Object.keys(myaddress), //省份数组
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: "——",
          className: "slot2"
        },
        {
          flex: 1,
          values: ['市辖区'],
          className: "slot3",
          textAlign: "center"
        },
        {
          divider: true,
          content: "——",
          className: "slot4"
        },
        {
          flex: 1,
          values: ['东城区'],
          className: "slot5",
          textAlign: "center"
        }
      ],
      cityalert: false,
      myAddressProvince: "省",
      myAddressCity: "市",
      myAddresscounty: "区/县",
      city_name: "",
      area: "选择城市"
    };
  },
  created() {
    // if (!localStorage.address) {
     
    //   this.area = "选择城市";

    //   console.log(11);
    // } else {
    //   console.log(22);
    //    this.area = localStorage.getItem('address.area');
    //   this.city_name = localStorage.getItem('address.city_name');
    // }
    this.loading1();

  },
  mounted() {
    this.$nextTick(() => {
      //vue里面全部加载好了再执行的函数  （类似于setTimeout）
      this.myAddressSlots[0].defaultIndex = 0;
      // 这里的值需要和 data里面 defaultIndex 的值不一样才能够初始化
      //因为我没有看过源码（我猜测是因为数据没有改变，不会触发更新）
    });
  },
  computed: {
    ...mapState(["dingwei"])
  },
  methods: {
    loading1() {
      this.axios
        .post("index/index", {
          token: this.token(),
          user_city: "",
          user_address: ""
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") { 
            if(data.addr.area){
              this.area = data.addr.area;
            }
            this.images = data.pic;
            this.message1 = data.guess;
            this.message2 = data.rand;
            // this.loading2()
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    loading2() {
      // this.area = this.area;
      this.cityalert = false;
      this.axios
        .post("index/index", {
          token: this.token(),
          user_city: this.city_name,
          user_address: this.area
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.images = data.pic;
            this.message1 = data.guess;
            this.message2 = data.rand;
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    toDetail(id) {
      this.$router.push({ name: "cookerDetail", query: { id: id }});
    },
    chooceAddress() {
      // this.$router.push("dingwei");
      this.cityalert = true;

    },
    onMyAddressChange(picker, values) {
      if (myaddress[values[0]]) {
        //这个判断类似于v-if的效果（可以不加，但是vue会报错，很不爽）
        picker.setSlotValues(1, Object.keys(myaddress[values[0]])); // Object.keys()会返回一个数组，当前省的数组
        picker.setSlotValues(2, myaddress[values[0]][values[1]]); // 区/县数据就是一个数组
        this.myAddressProvince = values[0];
        this.myAddressCity = values[1];
        this.myAddresscounty = values[2];
        // this.address = values[0] + values[1] + values[2];  省市县
        console.log(this.myAddressProvince);
        // if(!this.myAddressCity){
        //   this.area = this.myAddressProvince;
        // } else {
          this.city_name = values[1];
          this.area = values[2];
       
        
        // if (localStorage.address) {
        //   localStorage.removeItem("address");
          // localStorage.setItem("address.city_name", values[1]);
          // localStorage.setItem("address.area", values[2]);
        // } else {
        //   localStorage.setItem("address.city_name", values[1]);
        //   localStorage.setItem("address.area", values[2]);
        // }
      }
    }
  }
};
</script>
<style lang='scss'>
#index {
  padding-top: 100px;
  padding-bottom: 90px;
  background: url("../assets/image/navbg.png") no-repeat;
  background-size: 100%;
  #pageHead {
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
    .icon-fanhui {
      display: none;
    }
    span {
      font-size: 20px;
      padding: 10px;
    }
  }
  .outside {
    width: 690px;
    height: 100%;
    margin: 0 auto;
    // background-color: pink;
    background: rgba(255, 255, 255, 1);
    border-radius: 20px;
    .lunbo {
      width: 690px;
      height: 400px;
      border-radius: 20px;
      overflow: hidden;
      .mint-swipe-indicator {
        width: 10px;
        height: 12px;
        background: rgba(153, 153, 153, 1);
      }
      .is-active {
        background: #fff;
      }
      img {
        width: 100%;
      }
    }
    .recommend {
      // width: 690px;
      padding: 30px 0;
      margin: 0 20px;
      // border-radius: 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1Px solid rgba(238, 238, 238, 1);
      .left {
        width: 130px;
        height: 130px;
        border-radius: 65px;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .center {
        width: 280px;
        padding-left: 30px;
        box-sizing: border-box;
        .box1 {
          span {
            color: #FFB84B;
          }
        }
        .box2 {
          font-size: 24px;
          font-family: PingFangSC-Regular;
          color: rgba(102, 102, 102, 1);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          // -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .box3 {
          .cai {
            display: inline-block;
            // width:72px;
            padding: 2px 10px;
            height: 28px;
            border-radius: 18px;
            font-size: 20px;
            line-height: 28px;
            text-align: center;
            color: rgba(255, 113, 22, 1);
            border: 1Px solid rgba(255, 113, 22, 1);
          }
        }
      }
      .right {
        width: 230px;
        height: 90px;
        text-align: center;
        border-left: 1Px solid rgba(238, 238, 238, 1);
        .box1 {
          font-size: 32px;
          font-weight: 700;
          color: rgba(238, 0, 0, 1);
          line-height: 44px;
          letter-spacing: 2px;
        }
        .box2 {
          font-size: 20px;
          color: #666;
          text-align: center;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
  }
  .mask {
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    .addressAlert {
      width: 630px;
      padding: 30px;
      border-radius: 10px;
      position: absolute;
      top: 30vh;
      left: 30px;
      background-color: #fff;
      .box {
        margin: 0 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      button {
        padding: 5px 8px;
        border-radius: 3px;
        background-color: rgb(238, 236, 236);
      }
    }
  }
  .nav_title {
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 116px;
      font-size: 28px;
      margin: 0 37px;
      font-family: PingFangSC-Medium;
      font-weight: 700;
      color: rgba(0, 0, 0, 1);
      line-height: 100px;
    }
    span {
      color: rgba(221, 221, 221, 1);
    }
  }
}
</style>
