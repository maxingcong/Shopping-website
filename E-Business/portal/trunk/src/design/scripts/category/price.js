define("design/price", ["base", "tools"], function($, T){
    "use strict";
    function ProductPrice(options){}
    ProductPrice.prototype = {
        data: {},
        cacheData: "", //上次获取价格的参数字符串
        $cont: $("#wrapper"),
        load: function(paramsData, opts){debugger
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
                action: "in_product_new/get_design_price",
                params: {
                    data: paramsData
                },
                success: function(data, params) {
                    _this.pricing = false;
                    if(T.Typeof(data.data)=="Array" && T.JSON.stringify(params.data)==_this.cacheData){
                        var price = 0,
                            costPrice = 0;
                        T.Each(data.data, function(i, item){
                            price = T.Number.add(price, item.price||0);
                            costPrice = T.Number.add(costPrice, item.originalPrice||0) * (item.productCount||1);
                        });
                        price = price >= 0 ? price : 0;
                        costPrice = costPrice >= 0 ? costPrice : 0;
                        _this.data.price = price;
                        _this.data.costPrice = costPrice;
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