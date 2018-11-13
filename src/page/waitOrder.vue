<template>
  <div id='usercenter'>
    <com-head :opacity='1'>{{title}}</com-head>
    <div class="detailhead" v-if="active">
      <div class="img">
         <div class="headimg"><img :src="img1"></div>
         <div class="center">
           <div class="shalou"><img :src="img2"></div>
           <p>{{time}}</p>
          </div> 
      </div>
      <p>等待厨师接单中...</p>
      <com-button :click="fabu">返回厨师列表</com-button>
      <div class="close" @click="closeOrder">取消预约</div>
    </div>
    <!-- 预约失败 -->
    <div class="defeated" v-else>
       <div class="headimg"><img :src="img3"></div>
       <p>很抱歉，厨师未能在规定时间内接受预约 请重新预约</p>
       <com-button :click="fabu">我知道了</com-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "usercenter",
  data() {
    return {
      active: true,
      title: "等待中",
      time: "",
      img1: require("../assets/image/circle.png"),
      img2: require("../assets/image/shalou.png"),
      img3: require("../assets/image/yuyue.png")
    };
  },

  computed: {},

  created() {
    this.loading();
  },

  mounted() {
  },

  methods: {
    loading() {
      this.axios
        .post("Order/outtime", {
          order_id: this.$route.query.id
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            //已接单
            this.$router.push("order");
            this.$bus.$emit('toast', data.msg);
          } else if (data.code === "201") {
            //超时
            this.active = false;
            this.$bus.$emit('toast', data.msg);
          } else if (data.code === "202") {
            //未接单
            this.$bus.$emit('toast', data.msg);
            this.showTime(data.time);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    closeOrder() {
      this.$bus.$emit("comAlert", {
        title: "温馨提示",
        info: "你确定要删除预约",
        button: [
          {
            text: "确认",
            callback: () => {
              this.axios
                .post("cook/remove", {
                  order_id: this.$route.query.id
                })
                .then(({ data }) => {
                  console.log(data);
                  if (data.code === "200") {
                    this.$router.push("cooker");
                    this.$bus.$emit("toast", data.msg);
                  } else if (data.code === "201") {
                    this.$bus.$emit("toast", data.msg);
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            }
          },
          {
            text: "取消",
            callback: () => {}
          }
        ]
      });
    },
    fabu() {
      this.$router.push("cooker");
    },
    showTime(endTime) {
      setInterval(() => {
        var myData = new Date().getTime(); //获取当前时间 毫秒数
        // console.log(myData);
        // var endTime = 1541001600000;
        var leftHMS = endTime * 1000 - myData - 34000; //结束时间-当前时间=剩下时间（毫秒数）
        var theTime = parseInt(leftHMS / 1000); // 毫秒数转化秒
        // var theTime1 = 0; // 分
        // var theTime2 = 0; // 小时
        // if (theTime > 60) {
        //   theTime1 = parseInt(theTime / 60);
        //   theTime = parseInt(theTime % 60);
        //   if (theTime1 > 60) {
        //     theTime2 = parseInt(theTime1 / 60);
        //     theTime1 = parseInt(theTime1 % 60);
        //   }
        // }
        // if (theTime < 10) {
        //   var result = "0" + parseInt(theTime) + "";  // 秒
        // } else {
        //   var result = "" + parseInt(theTime) + "";  // 秒
        // }
        // if (theTime1 < 10) {
        //   result = "0" + parseInt(theTime1) + ":" + result;  // 分
        // } else {
        //   result = "" + parseInt(theTime1) + ":" + result;  // 分
        // }
        // if (theTime2 < 10) {
        //   result = "0" + parseInt(theTime2) + ":" + result;  // 小时
        // } else {
        //   result = "" + parseInt(theTime2) + ":" + result;  // 小时
        // }
        var hh = parseInt(theTime / 3600);
        if (hh < 10) hh = "0" + hh;
        var mm = parseInt((theTime - hh * 3600) / 60);
        if (mm < 10) mm = "0" + mm;
        var ss = parseInt((theTime - hh * 3600) % 60);
        if (ss < 10) ss = "0" + ss;
        var length = mm + ":" + ss;
        if (theTime > 0) {
          // console.log(length);
          this.time = length;
          return length;
        } else {
          // console.log(length);
          return "00:00";
          // this.active = false;
        }
      }, 1000);
    }
  }
};
</script>
<style lang='scss' scoped>
#usercenter {
  padding-bottom: 450px;
  padding-top: 120px;
  background: url("../assets/image/navbg.png") no-repeat;
  background-size: 100%;
  text-align: center;
  #pageHead {
    color: #fff;
    .icon-fanhui {
      display: none;
    }
  }
  .defeated {
    width: 690px;
    height: 336px;
    margin: 0 auto;
    border-radius: 20px;
    background-color: #fff;
    padding-bottom: 20px;
    text-align: center;
    position: relative;
    .headimg {
      padding-top: 100px;
      margin: 0 auto;
      width: 570px;
      height: 570px;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    p {
      margin-top: 100px;
      padding: 0 30px;
      font-size: 32px;
      line-height: 50px;
    }
  }
  .detailhead {
    width: 690px;
    height: 336px;
    margin: 0 auto;
    border-radius: 20px;
    background-color: #fff;
    padding-bottom: 20px;
    text-align: center;
    position: relative;
    .img {
      position: relative;
      .headimg {
        padding-top: 40px;
        margin: 0 auto;
        width: 690px;
        height: 790px;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .center {
        width: 200px;
        height: 200px;
        overflow: hidden;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -25%);
        .shalou {
          width: 44px;
          height: 80px;
          margin: 0 auto;
          img {
            width: 100%;
          }
        }
        p {
          color: #e00;
        }
      }
    }
    p:nth-of-type(1) {
      font-size: 32px;
      line-height: 70px;
      font-weight:400;
    }
    p:nth-of-type(2) {
      font-size: 30px;
      line-height: 40px;
    }
    .close {
      width: 130px;
      height: 50px;
      margin: 30px auto;
      color: #696666;
      margin-top: 30px;
      border-bottom: 1Px solid #696666;
    }
  }
}
</style>