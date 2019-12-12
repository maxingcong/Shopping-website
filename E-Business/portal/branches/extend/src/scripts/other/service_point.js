require(["base", "tools", "location"], function($, T, PCD){
	T.loadBMapSDK();
    T.Loader(function(){
		var pointMap = T.Module({
	        template: "take_address_list",
	        data: {
	            adrdom: null, //地址弹出框对象
	            adrform: null, //表单对象
	            addressId: "", //当前选中的地址ID
	            addressList: [] //地址列表
	            ,filterList: null
	        },
	        events: {
	            "click .point_list.radios .item": "checked", //地址选中
	            "valueChange.pcd [id='pcd-take_address']": "filter" //筛选地址
	        },
	        status: ['',''],
	        init: function(options){
	            var _this = this;
	            options = options||{};
	            _this.adrform = _this.$cont[0];
	            if (_this.$cont.length) {
	            	_this.load(null);
	            	_this.locateMyCity();
	            }
	        },
	        /**
	         * 加载地址
	         * @param {Object} [params=null] 查询参数
	         * @param {Function} [callback] 回掉函数
	         */
	        load: function(param, callback){//目前加载了全部地址
	            var _this = this;
	            T.GET({
	                action: CFG_DS.udetail.come_address,
	                success: function(data, params) {
	                    data = data||{};
	                    _this.data.addressList = data.addressList || [];
                        _this.data.addressAreaList = data.addressAreaList || [];
	                    //_this.data._listWidth = Math.round(Math.max(Math.min($(window).width() *.6, 1040), 800));
	                    //_this.data._listHeight = Math.round(Math.max(Math.min($(window).height() *.6, 480), 240));
	                    _this.loaded(data, params, 0);
	                    //callback&&callback(data, params);//不要在这里重新渲染地图
	                }
	            });
	        },
	        locateMyCity: function(){
	            var _this = this;
	            if(T.cookie("_address")){
		            _this.loaded(null, null, 1);
	            }else{
		        	T.POST({
	                    action: "in_common/ip_info/default_address_query"
	                    ,params: { }
	                    ,success:  function (data, params) {
	                        if(data&&data.useraddress){
	                            _this.data.useraddress = T.JSON.parse(data.useraddress)||{};
	                        }
		                    _this.loaded(data, params, 1);
	                    }
	                });
	            }
	        },
	        complete: function(){
	            var _this = this;
	            var address = _this.data.useraddress||{};
                PCD = SelectAddressSelector(_this.data);
                if(address.region&&address.city){
                    PCD.initSelect("take_address", address.region+'^'+address.city);//选中默认项-触发filter事件
                }else{
                	var _address = T.cookie("_address");
	            	PCD.initSelect("take_address", _address.substring(0, _address.lastIndexOf('^')));//广东省^深圳市
                }
	        },
	        /**
	         * 得到指定ID的地址对象
	         * @param {String} addressId 地址ID
	         */
	        get: function(addressId){
	            return T.Array.get(this.data.addressList, addressId, "addressId");
	        },
	        /**
	         * 选中地址事件函数
	         * @param $this
	         * @param e
	         */
	        checked: function($this, e){//$this == .item
	            e.stopPropagation();
	            var _this = this, $item = $this;
	            if ($item.hasClass('sel')) {return;}
	            $item.addClass('sel').siblings('.item').removeClass('sel');
	            var addressId = $item.data("address_id");
	            var data = _this.get(addressId);
	            if (!addressId) {return;}
	            _this.data.addressId = data.addressId;//保存当前addressId
	            _this.renderMap();
	        },
	        /**
	         * 地址筛选
	         * @param $this
	         * @param e
	         */
	        filter: function($this, e){//（搜索、下拉选择）过滤之后点击一项
	            var _this = this;
	            var pcd = $this.val(); //省市区
	            pcd = (pcd||"").replace(/\^+$/, "").replace(/^北京市\^北京市/, "北京市").replace(/^天津市\^天津市/, "天津市").replace(/^重庆市\^重庆市/, "重庆市").replace(/^上海市\^上海市/, "上海市");
	            var _addressList = [];
	            if(pcd){
	                T.Each(_this.data.addressList, function(i, address){
	                	var add = address.address.replace(/\^+$/, "").replace(/^北京市\^北京市/, "北京市").replace(/^天津市\^天津市/, "天津市").replace(/^重庆市\^重庆市/, "重庆市").replace(/^上海市\^上海市/, "上海市");
	                    if(add.indexOf(pcd)==0){
	                        _addressList.push(address);
	                    }
	                });
	            }else{
	                _addressList = _this.data.addressList;
	            }
            	_this.filterList = _addressList;//过滤结果集 保存到全局
            	_this.data.addressId = null; //不存在当前服务点id
	            _this.compiler("point_list", {addressList: _addressList});
	            PCD.setProvince("take_address", pcd);
	            setTimeout(function(){_this.renderMap()},100);
	        },
	        /*
			 *根据当前提供的服务点列表、服务点地址di，渲染地图
			 @param addressId String 选中的地址
	        */
	        renderMap: function(){
	        	var _this = this;
	            T.loadBMapSDK(function(){
	            	var zoom = _this.data.addressId?12:9;//缩放级别
	            	if (_this.filterList.length==0) {//使用过滤的结果_this.filterList
	            		_this.filterList = _this.data.addressList;//全部
	            		zoom = 4;
	            	}
	            	_this.createMap(_this.filterList, _this.data.addressId, zoom);
		        });
		        
	        },
	        /**
	         * 创建地图
	         * @param addresslist {Object} 服务点对象
	         * @param addressId {String} 服务点id
	         * @param zoom {Number} 缩放级别
	         */
	        createMap: function(addresslist, addressId, zoom){
	        	var _this = this;
	        	var coord, point, myPoint, marker, myIcon;
	        	var map = new BMap.Map("baidumap"); //创建Map实例
	        	zoom = zoom||9;
	        	T.Each(addresslist, function(k, v){
            		var myIcon = null;
            		coord = v.addressCoordinate.split(",");
            		if(coord[0]==null||coord[1]==null) {return false};
            		if (addressId == v.addressId) {
            			myIcon = new BMap.Icon("../../themes/images/mapicon.png", new BMap.Size(30, 38), {
            				anchor: new BMap.Size(16, 36),
            				imageOffset: new BMap.Size(-49, 0)
            			})
            			myPoint = new BMap.Point(coord[0], coord[1]);
            		}
            		point = new BMap.Point(coord[0], coord[1]);
	                marker = new BMap.Marker(point, {icon: myIcon||''});//创建标注
	                map.addOverlay(marker); //添加标注
	                marker.addEventListener("click", function(e){
	                	var that = this;
	                	_this.data.addressId = v.addressId;
	                	_this.checkPoint(v.addressId);
					});
            	});
            	map.centerAndZoom(myPoint||point, zoom);//以最后一个点为地图中心
                map.addControl(new BMap.NavigationControl());
                map.enableScrollWheelZoom(true);
                var stCtrl = new BMap.PanoramaControl();// 构造全景控件
                stCtrl.setOffset(new BMap.Size(32, 32));
                map.addControl(stCtrl);// 添加全景控件
                if(addressId){
                	openInfo(map, _this.get(addressId), myPoint);
               	}
                /**
		         * 地图信息弹窗
		         * @param map {new BMap}
		         * @param address {Object} 服务点对象
		         * @param p {new BMap.Point}
		         */
	            function openInfo(map, address, p){//点击地图标记点
					var point = new BMap.Point(p.lng, p.lat);
					var addr = address.address.split('联系电话');
					var infoWin = new BMap.InfoWindow(
						'<div style="margin:0;font-size:14px;line-height:18px;padding:0 6px;">地址：'+ 
							addr[0].replace(/\^/g,'')+'<br/>电话'+
							addr[1]+'</div>', {
							title: '<h3 style="">'+address.addressName+'</h3>',
		                    width: 300, //宽度自适应
		                    height: 0,  //高度自适应
		                    enableMessage: false,
		                    offset: new BMap.Size(0, -18)
		                });
					map.openInfoWindow(infoWin, point); //开启信息窗口
	            }
	        },
	        checkPoint: function (addressId){//点击服务列表事件
	        	var _this = this;
	        	var item = $('.item[data-address_id="'+addressId+'"]', _this.$cont);
            	item.length !=0 ? item.click(): _this.renderMap();
            }
	    });
		new pointMap();
	});
});