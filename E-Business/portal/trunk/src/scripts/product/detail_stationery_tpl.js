require(["base", "tools", "product/detail_tpl", "product/params_qty"], function ($, T, ProductDetail, ProductParamsQty){
    T.Loader(function() {
        ProductDetail({
            data: [200111, 200112, 200114, 200117, 200118, 200119, 200120, 200121, 200122, 200123, 200124, 200125, 200127, 200128,
                200131, 200132, 200134, 200135, 200136, 200138, 200139, 200140, 200142, 200143, 200144, 200145, 200146, 200147,
                200148, 200149, 200150, 200151, 200153, 200154, 200156, 200157, 200159, 200160, 200162, 200163, 200164, 200165,
                200166, 200167, 200168, 200169, 200170, 200171, 200172, 200173, 200174, 200175, 200176, 200177, 200178, 200179,
                200180, 200182, 200184, 200185, 200186, 200187, 200188, 200190, 200192, 200193, 200194, 200195, 200196, 200197,
                200198, 200201, 200202, 200203, 200204, 200205, 200206, 200207, 200208, 200209, 200210, 200214, 200215, 200216,
                200217, 200218, 200219, 200222, 200223, 200224, 200225, 200226, 200227, 200228, 200229, 200230, 200231, 200232,
                200233, 200234, 200235, 200236, 200237, 200238, 200245, 200246, 200248, 200250, 200251, 200252, 200253, 200254,
                200255, 200256, 200257, 200258, 200259, 200260, 200261, 200262, 200263, 200264, 200265, 200266, 200267, 200268,
                200269, 200270, 200271, 200272, 200273, 200278, 200280, 200282, 200283, 200291, 200292, 200293, 200294, 200295,
                200296, 200546],
			//data: [200546],
            ProductParams: ProductParamsQty,
            getOptions: function(data){
                return {
                    productId: data.productId,
                    params: data.params, //属性
                    baseInfoName: data.baseInfoName,
                    paramIcons: data.paramIcons || {}, //属性图标
                    paramStyles: data.paramStyles || {}, //属性样式
                    paramImages: data.paramImages || {}, //属性图
                    paramTips: data.paramTips || {}, //属性提示
                    paramDesc: data.paramDesc || {}, //属性描述
                    qtyIndex: -1,
                    customizeType: 1,
                    qtyBase: Number(data.customizeInfo.baseValue) || 1,
                    qtyIncr: Number(data.customizeInfo.increment) || 1,
                    minQtyValue: Number(data.customizeInfo.baseValue) || 1,
                    maxQtyValue: Number(data.customizeInfo.baseValue || 1) * 1000
                };
            }
        });
    });
});