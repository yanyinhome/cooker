<template>
  <div id='aa'>
    <!-- <div class="mask"  v-show="mask2"  @click="mask2=false"> -->
      <div class="box" :class="{boxclick:boxclick}"></div>
    <!-- </div> -->
      <button @click="boxclick1">点击</button>
    
  </div>
</template>

<script>
export default {
  name: "aa",
  data() {
    return {
      boxclick: false,
      mask2: false //时间
    };
  },

  computed: {},

  created() {},

  mounted() {},

  methods: {
    boxclick1 () {
      this.mask2 = true;
      this.boxclick = true;

      setTimeout(function(){

        console.log(22222);
      },2000);
    }
  }
};
</script>
<style lang='scss' scoped>
#aa {
  // .mask {
  //   position: fixed;
  //   bottom: 0;
  //   left: 0;
  //   width: 100vw;
  //   height: calc(100% - 210px);
  //   background: rgba(0, 0, 0, 0.5);
  //   z-index: 97;
    .box {
      width: 200px;
      height: 100px;
      margin: 0 auto;
      background-color: rgb(58, 25, 25);
      // overflow: hidden;
      transition: all 1s;
      &.boxclick {
        // transition: all 2s;
        height: 600px;
        width: 500px;
        animation: myfirst 5s;
      
      }
    }
  
  //}
}
</style>