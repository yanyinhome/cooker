<template>
  <div id='cookerDetail'>
    <com-head :opacity='0'>{{message.user_truename}}</com-head>
    <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded">
    <div class="detailhead">
      <div class="headimg"><img :src="message.user_avat"></div>
      <p>{{message.user_truename}}</p>
      <p>{{message.user_mobile | hideTel}}</p>
      <p>已服务过{{message.order_num}}家庭</p>
      <p>等级：<span v-if="message.grade>0">LV{{message.grade}}</span><span v-else>LV0</span> &emsp;服务费：<span v-if="message.service>0">{{message.service}}</span><span v-else>无</span></p>
      <div class="box3"> <div class="cai">{{message.isiamic}}</div> <div class="cai">{{message.dish[0]}}</div> <div class="cai">{{message.dish[1]}}</div></div>
    </div>
    <div class="zhengjian">
        <div class="box">
            <div class="img"><img :src="message.cool_card"></div>
            <p>厨师证</p>
        </div>
        <div class="box">
            <div  class="img"><img :src="message.health_card"></div>
            <p>健康证</p>
        </div>
    </div>
    <div class="comments">
        <div class="title"><i class="iconfont icon-xiaoxi" />&nbsp;<span>大厨·客说</span></div>
        <div class="recommend" v-for="(item,index) in recommend" :key="index">
          <div class="shang">
            <div class="box">
              <div class="person_img"><img :src="item.user_avat"></div>
              <div class="person_name">{{item.user_truename | hideName}}</div>
            </div>
            <div class="comment_time">{{item.add_time}}</div>
          </div>
          <div class="xia">{{item.comment}}</div>
        </div>
    </div>
    <div class="nomore">没有更多评论啦~</div>
    </mt-loadmore>
    <div class="btn">
      <button @click="collect()"><i class="iconfont icon-shoucanghover" :class="{active: active}"/></button>
      <button @click="toOrder()">预约厨师</button>
    </div>

  </div>
</template>

