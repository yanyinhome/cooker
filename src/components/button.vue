<template>
  <button class="com_button" :class="{'com_button_click': isClick}" @click="buttonClick">
    <slot>确认</slot>
  </button>
</template>

<script>
export default {
  name: "comButton",
  data() {
    return {
      isClick: false
    };
  },
  methods: {
    buttonClick() {
      this.isClick = true;
      setTimeout(() => {
        this.isClick = false;
      }, 100);
      this.click();
    }
  },
  props: ["click"]
};
</script>

<style lang="scss">
@import "../assets/scss/common_style";
.com_button {
  // @include buttonBgChangeStyle();
  transition: all 0.1s;
  // color: #ffffff;
  font-size: 30px;
  color: rgba(255, 255, 255, 1);
  width: 464px;
  height: 82px;
  background: rgba(255, 184, 75, 1);
  box-shadow: 4px 4px 6px 0px rgba(255, 255, 255, 0.6) inset,
    0px -4px 8px 0px rgba(0, 0, 0, 0.2) inset;
  border-radius: 10px;
  margin: 0 auto;
  margin-top: 40px;
  &.com_button_click {
    background: #f28c0e;
    color: #ffffff;
    // margin-top: 3px;
    // margin-bottom: -3px;
  }
}
</style>
