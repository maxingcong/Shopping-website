var _productId = window.getQueryString("id"), _modules = ["base", "tools", "modules/product"];
if(_productId){debugger
	_modules.push("product/" + _productId);
}
require(_modules, function ($, T, Product, ProductDetailCustom) {
	var pdt = null, pdc = null;
	var ProductDetail = T.Module({
		action: "",
		template: "product_detail",
		data: {},
        status: ["", ""],
		init: function(data){
			var _this = this;
			pdt = new Product({
				action: ""
			});
			pdt.setPrice = function(){};
			if(T.hasPMPID(data.categoryId)){
				data._quantityCustomAlt = "单独设置每个人的名片数量";
			}
			if(data.productId==200021){
				data._productMark = "一人印两盒仅需5.9元/盒，更划算！";
				data._productAlt = "如果印刷多人名片，每人首盒均为8元，每加1盒3.8元";
			}
			if(data.productId==200022){
				data._productMark = "首2盒26.8元，每加1盒加5.8元";
				data._productAlt = "如果印刷多人名片，每人首2盒均为26.8元";
			}
			data._address = CFG_DB.DEF_PCD;
			var pattr = "";
			pdt.analysisTemplatePath(data); //解析空白模板
			pdt.analysisImages(data); //解析产品图片
			pdt.analysisDesc(data); //解析产品描述
            data.preferntialInfo = pdt.getJson(data.preferntialInfo); //优惠信息
			if(typeof(ProductDetailCustom)=="function"){ //定制产品页
				pdc = new ProductDetailCustom(data, pattr);
			}
			var pattrs = String(pattr).split("^");
			_this.render(data); //渲染页面
            T.Template("product_desc", data);
			pdt.mutexConfig[data.productId] = data.mutexConfig||{};
			pdt.set(data, pattr); //设置产品
			if(data.productList&&data.productList.length){
				T.Each(data.productList, function(i, item){
					pdt.mutexConfig[item.productId] = item.mutexConfig||{};
					pdt.set(item, pattrs[i]||String(pattr).replace(/\^/g, "")||""); //设置产品
				});
				pdt.setCounter(data);
			}
			pdt.getPrice(data); //获取价格
            _this.findFlagRelevanceList(data);
		},
        findFlagRelevanceList: function(product){
            var _this = this;
            if (product.productId) {
                T.GET({
                    action: "in_product_new/product_relevance/find_flag_relevance_list",
                    params: {
                        product_id: product.productId
                    },
                    success: function(data, params) {
                        var productList = [],
                            designList = [];
                        //关联产品
                        T.Each(data.infoList, function(index, v){
                            v.relevanceDesc = v.relevanceDesc || '';
                            v.productName = v.productName || '';
                            v.relevanceDescEllipsis = T.GetEllipsis(v.relevanceDesc, v.productName, 36);
                        });
                        T.Each(data.infoList, function(i, product){
                            if(product.relevanceType==1){
                                productList.push(product);
                            }else if(product.relevanceType==2){
                                designList.push(product);
                            }
                        });
                        _this.data.productList = productList;
                        _this.data.designList = designList;
                        data.flagInfo = data.flagInfo||{};
                        _this.data.flagList = data.flagInfo.flagName?String(data.flagInfo.flagName.replace(/^,|,$/, "").replace(/,+/, ",")).split(","):[]; //标签信息
                        var view = T.Template("recommend_list", _this.data, true);
                        if(_this.data.productList.length==0 && _this.data.designList.length==0){
                            $(view).addClass("hide");
                        }else{
                            $(view).removeClass("hide");
                        }
                        view = T.Template("label_list", _this.data, true);
                        if(_this.data.flagList.length==0){
                            $(view).addClass("hide");
                        }else{
                            $(view).removeClass("hide");
                        }
                        T.HotSell(null, function(){
                            _this.complete(product, arguments[1]);
                        });
                    },
                    failure: function(data) {
                        T.HotSell(null, function(){
                            _this.complete(product, arguments[1]);
                        });
                    },
                    error: function(data) {
                        T.HotSell(null, function(){
                            _this.complete(product, arguments[1]);
                        });
                    }
                }, function(data) {
                    T.HotSell(null, function(){
                        _this.complete(product, arguments[1]);
                    });
                }, function(data) {
                    T.HotSell(null, function(){
                        _this.complete(product, arguments[1]);
                    });
                });
            }
        },
        complete: function(data, params){
            var _this = this;
            T.PageLoaded();
            //生成静态页
            T.GenerateStaticPage({
                domain: T.REQUEST.w, //域名
                dirname: "product", //目录名
                pageid: data.productId, //文件名（页面名）
                title: data.title||data.productName,
                keywords: {
                    "title": data.title||data.productName,
                    "keywords": data.keywords||data.productName,
                    "description": data.description||data.simpleDesc
                },
                callback: function(domain, path, pageid, keywords) { //生成成功回调函数
                    MAKER.index++;
                    MAKER.timeout();
                }
            });
        }
	});
	var productDetail = new ProductDetail();
	var MAKER = {
		index: 0,
		data: [],
		timeout: function() {
			if (MAKER.index < MAKER.data.length) {
				setTimeout(MAKER.maker, 100);
			} else {
				T.ShowLinks();
			}
		},
		maker: function() {
			var productId = MAKER.data[MAKER.index];
			T.GET({
				action: "in_product_new/query_product",
				params: {
					product_id: productId
				},
				success: function(data) {
					data.productId = data.productId||productId;
					productDetail.init(data);
				},
				failure: function(data) {
                    MAKER.index++;
                    MAKER.timeout();
					/*T.alt(data.msg || '没有该商品。', function(_o) {
						_o.remove();
						window.location = T.DOMAIN.WWW + '?' + T.INININ;
					}, function(_o) {
						_o.remove();
						window.location = T.DOMAIN.WWW + '?' + T.INININ;
					}, '返回首页');*/
				}
			}, function(data) {
                MAKER.index++;
                MAKER.timeout();
            }, function(data) {
                MAKER.index++;
                MAKER.timeout();
            });
		}
	};
	T.Loader(function() {
		var productIds = T.REQUEST.pid;
		productIds = productIds?productIds.split(","):[];
        /*MAKER.data.push(200023); //建工集团专属VIP名片
        MAKER.data.push(200060); //智联招聘专属VIP名片
        MAKER.data.push(200065); //就医160专属VIP名片*/
        if(T.REQUEST.id){
            MAKER.data = [T.REQUEST.id];
        }else if(productIds.length){
            MAKER.data = productIds;
        }else{//68
            //[3,56,57,58,59,60,61,62,63,64,65,66,67,/*83,84,85,86,87,101,102,103,104,106,108,109,110,113,115,117,120,*/126,127,128,/*130,*/131,/*144,145,146,147,148,149,150,151,154,155,156,*/200021,200022,200023,200024,/*200042,*/200060,200065,/*200069,*/200097,200098,/*200099,*/200100,200101,/*200103,*/200107/*, 200301, 200308, 200309*/];
            MAKER.data = [3,56,57,58,59,60,61,62,63,64,65,66,67,126,127,128,131,
                200021,200022,200023,200024,200060,200065,200097,200098,200100,200101,200107,200324,200325,200328,200329,200330,200331,
                200332,200333,200334,200335,200336,200337,200338,200339,200340,200341,200342,200343,200345,200347, 200374,200424, 200437,
                200452, 200354, 200474, 200475,200547,200548, 200547, 200548, 200550, 200551, 200552, 200553, 200554, 200555, 200556,
                200564, 200566, 200567, 200568, 200569, 200573, 200574, 200575, 200576, 200577, 200578, 200581, 200582, 200583, 200588, 200589,
				200591, 200633, 200635, 200642
            ];
            MAKER.data = [200642];
        }
        MAKER.maker();
        console.log("MAKER.data=", T.JSON.stringify(MAKER.data));
	});
});