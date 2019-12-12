require(["base", "tools", "modules/floor"], function($, T, Floor){
    var Home = T.Module({
        init: function(){
            var that = this;
            //楼层
            Floor({
                params: {
                    floorType: "2"
                },
                $slider: $("#slider_list_print1")
            }, true).loadFloorList();
        }
    });
    T.Loader(function () {
        new Home();
    });
});