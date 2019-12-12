require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            init: function(){
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){
                    //请填写需要修改的内容以及信息
                    if(forms["排版需求"]!==""){
                        param["排版需求"] = forms["排版需求"];
                    }/*else{
                        T.msg("请填写排版需求");
                        return false;
                    }*/
                });
                demandMain.init({
                    custom: [],
                    namesOrder: [],
                    placeholders: {
                        "排版需求": "请尽可能详细的描述您的排版需求"
                    }
                });
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});