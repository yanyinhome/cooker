<template>
  <div id='cooker'>
    <com-head :opacity='1'>厨师</com-head>
    <div class="nav_title">
      <div class="box" @click="changeMask2" :class="{boxactive: mask2}">{{time}}<i class="iconfont" :class="[mask2? 'icon-shang' : 'icon-xia','iconfont']"></i></div>
      <div class="box" @click="changeMask1" :class="{boxactive: mask1}">{{vagetables}}<i class="iconfont" :class="[mask1? 'icon-shang' : 'icon-xia','iconfont']"></i></div>
    </div>
    <div class="outside">
    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded">

      <div class="itemlist recommend" v-for="(item,index) in message" :key="index" @click="toDetail(item.c_id)">
        <div class="left"><img :src="item.user_avat"></div>
        <div class="center">
          <div class="box1">{{item.user_truename}}<span>&emsp;{{item.grade|grade}}</span></div>
          <div class="box2">{{item.user_sign}}</div>
          <div class="box3"> <div class="cai"  v-if="item.isiamic=='清真'">{{item.isiamic}}</div> <div class="cai" v-if="item.isiamic!='清真'">{{item.dish[0]}}</div>&nbsp; <div class="cai"  v-if="item.isiamic!='清真'&&item.dish[1]">{{item.dish[1]}}</div></div>
        </div>
        <div class="right">
          <div class="box1">{{item.price}}</div>
          <div class="box2">服务过{{item.family}}家庭</div>
        </div>
      </div>
      <!-- <div slot="bottom" class="mint-loadmore-bottom">
        <span v-show="bottomStatus !== 'loading'" :class="{ 'rotate': bottomStatus === 'drop' }">↓</span>
        <span v-show="bottomStatus === 'loading'">Loading...</span>
      </div> -->
    </mt-loadmore>

    </div> 
    <!-- 菜系遮罩 -->
    <div class="mask" v-show="mask1" @click="mask1=false">
      <div class="box">
        <div class="title" @click="allCai">不限菜系</div>
        <div class="content">
          <div v-for="(item,index) in item" :key="index"><div class="item"  @click="chooce(index,item.d_id)">{{item.name}}</div> </div> 
        </div>
      </div>
    </div>
    <!-- 时间弹窗 -->
    <div class="mask" v-if="mask2"  @click="mask2=false">
      <div class="box" :class="{box_click: '!mask2'}">
        <div class="title" @click="allTime">不限时间</div>
        <div class="content"> 
           <mt-picker ref="picker" :slots="slots" @change="onValuesChange" :visibleItemCount=3></mt-picker>
           <div class="btn"><button>取消</button><button @click="sureTIme()">确定</button></div>
        </div>
      </div>
    </div> 

    <com-foot :select="1"></com-foot>
  </div>
