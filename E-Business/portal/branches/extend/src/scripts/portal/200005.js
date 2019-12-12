define("portal/200005", ["base", "tools"], function ($, T) {
    function ProductDetailCustom(superClass) {
        var _this = this;
        if (typeof(superClass) == 'function') {
            superClass.call(_this); //将父类的属性继承过来
        }
        //必须的属性
        _this.required = {
            selects: ['材质', '文字颜色', '背景浮雕颜色'] //必选属性
            , inputs: ['尺寸', '数量'] //必填属性
        };
    }
    ProductDetailCustom.prototype = {
        init: function () {
            var _this = this;
            _this.BindForm();

            //输入尺寸
            _this.SetNumberInput("#size", {
                input: ".textbox",
                okbtn: ".btn",
                "width": {
                    min: 0,
                    max: 1000000,
                    reg: /\D/g,
                    lessThanMin: function($input, val){
                        T.msg('横向必须大于0');
                    },
                    moreThan: function($input, val){
                        T.msg('横向最大为1000000毫米');
                    },
                    noInput: function($input, val){
                        T.msg('请填写尺寸');
                    }
                },
                "height": {
                    min: 0,
                    max: 1000000,
                    reg: /\D/g,
                    lessThanMin: function($input, val){
                        T.msg('纵向必须大于0');
                    },
                    moreThan: function($input, val){
                        T.msg('纵向最大为1000000毫米');
                    },
                    noInput: function($input, val){
                        T.msg('请填写尺寸');
                    }
                }
            });
            //输入数量
            _this.SetNumberInput("#quantity", {
                input: ".textbox",
                okbtn: ".btn",
                "quantity": {
                    min: 1,
                    max: 1000000,
                    reg: /[^0-9]/g,
                    mode: 1,
                    lessThanMin: function($input, val){
                        T.msg('数量最少为1个');
                    },
                    moreThan: function($input, val){
                        T.msg('数量最多为1000000个');
                    },
                    noInput: function($input, val){
                        T.msg('请填写数量');
                    }
                }
            });

            //获取默认属性
            _this.GetDefaultAttrs();
            //设置价格
            _this.GetPrice();
        }
    };
    return ProductDetailCustom;
});