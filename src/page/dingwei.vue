<template>
  <div id='dingwei'>
    <com-head :opacity='0'>地址</com-head>
    <div class="address1">
      <div class="address">定位当前位置：</div>
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
      nam: '6'
    };
  },

  computed: {},

  created() {
    

    console.log(this.nam.sub());
  },

  mounted() {
    // this.$bus.$emit('abc');

    this.loading();

    navigator.geolocation.getCurrentPosition(function (position) {
  
      //得到html5定位结果
      var x = position.coords.longitude;
      var y = position.coords.latitude;
      console.log(`${x}:${y}`);
    })
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
    // 浏览器定定位
    handler({ BMap, map }) {
      let _this = this; // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            console.log("您的位置：" + r.point.lng + "," + r.point.lat);
            _this.locationTo(r.point.lng, r.point.lat);
          } else {
            console.log("failed" + this.getStatus());
          }
        },
        { enableHighAccuracy: true }
      );
    },
    // handler({ BMap, map }) {
    //   let _this = this;
    //   // var map = new BMap.Map("allmap");
    //   // var point = new BMap.Point(116.331398,39.897445);
    //   // map.centerAndZoom(point,12);
    //   var geolocation = new BMap.Geolocation();
    //   // 开启SDK辅助定位
    //   geolocation.enableSDKLocation();
    //   geolocation.getCurrentPosition(function(r){
    //     if(this.getStatus() == BMAP_STATUS_SUCCESS){
    //       var mk = new BMap.Marker(r.point);
    //       map.addOverlay(mk);
    //       map.panTo(r.point);
    //       console.log("您的位置：" + r.point.lng + "," + r.point.lat);
    //       _this.locationTo(r.point.lng, r.point.lat);
    //     }
    //     else {
    //       console.log("failed" + this.getStatus());
    //     }        
    //   });
    // },
    // 经纬度转换成具体位置，请求百度接口
    locationTo(lng, lat) {
      // 坐标转换
      // this.$axios.get("proxy/geoconv/v1/?coords="+lat+","+lng+"&from=5&to=3&ak=ZYLW9so4V2ypx7az6smCreNeVwZE8Ohk",
      // // this.$axios.get("proxy/geocoder/v2/?callback=renderReverse&location=113.64964385,34.75661006&output=json&pois=1&ak=ZYLW9so4V2ypx7az6smCreNeVwZE8Ohk",
      //    {parms:{
      //       location: lat+","+lng,
      //       // location: `${lat},${lng}`,
      //       // location: '113.64964385,34.75661006',
      //       ak: "ZYLW9so4V2ypx7az6smCreNeVwZE8Ohk",
      //       ret_coordtype: 'gcj02ll',
      //     }}
      //   )
      //   .then((data) => {
      //     console.log(data);
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });




      this.$axios.get("proxy/geocoder/v2/?callback=renderReverse&location="+lat+","+lng+"&output=json&pois=1&ak=ZYLW9so4V2ypx7az6smCreNeVwZE8Ohk",
      // this.$axios.get("proxy/geocoder/v2/?callback=renderReverse&location=113.64964385,34.75661006&output=json&pois=1&ak=ZYLW9so4V2ypx7az6smCreNeVwZE8Ohk",
         {params:{
            location: lat+","+lng,
            // location: `${lat},${lng}`,
            // location: '113.64964385,34.75661006',
            ak: "ZYLW9so4V2ypx7az6smCreNeVwZE8Ohk",
            ret_coordtype: 'gcj02ll',
            latest_admin: 1,
          }}
        )
        .then((data) => {
          console.log(data.data);
          alert(data.data)
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    addnew() {
      this.$router.push({ name: "addAddress", query: { status: '1' }});
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