define("product/config/qty", ["base", "tools"], function($, T){
    "use strict";
    //自定义数量类产品配置
    var qtyListToAlbum1 = [8, 12, 16, 20, 24, 28, 32, 36, 40, 44],
        qtyListToAlbum2 = [48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120],
        imgListToAlbum = {};
    for(var data = qtyListToAlbum1.concat(qtyListToAlbum2), key, i=0; key=data[i]; i++){
        imgListToAlbum[key] = T.DOMAIN.RESOURCES + "products/20006801.jpg";
    }
    return {
        200032: {
            showMode: 1,
            qtyIndex: -1,
            qtyFlag: "万",
            qtyFlagValue: 10000,
            avgUnit: "元/张",
            paramTips: {
                "数量": "印刷1万张以上可获得200元设计券及40元分发券"
            }
        },
        200033: {
            showMode: 1,
            qtyIndex: -1,
            qtyFlag: "万",
            qtyFlagValue: 10000,
            avgUnit: "元/张",
            paramTips: {
                "数量": "印刷2000张以上可获得200元设计券及40元分发券"
            }
        },
        200042: {
            qtyIndex: -1,
            avgUnit: "元/张"
        },
        200053: {
            showMode: 1,
            namesOrder: ["材质类型", "形状", "成品尺寸", "数量", "覆膜"],
            paramStyles: {
                "形状": "p-icons"
            },
            paramIcons: {
                "方形": "p-icon icon-1",
                "圆形": "p-icon icon-2",
                "圆角方形": "p-icon icon-3",
                "椭圆形": "p-icon icon-4",
                "自定义": "p-icon icon-5"
            },
            qtyFlag: "万",
            qtyFlagValue: 10000,
            avgUnit: "元/张"
        },
        200054: {
            customMade: 1, //定制模式
            baseInfoName: "材质类型_数量_折后尺寸-折页类型_折页方式",
            namesOrder: ["折页类型", "折页方式", "折后尺寸", "材质类型", "数量"],
            attrs: {//属性值
                "材质类型": ["157g铜版纸不覆膜", "300g铜版纸覆哑膜"],
                "数量": [500, 1000, 2000, 3000, 5000, 10000],
                "折后尺寸": ["210mm*95mm","A5（210mm*140mm）","A4（285mm*210mm）"],
                "折页类型": ["二折页", "三折页", "四折页"],
                "折页方式": ["对折（2折）", "荷包折（3折）", "风琴折（3折）", "风琴折（4折）"]
            },
            paramDisable: { //关联禁用属性
                "折页类型": {
                    "二折页": ["荷包折（3折）", "风琴折（3折）", "风琴折（4折）", "210mm*95mm", "157g铜版纸不覆膜"],
                    "三折页": ["对折（2折）", "风琴折（4折）", "A4（285mm*210mm）", "300g铜版纸覆哑膜"],
                    "四折页": ["对折（2折）", "荷包折（3折）", "风琴折（3折）", "A4（285mm*210mm）", "300g铜版纸覆哑膜"]
                }
            },
            paramStyles: {
                "折页方式": "p-icons"
            },
            paramIcons: {
                "对折（2折）": "p-icon icon-6",
                "荷包折（3折）": "p-icon icon-7",
                "风琴折（3折）": "p-icon icon-8",
                "风琴折（4折）": "p-icon icon-9"
            },
            qtyFlag: "万",
            qtyFlagValue: 10000,
            avgUnit: "元/张"
        },
        200059: {
            namesOrder: ["形状", "成品尺寸", "覆膜", "数量"],
            paramStyles: {
                "形状": "p-icons"
            },
            paramIcons: {
                "自定义": "p-icon icon-5"
            },
            paramDesc: {
                "形状": "您可在A4范围内自定义想要的不干胶形状及数量，每个图形外围请留2mm的出血，若需云印帮您设计，设计费按款计价"
            },
            avgUnit: "元/张"
        },
        200061: {
            mutexCfg: {
                "材质类型": {
                    "157g铜版纸": {
                        "工艺": ["四色印刷"]
                    },
                    "120g红色染色纸": {
                        "工艺": ["烫金"]
                    }
                }
            },
            qtyFlag: "万",
            qtyFlagValue: 10000,
            avgUnit: "元/个"
        },
        200062: {
            qtyFlag: "万",
            qtyFlagValue: 10000,
            avgUnit: "元/本"
        },
        200063: {
            avgUnit: "元/本",
            qtyIndex: -1
        },
        200068: {
            customMade: 1, //定制模式
            params: "",
            paramImages: imgListToAlbum,
            baseInfoName: "纸张和装订_数量_成品尺寸-页数/面数",
            namesOrder: ["成品尺寸", "数量", "纸张和装订", "页数/面数"],
            attrs: {//属性值
                "纸张和装订": ["骑马钉，封面157g铜版纸不覆膜，内页157g铜版纸", "骑马钉，封面200g铜版纸覆哑膜，内页157g铜版纸", "骑马钉，封面300g铜版纸覆哑膜，内页200g铜版纸", "无线胶装，封面200g铜版纸覆哑膜，内页157g铜版纸"],
                "数量": [20, 50, 100, 200, 500, 1000, 2000, 3000, 4000, 5000, 10000],
                "成品尺寸": ["A4（285mm*210mm）", "A5（210mm*140mm）"],
                "页数/面数": []
            },
            mutexCfg: {
                "纸张和装订": {
                    "骑马钉，封面157g铜版纸不覆膜，内页157g铜版纸": {
                        "页数/面数": qtyListToAlbum1
                    },
                    "骑马钉，封面200g铜版纸覆哑膜，内页157g铜版纸": {
                        "页数/面数": qtyListToAlbum1
                    },
                    "骑马钉，封面300g铜版纸覆哑膜，内页200g铜版纸": {
                        "页数/面数": qtyListToAlbum1
                    },
                    "无线胶装，封面200g铜版纸覆哑膜，内页157g铜版纸": {
                        "页数/面数": qtyListToAlbum2
                    }
                }
            },
            qtyBase: 10000,
            qtyIncr: 10000,
            minQtyValue: 10000,
            maxQtyValue: 10000 * 1000,
            qtyFlag: "万",
            qtyFlagValue: 10000,
            avgUnit: "元/本"
        },
        200069: {
            qtyFlag: "万",
            qtyFlagValue: 10000,
            avgUnit: "元/个"
        },
        200070: {
            customMade: 1, //定制模式
            params: "",
            baseInfoName: "材质类型_数量_成品尺寸-打流水号_打针孔_流水号工艺",
            namesOrder: ["材质类型","数量","成品尺寸","打流水号","流水号工艺","打针孔"],
            attrs: {//属性值
                "材质类型": ["300g铜版纸不覆膜", "300g铜版纸覆哑膜"],
                "数量": [100, 200, 500, 1000, 2000, 5000, 10000],
                "成品尺寸": ["180mm*54mm"],
                "打流水号": ["不打流水号", "单个流水号", "两个流水号"],
                "流水号工艺": [],
                "打针孔": ["不打针孔", "打针孔"]
            },
            mutexCfg: {
                "打流水号": {
                    "不打流水号": {
                        "流水号工艺": []
                    },
                    "单个流水号": {
                        "流水号工艺": ["烫金", "烫银"]
                    },
                    "两个流水号": {
                        "流水号工艺": ["烫金", "烫银"]
                    }
                }
            },
            qtyBase: 10000,
            qtyIncr: 10000,
            minQtyValue: 10000,
            maxQtyValue: 10000 * 1000,
            qtyFlag: "万",
            qtyFlagValue: 10000,
            avgUnit: "元/张"
        },
        200298: {
            mutexCfg: {
                "材质类型": {
                    "O柄": {
                        "扇柄颜色": ["蓝色"]
                    }
                },
                "成品尺寸": {
                    "17cm*17cm": {
                        "产品类型": ["升级款"]
                    }
                }
            },
            qtyFlag: "万",
            qtyFlagValue: 10000,
            avgUnit: "元/件"
        },
        200299: {
            avgUnit: "元/本",
            qtyIndex: -1
        },
        200303: {
            avgUnit: "元/张",
            qtyIndex: -1
        },
        200312: {
            qtyValue: 20,
            minQtyValue: 20,
            qtyIndex: -1
        },
        200317: {
            qtyFlag: "万",
            qtyFlagValue: 10000,
            avgUnit: "元/件"
        },
        200319: {
            qtyFlag: "万",
            qtyFlagValue: 10000,
            avgUnit: "元/张"
        },
        200321: {
            qtyFlag: "万",
            qtyFlagValue: 10000,
            avgUnit: "元/个"
        },
        200354: {
            qtyFlag: "",
            minQtyValue: 100,
            maxQtyValue: 599,
            qtyFlagValue: 1,
            qtyValue: 100,
            qtyIndex: -1,
            avgUnit: "元/张"
        },
        200355: {
            qtyFlag: "",
            minQtyValue: 100,
            maxQtyValue: 599,
            qtyFlagValue: 1,
            qtyValue: 100,
            qtyIndex: -1,
            avgUnit: "元/张"
        },
        200356: {
            qtyFlag: "",
            minQtyValue: 100,
            maxQtyValue: 599,
            qtyFlagValue: 1,
            qtyValue: 100,
            qtyIndex: -1,
            avgUnit: "元/张"
        },
        200357: {
            qtyFlag: "",
            minQtyValue: 100,
            maxQtyValue: 599,
            qtyFlagValue: 1,
            qtyValue: 100,
            qtyIndex: -1,
            avgUnit: "元/张"
        },
        200377: {
            qtyFlag: "",
            minQtyValue: 20,
            maxQtyValue: 10000,
            qtyFlagValue: 1,
            qtyValue: 20,
            qtyIndex: -1,
            avgUnit: "元/张"
        },
        200415: {
            qtyBase: 1000,
            qtyIncr: 1000,
            minQtyValue: 1000,
            maxQtyValue: 999000,
            qtyFlagValue: 1
        },
        200425: {
            qtyValue: 20
        },
        200473: {
            qtyIndex: -1
        },
        200590: {
            qtyIndex: -1
        },
        200614: {
            maxQtyValue: 999000,
            qtyFlagValue: 1
        },
        200615: {
            maxQtyValue: 999000,
            qtyFlagValue: 1
        },
        200616: {
            maxQtyValue: 999000,
            qtyFlagValue: 1
        }
    };
});