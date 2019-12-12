/**
 * @fileOverview 自定义面积类产品（海报/贴纸等）
 */
require(["base", "tools", "product/detail", "product/config/install"], function ($, T, ProductDetail, CFG_PARAMS){
    var pdtDetail = ProductDetail(),
        pdtDetailInstall = {
            options: {},
            init: function(){
                var _this = this;
                pdtDetail.on("set.product", function(data){
                    data = $.extend(data, CFG_PARAMS[data.productId]);
                    _this.options = data;
                }).on("click.buy", function(buynow){
                    _this.addCart(buynow);
                });
                pdtDetail.init();
            },
            /**
             * 加入购物车
             * @param buynow 是否为立即购买
             */
            addCart: function(buynow){debugger
                var _this = this,
                    opts = _this.options,
                    address = pdtDetail.data.address.replace(/\^+$/g, "");
                buynow = 1;
                var data = [{
                    pnum: 1,
                    quantity: 1,
                    cid: opts.categoryId,
                    pid: opts.productId,
                    target_id: opts.targetId||opts.productId,
                    pattr: "安装费用:" + opts.priceDesc + "_服务范围:仅限深圳",
                    pname: opts.productName,
                    uploaded: "0",
                    buynow: buynow,
                    address: address
                }];
                pdtDetail.addCart(data, buynow, opts.pImageFirst);
            }
        };
    T.Loader(function () {
        pdtDetailInstall.init();
    });
});