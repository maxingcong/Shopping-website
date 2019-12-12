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
            var _this = this;debugger
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
                    setTimeout(function(){
                        _this.render(idx);
                        T.PageLoaded();
                    }, 100);
                }
            });
        },
        render: function(idx){
            var _this = this;
            idx = idx||0;
            var product = _this.data.productList[idx];
            if(product && product.designProductId){
                _this.data.productId = product.designProductId;
                _this.trigger("render", idx, product);
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
            /*product.priceDesc = (product.priceDesc||"").replace(/\d+\.d+元/g, function(num){
                return num.replace(/\d+/g, function(num){
                    return '<b class="p-num">' + num + '</b>';
                });
            });*/
			product.priceDesc = (product.priceDesc||'').replace(/(?:[1-9][0-9]*|0)(?:\.[0-9]+)?元/g, function(num){
                return num.replace(/[\d.]+/g, function(num){
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
        /**
         * 获取内容各区块的offset.top值
         */
        getContentOffset : function(){
            var _this = this;
            var tops = [];
            var $dom = $(".p-detail", _this.$cont);
            $(".p-content", $dom).each(function(i, el){
                var $el = $(el),
                    idx = $el.data("idx");
                tops[idx] = Math.floor($el.offset().top);
            });
            return tops;
        },
        /**
         * 页签被选中，当点击或者滚动时
         */
        focusTabs: function(){
            var _this = this;
            var $dom = $(".p-detail", _this.$cont),
                $tabs = $(".p-tab", $dom);
            if (!$tabs.length) return;
            var tops = _this.getContentOffset(),
                scrollY = $(window).scrollTop() + $("#header_fixed").outerHeight() + $tabs.closest(".p-tabs").outerHeight();
            if (!(scrollY >= tops[0])) {
                $tabs.eq(0).addClass("sel").siblings(".p-tab").removeClass("sel");
            }else if (scrollY >= tops[tops.length-1]) {
                $tabs.eq([tops.length-1]).addClass("sel").siblings(".p-tab").removeClass("sel");
            }else{
                T.Each(tops, function (i, v){
                    if(v <= scrollY && scrollY < tops[i+1]){
                        $tabs.eq([i]).addClass("sel").siblings(".p-tab").removeClass("sel");
                        return false;
                    }
                });
            }
        },
        events: function(){
            var _this = this;
            _this.$cont.off("click.p-list").on("click.p-list", ".p-list .p-item:not(.selected)", function(e){debugger
                var $this = $(this),
                    idx = $this.data("idx");
                $this.addClass("selected").siblings(".p-item").removeClass("selected");
                _this.render(idx);
            }).off("click.p-tabs").on("click.p-tabs", ".p-tabs .p-tab", function(e){ //详情页签切换
                var $this = $(this),
                    idx = $this.data("idx");
                var y = $("#header_fixed").outerHeight() + $this.closest(".p-tabs").outerHeight();
                var tops = _this.getContentOffset();
                $("html, body").stop(true, true).animate({
                    scrollTop: tops[idx] - y
                }, 400);
            });
            $(window).off("scroll.p-desc resize.p-desc").on("scroll.p-desc resize.p-desc", function(e) { //滚动详情页签联动
                var $pDesc = $(".p-detail", _this.$cont);
                if($pDesc.length){
                    var y0 = $(window).scrollTop(),
                        y1 = $pDesc.offset().top,
                        y2 = $("#header_fixed").outerHeight();
                    if((y0 + y2 - 9) >= y1) {
                        $pDesc.addClass("p-fixed");
                        $(".p-tabs", $pDesc).css({
                            top: y2 - 1
                        });
                    } else {
                        $pDesc.removeClass("p-fixed");
                    }
                    _this.focusTabs();
                }
            });
        }
    };
    //让具备事件功能
    T.Mediator.installTo(CategoryDetail.prototype);
    return function(options){
        return new CategoryDetail(options);
    };
});