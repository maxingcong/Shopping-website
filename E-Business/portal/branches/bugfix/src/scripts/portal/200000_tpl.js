require(["base", "tools", "modules/quotation", "location"], function ($, T, Quotation, PCD) {
    var quotation = null;
    var ProductDetail = T.Module({
        template: "product_attrs",
        data: {
            productId: "", //定制产品ID
            quotationId: "", //询价单ID
            product: {} //产品信息
        },
        $cont: $("#template_product_attrs_view"),
        status: ["", ""], //[产品信息,询价单信息]
        init: function(options){
            var _this = this;
            _this.getProduct();
            //询价单
            quotation = Quotation({
                productId: "",
                quotationId: ""
            }, 1);
            quotation.on("loaded", function(data, params){
                _this.loaded(data, params, 1);
            });
            quotation.load();
        },
        render: function(data){
            var _this = this;
            T.Template("product_attrs", _this.data.product);
            quotation.render($("#form_detail"), "quotation_form");
        },
        /**
         * 加载完成
         */
        complete: function(){
            var _this = this;
            var dom = T.DOM.byId('data-productDesc');
            if (dom)dom.innerHTML = _this.data.product.productDesc || '';
            _this.$cont.removeClass("load");
            T.PageLoaded();
            //生成静态页
            T.GenerateStaticPage({
                domain: T.REQUEST.w, //域名
                dirname: 'product', //目录名
                pageid: _this.data.product.productId, //文件名（页面名）
                keywords: {
                    "title": _this.data.product.productName,
                    "keywords": _this.data.product.productName,
                    "description": _this.data.product.simpleDesc
                },
                callback: function(domain, path, pageid, keywords) { //生成成功回调函数
                    $("#fieldset_pdetail").removeClass("load");
                    T.ShowLinks();
                }
            });
        },
        getProduct: function(){
            var _this = this;
            T.GET({
                action: "in_product_new/query_product",
                params: {
                    product_id: 200000
                },
                success: function (data, params) {
                    if (!data.pImages) {
                        data.pImages = data.productImg;
                    }
                    if (T.Typeof(data.pImages, /String/)) {
                        data.pImages = data.pImages.split(',');
                    }
                    T.Each(data.pImages, function (k, v) {
                        if (!v || v == 'null') {
                            data.pImages[k] = k?'':data.productImg;
                        }
                    });
                    data.productImg0 = data.pImages[0];
                    _this.data.product = data;
                    _this.loaded(data, params, 0);
                },
                failure: function (data) {
                    T.alt(data.msg || '没有该商品。', function (_o) {
                        _o.remove();
                        location.replace(T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : ''));
                    }, function (_o) {
                        _o.remove();
                        location.replace(T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : ''));
                    }, '返回首页');
                }
            });
        }
    });
    T.Loader(function () {
        new ProductDetail();
    });
});