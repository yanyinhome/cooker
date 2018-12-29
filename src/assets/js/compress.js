import Vue from 'vue';
Vue.prototype.imgPreview = function (file,) {
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
        reader.onloadend = function () {
            let result = this.result;
            self.yulan = result; //可预览图片
            let img = new Image();
            img.src = result;
            // console.log(result)
            //判断图片是否大于100K,是就直接上传，反之压缩图片
            if (this.result.length <= 100 * 1024) {
                self.newimg = this.result; //赋值 压缩后的base64图片
                // this.postImg();
                // console.log(self.newimg);
            } else {
                img.onload = function () {
                    let data = self.compress(img, Orientation);
                    self.headerImage1 = data;
                    self.newimg = data; //赋值 压缩后的base64图片
                    // this.postImg();
                    // console.log(self.newimg);
                    //self.$bus.$emit('toast','已上传');
                };
            }
        };
    }
},
    Vue.prototype.compress = function (img, Orientation) {
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
            //计算每块瓦片的宽和高
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
        // console.log("压缩前：" + initSize);
        // console.log("压缩后：" + ndata.length);
        // console.log(
        //     "压缩率：" + ~~((100 * (initSize - ndata.length)) / initSize) + "%"
        // );
        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
        //this.newdata1=ndata
        return ndata;
    }