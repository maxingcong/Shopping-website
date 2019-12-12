/*有多个页面引用：141*/
require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            init: function(){
                demandMain = DemandMain();
                demandMain.init();
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});