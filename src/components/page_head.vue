<template>
  <div id="pageHead" :class="{'page_head_opacity': opacity}">
    <p class="iconfont icon-fanhui" @click="clickBack"></p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'pageHead',
  data () {
    return {};
  },
  methods: {
    clickBack () {
      this.$router.go(-1);
    }
  },
  props: [
    'opacity'
  ]
};
</script>

<style lang="scss">
  #pageHead {
    position: fixed;
    top: 0;
    left: 0;
    left: 50%;
    width: 750px;
    margin-left: -375px;
    height: 80px;
    line-height: 80px;
    font-size: 34px;
    text-align: center;
    color: #000000;
    background: #fff;
    border-bottom: 1Px solid rgba(0,0,0,0.1);
    z-index: 99;
    .icon-fanhui {
      position: absolute;
      top: 0;
      left: 0;
      width: 120px;
      font-size: 40px;
      color: #000000;
    }
    &.page_head_opacity {
      background: none;
    }

  }
</style>
