/**
 * @fileOverview 折页自动化报价
 */
require(["base", "tools", "product/detail_tpl", "product/params_200450", "product/price", "product/config/200450"], function ($, T, ProductDetail, ProductParams, ProductPrice, ProductConfig){
    T.Loader(function() {
        ProductDetail({
            data: [200450],
            ProductParams: ProductParams,
            getOptions: function(data){
                return $.extend({
                    productId: data.productId,
                    params: data.params || "", //属性
                    paramIcons: data.paramIcons || {}, //属性图标
                    paramStyles: data.paramStyles || {}, //属性样式
                    paramImages: data.paramImages || {}, //属性图
                    paramTips: data.paramTips || {}, //属性提示
                    paramDesc: data.paramDesc || {}, //属性描述
                    paramType: 1, //参数类型
                    onlyOnceRender: true, //是否仅首次渲染全部属性
                    cfgSize: {
                        name: "", //属性名
                        unit: "mm", //尺寸单位
                        joint: "*", //尺寸间的链接符
                        x: {
                            min: 10, //最小值
                            max: 450
                        },
                        y: {
                            min: 10, //最小值
                            max: 320
                        },
                        z: {
                            min: 10, //最小值
                            max: 100
                        }
                    }
                }, ProductConfig(data));
            }
        });
    });
});