</template>
<script>
export default {
  name: "cooker",
  data() {
    return {
      grade: "",
      caixiId: "",
      mask1: false,
      mask2: false, //时间
      aaa: false,
      time: "用餐时间",
      vagetables: "菜系",
      item: [],
      message: [],
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
      ],
      searchCondition: {
        //分页属性
        pageNo: "1",
        pageSize: "10"
      },
      pageList: [],
      allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      scrollMode: "touch" //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
    };
  },
  created() {
    this.loadingTime();
  },
  mounted() {
    this.loading1();
    // this.loading2();
    this.loading3("", "");
  },
  methods: {
    // 菜系
    loading1() {
      this.axios
        .post("index/dish_list")
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.item = data.data;
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 预约时间
    // loading2 () {
    //   this.axios.post('index/apiTime')
    //     .then(({data}) => {
    //       console.log(data);
    //       if (data.code === '200') {
    //         this.slots[0].values = data.data;
    //       } else if (data.code === "201") {
    //         this.$bus.$emit("toast", data.msg);
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    // 厨师列表
    loading3(time, caixiId) {
      this.axios
        .post("cook/index", {
          token: this.token(),
          add_time: time,
          d_id: caixiId
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.message = data.data;
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    loadTop() {
      // 加载更多数据
      this.$refs.loadmore.onTopLoaded();
    },
    loadBottom() {
      // 加载更多数据
      this.allLoaded = true; // 若数据已全部获取完毕
      // this.$refs.loadmore.onBottomLoaded();
    },
    changeMask1() {
      this.mask2 = false;
      this.mask1 = !this.mask1;
    },
    changeMask2() {
      this.mask1 = false;
      this.mask2 = !this.mask2;
    },
    // 选择时间
    allTime() {
      this.time = "不限时间";
      if (this.vagetables === "不限菜系" || this.vagetables === "菜系") {
        this.loading3("", "");
      } else {
        this.loading3("", this.caixiId);
      }
    },
    sureTIme() {
      var myDate = new Date();
      var year = myDate.getFullYear();
      if (this.vagetables === "不限菜系" || this.vagetables === "菜系") {
        this.loading3(year + "-" + this.time, "");
      } else {
        this.loading3(year + "-" + this.time, this.caixiId);
      }
    },
    onValuesChange(picker, values) {
      if (picker.getSlotValue(0)) {
        this.time = picker.getSlotValue(0) + " " + picker.getSlotValue(1);
      } else {
        this.time = this.today1();
      }
    },
    // 选择菜系
    allCai(id) {
      var myDate = new Date();
      var year = myDate.getFullYear();
      this.vagetables = "不限菜系";
      if (this.time === "不限时间" || this.time === "用餐时间") {
        this.loading3("", "");
      } else {
        this.loading3(year + "-" + this.time, "");
      }
    },
    chooce(index, id) {
      var myDate = new Date();
      var year = myDate.getFullYear();
      console.log(id);
      this.mask = false;
      this.caiid = id;
      this.vagetables = this.item[index].name;
      if (this.time === "不限时间" || this.time === "用餐时间") {
        this.loading3("", id);
      } else {
        this.loading3(year + "-" + this.time, id);
      }
    },
    toDetail(id) {
      this.$router.push({ name: "cookerDetail", query: { id: id } });
    }
  }
};
</script>
<style lang='scss'>
#cooker {
  padding-top: 100px;
  padding-bottom: 30px;
  box-sizing: border-box;
  background: url("../assets/image/navbg.png") no-repeat;
  background-size: 100%;
  #pageHead {
    color: #fff;
    .icon-fanhui {
      display: none;
    }
  }
  .outside {
    width: 690px;
    // height: 100%;
    position: absolute;
    top: 200px;
    bottom: 100px;
    left: 30px;
    margin: 10px auto;
    // background-color: pink;
    background: rgba(255, 255, 255, 1);
    border-radius: 20px;
    overflow: scroll;
    .recommend {
      // width: 690px;
      padding: 30px 0;
      margin: 0 20px;
      // border-radius: 20px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(238, 238, 238, 1);
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
        width: 300px;
        padding-left: 20px;
        // text-align: left;
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
            border: 1px solid rgba(255, 113, 22, 1);
          }
        }
      }
      .right {
        width: 230px;
        // margin: 0 30px;
        height: 90px;
        text-align: center;
        border-left: 1px solid rgba(238, 238, 238, 1);
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
  .nav_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 140px;
    .box {
      font-size: 26px;
      color: #fff;
      line-height: 100px;
      padding: 0 20px;
      .iconfont {
        color: #fff;
      }
    }
    .boxactive {
      border-bottom: 2px solid rgba(255, 184, 75, 1);
    }
    span {
      color: rgba(221, 221, 221, 1);
    }
  }
  .mask {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: calc(100% - 210px);
    background: rgba(0, 0, 0, 0.5);
    z-index: 97;
    .box {
      margin-top: 200px;
      transition: all 2s;
      width: 750px;
      // height: 0px;
      margin: 0px auto;
      background: rgba(255, 255, 255, 1);
      // background: rgba(0, 0, 0, 1);
      text-align: center;
      z-index: 98;
      overflow: hidden;
      // &.box_click {
      //   height: 400px;
      //   transition: all 2s;
      // }
      .title {
        display: inline-block;
        padding: 0 30px;
        margin: 30px 0;
        text-align: center;
        line-height: 60px;
        font-size: 24px;
        box-sizing: border-box;
        // border:1Px solid rgba(153,153,153,1);
        background: rgba(255, 184, 75, 1);
        border-radius: 30px;
      }
      .content {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .item {
          width: 120px;
          height: 60px;
          font-size: 24px;
          border-radius: 30px;
          color: #212121;
          margin: 20px 30px;
          text-align: center;
          line-height: 60px;
          border: 1px solid rgba(153, 153, 153, 1);
        }
      }
    }
    .picker {
      width: 750px;
      font-size: 30px;
      .picker-center-highlight {
        border-bottom: 1px solid #eee;
        border-top: 1px solid #eee;
      }
      .picker-slot-divider {
        color: #999;
      }
      .picker-slot {
        text-align: center;
      }
    }
    .btn {
      background: rgba(255, 184, 75, 1);
      button {
        width: 374px;
        height: 40px;
        margin: 20px 0;
        background-color: transparent;
      }
      button:nth-of-type(1) {
        border-right: 2px solid #666;
      }
    }
  }
}
</style>
