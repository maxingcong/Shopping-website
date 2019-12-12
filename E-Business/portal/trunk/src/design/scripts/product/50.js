﻿require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            init: function(){debugger
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){
                    //请填写需要展示的内容
                    if(forms["正面内容"]!==""){
                        param["正面内容"] = forms["正面内容"];
                    }/*else{
                        T.msg("请填写正面需要展示的内容");
                        return false;
                    }*/
                    if(forms["反面内容"]!==""){
                        param["反面内容"] = forms["反面内容"];
                    }/*else{
                        T.msg("请填写反面需要展示的内容");
                        return false;
                    }*/
                });
                demandMain.init({
                    custom: [],
                    namesOrder: [],
                    placeholders: {
                        "正面内容": "请填写正面需要展示的内容",
                        "反面内容": "请填写反面需要展示的内容"
                    }
                });
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});