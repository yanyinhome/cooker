<template>
  <div id='dingwei'>
    <com-head :opacity='0'>地址</com-head>
    <div class="address1">
      <!-- <div class="address">定位当前位置：{{address}}</div> -->
      <!-- <div class="map"></div> <baidu-map :center="center" :zoom="zoom" @ready="handler" :showAddressBar="true" :autoLocation="true"></baidu-map> -->
      <div class="title">我的地址</div>
      <div class="myaddress" v-for="(item,index) in myaddress" :key="index" @click="selected(index,item.select)">
          <p>{{item.addr_receiver}}&emsp;{{item.addr_phone}} </p>
          <p>{{item.pmc + item.addr_cont}}</p>
          <i  class="select" :class="[item.select?  'icon-choosehandle': 'icon-yuancircle46','iconfont']"></i>
      </div>
    </div>
    <butFoot  :click="addnew">+添加新地址</butFoot>   
  </div>
  
</template>

<script>
// import BMap from "BMap";
export default {
  name: "dingwei",
  data() {
    return {
      address: "",
      center: { lng: 0, lat: 0 },
      zoom: 0,
      myaddress: [
        {
          name: "陈球球",
          phone: "13335649999",
          address: "郑州市金水区北三环瀚海北金B座",
          select: false
        },
        {
          name: "陈球球1",
          phone: "13335649999",
          address: "郑州市金水区北三环瀚海北金B座",
          select: false
        }
      ],
      nam: "6"
    };
  },

  computed: {},

  created() {
    console.log(this.nam.sub());
    this.wxlocation();
  },

  mounted() {
    this.loading();

    // let _this = this;
    // var geolocation = new BMap.Geolocation();
    // geolocation.getCurrentPosition(function(r) {
    //   if (this.getStatus() == BMAP_STATUS_SUCCESS) {
    //     const myGeo = new BMap.Geocoder();
    //     myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), data => {
    //       if (data.addressComponents) {
    //         const result = data.addressComponents;
    //         const location = {
    //           creditLongitude: r.point.lat, // 经度
    //           creditLatitude: r.point.lng, // 纬度
    //           creditProvince: result.province || "", // 省
    //           creditCity: result.city || "", // 市
    //           creditArea: result.district || "", // 区
    //           creditStreet: (result.street || "") + (result.streetNumber || "") // 街道
    //         };
    //         _this.location = location;
    //         console.log(_this.location);
    //         this.address = _this.location.creditStreet;
    //         _this.locationTo(
    //           _this.location.creditLatitude,
    //           _this.location.creditLongitude
    //         );
    //       }
    //     });
    //   }
    // });
  },

  methods: {
    // 地址列表
    loading() {
      this.axios
        .post("user/addrlist", {
          token: this.token()
        })
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            this.myaddress = data.data;
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    selected(index, select) {
      this.myaddress.forEach(item => {
        item.select = false;
      });
      this.myaddress[index].select = !select;
      this.$store.commit({
        type: "increment",
        dingwei: this.myaddress[index]
      });
    },
    wxlocation() {
      this.axios
        .post("Position/getLocation",{
          token: this.token()
        })
        .then(({ data }) => {
          console.log(data);
          const location = data.data;
          this.getShopWxConfig(location);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取微信配置
    getShopWxConfig (location) {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: location.appId, // 必填，公众号的唯一标识
        timestamp: location.timestamp, // 必填，生成签名的时间戳
        nonceStr: location.nonceStr, // 必填，生成签名的随机串
        signature: location.signature, // 必填，签名，见附录1
        jsApiList: [
          "getLocation" //获取地理位置接口
        ]
      });
      wx.getLocation({
        type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function(res) {
          console.log("成功");
          console.log(res);
          var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          var speed = res.speed; // 速度，以米/每秒计
          var accuracy = res.accuracy; // 位置精度
        },
        cancel: function(res) {
          console.log(res);
          // alert("用户拒绝授权获取地理位置");
        }
      });
      wx.error(function(res) {
        console.log(res);
        // alert("调用微信jsapi返回的状态:" + res.errMsg);
      });
    },

    // 浏览器定定位
    // handler({ BMap, map }) {
    //   let _this = this; // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
    //   var geolocation = new BMap.Geolocation();
    //   geolocation.getCurrentPosition(
    //     function(r) {
    //       if (this.getStatus() == BMAP_STATUS_SUCCESS) {
    //         var mk = new BMap.Marker(r.point);
    //         map.addOverlay(mk);
    //         map.panTo(r.point);
    //         console.log("您的位置：" + r.point.lng + "," + r.point.lat);
    //         _this.locationTo(r.point.lng, r.point.lat);
    //       } else {
    //         console.log("failed" + this.getStatus());
    //       }
    //     },
    //     { enableHighAccuracy: true }
    //   );
    // },

    // // 经纬度转换成具体位置，请求百度接口
    // locationTo(lng, lat) {
    //   //   // 坐标转换
    //   this.$axios
    //     .get(
    //       "proxy/geocoder/v2/?ak=eIxDStjzbtH0WtU50gqdXYCz&output=json&pois=1&location=' + lat + ",
    //       " + lng",
    //       //   // this.$axios.get("proxy/geocoder/v2/?callback=renderReverse&location="+lat+","+lng+"&output=json&pois=1&ak=ZYLW9so4V2ypx7az6smCreNeVwZE8Ohk",
    //       //   this.$axios.get("proxy/geoconv/v1/?coords="+lat+","+lng+"&from=1&to=5&ak=ZYLW9so4V2ypx7az6smCreNeVwZE8Ohk",
    //       //   // this.$axios.get("proxy/geocoder/v2/?callback=renderReverse&location=113.64964385,34.75661006&output=json&pois=1&ak=ZYLW9so4V2ypx7az6smCreNeVwZE8Ohk",
    //       {
    //         parms: {
    //           location: lng + "," + lat,
    //           // location: `${lat},${lng}`,
    //           // location: '113.64964385,34.75661006',
    //           ak: "ZYLW9so4V2ypx7az6smCreNeVwZE8Ohk"
    //         }
    //       }
    //     )
    //     .then(data => {
    //       console.log(data);
    //       this.address = data;
    //       alert(data);
    //     })
    //     .catch(function(error) {
    //       console.log(error);
    //     });
    // },
    addnew() {
      this.$router.push({ name: "addAddress", query: { status: "1" } });
    }
  }
};
</script>
<style lang='scss' scoped>
#dingwei {
  padding-top: 110px;
  padding-bottom: 80px;
  .address {
    font-size: 30px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    background-color: #fff;
    line-height: 82px;
    text-align: center;
  }
  .title {
    font-size: 28px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 100px;
    padding: 0 30px;
    box-sizing: border-box;
  }
  .myaddress {
    margin-bottom: 30px;
    line-height: 60px;
    padding: 20px 30px;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;
    p:nth-of-type(1) {
      width: 600px;
      font-size: 30px;
    }
    p:nth-of-type(2) {
      width: 600px;
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
      right: 30px;
    }
    .iconfont {
      font-size: 40px;
    }
    .icon-choosehandle {
      color: #ffb84b;
    }
  }
}
</style>