<script>
export default {
  name: "cookerDetail",
  data() {
    return {
      active: false,
      id: this.$route.query.id,
      message: {
        // name: "张三",
        // img1: require("../assets/image/zanshi/head.jpg"),
        // img2: require("../assets/image/login1.png"),
        // img3: require("../assets/image/login1.png"),
        // phone: "188888888888",
        // cai1: "川菜",
        // cai2: "豫菜",
        // price: "议价",
        // server: "20"
      },
      recommend: [
        // {
        //   img: require("../assets/image/zanshi/head.jpg"),
        //   name: "你好1",
        //   time: "2018-09-12 09:30",
        //   message:
        //     "张师傅做的菜品非常精致，味道也很棒，家人都很喜欢，大力推荐，平台推荐的很好！&#128077"
        // },{
        //   img: require("../assets/image/zanshi/head.jpg"),
        //   name: "你好2",
        //   time: "2018-09-12 09:30",
        //   message:
        //     "张师傅做的菜品非常精致，味道也很棒，家人都很喜欢，大力推荐，平台推荐的很好！&#128077"
        // },{
        //   img: require("../assets/image/zanshi/head.jpg"),
        //   name: "你好3",
        //   time: "2018-09-12 09:30",
        //   message:
        //     "张师傅做的菜品非常精致，味道也很棒，家人都很喜欢，大力推荐，平台推荐的很好！&#128077"
        // },{
        //   img: require("../assets/image/zanshi/head.jpg"),
        //   name: "你好4",
        //   time: "2018-09-12 09:30",
        //   message:
        //     "张师傅做的菜品非常精致，味道也很棒，家人都很喜欢，大力推荐，平台推荐的很好！&#128077"
        // },{
        //   img: require("../assets/image/zanshi/head.jpg"),
        //   name: "你好5",
        //   time: "2018-09-12 09:30",
        //   message:
        //     "张师傅做的菜品非常精致，味道也很棒，家人都很喜欢，大力推荐，平台推荐的很好！&#128077"
        // },{
        //   img: require("../assets/image/zanshi/head.jpg"),
        //   name: "你好6",
        //   time: "2018-09-12 09:30",
        //   message:
        //     "张师傅做的菜品非常精致，味道也很棒，家人都很喜欢，大力推荐，平台推荐的很好！&#128077"
        // },{
        //   img: require("../assets/image/zanshi/head.jpg"),
        //   name: "你好7",
        //   time: "2018-09-12 09:30",
        //   message:
        //     "张师傅做的菜品非常精致，味道也很棒，家人都很喜欢，大力推荐，平台推荐的很好！&#128077"
        // },
      ],
      allLoaded: false
    };
  },

  computed: {},

  created() {},

  mounted() {
    // console.log(this.id);
    this.loading();
  },
  // 局部过滤器，隐藏名字
  filters: {
    hideName(value) {
      if (!value) {
        return;
      }
      if (typeof value !== "string") {
        value = value.toString();
      }
      return value.slice(0, 1).concat("**");
    }
  },
  methods: {
    //厨师详情 用户评论
    loading() {
      this.axios
        .post("cook/detail", {
          token: this.token(),
          c_id: this.id
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.message = data.data;
            this.recommend = data.comment;
            this.active = data.is_sc;
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadBottom() {
      // console.log(258);
      // 加载更多数据
      // this.allLoaded = true;// 若数据已全部获取完毕
      // this.$refs.loadmore.onBottomLoaded();
    },
    // 收藏厨师
    collect() {
      // !this.active = false? this.active = 1 : this.active =0
      this.axios
        .post("cook/storeup", {
          token: this.token(),
          c_id: this.id,
          is_sc: !this.active === false ? "1" : "0"
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.$bus.$emit("toast", data.msg);
            this.active = !this.active;
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 预约厨师
    toOrder() {
      this.$router.push({
        name: "sureOrder",
        query: { id: this.id, name: this.message.user_truename }
      });
    }
  }
};
</script>
<style lang='scss'>
#cookerDetail {
  padding-bottom: 100px;
  height: 100vh;
  box-sizing: border-box;
  overflow: scroll;
  #pageHead {
    background-color: #212121;
    color: #fff;
    .icon-fanhui {
      color: #fff;
    }
  }
  .detailhead {
    width: 750px;
    padding-top: 200px;
    background: url("../assets/image/navbg.png") no-repeat;
    background-size: 100%;
    background-color: #fff;
    padding-bottom: 20px;
    text-align: center;
    .headimg {
      margin: 0 auto;
      width: 200px;
      height: 200px;
      border-radius: 100px;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    p:nth-of-type(1) {
      font-size: 32px;
      line-height: 70px;
      span {
        color: #ffb84b;
      }
    }
    p:nth-of-type(2) {
      font-size: 30px;
      line-height: 40px;
    }
    p:nth-of-type(3) {
      font-size: 26px;
      line-height: 56px;
      color: #666;
    }
    p:nth-of-type(4) {
      span {
        color: #ffb84b;
      }
    }
    .box3 {
      border-top: 1Px dashed #888;
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
  .zhengjian {
    margin-top: 30px;
    padding: 30px 60px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    .box {
      .img {
        width: 290px;
        height: 198px;
        border-radius: 6px;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      p {
        text-align: center;
        line-height: 60px;
      }
    }
  }
  .comments {
    margin-top: 20px;
    background-color: #fff;
    .title {
      width: 750px;
      padding: 0 30px;
      box-sizing: border-box;
      border-bottom: 1Px solid #dddddd;
      .iconfont {
        font-size: 34px;
      }
      span {
        font-size: 28px;
        line-height: 80px;
      }
    }
    .recommend {
      box-sizing: border-box;
      border-bottom: 1Px solid #eee;
      .shang {
        margin: 20px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .person_img {
            width: 90px;
            height: 90px;
            border-radius: 45px;
            overflow: hidden;
            img {
              width: 100%;
            }
          }
          .person_name {
            margin-left: 20px;
          }
        }
        .comment_time {
          color: #666;
        }
      }
      .xia {
        margin: 30px 20px;
      }
    }
    .person_name {
      margin-left: 5px;
    }
  }
  .nomore {
    text-align: center;
    line-height: 100px;
    color: #666;
    font-size: 26px;
  }
  .btn {
    position: fixed;
    top: 100vh;
    left: 50%;
    width: 750px;
    margin-left: -375px;
    button:nth-of-type(1) {
      position: fixed;
      bottom: 0;
      left: 0;
      color: #fff;
      width: 260px;
      height: 80px;
      background: #212121;
      .iconfont {
        font-size: 40px;
      }
    }
    .active {
      color: #ee0000;
      font-size: 50px;
    }
    button:nth-of-type(2) {
      position: fixed;
      bottom: 0;
      right: 0;
      font-size: 30px;
      color: #000000;
      width: 490px;
      height: 80px;
      background: #ffb84b;
    }
  }
}
</style>