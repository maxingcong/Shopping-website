define("portal/200030", ["base", "tools"], function ($, T) {
    function ProductDetailCustom(superClass) {
        var _this = this;
        if (typeof(superClass) == 'function') {
            superClass.call(_this); //将父类的属性继承过来
        }
        _this.quantity_unit = '套';//数量单位
        _this.SHOW_PRICE = 0;//价格显示方式
        _this.defDeliveryDay = 2;//默认货期
        _this.HAS_WEIGHT = true;//重量
        //必须的属性
        _this.required = {
            selects: ['尺寸', '数量'] //必选属性
            , inputs: ['数量'] //必填属性
        };
        //属性名匹配字符串
        _this.baseInfoName = "材质类型_数量_尺寸-展架套餐";
        //产品选项
        _this.options = {
            "展架套餐": ["展架+画幅+设计","展架+画幅","画幅+设计","画幅（不含设计）"]
        };
        //默认属性
        _this.attrs = {
            "材质类型": "PVC材质",
            "数量": "1套",
            "尺寸": "80cm*180cm",
            "展架套餐": "展架+画幅"
        };
        //格式化产品参数
        _this.FormatAttrs();
    }
    ProductDetailCustom.prototype = {
        init: function () {
            var _this = this;
            _this.BindForm();
            //输入数量
            var $quantity = $("#product_quantity_attr");
            //计数器
            _this.setCounter($quantity, {min:1, max:1000}, function($input, val){
                val = val||1;
                $(".val", $quantity).removeClass("sel");
                $("#product_quantity").val(val);
                _this.attrs["数量"] = val+_this.quantity_unit;
                _this.GetPrice();
            });
            $(".counter input", $quantity).trigger("blur.counter");
            //设置价格==>id,157g铜版纸_500_A4(210mm*285mm）-双面四色,款数;
            _this.GetPrice();
        }
    };
    return ProductDetailCustom;
});