require(["base", "tools"], function ($, T) {
	var plist = {
		params: T.getRequest(),
		init: function (data) {
			var item = '';
			data = data || {};
			data.products = data.products || [];
			data.IECSS = T.IS.CVS ? '' : ' iecss';
			data.CFG = CFG_DB.NEW_PRO;
			T.Each(data.products, function (i, product) {
				if (product && T.Typeof(product.pImages, /String/)) {
					product.pImages = product.pImages.replace(/^,|,$/, '');
					product.pImages = product.pImages.split(',');
					if (product.pImages[0] != 'null') {
						product.productImg = product.pImages[0];
					}
					if (product.productId == '200044') {
						item = data.products.splice(i, 1);
					};
				}
			});
			item && item[0] && data.products.push(item[0]);//专门将200044移到最后
			plist.reload(data);
			//document.title = (data.categoryName||'产品列表') + ' — 云印官网|中国最大的互联网印刷和设计服务平台';
			/*plist.setSitemap([
			 {url: T.DOMAIN.WWW, name:'首页'}
			 ,{name:data.categoryName}
			 ]);*/
		},
		/*setSitemap: function(data){
		 var htmls = [];
		 T.Each(data, function(k, v){
		 if(v.url){
		 htmls.push('<li><a href="'+ v.url+'">'+ v.name+'</a></li><li><b>&gt;</b></li>');
		 }else{
		 htmls.push('<li><span>'+ v.name+'</span></li>');
		 }
		 });
		 var dom = T.DOM.byId('sitemap');
		 if(dom)dom.innerHTML = htmls.join('');
		 },*/
		reload: function (data) {
			T.Template('products', data);
			$("#template_products_view .pdesc").each(function (i, el) {
				if (el.offsetHeight > 140) {
					$(el).addClass("lh22");
					if (el.offsetHeight > 120) {
						$(el).text($(el).text().substring(0, 103) + '……');
					}
				} else if (el.offsetHeight > 110) {
					$(el).addClass("lh26");
				}
			});
			/*T.Paginbar({
			 num: 3,
			 size: 10, //data.data.size,
			 total: 50, //Math.ceil(data.data.count / data.data.size),
			 index: 3, //data.data.page,
			 paginbar: 'paginbar'
			 //,callback: plist.pagin
			 });*/
		}/*,
		 pagin: function (obj, index, size, total) {
		 T._JSONPOST(T.inherit(CFG_DS.plist.init, { page: index, size: size, total: total }), function (data) {
		 if (data.errno == 0) {
		 if (typeof data == 'object') plist.reload(data);
		 }
		 });
		 }*/
	};
	T.Loader(function () {
		var local = location.href.substring(0, location.href.indexOf('.html'));
		plist.params.cid = plist.params.cid || local.substring(local.lastIndexOf('/') + 1) || '';
		if (plist.params.cid) {
			T.GET({
				action: 'in_product_new/query_by_category', params: {category_id: plist.params.cid}, success: function (data) {
					plist.init(data);
					T.PageLoaded();
				}, failure: function (data) {
					T.alt(data.msg || '没有该类产品。', function (_o) {
						_o.remove();
						window.location = T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : '');
					}, function (_o) {
						_o.remove();
						window.location = T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : '');
					}, '返回首页');
				}
			});
		} else {
			T.alt('没有该类产品。', function (_o) {
				_o.remove();
				window.location = T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : '');
			}, function (_o) {
				_o.remove();
				window.location = T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : '');
			}, '返回首页');
		}
	});
});