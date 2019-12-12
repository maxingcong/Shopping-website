require(["base", "tools", "design/detail", "modules/design_quotation"], function ($, T, CategoryDetail, Quotation) {
    var pdtDetail = CategoryDetail(),
        quotation = null;
    var Detail = T.Module({
        template: "product_options",
        data: {
            productId: "", //定制产品ID
            quotationId: "", //询价单ID
            product: {} //产品信息
        },
        $cont: $("#template_product_options_view"),
        status: ["", ""], //[询价单信息，产品信息]
        init: function(){
            var _this = this;
            quotation = Quotation({
                productId: T.REQUEST.pid||"",
                quotationId: T.REQUEST.o||"" //询价单id
            });
            quotation.on("loaded", function(data, params){
                _this.loaded(data, params, 0);//询价单信息
            });
            pdtDetail.on("render", function(idx, product){
                _this.status[1] = 1;
                _this.data.product = product||{};
                quotation.trigger("loaded");//询价单信息
            });
            pdtDetail.load();//加载产品
            quotation.load();//加载询价单
        },
        render: function(data){//询价单渲染
            var _this = this,
                product = _this.data.product;
            data.pImageFirst = data.pImageFirst||product.pImageFirst;//封面首图
            T.Template("product_options", data, true);
            quotation.render($("#form_detail"), "quotation_form", "quotation");
            _this.pdtRender(product);//产品详情渲染
        },
        pdtRender: function(product){
            var _this = this, id = product.designProductId;
            if (!id) {
                T.alt('该产品已下架，请选择其他设计产品。', function(_o) {
                    _o.remove();
                    window.location.replace(T.DOMAIN.DESIGN);
                }, function(_o) {
                    _o.remove();
                    window.location.replace(T.DOMAIN.DESIGN);
                }, "返回设计服务列表");
            }
            quotation.data.productId = _this.data.productId = product.designProductId;//产品id
            //quotation.data.targetId = pdtDetail.data.categoryId;//目标id
            quotation.data.categoryId = pdtDetail.data.categoryId;//分类id
            T.Template("product_desc", product, true);
        }

        
    });
    T.Loader(function () {
        new Detail();
    });
});