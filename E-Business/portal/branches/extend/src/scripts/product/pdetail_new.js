require(["modules/product", "widgets/zoomer"], function (Product, ImageZoom) {});
var _modules = ["base", "tools", "location", "modules/product", "widgets/zoomer"], _href = location.href, _productId = _href.slice(_href.indexOf("/product/"), _href.indexOf(".html")).replace("/product/", '');
if(",200068,200069,200070,200071,200042,".indexOf(","+_productId+",")>=0){
    _modules.push("product/" + _productId);
}
require(_modules, function ($, T, PCD, Product, ImageZoom, ProductDetailCustom) {
    var pdt = null, imageZoom = null, pdc = null;
    //T.REQUEST.pid = 200069;
    var ProductDetail = T.Module({
        action: CFG_DS.product.get_price,
        template: "product_detail",
        data: {},
        events: {
            "mouseenter .dupload li": "switcherImage", //切换详情图
            "click .submit.buynow, .submit.addcart": "addCart" //加入购物车/立即购买
        },
        init: function(options){
            var _this = this;
            pdt = new Product({
                callbacks: {
                    getPriceAfter: function(product){ //拉取价格完成调用
                        var res = getParams(pdt, product);
                        if(res){
                            T.setHash(res);
                        }
                        _this.autoHeight();
                    },
                    analysisAfter: function(product){ //解析属性完成调用
                        var res = getParams(pdt, product);
                        if(res){
                            T.setHash(res);
                        }
                        _this.autoHeight();
                    }
                }
            });
            function getParams(pdt, product){debugger
                if(product&&product.targetId){
                    product = pdt.data[product.targetId]||product;
                }
                var pattrs = [];
                if(product.productList&&product.productList){
                    T.Each(product.productList, function(i, item){
                        pattr = pdt.getValue(item);
                        pattrs.push(pattr);
                    });
                }else{
                    pattr = pdt.getValue(product);
                    pattrs.push(pattr);
                }
                return pattrs.join("^");
            }
            options = options||{};
            var atr = location.hash||options.pattr||"";
            if (atr.length > 0) {
                try{
                    atr = decodeURIComponent(atr.substring(1));
                }catch(e){
                    atr = atr.substring(1);
                }
            }
            var pattr = atr||_this.pattr||""; //默认选中的属性
            var local = location.href.substring(0, location.href.indexOf(".html"));
            var pageId = local.substring(local.lastIndexOf("/") + 1)||"";
            var productId = T.REQUEST.pid||pageId;
            if(pageId==200071&&(productId==200072||productId==200073)){ //工牌套装
                productId = pageId;
            }
            if (productId) {
                T.GET({
                    action: "in_product_new/query_product",
                    params: {
                        product_id: productId
                    },
                    success: function(data) {
                        data.productId = pdt.data.productId = data.productId||productId;
                        if(T.hasPMPID(data.categoryId)){
                            data._quantityCustomAlt = "单独设置每个人的名片数量";
                        }
                        if(data.productId==200021){
                            data._productMark = "一人印两盒仅需5.9元/盒，更划算！";
                            data._productAlt = "如果印刷多人名片，每人首盒均为8元，每加1盒3.8元";
                        }
                        if(data.productId==200022){
                            data._productMark = "首2盒26.8元，每加1盒加5.8元";
                            data._productAlt = "如果印刷多人名片，每人首2盒均为26.8元";
                        }
                        pdt.analysisTemplatePath(data); //解析空白模板
                        pdt.analysisImages(data); //解析产品图片
                        pdt.analysisDesc(data); //解析产品描述
                        data.preferntialInfo = pdt.getJson(data.preferntialInfo); //优惠信息
                        if(typeof(ProductDetailCustom)=="function"){ //定制产品页
                            pdc = new ProductDetailCustom(data, pattr);
                        }
                        var pattrs = String(pattr).split("^");
                        _this.render(data); //渲染页面
                        T.Template("product_desc", data);
                        if(data.mutexConfig){
                            pdt.mutexConfig[data.productId] = data.mutexConfig;
                        }
                        pdt.set(data, pattr); //设置产品
                        if(data.productList&&data.productList.length){
                            T.Each(data.productList, function(i, item){
                                if(item.mutexConfig){
                                    pdt.mutexConfig[item.productId] = item.mutexConfig||{};
                                }
                                pdt.set(item, pattrs[i]||String(pattr).replace(/\^/g, "")||""); //设置产品
                            });
                            pdt.setCounter(data);
                        }
                        pdt.getPrice(data); //获取价格
                        imageZoom = new ImageZoom({
                            uuid: T.UUID(),
                            trigger: $(".zoomimg", _this.$cont)[0],
                            pname: data.productName || "",
                            imguri: data.productImgDef || ""
                        });
                        pdt.imageZoom = imageZoom;
                        //绑定QQ客服
                        T.BindQQService();
                        //浏览滚动条滚动
                        _this.bindEvents();
                        //自适应高度
                        _this.autoHeight();
                        $(window).scrollTop(1);
                        $(window).scrollTop(0);
                    },
                    failure: function(data) {
                        T.alt("没有找到对应商品，该商品已下架或不存在，请选购其他商品", function(_o) {
                            _o.remove();
                            window.location = T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : '');
                        }, function(_o) {
                            _o.remove();
                            window.location = T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : '');
                        }, '返回首页');
                    }
                });
                _this.findFlagRelevanceList(productId);
                T.HotSell();
            }
        },
        //关联产品/标签信息
        findFlagRelevanceList: function(productId){
            var _this = this;
            if (productId) {
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
            }
        },
        /**
         * 加入购物车/立即购买
         * @param $this
         * @param e
         */
        addCart: function($this, e){
            var _this = this;
            if($(".doing", $this).length||$this.hasClass("dis"))return;
            if (!T._LOGED) {debugger
                T.LoginForm(0, function(){
                    _this.addCart($this, e);
                });
                return;
            }
            var product = pdt.get($this, e);
            if(!product){
                return;
            }
            var buynow = $this.hasClass("buynow")?1:0;
            var params = [];
            if(product._counter&&product.attr&&product.attr[product._quantityName]){
                params = _this.getParams(product, buynow);
            }else if(product.productList&&product.productList.length){ //套装
                T.Each(product.productList, function(i, item){
                    params = params.concat(_this.getParams(item, buynow));
                });
            }
			//检查禁卖属性
			var dataInfo = pdt.checkDisableSale(params);
			if(dataInfo.ret){
				T.alt(dataInfo.msg);
				return;
			}
            debugger;
            if(product._address){
                T.POST({
                    action: "in_order/cart_add",
                    params: {
                        data: params
                    },
                    success: function(data, params) {
                        if (buynow == 1) {debugger
                            window.location = T.DOMAIN.CART + "ordering.html?a=" + T.Params.encode(T.Base64.encode(T.Params.encode(data.date +","+ T.RMB(product._salePrice))));
                        } else {
                            /*T.suc({
                                text: "加入购物车成功。",
                                title: '加入购物车成功',
                                ok: '继续订购',
                                no: '去购物车结算'
                            }, function(_this) {
                                _this.remove();
                            }, function(_this) {
                                _this.remove();
                                window.location.href = T.DOMAIN.CART +"index.html"+ (T.INININ ? "?" + T.INININ : "");
                            }, function(_this) {
                                _this.remove();
                            });*/
                            _this.throwLine($('#pdetail .addcart'), $('#car_number'), product, 15, -80);
                            //更新回调移至抛物线函数
                            //T.Cart.reload();
                        }
                    }
                });
            }else{
                T.msg("请选择购买数量！");
            }
        },
        /**
         * 加入购物车的抛物线效果
         * @param start $dom 起点元素
         * @param end $dom 终点元素
         * @param speed {Number} 速度
         * @param offset {Number} 抛物线对称轴偏离终点的位移，eg: -40 表示对称轴在终点的左侧40像素的处
         * @param data 传给抛物线的商品数据
         */
        throwLine: function(start, end, data, speed, offset){
            var imgSrc = data.pImages[0] + '?imageMogr2/thumbnail/!32x32r/auto-orient/gravity/Center/crop/32x32'
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
         * 获取加入购物车的参数
         * @param {Object} product 产品对象
         * @param {Boolean} buynow 是否为立即购买
         */
        getParams: function(product, buynow){
            var params = [];
            var attr = {};
            T.Each(product.attr, function(k, v){
                attr[k] = v;
            });
            for(var i=0; i<product._counter; i++){
                var _quantity = "";
                if(product._custom[i]){
                    _quantity = product._custom[i]._droplist[product._quantityName]||product._custom[i].attr[product._quantityName]||"";
                }
                var quantity = _quantity||product._droplist[product._quantityName]||product.attr[product._quantityName];
                if(quantity){
                    attr[product._quantityName] = quantity;
                    params.push({
                        pnum: 1,
                        quantity: quantity,
                        cid: product.categoryId,
                        pid: product.productId,
                        target_id: product.targetId||product.productId,
                        pattr: pdt.getValue(product, attr),
                        pname: product.productName,
                        uploaded: product._uploaded||0,
                        buynow: buynow,
                        address: (product._address||T.cookie("_address")||CFG_DB.DEF_PCD).replace(/\^+$/g, "")
                    });
                }
            }
            console.log(params);
            return params;
        },
        /**
         * 切换详情图
         * @param $this
         * @param e
         */
        switcherImage: function($this, e){
            var _this = this;
            var src = $this.data("imguri") || "";
            var $images = $this.closest(".images", _this.$cont);
            var $img = $(".zoomimg img", $images);
            $img.attr("src", src);
            $img.data("imguri", src);
            imageZoom&&imageZoom.load(src);
        },
        autoHeight: function() {
            var h = $("#dpanel").height();
            $("#prolist li").css("padding", Math.floor((h - 111 * 3) / 6) + 'px 0');
            //$("#imglist").css("padding-top",(h-$("#proimg").outerHeight()-60)/2);
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var $productDesc = $("#template_product_desc_view");
            var $hotSell = $("#template-hot_sell-view");
            $(window).bind("scroll.pdesc resize.pdesc", function(e) {
                var _top = $(window).scrollTop();
                var _top2 = $productDesc.offset().top;
                var _top3 = $("#header_fixed").outerHeight();
                if ((_top + _top3 - 9) >= _top2) {
                    $productDesc.addClass("pfixed");
                    $(".ptabs", $productDesc).css({//这会导致$productDesc被拉高9px
                        top: _top3 - 1
                    });
                } else {
                    $productDesc.removeClass("pfixed");
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
            });
            $(".recommend").on("mouseenter", ".desctab li[data-idx]", function(e){
                var $this = $(this),
                    $recommend = $this.closest(".recommend"),
                    idx = $this.data("idx");
                $this.addClass("sel").siblings("li[data-idx]").removeClass("sel");
                $(".tabdetail[data-idx='"+idx+"']", $recommend).show().siblings(".tabdetail[data-idx]").hide();
            });
        }
    });
    T.Loader(function () {
        new ProductDetail();
    });
});