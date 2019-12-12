require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            init: function(){
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
                    custom: [],
                    namesOrder: [],
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