/**
 * @fileOverview 产品属性控制
 */
define("product/params", ["base", "tools", "product/analysis"], function($, T, ProductAnalysis){
    "use strict";
    function ProductParams(){
        var _this = this;
        _this.customSize = ".input";
        _this.customSizeDone = ".input.done:visible";
        _this.analy = ProductAnalysis();
        /**
         * 初始化
         * @param options
         */
        _this.init = function(options){
            options = options||{};
            _this.options = options;
            _this.$cont = $("#product_params-" + options.productId)
                .on("click.attr", ".attrs .vals .val:not(.not-allowed)", function(e){ //点击属性值
                    var $this = $(this);
                    if (!$this.hasClass("dis")) {
                        var $vals = $this.closest(".vals"),
                            atr = $.trim($vals.data("name")||""),
                            val = $.trim($this.data("value")||$this.text()||"");
                        _this.clickAttrValue(atr, val, e);
                    }
                });
            //解析渲染
            _this.analy.on("render", function(opts){
                _this.renderBefore && _this.renderBefore();
                if($("#product_params").length){
                    _this.$cont.html(T.Compiler.template("product_params", opts));
                }
                _this.trigger("rendered", opts);
                if(opts.onlyOnceRender){ //仅首次渲染全部属性
                    _this.analy.off("render");
                }
            });
            _this.analy.init(options);
            //自定义数量
            _this.$cont.counter({
                cont: ".counter-qty",
                min: options.minQtyValue / options.qtyFlagValue,
                max: options.maxQtyValue / options.qtyFlagValue,
                step: options.qtyIncr / options.qtyFlagValue,
                change: function($input, val, flag){
                    var that = this,
                        qtyValue = val * options.qtyFlagValue;
                    if(options.qtyFlagValue==1){
                        qtyValue = options.minQtyValue + Math.round((qtyValue - options.minQtyValue)/options.qtyIncr) * options.qtyIncr;
                        val = qtyValue;
                    }
                    if(options.qtyValue!=qtyValue){
                        val = Math.min(val, that.max);
                        val = Math.max(val, that.min);
                        qtyValue = val * options.qtyFlagValue;
                        var name = $input.data("name")||"";
                        $input.closest(".counter").siblings(".val").removeClass("sel");
                        $input.val(val);
                        if(name){
                            //设置属性
                            options.qtyValue = qtyValue;
                            options.superCallback && _this.analy.analysis();
                            _this.trigger("change.qty", options.qtyName, qtyValue);
                        }
                    }else{
                        $input.val(val);
                    }
                }
            });
            _this.events();
        };
        /**
         * 获取选中的属性值
         * @returns {*|String}
         */
        _this.getValue = function(attr){
            return this.analy.getValue(attr);
        };
        /**
         * 改变指定属性的属性值
         * @returns {*|String}
         */
        _this.changeAttrValues = function(attr){
            var opts = _this.options;
            opts.curAttrName = attr;
            $(".vals[data-name='" + attr + "']", _this.$cont).html(T.Compiler.template("product_params-values", opts));
        };
        /**
         * 点击属性值
         * @param {String} atr 属性名
         * @param {String} val 属性值
         */
        _this.clickAttrValue = function(atr, val, e){
            var opts = _this.options;
            if(opts && atr && val){
                //设置属性
                opts.attr[atr] = val;
                if(atr==opts.qtyName){
                    opts.qtyValue = parseInt(val, 10) || "";
                }
                _this.analy.analysis();
                _this.trigger("click.attr", atr, val, e);
            }
        };
        /**
         * 设置数量框的值
         * @param {String} $cont 数量框所在容器
         * @param {String} value 数量值
         */
		_this.setCounterValue = function($cont, value){
			$(".counter input", $cont).val(value);
		};
        /**
         * 是否确认尺寸
         * @returns {boolean}
         * @param isPrice 是否为获取价格
         * @returns {boolean}
         */
        _this.hasOk = function(isPrice){
            var _this = this,
                count = $(_this.customSize, _this.$cont).length, //总个数
                okCount = $(_this.customSizeDone, _this.$cont).length, //已OK的个数
                hideCount = $(_this.customSize + ":hidden", _this.$cont).length; //隐藏的个数
            if (count==okCount || count==hideCount || count==(okCount+hideCount)) {
                return true;
            }else{
                T.alt("您还有属性未经确认，请点击ok确认" + (isPrice? "" : "后再提交") +"！");
            }
        };
        /**
         * 数字转换
         * @param num
         * @param opts
         * @returns {string}
         */
        _this.decimal = function (num, opts) {
            num = (num + '').replace(/[^0-9.]/g, '');
            num = parseFloat(num);
            num = isNaN(num)?'':num;
            var arr = ('' + num).split('');
            var idx = 0;
            for (var i = 0; i < arr.length; i++) {
                if (idx > 2) {
                    arr[i] = '';
                }
                if (arr[i] == '.' || idx) {
                    idx++;
                }
            }
            var val = parseFloat(arr.join(''));
            if(opts && opts.min && opts.max){
                val = Math.max(opts.min, Math.min(opts.max, val));
            }
            return isNaN(val)?'':val;
        };
    }
    return ProductParams;
});