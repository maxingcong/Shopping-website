define("modules/point", ["base", "tools", "location"], function($, T, PCD){
    return T.Module({
        template: "take_address_list",
        data: {
            adrdom: null, //地址弹出框对象
            adrform: null, //表单对象
            addressId: "", //选中的地址ID
            addressList: [] //地址列表
        },
        events: {
            "click .point_list.radios .item": "checked", //地址选中
            "valueChange.pcd [id='pcd-take_address']": function($this, e){
                this.filter($this.val());
            }, //筛选地址
            "click .submit:not(.dis)": "submit" //确认选中的地址
        },
        init: function(options){
            var _this = this;
            options = options||{};
            _this.mode = options.mode||0; //1：在弹出框中显示列表

            _this.adrform = _this.$cont[0];

            if(_this.$cont.length){
                _this.load(null);
            }

            //查看百度地图
            $(document.body).off("click.seeMap", ".coord").on("click.seeMap", ".coord", function(e){
                _this.seeMap($(this), e);
            });
        },
        /**
         * 加载地址
         * @param {Object} [params=null] 查询参数
         * @param {Function} [callback] 回掉函数
         */
        load: function(param, callback){
            var _this = this;
            T.GET({
                action: CFG_DS.udetail.come_address,
                params: _this.params||{},
                success: function(data, params) {
                    data = data||{};
                    _this.data.addressList = data.addressList || [];
                    _this.data._listWidth = Math.round(Math.max(Math.min($(window).width() *.6, 1040), 800));
                    _this.data._listHeight = Math.round(Math.max(Math.min($(window).height() *.6, 480), 240));
                    _this.render();
                    var parts = (_this.data.defaultValue||"").split("^");
                    if(parts.length>2){
                        _this.data.defaultValue = parts.slice(0, 2).join("^");
                    }
                    PCD = SelectAddressSelector(data);
                    PCD.initSelect("take_address", _this.data.defaultValue);
                    _this.setChecked(_this.data.addressId);
                    if(typeof(callback)=="function"){
                        callback(data, params);
                    }else if(_this.callbacks.loaded){
                        _this.callbacks.loaded(data, params);
                    }else{
                        _this.loaded(data, params, callback||0);
                    }
                    T.loadBMapSDK();
                }
            });
        },
        /**
         * 加载完成
         complete: function(){
            var _this = this;
        },
         */
        /**
         * 得到指定ID的地址对象
         * @param {String} addressId 地址ID
         */
        get: function(addressId){
            return T.Array.get(this.data.addressList, addressId, "addressId");
        },
        /**
         * 设置选中
         * @param {String} addressId 地址ID
         */
        setChecked: function(addressId){
            var _this = this;
            var data = _this.get(addressId);
            $(".item.sel, .radio.sel", _this.$cont).removeClass("sel");
            var $item = $("#take_address_item-" + addressId);
            if(data&&$item&&$item.length){
                $item.addClass("sel");
                $(".radio", $item).addClass("sel");
            }else{
                $item = $(".item:first-child", _this.$cont);
                data = _this.get($item.data("address_id"));
                if(data&&$item&&$item.length){
                    $item.addClass("sel");
                    $(".radio", $item).addClass("sel");
                }
            }
            if(data&&data.addressId){
                _this.data.addressId = data.addressId;
            }
			var pos = $item.position();
			if(pos){
				var $list = $(".point_list ", _this.$cont);
				var y = 0;
				$item.prevAll(".item").each(function(i, el){
					y += $(el).outerHeight();
				});
				$list.stop(true, true).animate({ scrollTop: y + 1 }, 120);
			}
        },
        /**
         * 选中地址
         * @param $this
         * @param e
         */
        checked: function($this, e){
            e.stopPropagation();
            var _this = this;
            var address = _this.get(_this.data.addressId);
            var $item = $this.closest(".item", _this.$cont);
            var addressId = $item.data("address_id");
            if (!addressId) return;
            _this.setChecked(addressId);
            if(_this.mode==1){
                if(_this.map && address && address.marker){
                    try{
                        _this.map.removeOverlay(address.marker);
                        if(address.addressId!=addressId){
                            _this.renderMap(address, _this.map);
                        }
                    }catch(e){}
                }
                _this.renderMap(_this.get(addressId), _this.map);
            }
        },
        /**
         * 地址筛选
         * @param pcd
         */
        getAddressList: function(pcd){
            var _this = this;
            pcd = pcd?pcd.replace(/^\^+|\^+$/, ""):""; //省市区
            var shortPcd = pcd.replace(/^北京市\^北京市/, "北京市").replace(/^天津市\^天津市/, "天津市").replace(/^重庆市\^重庆市/, "重庆市").replace(/^上海市\^上海市/, "上海市");
            var addressList = [],
                usableList = [];
            if(shortPcd){
                var arr = pcd.split("^");
                T.Each(_this.data.addressList, function(i, address){
                    address.address = address.address.replace(/^北京市\^北京市/, "北京市").replace(/^天津市\^天津市/, "天津市").replace(/^重庆市\^重庆市/, "重庆市").replace(/^上海市\^上海市/, "上海市");
                    if(address.address.indexOf(shortPcd)==0){
                        address.city = arr[1]||"";
                        addressList.push(address);
                        var idx = address.address.indexOf(" ");
                        idx = idx>0?idx:address.address.length;
                        var result = address.address.substring(0, idx).replace(shortPcd, "").replace(/^\^+|\^+$/, "");
                        if(result){
                            var parts = result.split("^");
                            if(parts && parts[0]){
                                T.Array.add(usableList, {
                                    key: parts[0],
                                    val: parts[0]
                                }, false, "key");
                            }
                        }
                    }
                });
            }else{
                addressList = _this.data.addressList;
            }
            return {
                pcd: pcd,
                addressList: addressList,
                usableList: usableList
            };
        },
        isEnabled: function(pcd){
            var _this = this;
            var parts = pcd.split("^");
            if(parts.length>2){
                pcd = parts.slice(0, 2).join("^");
            }
            var ret = _this.getAddressList(pcd)||{};
            var addressList = ret.addressList||[];
            return addressList.length;
        },
        /**
         * 地址筛选
         * @param pcd
         */
        filter: function(pcd){
            var _this = this;
            var ret = _this.getAddressList(pcd)||{};
            pcd = ret.pcd||"";
            var addressList = ret.addressList||[],
                usableList = ret.usableList||[];
            if(addressList.length){
                $(".submit", _this.$cont).removeClass("dis");
            }else{
                $(".submit", _this.$cont).addClass("dis");
            }
            var idPrefix = ["pid", "cid", "did"][pcd.split("^").length];
            if(_this.data.address){
                T.DOM.setSelectOptions(T.DOM.byId(idPrefix + "-take_address"), {
                    len: 1,
                    key: "key",
                    val: "val",
                    data: usableList
                });
            }
            var slt = T.DOM.byId(idPrefix + "-districts");
            if(slt){
                T.DOM.setSelectOptions(slt, {
                    len: 1,
                    key: "key",
                    val: "val",
                    data: usableList,
                    value: slt.value
                });
                slt.style.display = "";
                slt.onchange = function(e){
                    _this.filter(pcd + "^" + slt.value);
                };
            }
            var render = function(){
                _this.compiler("point_list", {addressList: addressList});
                _this.data.addressId = T.Array.check(addressList, _this.data.addressId, "addressId", false).join(";");
                if(_this.data.addressId){
                    $(".point_list .item[data-address_id='"+_this.data.addressId+"']", _this.$cont).click();
                }else{
                    $(".point_list .item:first-child", _this.$cont).click();
                }
            };

            if(_this.data.address){
                var parts = _this.data.address.split("^");
                if(parts.length>1){
                    T.loadBMapSDK(function(){
                        var myGeo = new BMap.Geocoder();
                        //地址解析
                        myGeo.getPoint(_this.data.address, function(point){
                            if (point) {
                                _this.map = new BMap.Map("baidumap"); //创建Map实例
                                T.Each(addressList, function(i, item){
                                    var coords = (item.addressCoordinate||"").split(",");
                                    var pointB = new BMap.Point(coords[0]||0, coords[1]||0);
                                    item.distance = _this.map.getDistance(point, pointB);
                                });
                                for(var i=0; i<addressList.length-1; i++){
                                    for(var j=0; j<addressList.length-i-1; j++){
                                        if(addressList[j].distance > addressList[j+1].distance){
                                            var temp = addressList[j];
                                            addressList[j] = addressList[j+1];
                                            addressList[j+1] = temp;
                                        }
                                    }
                                    addressList[i].city = parts[1]||"";
                                }
                                render();
                                _this.map = new BMap.Map("baidumap"); //创建Map实例
                                _this.setChecked(); //默认选中的地址ID
                                for(var i=addressList.length-1; i>=0; i--){
                                    addressList[i].index = i;
                                    _this.renderMap(addressList[i], _this.map);
                                }
                            }else{
                                render();
                            }
                        }, parts[1]);
                    });
                }
            }else{
                render();
            }
        },
        /**
         * 确认选择
         */
        submit: function(){
            var _this = this;
            var data = _this.get(_this.data.addressId);
            if(data){
                if(_this.callbacks.checked)_this.callbacks.checked(data);
                _this.callbacks.checked = null;
            }
            _this.hide();
        },
        show: function(options, callback){
            var _this = this;
            options = options||{};
            _this.data.address = (options.pcd||_this.data.address||T.cookie("_address")||CFG_DB.DEF_PCD).replace(/\^+$/g, "");
            var parts = options.pcd.split("^");
            if(parts.length>2){
                options.pcd = parts.slice(0, 2).join("^");
            }
            _this.callbacks.checked = callback;
            _this.adrdom = T.dailog(_this.adrform, "请选择自提点");
            _this.filter(options.pcd);
        },
        hide: function(){
            var _this = this;
            if(_this.adrdom)_this.adrdom.remove();
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
        renderMap: function(coord, map){
            var _this = this;
            T.loadBMapSDK(function(){
                var coords = (typeof(coord)=="string"?coord:coord.addressCoordinate).split(",");
                var address = typeof(coord)=="object"?coord:{};
                if(coords[0]==null||coords[1]==null)return;
                // 百度地图API功能
                if(!map) map = new BMap.Map("baidumap"); //创建Map实例
                map.addControl(new BMap.NavigationControl());
                var point = new BMap.Point(coords[0], coords[1]);
                if(address.city){
                    if(address.city=="重庆市" || address.city=="南昌市"){ //放缩级别特殊处理
                        map.centerAndZoom(address.city, 9);
                    }else{
                        map.centerAndZoom(address.city);
                    }
                }else{
                    map.centerAndZoom(point, 19);
                }
                map.enableScrollWheelZoom(true);
                // 覆盖区域图层
                //map.addTileLayer(new BMap.PanoramaCoverageLayer());
                // 构造全景控件
                var stCtrl = new BMap.PanoramaControl();
                stCtrl.setOffset(new BMap.Size(32, 32));
                // 添加全景控件
                map.addControl(stCtrl);
                var myIcon;
                if(address.addressId==_this.data.addressId || !address.addressId){
                    myIcon = new BMap.Icon("../../themes/images/mapicon.png", new BMap.Size(30, 38), {
                        anchor: new BMap.Size(16, 36),
                        imageOffset: new BMap.Size(-49, 0)
                    });
                }else{
                    //创建图标
                    myIcon = new BMap.Icon("../../themes/images/marker.png", new BMap.Size(22, 33), {
                        anchor: new BMap.Size(11, 33),
                        imageOffset: new BMap.Size(-1-22*address.index, 0)
                    });
                }
                // 创建标注
                var marker = new BMap.Marker(point, {icon: myIcon||''});
                // 添加标注
                map.addOverlay(marker);
                address.marker = marker;
                //跳动的动画
                /*if(!index>0){
                 marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                 }*/

                var address = address||_this.get(_this.data.addressId);
                if(address && address.address){
                    var parts = address.address.split("联系电话");
                    var adr = (parts[0]||"").replace(/\s+|\^+/g, "");
                    var tel = (parts[1]||"").replace(/[^0-9-]/g, "");
                    // 创建信息窗口对象
                    var infoWindow = new BMap.InfoWindow('<div style="margin:0;font-size:14px;line-height:18px;padding:0 6px;">' +
                        '地址：' + adr + '<br/>' +
                        '电话：' + tel + '<br/>' +
                        '</div>', {
                        title: '<h3 style="">'+address.addressName+'</h3>', //标题
                        width  : 300, //宽度
                        height : 0 //高度
                    });
                    // 开启信息窗口
                    marker.addEventListener("click", function(){
                        map.openInfoWindow(infoWindow, point);
                        $("[data-address_id='"+address.addressId+"']", _this.$cont).click();
                    });
                }

                //var myCompOverlay = _this.customOverlay(map, point, "custom-marker");
                //map.addOverlay(myCompOverlay);
            });
        }/*,
        customOverlay: function(mp, point, className, index){
            var _this = this;
            // 复杂的自定义覆盖物
            var ComplexCustomOverlay = function(point, className, index){
                this._point = point;
                this._className = className;
                this._index = index;
            };
            ComplexCustomOverlay.prototype = new BMap.Overlay();
            ComplexCustomOverlay.prototype.initialize = function(map){
                this._map = map;
                var div = this._div = document.createElement("div");
                div.className = this._className;
                if(this._index) div.innerHTML = this._index;
                div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
                mp.getPanes().labelPane.appendChild(div);
                return div;
            };
            ComplexCustomOverlay.prototype.draw = function(){
                var map = this._map;
                var pixel = map.pointToOverlayPixel(this._point);
                this._div.style.left = pixel.x - 11 + "px";
                this._div.style.top  = pixel.y - 33 + "px";
            };
            return new ComplexCustomOverlay(point, className, index);
        }*/
    });
});
