define("package/price", ["base", "tools"], function($, T){
    "use strict";
    function ProductPrice(options){}
    ProductPrice.prototype = {
        data: {},
        cacheData: "", //上次获取价格的参数字符串
        $cont: $("#wrapper"),
        load: function(paramsData, opts){
            var _this = this;
            //计算中逻辑
            _this.render({
                giftScore: T.DOING,
                price: T.DOING,
                costPrice: T.DOING
            });
            //获取价格
            _this.pricing = true;
            _this.trigger("pricing");
            T.POST({
                action: "in_product/check_recharge_price",
                params: {
                    data: paramsData
                },
                success: function(data, params) {
                    _this.pricing = false;
                    if(T.JSON.stringify(params.data)==_this.cacheData){
                        var price = data.totalPrice >= 0 ? data.totalPrice : 0;
                        _this.data.price = price;
                        _this.data.costPrice = price;
                        _this.data.giftScore = Math.ceil(price);
                        _this.render(_this.data);
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
            var cacheData = T.JSON.stringify(data);
            if(_this.cacheData!==cacheData){
                _this.cacheData = cacheData;
                if(data.length){
                    _this.load(data, opts);
                }else{
                    _this.cacheData = "";
                    _this.render({
                        giftScore: T.DOING,
                        price: T.DOING,
                        costPrice: T.DOING
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