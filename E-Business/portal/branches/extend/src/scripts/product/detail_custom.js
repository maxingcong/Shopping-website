/**
 * @fileOverview 折页自动化报价
 */
require(["base", "tools", "product/detail", "product/params_201", "product/price", "product/config/201"], function ($, T, ProductDetail, ProductParams, ProductPrice, ProductConfig){
    //T.DOMAIN.ACTION = "http://alpha.action.ininin.com/"
    var pdtDetail = ProductDetail(),
        pdtParams = ProductParams(),
        pdtPrice = ProductPrice(),
        pdtDetailQty = {
            options: {},
            init: function(){
                var _this = this;
                pdtParams.on("click.attr", function(atr, val, e){debugger
                    var opts = _this.options;
                    //设置属性图
                    pdtDetail.switcherImage(opts.paramImages[val]);
                    //拉取价格
                    _this.getPrice();
                }).on("rendered change.qty change.size", function(opts){
                    //拉取价格
                    _this.getPrice();
                });
                pdtDetail.on("set.product", function(product){
                    var CFG_PARAMS = ProductConfig(product);
                    if(CFG_PARAMS){
                        product.avgUnit = CFG_PARAMS.avgUnit||"";
                    }
                }).on("loaded", function(data, o){
                    var CFG_PARAMS = ProductConfig(data);
                    var options = pdtDetail.options = $.extend(o, {
                        paramType: 1, //参数类型
                        onlyOnceRender: true, //是否仅首次渲染全部属性,
                        cfgSize: {
                            name: "", //属性名
                            unit: "mm", //尺寸单位
                            joint: "*", //尺寸间的链接符
                            min: 1,
                            x: 10,
                            y: 10,
                            minLimit: 100,
                            maxLimit: 200, //展开尺寸最小值：200mm*100mm
                            width: 889, //最大上机纸宽度
                            height: 1194 //最大上机纸长度
                        }
                    }, CFG_PARAMS);
                    _this.options = options;
                    pdtParams.init(_this.options);
                }).on("get.price", function(atr, val, e){
                    //拉取价格
                    _this.getPrice();
                }).on("click.buy", function(buynow){
                    _this.addCart(buynow);
                });
                pdtPrice.on("success", function(data, paramsData){
                    location.hash = paramsData[0].productParam;
                });
                pdtDetail.init(201);
            },
            /**
             * 加入购物车
             * @param buynow 是否为立即购买
             */
            addCart: function(buynow){
                var _this = this,
                    opts = _this.options;
                if(pdtParams && pdtParams.hasOk()){
                    var address = pdtDetail.data.address.replace(/\^+$/g, ""),
                        productParam = pdtParams.getValue();
                    if(address && productParam && opts && opts.productId && opts.qtyValue){
                        var data = [{
                            pnum: 1,
                            quantity: opts.qtyValue,
                            cid: opts.categoryId,
                            pid: opts.productId,
                            target_id: opts.targetId||opts.productId,
                            pattr: productParam,
                            pname: opts.productName,
                            uploaded: "0",
                            buynow: buynow,
                            address: address
                        }];
                        pdtDetail.addCart(data, buynow, opts.pImageFirst);
                    }else{
                        T.msg("请选择购买数量！");
                    }
                }
            },
            /**
             * 获得价格
             */
            getPrice: function(){debugger
                var _this = this,
                    opts = _this.options;
                if(pdtParams && pdtParams.hasOk(true) && pdtPrice){
                    var address = pdtDetail.data.address.replace(/\^+$/g, ""),
                        productParam = pdtParams.getValue();
                    if(address && productParam && opts && opts.productId){
                        pdtPrice.getPrice([{
                            productId: opts.productId,
                            productParam: productParam,
                            productCount: 1,
                            address: address
                        }], opts);
                    }
                }
            }
        };
    T.Loader(function () {
        pdtDetailQty.init();
    });
});