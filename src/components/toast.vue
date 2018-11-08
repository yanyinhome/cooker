<template>
  <div class="toast" v-show="show">
    <div class="alert_box" :class="[showIn ? animateStyle[animateIndex].in : '', showOut ? animateStyle[animateIndex].out : '']">
      <p class="alert">{{ alert }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'toast',
  data () {
    return {
      // 是否顯示
      show: false,
      // 是否進入
      showIn: false,
      // 是否彈出
      showOut: false,
      // 是否在過程中
      showIng: false,
      // 動畫方式
      animateStyle: [
        {
          in: 'fadeInLeft',
          out: 'fadeOutRight'
        },
        {
          in: 'fadeInUp',
          out: 'fadeOutUp'
        }
      ],
      // 動畫方式
      animateIndex: 0,
      // 彈出內容
      alert: ''
    };
  },
  created () {
    this.$bus.$on('toast', this.toastFun);
  },
  methods: {
    toastFun (data) {
      if (this.showIng) return false;
      this.animateIndex = Math.floor(Math.random() * 2);
      this.showIng = true;
      this.alert = data;
      this.show = true;
      this.showIn = true;
      const timeLength = data.length / 10 * 2400;
      setTimeout(() => {
        this.showIn = false;
        this.showOut = true;
      }, timeLength);
      setTimeout(() => {
        this.showOut = false;
        this.show = false;
        this.showIng = false;
      }, timeLength + 800);
    }
  }
};
</script>

<style lang="scss">
  @import '../assets/scss/common_style.scss';
  .toast {
    position: fixed;
    top: 40vh;
    left: 10vw;
    width: 80vw;
    text-align: center;
    .alert_box {
      display: inline-block;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 30px;
      animation-duration: 0.8s;
    }
    .alert {
      display: inline-block;
      padding: 3vw 5vw;
      margin: 0 auto;
      color: #fff;
      font-size: 32px;
      line-height: 45px;
    }
  }
</style>
