require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            init: function(){
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){
                    //请填写需要修改的内容以及信息
                    if(forms["还原要求"]!==""){
                        param["还原要求"] = forms["还原要求"];
                    }/*else{
                        T.msg("请填写您需要还原的标志的要求");
                        return false;
                    }*/
                });
                demandMain.init({
                    custom: [],
                    namesOrder: [],
                    placeholders: {
                        "还原要求": "请填写您需要还原的标志的要求"
                    }
                });
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});