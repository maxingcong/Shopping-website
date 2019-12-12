define("portal/200002", ["base", "tools"], function ($, T) {
    function ProductDetailCustom(superClass) {
        var _this = this;
        if (typeof(superClass) == 'function') {
            superClass.call(_this); //将父类的属性继承过来
        }
        //必须的属性
        _this.required = {
            selects: ['中/英文', '类型']//必选属性
            , inputs: ['最长边长度', '数量']//必填属性
        };
        //树脂/灯箱字颜色配置
        _this.colors = {
            '电镀树脂字': {'a': ['镜光', '黑钛金', '钛金（24K金）', '古铜', '玫瑰金', '拉丝（18K金）'], 'b': ['白色', '红色', '黄色', '蓝色', '绿色']}, '电镀灯箱字': {'a': ['镜光', '黑钛金', '钛金（24K金）', '古铜', '玫瑰金', '拉丝（19K金）'], 'b': ['白色', '红色', '黄色', '蓝色', '绿色']}, '拉丝电镀字': {'a': ['镜光', '黑钛金', '钛金（24K金）', '古铜', '玫瑰金', '拉丝（20K金）'], 'b': []}, '镜面电镀字': {'a': ['镜光', '黑钛金', '钛金（24K金）', '古铜', '玫瑰金', '拉丝（21K金）'], 'b': []}
        };
    }
    ProductDetailCustom.prototype = {
        init: function () {
            var _this = this;
            _this.BindForm();
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

            //获取默认属性
            _this.GetDefaultAttrs();
            //设置默认颜色
            _this.attrClickCallback();
            //设置价格
            _this.GetPrice();
        },
        attrClickCallback: function ($this) {
            var _this = this;
            var attr_color_a = T.DOM.byId('attr_color_a');
            var attr_color_b = T.DOM.byId('attr_color_b');
            if (attr_color_a && attr_color_b && _this.attrs['类型']) {
                _this.SetSelectOptions(attr_color_a, _this.colors[_this.attrs['类型']].a);
                _this.SetSelectOptions(attr_color_b, _this.colors[_this.attrs['类型']].b);
            }
        }
    };
    return ProductDetailCustom;
});