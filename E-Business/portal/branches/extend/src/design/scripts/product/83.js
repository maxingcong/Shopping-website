require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            init: function(){debugger
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){debugger
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
                });
                demandMain.init({
                    customTemplateName: "other_info",
                    custom: [{
                        attrName: "色系"
                    }],
                    namesOrder: ["色系"],
                    placeholders: {
                        "其他信息": "请填写其他信息",
                        "展示内容": "请填写需要展示的内容"
                    }
                });
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});