var MAKER = MAKER||{};
require(["base", "tools", "design/detail", "design/params"], function ($, T, CategoryDetail, ProductParams) {
    var pdtDetail = CategoryDetail(),
        pdtParams = ProductParams(),
        Detail = {
            data: {
                generalState: 0 //是否加急
            },
            $cont: $("#wrapper"),
            init: function(categoryId){debugger
                var _this = this;
                if(categoryId){
                    pdtDetail.data.categoryId = categoryId;
                }
                pdtDetail.on("render", function(idx, product){
                    //渲染
                    _this.render(idx, product);
                });
                pdtParams.on("click.attr", function(atr, val, e){
                    var opts = _this.options;
                    //设置属性图
                    pdtDetail.switcherImage(opts.paramImages[val]);
                });
                pdtDetail.load();
            },
            render: function(idx, product){
                var _this = this;
                product = $.extend(true, product, pdtParams.cfg[product.designProductId]);
                _this.options = product;
                _this.data.categoryId = product.designCategoryId;
                _this.data.productId = product.designProductId;
                _this.data.generalState = 0;
                T.Template("product_options", product, true);
                T.Template("product_desc", product, true);
                pdtParams.init(product);
                pdtParams.setCounter(_this.$cont);
            }
        };
    MAKER.maker = function() {
        Detail.init(MAKER.data[MAKER.index]);
    };
    MAKER.showLinks = function() {
        T.ShowLinks();
    };
    T.Loader(function(){
        var categoryIds = [];
        T.GET({
            action: "in_product_new/web_design/web_design_category_query",
            success: function(data){
                T.Each(data.categoryList, function (i, item) {
                    T.Each(item.designCategoryList, function (k, category) {
                        if(category.categoryId && category.categoryId!=130 && category.categoryId!=131){
                            categoryIds.push(category.categoryId);
                        }
                    });
                });
                MAKER.data = categoryIds;
                MAKER.maker();
            }
        });
    });
});