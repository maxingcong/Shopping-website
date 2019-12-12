/**
 * @fileOverview 文具类产品
 */
require(["base", "tools", "product/detail", "product/params_qty", "product/price"], function ($, T, ProductDetail, ProductParamsQty, ProductPrice) {
    var pdtDetail = ProductDetail(),
        pdtParams = ProductParamsQty(),
        pdtPrice = ProductPrice(),
        pdtDetailStationery = {
            options: {},
            init: function () {
                var _this = this;
                pdtParams.on("click.attr", function (atr, val, e) {
                    var opts = _this.options;
                    //设置属性图
                    pdtDetail.switcherImage(opts.paramImages[val]);
                    //拉取价格
                    _this.getPrice();
                }).on("rendered change.qty", function (opts) {
                    //拉取价格
                    _this.getPrice();
                });
                pdtDetail.on("loaded", function (data, o) {
                    debugger
                    _this.options = pdtDetail.options = $.extend(o, {
                        qtyIndex: -1,
                        customizeType: 1,
                        qtyBase: Number(data.customizeInfo.baseValue) || 1,
                        qtyIncr: Number(data.customizeInfo.increment) || 1,
                        minQtyValue: Number(data.customizeInfo.baseValue) || 1,
                        maxQtyValue: data.productId == 200546 ? 200 : 10000
                    });
                    pdtParams.init(_this.options);
                }).on("get.price", function (atr, val, e) {
                    //拉取价格
                    _this.getPrice();
                }).on("click.buy", function (buynow) {
                    _this.addCart(buynow);
                });
                pdtPrice.on("success", function (data, paramsData) {
                    _this.options.totalPrice = data.price;
                    T.setHash(paramsData[0].productParam);
                });
                pdtDetail.init();
            },
            /**
             * 加入购物车
             * @param buynow 是否为立即购买
             */
            addCart: function (buynow) {
                var _this = this,
                    opts = _this.options;
                if (pdtParams) {
                    var address = pdtDetail.data.address.replace(/\^+$/g, ""),
                        productParam = pdtParams.getValue();
                    if (address && productParam && opts && opts.productId && opts.qtyValue) {
                        var data = [{
                            pnum: 1,
                            quantity: opts.qtyValue + opts.qtyUnit,
                            cid: opts.categoryId,
                            pid: opts.productId,
                            target_id: opts.targetId || opts.productId,
                            pattr: productParam,
                            pname: opts.productName,
                            uploaded: "0",
                            buynow: buynow,
                            address: address
                        }];
                        pdtDetail.addCart(data, buynow, opts.pImageFirst, opts.totalPrice);
                    } else {
                        T.msg("请选择购买数量！");
                    }
                }
            },
            /**
             * 获得价格
             */
            getPrice: function () {
                debugger
                var _this = this,
                    opts = _this.options;
                if (pdtParams && pdtPrice) {
                    var address = pdtDetail.data.address.replace(/\^+$/g, ""),
                        productParam = pdtParams.getValue();
                    if (address && productParam && opts && opts.productId) {
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
        pdtDetailStationery.init();
    });
});