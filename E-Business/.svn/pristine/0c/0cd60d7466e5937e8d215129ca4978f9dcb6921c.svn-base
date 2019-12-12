require(["base", "tools", "modules/floor"], function($, T, Floor){
    var Home = T.Module({
        init: function(){
            var _this = this;
            //楼层
            Floor({
                params: {
                    floorType: "1"
                }
            }, true).loadFloorList();
        }
    });
    T.Loader(function () {
        new Home();
    });
});