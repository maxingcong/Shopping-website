/**
 * @fileOverview 产品详情
 */
define("product/detail", ["base", "tools", "location", "widgets/zoomer"], function($, T, PCD, Zoomer){
    "use strict";
    function ProductDetail(options){}
    ProductDetail.prototype = {
        data: {
            address: (T.cookie("_address")||CFG_DB.DEF_PCD).replace(/\^+$/g, "") //默认地址
        },
        options: {}, //产品信息配置项
        zoomer: null,
        $cont: $("#main"),
        /**
         * 初始化
         * @param options
         * @param [productId]
         * @param [pattr]
         */
        init: function(productId, pattr){
            var _this = this;
            //商品ID
            if(!productId){
                var local = location.href.substring(0, location.href.indexOf(".html")),
                    productId = local.substring(local.lastIndexOf("/") + 1)||"";
            }
            //默认属性
            if(!pattr){
                //默认属性
                var pattr = location.hash||"";
                if (pattr.length > 0) {
                    try{
                        pattr = decodeURIComponent(pattr.substring(1));
                    }catch(e){
                        pattr = pattr.substring(1);
                    }
                }
            }
            _this.loadProduct(productId, pattr);
            _this.loadFlagRelevance(productId);
            T.HotSell();
            _this.events();
        },
        /**
         * 加载产品
         * @param productId
         */
        loadProduct: function(productId, pattr){
            var _this = this;
            T.GET({
                action: "in_product_new/query_product",
                params: {
                    product_id: productId
                },
                success: function(data) {
                    data.pattr = pattr||"";
                    _this.setProduct(data);
                    _this.trigger("set.product", data);
                    T.Template("product_detail", data, true);
                    T.Template("product_desc", data, true);
                    //详情图
                    _this.zoomer = new Zoomer({
                        uuid: T.UUID(),
                        trigger: $(".zoomimg", _this.$cont)[0],
                        pname: data.productName || "",
                        imguri: data.productImgDef || ""
                    });
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
                    //属性提示
                    T.TIP({
                        container: "#dpanel",
                        trigger:'.attr .lnk',
                        content: function(trigger){
                            return $(trigger).data("text")||"";
                        },
                        width: "360px",
                        offsetX: 390,
                        offsetY: -80
                    });
                    //提示
                    T.TIP({
                        container: "#dpanel",
                        trigger: ".icon_help, .vals .val",
                        content: function(trigger) {
                            return $(trigger).data("text")||"";
                        },
                        "max-width": "240px",
                        width: 'auto',
                        offsetX: 0,
                        offsetY: 0
                    });
                    //货期提示
                    T.TIP({
                        container: "#dpanel",
                        trigger: ".delivery_date .lnk",
                        content: function(trigger) {
                            return "生产周期是指从投入生产到生产完成的时间，货物生产完成并发出后仍需1-3天的配送时间，您即可收到。";
                        },
                        "max-width": "285px",
                        width: "auto",
                        offsetX: 0,
                        offsetY: 0
                    });
                    //加载完毕事件
                    _this.trigger("loaded", data, {
                        productId: data.productId,
                        hasQty: data.hasQty,
                        amountAlt: data.amountAlt,
                        productName: data.productName,
                        categoryId: data.categoryId,
                        categoryName: data.categoryName,
                        targetId: data.targetId||data.productId,
                        pattr: data.pattr || "",
                        params: data.params, //属性
                        baseInfoName: data.baseInfoName,
                        paramIcons: data.paramIcons || {}, //属性图标
                        paramStyles: data.paramStyles || {}, //属性样式
                        paramImages: data.paramImages || {}, //属性图
                        paramTips: data.paramTips || {}, //属性提示
                        paramDesc: data.paramDesc || {}, //属性描述
                        pImageFirst: data.pImageFirst || "" //详情首图
                    });
                    var opts = _this.options;
                    //默认加载第一张属性图
                    T.Each(opts.namesOrder, function(i, atr){
                        var val = opts.attr[atr];
                        if(opts.paramImages[val]){
                            _this.switcherImage(opts.paramImages[val]);
                            return false;
                        }
                    });
                    //自定义数量
                    _this.$cont.counter({
                        cont: ".counter-num",
                        min: 1,
                        max: 1000,
                        step: 1,
                        change: function($input, val, flag){
                            var that = this;
                            if(opts.counter!=val){
                                val = Math.min(val, that.max);
                                val = Math.max(val, that.min);
                                $input.val(val);
                                opts.counter = val;
                                _this.trigger("change.num", opts)
                            }
                        }
                    });
                    //绑定QQ客服
                    T.BindQQService();
                    //自适应高度
                    _this.autoHeight();
                },
                failure: function(data) {
                    T.alt("没有找到对应商品，该商品已下架或不存在，请选购其他商品", function(_o) {
                        _o.remove();
                        location.replace(T.DOMAIN.WWW);
                    }, function(_o) {
                        _o.remove();
                        location.replace(T.DOMAIN.WWW);
                    }, "返回首页");
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
                },
                failure: function(data) {},
                error: function(data) {}
            }, function(data) {}, function(data) {});
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
            product.preferntialInfo = _this.getJson(product.preferntialInfo); //优惠信息
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
         * 加入购物车
         * @param paramsData 产品数据
         * @param buynow 是否为立即购买
         * @param pImage 商品图片
         */
        addCart: function(paramsData, buynow, pImage, totalPrice) {
            var _this = this;
            if (!T._LOGED) {
                T.LoginForm(0, function () {
                    _this.addCart(paramsData, buynow, pImage);
                });
            } else {
                T.POST({
                    action: "in_order/cart_add",
                    params: {
                        data: paramsData
                    },
                    success: function (data, params) {
                        if (buynow == 1) {
                            window.location = T.DOMAIN.CART + "ordering.html?a=" + T.Params.encode(T.Base64.encode(T.Params.encode(data.date +","+ T.RMB(totalPrice))));
                        } else {
                            _this.throwLine($(".addcart", _this.$cont), $("#car_number"), pImage, 15, -80);
                        }
                    }
                });
            }
        },
        /**
         * 加入购物车的抛物线效果
         * @param start $dom 起点元素
         * @param end $dom 终点元素
         * @param speed {Number} 速度
         * @param offset {Number} 抛物线对称轴偏离终点的位移，eg: -40 表示对称轴在终点的左侧40像素的处
         * @param pImage 传给抛物线的商品图片
         */
        throwLine: function(start, end, pImage, speed, offset){
            var imgSrc = pImage + '?imageMogr2/thumbnail/!32x32r/auto-orient/gravity/Center/crop/32x32'
            var scroll_h = $(window).scrollTop();
            var x1 = start.offset().left + start.outerWidth() /2;
            var y1 = -start.offset().top;
            var x2 = end.offset().left + end.outerWidth() /2;
            var y2 = -end.offset().top;
            var a = offset||-40; //对称轴相对end元素偏移px量  (对称轴横坐标=x2+a)
            var speed = speed||10; //单位时间内运动px值
            var b = (y1-y2) / ((x1-x2) * (x1-x2-2*a));
            var c = y1 - b*(x1-x2-a)*(x1-x2-a);
            //抛物线线方程：y = b(x-m)*(x-m) + c
            var x = x1, y;//(x, y)小球的实时坐标
            var ball = $('<span class="throwpro" style="display:inline-block;position:fixed;left:'+
                x1+'px;top:'+(-y1-scroll_h)+'px;width:32px;height:32px;border:2px solid #0487e2;z-index:999"><img src="'+imgSrc+'"></span>').appendTo($('body'));
            var timer = setInterval(function(){
                if (speed >6 && x2-x < speed) {//防止speed过大跨过购物车
                    speed = 2;
                }
                x += speed;
                y = b*(x-x2-a)*(x-x2-a)+c;
                ball.css({'left': x, 'top': -y-scroll_h});
                if (x >= x2) {
                    clearInterval(timer);
                    ball.animate({opacity: 0}, 600, function(){
                        ball.remove();
                    });
                    T.Cart.reload();
                }
            }, 25);
        },
        /**
         * 切换详情图
         * @param $this
         * @param e
         */
        switcherImage: function(imgUri){
            var _this = this;
            if(imgUri){
                $(".zoomimg img", _this.$cont).attr("src", imgUri).data("imguri", imgUri);
                if(_this.zoomer){
                    _this.zoomer.load(imgUri);
                }
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
         * 获取内容各区块的offset.top值
         */
        getContentOffset : function(){
            var _this = this;
            var anchors = [], tops=[];
            var $productDesc = $(".pdesc", _this.$cont);
            var li = $('.desctab li', $productDesc);
            if (li.data('target')) {//老的产品
                li.each(function(i, el){
                    var anchor = $(el).data("target");
                    anchors.push(anchor);
                    tops.push(Math.floor($('.pshow [alt$="'+anchor+'"]', $productDesc).offset().top));
                })
            }else{//新产品
                li.each(function(i, el){
                    var anchor = $(el).data("index");
                    anchors.push(anchor);
                    tops.push(Math.floor($('.p_contents [data-index="'+anchor+'"]', $productDesc).offset().top));
                })
            }
            return {anchors: anchors, tops: tops};
        },
        /**
         * 页签被选中，当点击或者滚动时
         */
        focusTabs: function(){
            var _this = this;
            var $productDesc = $(".pdesc", _this.$cont);
            var li = $('.desctab li', $productDesc);
            if (!li.length) {return;}
            var offset = _this.getContentOffset();
            var scroll_h = $(window).scrollTop() + $("#header_fixed").outerHeight() + li.closest('.desctab').outerHeight()+9;
            var tops = offset.tops;
            if (scroll_h < tops[0]) {
                li.eq(0).addClass("sel").siblings("li").removeClass("sel");
            }else if (scroll_h >= tops[tops.length-1]) {
                li.eq([tops.length-1]).addClass("sel").siblings("li").removeClass("sel");
            }else{
                for (var i = 0; i < tops.length -1; i++) {
                    if(tops[i] <= scroll_h && scroll_h < tops[i+1]){
                        li.eq([i]).addClass("sel").siblings("li").removeClass("sel");
                        break;
                    }
                }
            }
        },
        /**
         * 绑定事件
         */
        events: function(){
            var _this = this;
            _this.$cont.on("valueChange.location", ".mod_selectbox", function(e, data){ //改变配送区域
                data = data||{};
                _this.data.address = data.value||CFG_DB.DEF_PCD;
                /*_this.getPrice && _this.getPrice();*/
                _this.trigger("get.price");
            }).off("mouseenter.dupload").on("mouseenter.dupload", ".dupload li", function(e){
                _this.switcherImage($(this).data("imguri"));
            }).off("mouseenter.desctab").on("mouseenter.desctab", ".recommend .desctab li[data-idx]", function(e){
                var $this = $(this),
                    $recommend = $this.closest(".recommend"),
                    idx = $this.data("idx");
                $this.addClass("sel").siblings("li[data-idx]").removeClass("sel");
                $(".tabdetail[data-idx='"+idx+"']", $recommend).show().siblings(".tabdetail[data-idx]").hide();
            }).off("click.ptabs").on("click.ptabs", ".ptabs li", function(e){ //详情页签切换
                var key = $(this).data('index') || $(this).data("target");//新产品 or 老产品
                var index = $(this).index();
                var _top = $("#header_fixed").outerHeight() + $(this).closest(".ptabs").outerHeight();
                var offset = _this.getContentOffset();
                $("html, body").stop(true, true).animate({
                    scrollTop: offset.tops[index] - _top
                }, 400);
            }).off("click.buy").on("click.buy", ".submit.buynow, .submit.addcart", function(e){ //加入购物车/立即购买
                var $this = $(this);
                if($(".doing", $this).length || $this.hasClass("dis"))return;
                _this.trigger("click.buy", $this.hasClass("buynow")?"1":"0");
            });
            var $pDesc = $(".pdesc", _this.$cont);
            var $hotSell = $(".hotlist", _this.$cont);
            $(window).unbind("scroll.pdesc resize.pdesc").bind("scroll.pdesc resize.pdesc", function(e) {
                var _top = $(window).scrollTop();
                var _top2 = $pDesc.offset().top;
                var _top3 = $("#header_fixed").outerHeight();
                if ((_top + _top3 - 9) >= _top2) {
                    $pDesc.addClass("pfixed");
                    $(".ptabs", $pDesc).css({//这会导致$pDesc被拉高9px
                        top: _top3 - 1
                    });
                } else {
                    $pDesc.removeClass("pfixed");
                }
                var winTop = _top + $(window).height();
                var _top4 = $hotSell.offset().top + $hotSell.outerHeight();
                var _top5 = $("#footer").offset().top;
                if (_top5 <= winTop) {
                    $("ul", $hotSell).addClass("fixed").css({
                        bottom: winTop - _top5 + 30
                    });
                } else if (_top4 <= winTop) {
                    $("ul", $hotSell).addClass("fixed").css({
                        bottom: 20
                    });
                } else {
                    $("ul", $hotSell).removeClass("fixed");
                }
            }).unbind("scroll.ptabs").bind("scroll.ptabs", function (e) { //滚动详情页签联动
                _this.focusTabs();
            });
        }
    };
    //让具备事件功能
    T.Mediator.installTo(ProductDetail.prototype);
    return function(options){
        return new ProductDetail(options);
    };
});