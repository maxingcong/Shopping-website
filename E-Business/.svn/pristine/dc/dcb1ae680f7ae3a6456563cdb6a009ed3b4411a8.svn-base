require(["base", "tools", "product/detail_tpl", "product/params_sqm", "product/config/size", "product/config/sqm"], function ($, T, ProductDetail, ProductParamsSqm, CFG_SIZE, CFG_PARAMS){
    T.Loader(function() {
        ProductDetail({
            data: [200, 200034, 200035, 200036, 200037, 200041, 200104, 200105, 200106, 200274, 200302, 200376, 200438, 200439, 200440,
            200454, 200455, 200456, 200457, 200458, 200459, 200456, 200457, 200458, 200459, 200460, 200461, 200462, 200463, 200464, 200465,
			200466, 200467, 200468, 200469, 200470, 200541, 200542, 200543, 200544, 200545],
            //data: [200541, 200542, 200543, 200544, 200545],
            ProductParams: ProductParamsSqm,
            getOptions: function(data){
                if(data.productId==200037){ //特殊处理
                    data.baseInfoName += "_打孔工艺";
                    T.Each(data.params, function(key, param){
                        param["打孔工艺"] = {
                            "不打孔": 1,
                            "打孔": 0
                        };
                    });
                }
                var options = {
                    productId: data.productId,
                    params: data.params, //属性
                    baseInfoName: data.baseInfoName,
                    paramIcons: data.paramIcons || {}, //属性图标
                    paramStyles: data.paramStyles || {}, //属性样式
                    paramImages: data.paramImages || {}, //属性图
                    paramTips: data.paramTips || {}, //属性提示
                    paramDesc: data.paramDesc || {}, //属性描述
                    cfgSize: CFG_SIZE[data.productId], //尺寸配置
                    qtyIndex: -1,
                    customizeType: 1,
                    qtyBase: Number(data.customizeInfo.baseValue) || 1,
                    qtyIncr: Number(data.customizeInfo.increment) || 1,
                    minQtyValue: Number(data.customizeInfo.baseValue) || 1,
                    maxQtyValue: Number(data.customizeInfo.baseValue || 1) * 1000
                };
                return $.extend(options, CFG_PARAMS[data.productId]);
            }
        });
    });
});