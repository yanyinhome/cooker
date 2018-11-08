<template>
   <div id='foot'>
      <ul class="foot_ul1" >
          <li v-for="(item,index) in list" :key="index" @click="str(item.route)">
          <router-link to="" class="foot_a1" @click.native="indexs(item.name)">
              <div class="navlist">
                <img :src="selected===item.name?item.icon1:item.icon" alt="" class="foot_img1">
              </div>
              <p class="foot_p1"  :class="[selected===item.name?'act':'']">{{item.name}}</p>
          </router-link>
        </li>
      </ul>
  </div>

</template>
<script>
export default {
  data() {
    return {
      selected: "首页",
      list: [
        {
          icon: require("../assets/image/nav2.png"),
          icon1: require("../assets/image/nav1.png"),
          name: "首页",
          route: "/index"
        },
        {
          icon: require("../assets/image/nav4.png"),
          icon1: require("../assets/image/nav3.png"),
          name: "厨师",
          route: "/cooker"
        },
        {
          icon: require("../assets/image/nav6.png"),
          icon1: require("../assets/image/nav5.png"),
          name: "订单",
          route: "/order"
        },
        {
          icon: require("../assets/image/nav8.png"),
          icon1: require("../assets/image/nav7.png"),
          name: "我的",
          route: "/userCenter"
        }
      ]
    };
  },
  mounted() {
    this.selected = sessionStorage.getItem("selected");
  },
  methods: {
    indexs(name) {
      this.selected = name;
      sessionStorage.setItem("selected", this.selected);
    },
    str(index) {
      this.$router.push({ path: index });
    }
  }
};
</script>
<style>
#foot {
  position: relative;
}
#foot > .foot_ul1 {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 98px;
  background: #212121;
  font-size: 20px;
  text-align: center;
}
#foot .foot_ul1 .navlist {
  margin: 0 auto;
  margin-top: 13px;
  width: 46px;
  height: 46px;
  
}
#foot .foot_ul1 .navlist img {
  width: 100%;
  height: 100%;
}
#foot > .foot_ul1 > li {
  width: 25%;
  display: inline-block;
  vertical-align: bottom;
  /* margin-top: 10px; */
}
#foot > .foot_ul1 > li > .foot_a1 {
  color: #AFAFAF;
}
#foot > .foot_ul1 > li > .foot_a1 > p > .foot_img1 {
  transform: scale(1.3);
}
.foot_p1 {
  margin-top: -4%;
}
.act {
  color: #FFB84B;
}
</style>

  

