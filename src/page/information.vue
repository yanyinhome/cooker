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
                  <img :src="yulan">
               </div>
               <i class="iconfont icon-xiayi"></i>
            </div>
        </div>
        <div class="item"><span>真实姓名</span><input type="text" v-model="message.user_name"></div>
        <!-- <div class="item" v-else><span>真实姓名</span><input type="text" v-model="message.user_name" placeholder="请输入姓名"></div>
        <div class="item" v-if="name"><span>真实姓名</span><input type="text" v-model="name" readonly="readonly"></div>
        <div class="item" v-else><span>真实姓名</span><input type="text" v-model="name" placeholder="请输入姓名"></div> -->
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
      message: {},
      picValue: '',
      newimg: '',
      yulan: '',
      name: ''
    };
  },

  computed: {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.axios
        .post("login/verifylogin", {
          token: localStorage.getItem("token")
        })
        .then(({ data }) => {
          console.log(data);
          // 如果返回值为201，则跳转到绑定
          if (data.code === "201") {
            vm.$bus.$emit("toast", "请先绑定手机号");
            vm.$router.push("register");
          } else {
            next();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    });
  },
  created() {},

  mounted() {
    this.loading();
    // console.log(this.newimg);
  },
  methods: {
    loading() {
      this.axios
        .post("user/index", {
          token: this.token()
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.message = data.data;
            this.yulan = data.data.user_avat;
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    keepdata() {
      this.axios
        .post("user/apiuser", {
          token: this.token(),
          user_truename: this.message.user_name,
          user_avat: this.newimg
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.$router.push("usercenter");
            this.$bus.$emit("toast", data.msg);
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          } else if (data.code === "204") {
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
   
    shangchuan(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      this.imgPreview1(this.picValue);
    },
    imgPreview1(file) {
      let self = this;
      let Orientation;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      //Exif.getData(file, function(){
      //   Orientation = Exif.getTag(this, 'Orientation');
      // });
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          self.yulan = result; //可预览图片
          let img = new Image();
          img.src = result;
          // console.log(result)
          //判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= 100 * 1024) {
            //self.$bus.$emit('toast','没压缩')
            self.newimg = this.result; //赋值
            // this.postImg();
            console.log(self.newimg);
          } else {
            img.onload = function() {
              let data = self.compress(img, Orientation);
              self.headerImage1 = data;
              self.newimg = data; //赋值
              // this.postImg();
              console.log(self.newimg);
              //self.$bus.$emit('toast','已上传');
            };
          }
        };
      }
    },
    postImg() {
      //这里写接口
    },
    compress(img, Orientation) {
      this.$bus.$emit("toast", "上传成功");
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = (width * height) / 4000000) > 1) {
        console.log("大于400万像素");
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = (width * height) / 1000000) > 1) {
        this.$bus.$emit("toast", "大于100万像素");
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~width;
        let nh = ~~height;
        tCanvas.width = nw;
        tCanvas.height = nh;
        tctx.drawImage(img, 0, 0, nw, nh);
        ctx.drawImage(tCanvas, 0, 0, nw, nh);
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6: //需要顺时针（向左）90度旋转
            this.rotateImg(img, "left", canvas);
            break;
          case 8: //需要逆时针（向右）90度旋转
            this.rotateImg(img, "right", canvas);
            break;
          case 3: //需要180度旋转
            this.rotateImg(img, "right", canvas); //转两次
            this.rotateImg(img, "right", canvas);
            break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.1);
      console.log("压缩前：" + initSize);
      console.log("压缩后：" + ndata.length);
      console.log(
        "压缩率：" + ~~((100 * (initSize - ndata.length)) / initSize) + "%"
      );
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      //this.newdata1=ndata
      return ndata;
    },



    // 头像单击事件
    portrait() {
      this.$refs.portrait.click(); // 获取ref为portrait的元素相当于获取id为portrait的元素
    },
    // 上传图片
    // shangchuan(e) {
    //   var self = this;
    //   let file = e.target.files[0]; // 上传照片
    //   /* eslint-disable no-undef */
    //   let formData = new FormData(); // 创建form对象
    //   formData.append("imgLocal", file); // 通过append向form对象添加数据
    //   // formData.append("token", this.token()); // 添加form表单中其他数据
    //   console.log(formData.get("imgLocal")); // FormData私有类对象，访问不到，可以通过get判断值是否传进去
    //   let config = {
    //     emulateJSON: true,
    //     withCredentials: true,
    //     headers: { "Content-Type": "multipart/form-data" }
    //   };
    //   this.$axios
    //     .post("http://cschushi.cadhx.com/api/order/upImg", formData, config)
    //     .then(({ data }) => {
    //       console.log(data);
    //       this.message.user_avat = `http://cschushi.cadhx.com/${data.imgurl}`;
    //       console.log(this.img);
    //     })
    //     .catch(function(error) {
    //       console.log(error);
    //     });
    // }
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
        // width: 120px;
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