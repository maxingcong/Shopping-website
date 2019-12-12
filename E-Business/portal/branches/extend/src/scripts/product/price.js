define("product/price", ["base", "tools"], function($, T){
    "use strict";
    function ProductPrice(options){}
    ProductPrice.prototype = {
        data: {},
        cacheData: "", //上次获取价格的参数字符串
        $cont: $("#form_details"),
        load: function(paramsData, opts){
            var _this = this;
            $(".submit", _this.$cont).removeClass("dis");
            //计算中逻辑
            _this.render({
                giftScore: T.DOING,
                deliveryDay: T.DOING,
                deliveryDate: "",
                valuationValue: T.DOING,
                counter: opts.counter,
                price: T.DOING,
                avgValue: T.DOING,
                avgUnit: opts.avgUnit||"",
                deliveryAlt: ""
            });
            $(".submit .doing", _this.$cont).remove();
            $(".submit", _this.$cont).append('<span class="doing"><span>计算中...</span></span>');
            //获取价格
            _this.pricing = true;
            T.POST({
                action: CFG_DS.product.get_price,
                params: {
                    type: "0",
                    data: paramsData
                },
                success: function(data, params) {
                    $(".submit .doing", _this.$cont).remove();
                    _this.pricing = false;
                    if(T.Typeof(data.data)=="Array" && T.JSON.stringify(params.data)==_this.cacheData){
                        var price = 0,
                            unitPrice = 0,
                            deliveryDay = 0,
                            valuationValue = 0,
                            hasSupply = 0;
                        T.Each(data.data, function(i, item){
                            unitPrice = item.price||0;
                            price = T.Number.add(price, item.price||0);
                            deliveryDay = Math.max(deliveryDay, item.deliveryDay||0);
                            valuationValue = T.Number.add(valuationValue, item.valuationValue||0);
                            hasSupply = item.hasSupply||0;
                        });
                        price = price >= 0 ? price : 0;
                        deliveryDay = deliveryDay > 0 ? deliveryDay : 7;
                        _this.data.price = price;
                        _this.data.unitPrice = unitPrice;
                        _this.data.giftScore = Math.ceil(price);
                        _this.data.deliveryDay = deliveryDay;
                        _this.data.deliveryDate = T.DeliveryDate("", deliveryDay, 1);
                        _this.data.valuationValue = opts.valuationMethod==3 ? parseInt(valuationValue, 10) : T.RMB(valuationValue);
                        _this.data.hasSupply = hasSupply;
                        _this.data.counter = opts.counter||1;
                        _this.data.avgUnit = opts.avgUnit||"";
                        _this.data.amountAlt = opts.amountAlt||"";
                        _this.data.deliveryAlt = hasSupply>0?"该地区暂不支持配送":"";
                        var num = Math.pow(10, 4);
                        _this.data.avgValue = Math.round(price*num/opts.counter/parseInt(opts.qtyValue, 10))/num;
                        _this.render(_this.data);
                        if(hasSupply>0 || data.data.length<1){ //不支持售卖或不支持配送
                            $(".submit", _this.$cont).addClass("dis");
                        }else{
                            $(".submit", _this.$cont).removeClass("dis");
                        }
                        _this.trigger("success", _this.data, paramsData);
                    }
                }
            });
        },
        /**
         * 获得价格
         */
        getPrice: function(data, opts){
            var _this = this;
            _this.$cont = $("#form_details");
            var cacheData = T.JSON.stringify(data);
            if(_this.cacheData!==cacheData){
                _this.cacheData = cacheData;
                if(data.length){
                    _this.load(data, opts);
                }else{
                    _this.cacheData = "";
                    $(".submit", _this.$cont).addClass("dis");
                    _this.render({
                        giftScore: 0,
                        deliveryDay: 0,
                        deliveryDate: "",
                        valuationValue: 0,
                        counter: opts.counter,
                        price: "0.00",
                        avgValue: "0.00",
                        avgUnit: opts.avgUnit||"",
                        deliveryAlt: ""
                    });
                }
            }
        },
        /**
         * 渲染属性
         */
        render: function(productId){
            var _this = this;
            T.BindData("data", _this.data, true);
        }
    };
    //让具备事件功能
    T.Mediator.installTo(ProductPrice.prototype);
    return function(options){
        return new ProductPrice(options);
    };
});