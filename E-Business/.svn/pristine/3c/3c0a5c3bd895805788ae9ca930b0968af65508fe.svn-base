require(["base", "tools", "product/detail_tpl", "product/params_qty", "product/config/qty"], function ($, T, ProductDetail, ProductParamsQty, CFG_PARAMS){
    T.Loader(function() {
        ProductDetail({
            data: [200032, 200033, 200042, 200053, 200054, 200059, 200061, 200062, 200063, 200068, 200069, 200070, 200111, 200298, 200299, 200303,
                200312, 200317, 200319, 200321, 200344, 200354,
                200355, 200356, 200357, 200377, 200383, 200384, 200390, 200391, 200392, 200394, 200396, 200397, 200389, 200398,
				200401, 200402, 200403, 200404, 200405, 200406, 200411, 200412, 200413, 200414, 200415, 200416, 200418, 200425,
                200473, 200487, 200488, 200489, 200490, 200491, 200503, 200504, 200505, 200506, 200507, 200508, 200509, 200510, 200513, 200515, 200516,
				200520, 200521, 200522, 200523, 200524, 200521, 200590,
				200594, 200596, 200597, 200598, 200599, 200600, 200601, 200602, 200604, 200606, 200607, 200608, 200609, 200610, 200611, 200612,
				200614, 200615, 200616, 200619, 200622, 200623, 200625, 200626, 200636],
			data: [200638,200639,200642,200643],
            ProductParams: ProductParamsQty,
            getOptions: function(data){
                return $.extend({
                    productId: data.productId,
                    params: data.params, //属性
                    baseInfoName: data.baseInfoName,
                    paramIcons: data.paramIcons || {}, //属性图标
                    paramStyles: data.paramStyles || {}, //属性样式
                    paramImages: data.paramImages || {}, //属性图
                    paramTips: data.paramTips || {}, //属性提示
                    paramDesc: data.paramDesc || {}, //属性描述
                    customizeType: 1,
                    hasQty: 1,
                    qtyBase: Number(data.customizeInfo.baseValue) || 1,
                    qtyIncr: Number(data.customizeInfo.increment) || 1,
                    minQtyValue: Number(data.customizeInfo.baseValue) || 1,
                    maxQtyValue: Number(data.customizeInfo.baseValue || 1) * 1000
                }, CFG_PARAMS[data.productId]);
            }
        });
    });
});