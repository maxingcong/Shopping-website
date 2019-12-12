define("modules/product", ["base", "tools"], function($, T){
    "use strict";
    var albumConfig = {
        "内文克重（g）": {
            "105": {
                "内文P数": {
                    "4": 0,
                    "8": 0,
                    "12": 0,
                    "16": 0,
                    "20": 0,
                    "24": 0,
                    "28": 0,
                    "32": 0,
                    "36": 0,
                    "40": 0,
                    "44": 0,
                    "48": 0,
                    "52": 0,
                    "56": -1,
                    "60": -1,
                    "64": -1,
                    "68": -1,
                    "72": -1,
                    "76": -1,
                    "80": -1,
                    "84": -1,
                    "88": -1,
                    "92": -1,
                    "96": -1
                }
            },
            "128": {
                "内文P数": {
                    "4": 0,
                    "8": 0,
                    "12": 0,
                    "16": 0,
                    "20": 0,
                    "24": 0,
                    "28": 0,
                    "32": 0,
                    "36": 0,
                    "40": 0,
                    "44": 0,
                    "48": 0,
                    "52": -1,
                    "56": -1,
                    "60": -1,
                    "64": -1,
                    "68": -1,
                    "72": -1,
                    "76": -1,
                    "80": -1,
                    "84": -1,
                    "88": -1,
                    "92": -1,
                    "96": -1
                }
            },
            "157": {
                "内文P数": {
                    "4": 0,
                    "8": 0,
                    "12": 0,
                    "16": 0,
                    "20": 0,
                    "24": 0,
                    "28": 0,
                    "32": 0,
                    "36": 0,
                    "40": 0,
                    "44": 0,
                    "48": 0,
                    "52": -1,
                    "56": -1,
                    "60": -1,
                    "64": -1,
                    "68": -1,
                    "72": -1,
                    "76": -1,
                    "80": -1,
                    "84": -1,
                    "88": -1,
                    "92": -1,
                    "96": -1
                }
            },
            "200": {
                "内文P数": {
                    "4": 0,
                    "8": 0,
                    "12": 0,
                    "16": 0,
                    "20": 0,
                    "24": 0,
                    "28": 0,
                    "32": 0,
                    "36": 0,
                    "40": 0,
                    "44": -1,
                    "48": -1,
                    "52": -1,
                    "56": -1,
                    "60": -1,
                    "64": -1,
                    "68": -1,
                    "72": -1,
                    "76": -1,
                    "80": -1,
                    "84": -1,
                    "88": -1,
                    "92": -1,
                    "96": -1
                }
            },
            "250": {
                "内文P数": {
                    "4": 0,
                    "8": 0,
                    "12": 0,
                    "16": 0,
                    "20": 0,
                    "24": 0,
                    "28": 0,
                    "32": 0,
                    "36": -1,
                    "40": -1,
                    "44": -1,
                    "48": -1,
                    "52": -1,
                    "56": -1,
                    "60": -1,
                    "64": -1,
                    "68": -1,
                    "72": -1,
                    "76": -1,
                    "80": -1,
                    "84": -1,
                    "88": -1,
                    "92": -1,
                    "96": -1
                }
            },
            "300": {
                "内文P数": {
                    "4": 0,
                    "8": 0,
                    "12": 0,
                    "16": 0,
                    "20": 0,
                    "24": 0,
                    "28": 0,
                    "32": 0,
                    "36": -1,
                    "40": -1,
                    "44": -1,
                    "48": -1,
                    "52": -1,
                    "56": -1,
                    "60": -1,
                    "64": -1,
                    "68": -1,
                    "72": -1,
                    "76": -1,
                    "80": -1,
                    "84": -1,
                    "88": -1,
                    "92": -1,
                    "96": -1
                }
            }
        },
        "装订方式": {
            "骑马钉": {
                "内文P数": {
                    "56": -1,
                    "60": -1,
                    "64": -1,
                    "68": -1,
                    "72": -1,
                    "76": -1,
                    "80": -1,
                    "84": -1,
                    "88": -1,
                    "92": -1,
                    "96": -1
                }
            },
            "无线胶装": {
                "内文P数": {
                    "4": -1,
                    "8": -1,
                    "12": -1,
                    "16": -1,
                    "20": -1,
                    "24": -1,
                    "28": -1,
                    "32": -1,
                    "36": -1,
                    "40": -1,
                    "44": -1,
                    "48": 0,
                    "52": 0,
                    "56": 0,
                    "60": 0,
                    "64": 0,
                    "68": 0,
                    "72": 0,
                    "76": 0,
                    "80": 0,
                    "84": 0,
                    "88": 0,
                    "92": 0,
                    "96": 0
                }
            }
        }
    };
    var card200437 = {
		"数量": {
			"1盒": -1,
			"2盒": 0,
			"5盒": 0,
			"10盒": 0,
			"20盒": 0
		},
		"覆膜": {
			"不覆膜": 0,
			"覆哑膜": -1
		},
		"UV": {
			"不UV": 0,
			"单面UV": -1,
			"双面UV": -1
		}
	};
	var Product = T.Module({
        action: CFG_DS.product.get_price,
        template: "product_detail",
        data: {},
        mutexConfig: { //属性互斥配置，当选中某个属性值时，另一个属性值可用/不可用
            61: {
                "数量": {
                    "1盒": {
                        "UV": {
                            "单面UV": -1,
                            "双面UV": -1
                        }
                    },
                    "2盒": {
                        "UV": {
                            "单面UV": -1,
                            "双面UV": -1
                        }
                    },
                    "40盒": {
                        "UV": {
                            "单面UV": -1,
                            "双面UV": -1
                        }
                    },
                    "100盒": {
                        "UV": {
                            "单面UV": -1,
                            "双面UV": -1
                        }
                    }
                },
                "UV": {
                    "单面UV": {
                        "覆膜": {
                            "覆哑膜": 0,
                            "不覆膜": -1
                        }
                    },
                    "双面UV": {
                        "覆膜": {
                            "覆哑膜": 0,
                            "不覆膜": -1
                        }
                    }
                }
            },
            83: {
                "打流水号": {
                    "不打流水号": {
                        "流水号颜色": {
                            "红色流水号": -1,
                            "黑色流水号": -1
                        }
                    }
                }
            },
            101: albumConfig,
            102: albumConfig,
            103: albumConfig,
            104: albumConfig,
			200437: {
				"数量": {
					"1盒": {
						"UV": {
							"不UV": 0,
							"单面UV": -1,
							"双面UV": -1
						}
					},
					"2盒": {
						"UV": {
							"不UV": 0,
							"单面UV": -1,
							"双面UV": -1
						}
					}
				},
				"材质": {
					"铜版纸": {
						"数量": {
							"1盒": 0,
							"2盒": 0,
							"5盒": 0,
							"10盒": 0,
							"20盒": 0
						}
					},
					"安格纸": card200437,
					"蛋壳纸": card200437,
					"刚古纸": card200437,
					"冰白纸": card200437,
					"布纹纸": card200437,
					"荷兰白": card200437
				}
			},
            200474: {
                "材质": {
                    "300g铜版纸": {
                        "覆膜": {
                            "不覆膜": -1,
                            "覆哑膜": 0
                        }
                    },
                    "300g砂影时光米白": {
                        "覆膜": {
                            "不覆膜": 0,
                            "覆哑膜": -1
                        }
                    }
                }
            },
			200588: {
                "材质类型": {
                    "星域星彩250g墨兰": {
                        "印刷工艺": {
							"四色印": -1,
							"专色印正背共一色": -1,
							"专色印正背共两色": -1,
							"专色印正背共三色": -1,
							"专色印正背共四色": -1,
							"专色印正背共五色": -1,
							"专色印正背共六色": -1,
							"不印只做特殊工艺": 0
                        }
                    }
                }
            }
        },
		disableSale: { //禁卖配置
			126: [{//枫叶牛仔
				data: ["不烫金","不烫银","正面不压印","无水晶字"],
				info: "抱歉，烫金、烫银、压印、水晶字请您务必选择一项作为制作工艺，否则无法生产"
			},{
				data: ["不烫金","不烫银","反面不压印","无水晶字"],
				info: "抱歉，烫金、烫银、压印、水晶字请您务必选择一项作为制作工艺，否则无法生产"
			}],
			/*127: [{//柔美滑面
				data: ["不烫金","不烫银","正面不压印","无水晶字"],
				info: "抱歉，烫金、烫银、压印、水晶字请您务必选择一项作为制作工艺，否则无法生产"
			},{
				data: ["不烫金","不烫银","反面不压印","无水晶字"],
				info: "抱歉，烫金、烫银、压印、水晶字请您务必选择一项作为制作工艺，否则无法生产"
			}],*/
			128: [{//天鹅绒
				data: ["不烫金","不烫银","不印","不印","不印"],
				info: "抱歉，烫金、烫银、印金、印银、印白请您务必选择一项作为制作工艺，否则无法生产"
			}],
			131: [{//柏芙纸
				data: ["不烫金","不烫银","正面不压印","无水晶字"],
				info: "抱歉，烫金、烫银、压印、水晶字请您务必选择一项作为制作工艺，否则无法生产"
			},{
				data: ["不烫金","不烫银","反面不压印","无水晶字"],
				info: "抱歉，烫金、烫银、压印、水晶字请您务必选择一项作为制作工艺，否则无法生产"
			}],
			200097: [{//黑鹿绒名片
				data: ["无烫金","无烫银","无水晶字","无印金、银、白","无击凸"],
				info: "抱歉，烫金、烫银、水晶字、印金银白、击凸请您务必选择一项作为制作工艺，否则无法生产"
			}],
			/*200098: [{//白鹿绒名片
				data: ["无烫金","无烫银","无水晶字","无印金、银、白","无击凸"],
				info: "抱歉，烫金、烫银、水晶字、印金银白、击凸请您务必选择一项作为制作工艺，否则无法生产"
			}],*/
			200100: [{//彩域名片
				data: ["无烫金","无烫银","无水晶字","无印金、银、白","无击凸"],
				info: "抱歉，烫金、烫银、水晶字、印金银白、击凸请您务必选择一项作为制作工艺，否则无法生产"
			}],
			/*200101: [{//纤绣竹棉名片
				data: ["无烫金","无烫银","无水晶字","无印金、银、白","无击凸"],
				info: "抱歉，烫金、烫银、水晶字、印金银白、击凸请您务必选择一项作为制作工艺，否则无法生产"
			}],*/
			200347: [{//黑触感名片
				data: ["无烫金","无烫银","无印金","无印银","无击凸"],
				info: "抱歉，烫金、烫银、印金、印银、击凸请您务必选择一项作为制作工艺，否则无法生产"
			}],
			200556: [{//冠雅纸名片
				data: ["不烫金","不烫银","不印银"],
				info: "抱歉，烫金、烫银、印银请您务必选择一项作为制作工艺，否则无法生产"
			}],
            200581: [{//黑卡
                data: ["不烫金","不烫银","不印银"],
                info: "抱歉，烫金、烫银、印银请您务必选择一项作为制作工艺，否则无法生产"
            }],
            200588: [{//星域
                limit: ["星域星彩250g墨兰"],
                data: ["不烫金","不烫银","不印金","不印银"],
                info: "抱歉，烫金、烫银、印金、印银请您务必选择一项作为制作工艺，否则无法生产"
            }]
		},
		events: {
            "click .attrs .vals .val": "selectedAttrValue", //选中属性值
            "valchange.droplist .droplist input[name]": "selectedDropQuantity", //选中下拉选项中的数量
            "valueChange.location .mod_selectbox": "changeDeliveryRegion", //改变配送区域
            "click .attrs .vals .but": "custom" //自定义
        },
        /**
         * 解析产品附加属性
         * @param {Object} product 产品对象
         * @param {String} [pattr=""] 默认选中的属性值
         * @returns {Object} 产品对象
         */
        set: function(product, pattr){
            var _this = this;
            product = product||{};
            product._valuesAlt = product._valuesAlt||{};
            product._counter = product._counter||1; //默认款数为1
            product._counterUnit = product._counterUnit||"款"; //款数单位
            if(T.hasPMPID(product.categoryId)){
                product._counterUnit = "人";
            }
            product._quantity = 0; //数量
            product._quantityAlt = product._quantityAlt||""; //数量提示
            product._quantityMulriple = product._quantityMulriple>0?product._quantityMulriple:1; //数量倍数
            product._quantityInputUnit = product._quantityInputUnit||""; //数量输入单位
            product._quantityUnit = product._quantityUnit||""; //数量单位
            product._quantityStandardValue = product._quantityStandardValue>0?product._quantityStandardValue:0; //数量属性计价标准
            product._quantityDivide = product._quantityDivide>0?product._quantityDivide:1; //数量必须整除
            product._quantityStep = product._quantityStep>0?product._quantityStep:1; //数量的基数
            product._quantityMinValue = product._quantityMinValue>=0?product._quantityMinValue:1; //数量最小值
            product._quantityMaxValue = product._quantityMaxValue>0?product._quantityMaxValue:1000; //数量最大值
            product._quantityName = product._quantityName||""; //数量属性名
            product._uploaded = product._uploaded||0; //是否是已上传的文件
            product._custom = []; //自定义数量
            product._deliveryDayAlt = product._deliveryDayAlt||'生产周期是指从投入生产到生产完成的时间，货物生产完成并发出后仍需1-3天的配送时间，您即可收到。'; //生产周期说明
            product._address = product._address||T.cookie("_address")||CFG_DB.DEF_PCD; //配送地址
            product._getUUID = function(){
                return T.UUID();
            };
            product.RMB = T.RMB;
            product.DOING = T.DOING;debugger
            product.HAS_WEIGHT = product.HAS_WEIGHT>=0?product.HAS_WEIGHT:CFG_DB.PCFG.NOT_WEIGHT.indexOf("_" + product.productId + "_") < 0;
            product.HAS_DELIVERY_DAY = product.HAS_DELIVERY_DAY>=0?product.HAS_DELIVERY_DAY:CFG_DB.PCFG.NOT_DELIVERY_DAY.indexOf("_" + product.productId + "_") < 0;
            //product.HAS_WEIGHT = true; //是否显示重量
            //product.HAS_DELIVERY_DAY = true; //是否货期
            product.HAS_AVG_PRICE = product.HAS_AVG_PRICE||0; //是否计算平均价
            product.HAS_ONLY_TOTAL_PRICE = product.HAS_ONLY_TOTAL_PRICE||0; //仅总价
            product.HAS_COUNTER_DECLARE = product.HAS_COUNTER_DECLARE||0; //款数声明
            product.AVG_KEEP_FIGURES = product.AVG_KEEP_FIGURES>=0?product.AVG_KEEP_FIGURES:4; //平均价保留小数位数
            product.HAS_INPUT_QUANTITY = product.HAS_INPUT_QUANTITY>=0?product.HAS_INPUT_QUANTITY:0; //是否可输入数量
            product.HAS_SINGLE_HIDE = product.HAS_SINGLE_HIDE>=0?product.HAS_SINGLE_HIDE:0; //是否单个属性隐藏
            product.HAS_SHOW_COUNTER = product.HAS_SHOW_COUNTER>=0?product.HAS_SHOW_COUNTER:1; //是否显示款数
            product.HAS_CUSTOM_QUANTITY = product.HAS_SHOW_COUNTER&&T.hasPMPID(product.categoryId); //是否可自定义数量
            console.log(product);
            _this.compiler("product_options", product, "product_options-" + product.productId);
            _this.analysis(product, pattr); //解析产品属性
            _this.data[product.productId] = product; //缓存产品对象
            _this.$cont.counter({
                min: product._quantityMinValue,
                max: product._quantityMaxValue,
                step: product._quantityStep,
                change: function($input, val){
                    var product = _this.get($input);
                    var name = $input.attr("name")||"";
                    if(product&&name){
                        product._custom = [];
                        product._isCustom = 0;
                        if(name==="counter"){ //款数
                            product._counter = val||this.min;
                        }
                        if(name==="quantity"){ //数量
                            val = Math.round(val/product._quantityDivide)*product._quantityDivide;
                            product.attr[product._quantityName] = val*product._quantityMulriple;
                        }
                        _this.getPrice(product);
                    }
                    $input.val(val);
                    if(this.min<=val){
                        $input.parent().siblings(".val").removeClass("sel");
                    }
                }
            });
            //详情页签切换
            $("#template_product_desc_view").off("click.ptabs").on("click.ptabs", ".ptabs li", function(e){
                var key = $(this).data('index') || $(this).data("target");//新产品 or 老产品
                var index = $(this).index();
                var _top = $("#header_fixed").outerHeight() + $(this).closest(".ptabs").outerHeight();
                var offset = _this.getContentOffset();
                $("html, body").stop(true, true).animate({
                    scrollTop: offset.tops[index] - _top
                }, 400);
            });
            //滚动详情页签联动
            $(window).bind("scroll.pdesc", function (e) {
                _this.focusTabs();
            });
            //配送地址
            if($("#delivery_address").geoLocation)$("#delivery_address").geoLocation({
                level: 3,
                callback: function (value, province, city, district) {
                    console.log('delivery_address==>callback: ' + value + '');
                    $("#delivery_region").geoLocation("setValue", value);
                }
            });
            //提示
            T.TIP({
                id: "pdetail_tips",
                container: '#pdetail',
                trigger: '.icon_help, .vals .val',
                content: function(trigger) {
                    return $(trigger).data("alt_text")||"";
                },
                'max-width': '240px',
                width: 'auto',
                offsetX: 0,
                offsetY: 0
            });
            //货期提示
            T.TIP({
                id: "delivery_date",
                container: "#pdetail",
                trigger: ".delivery_date .lnk",
                content: function(trigger) {
                    return product._deliveryDayAlt;
                },
                'max-width': '285px',
                width: "auto",
                offsetX: 0,
                offsetY: 0
            });
        },
        setCounter: function(data){
            var _this = this;
            T.Each(data.productList, function(i, product){
                $("#template-product_params-"+product.productId+"-view").counter({
                    min: product._quantityMinValue,
                    max: product._quantityMaxValue,
                    step: product._quantityStep,
                    change: function($input, val, flag){debugger
                        if(product._quantityStartValue!=null&&val!=product._quantityMinValue&&val<product._quantityStartValue){
                            val = flag?product._quantityStartValue:0;
                        }
                        var name = $input.attr("name")||"";
                        $input.parent().siblings(".val").removeClass("sel");
                        if(product&&name){
                            val = Math.round(val/product._quantityDivide)*product._quantityDivide;
                            product.attr[product._quantityName] = val*product._quantityMulriple;
                            _this.getPrice(product);
                        }
                        $input.val(val);
                        if(val>0){
                            $(".form_btm .submit", _this.$cont).removeClass("dis");
                        }else{
                            $(".form_btm .submit", _this.$cont).addClass("dis");
                        }
                        if(product.changeCounter){
                            product.changeCounter($input, val, flag);
                        }
                    }
                });
            });
        },
        /**
         * 得到产品对象
         * @param $this
         * @param [e]
         */
        get: function($this, e){
            var _this = this;
            if(!$this||!$this.length){
                return _this.data[_this.data.productId];
            }
            var $options = $this.closest(".options", _this.$cont), $pattr = $this.closest(".pattr", _this.$cont), $attrs = $this.closest(".attrs", _this.$cont);
            var productId = $this.data("product_id")||$attrs.data("product_id")||$pattr.data("product_id")||$options.data("product_id")||"";
            return _this.data[productId];
        },
        /**
         * 选中属性值
         * @param $this
         * @param e
         */
        selectedAttrValue: function($this, e){debugger
            var _this = this;
            if ($this.hasClass("dis")) {
                return;
            }
            var $vals = $this.closest(".vals");
            var atr = $.trim($vals.data("name")||"");
            var val = $.trim($this.data("value")||"");
            var product = _this.get($this, e);
            if(!atr||!val||!product){
                return;
            }
            //$this.addClass("sel").siblings(".val").removeClass("sel");
            //设置属性
            product._custom = [];
            product._isCustom = 0;
            product.attr[atr] = val;
            product._droplist[atr] = "";
            //设置属性图
            if(product.paramImages&&product.paramImages[val]){
                var imgUri = product.paramImages[val];
                $(".zoomimg img", _this.$cont).attr("src", imgUri).data("imguri", imgUri);
                if(_this.imageZoom)_this.imageZoom.load(imgUri);
            }
            if(product.selectedAttrValue){
                product.selectedAttrValue($this, e, {
                    atr: atr,
                    val: val
                });
            }
            _this.analysis(product, _this.getValue(product));
            _this.getPrice(product);
            return;
        },
        /**
         * 选中下拉选项中的数量
         * @param $this
         * @param e
         */
        selectedDropQuantity: function($this, e){
            var _this = this;
            var atr = $.trim($this.data("name")||"");
            var product = _this.get($this, e);
            if(!atr||!product){
                return;
            }
            product._custom = [];
            product._isCustom = 0;
            product._droplist[atr] = $.trim($this.val())||"";
            _this.analysis(product, _this.getValue(product));
            _this.getPrice(product);
        },
        /**
         * 改变配送区域
         * @param $this
         * @param e
         */
        changeDeliveryRegion: function($this, e, data){
            var _this = this;
            data = data||{};
            var address = data.value||CFG_DB.DEF_PCD;
            var product = _this.get($this, e);
            if(!address||!product){
                return;
            }
            //_this.analysis(product, _this.getValue(product));
            _this.getPrice(product, address);
        },
        /**
         * 获取内容各区块的offset.top值
         */
        getContentOffset : function(){
            var _this = this;
            var anchors = [], tops=[];
            var $productDesc = $("#template_product_desc_view");
            var li = $('.desctab li', $productDesc);
            if (li.data('target')) {//老的产品
                li.each(function(i, el){
                    var anchor = $(el).data("target");
                    anchors.push(anchor);
                    tops.push(Math.floor($('.pshow [alt$="'+anchor+'"]', $productDesc).offset().top));
                })
            }else{//新产品
                li.each(function(i, el){
                    var anchor = $(el).data("index");
                    anchors.push(anchor);
                    tops.push(Math.floor($('.p_contents [data-index="'+anchor+'"]', $productDesc).offset().top));
                })
            }
            return {anchors: anchors, tops: tops};
        },
         /**
         * 页签被选中，当点击或者滚动时
         */
        focusTabs: function(){
            var _this = this;
            var $productDesc = $("#template_product_desc_view");
            var li = $('.desctab li', $productDesc);
            if (!li.length) {return;}
            var offset = _this.getContentOffset();
            var scroll_h = $(window).scrollTop() + $("#header_fixed").outerHeight() + li.closest('.desctab').outerHeight()+9;
            var tops = offset.tops;
            if (scroll_h < tops[0]) {
                li.eq(0).addClass("sel").siblings("li").removeClass("sel");
            }else if (scroll_h >= tops[tops.length-1]) {
                li.eq([tops.length-1]).addClass("sel").siblings("li").removeClass("sel");
            }else{
                for (var i = 0; i < tops.length -1; i++) {
                    if(tops[i] <= scroll_h && scroll_h < tops[i+1]){
                        li.eq([i]).addClass("sel").siblings("li").removeClass("sel");
                        break;
                    }
                }
            }
        },
        /**
         * 自定义
         * @param $this
         * @param e
         */
        custom: function($this, e){
            var _this = this;
            var product = _this.get($this, e);
            if(!product){
                return;
            }
            var _getParam = function(){
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
                param._droplist[product._quantityName] = product._droplist[product._quantityName]||"";
                return param;
            };
            if(!product._custom.length){
                product._custom = [];
                product._custom._counter = product._counter;
                product._custom.categoryId = product.categoryId;
                product._custom.HAS_SHOW_COUNTER = 1;
                for(var i=0; i<product._custom._counter; i++){
                    product._custom.push(_getParam());
                }
            }
            var popupObj = T.Popup({
                fixed: false,
                id: "popup-product_custom",
                zIndex: 1800,
                title: "自定义印刷数量",
                content: '<div id="template-product_custom-view"></div>',
                callback: function(_popup){
                    var view = _this.compiler("product_custom", product);
                    var $view = $(view);
                    var _render = function($val){
                        var $pattr = $val.closest(".pattr", $view);
                        var st = $pattr.scrollTop();
                        product._custom.categoryId = product.categoryId;
                        product._custom.HAS_SHOW_COUNTER = 1;
                        _this.compiler("product_custom", product);
                        $(".pattr", $view).scrollTop(st);
                    };
                    //改变数量
                    $view.counter({
                        min:1,
                        max:100,
                        step: 1,
                        change: function($input, val){
                            var product = _this.get($input);
                            if(product&&val!=product._custom._counter){
                                if(product._custom._counter<val){
                                    for(var i=product._custom.length; i<val; i++){
                                        product._custom.push(_getParam());
                                    }
                                }else{
                                    product._custom = product._custom.slice(0, val);
                                }
                                product._custom._counter = val;
                                _render($input);
                            }
                        }
                    });
                    $view.on("click.val", ".attrs .attr .val", function(e){ //选中属性值
                        var $val= $(this);
                        var index = $val.closest(".attr", $view).data("index");
                        var val = $.trim($val.data("value")||"");
                        var product = _this.get($val, e);
                        //设置属性
                        if(index>=0&&val&&product){
                            product._custom[index].attr[product._quantityName] = val;
                            product._custom[index]._droplist[product._quantityName] = "";
                            _render($val);
                        }
                    }).on("valchange.droplist", ".droplist input[name]", function(e){ //选中下拉选项中的数量
                        var $val = $(this);
                        var index = $val.closest(".attr", $view).data("index");
                        var product = _this.get($val, e);
                        if(index>=0&&product){
                            product._custom[index]._droplist[product._quantityName] = $.trim($val.val())||"";
                            _render($val);
                        }
                    }).on("click", ".submit", function(e) { //确认自定义数量
                        product._counter = product._custom._counter;
                        $(".counter [name='counter']").val(product._counter);
                        if(!product._custom.length){
                            product._custom = [];
                            product._isCustom = 0;
                        }else if(product._custom.length==1){
                            product.attr[product._quantityName] = product._custom[0].attr[product._quantityName]||product.attr[product._quantityName];
                            if(parseInt(product.attr[product._quantityName], 10) >= parseInt(product._droplist.firstItem, 10)){
                                product._droplist[product._quantityName] = product.attr[product._quantityName];
                            }else{
                                product._droplist[product._quantityName] = "";
                            }
                            product._droplist[product._quantityName] = product._custom[0]._droplist[product._quantityName]||product._droplist[product._quantityName];
                            product._custom = [];
                            product._isCustom = 0;
                        }else{
                            product._isCustom = 1;
                        }
                        _this.analysis(product, _this.getValue(product));
                        _this.getPrice(product);
                        popupObj.remove();
                    });
                }
            });
            popupObj.on("no", function(){
                product._custom = [];
                product._isCustom = 0;
            });
        },
        /**
         * 获得价格
         * @param {Object} product 产品对象
         * @param {String} [address] 配送地址
         */
        getPrice: function(product, address){debugger
            var _this = this;
            if(product&&product.targetId){
                product = _this.data[product.targetId]||product;
            }
            if (!product.productId || !product._counter){
                return;
            }
            address = (address||product._address||CFG_DB.DEF_PCD).replace(/\^+$/g, "");
            var pattr = "", attrs = [], counter = 0, quantity = 0;
            if(product._custom.length){
                var attr = {};
                T.Each(product.attr, function(k, v){
                    attr[k] = v;
                });
                var _keys = {}; //出现次数
                T.Each(product._custom, function(k, item){
                    attr[product._quantityName] = item._droplist[product._quantityName]||item.attr[product._quantityName]||product.attr[product._quantityName];
                    pattr = _this.getValue(product, attr);
                    if(pattr){
                        counter += 1;
                        quantity += parseInt(attr[product._quantityName], 10)||0;
                        if(_keys[pattr]){
                            _keys[pattr] += 1;
                        }else{
                            attrs.push({
                                productId: product.productId,
                                productParam: pattr,
                                productCount: 1,
                                address: address
                            });
                            _keys[pattr] = 1;
                        }
                    }
                });
                //设置款数
                T.Each(attrs, function(k, item){
                    item.productCount = _keys[item.productParam]||item.productCount;
                });
            }else if(product.productList&&product.productList){
                T.Each(product.productList, function(i, item){
                    pattr = _this.getValue(item);
                    quantity += parseInt(item.attr[item._quantityName], 10)||0;
                    if(pattr&&quantity>0){
                        attrs.push({
                            productId: item.productId,
                            productParam: pattr,
                            productCount: 1,
                            address: address
                        });
                    }
                });
            }else{
                pattr = _this.getValue(product);
                if(pattr&&product.attr){
                    counter = product._counter;
                    quantity = counter * (parseInt(product.attr[product._quantityName], 10)||0);
                    attrs.push({
                        productId: product.productId,
                        productParam: pattr,
                        productCount: (product._counter || 1),
                        address: address
                    });
                }
            }
            var param = T.JSON.stringify(attrs);
            if(product._pattr===param){
                return;
            }
            if(attrs.length){
                $(".form_btm .submit", _this.$cont).removeClass("dis");
            }else{
                product._pattr = "";
                $(".form_btm .submit", _this.$cont).addClass("dis");
                _this.showPrice(product, {
                    giftScore: 0,
                    deliveryDay: 0,
                    deliveryDate: "",
                    valuationMethod: product._valuationMethod||0,
                    valuationValue: 0,
                    counter: counter,
                    counterUnit: product._counterUnit,
                    quantity: '<span class="yellow">' + quantity + '</span> ' + product._quantityUnit,
                    counterAmount: "0.00",
                    discountAmount: "0.00",
                    amountAlt: ""
                });
                return;
            }
            product._pattr = param;
            product._address = address;
            //计算中逻辑
            _this.showPrice(product, {
                giftScore: T.DOING,
                deliveryDay: T.DOING,
                deliveryDate: "",
                valuationMethod: product._valuationMethod||0,
                valuationValue: T.DOING,
                counter: counter,
                counterUnit: product._counterUnit,
                quantity: '<span class="yellow">' + quantity + '</span> ' + product._quantityUnit,
                counterAmount: T.DOING,
                discountAmount: T.DOING,
                amountAlt: ""
            });
            var $dom = $("#template-product_options-"+product.productId+"-view");
            $(".submit .doing", $dom).remove();
            $(".submit", $dom).append('<span class="doing"><span>计算中...</span></span>');
            product._pricing = true;
            console.log(CFG_DS.product.get_price, ":", address);
			T.POST({
				action: _this.action,
				params: { //data:200013,300g铜版纸_2盒_90mm*54mm-覆哑膜_直角,1
					type: "0",
					data: attrs
				},
				success: function(data, params) {
					$(".submit .doing", $dom).remove();
					product._pricing = false;
					if(T.Typeof(data.data)=='Array'&& T.JSON.stringify(params.data)==product._pattr){
						product._discountPrice = 0;
						product._salePrice = 0;
						product._deliveryDay = 0;
						product._valuationMethod = product._valuationMethod||0;
						product._valuationValue = 0;
						product._counter = counter;
						product._quantity = quantity;
						product._hasSupply = 0;
						T.Each(data.data, function(key, value){
							product._discountPrice += value.discountPrice||0;
							product._salePrice += value.price||0;
							product._deliveryDay = Math.max(product._deliveryDay, value.deliveryDay||0);
							product._valuationMethod += value.valuationMethod||0;
							product._valuationValue += value.valuationValue||0;
							product._hasSupply = value.hasSupply||0;
						});
						_this.setPrice(product);
						if(product._hasSupply>0){
							$(".form_btm .submit", $dom).addClass("dis");
						}else{
							$(".form_btm .submit", $dom).removeClass("dis");
						}
						/*//检查禁卖属性
						var dataInfo = _this.checkDisableSale(attrs);
						if(dataInfo.ret){
							T.alt(dataInfo.msg);
							$(".form_btm .submit", $dom).addClass("dis");
						}*/
					}
				}
			});
        },
        /**
         * 检查禁卖属性
         * @param {Array} attrs 提交购物车的产品参数
         */
		checkDisableSale: function(attrs){
            var _this = this, data = {ret: false, msg: ""};
			T.Each(attrs, function(i, attr){
				if(attr && _this.disableSale[attr.pid]){
					T.Each(_this.disableSale[attr.pid], function(k, item){
						var count = 0, productParam = attr.pattr, hasLimit = false;
                        T.Each(item.limit, function(k, v){
                            if(productParam.indexOf(v)>=0){
                                hasLimit = true;
                            }
                        });
                        if(hasLimit || !item.limit){
                            T.Each(item.data, function(k, v){
                                if(productParam.indexOf(v)>=0){
                                    productParam = productParam.replace(v, ''); //解决：不烫金_不烫银_不印_不印_不印
                                    count++;
                                }
                            });
                            if(count==item.data.length){
                                data.ret = true;
                                data.msg = item.info;
                                return false;
                            }
                        }
					});
				}
				if(data.ret) return false;
			});
			return data;
		},
        /**
         * 设置价格
         * @param {Object} product 产品对象
         */
        setPrice: function(product){
            var _this = this;
            if (product._pricing) return;
            var $counter = $("#counter-"+product.productId);
            product._counter = $counter.val()||product._counter||1;
            $counter.val(product._counter);
            if (!product.productId || !product._counter){
                return;
            }
            var counter = product._counter;
            var quantity = product._quantity;
            var discountPrice = product._discountPrice || 0;
            var salePrice = product._salePrice || 0;
            var deliveryDay = product._deliveryDay || 7;
            var valuationMethod = product._valuationMethod || 0;
            var valuationValue = product._valuationValue || 0;
            if (deliveryDay < 1) deliveryDay = 7;
            if (discountPrice <= 0) discountPrice = salePrice;
            var amountAlt = "";
            if (product.productId == 101 || product.productId == 102 || product.productId == 103 || product.productId == 104){
                amountAlt = "（若选用第三方物流配送，请联系客服咨询运费）";
            }
            //平均价
            var avgDiscountPrice = 0;
            if(product.HAS_AVG_PRICE&&product.attr[product._quantityName]){
                var _num = Math.pow(10, product.AVG_KEEP_FIGURES);
                var avgDiscountPrice = Math.round(discountPrice*_num/counter/parseInt(product.attr[product._quantityName], 10))/_num;
            }
            _this.showPrice(product, {
                giftScore: Math.ceil(discountPrice),
                deliveryDay: deliveryDay,
                deliveryDate: T.DeliveryDate("", deliveryDay, 1),
                valuationMethod: valuationMethod,
                valuationValue: valuationValue,
                counter: counter,
                counterUnit: product._counterUnit,
                quantity: '<span  class="yellow">' + quantity + '</span> ' + product._quantityUnit,
                counterAmount: T.RMB(discountPrice / counter),
                discountAmount: T.RMB(discountPrice),
                avgDiscountAmount: T.RMB(avgDiscountPrice),
                deliveryAlt: product._hasSupply>0?"该地区暂不支持配送":"",
                amountAlt: amountAlt
            }, true);
            if(_this.callbacks.getPriceAfter)_this.callbacks.getPriceAfter.call(_this, product);
        },
        /**
         * 显示价格
         * @param {Object} product 产品对象
         * @param {Object} data 要显示的数据
         */
        showPrice: function(product, data, isDone){
            var _this = this;
            if (!product.productId || !product._counter){
                return;
            }
            if(data.valuationMethod==3){ //按个数
                var valuationValue = isDone?Number(data.valuationValue):data.valuationValue;
                data.valuationMethod = "个数：";
                data.valuationValue = '<b class="yellow">'+valuationValue+'</b> <span>个</span>';
            }else if(data.valuationMethod==2){ //按体积
                var valuationValue = isDone?T.RMB(data.valuationValue):data.valuationValue;
                data.valuationMethod = "预估体积：";
                data.valuationValue = '<b class="yellow">'+valuationValue+'</b> <span>立方米</span>';
            }else if(data.valuationMethod==1){ //按面积
                var valuationValue = isDone?T.RMB(data.valuationValue):data.valuationValue;
                data.valuationMethod = "预估面积：";
                data.valuationValue = '<b class="yellow">'+valuationValue+'</b> <span>平方米</span>';
            }else if(data.valuationMethod==0){ //按重量
                var valuationValue = isDone?T.RMB(data.valuationValue):data.valuationValue;
                data.valuationMethod = "预估净重：";
                data.valuationValue = '<b class="yellow">'+valuationValue+'</b> <span>千克</span>';
            }
            var _data = {};
            T.Each(data, function(k, v){
                _data[k + "-" + product.productId] = data[k];
            });
            _this.bindData("data", _data);
        },
        /**
         * 获得属性值
         * @param {Object} product 产品对象
         * @param {Object} [attr] 选中属性
         * @returns {String} 属性值字符串
         */
        getValue: function(product, attr){
            if((product.attrs&&product.attrs[product._quantityName]&&product.attrs[product._quantityName].length)||(product.attr&&product.attr[product._quantityName])){
                return (this.getBaseValue(product, attr) + "-" + this.getAttachValue(product, attr)).replace(/\-+$|\_+$/, "").replace(/\-+/g, "-").replace(/\_+/g, "_"); //去掉属性串多余的分隔符
            }else{
                return "";
            }
        },
        /**
         * 获得基础属性值
         * @param {Object} product 产品对象
         * @param {Object} [attr] 选中属性
         * @returns {String} 基础属性值字符串
         */
        getBaseValue: function(product, attr){
            attr = attr||{};
            var arr  = [];
            if(product.firstNames&&product.firstNames.length){
                for(var name="", i = 0; name=product.firstNames[i]; i++){
                    arr[i] = attr[name]||product._droplist[name]||product.attr[name]||product.attrs[name][0]||"";
                }
            }
            return arr.join("_").replace(/\_+$/, ""); //去掉属性串多余的分隔符
        },
        /**
         * 获得附加属性值
         * @param {Object} product 产品对象
         * @param {Object} [attr] 选中属性
         * @returns {String} 附加属性值字符串
         */
        getAttachValue: function(product, attr){
            attr = attr||{};
            var arr  = [];
            if(product.lastNames&&product.lastNames.length){
                for(var name="", i = 0; name=product.lastNames[i]; i++){
                    arr[i] = attr[name]||product._droplist[name]||product.attr[name]||product.attrs[name][0]||"";
                }
            }
            return arr.join("_").replace(/\_+$/, ""); //去掉属性串多余的分隔符
        },
        /**
         * 获取数量属性名
         * @param {Object} product 产品对象
         * @param name 属性名
         */
        getQuantityName: function(product, names){
            for(var name="", i = 0; name=product.names[i]; i++){
                if(/^数量/.test(name)||/数量$/.test(name)){ //以数量开头或以数量结尾的属性为购买数量
                    if(/^\d+$/.test(product.attr[name])&&/^.*（.*）$/.test(name)){ //如果是没有单位的数量
                        product._quantityUnit = name.replace(/^.*（|）$/g, "");
                    }else if(!/^\d+$/.test(product.attr[name])){
                        product._quantityUnit = String(product.attr[name]).replace(/\d+/g, "");
                    }
                    product._quantityName = name;
                    // 设置下拉首项
                    if(product.attrs[name].length>5){
                        product._droplist.firstItem = String(product.attrs[name][3]).replace(/\D+/g,"") + "+";
                    }
                }
            }
        },
        /**
         * 根据pattr设置默认属性值
         * @param product
         * @param pattr
         */
        setAttr: function(product, pattr){
            if(pattr&&product.names&&product.names.length){
                var pattrs = String(pattr).replace(/\-/g, "_").split("_");
                pattr = String("_"+(pattr||"")+"_").replace(/\-/g, "_");
                product.attr = product.attr||{};
                for(var n=0; n<product.names.length; n++){
                    if(T.Array.indexOf(product.attrs[product.names[n]], pattrs[n])<0){
                        T.Each(product.attrs, function(name, attrs){
                            T.Each(attrs, function(i, attr){
                                if(product.attr[name]!=null&&String(pattr).indexOf("_"+attr+"_")>=0){
                                    product.attr[name] = attr;
                                    if(typeof(product.selectedAttrValue)=="function"){ //选中属性值
                                        product.selectedAttrValue(null, null, {
                                            atr: name,
                                            val: attr
                                        });
                                    }
                                }
                            });
                        });
                    }else{
                        product.attr[product.names[n]] = pattrs[n];
                    }
                }
            }
        },
        /**
         * 设置默认属性值
         * @param {Object} product 产品对象
         * @param {String} [names=""] 属性名集合
         * @returns {Object} 产品对象
         */
        setDefaultValue: function(product, names){
            var _this = this;
            names = names||product.names;
            if(!names||!names.length)return;
            //获取数量属性名
            _this.getQuantityName(product, names);
            for(var name="", i = 0; name=names[i]; i++){
                if(T.Array.indexOf(product.attrs[name], product.attr[name])<0){
                    if(name==product._quantityName&&product.HAS_INPUT_QUANTITY){ //对于可输入数量的数量必须是基数的倍数
                        var quantity = Math.min(Math.abs(parseInt(parseInt(product.attr[name], 10)/product._quantityMulriple, 10)), product._quantityMaxValue);
                        quantity = Math.max(product._quantityStartValue||product._quantityMinValue, quantity);
                        product.attr[name] = quantity*product._quantityMulriple;
                        product.attr[name] = product.attr[name]||product.attrs[name][0]||"";
                    }else{
                        product.attr[name] = product.attrs[name][0]||"";
                    }
                    if(name==product._quantityName){
                        product._quantityUnit = product._quantityUnit||String(product.attr[name]).replace(/\d+/g, "");
                    }
                }
            }
            //设置下拉选中的数量
            if(product.attrs[product._quantityName].length>5&&T.Array.indexOf(product.attrs[product._quantityName], product.attr[product._quantityName])>=3){
                product._droplist[product._quantityName] = product.attr[product._quantityName]||"";
            }
            if(product._droplist[product._quantityName]==null||!product.HAS_CUSTOM_QUANTITY){
                product._droplist[product._quantityName] = "";
            }
            return product;
        },
        /**
         * 设置互斥
         * @param {Object} product 产品对象
         * @param {String} [pattr=""] 默认选中的属性值
         * @returns {Object} 产品对象
         */
        setMutex: function(product, pattr){
            var _this = this;
            if (!product || !product.productId) return;
            var cfg = _this.mutexConfig[product.productId];
            if(cfg){
                T.Each(cfg, function(name, value){
                    if(product.attr[name]){ //有配置互斥
                        T.Each(cfg[name], function(attr, attrs){
                            if(product.attr[name]==attr){ //选中的值与配置的值相等时
                                T.Each(attrs, function(key, vals) {
                                    T.Array.add(product.names, key, false);
                                    if(T.Typeof(vals, /Array/)){
                                        product.attrs[key] = vals;
                                    }else{
                                        T.Each(vals, function(atr, val) {
                                            if(val>-1){
                                                T.Array.add(product.attrs[key], atr, false);
                                            }else{
                                                var arr = [];
                                                T.Each(product.attrs[key], function(i, v) {
                                                    if(atr!=v){
                                                        arr.push(v);
                                                    }
                                                });
                                                product.attrs[key] = arr;
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
                //设置默认属性值
                _this.setDefaultValue(product, product.names);
            }
        },
        /**
         * 解析产品属性
         * @param {Object} product 产品对象
         * @param {String} [pattr=""] 默认选中的属性值
         * @returns {Object} 产品对象
         */
        analysis: function(product, pattr){
			if(product.productId==200032){
				debugger
			}
            var _this = this;
            pattr = pattr||"";
            //解析产品属性名
            _this.analysisNames(product, pattr);
            if (product && product.params && product.baseInfoName) {
                //解析基本属性值
                T.Each(product.params, function(k, param) {
                    var keys = k.replace("-", "_").split("_");
                    //基本属性
                    for (var key="", j = 0; key = keys[j]; j++) {
                        T.Array.add(product.attrs[product.names[j]], key, false);
                    }
                });
                //设置默认属性值
                _this.setDefaultValue(product, product.firstNames);
                //解析产品附加属性
                _this.analysisAttachParams(product, pattr);
            }
            //根据pattr设置默认属性值
            _this.setAttr(product, pattr);
            //设置默认属性值
            _this.setDefaultValue(product, product.names);
            if(product.HAS_INPUT_QUANTITY && product.attr[product._quantityName]){
                product.attr[product._quantityName] = Math.round(product.attr[product._quantityName]/product._quantityDivide)*product._quantityDivide;
            }
            //设置互斥
            _this.setMutex(product, pattr);
            //展示属性
            _this.compiler("product_params", product, "product_params-" + product.productId);
            if(_this.callbacks.analysisAfter)_this.callbacks.analysisAfter.call(_this, product);
            return product;
        },
        /**
         * 解析产品属性名
         * @param {Object} product 产品对象
         * @param {String} [pattr=""] 默认选中的属性值
         * @returns {Object} 产品对象
         */
        analysisNames: function(product, pattr){
            if (product && product.baseInfoName) {
                if(!product._droplist)product._droplist = {}; //下拉选项值
                product._droplist.firstItem = ""; //下拉首项
                //解析产品基础属性
                product.baseInfoName = product.baseInfoName.replace(/\-+$|\_+$/, ""); //去掉属性串多余的分隔符
				
				var baseInfoName = product.baseInfoName;
                var _idx = baseInfoName.indexOf("-");
                var firstName = baseInfoName, lastName = "";
                if (_idx > 0){
                    firstName = baseInfoName.substring(0, _idx);
                    lastName = baseInfoName.substring(_idx+1).replace("-", "_");
                }
                var firstNames = firstName?firstName.split("_"):[]; //基础属性名集合
                var lastNames = lastName?lastName.split("_"):[]; //附加属性名集合
                var names = firstNames.concat(lastNames); //属性名集合
                var values = pattr.replace("-", "_").split("_"); //已选择的属性值数组
                var attrs = {}; //属性值对象数组
                var attr = {};
                product.attr = product.attr||{};
                //创建与属性名等长的属性值二维数组
                for (var name="", i = 0; name=names[i]; i++) {
                    attrs[name] = [];
                    attr[name] = values[i]||product.attr[name]||"";
                }
                product.firstNames = firstNames;
                product.lastNames = lastNames;
                product.names = names;
                if(!product.namesOrder){
                    product.namesOrder = names;
                }
                if(product.params){
                    product.attrs = attrs;
                }
                product.attr = attr;
                //设置默认属性
            }
            product.namesOrder = product.namesOrder||[];
            return product;
        },
        /**
         * 解析产品附加属性
         * @param {Object} product 产品对象
         * @param {String} [pattr=""] 默认选中的属性值
         * @returns {Object} 产品对象
         */
        analysisAttachParams: function(product, pattr){
            var _this = this;
            var key = _this.getBaseValue(product);
            if(product.HAS_INPUT_QUANTITY && product._quantityStandardValue>0){ //自定义数量的产品，属性取法
                var quantity = product.attr[product._quantityName]||"";
                if(quantity){
                    product.attr[product._quantityName] = product._quantityStandardValue;
                    key = _this.getBaseValue(product);
                    product.attr[product._quantityName] = quantity;
                }
            }
            if(key&&product.params[key]){
                T.Each(product.params[key], function(k, vals) {
                    var idx = T.Array.indexOf(product.names, k);
                    if(vals&&idx>=0){
                        T.Each(vals, function(atr, val) {
                            if(val>-1){
                                T.Array.add(product.attrs[product.names[idx]], atr, false);
                            }
                        });
                    }
                });
                //设置默认属性值
                _this.setDefaultValue(product, product.lastNames);
            }
            return product;
        },
        /**
         * 解析产品图片
         * @param {Object} product 产品对象
         * @returns {Object} 产品对象
         */
        analysisImages: function(product){
            if (!product.pImages) {
                product.pImages = product.productImg||null;
            }
            if (T.Typeof(product.pImages, /String/)) {
                product.pImages = product.pImages.split(",");
            }else{
                product.pImages = [];
            }
            T.Each(product.pImages, function(k, v) {
                if (!v || v.length<10) {
                    product.pImages[k] = k?"":product.productImg;
                }
            });
            //设置pImages为5
            for(var h=0; h<5; h++){
                if(!product.pImages[h]){
                    product.pImages[h] = "";
                }
            }
            product.productImgDef = product.pImages[0];
            if(typeof(product.paramImages)!="object"){
                try{
                    product.paramImages = T.JSON.parse(product.paramImages);
                }catch (e){
                    product.paramImages = {};
                }
            }
            product.paramImages = product.paramImages||{};
            return product;
        },
        /**
         * 解析产品描述
         * @param {Object} product 产品对象
         * @returns {Object} 产品对象
         */
        analysisDesc: function(product){
            var _this = this;
            var json = "";
            try{
                json = T.JSON.parse(product.productDesc);
            }catch (e){
                json = product.productDesc;
            }
            var productDesc = [];
            if(typeof(json)==="string"){
                product.TABS = _this.getTabs(json);
            }else{
                T.Each(json, function(i, item){
                    if(item.title&&item.content){
                        productDesc.push(item);
                    }
                });
                product.productDesc = productDesc;
            }
        },
        /**
         * 解析老产品详情页签
         * @param productDesc
         * @returns {Array}
         */
        getTabs: function(productDesc){
            productDesc = productDesc||"";
            var tabs = {
                "ininin_detail": "产品详情",
                "ininin_attr": "规格参数",
                "ininin_display": "产品展示",
                "ininin_tech": "工艺&尺寸",
                "ininin_price": "价格&货期",
                "ininin_note": "下单须知",
                "ininin_transport": "物流介绍",
                "ininin_service": "售后服务"
            };
            var _tabs = [];
            T.Each(tabs, function(k, v){
                if(productDesc.indexOf(k)>=0){
                    _tabs.push({
                        key: k,
                        value: v
                    });
                }
            });
            return _tabs;
        },
        /**
         * 解析空白模板
         * @param {Object} product 产品对象
         * @returns {Object} 产品对象
         */
        analysisTemplatePath: function(product){
            var templatePath = product.templatePath||"";
            var idx = templatePath.lastIndexOf(".");
            var fix = ".rar";
            if(idx>0){
                fix = templatePath.substring(idx);
            }
            if(templatePath){
                product._templateName = product.productName + "-空白模板" + fix;
            }
        },
        getJson: function (str) {
            var json = "";
            try{
                json = T.JSON.parse(str);
            }catch (e){}
            return json;
        }
    });
    return Product;
});