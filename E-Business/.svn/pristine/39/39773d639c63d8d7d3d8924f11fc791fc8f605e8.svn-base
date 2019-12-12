define("product/config/100", ["base", "tools"], function($, T){
    "use strict";
    function getParams(data){
        var names = ["折页类型", "折页方式", "数量", "折后尺寸", "纸张名称", "纸张克重", "颜色", "单双面", "覆膜", "UV", "烫金", "烫银", "印刷方式"],
            size1 = ["210mm*95mm", "210mm*140mm", "285mm*210mm"],
			size2 = ["210mm*95mm", "210mm*140mm"],
			options = {
                customMade: 1, //定制模式
                params: "",
                baseInfoName: names.join("_"),
                attrs: {//属性值
                    "折页类型": ["二折页", "三折页", "四折页", "五折页", "六折页"],
                    "折页方式": ["对折", "荷包折", "风琴折", "关门折"],
                    "数量": ["500", "1000", "2000", "3000", "5000"],
                    "折后尺寸": ["210mm*95mm", "210mm*140mm", "285mm*210mm"],
                    "纸张名称": []/*["铜版纸", "双胶纸", "哑粉纸"]*/,
                    "纸张克重": []/*["100g", "157g", "200g", "250g", "300g"]*/,
                    "颜色": [/*"黑白", */"彩色"],
                    "单双面": ["单面", "双面"],
                    "覆膜": ["不覆膜", "单面覆哑膜", "单面覆光膜", "双面覆哑膜", "双面覆光膜"],
                    "UV": ["不加UV", "UV"],
                    "烫金": ["不烫金", "烫金"],
                    "烫银": ["不烫银", "烫银"],
                    "印刷方式": ["专版印刷"]/*["合版印刷", "专版印刷"]*/
                },
                mutexCfg: {
                    "折页类型": {
                        "二折页": {
                            "折页方式": ["对折"],
							"折后尺寸": size1
                        },
                        "三折页": {
                            "折页方式": ["荷包折", "风琴折"],
							"折后尺寸": size1
                        },
                        "四折页": {
                            "折页方式": ["风琴折"/*, "关门折"*/],
							"折后尺寸": size1
                        },
                        "五折页": {
                            "折页方式": ["风琴折", "卷心折"],
							"折后尺寸": size2
                        },
                        "六折页": {
                            "折页方式": ["风琴折", "卷心折"],
							"折后尺寸": size2
                        }
                    }
                },
                qtyName: "数量",
                qtyUnit: "",
                qtyBase: 500,
                qtyIncr: 500,
                qtyFlag: "",
                qtyFlagValue: 1,
                avgUnit: "元/张",
                minQtyValue: 500,
                maxQtyValue: 10000 * 100
            };debugger
        if(data.productId==200436){debugger
            names.splice(0, 4, "数量", "成品尺寸");
			names.splice(10, 1, "形状", "印刷方式");
            options = {
                customMade: 1, //定制模式
                params: "",
                baseInfoName: names.join("_"),
                attrs: {//属性值
                    "数量": ["500", "1000", "2000", "3000", "5000"],
                    "成品尺寸": ["A5(140mm*210mm)", "A4(210mm*285mm)", "A3(285mm*420mm)"],
                    "纸张名称": []/*["铜版纸", "双胶纸", "哑粉纸"]*/,
                    "纸张克重": []/*["100g", "157g", "200g", "250g", "300g"]*/,
                    "颜色": [/*"黑白", */"彩色"],
                    "单双面": ["单面", "双面"],
                    "覆膜": ["不覆膜", "单面覆哑膜", "单面覆光膜", "双面覆哑膜", "双面覆光膜"],
                    "UV": ["不加UV", "UV"],
                    "烫金": ["不烫金", "烫金"],
                    "烫银": ["不烫银", "烫银"],
                    "形状": ["方形", "异形"],
                    "印刷方式": ["专版印刷"]/*["合版印刷", "专版印刷"]*/
                },
                mutexCfg: {},
                qtyName: "数量",
                qtyUnit: "",
                qtyBase: 500,
                qtyIncr: 500,
                qtyFlag: "",
                qtyFlagValue: 1,
                avgUnit: "元/张",
                minQtyValue: 500,
                maxQtyValue: 10000 * 100
            };debugger
        }
        if(data.pagePriceMap){ //处理产品参数
            var attr1 = {"覆膜": ["不覆膜", "单面覆哑膜", "单面覆光膜", "双面覆哑膜", "双面覆光膜"]},
                attr2 = {"覆膜": ["不覆膜", "双面覆哑膜"]};
            T.Each(data.pagePriceMap, function(key, obj){
                if(key=="纸张名称"){
                    var ret = {};
                    T.Each(obj, function(k, item){
                        options.attrs[key].push(k);
                        ret[k] = {};
						ret[k]["纸张克重"] = item;
                        if(k=="铜版纸"){
							var ret2 = {};
							T.Each(item, function(i, v){
								if(v=="105g" || v=="128g" || v=="250g" || v=="350g"){
									ret2[v] = {
										"印刷方式": ["专版印刷"]
									};
								}else{
                                    if(v=="300g"){
                                        ret2[v] = {
                                            "覆膜": {
                                                "不覆膜": {
                                                    "印刷方式": ["合版印刷", "专版印刷"]
                                                },
                                                "单面覆哑膜": {
                                                    "印刷方式": ["专版印刷"]
                                                },
                                                "单面覆光膜": {
                                                    "印刷方式": ["专版印刷"]
                                                },
                                                "双面覆哑膜": {
                                                    "印刷方式": ["合版印刷", "专版印刷"]
                                                },
                                                "双面覆光膜": {
                                                    "印刷方式": ["专版印刷"]
                                                }
                                            }
                                        };
                                    }else{
                                        ret2[v] = {
                                            "印刷方式": ["合版印刷", "专版印刷"]
                                        };
                                    }
								}
							});
							ret[k]["纸张名称"] = {
								"铜版纸": {
									"纸张克重": ret2
								}
							};
                            //ret[k]["印刷方式"] = ["合版印刷", "专版印刷"];
                        }else{
                            ret[k]["印刷方式"] = ["专版印刷"];
                        }
                    });
                    options.mutexCfg[key] = ret;
                }
            });
        }
		if(data.productId==100){debugger
			var dis1 = ["单面覆哑膜", "单面覆光膜", "双面覆哑膜", "双面覆光膜"],
                dis2 = ["不覆膜"];
			options.paramDisable = {
				"纸张克重": {
					"60g": dis1,
					"70g": dis1,
					"80g": dis1,
					"100g": dis1,
					"105g": dis1,
					"120g": dis1,
					"128g": dis1,
					"200g": dis2,
					"250g": dis2,
					"300g": dis2,
					"350g": dis2
				}
			};
            var printingMethod = [];
            options.superCallback = function (opts, isAnalysis) {debugger
                if(isAnalysis){
                    printingMethod = opts.attrs['印刷方式'];
                }
                if(opts.qtyValue>5000 && printingMethod.length==2){
                    opts.attrs['印刷方式'] = printingMethod.slice(1,2);
                    opts.attr['印刷方式'] = printingMethod[1] || "";
                }
                opts.getValue();
            };
		}

		/*options.mutexCfg["纸张克重"] = {
			"60g": {
				"覆膜": ["不覆膜"]
			},
			"70g": {
				"覆膜": ["不覆膜"]
			},
			"80g": {
				"覆膜": ["不覆膜"]
			},
			"100g": {
				"覆膜": ["不覆膜"]
			},
			"105g": {
				"覆膜": ["不覆膜"]
			},
			"120g": {
				"覆膜": ["不覆膜"]
			},
			"250g": {
				"覆膜": ["单面覆哑膜", "单面覆光膜", "双面覆哑膜", "双面覆光膜"]
			},
			"300g": {
				"覆膜": ["单面覆哑膜", "单面覆光膜", "双面覆哑膜", "双面覆光膜"]
			},
			"350g": {
				"覆膜": ["单面覆哑膜", "单面覆光膜", "双面覆哑膜", "双面覆光膜"]
			}
		};*/
        return options;
    }
    return getParams;
});