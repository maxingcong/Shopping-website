define("portal/200001_tpl", ["base", "tools"], function ($, T) {
    function ProductDetailCustom(superClass) {
        var _this = this;
        if (typeof(superClass) == 'function') {
            superClass.call(_this); //将父类的属性继承过来
        }
        //树脂/灯箱字颜色配置
        _this.colors = {
            '镜面白钢字': [], '拉丝白钢字': [], '树脂白钢字': ['白色', '红色', '黄色', '蓝色', '绿色'], '灯箱白钢字': ['白色', '红色', '黄色', '蓝色', '绿色']
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
            var attr_color = T.DOM.byId('attr_color');
            if (attr_color && _this.attrs['类型']) {
                _this.SetSelectOptions(attr_color, _this.colors[_this.attrs['类型']]);
            }
        }
    };
    return ProductDetailCustom;
});