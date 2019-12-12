require(["base", "tools", "widgets/navpos"], function($, T, NavPos){
	var allSort = {
		status: ['', ''],//产品，账户充值
		parducts: null,
		packages: null,
		designs: null,
        $cont: $("#template-all_category-view"),
        $nav: $("#template-floor_nav-view"),
		init: function (data) {
            var _this = this;
            _this.getProducts();
            _this.getPackage();
		},
		getProducts: function () {
            var _this = this;
			T.GET({
				action: CFG_DS.product.get_category_multi,
				params: {
					position: 'list',
					category_ids: CFG_DB.PCFG.HOME
				},
				success: function(data){
					console.log(data);
					data.categoryList = data.categoryList || [];
                    _this.status[0] = '1';
                    _this.parducts = data;
                    _this.loaded();
				}, failure: function (data) {
				}, error: function (data) {
				}
			}, function (data) {
			}, function (data) {
			});
		},
		getPackage: function () {
            var _this = this;
			T.GET({
				action: 'in_product/query_recharge_all',
                params: {
                    state: '1'
                },
                success: function (data) {
					data.rechargeList = data.rechargeList || [];
                    _this.status[1] = '1';
                    _this.packages = data;
                    _this.loaded();
				}, failure: function (data) {
				}, error: function (data) {
				}
			}, function (data) {
			}, function (data) {
			});
		},
        loaded: function (data) {
            var _this = this;
            if (_this.status.join("").length == _this.status.length) {
                //组装楼层数据
                var floorList = [];
                var floorObj = {
                    28: "展架类",
                    29: "宣传用品",
                    30: "名片",
                    33: "营销卡券",
                    35: "按需定制",
                    37: "标牌广告",
                    44: "喷绘海报",
                    50: "不干胶贴",
                    53: "手提袋",
                    56: "办公用品",
                    61: "礼品类",
                    68: "安装服务"
                };
                T.Each(_this.parducts.categoryList, function(i, category){
                    if(floorObj[category.categoryId]){
                        floorList.push({
                            floorId: category.categoryId,
                            floorName: floorObj[category.categoryId]
                        });
                    }else if(category.categoryType=='design'){
                        floorList.push({
                            floorId: "design",
                            floorName: "设计服务"
                        });
                    }
                });
                floorList.push({
                    floorId: "package",
                    floorName: "账户充值"
                });
                T.Template("floor_nav", {
                    floorList: floorList
                }, true);
                //楼层导航
                NavPos({
                    $cont: _this.$cont,
                    $nav: _this.$nav,
                    namespace: "floor",
                    navItem: ".nav-item",
                    floorItem: ".floor-item"
                });

                T.Template('all_category', _this.parducts, true);
                T.Template('all_package', _this.packages, true);
                T.PageLoaded();
            }
        }
	};
	T.Loader(function () {
        allSort.init();
	});
});