require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            init: function(){
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){
                    if (forms["其他信息"]!=="") {
                        param["其他信息"] = forms["其他信息"];
                    }
                    //请填写需要展示的内容
                    if(forms["正面内容"]!==""){
                        param["正面内容"] = forms["正面内容"];
                    }else{
                        T.msg("请填写正面需要展示的内容");
                        return false;
                    }
                    if(forms["反面内容"]!==""){
                        param["反面内容"] = forms["反面内容"];
                    }else{
                        T.msg("请填写反面需要展示的内容");
                        return false;
                    }
                });
                demandMain.init({
                    required: true,
                    customTemplateName: "other_info",
                    custom: [{
                        attrName: "行业"
                    }, {
                        attrName: "色系"
                    }],
                    namesOrder: ["行业", "色系"],
                    placeholders: {
                        "正面内容": "请填写正面需要展示的内容",
                        "反面内容": "请填写反面需要展示的内容",
                        "其他信息": "请填写其他信息"
                    }
                });
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});