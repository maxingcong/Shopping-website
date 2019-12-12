/*有多个页面引用：108、109、110、111、127*/
require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            init: function(){
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){
                    //请填写需要修改的内容以及信息
                    if(forms["基本信息"]!==""){
                        param["基本信息"] = forms["基本信息"];
                    }/*else{
                        T.msg("请填写您公司的基本信息以及您对设计的基本要求");
                        return false;
                    }*/
                });
                demandMain.init({
                    custom: [],
                    namesOrder: [],
                    placeholders: {
                        "基本信息": "请填写您公司的基本信息以及您对设计的基本要求"
                    }
                });
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});