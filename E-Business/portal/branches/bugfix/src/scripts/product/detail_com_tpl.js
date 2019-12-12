require(["base", "tools", "product/detail_tpl", "product/params_com", "product/config/com"], function ($, T, ProductDetail, ProductParamsQty, CFG_PARAMS){
    T.Loader(function() {
        ProductDetail({
            data: [51, 52, 53, 54, 83, 84, 85, 86, 87, 101, 102, 103, 104, 106, 108, 109, 110, 113, 115, 117, 120, 130, 144, 145, 146, 147, 148,
                149, 150, 151, 154, 155, 156, 200308, 200309, 200313, 200322, 200327, 200348, 200349, 200350, 200351, 200352, 200353, 200359,
                200360, 200362, 200362, 200363, 200364, 200365, 200366, 200367, 200368, 200369, 200370, 200371, 200372, 200373, 200375,
                200381, 200382, 200387, 200388, 200399, 200400, 200407, 200408, 200409, 200410, 200415, 200451, 200476,
				200477, 200478, 200479, 200480, 200481, 200482, 200483, 200484, 200485, 200486, 200517, 200518, 200519, 200549, 200557, 200561,
				200570, 200571, 200572, 200579, 200580, 200595, 200603, 200605
            ],
            //data: [200549],
            ProductParams: ProductParamsQty,
            getOptions: function(data){
                if(data.productId===200313) { //创意折扇特殊处理
                    data.pattr = data.pattr||"创意折扇_500_140mm*70mm";
                }
                return $.extend({
                    productId: data.productId,
                    hasQty: 0, //是否可自定义数量
                    hasCounter: 1, //支持款数
                    params: data.params, //属性
                    baseInfoName: data.baseInfoName,
                    paramIcons: data.paramIcons || {}, //属性图标
                    paramStyles: data.paramStyles || {}, //属性样式
                    paramImages: data.paramImages || {}, //属性图
                    paramTips: data.paramTips || {}, //属性提示
                    paramDesc: data.paramDesc || {}, //属性描述
                    customizeType: 1,
                    qtyBase: Number(data.customizeInfo.baseValue) || 1,
                    qtyIncr: Number(data.customizeInfo.increment) || 1,
                    minQtyValue: Number(data.customizeInfo.baseValue) || 1,
                    maxQtyValue: Number(data.customizeInfo.baseValue || 1) * 1000
                }, CFG_PARAMS[data.productId]);
            }
        });
    });
});