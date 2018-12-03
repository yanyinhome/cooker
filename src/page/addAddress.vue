<template>
  <div id='addAddress'>
    <com-head  :opacity='0'>{{title}}</com-head>
    <div class="address">
       <div class="item"><span>联系人姓名</span><input type="text" v-model="name" placeholder="请输入姓名"></div>
       <div class="item"><span>联系方式</span><input type="text" v-model="phone" placeholder="请输入手机号码"></div>
       <div class="item" @click="cityalert = true"><span>区域选择</span><input type="text" v-model="address" readonly="readonly" placeholder="请选择"><i class="iconfont icon-xiayi"></i></div>
       <div class="beizhu">&emsp;详细地址<textarea style="resize:none" border maxlength=50  placeholder="请输入详细地址" v-model="content" cols="80" rows="5"></textarea></div>
    </div>
    <butFoot  :click="preserve">保存地址</butFoot>
    <!-- 省市县三级联动 -->
    <div class="mask" @click="cityalert=false" v-show="cityalert">
      <div class="addressAlert">
        <div class="box"><span>所在地区</span><button @click="cityalert = false">确定</button></div> 
        <mt-picker :slots="myAddressSlots" @change="onMyAddressChange"   :visibleItemCount=3></mt-picker>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import myaddress from "../assets/js/province.js"; //引入省市区数据
export default {
  name: "addAddress",
  data() {
    return {
      status: this.$route.query.status,
      id: this.$route.query.id,  //地址id
      cityalert: false,
      title: "",
      name: "",
      phone: "",
      address: "无",
      content: "",
      myAddressSlots: [
        {
          flex: 1,
          defaultIndex: 1,
          values: Object.keys(myaddress), //省份数组
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: "——",
          className: "slot2"
        },
        {
          flex: 1,
          values: ['市辖区'],
          className: "slot3",
          textAlign: "center"
        },
        {
          divider: true,
          content: "——",
          className: "slot4"
        },
        {
          flex: 1,
          values: ['东城区'],
          className: "slot5",
          textAlign: "center"
        }
      ],
      myAddressProvince: "省",
      myAddressCity: "市",
      myAddresscounty: "区/县",
    };
  },

   computed: {
    ...mapState(["readdress"])
  },

  created() {
    this.status === '1'?this.title = "添加新地址":this.title = "修改地址";
    console.log(this.readdress);
    this.name = this.readdress.addr_receiver;
    this.phone = this.readdress.addr_phone;
    this.address = this.readdress.pmc;
    this.content = this.readdress.addr_cont;
  },

  mounted() {
    this.$nextTick(() => {
      //vue里面全部加载好了再执行的函数  （类似于setTimeout）
      this.myAddressSlots[0].defaultIndex = 0;
      // 这里的值需要和 data里面 defaultIndex 的值不一样才能够初始化
      //因为我没有看过源码（我猜测是因为数据没有改变，不会触发更新）
    });
  },

  methods: {
    // 添加地址
    preserve() {
      let regTel = /^(1[3-9])\d{9}$/;
      if (!this.name) {
        this.$bus.$emit("toast", "姓名不能为空");
      } else if (!this.phone) {
        this.$bus.$emit('toast', '手机号不能为空');
      } else if (!regTel.test(this.phone)) {
        this.$bus.$emit('toast', '手机号码不合法');
      } else {
        if (this.status === '1') {
          //添加地址
          this.loading1();
        } else if (this.status === '2') {
          //修改地址
          this.loading2();
        }
      }
    },
    loading1 () {
      // const addr_cont = this.address + this.content;
      this.axios.post('user/addr',{
          token: this.token(),
          addr_receiver: this.name,
          addr_phone: this.phone,
          addr_cont: this.content,
          pmc: this.address
        })
          .then(({data}) => {
            console.log(data)
            if (data.code === '200') {
              this.$router.push('usercenter');              
              this.myaddress = data.data;
            } else if (data.code === '201') {
              this.$bus.$emit('toast', data.msg);
            }
          })
          .catch((error) => {
            console.log(error);
          });
    },
    loading2 () {
      this.axios.post('user/handle',{
          addr_id: this.id,
          type: 'edit',
          addr_receiver: this.name,
          addr_phone: this.phone,
          addr_cont: this.content,
          pmc: this.address
        })
          .then(({data}) => {
            console.log(data)
            if (data.code === '200') {
              this.$router.push('usercenter');              
              this.myaddress = data.data;
            } else if (data.code === '201') {
              this.$bus.$emit('toast', data.msg);
            }
          })
          .catch((error) => {
            console.log(error);
          });
    },
    onMyAddressChange(picker, values) {
      if (myaddress[values[0]]) {
        //这个判断类似于v-if的效果（可以不加，但是vue会报错，很不爽）
        picker.setSlotValues(1, Object.keys(myaddress[values[0]])); // Object.keys()会返回一个数组，当前省的数组
        picker.setSlotValues(2, myaddress[values[0]][values[1]]); // 区/县数据就是一个数组
        this.myAddressProvince = values[0];
        this.myAddressCity = values[1];
        this.myAddresscounty = values[2];
        this.address = values[0] + values[1] + values[2];
      }
    }
  }
};
</script>
<style lang='scss' scoped>
#addAddress {
  padding-top: 100px;
  padding-bottom: 30px;
  .address {
    background-color: #fff;
    .item {
      margin: 0 30px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1Px solid rgba(238, 238, 238, 1);
      line-height: 102px;
      span {
        // width: 150px;
        text-align: left;
      }
      input {
        width: 450px;
        text-align: right;
        font-size: 30px;
        margin-right: 0;
        color: #666;
      }
      input::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #ddd;
      }
      input:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #ddd;
      }

      input::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #ddd;
      }

      input:-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #ddd;
      }
    }
    .beizhu {
      line-height: 80px;
      textarea {
        width: 690px;
        margin: 0px 30px;
        padding: 10px;
        border: 1Px solid rgba(238, 238, 238, 1);
        box-sizing: border-box;
      }
    }
  }
  .mask {
    height: 100vh;
    width: 100vw;
    background-color: rgba(0,0,0,0.5);
    position: fixed;
    top: 0;
    left: 0;
    .addressAlert {
      width:630px;
      padding: 30px;
      border-radius: 10px;
      position: absolute;
      top: 30vh;
      left: 30px;
      background-color: #fff;
      .box {
        margin: 0 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      button {
        padding: 5px 8px;
        border-radius: 3px;
        background-color: rgb(238, 236, 236);
      }
    }
  }
}
</style>