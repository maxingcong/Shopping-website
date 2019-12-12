require(["base", "tools", "product/detail_tpl", "product/params_word", "product/config/word"], function ($, T, ProductDetail, ProductParamsWord, CFG_PARAMS){
    T.Loader(function() {
        ProductDetail({
            data: [200525, 200526, 200527, 200528, 200529, 200530, 200531, 200532, 200533, 200534, 200535],
            ProductParams: ProductParamsWord,
            getOptions: function(data){debugger
                var cfgParams = CFG_PARAMS[data.productId]||{};
                var options = {
                    productId: data.productId,
                    params: data.params, //属性
                    baseInfoName: data.baseInfoName,
                    paramIcons: data.paramIcons || {}, //属性图标
                    paramStyles: data.paramStyles || {}, //属性样式
                    paramImages: data.paramImages || {}, //属性图
                    paramTips: data.paramTips || {}, //属性提示
                    paramDesc: data.paramDesc || {}, //属性描述
                    cfgSize: cfgParams.cfgSize, //尺寸配置
                    qtyIndex: -1,
                    customizeType: 1,
                    qtyBase: Number(data.customizeInfo.baseValue) || 1,
                    qtyIncr: Number(data.customizeInfo.increment) || 1,
                    minQtyValue: Number(data.customizeInfo.baseValue) || 1,
                    maxQtyValue: Number(data.customizeInfo.baseValue || 1) * 1000
                };
                return $.extend(options, cfgParams);
            }
        });
    });
});