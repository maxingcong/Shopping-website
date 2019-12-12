require(["base", "tools", "product/detail_tpl", "product/config/install"], function ($, T, ProductDetail, CFG_PARAMS){
    T.Loader(function() {
        ProductDetail({
            data: [/*1001, */1002, 1003],
            CFG_PARAMS: CFG_PARAMS
        });
    });
});