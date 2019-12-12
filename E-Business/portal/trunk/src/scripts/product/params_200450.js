/**
 * @fileOverview 折页自动化报价
 */
define("product/params_200450", ["base", "tools", "product/params"], function($, T, ProductParams){
    "use strict";
    function ProductParamsQty(){
        var _this = this;
        ProductParams.call(_this);
        _this.customSize = ".custom-size";
        _this.customSizeDone = ".custom-size.done:visible";
        //验证属性值
        _this.analy.on("render", function(opts){debugger
            var parts = _this.getSize(opts.attr[_this.getSizeName()]);
            opts.customSize[_this.getSizeName()] = {
                x: parseInt(parts[0], 10),
                y: parseInt(parts[1], 10),
                z: parseInt(parts[2], 10)
            };
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
				var size = "";
                if(!$(_this.customSize, $this).length){
                    if(size || atr==_this.getSizeName()){
						//设置属性
						opts.attr[_this.getSizeName()] = size || val;
						opts.custom[_this.getSizeName()] = size || val;
                        var parts = _this.getSize(size || val);
                        opts.customSize[_this.getSizeName()] = {
                            x: parseInt(parts[0], 10),
                            y: parseInt(parts[1], 10),
                            z: parseInt(parts[2], 10)
                        };
                    }
                    //设置属性
                    opts.attr[atr] = val;
                    if(atr==opts.qtyName){
                        opts.qtyValue = parseInt(val, 10) || "";
                    }
                    if(atr=="数量"){
						_this.setCounterValue($this.closest(".vals "), 0);
                    }
                    if(atr==_this.getSizeName() || atr=="UV" || atr=="烫金" || atr=="烫银"){
                        opts.custom[atr] = val;
                    }
                    _this.analy.analysis();
                    _this.changeAttrValues("覆膜");
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
        getSize: function (size) {
            size = String(size||"");
            var x0 = size.indexOf("（"),
                x1 = size.indexOf("）");
            if(x0>0 && x1>0) {
                size = size.substring(x0+1, x1);
            }
            return size.replace(/[^0-9*]+/ig, '').split("*");
        },
        getSizeName: function () {
            var _this = this,
                opts = _this.options;
            return "成品尺寸";
        },
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
                if(name==_this.getSizeName()){ //如果折后尺寸发生改变，则其他自定义输入都要重新确认
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
                $inputs = $("input[name]", $size),
                $x = $("input[name='x']", $size),
                $y = $("input[name='y']", $size),
                $z = $("input[name='z']", $size),
                x0 = $x.val(),
                y0 = $y.val(),
                z0 = $z.val(),
                x = parseInt(T.toDBC(x0)),
                y = parseInt(T.toDBC(y0)),
                z = parseInt(T.toDBC(z0)),
                vals = [];
            if(cfg.name==_this.getSizeName()){
                if(x>cfg.x.max){
                    T.msg("高不能超过" + cfg.x.max + cfg.unit);
                }else if((y+z)>(cfg.y.max+cfg.z.max)){
                    T.msg("宽与侧面之和不能超过" + (cfg.y.max+cfg.z.max) + cfg.unit);
                }else if(x<cfg.x.min){
                    T.msg("高不能小于" + cfg.x.min + cfg.unit);
                }else if(y<cfg.y.min){
                    T.msg("宽不能小于" + cfg.y.min + cfg.unit);
                }else if(z<cfg.z.min){
                    T.msg("侧面不能小于" + cfg.z.min + cfg.unit);
                }else if((y+z)<(cfg.y.min+cfg.z.min)){
                    T.msg("宽与侧面之和高不能小于" + (cfg.y.min+cfg.z.min) + cfg.unit);
                }else if(x>=cfg.x.min && (y+z)>=(cfg.y.min+cfg.z.min) && (y+z)<=(cfg.y.max+cfg.z.max) && x<=cfg.x.max){
                    vals = ['高'+x+cfg.unit, '宽'+y+cfg.unit, '侧面'+z+cfg.unit];
                }else{
                    T.msg("请填写" + cfg.name);
                }
                //输入框全部有值，则拉取价格
                $size.removeClass("done");
                if(vals.length>0 && vals.length==$inputs.length){
                    $size.addClass("done");
                    return vals.join(cfg.joint);
                }
            }else{
                if(x<=cfg.x.max && y<=cfg.y.max && x>=cfg.x.min && y>=cfg.y.min){
                    vals = [x+cfg.unit, y+cfg.unit];
                }else if(x>cfg.x.max || y>cfg.y.max){
                    T.msg(cfg.name + "不能超过" + cfg.x.max + cfg.unit + cfg.joint + cfg.y.max + cfg.unit);
                }else if(x<cfg.x.min || y<cfg.y.min){
                    T.msg(cfg.name + "不能小于" + cfg.x.min + cfg.unit + cfg.joint + cfg.y.min + cfg.unit);
                }else{
                    T.msg("请填写" + cfg.name);
                }
                //输入框全部有值，则拉取价格
                $size.removeClass("done");
                if(vals.length>0 && vals.length==$inputs.length){
                    $size.addClass("done");
                    return vals.join(cfg.joint);
                }
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
                    var cfgSize2 =  {
                        name: "", //属性名
                        unit: "mm", //尺寸单位
                        joint: "*", //尺寸间的链接符
                        x: {
                            min: 10, //最小值
                            max: opts.customSize[_this.getSizeName()].x
                        },
                        y: {
                            min: 10, //最小值
                            max: (opts.customSize[_this.getSizeName()].y + opts.customSize[_this.getSizeName()].z) * 2
                        }
                    };
                    var value;
                    if(attr=="UV" || attr=="烫金" || attr=="烫银"){
                        cfgSize2.name = attr + "面积";
                        value = _this.validValue($size, cfgSize2);
                    }else{
                        cfgSize.name = _this.getSizeName();
                        value = _this.validValue($size, cfgSize);
                    }
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
            }).on("focus.number", _this.customSize + " input", function (e) { //得焦
                var $input = $(this);
                $input[0].select();
            }).on("blur.number", _this.customSize + " input", function (e) { //失焦
                var $input = $(this);
                $input.val(T.toDBC(String($input.val())).replace(cfgSize.reg, ""));
                _this.changeValue($input, e);
            });
        }
    };
    //让具备事件功能
    T.Mediator.installTo(ProductParamsQty.prototype);
    return function(options){
        return new ProductParamsQty(options);
    };
});