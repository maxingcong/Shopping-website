var MAKER = MAKER||{};
require(["base", "tools", "design/detail", "modules/design_quotation"], function ($, T, CategoryDetail, Quotation) {
    var pdtDetail = CategoryDetail(), quotation = null;
    var Detail = T.Module({
        template: "product_options",
        data: {
            productId: "", //定制产品ID
            quotationId: "", //询价单ID
            product: {} //产品信息
        },
        $cont: $("#template_product_options_view"),
        status: [""], //[询价单信息]
        init: function(){
            var _this = this;
            var categoryId = MAKER.data[MAKER.index];
            if(categoryId){
                pdtDetail.data.categoryId = categoryId;
            }
            pdtDetail.on("render", function(idx, product){
                _this.pdtRender(idx, product);//产品详情渲染
            });
            pdtDetail.load();//加载产品

            //询价单
            quotation = Quotation({
                productId: T.REQUEST.pid||"",
                quotationId: T.REQUEST.o||""
            });
            quotation.on("loaded", function(data, params){debugger
                _this.loaded(data, params, 0);//询价单信息
            });
            quotation.load();//加载询价单
        },
        render: function(data){debugger
            var _this = this;
            T.Template("product_options", data, true);
            quotation.render($("#form_detail"), "quotation_form", "quotation");
        },
        pdtRender: function(idx, product){
            var _this = this;
            _this.data.productId = product.designProductId;
            T.Template("product_desc", product, true);
        }
    });
    MAKER.maker = function() {
        new Detail();
    };
    MAKER.showLinks = function() {
        T.ShowLinks();
    };
    T.Loader(function () {
        MAKER.data = [130]; //categoryId
        MAKER.maker();
    });
});