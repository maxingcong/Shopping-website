require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            init: function(){debugger
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){
                    //请填写需要展示的内容
                    if(forms["展示内容"]!==""){
                        param["展示内容"] = forms["展示内容"];
                    }/*else{
                        T.msg("请填写需要展示的内容");
                        return false;
                    }*/
                });
                demandMain.init({
                    custom: [{
                        attrName: "行业"
                    }, {
                        attrName: "色系"
                    }],
                    namesOrder: ["行业", "色系"],
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