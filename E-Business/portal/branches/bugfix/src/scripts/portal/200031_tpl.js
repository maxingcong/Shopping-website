define("portal/200031_tpl", ["base", "tools"], function ($, T) {
    function ProductDetailCustom(superClass) {
        var _this = this;
        if (typeof(superClass) == 'function') {
            superClass.call(_this); //将父类的属性继承过来
        }
        //属性名匹配字符串
        _this.baseInfoName = "材质类型_数量_尺寸-展架套餐";
        //产品选项
        _this.options = {
            "展架套餐": ["展架+画幅+设计","展架+画幅","画幅+设计","画幅（不含设计）"]/*,
            "展架材质": ["铁质喷漆","不锈钢"]*/
        };
        //默认属性
        _this.attrs = {
            "材质类型": "PVC材质",
            "数量": "1套",
            "尺寸": "80cm*180cm",
            "展架套餐": "展架+画幅"/*,
            "展架材质": "铁质喷漆"*/
        };
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