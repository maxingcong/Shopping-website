/**
 * @fileOverview 折页自动化报价
 */
define("product/params_201", ["base", "tools", "product/params"], function($, T, ProductParams){
    "use strict";
    function ProductParamsQty(){
        var _this = this;
        ProductParams.call(_this);
        _this.customSize = ".custom-size";
        _this.customSizeDone = ".custom-size.done:visible";
        //验证属性值
        _this.analy.on("render", function(opts){
            var parts = opts.attr["成品尺寸"].split("*");
            opts.customSize["成品尺寸"] = {
                x: parseInt(parts[0], 10),
                y: parseInt(parts[1], 10)
            };
        });
        //验证属性默认值
        _this.analy.on("valid.内文P数", function(opts, name, value){debugger
            opts.attr[name] = Math.ceil(value/4) * 4;
        });
        /**
         * 点击属性值
         * @param {String} atr 属性名
         * @param {String} val 属性值
         */
        _this.clickAttrValue = function(atr, val, e){debugger
            var $this = $(e.target).closest(".val"),
                opts = _this.options;
            if(opts && atr && val){
                if(!$(_this.customSize, $this).length){
                    if(atr=="成品尺寸"){
                        var parts = val.split("*");
                        opts.customSize["成品尺寸"] = {
                            x: parseInt(parts[0], 10),
                            y: parseInt(parts[1], 10)
                        };
                    }
                    //设置属性
                    opts.attr[atr] = val;
                    if(atr==opts.qtyName){
                        opts.qtyValue = parseInt(val, 10) || "";
                    }
                    if(atr==opts.qtyName || atr=="内文P数"){
						_this.setCounterValue($this.closest(".vals "), 0);
                    }
                    if(atr=="成品尺寸" || atr=="封面UV" || atr=="封面烫金" || atr=="封面烫银" || atr=="封面击凸"){
                        opts.custom[atr] = val;
                    }
                    _this.analy.analysis();
                    _this.changeAttrValues("封面克重");
                    _this.changeAttrValues("内文克重");
                    _this.trigger("click.attr", atr, val, e);
                }else if($(_this.customSize, $this).hasClass("done")){ //如果当前项是自定义项，且之前确认过
                    $(_this.customSize, $this).removeClass("done");
                    $(".handle", $this).trigger("click.custom-size");
                }
                $this.addClass("sel").siblings(".val").removeClass("sel");
            }
        };
    }
    ProductParamsQty.prototype = {
        /**
         * 输入框发生改变
         * @param $this
         * @param e
         */
        changeValue: function($this, e){debugger
            var _this = this,
                $size = $this.closest(_this.customSize),
                $input = $("input[name]", $size),
                name = $size.closest(".vals").data("name"),
                valNum = 0;
            $input.each(function(i, el){
                var $input = $(el);
                var dValue = $input.data("value"), //上次的值
                    value = T.toDBC($input.val()); //当前值
                if (dValue == value && dValue!=null) {
                    valNum++;
                }
            });
            if ($input.length==valNum && valNum>0) {
                $size.addClass("done");
            } else {
                if(name=="成品尺寸"){ //如果成品尺寸发生改变，则其他自定义输入都要重新确认
                    $(_this.customSize, _this.$cont).removeClass("done");
                }else{
                    $size.removeClass("done");
                }
            }
        },
        /**
         * 输入框发生改变
         * @param $size
         * @param cfg
         * @returns {string}
         */
        validValue: function($size, cfg){debugger
            var _this = this,
                opts = _this.options,
                $inputs = $("input[name]", $size),
                $x = $("input[name='x']", $size),
                $y = $("input[name='y']", $size),
                num = 2, //折数
                x0 = $x.val(),
                y0 = $y.val(),
                /*x = parseFloat(T.toDBC(x0)),
                y = parseFloat(T.toDBC(y0)),*/
                x = parseInt(T.toDBC(x0)),
                y = parseInt(T.toDBC(y0)),
                vals = [];
            if(cfg.name!="成品尺寸"){
                cfg.y *= num;
                num = 1;
            }
            var x1 = Math.max(x, y),
                y1 = Math.min(x, y) * num,
                maxLimit = Math.max(cfg.x, cfg.y),
                minLimit = Math.min(cfg.x, cfg.y),
				maxValue = Math.max(x1, y1),
                minValue = Math.min(x1, y1);
            if(cfg.name=="成品尺寸"){
                if(maxValue<=maxLimit && minValue<=minLimit && minValue>=cfg.minLimit && maxValue>=cfg.maxLimit){
                    vals = [Math.max(x, y) + cfg.unit, Math.min(x, y) + cfg.unit];
                    if(x0!=x){
                        $x.val(Math.max(x, y));
                    }
                    if(y0!=y){
                        $y.val(Math.min(x, y));
                    }
                    opts.customSize[cfg.name] = {
                        x: Math.max(x, y),
                        y: Math.min(x, y)
                    };
                }else if(minValue<cfg.minLimit || maxValue<cfg.maxLimit){
                    T.msg("展开尺寸不能小于" + cfg.maxLimit + cfg.unit + cfg.joint + cfg.minLimit + cfg.unit);
                }else if(maxValue>maxLimit || minValue>minLimit){
                    T.msg("展开尺寸不能超过" + cfg.height + cfg.unit + cfg.joint + cfg.width + cfg.unit);
                }else{
                    T.msg("请填写" + cfg.name);
                }
            }else{
                if(maxValue<=maxLimit && minValue<=minLimit && minValue>=cfg.min && maxValue>=cfg.min){
                    vals = [Math.max(x, y) + cfg.unit, Math.min(x, y) + cfg.unit];
                    if(x0!=x){
                        $x.val(x);
                    }
                    if(y0!=y){
                        $y.val(y);
                    }
                }else if(minValue<cfg.min || maxValue<cfg.min){
                    T.msg(cfg.name + "不能小于" + cfg.min + cfg.unit + cfg.joint + cfg.min + cfg.unit);
                }else if(maxValue>maxLimit || minValue>minLimit){
                    T.msg(cfg.name + "不能超过" + cfg.x + cfg.unit + cfg.joint + cfg.y + cfg.unit);
                }else{
                    T.msg("请填写" + cfg.name);
                }
            }
            //输入框全部有值，则拉取价格
            $size.removeClass("done");
            if(vals.length>0 && vals.length==$inputs.length){
                $size.addClass("done");
                return vals.join(cfg.joint);
            }
        },
        /**
         * 绑定事件
         */
        events: function() {
            var _this = this,
                opts = _this.options,
                cfgSize = opts.cfgSize || {};
            _this.$cont.off("click.attr").on("click.attr", ".attrs .vals .val", function(e){debugger //点击属性值
                var $this = $(e.target),
                    $attr = $this.closest(".attr"),
                    $size = $(_this.customSize, $this),
                    sameAttr = $(_this.customSize + ":visible:not(.done)", $attr).length; //否是为当前属性的自定义属性未确认
                if ($this.hasClass("val") && !$this.hasClass("dis") && (sameAttr || _this.hasOk(true))) {
                    $(_this.customSize, $attr).hide();
                    $size.show();
                    var $vals = $this.closest(".vals"),
                        atr = $.trim($vals.data("name")||""),
                        val = $.trim($this.data("value")||$this.text()||"");
                    _this.clickAttrValue(atr, val, e);
                }
            }).on("click.custom-size", _this.customSize, function(e) { //点击
                e.preventDefault();
            }).on("click.custom-size", _this.customSize + " .handle", function(e) { //确认事件
                var $size = $(this).closest(_this.customSize),
                    attr = $size.closest(".vals").data("name");
                if(attr && !$size.hasClass("done")){
                    cfgSize.attr = attr;
                    if(attr=="封面UV" || attr=="封面烫金" || attr=="封面烫银" || attr=="封面击凸"){
                        cfgSize.name = attr + "面积";
                        cfgSize.x = parseFloat(opts.customSize["成品尺寸"].x);
                        cfgSize.y = parseFloat(opts.customSize["成品尺寸"].y);
                    }else{
                        cfgSize.x = cfgSize.width;
                        cfgSize.y = cfgSize.height;
                        cfgSize.name = "成品尺寸";
                    }
                    var value = _this.validValue($size, cfgSize);
                    if(value){
                        opts.custom[attr] = value;
                        _this.trigger("change.size", attr, value);
                    }
                }
            }).on(T.EVENTS.input, _this.customSize + " input", function(e){
                _this.changeValue($(this), e);
            }).on("keypress.number", _this.customSize + " input", function(e){ //键盘按下
                var $input = $(this);
                var keyCode = e.keyCode || e.which || e.charCode;
                if (keyCode == 13) {
                    $input.siblings(_this.customSize + " .handle").click();
                    return false;
                } else if ((keyCode < 48 || keyCode > 57) && keyCode != 8 && keyCode != 46 && keyCode != 37 && keyCode != 38 && keyCode != 39 && keyCode != 40){
                    return false;
                }
                _this.changeValue($input, e);
            }).on("keyup.number afterpaste.number", _this.customSize + " input", function (e) { //粘贴时过滤掉非数字字符
                var $input = $(this);
                var keyCode = e.keyCode || e.which || e.charCode;
                if(keyCode<37 || keyCode>40){
                    $input.val(T.toDBC(String($input.val())).replace(cfgSize.reg, ""));
                    _this.changeValue($input, e);
                }
            }).on("blur.number", _this.customSize + " input", function (e) { //失焦
                var $input = $(this);
                $input.val(T.toDBC(String($input.val())).replace(cfgSize.reg, ""));
                _this.changeValue($input, e);
            });
            //自定义数量
            T.SetCounter($(".counter-qty2", _this.$cont), {
                cont: ".counter-qty2",
                min: 48,
                max: 128,
                step: 4,
                change: function($input, val, flag){debugger
                    var that = this,
                        name = $input.data("name")||"";
                    if(name && opts.attr[name]!=val){
                        val = Math.min(val, that.max);
                        val = Math.max(val, that.min);
                        val = Math.round(val / that.step) * that.step;
                        $input.closest(".counter").siblings(".val").removeClass("sel");
                        //设置属性
                        opts.attr[name] = val;
                        $input.val(val);
                        _this.trigger("change.qty", name, val);
                    }
                }
            });
            /*_this.$cont.counter({
                cont: ".counter-qty2",
                min: 48,
                max: 10000,
                step: 4,
                change: function($input, val, flag){debugger
                    var that = this,
                        name = $input.data("name")||"";
                    if(name && opts.attr[name]!=val){
                        val = Math.min(val, that.max);
                        val = Math.max(val, that.min);
                        $input.closest(".counter").siblings(".val").removeClass("sel");
                        //设置属性
                        opts.attr[name] = val;
                        $input.val(val);
                        _this.trigger("change.qty", name, val);
                    }
                }
            });*/
        }
    };
    //让具备事件功能
    T.Mediator.installTo(ProductParamsQty.prototype);
    return function(options){
        return new ProductParamsQty(options);
    };
});