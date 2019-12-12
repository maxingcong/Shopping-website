require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            init: function(){debugger
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){
                    //请填写您公司的基本信息以及您对设计的基本要求
                    if(forms["设计要求"]!==""){
                        param["设计要求"] = forms["设计要求"];
                    }else{
                        T.msg("请填写您公司的基本信息以及您对设计的基本要求");
                        return false;
                    }
                });
                demandMain.init({
                    custom: [],
                    namesOrder: [],
                    placeholders: {
                        "设计要求": "请填写您公司的基本信息以及您对设计的基本要求"
                    }
                });
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});