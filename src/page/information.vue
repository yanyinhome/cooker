<template>
  <div id='information'>
    <com-head :opacity='0'>个人资料</com-head>
    <div class="keepdata" @click="keepdata">保存</div>
    <div class="information">
        <div class="box1"  @click="portrait">
            <span>头像</span>
            <input class="imginp" ref="portrait" name="imgLocal" id="imgLocal" type='file' accept="image/*" @change="shangchuan"/>
            <div class="tou">
               <div class="touxiang">
                  <img :src="message.user_avat">
               </div>
               <i class="iconfont icon-xiayi"></i>
            </div>
        </div>
        <div class="item" v-if="message.user_name"><span>真实姓名</span><input type="text" v-model="message.user_name" readonly="readonly"></div>
        <div class="item" v-else><span>真实姓名</span><input type="text" v-model="message.user_name" placeholder="请输入姓名"></div>
        <div class="item"><span>手机号</span><input type="text" v-model="message.user_mobile" readonly="readonly"></div>
    </div>
    <div class="warn">* 您的真实姓名只有在厨师接单后，厨师可见且其他人不可见，请放心输入；手机号与账号同步，不可更改。</div>
  </div>
</template>

<script>
export default {
  name: "information",
  data() {
    return {
      message:{},
      
    };
  },

  computed: {},

  created() {},

  mounted() {  
    this.loading();
  },
  methods: {
    loading () {
      this.axios.post('user/index',{
        token: this.token()
      })
        .then(({data}) => {
          console.log(data)
          if (data.code === '200') {
            this.message = data.data;
          } else if (data.code === '201') {
            this.$bus.$emit('toast', data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    keepdata () {
      this.axios.post('user/apiuser',{
        token: this.token(),
        user_truename: this.message.user_name,
        user_avat: this.message.user_avat
      })
        .then(({data}) => {
          console.log(data)
          if (data.code === '200') {
            this.$router.push('usercenter');
            this.$bus.$emit('toast', data.msg);
          } else if (data.code === '201') {
            this.$bus.$emit('toast', data.msg);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 头像单击事件
    portrait() {
      this.$refs.portrait.click(); // 获取ref为portrait的元素相当于获取id为portrait的元素
    },
    // 上传图片
    shangchuan(e) {
      var self = this;
      let file = e.target.files[0]; // 上传照片
      /* eslint-disable no-undef */
      let formData = new FormData(); // 创建form对象
      formData.append("imgLocal", file); // 通过append向form对象添加数据
      // formData.append("token", this.token()); // 添加form表单中其他数据
      console.log(formData.get("imgLocal")); // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        emulateJSON: true,
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      };
      this.$axios.post("http://cschushi.cadhx.com/api/order/upImg",
          formData,
          config,
        )
        .then(({ data }) => {
          console.log(data);
          this.message.user_avat = `http://cschushi.cadhx.com/${data.imgurl}`;
          console.log(this.img);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>
<style lang='scss' scoped>
#information {
  padding-top: 100px;
  position: relative;
  .keepdata {
    width: 160px;
    height: 80px;
    text-align: center;
    color: #ee0000;
    line-height: 80px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 100;
  }
  .information {
    width: 100%;
    margin-top: 20px;
    padding: 0 30px;
    box-sizing: border-box;
    background-color: #fff;
    .box1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1Px solid #eee;
      input {
        width: 300px;
        opacity: 0;
        filter: alpha(opacity=0);
      }
      span {
        line-height: 140px;
      }
      .tou {
        width: 140px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .touxiang {
          width: 80px;
          height: 80px;
          border-radius: 40px;
          overflow: hidden;
          img {
            width: 100%;
          }
        }
        .iconfont {
          font-size: 50px;
          color: #999;
        }
      }
    }
    .item {
      display: flex;
      justify-content: space-between;
      line-height: 100px;
      span {
        width: 120px;
        text-align: left;
      }
      input {
        width: 450px;
        line-height: 90px;
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
    .item:nth-of-type(2) {
      border-bottom: 1Px solid #eee;
    }
  }
  .warn {
    padding: 0 30px;
    color: #ee0000;
    font-size: 24px;
  }
}
</style>