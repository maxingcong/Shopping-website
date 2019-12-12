require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            attrs: {
                "二折页": {
                    "类型": ["二折页", "三折页", "四折页"],
                    "折法": ["对折"],
                    "折后尺寸": ["140mm*105mm", "210mm*95mm", "210mm*140mm", "285mm*140mm", "285mm*210mm", "其他"]
                },
                "三折页": {
                    "类型": ["二折页", "三折页", "四折页"],
                    "折法": ["风琴折", "荷包折"],
                    "折后尺寸": ["210mm*95mm", "210mm*140mm", "285mm*140mm", "285mm*210mm", "其他"]
                },
                "四折页": {
                    "类型": ["二折页", "三折页", "四折页"],
                    "折法": ["风琴折", "关门再对折"],
                    "折后尺寸": ["210mm*95mm", "210mm*140mm", "其他"]
                }
            },
            init: function(){debugger
                var _this = this;
                var type = T.getRequest()['param'];
                type = T.Array.indexOf(_this.attrs['二折页']['类型'], type)>-1 ? type : '二折页';//二折页、三折页、四折页
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){
                    //请填写需要展示的内容
                    if(forms["展示内容"]!==""){
                        param["展示内容"] = forms["展示内容"];
                    }/*else{
                        T.msg("请填写需要展示的内容");
                        return false;
                    }*/
                })
                .on("render.before", function($el, forms){debugger
                    var obj = _this.attrs[type];
                    var def = demandMain.data.paramsInfo["类型"]||type;
                    if (demandMain.data.isUpdate) {//更新
                        obj["类型"] = [def];
                    }else{
                        demandMain.data.demand.paramsInfo = {};
                        demandMain.data.demand.paramsInfo["类型"] = def;
                    }
                    demandMain.data.options.values = obj; //属性值集合
                })
                .on("click.attr", function($el, e){debugger
                    var value = $el.data("value");
                    var data = _this.attrs[value];
                    if(data){
                        demandMain.data.productParam = value;
                        demandMain.data.options.values = data; //属性值集合
                        $("#options_attrs").replaceWith(T.Compiler.template("demand_attrs", demandMain.data));
                        demandMain.getPrice();
                    }
                });
                demandMain.init({
                    custom: [],
                    namesOrder: [],
                    placeholders: {
                        "展示内容": "请填写需要展示的内容"
                    }
                });
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});