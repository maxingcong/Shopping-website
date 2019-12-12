define("modules/product", ["base", "tools"], function($, T) {
    "use strict";
    var Product = T.Module({
        action: CFG_DS.product.get_price,
        template: "product_detail",
        data: {},
        mutexConfig: {},
        disableSale: {},
        events: {
            "click .attrs .vals .val": "selectedAttrValue",
            "valchange.droplist .droplist input[name]": "selectedDropQuantity",
            "click .attrs .vals .but": "custom"
        },
        set: function(product, pattr) {
            var _this = this;
            product = product || {};
            product._valuesAlt = product._valuesAlt || {};
            product._counter = product._counter || 1;
            product._counterUnit = product._counterUnit || "款";
            T.hasPMPID(product.categoryId) && (product._counterUnit = "Person");
            product._quantity = 0;
            product._quantityAlt = product._quantityAlt || "";
            product._quantityMulriple = product._quantityMulriple > 0 ? product._quantityMulriple : 1;
            product._quantityInputUnit = product._quantityInputUnit || "";
            product._quantityUnit = product._quantityUnit || "";
            product._quantityStandardValue = product._quantityStandardValue > 0 ? product._quantityStandardValue : 0;
            product._quantityDivide = product._quantityDivide > 0 ? product._quantityDivide : 1;
            product._quantityStep = product._quantityStep > 0 ? product._quantityStep : 1;
            product._quantityMinValue = product._quantityMinValue >= 0 ? product._quantityMinValue : 1;
            product._quantityMaxValue = product._quantityMaxValue > 0 ? product._quantityMaxValue : 1e3;
            product._quantityName = product._quantityName || "";
            product._uploaded = product._uploaded || 0;
            product._custom = [];
            product._deliveryDayAlt = product._deliveryDayAlt || "";
            product._address = product._address || T.cookie("_address") || CFG_DB.DEF_PCD;
            product._getUUID = function() {
                return T.UUID()
            }
            ;
            product.RMB = T.RMB;
            product.DOING = T.DOING;
            product.HAS_WEIGHT = product.HAS_WEIGHT >= 0 ? product.HAS_WEIGHT : CFG_DB.PCFG.NOT_WEIGHT.indexOf("_" + product.productId + "_") < 0;
            product.HAS_DELIVERY_DAY = product.HAS_DELIVERY_DAY >= 0 ? product.HAS_DELIVERY_DAY : CFG_DB.PCFG.NOT_DELIVERY_DAY.indexOf("_" + product.productId + "_") < 0;
            product.HAS_AVG_PRICE = product.HAS_AVG_PRICE || 0;
            product.HAS_ONLY_TOTAL_PRICE = product.HAS_ONLY_TOTAL_PRICE || 0;
            product.HAS_COUNTER_DECLARE = product.HAS_COUNTER_DECLARE || 0;
            product.AVG_KEEP_FIGURES = product.AVG_KEEP_FIGURES >= 0 ? product.AVG_KEEP_FIGURES : 4;
            product.HAS_INPUT_QUANTITY = product.HAS_INPUT_QUANTITY >= 0 ? product.HAS_INPUT_QUANTITY : 0;
            product.HAS_SINGLE_HIDE = product.HAS_SINGLE_HIDE >= 0 ? product.HAS_SINGLE_HIDE : 0;
            product.HAS_SHOW_COUNTER = product.HAS_SHOW_COUNTER >= 0 ? product.HAS_SHOW_COUNTER : 1;
            product.HAS_CUSTOM_QUANTITY = product.HAS_SHOW_COUNTER && T.hasPMPID(product.categoryId);
            _this.compiler("product_options", product, "product_options-" + product.productId);
            _this.analysis(product, pattr);
            _this.data[product.productId] = product;
            _this.$cont.counter({
                min: product._quantityMinValue,
                max: product._quantityMaxValue,
                step: product._quantityStep,
                change: function($input, val) {
                    var product = _this.get($input)
                        , name = $input.attr("name") || "";
                    if (product && name) {
                        product._custom = [];
                        product._isCustom = 0;
                        "counter" === name && (product._counter = val || this.min);
                        if ("quantity" === name) {
                            val = Math.round(val / product._quantityDivide) * product._quantityDivide;
                            product.attr[product._quantityName] = val * product._quantityMulriple
                        }
                        _this.getPrice(product)
                    }
                    $input.val(val);
                    this.min <= val && $input.parent().siblings(".val").removeClass("sel")
                }
            });
            $("#template_product_desc_view").off("click.ptabs").on("click.ptabs", ".ptabs li", function(e) {
                var index = ($(this).data("index") || $(this).data("target"),
                    $(this).index())
                    , _top = $("#header_fixed").outerHeight() + $(this).closest(".ptabs").outerHeight()
                    , offset = _this.getContentOffset();
                $("html, body").stop(!0, !0).animate({
                    scrollTop: offset.tops[index] - _top
                }, 400)
            });
            $(window).bind("scroll.pdesc", function(e) {
                _this.focusTabs()
            });
        },
        setCounter: function(data) {
            var _this = this;
            T.Each(data.productList, function(i, product) {
                $("#template-product_params-" + product.productId + "-view").counter({
                    min: product._quantityMinValue,
                    max: product._quantityMaxValue,
                    step: product._quantityStep,
                    change: function($input, val, flag) {
                        null != product._quantityStartValue && val != product._quantityMinValue && val < product._quantityStartValue && (val = flag ? product._quantityStartValue : 0);
                        var name = $input.attr("name") || "";
                        $input.parent().siblings(".val").removeClass("sel");
                        if (product && name) {
                            val = Math.round(val / product._quantityDivide) * product._quantityDivide;
                            product.attr[product._quantityName] = val * product._quantityMulriple;
                            _this.getPrice(product)
                        }
                        $input.val(val);
                        val > 0 ? $(".form_btm .submit", _this.$cont).removeClass("dis") : $(".form_btm .submit", _this.$cont).addClass("dis");
                        product.changeCounter && product.changeCounter($input, val, flag)
                    }
                })
            })
        },
        get: function($this, e) {
            var _this = this;
            if (!$this || !$this.length)
                return _this.data[_this.data.productId];
            var $options = $this.closest(".options", _this.$cont)
                , $pattr = $this.closest(".pattr", _this.$cont)
                , $attrs = $this.closest(".attrs", _this.$cont)
                , productId = $this.data("product_id") || $attrs.data("product_id") || $pattr.data("product_id") || $options.data("product_id") || "";
            return _this.data[productId]
        },
        selectedAttrValue: function($this, e) {
            var _this = this;
            if (!$this.hasClass("dis")) {
                var $vals = $this.closest(".vals")
                    , atr = $.trim($vals.data("name") || "")
                    , val = $.trim($this.data("value") || "")
                    , product = _this.get($this, e);
                if (atr && val && product) {
                    product._custom = [];
                    product._isCustom = 0;
                    product.attr[atr] = val;
                    product._droplist[atr] = "";
                    if (product.paramImages && product.paramImages[val]) {
                        var imgUri = product.paramImages[val];
                        $(".zoomimg img", _this.$cont).attr("src", imgUri).data("imguri", imgUri);
                        _this.imageZoom && _this.imageZoom.load(imgUri)
                    }
                    product.selectedAttrValue && product.selectedAttrValue($this, e, {
                        atr: atr,
                        val: val
                    });
                    _this.analysis(product, _this.getValue(product));
                    _this.getPrice(product)
                }
            }
        },
        selectedDropQuantity: function($this, e) {
            var _this = this
                , atr = $.trim($this.data("name") || "")
                , product = _this.get($this, e);
            if (atr && product) {
                product._custom = [];
                product._isCustom = 0;
                product._droplist[atr] = $.trim($this.val()) || "";
                _this.analysis(product, _this.getValue(product));
                _this.getPrice(product)
            }
        },
        changeDeliveryRegion: function($this, e, data) {
            var _this = this;
            data = data || {};
            var address = data.value || CFG_DB.DEF_PCD
                , product = _this.get($this, e);
            address && product && _this.getPrice(product, address)
        },
        getContentOffset: function() {
            var anchors = []
                , tops = []
                , $productDesc = $("#template_product_desc_view")
                , li = $(".desctab li", $productDesc);
            li.data("target") ? li.each(function(i, el) {
                var anchor = $(el).data("target");
                anchors.push(anchor);
                tops.push(Math.floor($('.pshow [alt$="' + anchor + '"]', $productDesc).offset().top))
            }) : li.each(function(i, el) {
                var anchor = $(el).data("index");
                anchors.push(anchor);
                tops.push(Math.floor($('.p_contents [data-index="' + anchor + '"]', $productDesc).offset().top))
            });
            return {
                anchors: anchors,
                tops: tops
            }
        },
        focusTabs: function() {
            var _this = this
                , $productDesc = $("#template_product_desc_view")
                , li = $(".desctab li", $productDesc);
            if (li.length) {
                var offset = _this.getContentOffset()
                    , scroll_h = $(window).scrollTop() + $("#header_fixed").outerHeight() + li.closest(".desctab").outerHeight() + 9
                    , tops = offset.tops;
                if (scroll_h < tops[0])
                    li.eq(0).addClass("sel").siblings("li").removeClass("sel");
                else if (scroll_h >= tops[tops.length - 1])
                    li.eq([tops.length - 1]).addClass("sel").siblings("li").removeClass("sel");
                else
                    for (var i = 0; i < tops.length - 1; i++)
                        if (tops[i] <= scroll_h && scroll_h < tops[i + 1]) {
                            li.eq([i]).addClass("sel").siblings("li").removeClass("sel");
                            break
                        }
            }
        },
        custom: function($this, e) {
            var _this = this
                , product = _this.get($this, e);
            if (product) {
                var _getParam = function() {
                        var param = {
                            attrs: {},
                            attr: {},
                            _quantityName: product._quantityName,
                            _droplist: {
                                firstItem: product._droplist.firstItem
                            },
                            _getUUID: product._getUUID,
                            _custom: []
                        };
                        param.attrs[product._quantityName] = product.attrs[product._quantityName];
                        param.attr[product._quantityName] = product.attr[product._quantityName];
                        param._droplist[product._quantityName] = product._droplist[product._quantityName] || "";
                        return param
                    }
                    ;
                if (!product._custom.length) {
                    product._custom = [];
                    product._custom._counter = product._counter;
                    product._custom.categoryId = product.categoryId;
                    product._custom.HAS_SHOW_COUNTER = 1;
                    for (var i = 0; i < product._custom._counter; i++)
                        product._custom.push(_getParam())
                }
                var popupObj = T.Popup({
                    fixed: !1,
                    id: "popup-product_custom",
                    zIndex: 1800,
                    title: "Custome",
                    content: '<div id="template-product_custom-view"></div>',
                    callback: function(_popup) {
                        var view = _this.compiler("product_custom", product)
                            , $view = $(view)
                            , _render = function($val) {
                                var $pattr = $val.closest(".pattr", $view)
                                    , st = $pattr.scrollTop();
                                product._custom.categoryId = product.categoryId;
                                product._custom.HAS_SHOW_COUNTER = 1;
                                _this.compiler("product_custom", product);
                                $(".pattr", $view).scrollTop(st)
                            }
                            ;
                        $view.counter({
                            min: 1,
                            max: 100,
                            step: 1,
                            change: function($input, val) {
                                var product = _this.get($input);
                                if (product && val != product._custom._counter) {
                                    if (product._custom._counter < val)
                                        for (var i = product._custom.length; val > i; i++)
                                            product._custom.push(_getParam());
                                    else
                                        product._custom = product._custom.slice(0, val);
                                    product._custom._counter = val;
                                    _render($input)
                                }
                            }
                        });
                        $view.on("click.val", ".attrs .attr .val", function(e) {
                            var $val = $(this)
                                , index = $val.closest(".attr", $view).data("index")
                                , val = $.trim($val.data("value") || "")
                                , product = _this.get($val, e);
                            if (index >= 0 && val && product) {
                                product._custom[index].attr[product._quantityName] = val;
                                product._custom[index]._droplist[product._quantityName] = "";
                                _render($val)
                            }
                        }).on("valchange.droplist", ".droplist input[name]", function(e) {
                            var $val = $(this)
                                , index = $val.closest(".attr", $view).data("index")
                                , product = _this.get($val, e);
                            if (index >= 0 && product) {
                                product._custom[index]._droplist[product._quantityName] = $.trim($val.val()) || "";
                                _render($val)
                            }
                        }).on("click", ".submit", function(e) {
                            product._counter = product._custom._counter;
                            $(".counter [name='counter']").val(product._counter);
                            if (product._custom.length)
                                if (1 == product._custom.length) {
                                    product.attr[product._quantityName] = product._custom[0].attr[product._quantityName] || product.attr[product._quantityName];
                                    parseInt(product.attr[product._quantityName], 10) >= parseInt(product._droplist.firstItem, 10) ? product._droplist[product._quantityName] = product.attr[product._quantityName] : product._droplist[product._quantityName] = "";
                                    product._droplist[product._quantityName] = product._custom[0]._droplist[product._quantityName] || product._droplist[product._quantityName];
                                    product._custom = [];
                                    product._isCustom = 0
                                } else
                                    product._isCustom = 1;
                            else {
                                product._custom = [];
                                product._isCustom = 0
                            }
                            _this.analysis(product, _this.getValue(product));
                            _this.getPrice(product);
                            popupObj.remove()
                        })
                    }
                });
                popupObj.on("no", function() {
                    product._custom = [];
                    product._isCustom = 0
                })
            }
        },
        getPrice: function(product, address) {
            var _this = this;
            product && product.targetId && (product = _this.data[product.targetId] || product);
            if (product.productId && product._counter) {
                address = (address || product._address || CFG_DB.DEF_PCD).replace(/\^+$/g, "");
                var pattr = ""
                    , attrs = []
                    , counter = 0
                    , quantity = 0;
                if (product._custom.length) {
                    var attr = {};
                    T.Each(product.attr, function(k, v) {
                        attr[k] = v
                    });
                    var _keys = {};
                    T.Each(product._custom, function(k, item) {
                        attr[product._quantityName] = item._droplist[product._quantityName] || item.attr[product._quantityName] || product.attr[product._quantityName];
                        pattr = _this.getValue(product, attr);
                        if (pattr) {
                            counter += 1;
                            quantity += parseInt(attr[product._quantityName], 10) || 0;
                            if (_keys[pattr])
                                _keys[pattr] += 1;
                            else {
                                attrs.push({
                                    productId: product.productId,
                                    productParam: pattr,
                                    productCount: 1,
                                    address: address
                                });
                                _keys[pattr] = 1
                            }
                        }
                    });
                    T.Each(attrs, function(k, item) {
                        item.productCount = _keys[item.productParam] || item.productCount
                    })
                } else if (product.productList && product.productList)
                    T.Each(product.productList, function(i, item) {
                        pattr = _this.getValue(item);
                        quantity += parseInt(item.attr[item._quantityName], 10) || 0;
                        pattr && quantity > 0 && attrs.push({
                            productId: item.productId,
                            productParam: pattr,
                            productCount: 1,
                            address: address
                        })
                    });
                else {
                    pattr = _this.getValue(product);
                    if (pattr && product.attr) {
                        counter = product._counter;
                        quantity = counter * (parseInt(product.attr[product._quantityName], 10) || 0);
                        attrs.push({
                            productId: product.productId,
                            productParam: pattr,
                            productCount: product._counter || 1,
                            address: address
                        })
                    }
                }
                var param = T.JSON.stringify(attrs);
                if (product._pattr !== param)
                    if (attrs.length) {
                        $(".form_btm .submit", _this.$cont).removeClass("dis");
                        product._pattr = param;
                        product._address = address;
                        _this.showPrice(product, {
                            giftScore: T.DOING,
                            deliveryDay: T.DOING,
                            deliveryDate: "",
                            valuationMethod: product._valuationMethod || 0,
                            valuationValue: T.DOING,
                            counter: counter,
                            counterUnit: product._counterUnit,
                            quantity: '<span class="yellow">' + quantity + "</span> " + product._quantityUnit,
                            counterAmount: T.DOING,
                            discountAmount: T.DOING,
                            amountAlt: ""
                        });
                        var $dom = $("#template-product_options-" + product.productId + "-view");
                        $(".submit .doing", $dom).remove();
                        $(".submit", $dom).append('<span class="doing"><span>Loading...</span></span>');
                        product._pricing = !0;
                        if(product.priceData){
                            $(".submit .doing", $dom).remove();
                            product._pricing = !1;
                            product._discountPrice = 0;
                            product._salePrice = 0;
                            product._deliveryDay = 0;
                            product._valuationMethod = product._valuationMethod || 0;
                            product._valuationValue = 0;
                            product._counter = counter;
                            product._quantity = quantity;
                            product._hasSupply = 0;
                            T.each(attrs, function(i, o){
                                var priceData = product.priceData[o.productParam];
                                //product._discountPrice += priceData.discountPrice || 0;
                                product._salePrice += priceData.price*o.productCount || 0;
                                product._deliveryDay = Math.max(product._deliveryDay, priceData.delivery || 0);
                                product._valuationMethod += product.valuationMethod || 0;
                                product._valuationValue += priceData.weight || 0;
                                product._hasSupply = 0;
                            });
                            _this.setPrice(product);
                            product._hasSupply > 0 ? $(".form_btm .submit", $dom).addClass("dis") : $(".form_btm .submit", $dom).removeClass("dis");
                        }
                    } else {
                        product._pattr = "";
                        $(".form_btm .submit", _this.$cont).addClass("dis");
                        _this.showPrice(product, {
                            giftScore: 0,
                            deliveryDay: 0,
                            deliveryDate: "",
                            valuationMethod: product._valuationMethod || 0,
                            valuationValue: 0,
                            counter: counter,
                            counterUnit: product._counterUnit,
                            quantity: '<span class="yellow">' + quantity + "</span> " + product._quantityUnit,
                            counterAmount: "0.00",
                            discountAmount: "0.00",
                            amountAlt: ""
                        })
                    }
            }
        },
        checkDisableSale: function(attrs) {
            var _this = this
                , data = {
                ret: !1,
                msg: ""
            };
            T.Each(attrs, function(i, attr) {
                attr && _this.disableSale[attr.pid] && T.Each(_this.disableSale[attr.pid], function(k, item) {
                    var count = 0
                        , productParam = attr.pattr;
                    T.Each(item.data, function(k, v) {
                        if (productParam.indexOf(v) >= 0) {
                            productParam = productParam.replace(v, "");
                            count++
                        }
                    });
                    if (count == item.data.length) {
                        data.ret = !0;
                        data.msg = item.info;
                        return !1
                    }
                });
                return data.ret ? !1 : void 0
            });
            return data
        },
        setPrice: function(product) {
            var _this = this;
            if (!product._pricing) {
                var $counter = $("#counter-" + product.productId);
                product._counter = $counter.val() || product._counter || 1;
                $counter.val(product._counter);
                if (product.productId && product._counter) {
                    var counter = product._counter
                        , quantity = product._quantity
                        , discountPrice = product._discountPrice || 0
                        , salePrice = product._salePrice || 0
                        , deliveryDay = product._deliveryDay || 7
                        , valuationMethod = product._valuationMethod || 0
                        , valuationValue = product._valuationValue || 0;
                    1 > deliveryDay && (deliveryDay = 7);
                    0 >= discountPrice && (discountPrice = salePrice);
                    var amountAlt = "";
                    (101 == product.productId || 102 == product.productId || 103 == product.productId || 104 == product.productId) && (amountAlt = "（若选用第三方物流配送，请联系客服咨询运费）");
                    var avgDiscountPrice = 0;
                    if (product.HAS_AVG_PRICE && product.attr[product._quantityName])
                        var _num = Math.pow(10, product.AVG_KEEP_FIGURES)
                            , avgDiscountPrice = Math.round(discountPrice * _num / counter / parseInt(product.attr[product._quantityName], 10)) / _num;
                    _this.showPrice(product, {
                        giftScore: Math.ceil(discountPrice),
                        deliveryDay: deliveryDay,
                        deliveryDate: T.DeliveryDate("", deliveryDay, 1),
                        valuationMethod: valuationMethod,
                        valuationValue: valuationValue,
                        counter: counter,
                        counterUnit: product._counterUnit,
                        quantity: '<span  class="yellow">' + quantity + "</span> " + product._quantityUnit,
                        counterAmount: T.RMB(discountPrice / counter),
                        discountAmount: T.RMB(discountPrice),
                        avgDiscountAmount: T.RMB(avgDiscountPrice),
                        deliveryAlt: product._hasSupply > 0 ? "该地区暂不支持配送" : "",
                        amountAlt: amountAlt
                    }, !0);
                    _this.callbacks.getPriceAfter && _this.callbacks.getPriceAfter.call(_this, product)
                }
            }
        },
        showPrice: function(product, data, isDone) {
            var _this = this;
            if (product.productId && product._counter) {
                if (3 == data.valuationMethod) {
                    var valuationValue = isDone ? Number(data.valuationValue) : data.valuationValue;
                    data.valuationMethod = "个数：";
                    data.valuationValue = '<b class="yellow">' + valuationValue + "</b> <span>个</span>"
                } else if (2 == data.valuationMethod) {
                    var valuationValue = isDone ? T.RMB(data.valuationValue) : data.valuationValue;
                    data.valuationMethod = "预估体积：";
                    data.valuationValue = '<b class="yellow">' + valuationValue + "</b> <span>立方米</span>"
                } else if (1 == data.valuationMethod) {
                    var valuationValue = isDone ? T.RMB(data.valuationValue) : data.valuationValue;
                    data.valuationMethod = "预估面积：";
                    data.valuationValue = '<b class="yellow">' + valuationValue + "</b> <span>平方米</span>"
                } else if (0 == data.valuationMethod) {
                    var valuationValue = isDone ? T.RMB(data.valuationValue) : data.valuationValue;
                    data.valuationMethod = "Weight :";
                    data.valuationValue = '<b class="yellow">' + valuationValue + "</b> <span>kg</span>"
                }
                var _data = {};
                T.Each(data, function(k, v) {
                    _data[k + "-" + product.productId] = data[k]
                });
                _this.bindData("data", _data)
            }
        },
        getValue: function(product, attr) {
            return product.attrs && product.attrs[product._quantityName] && product.attrs[product._quantityName].length || product.attr && product.attr[product._quantityName] ? (this.getBaseValue(product, attr) + "-" + this.getAttachValue(product, attr)).replace(/\-+$|\_+$/, "").replace(/\-+/g, "-").replace(/\_+/g, "_") : ""
        },
        getBaseValue: function(product, attr) {
            attr = attr || {};
            var arr = [];
            if (product.firstNames && product.firstNames.length)
                for (var name = "", i = 0; name = product.firstNames[i]; i++)
                    arr[i] = attr[name] || product._droplist[name] || product.attr[name] || product.attrs[name][0] || "";
            return arr.join("_").replace(/\_+$/, "")
        },
        getAttachValue: function(product, attr) {
            attr = attr || {};
            var arr = [];
            if (product.lastNames && product.lastNames.length)
                for (var name = "", i = 0; name = product.lastNames[i]; i++)
                    arr[i] = attr[name] || product._droplist[name] || product.attr[name] || product.attrs[name][0] || "";
            return arr.join("_").replace(/\_+$/, "")
        },
        getQuantityName: function(product, names) {
            for (var name = "", i = 0; name = product.names[i]; i++)
                if (/^Qty/.test(name) || /Qty$/.test(name)) {
                    /^\d+$/.test(product.attr[name]) && /^.*（.*）$/.test(name) ? product._quantityUnit = name.replace(/^.*（|）$/g, "") : /^\d+$/.test(product.attr[name]) || (product._quantityUnit = String(product.attr[name]).replace(/\d+/g, ""));
                    product._quantityName = name;
                    product.attrs[name].length > 5 && (product._droplist.firstItem = String(product.attrs[name][3]).replace(/\D+/g, "") + "+")
                }
        },
        setAttr: function(product, pattr) {
            if (pattr && product.names && product.names.length) {
                var pattrs = String(pattr).replace(/\-/g, "_").split("_");
                pattr = String("_" + (pattr || "") + "_").replace(/\-/g, "_");
                product.attr = product.attr || {};
                for (var n = 0; n < product.names.length; n++)
                    T.Array.indexOf(product.attrs[product.names[n]], pattrs[n]) < 0 ? T.Each(product.attrs, function(name, attrs) {
                        T.Each(attrs, function(i, attr) {
                            if (null != product.attr[name] && String(pattr).indexOf("_" + attr + "_") >= 0) {
                                product.attr[name] = attr;
                                "function" == typeof product.selectedAttrValue && product.selectedAttrValue(null , null , {
                                    atr: name,
                                    val: attr
                                })
                            }
                        })
                    }) : product.attr[product.names[n]] = pattrs[n]
            }
        },
        setDefaultValue: function(product, names) {
            var _this = this;
            names = names || product.names;
            if (names && names.length) {
                _this.getQuantityName(product, names);
                for (var name = "", i = 0; name = names[i]; i++)
                    if (T.Array.indexOf(product.attrs[name], product.attr[name]) < 0) {
                        if (name == product._quantityName && product.HAS_INPUT_QUANTITY) {
                            var quantity = Math.min(Math.abs(parseInt(parseInt(product.attr[name], 10) / product._quantityMulriple, 10)), product._quantityMaxValue);
                            quantity = Math.max(product._quantityStartValue || product._quantityMinValue, quantity);
                            product.attr[name] = quantity * product._quantityMulriple;
                            product.attr[name] = product.attr[name] || product.attrs[name][0] || ""
                        } else
                            product.attr[name] = product.attrs[name][0] || "";
                        name == product._quantityName && (product._quantityUnit = product._quantityUnit || String(product.attr[name]).replace(/\d+/g, ""))
                    }
                product.attrs[product._quantityName].length > 5 && T.Array.indexOf(product.attrs[product._quantityName], product.attr[product._quantityName]) >= 3 && (product._droplist[product._quantityName] = product.attr[product._quantityName] || "");
                null != product._droplist[product._quantityName] && product.HAS_CUSTOM_QUANTITY || (product._droplist[product._quantityName] = "");
                return product
            }
        },
        setMutex: function(product, pattr) {
            var _this = this;
            if (product && product.productId) {
                var cfg = _this.mutexConfig[product.productId];
                if (cfg) {
                    T.Each(cfg, function(name, value) {
                        product.attr[name] && T.Each(cfg[name], function(attr, attrs) {
                            product.attr[name] == attr && T.Each(attrs, function(key, vals) {
                                T.Array.add(product.names, key, !1);
                                T.Typeof(vals, /Array/) ? product.attrs[key] = vals : T.Each(vals, function(atr, val) {
                                    if (val > -1)
                                        T.Array.add(product.attrs[key], atr, !1);
                                    else {
                                        var arr = [];
                                        T.Each(product.attrs[key], function(i, v) {
                                            atr != v && arr.push(v)
                                        });
                                        product.attrs[key] = arr
                                    }
                                })
                            })
                        })
                    });
                    _this.setDefaultValue(product, product.names)
                }
            }
        },
        analysis: function(product, pattr) {debugger
            200032 == product.productId;
            var _this = this;
            pattr = pattr || "";
            _this.analysisNames(product, pattr);
            if (product && product.params && product.baseInfoName) {
                T.Each(product.params, function(k, param) {
                    for (var keys = k.replace("-", "_").split("_"), key = "", j = 0; key = keys[j]; j++)
                        T.Array.add(product.attrs[product.names[j]], key, !1)
                });
                _this.setDefaultValue(product, product.firstNames);
                _this.analysisAttachParams(product, pattr)
            }
            _this.setAttr(product, pattr);
            _this.setDefaultValue(product, product.names);
            product.HAS_INPUT_QUANTITY && product.attr[product._quantityName] && (product.attr[product._quantityName] = Math.round(product.attr[product._quantityName] / product._quantityDivide) * product._quantityDivide);
            _this.setMutex(product, pattr);
            _this.compiler("product_params", product, "product_params-" + product.productId);
            _this.callbacks.analysisAfter && _this.callbacks.analysisAfter.call(_this, product);
            return product
        },
        analysisNames: function(product, pattr) {
            if (product && product.baseInfoName) {
                product._droplist || (product._droplist = {});
                product._droplist.firstItem = "";
                product.baseInfoName = product.baseInfoName.replace(/\-+$|\_+$/, "");
                var baseInfoName = product.baseInfoName
                    , _idx = baseInfoName.indexOf("-")
                    , firstName = baseInfoName
                    , lastName = "";
                if (_idx > 0) {
                    firstName = baseInfoName.substring(0, _idx);
                    lastName = baseInfoName.substring(_idx + 1).replace("-", "_")
                }
                var firstNames = firstName ? firstName.split("_") : []
                    , lastNames = lastName ? lastName.split("_") : []
                    , names = firstNames.concat(lastNames)
                    , values = pattr.replace("-", "_").split("_")
                    , attrs = {}
                    , attr = {};
                product.attr = product.attr || {};
                for (var name = "", i = 0; name = names[i]; i++) {
                    attrs[name] = [];
                    attr[name] = values[i] || product.attr[name] || ""
                }
                product.firstNames = firstNames;
                product.lastNames = lastNames;
                product.names = names;
                product.namesOrder || (product.namesOrder = names);
                product.params && (product.attrs = attrs);
                product.attr = attr
            }
            product.namesOrder = product.namesOrder || [];
            return product
        },
        analysisAttachParams: function(product, pattr) {
            var _this = this
                , key = _this.getBaseValue(product);
            if (product.HAS_INPUT_QUANTITY && product._quantityStandardValue > 0) {
                var quantity = product.attr[product._quantityName] || "";
                if (quantity) {
                    product.attr[product._quantityName] = product._quantityStandardValue;
                    key = _this.getBaseValue(product);
                    product.attr[product._quantityName] = quantity
                }
            }
            if (key && product.params[key]) {
                T.Each(product.params[key], function(k, vals) {
                    var idx = T.Array.indexOf(product.names, k);
                    vals && idx >= 0 && T.Each(vals, function(atr, val) {
                        val > -1 && T.Array.add(product.attrs[product.names[idx]], atr, !1)
                    })
                });
                _this.setDefaultValue(product, product.lastNames)
            }
            return product
        },
        analysisImages: function(product) {
            product.pImages || (product.pImages = product.productImg || null );
            T.Typeof(product.pImages, /String/) ? product.pImages = product.pImages.split(",") : product.pImages = [];
            T.Each(product.pImages, function(k, v) {
                (!v || v.length < 10) && (product.pImages[k] = k ? "" : product.productImg)
            });
            for (var h = 0; 5 > h; h++)
                product.pImages[h] || (product.pImages[h] = "");
            product.productImgDef = product.pImages[0];
            if ("object" != typeof product.paramImages)
                try {
                    product.paramImages = T.JSON.parse(product.paramImages)
                } catch (e) {
                    product.paramImages = {}
                }
            product.paramImages = product.paramImages || {};
            return product
        },
        analysisDesc: function(product) {
            var _this = this
                , json = "";debugger
            try {
                json = T.JSON.parse(product.productDesc)
            } catch (e) {
                json = product.productDesc
            }
            var productDesc = [];
            if ("string" == typeof json)
                product.TABS = _this.getTabs(json);
            else {
                T.Each(json, function(i, item) {
                    item.title && item.content && productDesc.push(item)
                });
                product.productDesc = productDesc
            }
        },
        getTabs: function(productDesc) {
            productDesc = productDesc || "";
            var tabs = {
                ininin_detail: "产品详情",
                ininin_attr: "规格参数",
                ininin_display: "产品展示",
                ininin_tech: "工艺&尺寸",
                ininin_price: "价格&货期",
                ininin_note: "下单须知",
                ininin_transport: "物流介绍",
                ininin_service: "售后服务"
            }
                , _tabs = [];
            T.Each(tabs, function(k, v) {
                productDesc.indexOf(k) >= 0 && _tabs.push({
                    key: k,
                    value: v
                })
            });
            return _tabs
        },
        analysisTemplatePath: function(product) {
            var templatePath = product.templatePath || ""
                , idx = templatePath.lastIndexOf(".")
                , fix = ".rar";
            idx > 0 && (fix = templatePath.substring(idx));
            templatePath && (product._templateName = product.productName + "-空白模板" + fix)
        },
        getJson: function(str) {
            var json = "";
            try {
                json = T.JSON.parse(str)
            } catch (e) {}
            return json
        }
    });
    return Product
});
define("widgets/zoomer", ["base", "tools"], function($, T) {
    function ImageZoom(options) {
        var _this = this;
        options = options || {};
        if (options.trigger) {
            options.scale = options.scale || 2;
            options.uuid = options.uuid || "uuid" + (new Date).getTime();
            _this.options = options;
            _this.init()
        }
    }
    ImageZoom.prototype = {
        init: function() {
            var _this = this;
            _this.zoombox = document.createElement("span");
            _this.zoombox.className = "zoom_box";
            _this.options.trigger.appendChild(_this.zoombox);
            var domId = "image_zoom_" + _this.options.uuid
                , dom = document.getElementById(domId);
            dom && dom.parentNode.removeChild(dom);
            _this.dom = document.createElement("div");
            _this.dom.className = "image_zoom";
            _this.dom.id = domId;
            _this.target = document.createElement("div");
            _this.target.className = "img";
            _this.dom.appendChild(_this.target);
            document.body.appendChild(_this.dom);
            _this.mousemove();
            _this.load(_this.options.imguri)
        },
        mousemove: function() {
            var _this = this;
            _this.width = _this.options.trigger.offsetWidth || _this.options.trigger.clientWidth || 0;
            _this.height = _this.options.trigger.offsetHeight || _this.options.trigger.clientHeight || 0;
            _this._width = _this.zoombox.offsetWidth || _this.zoombox.clientWidth || 0;
            _this._height = _this.zoombox.offsetHeight || _this.zoombox.clientHeight || 0;
            _this.minTop = 0;
            _this.maxTop = _this.width - _this._width;
            _this.minLeft = 0;
            _this.maxLeft = _this.height - _this._height;
            $(_this.options.trigger).bind("mouseenter.proimg", function(e) {
                _this.zoombox.style.left = "110%";
                _this.zoombox.style.top = "110%";
                _this.target.innerHTML = "";
                _this.load($("img", _this.options.trigger).data("imguri"))
            }).bind("mousemove.proimg", function(e) {
                var mosPos = T.DOM.getMousePos(e)
                    , offset = $(_this.options.trigger).offset()
                    , tmpX = Math.round(mosPos.x - offset.left - _this._width / 2)
                    , tmpY = Math.round(mosPos.y - offset.top - _this._height / 2);
                tmpX = Math.max(_this.minLeft, Math.min(_this.maxLeft, tmpX));
                tmpY = Math.max(_this.minTop, Math.min(_this.maxTop, tmpY));
                _this.zoombox.style.left = tmpX + "px";
                _this.zoombox.style.top = tmpY + "px";
                _this.dom.style.display = "block";
                _this.dom.style.left = offset.left + _this.width + 10 + "px";
                _this.dom.style.top = offset.top - 2 + "px";
                _this.target.style.left = -tmpX * _this.options.scale + "px";
                _this.target.style.top = -tmpY * _this.options.scale + "px"
            }).bind("mouseleave.proimg", function(e) {
                _this.zoombox.style.left = "110%";
                _this.zoombox.style.top = "110%";
                _this.dom.style.display = "none"
            })
        },
        load: function(imguri) {
            var _this = this;
            if (imguri) {
                _this.options.imguri = imguri || "";
                var image = new Image;
                image.onload = function() {
                    _this.target.innerHTML = '<img src="' + imguri + '" alt="' + (_this.options.pname || "云印技术") + '"/>'
                }
                ;
                image.src = imguri
            }
        }
    };
    return ImageZoom
});
require(["modules/product", "widgets/zoomer"], function(Product, ImageZoom) {});
var _modules = ["base", "tools", "location", "modules/product", "widgets/zoomer"]
    , _href = location.href
    , _productId = _href.slice(_href.indexOf("/product/"), _href.indexOf(".html")).replace("/product/", "");
