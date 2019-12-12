/**
 * @fileOverview 自定义数量类产品
 */
define("product/params_com", ["base", "tools", "product/params"], function($, T, ProductParams){
    "use strict";
    function ProductParamsQty(){
        var _this = this;
        ProductParams.call(_this);
    }
    ProductParamsQty.prototype = {
        /**
         * 绑定事件
         */
        events: function() {}
    };
    //让具备事件功能
    T.Mediator.installTo(ProductParamsQty.prototype);
    return function(options){
        return new ProductParamsQty(options);
    };
});