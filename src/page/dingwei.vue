<template>
  <div id='dingwei'>
    <com-head :opacity='0'>地址</com-head>
    <div class="address1">
      <!-- <div class="address">定位当前位置：</div> -->
      <div class="map"></div> <baidu-map :center="center" :zoom="zoom" @ready="handler" :showAddressBar="true" :autoLocation="true"></baidu-map>
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
export default {
  name: "dingwei",
  data() {
    return {
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
    this.wxlocation()
  },

  mounted() {
    // this.$bus.$emit('abc');

    this.loading();

    // navigator.geolocation.getCurrentPosition(function (position) {

    //   //得到html5定位结果
    //   var x = position.coords.longitude;
    //   var y = position.coords.latitude;
    //   console.log(`${x}:${y}`);
    // })
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
      this.axios.post("Position/getLocation")
        .then(({ data }) => {
          console.log(data);
          if (data.code === "200") {
            const location = data.data;
            this.getShopWxConfig(location)
          } else if (data.code === "201") {
            this.$bus.$emit("toast", data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取微信配置
    getShopWxConfig(location) {
      let that = this;
      let params = {
        url: location.url
      };
      getShopWxConfigData(params)
        .then(res => {
          console.log(res);
          wx.config({
            debug: false,
            appId: location.appId,
            nonceStr: location.nonceStr,
            timestamp: location.timestamp,
            url: location.url,
            signature: location.signature,
            jsApiList: ["checkJsApi", "openLocation", "getLocation"]
          });
          wx.checkJsApi({
            jsApiList: ["getLocation"],
            success: function(res) {
              if (res.checkResult.getLocation == false) {
                alert(
                  "你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！"
                );
                return;
              }
            }
          });
          wx.ready(function() {
            //                wx.invoke('getLocation', 'openLocation', {}, function(res) {
            //                    //alert(res.err_msg + "唯一");
            //                });
            wx.getLocation({
              success: function(res) {
                //                                console.log(res)
                that.pointY = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                that.pointX = res.longitude; // 经度，浮点数，范围为180 ~ -180。

                that.point = new BMap.Point(that.pointX, that.pointY);
                that.marker = new BMap.Marker(that.point); // 创建点
                console.log(that.pointY);
                console.log(that.pointX);
                console.log(that.point);
                console.log(that.marker);
                that.getShopFjStudio();
              },
              cancel: function(res) {
                alert("用户拒绝授权获取地理位置");
                that.getShopFjStudio();
              }
            });
          });

          wx.error(function(res) {
            //                        console.log(res)
            that.getShopFjStudio();
          });
        })
        .catch(res => {
          console.log(res);
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
    //   // 坐标转换
    //   this.$axios.get("proxy/geoconv/v1/?coords="+lat+","+lng+"&from=5&to=3&ak=ZYLW9so4V2ypx7az6smCreNeVwZE8Ohk",
    //   // this.$axios.get("proxy/geocoder/v2/?callback=renderReverse&location=113.64964385,34.75661006&output=json&pois=1&ak=ZYLW9so4V2ypx7az6smCreNeVwZE8Ohk",
    //      {parms:{
    //         location: lat+","+lng,
    //         // location: `${lat},${lng}`,
    //         // location: '113.64964385,34.75661006',
    //         ak: "ZYLW9so4V2ypx7az6smCreNeVwZE8Ohk",
    //         ret_coordtype: 'gcj02ll',
    //       }}
    //     )
    //     .then((data) => {
    //       console.log(data);
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