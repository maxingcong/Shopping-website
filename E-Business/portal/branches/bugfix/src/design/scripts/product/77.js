/*有多个页面引用：21、54、75、77、112、129、147、148、155、156*/
require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            init: function(){
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){
                    if(forms["更多联系信息"]!==""){
                        param["更多联系信息"] = forms["更多联系信息"];
                    }
                });
                demandMain.init({
                    isContactTime: true, //联系时段
                    custom: [],
                    namesOrder: [],
                    placeholders: {
                        "更多联系信息": "如您方便，您可以填写其他更多信息方便我们的客服顾问与您联系"
                    }
                });
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});