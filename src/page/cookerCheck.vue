<template>
  <div id='cookerCheck'>
    <com-head :opacity='0'>审核中</com-head>
    <div class="box1"><img src="../assets/image/shenhe.png"></div>
    <p>正在审核</p>
    <p>预计1-2天时间，请您稍作等待！</p>
  </div>
</template>

<script>
export default {
  name: 'cookerCheck',
  data () {
    return {

    };
  },

  computed: {},

  created () {},

  mounted () {},

  methods: {}
}

</script>
<style lang='scss' scoped>
#cookerCheck {
    text-align: center;
    .box1 {
    width:500px;
     height:500px;
     margin: 0 auto;
     margin-top: 200px;
     overflow: hidden;
     img {
        width: 100%;
     }
    }
    p:nth-of-type(1) {
        font-size: 34px;
        font-weight: 700;
        line-height: 80px;
    }
    p:nth-of-type(2) {
        font-size: 30px;
    }

}
</style>