<template>
  <div id='order'>
    <com-head>订单</com-head>
    <div class="orderTitle">当前订单</div>
    <div class="order" v-for="(item,index) in message1" :key="index">
      <div class="orderTop">
        <div class="box1">订单号：{{item.order_no}}</div>
        <div class="box2">下单时间：{{item.order_create_time}}</div>
      </div>
      <div class="orderCenter">
        <div class="box1"  v-if="item.status!='1'"><img :src="item.user_avat"></div>
        <div class="box2"  v-if="item.status=='1'">暂无厨师接单</div>
        <div class="box2" v-if="item.status!='1'">
          <p>{{item.user_truename}}<i class="iconfont icon-xiayi" /></p>
          <p>{{item.user_sign}}</p>
        </div>
        <div class="box3"><p>{{server[0]}}</p> <p>议价</p></div>
      </div>
      <div class="orderFoot">
        <p>预约时间：{{item.dinner + ':00'}}</p>
        <button @click="cancleOrder(item.order_id,index,item.status)" :class="{ 'evaluate': item.status === 7}">{{server[item.status]}}</button>
      </div>
    </div>
    <div class="orderTitle">历史订单</div>
    <div class="order" v-for="item in message2" :key="item.order_id">
      <div class="orderTop">
        <div class="box1">订单号：{{item.order_no}}</div>
        <div class="box2">下单时间：{{item.order_create_time}}</div>
      </div>
      <div class="orderCenter">
        <div class="box1"><img :src="item.user_avat" alt=""></div>
        <div class="box2">
          <p>{{item.user_truename}}<i class="iconfont icon-xiayi" /></p>
          <p>{{item.user_sign}}</p>
        </div>
        <div class="box3"><p>{{server[5]}}</p> <p>议价</p></div>
      </div>
      <div class="orderFoot">
        <p>预约时间：{{item.dinner + ':00'}}</p>
        <router-link :to="{name:'evaluate',query:{id: item.order_cid}}" tag="button"  class="evaluate">评价厨师</router-link>
        <!-- <button :class="{ 'evaluate': item.status === 4}">评价厨师</button> -->
        <button  @click="reappoint(item.order_cid,item.user_truename)">再次预约</button>
      </div>
    </div>
    <com-foot :select="3"></com-foot>
  </div>
</template>
<script>
export default {
  name: "order",
  data() {
    return {
      server: [
        "待服务",
        "取消预约",
        "厨师已接单，等待上门",
        "厨师已接单，等待上门",
        "评价厨师",
        "已服务",
        "已服务",
        "确定已服务"
      ],
      message1: [
        // {
        //   number: "88888819",
        //   time: "2018.10.02",
        //   img: require("../assets/image/zanshi/touxiang.jpg"),
        //   name: "张三1",
        //   content: "擅长川菜、豫菜、客家菜，辛辣菜辛辣菜辛辣菜"
        // },
        // {
        //   number: "88888289",
        //   time: "2018.10.02",
        //   img: require("../assets/image/zanshi/touxiang.jpg"),
        //   name: "张三2",
        //   content: "擅长川菜、豫菜、客家菜，辛辣菜辛辣菜辛辣菜"
        // }
      ],
      message2: [
        // {
        //   number: "88883889",
        //   time: "2018.10.02",
        //   img: require("../assets/image/zanshi/touxiang.jpg"),
        //   name: "张三3",
        //   content: "擅长川菜、豫菜、客家菜，辛辣菜辛辣菜辛辣菜"
        // },
        // {
        //   number: "88848889",
        //   time: "2018.10.02",
        //   img: require("../assets/image/zanshi/touxiang.jpg"),
        //   name: "张三4",
        //   content: "擅长川菜、豫菜、客家菜，辛辣菜辛辣菜辛辣菜"
        // }
      ]
    };
  },
  created() {
    this.loading();
  },
  mounted() {},
  methods: {
    // 订单
    loading() {
      this.axios
        .post("order/index", {
          token: this.token()
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.message1 = data.data;
            this.message2 = data.data1;
          } else if (data.code === "201") {
            this.$bus.$emit('toast', data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    cancleOrder(id, index, status) {
      if (status === 1) {
        //取消预约
        console.log(id);
        this.closeappoint(id, index);
      } else if (status === 7) {
        //确认已服务
        this.sureserver(id);
      } else if (status === 2) {
        //查看是否接单
        // console.log(id);
        this.$router.push({name:'waitOrder',query:{id: id}})
      }
    },
    // 再次预约
    reappoint(id,name) {
      // this.$bus.$emit("toast", "预约成功");
      // this.message2.splice(index, 1);
      // this.message1.push(this.message2[index]);
      this.$router.push({name:'sureOrder',query:{id: id,name: name}});
    },
    // 确认已服务
    sureserver(id) {
      this.axios
        .post("order/firm", {
          order_id: id
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
    // 取消预约
    closeappoint(id,index) {
      this.$bus.$emit("comAlert", {
        title: "温馨提示",
        info: "你确定要删除张三的预约",
        button: [
          {
            text: "确认",
            callback: () => {
              this.axios
                .post("cook/remove", {
                  order_id: id
                })
                .then(({ data }) => {
                  console.log(data);
                  if (data.code === "200") {
                    this.message1.splice(index, 1);
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
    }
  }
};
</script>
<style lang='scss'>
#order {
  padding-top: 100px;
  padding-bottom: 100px;
  #pageHead {
    .icon-fanhui {
      display: none;
    }
  }
  .orderTitle {
    line-height: 80px;
    font-size: 40px;
    padding-left: 30px;
    font-weight: 500;
  }
  .order {
    width: 690px;
    // height: 334px;
    margin: 10px auto;
    background: rgba(255, 255, 255, 1);
    border-radius: 20px;
    .orderTop {
      margin: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 24px;
      color: #666;
      line-height: 66px;
      border-bottom: 1Px solid #eee;
    }
    .orderCenter {
      margin: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .box1 {
        width: 80px;
        height: 80px;
        border-radius: 40px;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .box2 {
        width: 350px;
        margin-left: 30px;
        // margin-right: 30px;
        p:nth-of-type(1) {
          font-size: 30px;
        }
        p:nth-of-type(2) {
          font-size: 24px;
          color: #666;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
      .box3 {
        width: 160px;
        text-align: right;
        p {
          font-size: 24px;
        }
      }
    }
    .orderFoot {
      text-align: right;
      margin: 20px 30px;
      padding-top: 20px;
      padding-bottom: 20px;
      box-sizing: border-box;
      font-size: 26px;
      border-top: 1Px dashed #eee;
      button {
        margin: 20px 0 10px 20px;
        background: none;
        padding: 10px 20px;
        font-size: 26px;
        border-radius: 6px;
        border: 1Px solid rgba(153, 153, 153, 1);
      }
      .evaluate {
        margin: 20px 0 10px 20px;
        padding: 10px 20px;
        font-size: 26px;
        border-radius: 6px;
        color: #ee0000;
        border: 1Px solid #ee0000;
      }
      .noborder {
        color: #666;
        border: none;
      }
    }
  }
}
</style>
