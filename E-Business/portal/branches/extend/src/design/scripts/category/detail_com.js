require(["base", "tools", "design/detail", "design/params", "design/price"], function ($, T, CategoryDetail, ProductParams, ProductPrice) {
    var pdtDetail = CategoryDetail(),
        pdtParams = ProductParams(),
        pdtPrice = ProductPrice(),
        Detail = {
            data: {
                generalState: 0 //是否加急
            },
            $cont: $("#wrapper"),
            init: function(){
                var _this = this;
                _this.data.productId = T.REQUEST.pid;
                _this.data.relationOrderCode = T.REQUEST.ro;
                _this.data.relationOrderProductId = T.REQUEST.rop;
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
                pdtDetail.load();
                _this.events();
            },
            render: function(idx, product){
                var _this = this;
                product = $.extend(true, product, pdtParams.cfg[product.designProductId]);
                _this.options = product;
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
                    pdtPrice.getPrice([{
                        productId: _this.data.productId,
                        productParam: pdtParams.getValue(),
                        productCount: opts.counter||1,
                        generalState: _this.data.generalState
                    }], opts);
                }
            },
            next: function(){
                var _this = this;
                var opts = _this.options;
                if(opts.designCategoryId && opts.designProductId){
                    var params = {
                        /*cid: opts.designCategoryId,
                         pid: opts.designProductId,*/
                        param: pdtParams.getValue()||"",
                        counter: opts.counter||1,
                        expedited: _this.data.generalState,
                        r: T.guid(opts.designProductId) //随即参数
                    };
                    if(_this.data.relationOrderCode && _this.data.relationOrderProductId){
                        params.ro = _this.data.relationOrderCode;
                        params.rop = _this.data.relationOrderProductId;
                    }
                    var paramsStr = T.ConvertToQueryString(params);
                    window.location = T.DOMAIN.DESIGN_PRODUCT + opts.designProductId + ".html" + (paramsStr?'?'+paramsStr:'');
                }
            },
            events: function () {
                var _this = this;
                _this.$cont.off("click.p-next").on("click.p-next", ".p-options .p-next", function(e){ //下一步
                    if (!T._LOGED) {
                        T.LoginForm(0, function(){
                            _this.next();
                        });
                    }else{
                        _this.next();
                    }
                    return false;
                }).off("click.p-expedited").on("click.p-expedited", ".p-options .p-expedited .val", function(e){ //是否加急
                    var $this = $(this),
                        val = $this.data("value");
                    _this.data.generalState = (val=="加急服务")?1:0;
                    $this.addClass("sel").siblings(".val").removeClass("sel");
                    _this.getPrice();
                });
            }
        };
    T.Loader(function(){
        Detail.init();
    });
});