<template>
  <div id='myaddress'>
    <com-head :opacity='0'>地址</com-head>
    <div class="address2">
      <div class="myaddress" v-for="(item,index) in myaddress" :key="index">
        <div class="xuanzhong"  @click="selected(index,item.select)">
          <i class="select" :class="[item.select? 'icon-choosehandle':'icon-yuancircle46'  ,'iconfont']"></i>
          <p>{{item.addr_receiver}}&emsp;{{item.addr_phone}} </p>
          <p>{{item.pmc + item.addr_cont}}</p>
        </div>
          <i class="iconfont icon-bianji1 rewrite" @click="rewrite(index,item.addr_id)"></i>
          <i class="iconfont icon-shanchu delete" @click="delete1(index,item.addr_id)"></i>
      </div>
    </div>
    <butFoot  :click="addnew">+添加新地址</butFoot>
  </div>
</template>

<script>
export default {
  name: "myaddress",
  data() {
    return {
      myaddress: [
        {
          name: "陈球球1",
          phone: "13335649999",
          address: "郑州市金水区北三环瀚海北金B座",
          select: false,
        },
        {
          name: "陈球球2",
          phone: "13335649999",
          address: "郑州市金水区北三环瀚海北金B座",
          select: false,
        },
        {
          name: "陈球球3",
          phone: "13335649999",
          address: "郑州市金水区北三环瀚海北金B座",
          select: false,
        },
        {
          name: "陈球球4",
          phone: "13335649999",
          address: "郑州市金水区北三环瀚海北金B座",
          select: false,
        }
      ]
    };
  },

  computed: {},

  created() {},

  mounted() {
    this.loading();
  },
  methods: {
    // 地址列表
    loading () {
      this.axios.post('user/addrlist',{
        token: this.token()
      })
        .then(({data}) => {
          console.log(data)
          if (data.code === '200') {
            this.myaddress = data.data;
          } else if (data.code === '201') {
            this.$bus.$emit('toast', data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    selected (index,select) {
      this.myaddress.forEach((item)=>{
        item.select = false;
      })
      this.myaddress[index].select = !select;
      this.$store.commit({
        type: "increment",
        myaddress: this.myaddress[index]
      });
    },
    rewrite(index,id) {
      this.$store.commit({
        type: "increment",
        readdress: this.myaddress[index]
      });
      this.$router.push({ name: "addAddress", query: { status: '2',id: id }});      
    },
    delete1(index) {
      this.$bus.$emit("comAlert", {
        title: "温馨提示",
        info: "你确定要删除",
        button: [
          {
            text: "确认",
            callback: () => {
              console.log(index);
              this.myaddress.splice(index,1);
            }
          },
          {
            text: "取消",
            callback: () => {}
          }
        ]
      });
    },
    addnew() {
      this.$router.push({ name: "addAddress", query: { status: '1' }});
    }
  }
};
</script>
<style lang='scss' scoped>
#myaddress {
  padding-top: 110px;
  padding-bottom: 80px;
  .address2 {
    .myaddress {
      line-height: 60px;
      padding: 20px 30px 20px 30px;
      box-sizing: border-box;
      background-color: #fff;
      position: relative;
      .xuanzhong {
        width: 450px;
        padding-left: 70px;
      }
      p:nth-of-type(1) {
        width: 450px;
        font-size: 30px;
        box-sizing: border-box;
        
      }
      p:nth-of-type(2) {
        width: 450px;
        font-size: 28px;
        color: rgba(102, 102, 102, 1);
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .select {
        position: absolute;
        top: 50px;
        left: 30px;
      }
      .iconfont {
        font-size: 40px;
      }
      .icon-choosehandle {
        color: #ffb84b;
      }
      .rewrite {
        position: absolute;
        top: 50px;
        right: 120px;
        font-size: 40px;
      }
      .delete {
        position: absolute;
        top: 50px;
        right: 30px;
        font-size: 40px;
      }
      p {
        width: 450px;
      }
    }
  }
}
</style>