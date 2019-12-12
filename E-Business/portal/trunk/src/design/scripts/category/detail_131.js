var MAKER = MAKER||{};
require(["base", "tools", "design/detail", "design/params", "package/price"], function ($, T, CategoryDetail, ProductParams, ProductPrice) {
    var pdtDetail = CategoryDetail(),
        pdtParams = ProductParams(),
        pdtPrice = ProductPrice(),
        Detail = {
            data: {
                generalState: 0 //是否加急
            },
            $cont: $("#wrapper"),
            init: function(categoryId){debugger
                var _this = this;
                if(categoryId){
                    pdtDetail.data.categoryId = categoryId;
                }
                pdtDetail.on("render", function(idx, product){
                    //渲染
                    _this.render(idx, product);
                });
                pdtParams.on("click.attr", function(atr, val, e){
                    var opts = _this.options;
                    //设置属性图
                    pdtDetail.switcherImage(opts.paramImages[val]);
                    //拉取价格
                    _this.getPrice();
                }).on("rendered change.qty", function(opts){
                    //拉取价格
                    _this.getPrice();
                }).on("change.counter", function(opts, counter){
                    //拉取价格
                    _this.getPrice();
                });
                pdtPrice.on("pricing", function(){
                    $(".submit", _this.$cont).append('<span class="doing"><span>计算中...</span></span>');
                }).on("success", function(data){
                    $(".submit .doing", _this.$cont).remove();
                    _this.data.totalPrice = data.price;
                });
                pdtDetail.load();
                _this.events();
            },
            render: function(idx, product){
                var _this = this;
                product = $.extend(true, product, pdtParams.cfg[product.designProductId]);
                _this.options = product;
                _this.data.categoryId = product.designCategoryId;
                _this.data.productId = product.designProductId;
                _this.data.generalState = 0;
                T.Template("product_options", product, true);
                T.Template("product_desc", product, true);
                pdtParams.init(product);
                pdtParams.setCounter(_this.$cont);
            },
            getPrice: function(){
                var _this = this,
                    opts = _this.options;
                if(pdtParams && pdtPrice && opts.designProductId){
                    pdtPrice.getPrice(_this.data.productId+","+opts.counter||1, opts);
                }
            },
            submit: function(){
                var _this = this,
                    opts = _this.options;
                if($(".submit .doing, .submit.dis", _this.$cont).length)return;
                if(opts.designCategoryId && opts.designProductId && _this.data.totalPrice>0){
                    $(".submit", _this.$cont).addClass("dis");
                    _this.timeObj = setTimeout(function(){
                        $(".submit", _this.$cont).removeClass("dis");
                    }, 30000);
                    T.POST({
                        action: "in_order/plan_create",
                        params: {
                            data: _this.data.productId+","+opts.counter||1,
                            total_price: T.RMB(_this.data.totalPrice)
                        },
                        success: function(data, params){
                            $(".submit", _this.$cont).removeClass("dis");
                            location.replace(T.DOMAIN.CART + "order.html?t="+data.type+"&o=" + data.orderCode);
                        },
                        failure: function(data, params){
                            $(".submit", _this.$cont).removeClass("dis");
                            T.alt(data.msg || T.TIP.DEF);
                        },
                        error: function(data, params){
                            $(".submit", _this.$cont).removeClass("dis");
                            T.alt(data.msg || T.TIP.DEF);
                        }
                    }, function(data, params){
                        $(".submit", _this.$cont).removeClass("dis");
                        if(data.result==3){
                            T.LoginForm(0, function(){
                                _this.submit();
                            });
                        }else{
                            T.alt(data.msg || T.TIP.DEF);
                        }
                    }, function(data, params){
                        $(".submit", _this.$cont).removeClass("dis");
                        T.alt(data.msg || T.TIP.DEF);
                    });
                }
            },
            events: function () {
                var _this = this;
                _this.$cont.off("click.submit").on("click.submit", ".p-options .submit", function(e){ //立即购买
                    if (!T._LOGED) {
                        T.LoginForm(0, function(){
                            _this.submit();
                        });
                    }else{
                        _this.submit();
                    }
                    return false;
                });
            }
        };
    MAKER.maker = function() {
        Detail.init(MAKER.data[MAKER.index]);
    };
    MAKER.showLinks = function() {
        T.ShowLinks();
    };
    T.Loader(function(){
        MAKER.data = [131];
        MAKER.maker();
    });
});