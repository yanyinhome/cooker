<template>
  <div id='qiangOrder'>
    <com-head :opacity='0'>厨师抢单</com-head>
    <div class="nav">
        <div @click="orderlist1" :class="{active: status1}">最新订单</div>
        <div @click="orderlist2" :class="{active: status2}">已抢订单</div>
    </div>
    <div class="orderimg"><img :src="img" alt=""></div>
    <div class="nav_title" v-if="status1"><span>———</span><div class="box">最新订单</div><span>———</span></div>
    <div class="nav_title" v-if="status2"><span>———</span><div class="box">已抢订单</div><span>———</span></div>
    <div class="message" v-for="(item,index) in data" :key="index">
      <div class="box1">
        <p>菜系：{{item.d_name}}</p>
        <p>预约时间：{{item.dinner + ':00'}}</p>
        <button @click="qiangdan(item.order_id)"  v-if="status1">立即抢单</button>
      </div>
      <div class="box2">
        <div class="headimg"><img :src="item.user_avat"></div>
        <div class="personmes">
          <p>姓名：{{item.addr_receiver}}</p>
          <p v-if="status1">联系电话：{{item.addr_phone | hideTel}}</p>
          <p v-if="status2">联系电话：{{item.addr_phone}}</p>
          <p v-if="status1">上门地址：{{item.pmc + item.addr_cont | hideAddress}}</p>
          <p v-if="status2">上门地址：{{item.pmc + item.addr_cont}}</p>
          <p>下单时间：{{item.order_create_time}}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "qiangOrder",
  data() {
    return {
      status1: true,
      status2: false,
      img: require("../assets/image/lunbo.png"),
      data: [
        {
          cai: "川菜",
          time: "2018-09-14 11:00",
          img: require("../assets/image/zanshi/head.jpg"),
          name: "张三1",
          phone: "188888888888",
          address: "瀚海北金瀚海北金",
          time: "2018-09-14 11:00"
        },
        {
          cai: "川菜",
          time: "2018-09-14 11:00",
          img: require("../assets/image/zanshi/head.jpg"),
          name: "张三2",
          phone: "188888888888",
          address: "瀚海北金瀚海北金",
          time: "2018-09-14 11:00"
        },
        {
          cai: "川菜",
          time: "2018-09-14 11:00",
          img: require("../assets/image/zanshi/head.jpg"),
          name: "张三3",
          phone: "188888888888",
          address: "瀚海北金瀚海北金",
          time: "2018-09-14 11:00"
        },
        {
          cai: "川菜",
          time: "2018-09-14 11:00",
          img: require("../assets/image/zanshi/head.jpg"),
          name: "张三4",
          phone: "188888888888",
          address: "瀚海北金瀚海北金",
          time: "2018-09-14 11:00"
        },
        {
          cai: "川菜",
          time: "2018-09-14 11:00",
          img: require("../assets/image/zanshi/head.jpg"),
          name: "张三5",
          phone: "188888888888",
          address: "瀚海北金瀚海北金",
          time: "2018-09-14 11:00"
        }
      ]
    };
  },

  computed: {},

  created() {},

  mounted() {
    this.loading();
  },
  methods: {
    loading () {
      this.axios.post("user/orderlist")
      .then(({ data }) => {
        console.log(data);
        if (data.code === "200") {
          this.data = data.data;
        } else if (data.code === "201") {
          this.$bus.$emit("toast", data.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    loading1 () {
      this.axios.post("user/grab",{
        token: this.token()
      })
      .then(({ data }) => {
        console.log(data);
        if (data.code === "200") {
          this.data = data.data;
        } else if (data.code === "201") {
          this.$bus.$emit("toast", data.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    qiangdan (id) {
      this.axios.post("user/order",{
        token: this.token(),
        order_id: id
      })
      .then(({ data }) => {
        console.log(data);
        if (data.code === "200") {
          this.status2 = true;
          this.status1 = false;
          this.loading1();
          this.$bus.$emit("toast", data.msg);
        } else if (data.code === "201") {
          this.$bus.$emit("toast", data.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    orderlist1() {
      this.status1 = true;
      this.status2 = false;
      this.loading();
    },
    orderlist2() {
      this.status2 = true;
      this.status1 = false;
      this.loading1();
    },
  }
};
</script>
<style lang='scss' scoped>
#qiangOrder {
  padding-top: 170px;
  padding-bottom: 30px;
  .nav {
    position: fixed;
    top: 81px;
    width: 750px;
    height: 70px;
    background: rgba(255, 255, 255, 1);
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0px 1Px 0px 0px rgba(0, 0, 0, 0.3);
    z-index: 100;
    div {
      width: 170px;
      height: 70px;
      font-size: 26px;
      text-align: center;
      line-height: 70px;
    }
    .active {
      border-bottom: 1Px solid #ffb84b;
      box-sizing: border-box;
    }
  }
  .orderimg {
    width: 690px;
    height: 220px;
    margin: 0 auto;
    border-radius: 20px;
    // background-color: red;
    overflow: hidden;
    img {
      width: 100%;
      // height: 100%;
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
  .message {
    width: 690px;
    padding: 30px;
    margin-bottom: 30px;
    box-sizing: border-box;
    margin: 20px auto;
    background: #ffffff;
    border-radius: 20px;
    .box1 {
      position: relative;
      border-bottom: 2px dashed rgba(221, 221, 221, 1);
      p:nth-of-type(1) {
        font-weight: 700;
      }
      p:nth-of-type(2) {
        font-size: 28px;
      }
      button {
        width: 146px;
        height: 56px;
        font-size: 26px;
        color: rgba(238, 0, 0, 1);
        border-radius: 28px;
        border: 1Px solid rgba(238, 0, 0, 1);
        background: none;
        position: absolute;
        right: 0px;
        top: 10px;
      }
    }
    .box2 {
      padding: 20px 0;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      .headimg {
        width: 130px;
        height: 130px;
        border-radius: 65px;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .personmes {
        width: 470px;
        margin-left: 30px;
        font-size: 26px;
        line-height: 50px;
        p:nth-of-type(3) {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
  }
}
</style>