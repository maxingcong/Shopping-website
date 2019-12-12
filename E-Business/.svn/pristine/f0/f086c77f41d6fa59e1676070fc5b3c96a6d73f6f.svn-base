require(["base", "tools", "location"], function($, T, PCD){
    var Contactus = {
        init: function(){
        	var _this = this;
            //查看百度地图
            $(document.body).off("click.seeMap", ".coord").on("click.seeMap", ".coord", function(e){
                _this.seeMap($(this), e);
            });
        },
        seeMap: function($this, e){
            var _this = this;
            var name = $this.data("name");
            var coord = $this.data("coord");
            if(_this.mappop&&!name||!coord)return;
            _this.mappop = new T.Popup({
                id: "map-pop",
                title: name,
                width:640,
                content: '<div id="baidumap" class="mappop"></div>',
                ok:'',
                no: '',
                callback:function(){
                    _this.renderMap(coord);
                }
            });
            _this.mappop.on("no", function(){
                _this.mappop = null;
            });
        },
        renderMap: function(coord){
            var _this = this;
            T.loadBMapSDK(function(){
                var coords = coord.split(",");
                if(coords[0]==null||coords[1]==null)return;
                // 百度地图API功能
                var map = new BMap.Map("baidumap"); //创建Map实例
                map.addControl(new BMap.NavigationControl());
                var point = new BMap.Point(coords[0], coords[1]);
                map.centerAndZoom(point, 61);
                map.enableScrollWheelZoom(true);
                // 覆盖区域图层
                //map.addTileLayer(new BMap.PanoramaCoverageLayer());
                // 构造全景控件
                var stCtrl = new BMap.PanoramaControl();
                stCtrl.setOffset(new BMap.Size(32, 32));
                // 添加全景控件
                map.addControl(stCtrl);
                //创建图标
                var myIcon = myIcon = new BMap.Icon("../../themes/images/mapicon.png", new BMap.Size(30, 38), {
                    anchor: new BMap.Size(16, 36),
                    imageOffset: new BMap.Size(-49, 0)
                });
                // 创建标注
                var marker = new BMap.Marker(point, {icon: myIcon||''});
                // 添加标注
                map.addOverlay(marker);
            });
		}
	}
	Contactus.init();
});