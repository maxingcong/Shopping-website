/**
 * @fileOverview 自定义数量类产品
 */
require(["base", "tools", "product/detail", "product/params_qty", "product/price", "product/config/qty"], function ($, T, ProductDetail, ProductParamsQty, ProductPrice, CFG_PARAMS){
    var pdtDetail = ProductDetail(),
        pdtParams = ProductParamsQty(),
        pdtPrice = ProductPrice(),
        pdtDetailQty = {
            options: {},
            init: function(){
                var _this = this;
                pdtParams.on("click.attr", function(atr, val, e){
                    var opts = _this.options;
                    //设置属性图
                    pdtDetail.switcherImage(opts.paramImages[val]);
                    //拉取价格
                    _this.getPrice();
                }).on("rendered change.qty", function(opts){
                    //拉取价格
                    _this.getPrice();
                });
                pdtDetail.on("set.product", function(product){
                    if(CFG_PARAMS[product.productId]){
                        product.avgUnit = CFG_PARAMS[product.productId].avgUnit||"";
                    }
                }).on("loaded", function(data, o){
                    var options = pdtDetail.options = $.extend(o, {
                        isSupport: data.customizeInfo.isSupport,
                        customizeType: data.customizeInfo.customizeType,
                        hasQty: 1,
                        qtyBase: Number(data.customizeInfo.baseValue) || 1,
                        qtyIncr: Number(data.customizeInfo.increment) || 1,
                        minQtyValue: Number(data.customizeInfo.baseValue) || 1,
                        maxQtyValue: Number(data.customizeInfo.baseValue || 1) * 1000
                    }, CFG_PARAMS[data.productId]);
                    if(data.productId===200054){ //新折页特殊处理
                        options.paramImages = $.extend(options.paramImages, {
                            "对折（2折）": T.DOMAIN.RESOURCES + "products/200054/1.jpg",
                            "荷包折（3折）": T.DOMAIN.RESOURCES + "products/200054/2.jpg",
                            "风琴折（3折）": T.DOMAIN.RESOURCES + "products/200054/3.jpg",
                            "风琴折（4折）": T.DOMAIN.RESOURCES + "products/200054/4.jpg"
                        });
                        pdtParams.analy.on("render", function(opts){
                            options.paramImages = $.extend(_this.options.paramImages, {
                                "二折页": {
                                    "A5（210mm*140mm）": T.DOMAIN.RESOURCES + "products/200054/21.jpg",
                                    "A4（285mm*210mm）": T.DOMAIN.RESOURCES + "products/200054/22.jpg"
                                },
                                "三折页": {
                                    "210mm*95mm": T.DOMAIN.RESOURCES + "products/200054/31.jpg",
                                    "A5（210mm*140mm）": T.DOMAIN.RESOURCES + "products/200054/32.jpg"
                                },
                                "四折页": {
                                    "210mm*95mm": T.DOMAIN.RESOURCES + "products/200054/41.jpg",
                                    "A5（210mm*140mm）": T.DOMAIN.RESOURCES + "products/200054/42.jpg"
                                }
                            }[opts.attr["折页类型"]]);
                        });
                    }
                    _this.options = options;
                    pdtParams.init(options);
                }).on("get.price", function(atr, val, e){
                    //拉取价格
                    _this.getPrice();
                }).on("click.buy", function(buynow){
                    _this.addCart(buynow);
                });
                pdtPrice.on("success", function(data, paramsData){
                    _this.options.totalPrice = data.price;
                    T.setHash(paramsData[0].productParam);
                });
                pdtDetail.init();
            },
            /**
             * 加入购物车
             * @param buynow 是否为立即购买
             */
            addCart: function(buynow){
                var _this = this,
                    opts = _this.options;
                if(pdtParams){
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
                        pdtDetail.addCart(data, buynow, opts.pImageFirst, opts.totalPrice);
                    }else{
                        T.msg("请选择购买数量！");
                    }
                }
            },
            /**
             * 获得价格
             */
            getPrice: function(){
                var _this = this,
                    opts = _this.options;
                if(pdtParams && pdtPrice){
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