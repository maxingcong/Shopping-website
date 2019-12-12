/*有多个页面引用：116、117*/
require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            init: function(){
                demandMain = DemandMain();
                demandMain.init({
                    isCoupon: false, //是否使用优惠券抵扣
                    isVIPLevel: false //是否支持会员折扣
                });
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});