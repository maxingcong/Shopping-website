/**
 * @fileOverview 产品属性控制
 */
define("design/params", ["base", "tools", "product/analysis"], function($, T, ProductAnalysis){
    "use strict";
    var c26 = {
        qtyName: "P数",
        qtyUnit: "P",
        qtyDivisor: 1,
        minQtyValue: 1,
        maxQtyValue: 10000,
        qtyBase: 1,
        qtyIncr: 1
    };
    function ProductParams(){
        var _this = this;
        //自定义配置
        _this.cfg = {
            /*18: {
             paramLinks: {
             "100次/年": T.DOMAIN.DESIGN + "category/124.html"
             }
             },*/
            53: c26,
            54: c26,
            128: c26,
            141: {
                showCounter: 1
            }
        };
        _this.analy = ProductAnalysis();
        /**
         * 初始化
         * @param options
         */
        _this.init = function(options){
            options = $.extend(true, options||{}, {
                paramTips: { //属性提示
                    "是否加急": "选择加急服务初稿快50%，需加收50%加急费"
                }
            }, _this.cfg[options.designProductId]);
            /*if(options.designProductId==54){ //画册创意设计
                options.qtyIncr = 10;
            }*/
            _this.options = options;
            _this.$cont = $("#template-product_params-view")
                .on("click.attr", ".attrs .vals .val:not(.not-allowed)", function(e){ //点击属性值
                    var $this = $(this);
                    var $vals = $this.closest(".vals"),
                        atr = $.trim($vals.data("name")||""),
                        val = $.trim($this.data("value")||$this.text()||"");
                    if(val && !options.paramLinks[val]){
                        if (!$this.hasClass("dis")) {
                            _this.clickAttrValue(atr, val, e);
                        }
                        return false;
                    }
                }).counter({ //自定义数量
                min: options.minQtyValue,
                max: options.maxQtyValue,
                step: options.qtyIncr,
                change: function($input, val, flag){
                    var that = this,
                        qtyValue = val * options.qtyFlagValue;
                    qtyValue = Math.ceil(qtyValue/options.qtyDivisor) * options.qtyDivisor;
                    if(options.qtyValue!=qtyValue){
                        qtyValue = Math.min(qtyValue, that.max);
                        qtyValue = Math.max(qtyValue, that.min);
                        var name = $input.data("name")||"";
                        $input.closest(".counter").siblings(".val").removeClass("sel");
                        if(name){
                            //设置属性
                            options.qtyValue = qtyValue;
                            _this.trigger("change.qty", options.qtyName, qtyValue);
                        }
                        $input.val(qtyValue);
                    }
                }
            });
            //解析渲染
            _this.analy.on("render", function(opts){
                if($("#template-product_params").length){
                    _this.$cont.html(T.Compiler.template("template-product_params", opts));
                    _this.setCounter();
                }
                _this.trigger("rendered", opts);
                if(opts.onlyOnceRender){ //仅首次渲染全部属性
                    _this.analy.off("render");
                }
            });
            _this.analy.init(options);
        };
        /**
         * 自定义款数
         * @param $cont
         */
        _this.setCounter = function($cont){
            var opts = _this.options;
            $cont = $($cont || _this.$cont);
            if($cont && $cont.length){
                $(".d-counter", $cont).counter({
                    min: 1,
                    max: 10000,
                    step: 1,
                    change: function($input, val, flag){
                        var that = this;
                        if(opts.counter!=val){
                            val = Math.min(val, that.max);
                            val = Math.max(val, that.min);
                            //设置属性
                            opts.counter = val;
                            _this.trigger("change.counter", opts, val);
                            $input.val(val);
                        }
                    }
                });
            }
        };
        /**
         * 获取选中的属性值
         * @returns {*|String}
         */
        _this.getValue = function(attr){
            return this.analy.getValue(attr);
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
    }
    //让具备事件功能
    T.Mediator.installTo(ProductParams.prototype);
    return function(options){
        return new ProductParams(options);
    };
});