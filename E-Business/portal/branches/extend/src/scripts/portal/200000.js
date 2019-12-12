require(["base", "tools", "modules/quotation", "location", "widgets/zoomer"], function ($, T, Quotation, PCD,  ImageZoom) {
    var quotation = null, _ImageZoom = null;
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
                productId: T.REQUEST.pid||"",
                quotationId: T.REQUEST.o||""
            }, 1);
            quotation.on("loaded", function(data, params){
                _this.loaded(data, params, 1);
            });
            quotation.load();
        },
        render: function(data){
            var _this = this;
            T.Template("product_attrs", _this.data.product);
            quotation.render("#form_detail", "quotation_form", "quotation");
        },
        /**
         * 加载完成
         */
        complete: function(){
            var _this = this;
            //绑定QQ客服
            T.BindQQService();
            var dom = T.DOM.byId('data-productDesc');
            if (dom)dom.innerHTML = _this.data.product.productDesc || '';
            _ImageZoom = new ImageZoom({
                uuid: T.UUID(),
                trigger: T.DOM.byId('proimg'),
                pname: _this.data.product.productName || '',
                imguri: _this.data.product.productImg || ''
            });

            _this.$cont.removeClass("load");
            T.PageLoaded();
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