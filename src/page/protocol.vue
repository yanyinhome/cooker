<template>
  <div id='protocol'>
    <com-head :opacity='0'>{{name}}</com-head>
    <div class="protocol" v-html="content"></div>
  </div>
</template>

<script>
export default {
  name: 'protocol',
  data () {
    return {
      status: this.$route.query.status,
      content: '',
      name: ''
    };
  },

  computed: {},

  created () {
    if (this.status === '3') {
      //信息服务
      this.loading(this.status);
    } else if (this.status === '4') {
      //隐私政策
      this.loading(this.status);
    } else if (this.status === '5') {
      //用户服务协议
      this.loading(this.status);
    }
  },

  mounted () {},

  methods: {
    loading(type) {
      this.axios
        .post("login/article", {
          type: type
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.content = data.data;
            this.name = data.name;
          } else if (data.code === "201") {
            this.$bus.$emit('toast', data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  }
}

</script>
<style lang='scss' scoped>
#protocol {
  .protocol {
     width: 750px;
     padding: 100px 30px;
     box-sizing: border-box;
  }

}
</style>