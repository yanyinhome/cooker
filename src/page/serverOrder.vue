<template>
  <div id='serverOrder'>
    <com-head :opacity='0'>我的订单</com-head>
    <div class="nav">
        <div @click="orderlist1" :class="{active: status==='0'}">待接受</div>
        <div @click="orderlist2" :class="{active: status==='1'}">已接受</div>
        <div @click="orderlist3" :class="{active: status==='2'}">已完成</div>
    </div>
    <!-- 待接受 -->
    <div class="warn"  v-if="status==='0'">* 会员下单后，厨师半小时内未接单将自动取消预约。</div>
    <div class="message" :class="{navmargin: status==='0'}" v-for="(item,index) in data" :key="index">
      <div class="box1">
        <p v-if="item.d_name">菜系：{{item.d_name[0] +'，'+ item.d_name[1]}}</p>
        <p>预约时间：{{item.dinner + ":00"}}</p>
      </div>
      <div class="box2">
        <div class="headimg"><img :src="item.user_avat"></div>
        <div class="personmes">
          <p>姓名：{{item.addr_receiver}}</p>
          <p v-if="status==='0'">联系电话：{{item.addr_phone | hideTel}}</p>
          <p v-else>联系电话：{{item.addr_phone}}</p>
          <p v-if="status==='0'">上门地址：{{(item.pmc + item.addr_cont) | hideAddress}}</p>
          <p v-else>上门地址：{{item.pmc + item.addr_cont}}</p>
        </div>
      </div>
      <div class="box3">
        <p>下单时间：{{item.order_create_time + ":00"}}</p>
        <div  @click="jieDan(item.order_id)"  class="btn" v-if="status==='0'">立即接单</div>
        <div  class="btn" @click="sureOrder(item.order_id)" v-else-if="status==='1'">确认已服务</div>
        <div  class="recommend" v-else  @click="lookdetail(index,item.order_id)">查看评论</div>
      </div>
      <div class="detail" v-if="detail && content === index ">{{detail}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "serverOrder",
  data() {
    return {
      status: "0",
      content: "-1",
      detail: false,
      data: [
        // {
        //   cai: "川菜",
        //   time: "2018-09-14 11:00",
        //   img: require("../assets/image/zanshi/head.jpg"),
        //   name: "张三1",
        //   phone: "188888888888",
        //   address: "瀚海北金瀚海北金",
        //   time: "2018-09-14 11:00",
        //   content: "00"
        // },
        // {
        //   cai: "川菜",
        //   time: "2018-09-14 11:00",
        //   img: require("../assets/image/zanshi/head.jpg"),
        //   name: "张三2",
        //   phone: "188888888888",
        //   address: "河南省郑州市金水区",
        //   time: "2018-09-14 11:00",
        //   content: "00"
        // }
      ]
    };
  },

  computed: {},

  created() {
    this.loading('1');    
  },

  mounted() {
  },
  methods: {
    //查看评论
    lookdetail (index,id) {
      if (this.content === '-1') {
        this.content = index;
      } else {
        this.content = '-1';
      }
      console.log(index);
      this.axios.post('order/pinglun',{
        order_id: id
      })
        .then(({data}) => {
          console.log(data);
          if (data.code === '200') {
            if(data.data) {
              this.detail = data.data;
            } else {
              this.$bus.$emit('toast', '无评论信息');            
            }
          } else if (data.code === '201') {
            this.$bus.$emit('toast', data.msg);            
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loading (a) {
      this.axios.post("user/received",{
        token: this.token(),
        status: a
      })
      .then(({ data }) => {
        console.log(data);
        if (data.code === "200") {
          this.data = data.data;
        } else if (data.code === "201") {
          this.data = '';
          this.$bus.$emit("toast", data.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    jieDan(id) {
      this.status = "1";
      this.content = "-1";
      this.axios.post("user/taking",{
        order_id: id,
      })
      .then(({ data }) => {
        console.log(data);
        if (data.code === "200") {
          this.$bus.$emit("toast", data.msg);
        } else if (data.code === "201") {
          this.$bus.$emit("toast", data.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
    },
    sureOrder(id) {
      this.axios.post("user/complete",{
        order_id: id,
      })
      .then(({ data }) => {
        console.log(data);
        if (data.code === "200") {
          this.orderlist3();
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
      this.status = "0";
      this.content = "-1";
      this.loading('1');
    },
    orderlist2() {
      this.status = "1";
      this.content = "-1";
      this.loading('2');
    },
    orderlist3() {
      this.status = "2";
      this.content = "-1";
      this.loading('4');
    },
  }
};
</script>
<style lang='scss' scoped>
#serverOrder {
  padding-top: 140px;
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
      width: 130px;
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
  .warn {
    padding-left: 40px;
    font-size: 26px;
    color: rgba(238, 0, 0, 1);
    line-height: 76px;
  }
  .message {
    width: 690px;
    padding: 30px;
    box-sizing: border-box;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 20px;
    margin-bottom: 30px;
    margin-top: 30px;
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
      padding: 10px 0;
      display: flex;
      justify-content: flex-start;
      border-bottom: 2px dashed rgba(221, 221, 221, 1);
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
    .box3 {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      .btn {
        width: 146px;
        height: 56px;
        font-size: 26px;
        text-align: center;
        color: rgba(238, 0, 0, 1);
        border-radius: 28px;
        border: 1Px solid rgba(238, 0, 0, 1);
        background: none;
        position: absolute;
        right: 5px;
        top: 10px;
      }
      .jiedan {
        border: none;
        color: #000;
      }
      .recommend {
        padding: 0 5px;
        position: absolute;
        right: 5px;
        top: 10px;
        border-bottom: 1Px solid rgba(238, 0, 0, 1);
      }
      p {
        font-size: 28px;
        line-height: 80px;
      }
    }
    .detail {
      width: 630px;
      font-size: 26px;
      margin-top: 20px;
      padding: 10px;
      box-sizing: border-box;
      border-radius: 10px;
      border: 1Px solid rgba(153, 153, 153, 1);
      position: relative;
      &:before {
        position: absolute;
        content: "";
        width: 0;
        height: 0;
        right: 60px;
        top: -19px;
        border-bottom: 20px solid #999;
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
      }
      &:after {
        position: absolute;
        content: "";
        width: 0;
        height: 0;
        right: 62px;
        top: -17px;
        border-bottom: 18px solid #fff;
        border-left: 18px solid transparent;
        border-right: 18px solid transparent;
      }
    }
  }
  .navmargin {
    margin-top: 0px;
  }
}
</style>