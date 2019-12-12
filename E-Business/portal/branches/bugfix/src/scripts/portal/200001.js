define("portal/200001", ["base", "tools"], function ($, T) {
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
            '镜面白钢字': [], '拉丝白钢字': [], '树脂白钢字': ['白色', '红色', '黄色', '蓝色', '绿色'], '灯箱白钢字': ['白色', '红色', '黄色', '蓝色', '绿色']
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
            var attr_color = T.DOM.byId('attr_color');
            if (attr_color && _this.attrs['类型']) {
                _this.SetSelectOptions(attr_color, _this.colors[_this.attrs['类型']]);
            }
        }
    };
    return ProductDetailCustom;
});