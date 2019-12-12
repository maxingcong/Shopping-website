define("product/config/201", ["base", "tools"], function($, T){
    "use strict";
    function getParams(data){
        var names = ["成品尺寸", "数量（本）", "装订方式", "封面单双面", "封面颜色", "封面纸张", "封面克重", "封面覆膜", "封面UV", "封面烫金", "封面烫银", "封面击凸", "内文P数", "内文颜色", "内文纸张", "内文克重"],
            options = {
                customMade: 1, //定制模式
                params: "",
                baseInfoName: names.join("_"),
                attrs: {//属性值
                    "成品尺寸": ["285mm*210mm", "210mm*285mm", "210mm*140mm", "210mm*105mm"],
                    "数量（本）": [/*20, 50, 100, 200, 500, */1000/*, 2000, 3000, 4000, 5000*/],
                    "装订方式": ["骑马钉", "锁线胶装", "无线胶装"/*, "YO圈装"*/],
                    "封面单双面": ["单面", "双面"],
                    "封面颜色": ["黑白", "彩色"],
                    "封面纸张": []/*["铜版纸", "双胶纸", "哑粉纸"]*/,
                    "封面克重": []/*["100g", "157g", "200g", "250g", "300g"]*/,
                    "封面覆膜": ["不覆膜", "单面覆哑膜", "单面覆光膜"/*, "双面覆哑膜", "双面覆光膜"*/],
                    "封面UV": ["不加UV", "UV"],
                    "封面烫金": ["不烫金", "烫金"],
                    "封面烫银": ["不烫银", "烫银"],
                    "封面击凸": ["不击凸", "击凸"],
                    "内文P数": [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44],
                    "内文颜色": ["黑白", "彩色"],
                    "内文纸张": []/*["铜版纸", "双胶纸", "哑粉纸"]*/,
                    "内文克重": []/*["100g", "157g", "200g", "250g", "300g"]*/
                },
                mutexCfg: {},
                qtyName: "数量（本）",
                qtyUnit: "",
                qtyBase: 200,
                qtyIncr: 50,
                qtyFlag: "",
				qtyIndex: -1,
                qtyFlagValue: 1,
                avgUnit: "元/本",
                minQtyValue: 200,
                maxQtyValue: 100000
            };
        if(data.pagePriceMap){ //处理产品参数
            T.Each(data.pagePriceMap, function(key, obj){
                if(key=="纸张名称"){
                    var ret = {};
                    T.Each(obj, function(k, item){
                        options.attrs["封面纸张"].push(k);
                        ret[k] = {};
                        ret[k]["封面克重"] = item;
                    });
                    options.mutexCfg["封面纸张"] = ret;
                    ret = {};
                    T.Each(obj, function(k, item){
                        options.attrs["内文纸张"].push(k);
                        ret[k] = {};
                        ret[k]["内文克重"] = item;
                    });
                    options.mutexCfg["内文纸张"] = ret;
                }
            });
        }
        return options;
    }
    return getParams;
});