define("portal/200002_tpl", ["base", "tools"], function ($, T) {
    function ProductDetailCustom(superClass) {
        var _this = this;
        if (typeof(superClass) == 'function') {
            superClass.call(_this); //将父类的属性继承过来
        }
        //树脂/灯箱字颜色配置
        _this.colors = {
            '电镀树脂字': {'a': ['镜光', '黑钛金', '钛金（24K金）', '古铜', '玫瑰金', '拉丝（18K金）'], 'b': ['白色', '红色', '黄色', '蓝色', '绿色']}, '电镀灯箱字': {'a': ['镜光', '黑钛金', '钛金（24K金）', '古铜', '玫瑰金', '拉丝（19K金）'], 'b': ['白色', '红色', '黄色', '蓝色', '绿色']}, '拉丝电镀字': {'a': ['镜光', '黑钛金', '钛金（24K金）', '古铜', '玫瑰金', '拉丝（20K金）'], 'b': []}, '镜面电镀字': {'a': ['镜光', '黑钛金', '钛金（24K金）', '古铜', '玫瑰金', '拉丝（21K金）'], 'b': []}
        };
    }
    ProductDetailCustom.prototype = {
        init: function () {
            var _self = this;
            //获取默认属性
            _self.GetDefaultAttrs();
            //设置默认颜色
            _self.attrClickCallback();
            //设置价格
            _self.GetPrice();
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