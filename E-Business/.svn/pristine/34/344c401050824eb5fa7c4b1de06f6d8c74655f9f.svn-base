/*有多个页面引用：18、139*/
require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            init: function(){
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){
                    //请填写需要修改的内容以及信息
                    if(forms["修改内容"]!==""){
                        param["修改内容"] = forms["修改内容"];
                    }else{
                        T.msg("请填写需要修改的内容以及信息");
                        return false;
                    }
                });
                demandMain.init({
                    custom: [],
                    namesOrder: [],
                    placeholders: {
                        "修改内容": "请填写需要修改的内容以及信息"
                    }
                });
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});