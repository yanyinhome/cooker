<template>
  <div id='certification'>
    <com-head :opacity='0'>{{title}}</com-head>

    <div class="warn" v-if="!status">* 认证厨师需缴纳保证金100.00元，认证后厨师信息不可更改，请认真对待。</div>
    <div class="information"  v-if="!status">
        <div class="box1"  @click="portrait1">
            <span>个人照片</span>
            <input class="imginp"  ref="portrait1" name="imgLocal" id="imgLocal1" type='file' accept="image/*" @change="shangchuan1"/>
            <div class="tou"><div class="touxiang"><img :src="img1"></div><i class="iconfont icon-xiayi"></i></div>
        </div>
        <!-- <div class="item"><span>真实姓名</span><input type="text" v-model="name" readonly="readonly"></div> -->
        <div class="item"><span>真实姓名</span><input type="text" v-model="name" placeholder="请输入姓名"></div>
        <!-- <div class="item" v-else><span>真实姓名</span><input type="text" v-model="name" readonly="readonly"></div> -->
        <div class="item"><span>手机号</span><input type="text" v-model="phone" readonly="readonly"></div>
        <div class="xiaogong">
          <span>请选择</span>
          清真<input type="radio" id="1" value="1" v-model="checked4">
          汉餐<input type="radio" id="2" value="0" v-model="checked4">
        </div> 
        <div class="item" @click="loading1"  v-if="checked4=='0'"><span>菜系</span><input type="text" v-model="vegetable1" readonly="readonly" placeholder="请选择擅长菜系"><i class="iconfont icon-xiayi"></i></div>
        <div class="item" @click="cityalert = true"><span>区域选择</span><input type="text" v-model="address" readonly="readonly" placeholder="请选择服务范围"><i class="iconfont icon-xiayi"></i></div>
        <div class="item"><span>详细地址</span><input type="text" v-model="addressdetail" placeholder="请输入你的详细地址"></div>
        <div class="item"><span>特长简介</span><input type="text" v-model="cookerSign" placeholder="请输入你的特长简介"></div>
        <div class="xiaogong">
          <span>有无犯罪记录</span>
          有<input type="radio" id="1" value="1" v-model="checked1">无<input type="radio" id="0" value="0" v-model="checked1">
        </div> 
        <div class="xiaogong">
          <span>是否有吸毒</span>
          有<input type="radio" id="1" value="1" v-model="checked2">无<input type="radio" id="0" value="0" v-model="checked2">
        </div> 
        <div class="xiaogong">
          <span>有无精神病史</span>
          有<input type="radio" id="1" value="1" v-model="checked3">无<input type="radio" id="0" value="0" v-model="checked3">
        </div> 
        <div class="item"><span>紧急联系人姓名</span><input type="text" v-model="urgentname" placeholder="请输入紧急联系人姓名"></div>
        <div class="item"><span>紧急联系人电话</span><input type="text" v-model="urgenttel" placeholder="请输入紧急联系人电话"></div>
        <div class="item"><span>紧急联系人地址</span><input type="text" v-model="urgent_address" placeholder="请输入紧急联系人电话"></div>

        <div class="box1"  @click="portrait2">
            <span>厨师证</span>
            <input class="imginp"  ref="portrait2" name="imgLocal" id="imgLocal2" type='file' accept="image/*" @change="shangchuan2"/>
            <div class="tou"><div class="zheng"><img :src="img2"></div><i class="iconfont icon-xiayi"></i></div>
        </div>
        <div class="box1"  @click="portrait3">
            <span>健康证</span>
            <input class="imginp"  ref="portrait3" name="imgLocal" id="imgLocal3" type='file' accept="image/*" @change="shangchuan3"/>
            <div class="tou"><div class="zheng"><img :src="img3"></div><i class="iconfont icon-xiayi"></i></div>
        </div>
        <div class="box1"  @click="portrait4">
            <span>身份证正面</span>
            <input class="imginp"  ref="portrait4" name="imgLocal" id="imgLocal4" type='file' accept="image/*" @change="shangchuan4"/>
            <div class="tou"><div class="zheng"><img :src="img4"></div><i class="iconfont icon-xiayi"></i></div>
        </div>
        <div class="box1"  @click="portrait5">
            <span>身份证反面</span>
            <input class="imginp"  ref="portrait5" name="imgLocal" id="imgLocal5" type='file' accept="image/*" @change="shangchuan5"/>
            <div class="tou"><div class="zheng"><img :src="img5"></div><i class="iconfont icon-xiayi"></i></div>
        </div>
        <div class="box1"  @click="portrait6">
            <span>手持身份证照片</span>
            <input class="imginp"  ref="portrait6" name="imgLocal" id="imgLocal6" type='file' accept="image/*" @change="shangchuan6"/>
            <div class="tou"><div class="zheng"><img :src="img6"></div><i class="iconfont icon-xiayi"></i></div>
        </div>
        <!-- <div class="item"><span>认证保证金</span><div style="color:#EE0000">&yen;{{money}}&nbsp;</div></div> -->
        <div class="agreement"><input type="checkbox" :disabled="checked" v-model="active"> 我已阅读并同意《 <router-link :to="{name: 'protocol',query: {status: '5'}}" tag="span"> 厨师协议 </router-link> 》内容，并同意缴纳厨师认证保障金。</div>
        <com-button :click="renzheng1" :disabled="!active||prohibit" :class="{active: !active||prohibit}">{{btnmes}}</com-button>
    </div>

    <div id='cookerCheck' v-if="status">
      <div class="box1"><img src="../assets/image/shenhe.png"></div>
      <p>正在审核</p>
      <p>预计1-2天时间，请您稍作等待！</p>
    </div>

    <!-- 菜系弹窗 -->
    <div class="mask" v-show="mask1">
      <div class="box">
        <div class="title"><span>请选择菜系</span><span @click="getAllid">&emsp;确定&emsp;</span></div>
        <div class="content">
          <div v-for="(item,index) in item" :key="index"><div class="item" :class="{activeCai: item.select}" @click="chooce(index,item.d_id)">{{item.name}}</div></div>  
        </div>
      </div>
    </div>
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
import myaddress from "../assets/js/province.js"; //引入省市区数据
export default {
  name: "certification",
  data() {
    return {
      title: "厨师认证",
      mask1: false,
      cityalert: false,
      status: false,
      active: false,
      checked: false,
      prohibit: false,
      checked1: '0',
      checked2: '0',
      checked3: '0',
      checked4: '0',
      urgentname: '',
      urgenttel: '',
      activeCai1: '0',
      activeCai2: '-1',
      btnmes: "确定认证",
      img1: require("../assets/image/zanshi/touxiang.jpg"),
      img2: require("../assets/image/zanshi/zheng.jpg"),
      img3: require("../assets/image/zanshi/zheng.jpg"),
      img4: '',
      img5: '',
      img6: '',
      name: "",
      phone: "",
      cookerSign: '',
      vegetable1: '',//值
      vegetable2: [],//数组
      vegetableId: [],
      dish_id: '',
      money: "100.00",
      item:[],
      address: "无",
      address1: "",
      address2: "",
      urgent_address: '',
      addressdetail: '',
      selectarr: [],
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

  computed: {},

  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     vm.axios.post('login/verifylogin',{
  //       token: localStorage.getItem('token')
  //     })
  //       .then(({data}) => {
  //         console.log(data);
  //         // 如果返回值为201，则跳转到绑定
  //         if (data.code === '201') {
  //           vm.$bus.$emit("toast", "请先绑定手机号");
  //           vm.$router.push('register');            
  //         } else {
  //           next();
  //         }
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //     });
  // },

  created() {},

  mounted() {
    this.loading();
    this.$nextTick(() => {
      //vue里面全部加载好了再执行的函数  （类似于setTimeout）
      this.myAddressSlots[0].defaultIndex = 0;
      // 这里的值需要和 data里面 defaultIndex 的值不一样才能够初始化
      //因为我没有看过源码（我猜测是因为数据没有改变，不会触发更新）
    });
  },

  methods: {
    // 菜系
    loading1() {
      this.mask1 = true;
      this.axios
        .post("index/dish_list")
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            data.data.forEach(e => {
              e.select = false;
            });
            this.item = data.data;
          } else if (data.code === "201") {
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    chooce(index, id) {
      // this.mask1 = false;
       this.d_id = id;
       this.item[index].select = !this.item[index].select;
    },
    getAllid(){
      this.mask1=false;
      let idselected = this.item.filter((item, index, array) => {
        return item.select == true;
      });
      this.selectarr = idselected;
      let id = [];
      let vegetable = [];
      this.selectarr.forEach(element => {
        id.push(element.d_id);
        vegetable.push(element.name);

      });
      this.dish_id = id;
      console.log(this.dish_id);
      this.vegetable1 = vegetable.join();

    },
    loading() {
      this.axios
        .post("user/apiCook", {
          token: this.token()
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "201") {
            // 未申请
            (this.img1 = data.data.user_avat);
            (this.img2 = data.data.cool_card);
            (this.img3 = data.data.health_card);
            (this.name = data.data.user_truename);
            (this.phone = data.data.user_mobile);
            if (!data.data.user_truename) {
              this.$router.push('information');
              this.$bus.$emit("toast", "请先设置自己的真实姓名");
            }
          } else if (data.code === "202") {
            // 待审核
            this.status = true;
            this.title = "审核中";
            this.$bus.$emit("toast", data.msg);
          } else if (data.code === "200") {
            // 审核通过
            this.active = true;
            this.checked = true;
            this.prohibit = true;
            this.btnmes = "你已认证厨师";
            (this.img1 = data.data.user_avat);
            (this.img2 = data.data.cool_card);
            (this.img3 = data.data.health_card);
            (this.name = data.data.user_truename);
            (this.phone = data.data.user_mobile);
            this.cookerSign = data.data.user_sign;
            this.address = data.data.city_name + ',' + data.data.area;
            this.vegetable1 = data.data.dish_id.join();
            this.urgenttel = data.data.urgent_mobile;
            this.urgentname = data.data.urgent_name;
            this.checked1 = data.data.sign;
            this.checked2 = data.data.drug;
            this.checked3 = data.data.psychosis;
            this.checked4 = data.data.isiamic;
            this.img4 = data.data.user_front;
            this.img5 = data.data.user_side;
            this.img6 = data.data.user_hand_card;
            this.urgent_address = data.data.urgent_address;
            this.addressdetail= data.data.address; 
            this.$bus.$emit("toast", data.msg);
          } else if (data.code === "203") {
            // 审核不通过
            (this.img1 = data.data.user_avat);
            (this.img2 = data.data.cool_card);
            (this.img3 = data.data.health_card);
            (this.name = data.data.user_truename);
            (this.phone = data.data.user_mobile);
            this.urgenttel = data.data.urgent_mobile;
            this.urgentname = data.data.urgent_name;
            this.checked1 = data.data.sign;
            this.checked2 = data.data.drug;
            this.checked3 = data.data.psychosis;
            this.img4 = data.data.user_front;
            this.img5 = data.data.user_side;
            this.img6 = data.data.user_hand_card;
            this.urgent_address = data.data.urgent_address;
            this.addressdetail= data.data.address; 
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //认证
    renzheng1 () {
      let regTel = /^(1[3-9])\d{9}$/;
      if (!this.urgentname||!this.urgenttel||!this.cookerSign||!this.img1||!this.img2||!this.img3||!this.img4||!this.img5||!this.img6||!this.address1||!this.address2) {
        this.$bus.$emit("toast", "请完善信息");
      } else if (!regTel.test(this.urgenttel)) {
        this.$bus.$emit('toast', '手机号码不合法');
      } else{
        this.renzheng();
      }
    },
    renzheng() {
      console.log(this.checked1);
      this.active = true;
      this.checked = true;
      this.prohibit = true;
      this.axios
        .post("user/apiGs", {
          token: this.token(),
          user_avat: this.img1,
          cool_card: this.img2,
          health_card: this.img3,
          user_truename: this.name,
          user_mobile: this.phone,
          dish_id: this.dish_id.join() + ',',
          user_sign: this.cookerSign,
          city_name: this.address1,
          area: this.address2,
          urgent_mobile: this.urgenttel,
          urgent_name: this.urgentname,
          urgent_address: this.urgent_address,
          address: this.addressdetail,
          sin: this.checked1,
          drug: this.checked2,
          psychosis: this.checked3, 
          user_front: this.img4, 
          user_side: this.img5, 
          user_hand_card: this.img6, 
          isiamic: this.checked4, 
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.$bus.$emit("toast", "已发送审核");
            this.$router.push('usercenter');
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 头像单击事件
    portrait1() {
      this.$refs.portrait1.click(); // 获取ref为portrait的元素相当于获取id为portrait的元素
    },
    portrait2() {
      this.$refs.portrait2.click(); // 获取ref为portrait的元素相当于获取id为portrait的元素
    },
    portrait3() {
      this.$refs.portrait3.click(); // 获取ref为portrait的元素相当于获取id为portrait的元素
    },
    portrait4() {
      this.$refs.portrait4.click(); // 获取ref为portrait的元素相当于获取id为portrait的元素
    },
    portrait5() {
      this.$refs.portrait5.click(); // 获取ref为portrait的元素相当于获取id为portrait的元素
    },
    portrait6() {
      this.$refs.portrait6.click(); // 获取ref为portrait的元素相当于获取id为portrait的元素
    },
    // 上传图片
    shangchuan1(e) {
      console.log(this.$refs.portrait1.id);
      var self = this;
      let file = e.target.files[0]; // 上传照片
      /* eslint-disable no-undef */
      let formData = new FormData(); // 创建form对象
      formData.append("imgLocal", file); // 通过append向form对象添加数据
      // formData.append("token", this.token()); // 添加form表单中其他数据
      console.log(formData.get("imgLocal")); // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        emulateJSON: true,
        withCredentials: false,
        headers: { "Content-Type": "multipart/form-data" }
      };
      this.$axios
        .post("http://cschushi.cadhx.com/api/order/upImg", formData, config)
        .then(({ data }) => {
          console.log(data);
          this.img1 = `http://cschushi.cadhx.com/${data.imgurl}`;
          console.log(this.img1);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    shangchuan2(e) {
      console.log(this.$refs.portrait2.id);
      var self = this;
      let file = e.target.files[0]; // 上传照片
      /* eslint-disable no-undef */
      let formData = new FormData(); // 创建form对象
      formData.append("imgLocal", file); // 通过append向form对象添加数据
      // formData.append("token", this.token()); // 添加form表单中其他数据
      console.log(formData.get("imgLocal")); // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        emulateJSON: true,
        withCredentials: false,
        headers: { "Content-Type": "multipart/form-data" }
      };
      this.$axios
        .post("http://cschushi.cadhx.com/api/order/upImg", formData, config)
        .then(({ data }) => {
          console.log(data);
          this.img2 = `http://cschushi.cadhx.com/${data.imgurl}`;
          console.log(this.img2);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    shangchuan3(e) {
      var self = this;
      let file = e.target.files[0]; // 上传照片
      /* eslint-disable no-undef */
      let formData = new FormData(); // 创建form对象
      formData.append("imgLocal", file); // 通过append向form对象添加数据
      // formData.append("token", this.token()); // 添加form表单中其他数据
      console.log(formData.get("imgLocal")); // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        emulateJSON: true,
        withCredentials: false,
        headers: { "Content-Type": "multipart/form-data" }
      };
      this.$axios
        .post("http://cschushi.cadhx.com/api/order/upImg", formData, config)
        .then(({ data }) => {
          console.log(data);
          this.img3 = `http://cschushi.cadhx.com/${data.imgurl}`;
          console.log(this.img3);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    shangchuan4(e) {
      var self = this;
      let file = e.target.files[0]; // 上传照片
      /* eslint-disable no-undef */
      let formData = new FormData(); // 创建form对象
      formData.append("imgLocal", file); // 通过append向form对象添加数据
      // formData.append("token", this.token()); // 添加form表单中其他数据
      console.log(formData.get("imgLocal")); // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        emulateJSON: true,
        withCredentials: false,
        headers: { "Content-Type": "multipart/form-data" }
      };
      this.$axios
        .post("http://cschushi.cadhx.com/api/order/upImg", formData, config)
        .then(({ data }) => {
          console.log(data);
          this.img4 = `http://cschushi.cadhx.com/${data.imgurl}`;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    shangchuan5(e) {
      var self = this;
      let file = e.target.files[0]; // 上传照片
      /* eslint-disable no-undef */
      let formData = new FormData(); // 创建form对象
      formData.append("imgLocal", file); // 通过append向form对象添加数据
      // formData.append("token", this.token()); // 添加form表单中其他数据
      console.log(formData.get("imgLocal")); // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        emulateJSON: true,
        withCredentials: false,
        headers: { "Content-Type": "multipart/form-data" }
      };
      this.$axios
        .post("http://cschushi.cadhx.com/api/order/upImg", formData, config)
        .then(({ data }) => {
          console.log(data);
          this.img5 = `http://cschushi.cadhx.com/${data.imgurl}`;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    shangchuan6(e) {
      var self = this;
      let file = e.target.files[0]; // 上传照片
      /* eslint-disable no-undef */
      let formData = new FormData(); // 创建form对象
      formData.append("imgLocal", file); // 通过append向form对象添加数据
      // formData.append("token", this.token()); // 添加form表单中其他数据
      console.log(formData.get("imgLocal")); // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        emulateJSON: true,
        withCredentials: false,
        headers: { "Content-Type": "multipart/form-data" }
      };
      this.$axios
        .post("http://cschushi.cadhx.com/api/order/upImg", formData, config)
        .then(({ data }) => {
          console.log(data);
          this.img6 = `http://cschushi.cadhx.com/${data.imgurl}`;
        })
        .catch(function(error) {
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
        this.address1 = values[1];
        this.address2 = values[2];
        this.address = values[1] + values[2];
      }
    }
  }
};
</script>
<style lang='scss' scoped>
#certification {
  padding-top: 80px;
  padding-bottom: 30px;
  .warn {
    padding: 20px 40px 0 40px;
    font-size: 28px;
    color: rgba(238, 0, 0, 1);
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
        width: 200px;
        opacity: 0;
        filter: alpha(opacity=0);
      }
      span {
        line-height: 140px;
      }
      .tou {
        // width: 140px;
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
        .zheng {
          width: 140px;
          height: 90px;
          overflow: hidden;
          img {
            width: 100%;
          }
        }
      }
    }

    .item {
      display: flex;
      justify-content: space-between;
      line-height: 100px;
      border-bottom: 1Px solid #eee;
      span {
        width: 250px;
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
    .xiaogong {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 102px;
      border-bottom: 1Px solid rgba(238, 238, 238, 1);
      span {
        width: 300px;
        text-align: left;
      }
      input {
        width: 30px;
        height: 30px;
      }
    }
    .agreement {
      position: relative;
      line-height: 50px;
      padding: 20px 30px 0 50px;
      input {
        width: 30px;
        height: 30px;
        border-radius: 2px;
        border: 2px solid rgba(0, 133, 255, 1);
        position: absolute;
        left: 0px;
        top: 25px;
      }
      font-size: 28px;
      color: #0085ff;
    }
    .com_button {
      width: 690px;
      margin-top: 50px;
      color: #000;
    }
    .active {
      background-color: #ddd;
      box-shadow: none;
    }
  }
  #cookerCheck {
    text-align: center;
    .box1 {
      width: 500px;
      height: 500px;
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
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    .box {
      width: 630px;
      // height:418px;
      margin: 30vh auto;
      background: rgba(255, 255, 255, 1);
      border-radius: 20px;
      .title {
        text-align: center;
        line-height: 100px;
        font-size: 34px;
        display: flex;
        justify-content: space-around;
      }
      .content {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding-bottom: 30px;
        .item {
          width: 130px;
          height: 60px;
          // float: left;
          margin: 20px 33px;
          text-align: center;
          line-height: 60px;
          border-radius: 6px;
          border: 1Px solid rgba(153, 153, 153, 1);
        }
        .activeCai {
          background-color: #ffb84b;
          color: #fff;
        }
      }
    }
  }
  .mask {
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    .addressAlert {
      width: 630px;
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
        margin-right: 60px;
        padding: 15px 18px;
        border-radius: 3px;
        background-color: rgb(238, 236, 236);
      }
    }
  }
}
</style>