require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            pro34: {
                '“新”手提袋':{
                    '尺寸': ['高340mm*宽260mm*侧边80mm', '高420mm*宽300mm*侧边80mm']
                },
                '手提袋':{
                    '尺寸': ['高340mm*宽220mm*侧边65mm', '高340mm*宽270mm*侧边75mm', '高400mm*宽290mm*侧边90mm', '高450mm*宽320mm*侧边100mm']
                },
                '环保纸袋':{
                    '尺寸': ['高210mm*宽150mm*侧边80mm', '高275mm*宽210mm*侧边110mm', '高320mm*宽275mm*侧边110mm']
                }
            },
            $cont: $("#demand"),
            init: function(){
                var _this = this;
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){
                    //请填写需要展示的内容
                    param["产品"] = $('#pro34').val();
                    if(forms["正面内容"]!==""){
                        param["正面内容"] = forms["正面内容"];
                    }/*else{
                        T.msg("请填写需要展示的内容");
                        return false;
                    }*/
                    if(forms["反面内容"]!==""){
                        param["反面内容"] = forms["反面内容"];
                    }/*else{
                        T.msg("请填写反面需要展示的内容");
                        return false;
                    }*/
                    if(forms["侧面内容"]!==""){
                        param["侧面内容"] = forms["侧面内容"];
                    }/*else{
                        T.msg("请填写侧面需要展示的内容");
                        return false;
                    }*/
                })
                .on("render.before", function($el, forms){debugger
                    demandMain.data.options.names = ["尺寸"];
                    //demandMain.data.options.values = _this.pro34[demandMain.data.paramsInfo["产品"]];
                    demandMain.data.pro34 = _this.pro34;
                })
                .on("click.attr", function($el, e){debugger //点击属性扩展事件
                    $radio = $el.closest('.vals').siblings('.radio');
                    $radio.closest('.d-radios').find('.sel').removeClass('sel');
                    $el.addClass('sel');
                    $radio.addClass('sel');
                    $radio.closest('.d-radios').length && $('#pro34').val($radio.data('value'));
                });
                _this.$cont.on('click', '.d-radios .radio', function(){debugger //点击类别
                    $(this).siblings('.vals').find('.val:first').click();
                });
                demandMain.init({
                    optionsTemplateName: 'design_pro34',
                    custom: [{
                        attrName: "行业"
                    }, {
                        attrName: "色系"
                    }],
                    namesOrder: ["行业", "色系"],
                    placeholders: {
                        "正面内容": "请填写正面需要展示的内容",
                        "反面内容": "请填写反面需要展示的内容",
                        "侧面内容": "请填写侧面需要展示的内容"
                    }
                });
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});