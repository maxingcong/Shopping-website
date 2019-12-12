var MAKER = {
    index: 0,
    data: [9, 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 41],
    timeout: function() {
        if (MAKER.index < MAKER.data.length) {
            setTimeout(MAKER.maker, 100);
        } else {
            MAKER.showLinks();
        }
    }
};
define("design/detail", ["base", "tools"], function ($, T) {
    function CategoryDetail(){
        this.init();
    }
    CategoryDetail.prototype = {
        data: {
            productList: []
        },
        $cont: $("#wrapper"),
        init: function(){
            var _this = this;
            var local = location.href.substring(0, location.href.indexOf(".html"));
            _this.data.categoryId = local.substring(local.lastIndexOf("/")+1)||"";
            _this.events();
        },
        load: function(){
            var _this = this;
            T.GET({
                action: "in_product_new/web_design/query_design_product_list",
                params: {
                    design_category_id: _this.data.categoryId
                },
                success: function(data){debugger
                    _this.data.productList = data.productList||[];
                    /*if(_this.data.productList.length>3){
                     _this.data.productList = _this.data.productList.slice(0, 3);
                     }*/
                    document.title = data.title||data.categoryName||"";
                    _this.data.title = data.title||"";
                    _this.data.keywords = data.keywords||"";
                    _this.data.description = data.description||"";
                    _this.data.designCategoryId = data.categoryId||"";
                    _this.data.designCategoryName = data.categoryName||"";
                    var idx = 0, ret = false;
                    T.Each(_this.data.productList, function(i, product){
                        product.showType = Number(product.showType)||0; //展示方式，1：单个属性不显示
                        product.params = _this.getJson(product.priceInfo);
                        //product.generaState = 1;
                        product.agentScale = _this.getJson(product.agentScale); //加急服务费
                        product.serviceCommitments = _this.getJson(product.serviceCommitments); //对外服务承诺
                        product.preferntialInfo = _this.getJson(product.preferntialInfo); //优惠信息
                        //product.preferntialInfo = _this.getJson(product.preferntialInfo||'[{"preferentialSort":1,"preferentialTitle":"2ddddd12","preferentialDescription":"购买1-99件时享受优惠","preferentialLink":121212},{"preferentialSort":1,"preferentialTitle":212,"preferentialDescription":"购买1-99件时享受优惠","preferentialLink":121212}]'); //优惠信息
                        _this.setProduct(product);
                        if(_this.data.productId==product.designProductId){
                            idx = i;
                            ret = true;
                        }
                    });
                    if(_this.data.productList.length && _this.data.productList[0] && _this.data.productList[0].designProductId && !ret){
                        _this.data.productId = _this.data.productList[0].designProductId;
                    }
                    T.Template("product_list", _this.data, true);
                    //使3块一样高
                    var $items = $(".p-list .p-item .p-foot", _this.$cont)
                    var height = 0,
                        colNum = $items.length%2==0?2:3;
                    $items.each(function(i, el){
                        height = Math.max(height, $(el).height());
                        if((i+1)%colNum==0){
                            for(var m=colNum-1; m>=0; m--){
                                $items.eq(i-m).height(height);
                            }
                            height = 0;
                        }else if((i+1)==$items.length){
                            for(var m=$items.length%colNum-1; m>=0; m--){
                                $items.eq(i-m).height(height);
                            }
                            height = 0;
                        }
                    });
                    _this.render(idx);
                    T.PageLoaded();
                }
            });
        },
        render: function(idx){
            var _this = this;
            idx = idx||0;
            var product = _this.data.productList[idx];
            if(product && product.designProductId){
                _this.trigger("render", idx, product);
                //生成静态页
                T.GenerateStaticPage({
                    domain: T.REQUEST.w, //域名
                    dirname: "design/category", //目录名
                    pageid: _this.data.designCategoryId, //文件名（页面名）
                    title: _this.data.title||_this.data.designCategoryName,
                    keywords: {
                        "title": _this.data.title||_this.data.designCategoryName,
                        "keywords": _this.data.keywords||_this.data.designCategoryName,
                        "description": _this.data.description||_this.data.designCategoryName
                    },
                    callback: function(domain, path, pageid, keywords) { //生成成功回调函数
                        MAKER.index++;
                        MAKER.timeout();
                    }
                });
                /*_this.zoomer = new Zoomer({
                 uuid: "design",
                 trigger: $(".p-options .p-image", _this.$cont)[0],
                 pname: data.designProductName || "",
                 imguri: data.pImageFirst || ""
                 });*/
            }
        },
        /**
         * 解析产品数据
         */
        setProduct: function(product){
            var _this = this;
            product.priceDesc = (product.priceDesc||"").replace(/\d+元/g, function(num){
                return num.replace(/\d+/g, function(num){
                    return '<b class="p-num">' + num + '</b>';
                });
            });
            _this.setProductIcons(product);
            _this.setProductImages(product);
            _this.setParamsImages(product);
            _this.setProductDesc(product);
        },
        getJson: function (str) {
            var json = "";
            try{
                json = T.JSON.parse(str);
            }catch (e){}
            return json;
        },
        /**
         * 解析详情ICON
         */
        setProductIcons: function(product){debugger
            var pIcons = product.detailShowIcon||product.detailShowIcon||"";
            var parts = pIcons.split(",");
            var result = {}, count = 0;
            T.Each(parts, function(k, v) {
                if(v && (v!=null || v!=="")){
                    result[v] = true;
                    count++;
                }
            });
            result.count = count;
            product.pIcons = result;
        },
        /**
         * 解析详情图
         */
        setProductImages: function(product){
            var pImages = product.pImages||product.productImg||"";
            var parts = pImages.split(",");
            var result = [];
            T.Each(parts, function(k, v) {
                if(v && v.length>10){
                    result.push(v);
                }
            });
            product.pImageFirst = result[0]||product.productImg||(T.DOMAIN.DESIGN_RESOURCES+"product/203.jpg");
            product.pImages = result;
        },
        /**
         * 解析属性图
         */
        setParamsImages: function(product){
            var paramImages = product.paramImages||{};
            if(typeof(paramImages)!="object"){
                try{
                    paramImages = T.JSON.parse(paramImages);
                }catch (e){
                    paramImages = {};
                }
            }
            product.paramImages = paramImages;
        },
        /**
         * 解析产品详情页签
         */
        setProductDesc: function(product){
            var json = "",
                productDesc = product.productDesc||"";
            try{
                json = T.JSON.parse(productDesc);
            }catch (e){
                json = productDesc;
            }
            var result = [];
            T.Each(json, function(i, item){
                if(item.title && item.content){
                    result.push(item);
                }
            });
            product.productDesc = result;
        },
        /**
         * 切换详情图
         * @param $this
         * @param e
         */
        switcherImage: function(imgUri){
            var _this = this;
            if(imgUri){
                $(".p-options .p-image img", _this.$cont).attr("src", imgUri).data("imguri", imgUri);
                if(_this.zoomer){
                    _this.zoomer.load(imgUri);
                }
            }
        },
        events: function(){}
    };
    //让具备事件功能
    T.Mediator.installTo(CategoryDetail.prototype);
    return function(options){
        return new CategoryDetail(options);
    };
});