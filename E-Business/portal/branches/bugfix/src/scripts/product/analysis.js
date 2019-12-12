/**
 * @fileOverview 产品属性解析
 */
define("product/analysis", ["base", "tools"], function($, T){
    "use strict";
    function ProductAnalysis() {}
    ProductAnalysis.prototype = {
        /**
         * 初始化
         * @param options
         */
        init: function(options){
            var _this = this,
                opts = options || {};
            opts.firstNames = opts.firstNames || []; //基本属性名
            opts.lastNames = opts.lastNames || []; //工艺属性名
            opts.names = opts.names || []; //属性名
            opts.namesOrder = opts.namesOrder || null; //属性名排序
            opts.attrs = opts.attrs || {}; //属性值
            opts.attr = opts.attr || {}; //选中属性值
            opts.custom = opts.custom || {}; //自定义属性值
            opts.customSize = opts.customSize || {}; ////自定义尺寸
            opts.pattr = opts.pattr || ""; //选中属性值字符串
            opts.paramType = opts.paramType || 0; //参数类型，0：xx_xx_xx-xx_xx,1：xx:xx_xx:xx_xx:xx
            opts.showMode = opts.showMode || 0; //展示方式，1：单个属性不显示
            //opts.qtyDefault = opts.qtyDefault || 0; //是否设置默认数量
            opts.qtyName = opts.qtyName || "数量"; //数量属性名
            opts.qtyValue = opts.qtyValue || ""; //数量属性值
            opts.qtyUnit = opts.qtyUnit || ""; //数量单位
            opts.qtyFlag = opts.qtyFlag || ""; //数量标记（如：以10000为计量，则标记“万”）
            opts.avgUnit = opts.avgUnit || ""; //数量平均价的单位
            opts.paramIcons = opts.paramIcons || {}; //属性图标
            opts.paramStyles = opts.paramStyles || {}; //属性样式
            opts.paramImages = opts.paramImages || {}; //属性图
            opts.paramLinks = opts.paramLinks || {}; //属性链接
            opts.paramTips = opts.paramTips || {}; //属性提示
            opts.paramDesc = opts.paramDesc || {}; //属性描述
            opts.paramDisable = opts.paramDisable || {}; //关联禁用属性
            opts.counter = opts.counter||1; //款数
            opts.hasQty = opts.hasQty>=0?opts.hasQty:1; //是否可自定义数量
            opts.qtyIndex = opts.qtyIndex; //数量排序
            opts.qtyFlagValue = opts.qtyFlagValue || 1; //数量计量基数标记
            opts.qtyDivisor = opts.qtyDivisor || opts.qtyIncr || 1; //数量因子，数量必须被因子整除
            opts.minQtyValue = opts.minQtyValue>=0 ? opts.minQtyValue : 1; //数量最小值
            opts.maxQtyValue = opts.maxQtyValue || 1000; //数量最大值
            opts.qtyBase = opts.qtyBase >=0 ? opts.qtyBase : 1; //数量基础值
            opts.qtyIncr = opts.qtyIncr || 1; //数量增量
            _this.options = opts;
            _this.analysis();
        },
        /**
         * 获得属性值
         * @param attr 属性对象
         * @returns {string} 属性值字符串
         */
        getValue: function (attr) {
            var _this = this,
                opts = _this.options;
            attr = $.extend(attr||{}, opts.custom);
            if(attr[opts.qtyName]==null){
                attr[opts.qtyName] = opts.qtyValue + opts.qtyUnit;
            }
            var result = _this.getBaseValue(attr, opts.paramType) + "-" + _this.getAttachValue(attr, opts.paramType);
            result = result.replace(/\-+$|\_+$/, "").replace(/\-+/g, "-").replace(/\_+/g, "_"); //去掉属性串多余的分隔符
            if(opts.paramType==1){
                result = result.replace(/\-/g, "_");
            }
            return result;
        },
        /**
         * 格式化输入内容，去除特殊字符
         * @param value
         * @returns {string}
         */
        formatValue: function(value){
            return (value+"").replace(/[-:_'"]+/g, "");
        },
        /**
         * 获得基础属性值
         * @param attr 属性对象
         * @param paramType 参数类型
         * @returns {String} 基础属性值字符串
         */
        getBaseValue: function (attr, paramType) {
            var _this = this,
                opts = _this.options,
                names = opts.firstNames,
                result = [];
            attr = attr||{};
            if (names && names.length) {
                for (var name = "", i = 0; name = names[i]; i++) {
                    if(paramType==1){
                        result[i] = name + ":" + _this.formatValue(attr[name] || opts.attr[name] || /*opts.attrs[name][0] ||*/ "");
                    }else{
                        result[i] = _this.formatValue(attr[name] || opts.attr[name] || /*opts.attrs[name][0] ||*/ "");
                    }
                }
            }
            return result.join("_").replace(/\_+$/, ""); //去掉属性串多余的分隔符
        },
        /**
         * 获得附加属性值
         * @param attr 属性对象
         * @param paramType 参数类型
         * @returns {String} 附加属性值字符串
         */
        getAttachValue: function(attr, paramType){
            var _this = this,
                opts = _this.options,
                names = opts.lastNames,
                result = [];
            attr = attr||{};
            if (names && names.length) {
                for (var name = "", i = 0; name = names[i]; i++) {
                    if(paramType==1){
                        result[i] = name + ":" + _this.formatValue(attr[name] || opts.attr[name] || /*opts.attrs[name][0] ||*/ "");
                    }else{
                        result[i] = _this.formatValue(attr[name] || opts.attr[name] || /*opts.attrs[name][0] ||*/ "");
                    }
                }
            }
            return result.join("_").replace(/\_+$/, ""); //去掉属性串多余的分隔符
        },
        /**
         * 设置数量字段排序
         */
        getQtyNameOrder: function(){
            var _this = this,
                opts = _this.options,
                index = opts.qtyIndex, //索引，负数为倒数索引，如-1表示倒数第一个
                names = opts.names;
            if(index!=null && names.length>Math.abs(index) && !opts.namesOrder){
                var namesOrder = [];
                for(var name, i=0; name=names[i]; i++){
                    if(index>=0){
                        if(index==i){
                            namesOrder.push(opts.qtyName);
                        }
                    }
                    if(name!=opts.qtyName){
                        namesOrder.push(name);
                    }
                    if(index<0){
                        if(names.length+index==namesOrder.length){
                            namesOrder.push(opts.qtyName);
                        }
                    }
                }
                return namesOrder;
            }
        },
        /**
         * 获取指定范围内的数量值
         * @param value
         * @returns {number}
         */
        getQtyScopeValue: function(value){
            var _this = this,
                opts = _this.options;
            var val = parseInt(value, 10) || opts.attrs[opts.qtyName][0] || opts.minQtyValue;
            if(T.Array.indexOf(opts.attrs[opts.qtyName], val+opts.qtyUnit)<0){
                //必须在指定范围内
                val = Math.min(val, opts.maxQtyValue);
                val = Math.max(val, opts.minQtyValue);
            }
            return val;
        },
        /**
         * 获取数量值
         */
        setQtyValue: function(){
            var _this = this,
                opts = _this.options,
                attrs = opts.attrs[opts.qtyName];
            if(!attrs || !attrs.length) return;
            var attr = attrs[0];
            opts.qtyUnit = String(attr).replace(/^\d+/, "") || opts.qtyUnit;
            var value = _this.getQtyScopeValue(opts.qtyValue||attr);
            if(T.Array.indexOf(attrs, value + opts.qtyUnit) < 0){
                if(value%opts.qtyDivisor!=0){
                    value = Math.round(value/opts.qtyDivisor) * opts.qtyDivisor;
                }
            }
            opts.qtyValue = _this.getQtyScopeValue(value);
        },
        /**
         * 解析产品属性
         */
        analysis: function () {
            var _this = this,
                opts = _this.options;
            _this.analysisNames();//解析参数
            if(opts.customMade==1){ //定制参数
                _this.setDefaultValue();
            }else{
                //解析基本属性值
                T.Each(opts.params, function (key, param) {
                    var vals = key.split("_");
                    //基本属性
                    for (var val = "", i = 0; val = vals[i]; i++) {
                        if (val) {
                            T.Array.add(opts.attrs[opts.names[i]], val, false);
                        }
                    }
                });
                if(opts.attrs[opts.qtyName]){
                    opts.qtyUnit = String(opts.attrs[opts.qtyName][0]||"").replace(/^\d+/, "");
                }
                _this.setDefaultValue(opts.firstNames);
                _this.analysisAttachParams();
            }
            if(opts.mutexCfg){ //互斥配置
                var recursionMutexCfg = function(mutexCfg){
                    T.Each(mutexCfg, function(key, obj){
                        T.Each(obj[opts.attr[key]], function(k, v){
                            if(T.Typeof(v)=="Array"){
                                opts.attrs[k] = v.length>0 ? v.join('-').split('-') : [];
                            }else{
                                recursionMutexCfg(obj[opts.attr[key]]);
                            }
                        });
                    });
                };
                recursionMutexCfg(opts.mutexCfg);
                _this.setDefaultValue();
            }
            if(opts.hasQty>0){
                _this.setQtyValue();
            }
            _this.analysisDisableParams();
            opts.getValue = function () {
                return opts.pattr = _this.getValue();
            };
            opts.superCallback && opts.superCallback(opts, true);
            opts.pattr = _this.getValue();
            _this.trigger("render", opts);
        },
        /**
         * 解析产品属性名
         */
        analysisNames: function () {
            var _this = this,
                opts = _this.options,
                pattr = _this.getValue() || opts.pattr;
            var baseInfoName = (opts.baseInfoName || "").replace(/\-+$|\_+$/, ""); //去掉属性串多余的分隔符
            if (baseInfoName) {
                var splitIndex = baseInfoName.indexOf("-"),
                    firstName = baseInfoName,
                    lastName = "";
                if (splitIndex > 0) {
                    firstName = baseInfoName.substring(0, splitIndex);
                    lastName = baseInfoName.substring(splitIndex + 1).replace("-", "_");
                }
                var firstNames = firstName ? firstName.split("_") : [], //基础属性名集合
                    lastNames = lastName ? lastName.split("_") : [], //附加属性名集合
                    values = pattr.replace("-", "_").split("_"), //已选择的属性值数组
                    names = firstNames.concat(lastNames), //属性名集合
                    attrs = {}, //属性值对象数组
                    attr = {};
                if(opts.paramType==1){
                    values = [];
                    var parts = T.Transfer.decodeHashString(pattr.replace("-", "_"), "_", ":");
                    for (var name = "", i = 0; name = names[i]; i++) {
                        values.push(parts[name]||"");
                    }
                }
                opts.attr = opts.attr || attr;
                opts.qtyName = "";
                //创建与属性名等长的属性值二维数组
                for (var name = "", i = 0; name = names[i]; i++) {
                    attrs[name] = [];
                    attr[name] = values[i] || opts.attr[name] || "";
                    if((name.indexOf("数量")>=0 || name=="P数") && !opts.qtyName){ //设置数量字段
                        opts.qtyName = name;
                    }
                }

                opts.firstNames = firstNames;
                opts.lastNames = lastNames;
                opts.names = names;
                opts.namesOrder = opts.namesOrder || _this.getQtyNameOrder() || names;
                if(opts.customMade!=1){ //定制参数
                    opts.attrs = T.extend(attrs, opts.attrs);
                }/*else if(opts.customMade!=1) { //定制参数
                    opts.attrs = attrs;
                }*/
                opts.attr = attr;
                opts.qtyValue = opts.qtyValue || parseInt(opts.attr[opts.qtyName], 10) || "";
            }
        },
        /**
         * 解析产品附加属性
         */
        analysisAttachParams: function () {
            var _this = this,
                opts = _this.options;
            var key = _this.getBaseValue();
            if (key && opts.params && opts.params[key]) {
                T.Each(opts.params[key], function (k, vals) {
                    var idx = T.Array.indexOf(opts.names, k);
                    if (vals && idx >= 0) {
                        T.Each(vals, function (val, flag) {
                            if (val && flag > -1) {
                                T.Array.add(opts.attrs[opts.names[idx]], val, false);
                            }
                        });
                    }
                });
            }
            _this.setDefaultValue(); //按顺序设置默认值，处理互斥即禁用项
        },
        /**
         * 解析禁用属性
         */
        analysisDisableParams: function(){
            var _this = this,
                opts = _this.options;
            opts.disKeys = {};
            T.Each(opts.attr, function(name, value){
                var obj = opts.paramDisable[name];
                if(value && obj){
                    T.Each(obj[value], function(i, key){
                        opts.disKeys[key] = 1;
                    });
                }
            });
        },
        /**
         * 设置默认属性值（值必须在可选范围内）
         * @param {Array} [names=""] 属性名集合
         */
        setDefaultValue: function (names) {
            var _this = this,
                opts = _this.options;
            names = names || opts.namesOrder;
            if (!names || !names.length)return;
            for (var name = "", i = 0; name = names[i]; i++) {
                _this.analysisDisableParams();
                if (opts.disKeys[opts.attr[name]] || opts.paramLinks[opts.attr[name]] || T.Array.indexOf(opts.attrs[name], opts.attr[name]) < 0) {
                    var value = opts.attr[name];
                    opts.attr[name] = "";
                    _this.trigger("valid." + name, opts, name, value); //验证属性默认值
                    if(!opts.attr[name]){
                        T.Each(opts.attrs[name], function(k, value){
                            if(!opts.disKeys[value] && !opts.paramLinks[value]){
                                opts.attr[name] = value;
                                if(name==opts.qtyName && !opts.hasQty){
                                    opts.qtyValue = String(value).replace(/\D+/g, "");
                                }
                                return false;
                            }
                        });
                    }
                }
            }
        }
    };
    //让具备事件功能
    T.Mediator.installTo(ProductAnalysis.prototype);
    return function(options){
        return new ProductAnalysis(options);
    };
});