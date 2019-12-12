define("portal/200003", ["base", "tools"], function ($, T) {
    function ProductDetailCustom(superClass) {
        var _this = this;
        if (typeof(superClass) == 'function') {
            superClass.call(_this); //将父类的属性继承过来
        }
        //必须的属性
        _this.required = {
            selects: ['中/英文']//必选属性
            , inputs: ['最长边长度', '数量']//必填属性
        };
    }
    ProductDetailCustom.prototype = {
        init: function () {
            var _this = this;
            _this.BindForm();
            T.FORM().placeholder(T.DOM.byId('color'), "例：红色");//颜色（选填）

            var cmykCfg = {
                min: 0,
                max: 100,
                reg: /\D/g,
                mode: 1,
                lessThanMin: function($input, val){
                    T.msg('值不得小于0');
                },
                moreThan: function($input, val){
                    T.msg('值不得大于100');
                },
                noInput: function($input, val){
                    T.msg('请填写CMYK色值');
                }
            };
            //输入CMYK色值
            _this.SetNumberInput("#cmyk", {
                input: ".textbox",
                okbtn: ".btn",
                c: cmykCfg,
                m: cmykCfg,
                y: cmykCfg,
                k: cmykCfg
            });
            //输入最长边长度
            _this.SetNumberInput("#maxwidth", {
                input: ".textbox",
                okbtn: ".btn",
                maxwidth: {
                    min: 0,
                    max: 800,
                    reg: /\D/g,
                    lessThanMin: function($input, val){
                        T.msg('最长边长度必须大于0');
                    },
                    moreThan: function($input, val){
                        T.alt('最长边长度超过800毫米，请到<a href="'+T.DOMAIN.WWW+'product/200000.html" target="_blank">按需定制页面</a>。');
                    },
                    noInput: function($input, val){
                        T.msg('请填写最长边长度');
                    }
                }
            });
            //输入数量
            _this.SetNumberInput("#quantity", {
                input: ".textbox",
                okbtn: ".btn",
                quantity: {
                    min: 0,
                    max: 1000000,
                    reg: /[^0-9]/g,
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

            //确认颜色
            $("#color_ok").bind("click", function (e) {
                _this.checkColor();
            });

            //获取默认属性
            _this.GetDefaultAttrs();
            //设置价格
            _this.GetPrice();
        },
        checkColor: function (isSubmit) {
            var _this = this, $input = $("#color"), $box = $input.closest(".input"), atr = $box.data("name"), _val = $.trim($input.val()) || "";
            var val = isSubmit ? _this.attrs[atr] : _val;
            _this.attrs[atr] = val;
            $box.addClass("done");
            $input.data("value", val);
            if (!isSubmit) {
                _this.GetPrice();
            }
            return true;
        }
    };
    return ProductDetailCustom;
});