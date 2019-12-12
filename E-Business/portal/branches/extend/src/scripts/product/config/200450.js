define("product/config/200450", ["base", "tools"], function($, T){
    "use strict";
    function getParams(data){
        return {
            baseInfoName: data.baseInfoName+"_UV_烫金_烫银",
            attrs: {//属性值
                "UV": ["不加UV", "UV"],
                "烫金": ["不烫金", "烫金"],
                "烫银": ["不烫银", "烫银"]
            },
            qtyName: "数量",
            qtyUnit: "",
            qtyBase: 10000,
            qtyIncr: 10000,
            qtyFlag: "万",
            qtyFlagValue: 10000,
            avgUnit: "元/个",
            minQtyValue: 10000,
            maxQtyValue: 10000 * 1000
        };
    }
    return getParams;
});