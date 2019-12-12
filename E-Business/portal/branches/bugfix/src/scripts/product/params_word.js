/**
 * @fileOverview 自定义面积类产品（海报/贴纸等）
 */
define("product/params_word", ["base", "tools", "product/params"], function($, T, ProductParams){
    "use strict";
    function ProductParamsSqm(){
        var _this = this;
        ProductParams.call(_this);
        _this.sizeName = "字体尺寸";
        //验证属性值
        _this.analy.on("valid." + _this.sizeName, function(opts, name, value){debugger
            _this.setSize(opts.cfgSize, value);
        });
        /**
         * 设置尺寸默认值
         * @param o
         * @param val
         */
        _this.setSize = function(o, val){
            val = parseFloat(String(val||"").replace(/[^0-9.]/g, "")) || o.value;
            o.value = Math.max(Math.min(o.max, val), o.min);
        };
        /**
         * 点击属性值
         * @param {String} atr 属性名
         * @param {String} val 属性值
         */
        _this.clickAttrValue = function(atr, val, e){debugger
            var $this = $(e.target),
                opts = _this.options,
                cfgSize = opts.cfgSize || {}; //尺寸配置
            if(opts && atr && val){
                //设置属性
                opts.attr[atr] = val;
                if(T.Array.indexOf(cfgSize.attr, atr)>=0){
                    $(_this.customSize, _this.$cont).each(function(i, el){
                        _this.validNumberInput($(el), cfgSize, atr, val);
                    });
                }else{
                    _this.trigger("click.attr", atr, val, e);
                }
                $this.addClass("sel").siblings(".val").removeClass("sel");
            }
        };
    }
    ProductParamsSqm.prototype = {
        /**
         * 渲染之前
         */
        renderBefore: function () {debugger
            var _this = this,
                opts = _this.options,
                cfgSize = opts.cfgSize || {}, //尺寸配置
                sizeZone = opts.attrs[_this.sizeName],
                sizeUnit = "",
                sizeArr = []; //x至xcm
            T.Each(sizeZone, function (i, size) {
                var vals = size.split("至");
                sizeUnit = size.replace(/^[0-9.]+至[0-9.]+/, "");
                sizeArr.push(parseFloat(vals[0]));
                sizeArr.push(parseFloat(vals[1]));
            });
            cfgSize.unit = $.trim(sizeUnit);
            var minSize = Math.min.apply(Math.min, sizeArr);
            var maxSize = Math.max.apply(Math.max, sizeArr);
            //var paramTips = {}; //属性提示
            if(cfgSize.unit=="m"){
                cfgSize.unit = "mm";
                minSize *= 100;
                maxSize *= 100;
            }else if(cfgSize.unit=="cm"){
                cfgSize.unit = "mm";
                minSize *= 10;
                maxSize *= 10;
            }
            // if(cfgSize.unit=="mm"){
            //     paramTips[_this.sizeName] = "单位：毫米";
            // }
            cfgSize.min = minSize;
            cfgSize.max = maxSize;
            cfgSize.value = cfgSize.min;
            //opts.paramTips = paramTips;
        },
        /**
         * 输入框发生改变
         * @param $this
         * @param e
         */
        changeValue: function($this, e){debugger
            var _this = this;
            var $cont = $this.closest(_this.customSize);
            var $inputs = $("input[name], select[name]", $cont);
            var valNum = 0;
            $inputs.each(function(i, el){
                var $input = $(el);
                var prefix = $input.data("prefix")||"", //前缀
                    dValue = $input.data("value"), //上次的值
                    value = T.toDBC($input.val()); //当前值
                if (dValue == (prefix + "" + value) || dValue==null) {
                    valNum++;
                }
            });
            if ($inputs.length==valNum) {
                $cont.addClass("done");
            } else {
                $cont.removeClass("done");
            }
        },
        setNumberInput: function($cont, cfg){
            var _this = this,
                opts = _this.options;
            cfg.input = cfg.input||".textbox"; //输入框
            cfg.okbtn = cfg.okbtn||".btn"; //确认按钮
            cfg.reg = cfg.reg||/[^0-9.]/g; //正则
            //限定输入框只能输入数字并绑定回车确认
            //var $cont = $(cfg.cont||".p_size", _this.$cont);
            $cont.on(T.EVENTS.input, cfg.input, function(e){
                _this.changeValue($(this), e);
            }).on("change", "select", function(e){
                _this.changeValue($(this), e);
            }).on("keypress.number", cfg.input, function(e){ //键盘按下
                var $input = $(this);debugger
                var keyCode = e.keyCode || e.which || e.charCode;//keyCode>=48 && keyCode<=57
                if (keyCode == 13) {
                    $input.siblings(cfg.okbtn).click();
                    return false;
                } else if ((keyCode < 48 || keyCode > 57) && keyCode != 8 && keyCode != 46 && keyCode != 37 && keyCode != 38 && keyCode != 39 && keyCode != 40){
                    return false;
                }
                _this.changeValue($input, e);
            }).on("keyup.number afterpaste.number", cfg.input, function (e) { //粘贴时过滤掉非数字字符
                var $input = $(this);
                var keyCode = e.keyCode || e.which || e.charCode;
                if(keyCode<37 || keyCode>40){
                    $input.val(T.toDBC(String($input.val())).replace(cfg.reg, ""));
                    _this.changeValue($input, e);
                }
            }).on("blur.number", cfg.input, function (e) { //失焦
                var $input = $(this);
                $input.val(T.toDBC(String($input.val())).replace(cfg.reg, ""));
                _this.changeValue($input, e);
            }).on("click.number", cfg.okbtn, function (e) { //确认事件
                _this.validNumberInput($cont, cfg);
            });
        },
        validNumberInput: function($cont, cfg, forAtr, forVal){debugger
            cfg.input = cfg.input||".textbox"; //输入框
            var _this = this,
                opts = _this.options,
                attr = $cont.data("name"), //输入产品的属性名
                $input = $(cfg.input, $cont),
                value = "",
                option = cfg||{},
                _val = $input.val(),
                val = parseFloat(T.toDBC(_val)); //输入的数值
            if(option.min===0 && !val){
                val = 0;
                $input.val(val);
            }
            if(option.mode==1){ //前开后开：大于等于最小值，且小于等于最大值
                if (val >= option.min && val <= option.max && attr) {
                    value = val + (cfg.unit||"");
                    $input.data("value", val);
                    if(_val!=val){
                        $input.val(val);
                    }
                } else if (val < option.min) { //小于等于最小值
                    T.msg(option.name + "最小为" + option.min + option.unit);
                } else if (val > option.max) { //大于最大值
                    T.msg(option.name + "最大为" + option.max + option.unit);
                } else { //未输入
                    T.msg("请填写" + cfg.name);
                }
            }else{ //前闭后开：大于最小值，且小于等于最大值
                if (val > option.min && val <= option.max && attr) {
                    value = val + (cfg.unit||"");
                    $input.data("value", val);
                    if(_val!=val){
                        $input.val(val);
                    }
                } else if (val <= option.min) { //小于等于最小值
                    T.msg(option.name + "必须大于" + option.min + option.unit);
                } else if (val > option.max) { //大于最大值
                    T.msg(option.name + "最大为" + option.max + option.unit);
                } else { //未输入
                    T.msg("请填写" + cfg.name);
                }
            }
            //输入框有值，则拉取价格
            $cont.removeClass("done");
            if(value){
                opts.custom[attr] = value;
                $cont.addClass("done");
                _this.trigger("change.size", attr, value, forAtr, forVal);
            }
        },
        /**
         * 绑定事件
         */
        events: function() {debugger
            var _this = this,
                opts = _this.options;
            //自定义尺寸
            $(_this.customSize, _this.$cont).each(function(i, el){
                _this.setNumberInput($(el), opts.cfgSize);
            });
        }
    };
    //让具备事件功能
    T.Mediator.installTo(ProductParamsSqm.prototype);
    return function(options){
        return new ProductParamsSqm(options);
    };
});