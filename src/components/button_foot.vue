<template>
<div id="but_foot">
  <button class="but_foot" :class="{'but_foot_click': isClick}" @click="buttonClick">
    <slot>确认</slot>
  </button>
</div>
  
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
#but_foot {
  position: fixed;
  top: 100vh;
  left: 50%;
  width: 750px;
  margin-left: -375px;
  .but_foot {
    position: fixed;
    bottom: 0;
    left: 0;
    font-size: 30px;
    color: #000000;
    width: 750px;
    height: 80px;
    background: #FFB84B;
  }
}
</style>
