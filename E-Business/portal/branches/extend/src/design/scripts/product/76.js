require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            init: function(){
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){
                    //请填写其他信息
                    if (forms["其他信息"]) {
                        param["其他信息"] = forms["其他信息"];
                    }
                    //请填写需要展示的内容
                    if(forms["展示内容"]!==""){
                        param["展示内容"] = forms["展示内容"];
                    }/*else{
                        T.msg("请填写需要展示的内容");
                        return false;
                    }*/
                }).on("render.before", function($el, forms){debugger
                    demandMain.data.options.values = {};//屏蔽运营设置
                    demandMain.data.options.names = ["面积"];
                });
                demandMain.init({
                    optionsTemplateName: 'attrs_area',
                    customTemplateName: "other_info",
                    custom: [{
                        attrName: "行业"
                    }, {
                        attrName: "风格"
                    }, {
                        attrName: "色系"
                    }],
                    namesOrder: ["行业", "风格", "色系"],
                    placeholders: {
                        "展示内容": "请填写需要展示的内容"
                    }
                });
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});