<template>
  <div id='collection'>
    <com-head :opacity='0'>我的收藏</com-head>
    <div class="container">
    <ul v-infinite-scroll="loadMore"
        infinite-scroll-disabled="loading"
        infinite-scroll-distance="50"
        :auto-fill="false">
        <li class="list-item " v-for="(item,index) in list " data-type="0" :key="index">
        <div class="list-box" @touchstart.capture="touchStart" @touchend.capture="touchEnd" @click="skip(item.user_id)">
            <div  class="list-img"><img :src="item.user_avat"></div>
            <div class="list-content">
            <p class="title">{{item.user_truename}}</p>
            <p class="tips">{{item.user_sign}}</p>
            <div class="box3"> <div class="cai"  v-if="item.isiamic=='清真'">{{item.isiamic}}</div> <div class="cai" v-if="item.isiamic!='清真'">{{item.dish[0]}}</div> <div class="cai" v-if="item.isiamic!='清真'">{{item.dish[1]}}</div> </div>
            </div>
        </div>
        <div class="delete" @click="deleteItem(index,item.user_id)" :data-index="index"><i class="iconfont icon-shanchu" /></div>
        </li>
    </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "collection",
  data() {
    return {
      list: [],
      startX: 0,
      endX: 0
    };
  },
  created() {
    this.loadMore();
  },
  methods: {
    //跳转
    skip(id) {
      if (this.checkSlide()) {
        this.restSlide();
      } else {
        // alert("You click the slide!");
        this.$router.push({ name: "cookerDetail", query: { id: id } });
      }
    },
    loadMore() {
      this.loading = false;
      console.log(11111111);
      this.axios
        .post("user/apicole", {
          token: this.token()
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.list = data.data;
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //滑动开始
    touchStart(e) {
      // 记录初始位置
      this.startX = e.touches[0].clientX;
    },
    //滑动结束
    touchEnd(e) {
      // 当前滑动的父级元素
      let parentElement = e.currentTarget.parentElement;
      // 记录结束位置
      this.endX = e.changedTouches[0].clientX;
      // 左滑
      if (parentElement.dataset.type == 0 && this.startX - this.endX > 30) {
        this.restSlide();
        parentElement.dataset.type = 1;
      }
      // 右滑
      if (parentElement.dataset.type == 1 && this.startX - this.endX < -30) {
        this.restSlide();
        parentElement.dataset.type = 0;
      }
      this.startX = 0;
      this.endX = 0;
    },
    //判断当前是否有滑块处于滑动状态
    checkSlide() {
      let listItems = document.querySelectorAll(".list-item");
      for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].dataset.type == 1) {
          return true;
        }
      }
      return false;
    },
    //复位滑动状态
    restSlide() {
      let listItems = document.querySelectorAll(".list-item");
      // 复位
      for (let i = 0; i < listItems.length; i++) {
        listItems[i].dataset.type = 0;
      }
    },
    //删除
    deleteItem(index, id) {
      // // 复位
      this.restSlide();
      // 删除
      this.axios
        .post("user/dcook", {
          token: this.token(),
          user_id: id
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.$bus.$emit("toast", data.msg);
            this.list.splice(index, 1);
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang='scss' scoped>
#collection {
  padding-top: 100px;
  padding-bottom: 30px;
  position: relative;
  overflow: hidden;
  .page-title:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 60px;
    right: 10px;
    height: 1Px;
    border-bottom: 1Px solid #ccc;
    color: #ccc;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .list-item {
    position: relative;
    height: 2rem;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
  }
  .list-item[data-type="0"] {
    transform: translate3d(0, 0, 0);
  }
  .list-item[data-type="1"] {
    transform: translate3d(-2rem, 0, 0);
  }
  .list-item:after {
    content: " ";
    position: absolute;
    left: 0.2rem;
    bottom: 0;
    right: 15px;
    height: 1Px;
    border-bottom: 1Px solid #ccc;
    color: #ccc;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .list-box {
    padding: 0.3rem;
    background: #fff;
    display: flex;
    align-items: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    // justify-content: flex-end;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: 0;
    // border-bottom: 1Px solid #ccc;
  }
  .list-item .list-img {
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 65px;
    overflow: hidden;
  }
  .list-item .list-img img {
    width: 100%;
  }
  .list-item .list-content {
    padding: 0.3rem 0.3rem 0.2rem;
    position: relative;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
  }
  .list-item .title {
    display: block;
    color: #333;
    font-size: 30px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .list-item .tips {
    font-size: 24px;
    color: #999;
    line-height: 50px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .list-item .box3 {
    margin-top: 10px;
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
  .list-item .delete {
    width: 2rem;
    height: 2rem;
    background: #ee0000;
    color: #fff;
    text-align: center;
    line-height: 2rem;
    position: absolute;
    top: 0;
    right: -2rem;
    .iconfont {
      font-size: 50px;
    }
  }
}
</style>