",200068,200069,200070,200071,200042,".indexOf("," + _productId + ",") >= 0 && _modules.push("product/" + _productId);
require(_modules, function($, T, PCD, Product, ImageZoom, ProductDetailCustom) {
    var pdt = null
        , imageZoom = null
        , pdc = null
        , ProductDetail = T.Module({
        action: CFG_DS.product.get_price,
        template: "product_detail",
        data: {},
        events: {
            "mouseenter .dupload li": "switcherImage"
        },
        init: function(options) {
            function getParams(pdt, product) {
                product && product.targetId && (product = pdt.data[product.targetId] || product);
                var pattrs = [];
                if (product.productList && product.productList)
                    T.Each(product.productList, function(i, item) {
                        pattr = pdt.getValue(item);
                        pattrs.push(pattr)
                    });
                else {
                    pattr = pdt.getValue(product);
                    pattrs.push(pattr)
                }
                return pattrs.join("^")
            }
            var _this = this;
            pdt = new Product({
                callbacks: {
                    getPriceAfter: function(product) {
                        var res = getParams(pdt, product);
                        res && T.setHash(res);
                        _this.autoHeight()
                    },
                    analysisAfter: function(product) {
                        var res = getParams(pdt, product);
                        res && T.setHash(res);
                        _this.autoHeight()
                    }
                }
            });
            options = options || {};
            var atr = location.hash || options.pattr || "";
            if (atr.length > 0)
                try {
                    atr = decodeURIComponent(atr.substring(1))
                } catch (e) {
                    atr = atr.substring(1)
                }
            var pattr = atr || _this.pattr || ""
                , local = location.href.substring(0, location.href.indexOf(".html"))
                , pageId = local.substring(local.lastIndexOf("/") + 1) || ""
                , productId = T.REQUEST.pid || pageId;
            200071 != pageId || 200072 != productId && 200073 != productId || (productId = pageId);
            if (productId) {
                var data = {
                    "result": 0,
                    "msg": "",
                    "productId": 200021,
                    "categoryId": 39,
                    "categoryName": "Classic",
                    "productName": "'New' name card",
                    "productImg": "http://cloud.ininin.com/1453727435050.jpg",
                    "title": "'New' name card",
                    "keywords": "'New' name card",
                    "description": "'New' name card",
                    "pImages": "http://cloud.ininin.com/1453727455067.jpg,http://cloud.ininin.com/1453727457303.jpg,http://cloud.ininin.com/1453727459607.jpg,http://cloud.ininin.com/1453727472730.jpg,http://cloud.ininin.com/1453727468168.jpg",
                    "simpleDesc": "",
                    "productDesc": "",
                    "addedServicesList": [],
                    "baseInfoName":"Material_Qty_Finished size-Coating",
                    "params": {
                        "300g coated paper_1 Box_90mm*54mm": {
                            "Coating": {
                                "Matt lamination": 1
                            }
                        },
                        "300g coated paper_2 Box_90mm*54mm": {
                            "Coating": {
                                "Matt lamination": 1
                            }
                        },
                        "300g coated paper_5 Box_90mm*54mm": {
                            "Coating": {
                                "Matt lamination": 1
                            }
                        },
                        "300g coated paper_10 Box_90mm*54mm": {
                            "Coating": {
                                "Matt lamination": 1
                            }
                        },
                        "300g coated paper_20 Box_90mm*54mm": {
                            "Coating": {
                                "Matt lamination": 1
                            }
                        },
                        "300g coated paper_40 Box_90mm*54mm": {
                            "Coating": {
                                "Matt lamination": 1
                            }
                        },
                        "300g coated paper_100 Box_90mm*54mm": {
                            "Coating": {
                                "Matt lamination": 1
                            }
                        }
                    },
                    "priceData": {
                        "300g coated paper_1 Box_90mm*54mm-Matt lamination": {
                            "price": 1,
                            "weight": 0.15,
                            "delivery": 1
                        },
                        "300g coated paper_2 Box_90mm*54mm-Matt lamination": {
                            "price": 1.475,
                            "weight": 0.29,
                            "delivery": 1
                        },
                        "300g coated paper_5 Box_90mm*54mm-Matt lamination": {
                            "price": 2.9,
                            "weight": 0.73,
                            "delivery": 1
                        },
                        "300g coated paper_10 Box_90mm*54mm-Matt lamination": {
                            "price": 5.275,
                            "weight": 1.46,
                            "delivery": 1
                        },
                        "300g coated paper_20 Box_90mm*54mm-Matt lamination": {
                            "price": 10.025,
                            "weight": 2.92,
                            "delivery": 1
                        },
                        "300g coated paper_40 Box_90mm*54mm-Matt lamination": {
                            "price": 19.525,
                            "weight": 5.83,
                            "delivery": 1
                        },
                        "300g coated paper_100 Box_90mm*54mm-Matt lamination": {
                            "price": 48.025,
                            "weight": 14.58,
                            "delivery": 1
                        }
                    },
                    "productDesc": [
                        {
                            "title": "Order Process",
                            "content": "<div style=\"text-align: center;\"><img src=\"./imgs/101.jpg\"/></div>"
                        },
                        {
                            "title": "Specifcations",
                            "content": "<div style=\"text-align: center;\"><img src=\"./imgs/102.jpg\"/></div><div style=\"text-align: center;\"><img src=\"./imgs/103.jpg\"/></div><div style=\"text-align: center;\"><img src=\"./imgs/104.jpg\"/></div><div style=\"text-align: center;\"><img src=\"./imgs/105.jpg\"/></div>"
                        },
                        {
                            "title": "New Design",
                            "content": "<div style=\"text-align: center;\"><img src=\"./imgs/106.jpg\"/></div>"
                        },
                        {
                            "title": "New Sercives",
                            "content": "<div style=\"text-align: center;\"><img src=\"./imgs/107.jpg\"/></div>"
                        }
                    ],
                    "type": 0,
                    "standardType": 0,
                    "showType": 0,
                    "websiteShow": 1,
                    "homeShow": 1,
                    "homeShowIcon": 1,
                    "listShow": 1,
                    "listShowIcon": 2,
                    "minDistNum": -1,
                    "targetId": "0",
                    "valuationMethod": 0,
                    "valuationValue": 0.15,
                    "productVariety": 0
                };
                data.productId = pdt.data.productId = data.productId || productId;
                data._quantityName = "Qty";
                T.hasPMPID(data.categoryId) && (data._quantityCustomAlt = "单独设置每个人的名片数量");
                pdt.analysisTemplatePath(data);
                pdt.analysisImages(data);
                pdt.analysisDesc(data);
                data.preferntialInfo = pdt.getJson(data.preferntialInfo);
                "function" == typeof ProductDetailCustom && (pdc = new ProductDetailCustom(data,pattr));
                var pattrs = String(pattr).split("^");
                _this.render(data);
                T.Template("product_desc", data);
                data.mutexConfig && (pdt.mutexConfig[data.productId] = data.mutexConfig);debugger
                pdt.set(data, pattr);
                if (data.productList && data.productList.length) {
                    T.Each(data.productList, function(i, item) {
                        item.mutexConfig && (pdt.mutexConfig[item.productId] = item.mutexConfig || {});
                        pdt.set(item, pattrs[i] || String(pattr).replace(/\^/g, "") || "")
                    });
                    pdt.setCounter(data)
                }
                pdt.getPrice(data);
                imageZoom = new ImageZoom({
                    uuid: T.UUID(),
                    trigger: $(".zoomimg", _this.$cont)[0],
                    pname: data.productName || "",
                    imguri: data.productImgDef || ""
                });
                pdt.imageZoom = imageZoom;
                T.BindQQService();
                _this.bindEvents();
                _this.autoHeight();
                $(window).scrollTop(1);
                $(window).scrollTop(0)
            }
        },
        addCart: function($this, e) {
            var _this = this;
            if (!$(".doing", $this).length && !$this.hasClass("dis"))
                if (T._LOGED) {
                    var product = pdt.get($this, e);
                    if (product) {
                        var buynow = $this.hasClass("buynow") ? 1 : 0
                            , params = [];
                        product._counter && product.attr && product.attr[product._quantityName] ? params = _this.getParams(product, buynow) : product.productList && product.productList.length && T.Each(product.productList, function(i, item) {
                            params = params.concat(_this.getParams(item, buynow))
                        });
                        var dataInfo = pdt.checkDisableSale(params);
                        dataInfo.ret ? T.alt(dataInfo.msg) : product._address ? T.POST({
                            action: "in_order/cart_add",
                            params: {
                                data: params
                            },
                            success: function(data, params) {
                                1 == buynow ? window.location = T.DOMAIN.CART + "ordering.html?a=" + T.Params.encode(T.Base64.encode(T.Params.encode(data.date + "," + T.RMB(product._salePrice)))) : _this.throwLine($("#pdetail .addcart"), $("#car_number"), product, 15, -80)
                            }
                        }) : T.msg("请选择购买数量！")
                    }
                } else
                    T.LoginForm(0, function() {
                        _this.addCart($this, e)
                    })
        },
        throwLine: function(start, end, data, speed, offset) {
            var y, imgSrc = data.pImages[0] + "?imageMogr2/thumbnail/!32x32r/auto-orient/gravity/Center/crop/32x32", scroll_h = $(window).scrollTop(), x1 = start.offset().left + start.outerWidth() / 2, y1 = -start.offset().top, x2 = end.offset().left + end.outerWidth() / 2, y2 = -end.offset().top, a = offset || -40, speed = speed || 10, b = (y1 - y2) / ((x1 - x2) * (x1 - x2 - 2 * a)), c = y1 - b * (x1 - x2 - a) * (x1 - x2 - a), x = x1, ball = $('<span class="throwpro" style="display:inline-block;position:fixed;left:' + x1 + "px;top:" + (-y1 - scroll_h) + 'px;width:32px;height:32px;border:2px solid #0487e2;z-index:999"><img src="' + imgSrc + '"></span>').appendTo($("body")), timer = setInterval(function() {
                speed > 6 && speed > x2 - x && (speed = 2);
                x += speed;
                y = b * (x - x2 - a) * (x - x2 - a) + c;
                ball.css({
                    left: x,
                    top: -y - scroll_h
                });
                if (x >= x2) {
                    clearInterval(timer);
                    ball.animate({
                        opacity: 0
                    }, 600, function() {
                        ball.remove()
                    });
                    T.Cart.reload()
                }
            }, 25)
        },
        getParams: function(product, buynow) {
            var params = []
                , attr = {};
            T.Each(product.attr, function(k, v) {
                attr[k] = v
            });
            for (var i = 0; i < product._counter; i++) {
                var _quantity = "";
                product._custom[i] && (_quantity = product._custom[i]._droplist[product._quantityName] || product._custom[i].attr[product._quantityName] || "");
                var quantity = _quantity || product._droplist[product._quantityName] || product.attr[product._quantityName];
                if (quantity) {
                    attr[product._quantityName] = quantity;
                    params.push({
                        pnum: 1,
                        quantity: quantity,
                        cid: product.categoryId,
                        pid: product.productId,
                        target_id: product.targetId || product.productId,
                        pattr: pdt.getValue(product, attr),
                        pname: product.productName,
                        uploaded: product._uploaded || 0,
                        buynow: buynow,
                        address: (product._address || T.cookie("_address") || CFG_DB.DEF_PCD).replace(/\^+$/g, "")
                    })
                }
            }
            return params
        },
        switcherImage: function($this, e) {
            var _this = this
                , src = $this.data("imguri") || ""
                , $images = $this.closest(".images", _this.$cont)
                , $img = $(".zoomimg img", $images);
            $img.attr("src", src);
            $img.data("imguri", src);
            imageZoom && imageZoom.load(src)
        },
        autoHeight: function() {
            var h = $("#dpanel").height();
            $("#prolist li").css("padding", Math.floor((h - 333) / 6) + "px 0")
        },
        bindEvents: function() {
            var $productDesc = $("#template_product_desc_view")
                , $hotSell = $("#template-hot_sell-view");
            $(window).bind("scroll.pdesc resize.pdesc", function(e) {
                var _top = $(window).scrollTop()
                    , _top2 = $productDesc.offset().top
                    , _top3 = $("#header_fixed").outerHeight();
                if (_top + _top3 - 9 >= _top2) {
                    $productDesc.addClass("pfixed");
                    $(".ptabs", $productDesc).css({
                        top: _top3 - 1
                    })
                } else
                    $productDesc.removeClass("pfixed");
                var winTop = _top + $(window).height()
                    , _top4 = $hotSell.offset().top + $hotSell.outerHeight()
                    , _top5 = $("#footer").offset().top;
                winTop >= _top5 ? $("ul", $hotSell).addClass("fixed").css({
                    bottom: winTop - _top5 + 30
                }) : winTop >= _top4 ? $("ul", $hotSell).addClass("fixed").css({
                    bottom: 20
                }) : $("ul", $hotSell).removeClass("fixed")
            });
            $(".recommend").on("mouseenter", ".desctab li[data-idx]", function(e) {
                var $this = $(this)
                    , $recommend = $this.closest(".recommend")
                    , idx = $this.data("idx");
                $this.addClass("sel").siblings("li[data-idx]").removeClass("sel");
                $(".tabdetail[data-idx='" + idx + "']", $recommend).show().siblings(".tabdetail[data-idx]").hide()
            })
        }
    });
    T.Loader(function() {
        new ProductDetail
    })
});
define("product/name-card", function() {});
