define("modules/floor", ["base", "tools", "widgets/navpos"], function($, T, NavPos){
    var config =  {
        tempCombList: [
            {
                tempCombId: 11,
                tempList: [101, 201]
            },
            {
                tempCombId: 12,
                tempList: [102, 201]
            },
            {
                tempCombId: 13,
                tempList: [103, 201]
            },
            {
                tempCombId: 14,
                tempList: [104, 202]
            },
            {
                tempCombId: 15,
                tempList: [105, 203]
            },
            {
                tempCombId: 16,
                tempList: [106, 204]
            },
            {
                tempCombId: 17,
                tempList: [107, 205]
            },
            {
                tempCombId: 21,
                tempList: [301, 201]
            },
            {
                tempCombId: 22,
                tempList: [302, 201]
            },
            {
                tempCombId: 23,
                tempList: [303, 201]
            },
            {
                tempCombId: 24,
                tempList: [304, 202]
            },
            {
                tempCombId: 25,
                tempList: [305, 203]
            },
            {
                tempCombId: 26,
                tempList: [306, 204]
            },
            {
                tempCombId: 27,
                tempList: [307, 205]
            }
        ],
        tempList: [
            {
                tempId: 101,
                itemList: [2002, 2003, 1001, 1001, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 201,
                itemList: [1001, 1001, 1001, 1001, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 102,
                itemList: [2002, 2003, 1001, 1001, 1001, 1001, 2003]
            },
            {
                tempId: 103,
                itemList: [2002, 1001, 1001, 1001, 1001, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 104,
                itemList: [2003, 1001, 1001, 2002, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 202,
                itemList: [1001, 1001, 1001, 1001, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 105,
                itemList: [2004, 2003, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 203,
                itemList: [1001, 1001, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 106,
                itemList: [2003, 1001, 1001, 1001]
            },
            {
                tempId: 204,
                itemList: [1001, 1001, 1001]
            },
            {
                tempId: 107,
                itemList: [2001, 1001, 1001, 1001, 1001]
            },
            {
                tempId: 205,
                itemList: [1001, 1001, 1001, 1001]
            },
            {
                tempId: 301,
                itemList: [2002, 2003, 2001, 2001, 2001, 2001, 2001, 2001]
            },
            {
                tempId: 302,
                itemList: [2002, 2003, 2001, 2001, 2001, 2001, 2003]
            },
            {
                tempId: 303,
                itemList: [2002, 2001, 2001, 2001, 2001, 2001, 2001, 2001, 2001]
            },
            {
                tempId: 304,
                itemList: [2003, 2001, 2001, 2002, 2001, 2001, 2001, 2001]
            },
            {
                tempId: 305,
                itemList: [2004, 2003, 2001, 2001, 2001, 2001]
            },
            {
                tempId: 306,
                itemList: [2003, 2001, 2001, 2001]
            },
            {
                tempId: 307,
                itemList: [2001, 2001, 2001, 2001, 2001]
            }
        ],
        itemList: [
            {
                "itemCode": 1001,
                "width": 236,
                "height": 236
            },
            {
                "itemCode": 2001,
                "width": 236,
                "height": 310,
                "carouselInterval": 800,
                "residenceTime": 1500
            },
            {
                "itemCode": 2002,
                "width": 236,
                "height": 630,
                "carouselInterval": 800,
                "residenceTime": 1500
            },
            {
                "itemCode": 2003,
                "width": 482,
                "height": 310,
                "carouselInterval": 800,
                "residenceTime": 1500
            },
            {
                "itemCode": 2004,
                "width": 482,
                "height": 630,
                "carouselInterval": 800,
                "residenceTime": 1500
            }
        ],
        data: null,/*{
            "carouselInterval": 800,
            "residenceTime": 1500,
            "contentId": 1,
            "productId": 200021,
            "productName": "",
            "itemImgs": "",
            "hiperlink": "",
            "priceDesc": "",
            "contentDesc": ""
        },*/
        tempComb: {},
        temp: {},
        item: {}
    };
    T.Each(config.itemList, function(i, item){
        config.item[item.itemCode] = $.extend(true, {}, item, {
            data: [config.data]
        });
    });
    T.Each(config.tempList, function(i, temp){
        var itemList = [];
        T.Each(temp.itemList, function(k, itemCode){
            itemList.push($.extend(true, {}, config.item[itemCode], {
                sort: k
            }));
        });
        config.temp[temp.tempId] = $.extend(true, {}, temp, {
            sort: i,
            pageName: "页签名称",
            itemList: itemList
        });
    });
    //var floorList = [];
    T.Each(config.tempCombList, function(i, tempComb){
        var pageList = [];
        T.Each(tempComb.tempList, function(k, tempId){
            pageList.push($.extend(true, {}, config.temp[tempId], {
                sort: k
            }));
        });
        config.tempComb[tempComb.tempCombId] = $.extend(true, {}, tempComb, {
            floorName: "楼层名称",
            pageList: pageList
        });
        //floorList.push(config.tempComb[tempComb.tempCombId]);
    });
    //T.Template("floor_list", {floorList: floorList}, true);

    function Floor(options, isEvent){
        this.init(options||{}, isEvent);
    }
    Floor.prototype = {
        data: {
            floorList: []
        },
        params: {
            floorType: "0"
        },
        $cont: $("#template-floor_list-view"),
        $nav: $("#template-floor_nav-view"),
        init: function (options, isEvent) {
            var _this = this;
            _this.$slider = $(options.$slider);
            options.params = options.params||{};
            _this.params.floorType = options.params.floorType||"0";
            if(isEvent)_this.events();
        },
        loadFloorList: function(callback){//return;
            var _this = this;
            T.GET({
                action: "in_product_new/floor/floor_list_web_query",
                params: _this.params,
                success: function(data){
                    _this.data.floorList = data.floorList||[];
                    var floorIds = [];
                    T.Each(data.floorList, function(i, floor){
                        if(floor.pageList && floor.pageList.length>1){
                            floorIds.push(floor.floorId);
                        }
                        T.Each(floor.pageList, function(j, page){
                            var itemList = $.extend(true, {}, config.temp[page.tempId]).itemList; //拷贝原始结构
                            T.Each(page.itemList, function(k, item){
                                if(item.data&&item.data[0]){
                                    var contentDesc = item.data[0].contentDesc || '',
                                        productName = item.data[0].productName || '';
                                    item.data[0].contentDescEllipsis = T.GetEllipsis(contentDesc, productName, 58);
                                }
                                itemList[item.sort] = $.extend(true, {}, item);
                            });
                            page.itemList = itemList;
                        });
                    });
                    T.Template("floor_list", _this.data, true);
                    T.Template("floor_nav", _this.data, true);
                    //楼层导航
                    _this.navPos = NavPos({
                        $cont: _this.$cont,
                        $nav: _this.$nav,
                        namespace: "floor",
                        navItem: ".nav-item",
                        floorItem: ".floor-item"
                    });
                    if(callback)callback.call(_this, data);
                    _this.loadPageListOfFloor(floorIds.join(","), callback);
                    setTimeout(function(){
                        _this.render();
                    }, 10);
                },
                failure: function(data, params){
                    T.Template("floor_list", _this.data, true);
                    T.Template("floor_nav", _this.data, true);
                },
                error: function(data, params){}
            }, function(data){},function(data){});
        },
        /**
         * 单/多个查询(排除首页)
         * @param floorIds 以,分割
         */
        loadPageListOfFloor: function(floorIds, callback){
            var _this = this;
            if(!floorIds)return;
            T.GET({
                action: "in_product_new/floor/floor_web_query",
                params: {
                    floorIds: floorIds
                },
                success: function(data){
                    data.floorList = data.floorList||[];
                    T.Each(data.floorList, function(i, floor){
                        T.Each(floor.pageList, function(j, page){
                            var itemList = $.extend(true, {}, config.temp[page.tempId]).itemList; //拷贝原始结构
                            T.Each(page.itemList, function(k, item){
                                if(item.data&&item.data[0]){
                                    var contentDesc = item.data[0].contentDesc || '',
                                        productName = item.data[0].productName || '';
                                    item.data[0].contentDescEllipsis = T.GetEllipsis(contentDesc, productName, 58);
                                }
                                itemList[item.sort] = $.extend(true, {}, item);
                            });
                            page.itemList = itemList;
                        });
                    });
                    T.Each(data.floorList, function(i, floor){
                        floor.pageList = floor.pageList||[];
                        var $floor = $(".floor-item[data-nav_idx='"+floor.floorId+"']", _this.$cont);
                        var $cont = $(".floor-content:first-child", $floor);
                        $cont.nextAll(".floor-content").remove();
                        $cont.after(T.Compiler.template("floor_page_list", floor));
                    });
                    _this.data.floorList = data.floorList;
                    if(callback)callback.call(_this, data);
                    setTimeout(function(){
                        _this.render();
                    }, 10);
                },
                failure: function(data, params){
                    T.Template("floor_list", _this.data, true);
                    T.Template("floor_nav", _this.data, true);
                },
                error: function(data, params){}
            }, function(data){},function(data){});
        },
        render: function () {
            var _this = this;
            $(".slide-panel", _this.$cont).each(function(i, el){
                var $el = $(el);
                T.Slider({
                    cont: el,
                    duration: $el.data("duration"),
                    interval: $el.data("interval"),
                    direction: "lr",
                    autoplay: true
                });
            });
        },
        events: function(){
            var _this = this;
            _this.$cont.off("mouseenter.floor").on("mouseenter.floor", ".floor-tab", function(e){
                var $this = $(this),
                    $tab = $this.closest(".floor-tab"),
                    $tabs = $this.closest(".floor-tabs"),
                    $floor = $this.closest(".floor-item");
                $("a", $tabs).removeClass("sel");
                $("a", $this).addClass("sel");
                var pageId = $tab.data("page_id"),
                    floorId = $floor.data("nav_idx");
                var $content = $(".floor-content[data-page_id='"+pageId+"']", $floor);
                if($content && $content.length){
                    $(".floor-content", $floor).hide();
                    $(".floor-content[data-page_id='"+pageId+"']", $floor).show();
                }
            });debugger
            if(_this.$slider && _this.$slider.length){
                _this.$slider.off("click.anchor").on("click.anchor", "map area[data-anchor_id]", function (e) {
                    var anchorId = $(this).data("anchor_id");
                    if(anchorId){
                        if(_this.navPos && _this.navPos.opts){
                            var opts = _this.navPos.opts;
                            $(opts.navItem+"[data-nav_idx='"+anchorId+"']", opts.$nav).trigger("click."+ opts.namespace);
                        }
                    }
                    return false;
                }).off("mouseenter.anchor").on("mouseenter.anchor", "map area", function (e) {debugger
                    var $this = $(this),
                        $map = $this.parent(),
                        idx = $this.index();
                    $("li", $map.siblings(".map-hover")).eq(idx-0).addClass("hover");
                    return false;
                }).off("mouseleave.anchor").on("mouseleave.anchor", "map area", function (e) {
                    $(".map-hover li.hover", _this.$slider).removeClass("hover");
                    return false;
                });
            }
        }
    };
    return function(options, isEvent){
        return new Floor(options, isEvent);
    };
});
