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
    <div class="nav_title"><span>———</span><div class="box">名厨推荐</div><span>———</span></div>
    <div class="outside">
      <div class="itemlist recommend" v-for="(item,index) in message1" :key="index"  @click="toDetail(item.c_id)">
        <div class="left"><img :src="item.user_avat"></div>
        <div class="center">
          <div class="box1">{{item.user_truename}}<span v-if="item.grade>0">&emsp;LV{{item.grade}}</span><span v-else>&emsp;LV0</span></div>
          <div class="box2">{{item.user_sign}}</div>
          <div class="box3">  <div class="cai"  v-if="item.isiamic=='清真'">{{item.isiamic}}</div><div class="cai"  v-if="item.isiamic!='清真'">{{item.dish[0]}}</div> <div class="cai"  v-if="item.isiamic!='清真'">{{item.dish[1]}}</div> </div>
        </div>
        <div class="right">
          <div class="box1">{{price}}</div>
          <div class="box2">服务过{{item.family}}家庭</div>
        </div>
      </div>
    </div> 

    <div class="nav_title"><span>———</span><div class="box">商务套餐《敬请关注》</div><span>———</span></div>
    <div class="outside">
      <div class="itemlist recommend" v-for="(item,index) in message2" :key="index"  @click="toDetail(item.c_id)">
        <div class="left"><img :src="item.user_avat"></div>
        <div class="center">
          <div class="box1">{{item.user_truename}}<span v-if="item.grade>0">&emsp;LV{{item.grade}}</span><span v-else>&emsp;LV0</span></div>          
          <div class="box2">{{item.user_sign}}</div>
          <div class="box3">  <div class="cai"  v-if="item.isiamic=='清真'">{{item.isiamic}}</div><div class="cai"   v-if="item.isiamic!='清真'">{{item.dish[0]}}</div> <div class="cai"   v-if="item.isiamic!='清真'">{{item.dish[1]}}</div> </div>
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
        // require("../assets/image/lunbo.png"),
        // require("../assets/image/lunbo.png"),
        // require("../assets/image/lunbo.png")
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
      message2: [],
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
          values: ["市辖区"],
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
          values: ["东城区"],
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
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     if (vm.IsWechat()) {
  //       // vm.$bus.$emit("toast", "是微信浏览器");
  //       console.log(vm.getCookie("openid"));
  //       if (!vm.getCookie("openid")) {
  //         console.log("跳转");
  //         window.location.href =
  //           "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx85c8ad7b84b0d265&redirect_uri=http%3a%2f%2fcschushi.cadhx.com%2fapi%2fwechat%2fset_openid&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";

  //         var openid = vm.getUrlKey("openid");
  //         console.log("openid" + openid);
  //         if (!vm.getCookie("openid")) {
  //           vm.setCookie("openid", openid, 3000);
  //         } else {
  //           vm.delCookie("openid");
  //           vm.setCookie("openid", openid, 3000);
  //         }
  //       }
  //     } else {
  //       vm.$bus.$emit("toast", "请在微信浏览器中打开");
  //     }
  //   });
  // },
  created() {
    if (this.IsWechat()) {
      // this.$bus.$emit("toast", "是微信浏览器");
      console.log(this.getCookie("openid"));
      if (!this.getCookie("openid")) {
        console.log("跳转");
        window.location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx85c8ad7b84b0d265&redirect_uri=http%3a%2f%2fcschushi.cadhx.com%2fapi%2fwechat%2fset_openid&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6369205e9b2dd4e6&redirect_uri=http://xiaoshuo.cadhx.com/login/set_openid&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect
        var openid = this.getUrlKey("openid");
        console.log("openid" + openid);
        if (!this.getCookie("openid")) {
          this.setCookie("openid", openid, 3000);
        } else {
          this.delCookie("openid");
          this.setCookie("openid", openid, 3000);
        }
      }
    } else {
      this.$bus.$emit("toast", "请在微信浏览器中打开");
    }
  },
  mounted() {
    this.loading1();
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
    getUrlKey: function(name) {
      //获取url 参数
      return decodeURIComponent(
        (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
          window.location.href
        ) || [, ""])[1].replace(/\+/g, "%20")
      );
    },
    loading1() {
      this.axios
        .post("index/index", {
          openid: this.getCookie("openid"),
          user_city: "",
          user_address: ""
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            if (localStorage.token) {
              localStorage.removeItem("token");
              localStorage.setItem("token", data.token);
            } else {
              localStorage.setItem("token", data.token);
            }
            console.log(data.token);
            // if (!this.getCookie("token")) {
            //   this.setCookie("token", data.token, 3000);
            // } else {
            //   this.delCookie("token");
            //   this.setCookie("token", data.token, 3000);
            // }
            if (data.addr.area) {
              this.area = data.addr.area;
            }
            this.images = data.pic;
            this.message1 = data.guess;
            this.message2 = data.rand;
            this.loading2()
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          } else if (data.code === "204") {
            this.delCookie("openid");
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
          openid: this.getCookie("openid"),
          user_city: this.city_name,
          user_address: this.area
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            console.log(data.token);
            // if (!this.getCookie("token")) {
            //   this.setCookie("token", data.token, 3000);
            // } else {
            //   this.delCookie("token");
            //   this.setCookie("token", data.token, 3000);
            // }

            if (localStorage.token) {
              localStorage.removeItem("token");
              localStorage.setItem("token", data.token);
            } else {
              localStorage.setItem("token", data.token);
            }
            this.images = data.pic;
            this.message1 = data.guess;
            this.message2 = data.rand;
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          } else if (data.code === "204") {
            this.delCookie("openid");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    toDetail(id) {
      this.$router.push({ name: "cookerDetail", query: { id: id } });
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
            color: #ffb84b;
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
            padding: 4px 8px;
            height: 28px;
            border-radius: 15px;
            font-size: 20px;
            line-height: 24px;
            text-align: center;
            box-sizing: border-box;
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
      // width: 116px;
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
