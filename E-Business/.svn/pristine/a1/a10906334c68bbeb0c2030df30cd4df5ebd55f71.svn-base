require(["base", "tools"], function ($, T) {
    var download = {
        init: function(){
            this.getProducts();
        },
        getProducts: function () {
            T.GET({
                action: CFG_DS.product.get_category_multi,
                params: {
                    category_ids: CFG_DB.PCFG.HOME
                },
                success: function(data){
                    data.categoryList = data.categoryList || [];
                    data.categoryList = T.Each(data.categoryList, function(i, category){
                        category.hasDownload = false;
                        T.Each(category.categorys, function(j, item){
                            item.hasDownload = false;
                            T.Each(item.products, function(k, o){
                                o.hasDownload = false;
                                if(o.templatePath){
                                    category.hasDownload = category.hasDownload || true;
                                    item.hasDownload = item.hasDownload || true;
                                    o.hasDownload = o.hasDownload || true;
                                    var templatePath = String(o.templatePath||""),
                                        idx = templatePath.lastIndexOf("."),
                                        suffix = ".rar";
                                    if(idx > 0){
                                        suffix = templatePath.substring(idx);
                                    }
                                    o.templateName = o.productName.replace(/\//g, "-") + "-空白模板" + suffix;
                                }
                            });
                        });
                    });
                    T.Template("all_category", data, true);
                    T.PageLoaded();
                }, failure: function (data) {
                }, error: function (data) {
                }
            }, function (data) {
            }, function (data) {
            });
        }
    };
    T.Loader(function(){
        download.init();
    });
});