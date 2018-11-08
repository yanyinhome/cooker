<template>
  <div id="comAlert" v-show="show">
    <div class="alert_inner">
      <p class="alert_title">{{ title }}</p>
      <p class="alert_info" v-if="info">{{ info }}</p>
      <div class="alert_inbox" v-html="infoHtml" v-if="infoHtml"></div>
      <div class="alert_btn">
        <button class="alert_buttons" v-for="(item, index) in button" :key="index" @click="buttonClick(item.callback)" v-if="button.length !== 1">{{ item.text }}</button>
        <button class="alert_button" @click="buttonClick(button[0].callback)" v-else>{{ button[0].text }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'comAlert',
  data () {
    return {
      show: false,
      title: '',
      info: '',
      infoHtml: '',
      button: []
    };
  },
  mounted () {
    this.$bus.$on('comAlert', config => {
      if (!config) return (this.show = false);
      this.show = true;
      this.title = config.title;
      this.info = config.info;
      this.infoHtml = config.infoHtml;
      this.button = config.button;
    });
  },
  methods: {
    buttonClick (cb) {
      this.$bus.$emit('comAlert', false);
      cb();
    }
  }
};
</script>

<style lang="scss">
  @import '../assets/scss/common_style';
  #comAlert {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 50;
    background: rgba(0, 0, 0, 0.6);
    .alert_inner {
      width: 590px;
      box-sizing: border-box;
      padding: 30px 40px;
      background: #ffffff;
      border-radius: 10px;
      position: absolute;
      top: 27%;
      left: 80px;
      text-align: center;
      .alert_title {
        color: #000;
        line-height: 90px;
        font-size: 30px;
        font-weight: 700;
      }
      .alert_info {
        font-size: 26px;
        color: #000;
      }
      .alert_inbox{
        font-size: 26px;
        color: #000;
      }
      .alert_btn {
        padding-top: 40px;
        display: flex;
        justify-content: space-between;
        .alert_buttons {
          width: 226px;
          height: 76px;
          line-height: 76px;
          color: #fff;
          font-size: 30px;
          border-radius: 38px;
          &:nth-child(1) {
            background: #FFB84B;
          }
          &:nth-child(2) {
            background: #999;
          }
        }
        .alert_button {
          width: 400px;
          margin: 0 auto;
          height: 78px;
          line-height: 78px;
          color: #000;
          font-size: 28px;
          border-radius: 39px;
          background: #FFB84B;
          // @include bgChangeStyle();
        }
      }
    }
  }
</style>
