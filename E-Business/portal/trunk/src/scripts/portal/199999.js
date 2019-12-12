define("portal/199999", ["base", "tools"], function ($, T) {
    function ProductDetailCustom(superClass) {
        var _this = this;
        if (typeof(superClass) == 'function') {
            superClass.call(_this); //将父类的属性继承过来
        }
        _this.defDeliveryDay = 3;//默认货期
        //必须的属性
        _this.required = {
            selects: [], //必选属性
            inputs: ['打样类型', '数量'] //必填属性
        };
        //产品选项
        _this.options = {};
        //默认属性
        _this.attrs = {};
        //表单选项
        _this.formItems = {
            name: {
                tips: {
                    placeholder: "如：A5画册打样",
                    empty: '请填写打样类型',
                    mismatch: '请填写打样类型',
                    error: '请填写打样类型'
                },
                rule: 'nonempty',
                required: true
            },
            number: {
                tips: {
                    placeholder: "如：100本",
                    empty: '请填写数量',
                    mismatch: '请填写正确格式的数量',
                    error: '请填写数量'
                },
                rule: 'nonempty',
                pattern: /^[0-9]{1,10}[\u4e00-\u9fa5]{1}$/,
                required: true
            },
            material: {
                tips: {
                    placeholder: "如：157g铜版纸",
                    empty: '请填写打样材质',
                    mismatch: '请填写打样材质',
                    error: '请填写打样材质'
                },
                rule: 'nonempty'
            },
            size_h: {
                tips: {
                    placeholder: "如：100",
                    empty: '请填写尺寸',
                    type: '尺寸只能是数字',
                    mismatch: '尺寸只能是数字',
                    error: '尺寸只能是数字',
                    min: '尺寸不能小于1',
                    max: '尺寸不能大于10000'
                },
                pattern: /^\d+(\.\d+)?$/,
                rule: 'number',
                depend: 'size_v',
                min: 1,
                max: 10000000
            },
            size_v: {
                tips: {
                    placeholder: "如：100",
                    empty: '请填写尺寸',
                    type: '尺寸只能是数字',
                    mismatch: '尺寸只能是数字',
                    error: '尺寸只能是数字',
                    min: '尺寸不能小于1',
                    max: '尺寸不能大于10000000'
                },
                pattern: /^\d+(\.\d+)?$/,
                rule: 'number',
                depend: 'size_h',
                min: 1,
                max: 10000000
            },
            remark: {
                tips: {
                    placeholder: "如：骑马钉装订，质量要好。",
                    empty: '请填写备注信息',
                    maxlength: '备注信息不得超过1000字',
                    mismatch: '请填写备注信息',
                    error: '请填写备注信息'
                },
                rule: 'nonempty',
                maxlength: 1000
            }
        };
        //格式化产品参数
        _this.FormatAttrs();
    }
    ProductDetailCustom.prototype = {
        init: function () {
            var _this = this;
            _this.BindForm({
                before: function(_form){
                    //打样类型
                    if(_this.SetAttr("打样类型", _form.params.name, true)){
                        return;
                    }
                    //数量
                    if(_this.SetAttr("数量", _form.params.number, true)){
                        return;
                    }
                    //打样材质
                    if(_this.SetAttr("打样材质", _form.params.material)){
                        return;
                    }
                    //打样尺寸
                    if(_form.params.size_h&&_form.params.size_v){
                        if(_this.SetAttr("打样尺寸", _form.params.size_h + '×' + _form.params.size_v + 'mm')){
                            return;
                        }
                    }
                    //备注
                    if(_this.SetAttr("备注", _form.params.remark)){
                        return;
                    }
                    return true;
                }
            });
            var $form = $("#form_details");
            _this.SetNumberInput($form, {input:".size input", min:1, max:10000000});
            _this.SetPrice();
        }
    };
    return ProductDetailCustom;
});