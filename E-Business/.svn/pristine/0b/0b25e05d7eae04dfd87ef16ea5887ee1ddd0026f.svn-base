define("product/config", ["base", "tools"], function($, T){
    "use strict";
    return {
        size: {
            200106: {
                name: "尺寸",
                attr: "拼接",
                unit: "m", //尺寸单位
                join: "*", //尺寸间的分隔符
                width: {
                    name: "长边", //尺寸名
                    unit: "米", //尺寸单位
                    value: 1, //默认值
                    min: 0.1,
                    max: 5
                },
                height: {
                    name: "短边", //尺寸名
                    unit: "米", //尺寸单位
                    value: 1, //默认值
                    min: 0.1,
                    max: 1.5,
                    attr: "拼接",
                    "接受拼接": {
                        name: "短边", //尺寸名
                        unit: "米", //尺寸单位
                        min: 0.1,
                        max: 5
                    }
                }
            }
        }
    };
});