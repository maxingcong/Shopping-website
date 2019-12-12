/**
 * @fileOverview 自定义面积类产品（海报/贴纸等）
 */
require(["base", "tools", "product/detail", "product/params_sqm", "product/price", "product/config/size", "product/config/sqm"], function ($, T, ProductDetail, ProductParamsSqm, ProductPrice, CFG_SIZE, CFG_PARAMS){
    var pdtDetail = ProductDetail(),
        pdtParams = ProductParamsSqm(),
        pdtPrice = ProductPrice(),
        pdtDetailSqm = {
            options: {},
            init: function(){
                var _this = this;
                pdtParams.on("click.attr", function(atr, val, e){
                    var opts = _this.options;
                    //设置属性图
                    pdtDetail.switcherImage(opts.paramImages[val]);
                    //拉取价格
                    _this.getPrice();
                }).on("rendered", function(opts){
                    $(pdtParams.customSize, _this.$cont).each(function(i, el){
                        pdtParams.validNumberInput($(el), opts.cfgSize);
                    });
                    //拉取价格
                    _this.getPrice();
                }).on("change.qty change.size", function(atr, val, forAtr, forVal){
                    var opts = _this.options;
                    //设置属性图
                    pdtDetail.switcherImage(opts.paramImages[forVal]);
                    //拉取价格
                    _this.getPrice();
                });
                pdtDetail.on("loaded", function(data, o){debugger
                    var options = $.extend(true, o, {
                        paramTips: { //属性提示
                            "拼接": "拼接是指超过喷绘材料的边界值时，由于无法喷绘，此时采取喷绘多张，用胶水粘在一起，以此来达到该目的。拼接不额外收费，不影响正常使用。"
                        },
                        paramType: 1, //参数类型
                        cfgSize: CFG_SIZE[data.productId], //尺寸配置
                        qtyIndex: -1,
                        isSupport: data.customizeInfo.isSupport,
                        customizeType: data.customizeInfo.customizeType,
                        qtyBase: Number(data.customizeInfo.baseValue) || 1,
                        qtyIncr: Number(data.customizeInfo.increment) || 1,
                        minQtyValue: Number(data.customizeInfo.baseValue) || 1,
                        maxQtyValue: 10000
                    }, CFG_PARAMS[data.productId]);
                    if(data.productId==200037 && options.baseInfoName.indexOf("打孔工艺")<0){ //特殊处理
                        options.baseInfoName += "_打孔工艺";
                        T.Each(options.params, function(key, param){
                            param["打孔工艺"] = {
                                "不打孔": 1,
                                "打孔": 0
                            };
                        });
                    }
                    _this.options = pdtDetail.options = options;
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
                if(pdtParams && pdtParams.hasOk()){
                    var address = pdtDetail.data.address.replace(/\^+$/g, ""),
                        productParam = pdtParams.getValue();
                    if(address && productParam && opts && opts.productId && opts.qtyValue){
                        var data = [{
                            pnum: 1,
                            quantity: opts.qtyValue + opts.qtyUnit,
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
            getPrice: function(){debugger
                var _this = this,
                    opts = _this.options;
                if(pdtParams && pdtParams.hasOk() && pdtPrice){
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
        pdtDetailSqm.init();
    });
});