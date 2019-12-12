define("portal/200004_tpl", ["base", "tools"], function ($, T) {
    function ProductDetailCustom(superClass) {
        var _this = this;
        if (typeof(superClass) == 'function') {
            superClass.call(_this); //将父类的属性继承过来
        }
    }
    ProductDetailCustom.prototype = {
        init: function () {
            var _self = this;
            //获取默认属性
            _self.GetDefaultAttrs();
            //设置价格
            _self.GetPrice();
        }
    };
    return ProductDetailCustom;
});