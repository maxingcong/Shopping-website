define("product/detail_tpl", ["base", "tools", "location"], function($, T, PCD){
    "use strict";
    function ProductDetail(options){}
    ProductDetail.prototype = {
        data: {
            address: (T.cookie("_address")||CFG_DB.DEF_PCD).replace(/\^+$/g, "") //默认地址
        },
        $cont: $("#main"),
        status: ["", "", ""],
        /**
         * 初始化
         * @param productId
         */
        init: function(productId){
            var _this = this;
            _this.status = ["", "", ""];
            _this.loadProduct(productId);
            _this.loadFlagRelevance(productId);
            T.HotSell(null, function(data, params){
                _this.loaded(0, data, params);
            });
        },
        /**
         * 加载产品
         * @param productId
         */
        loadProduct: function(productId){
            var _this = this;
            T.GET({
                action: "in_product_new/query_product",
                params: {
                    product_id: productId
                },
                success: function(data, params) {debugger
                    _this.setProduct(data);
                    _this.trigger("set.product", data);
                    T.Template("product_detail", data, true);
                    T.Template("product_desc", data, true);
                    //配送地址
                    if($("#delivery_address").geoLocation){
                        $("#delivery_address").geoLocation({
                            level: 3,
                            callback: function (value, province, city, district) {
                                console.log('delivery_address==>callback: ' + value + '');
                                $("#delivery_region").geoLocation("setValue", value);
                            }
                        });
                    }
                    _this.data.product = data;
                    _this.loaded(1, data, params);
                },
                failure: function(data, params) {
                    _this.loaded(1, data, params);
                }
            });
        },
        /**
         * 加载关联产品/标签信息
         * @param productId
         */
        loadFlagRelevance: function(productId){
            var _this = this;
            T.GET({
                action: "in_product_new/product_relevance/find_flag_relevance_list",
                params: {
                    product_id: productId
                },
                success: function(data, params) {
                    var productList = [],
                        designList = [];
                    //关联产品
                    T.Each(data.infoList, function(index, v){
                        v.relevanceDesc = v.relevanceDesc || '';
                        v.productName = v.productName || '';
                        v.relevanceDescEllipsis = T.GetEllipsis(v.relevanceDesc, v.productName, 36);
                    });
                    T.Each(data.infoList, function(i, product){
                        if(product.relevanceType==1){
                            productList.push(product);
                        }else if(product.relevanceType==2){
                            designList.push(product);
                        }
                    });
                    _this.data.productList = productList;
                    _this.data.designList = designList;
                    data.flagInfo = data.flagInfo||{};
                    _this.data.flagList = data.flagInfo.flagName?String(data.flagInfo.flagName.replace(/^,|,$/, "").replace(/,+/, ",")).split(","):[]; //标签信息
                    var view = T.Template("recommend_list", _this.data, true);
                    if(_this.data.productList.length==0 && _this.data.designList.length==0){
                        $(view).addClass("hide");
                    }else{
                        $(view).removeClass("hide");
                    }
                    view = T.Template("label_list", _this.data, true);
                    if(_this.data.flagList.length==0){
                        $(view).addClass("hide");
                    }else{
                        $(view).removeClass("hide");
                    }
                    _this.loaded(2, data, params);
                },
                failure: function(data, params) {
                    _this.loaded(2, data, params);
                },
                error: function(data, params) {
                    _this.loaded(2, data, params);
                }
            }, function(data, params) {
                _this.loaded(2, data, params);
            }, function(data, params) {
                _this.loaded(2, data, params);
            });
        },
        /**
         * 解析产品数据
         */
        setProduct: function(product){
            var _this = this;
            product.address = _this.data.address;
            _this.setProductImages(product);
            _this.setParamsImages(product);
            _this.setTemplatePath(product);
            _this.setProductDesc(product);
            product.preferntialInfo = "";//_this.getJson(product.preferntialInfo); //优惠信息
            product.customizeInfo = _this.getJson(product.customizeInfo)||{}; //定制信息

            if(product.valuationMethod==3){ //按个数
                product.valuationName = "个数";
                product.valuationUnit = "个";
            }else if(product.valuationName==2){ //按体积
                product.valuationMethod = "预估体积";
                product.valuationUnit = "立方米";
            }else if(product.valuationName==1){ //按面积
                product.valuationMethod = "预估面积";
                product.valuationUnit = "平方米";
            }else{ //按重量 product.valuationMethod==0
                product.valuationName = "预估净重";
                product.valuationUnit = "千克";
            }
        },
        getJson: function (str) {
            var json = "";
            try{
                json = T.JSON.parse(str);
            }catch (e){}
            return json;
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
            product.pImageFirst = result[0]||product.productImg||"";
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
         * 解析空白模板
         */
        setTemplatePath: function(product){
            var templatePath = product.templatePath||"";
            var idx = templatePath.lastIndexOf(".");
            var suffix = ".rar";
            if(idx>0){
                suffix = templatePath.substring(idx)||suffix;
            }
            if(templatePath){
                product.templatePath = templatePath;
                product.templateName = product.productName + "-空白模板" + suffix;
            }
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
            if(typeof(json)==="string"){ //老产品
                var tabs = {
                    "ininin_detail": "产品详情",
                    "ininin_attr": "规格参数",
                    "ininin_display": "产品展示",
                    "ininin_tech": "工艺&尺寸",
                    "ininin_price": "价格&货期",
                    "ininin_note": "下单须知",
                    "ininin_transport": "物流介绍",
                    "ininin_service": "售后服务"
                };
                T.Each(tabs, function(k, v){
                    if(productDesc.indexOf(k)>=0){
                        result.push({
                            key: k,
                            value: v
                        });
                    }
                });
                product.productDescTabs = result;
            }else{
                T.Each(json, function(i, item){
                    if(item.title && item.content){
                        result.push(item);
                    }
                });
                product.productDesc = result;
            }
        },
        /**
         * 自适应高度
         */
        autoHeight: function() {
            var $dpanel = $("#dpanel");
            var height = Math.max($(".dupload").outerHeight(), $(".options").outerHeight());
            $(".pro_img", $dpanel).height(height);
            $(".pro_img li", $dpanel).css("padding", Math.floor((height - 111 * 3) / 6) + 'px 0');
        },
        /**
         * 加载完毕
         */
        loaded: function(i){
            var _this = this;
            _this.status[i] = 1;
            if(_this.status.join("").length==_this.status.length){
                _this.trigger("loaded", _this.data.product);
            }
        }
    };
    //让具备事件功能
    T.Mediator.installTo(ProductDetail.prototype);
    //生成静态页
    function GenerateStaticPage(settings){debugger
        settings = settings||{};
        var productIds = T.REQUEST.pid;
        productIds = productIds?productIds.split(","):[];
        var MAKER = {
            index: 0,
            data: [],
            timeout: function() {
                if (MAKER.index < MAKER.data.length) {
                    setTimeout(MAKER.maker, 100);
                } else {
                    T.ShowLinks();
                }
            },
            maker: function() {
                var productId = MAKER.data[MAKER.index];
                var pdtDetail = new ProductDetail();
                pdtDetail.on("set.product", function(data){debugger
                    if(settings.CFG_PARAMS){
                        $.extend(data, settings.CFG_PARAMS[data.productId]);
                    }
                    if(settings.getOptions){
                        $.extend(data, settings.getOptions(data));
                    }
                });
                pdtDetail.on("loaded", function(data){debugger
                    if(settings.ProductParams){
                        var pdtParams = settings.ProductParams();
                        pdtParams.init(data);
                    }
                    setTimeout(function(){
                        //自适应高度
                        pdtDetail.autoHeight();
                        T.PageLoaded();
                        //生成静态页
                        T.GenerateStaticPage({
                            domain: T.REQUEST.w, //域名
                            dirname: "product", //目录名
                            pageid: data.productId, //文件名（页面名）
                            title: data.title||data.productName,
                            keywords: {
                                "title": data.title||data.productName,
                                "keywords": data.keywords||data.productName,
                                "description": data.description||data.simpleDesc
                            },
                            callback: function(domain, path, pageid, keywords) { //生成成功回调函数
                                MAKER.index++;
                                MAKER.timeout();
                            }
                        });
                    }, 100);
                });
                pdtDetail.init(productId);
            }
        };
        MAKER.data = settings.data;
        console.log("MAKER.data=", T.JSON.stringify(MAKER.data));
        MAKER.maker();
    }
    return GenerateStaticPage;
});