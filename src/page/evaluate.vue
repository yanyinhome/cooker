<template>
  <div id='evaluate'>
    <com-head>评论厨师</com-head>
    <div class="evaluate">
      <div class="orderCenter">
        <div class="box1"><img :src="item.img"></div>
        <div class="box2">
          <p>{{item.name}}<i class="iconfont icon-xiayi" /></p>
          <p>{{item.content}}</p>
        </div>
      </div>
      <div class="beizhu">
        <textarea style="resize:none" border maxlength=100  placeholder="请输入您对厨师的评价" v-model="content" cols="80" ></textarea>
        <span class="number">{{number}}/100</span>
    </div>
    </div>
    <com-button :click="fabu" :disabled="active" :class="{active: active}">发布评论</com-button>
    
  </div>
</template>

<script>
export default {
  name: "evaluate",
  data() {
    return {
      id: this.$route.query.id,
      uid: this.$route.query.uid,
      active: false,
      content: this.$route.query.sign,
      number: '0',
      item: {
        number: "8888889",
        img: require("../assets/image/zanshi/touxiang.jpg"),
        name: "张三",
        content: "擅长川菜、豫菜、客家菜，辛辣菜辛辣菜辛辣菜"
      }
    };
  },
   watch: {
    content: function (a,b) {
      this.number=a.length;
      if (this.number>99) {
        this.$bus.$emit("toast", "字数不能超过100")
      }
    }
  },
  computed: {},

  created() {},

  mounted() {
    this.loading();
  },

  methods: {
    loading () {
      this.axios.post('order/getInfo',{
        c_id: this.uid
      })
        .then(({data}) => {
          console.log(data);
          if (data.code === '200') {
            this.item.name = data.data.user_truename;
            this.item.img = data.data.user_avat;
            this.item.content = data.data.user_sign;
          } else if (data.code === '201') {
            this.$bus.$emit('toast', data.msg);            
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fabu () {
      this.axios.post('order/apiAss',{
        order_id: this.id,
        order_ment: this.content
      })
        .then(({data}) => {
          console.log(data);
          if (data.code === '200') {
            this.active = true;
            this.$bus.$emit('toast', data.msg);
          } else if (data.code === '201') {
            this.$bus.$emit('toast', data.msg);            
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  }
};
</script>
<style lang='scss' scoped>
#evaluate {
  padding-top: 100px;
  padding-bottom: 100px;
  .evaluate {
    width: 690px;
    margin: 10px auto;
    padding: 20px 0;
    background: rgba(255, 255, 255, 1);
    border-radius: 20px;
    .orderCenter {
      margin: 20px 30px;
      display: flex;
      justify-content: flex-start;
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
        margin-left: 30px;
        margin-right: 30px;
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
    }
    .beizhu {
      position: relative;
      textarea {
      margin-left: 30px;
      width: 630px;
      height: 400px;
      padding: 10px;
      border: 1Px solid rgba(238,238,238,1);
      box-sizing: border-box;
    }
    .number {
      color: #ddd;
      position: absolute;
      bottom: 20px;
      right: 40px;
    }
    }
  }
  .com_button {
    width: 690px;
    margin-top: 300px;
    margin-left: 30px;
    color: #000;
  }
  .active {
    background-color: #ddd;
    box-shadow:  none;
  }
}
</style>