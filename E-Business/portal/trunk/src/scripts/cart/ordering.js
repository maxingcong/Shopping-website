require(["base", "tools", "modules/ordering", "modules/address", "modules/point"], function ($, T, Ordering, ReceiverAddress, TakeAddress) {
    if (!T._LOGED) T.NotLogin();
    var ordering, receiverAddress, takeAddress, PrintOrdering = T.Module({
        uuid: T.uuid(),
        $cont: $("#order"),
        data: {
            ts: "", //购物车ID集合
            cartIds: "", //购物车ID集合
            address: {}, //配送地址
            orderType: 0, //订单类型
            orderCode: "", //订单编号
            productList: [], //商品清单
            productNum: 0, //商品款数
            services: [], //服务清单
            servicePrice: 0, //服务价格
            orderPrice: 0, //订单金额
            orderProductPrice: 0, //订单商品金额（特例：分发订单为订单金额）
            originalProductPrice: 0, //商品金额（购物车或立即购买时的商品金额）
            shipPrice: 0 //订单运费（特例：分发订单将运费记为订单商品金额）
        },
        isFirst: true, //是否首次加载
        status: ['','','',''], //[商品列表,支付信息,服务点地址,运送费用]
        events: {
            "click .dm_list .radio": "checkedDeliveryMethod", //选中配送方式
            "click .goods_list .pdt_del": "changeCartStatus", //删除无法配送的商品
            "click .coord": function($this, e){
                takeAddress.seeMap($this, e);
            }, //查看百度地图
            "click .service_panel .checkbox": "checkedService", //选择优惠服务
            "click .take_adr .upd": "updateTakeAdr", //修改自提点地址
            "click .take_date .radio": "checkedTakeDate", //选中配送时段
            "click .oinfo .submit:not(.dis)": "submit" //提交订单
        },
        init: function(options){
            var _this = this;
            options = options||{};

            //解析参数
            try{
                if(/^[0-9;]+$/.test(T.REQUEST.a)){
                    _this.data.cartIds = T.REQUEST.a||"";
                }else{
                    var parts = T.Params.decode(T.Base64.decode(T.Params.decode(T.REQUEST.a))).split(",");
                    if(parts && parts.length>=1 && parts[0]){
                        if(/^[0-9;]+$/.test(parts[0])){
                            _this.data.cartIds = parts[0]||"";
                        }else{
                            _this.data.ts = parts[0]||"";
                        }
                        _this.data.originalProductPrice = parts[1]||0;
                    }
                }
            }catch(e){}

            //收货地址
            receiverAddress = new ReceiverAddress({
                isCheckedEvent: true,
                callbacks: {
                    loaded: function(data, params){
                        //_this.load();
                    },
                    checked: function(address){
                        address = address||{};
                        if(address.address&&_this.data.address.addressId==address.addressId&&_this.data.address.address===address.address)return;
                        _this.data.address = address||{};
                        if(address.address){
                            $("#address_str").text(address.address.replace(/\^/gi,"")||"无");
                        }
                        //_this.showDeliveryMethod();
                        _this.load({
                            address: address.address||T.cookie('_address')||CFG_DB.DEF_PCD
                        }, function(){});
                    }
                }
            });
        },
        load: function(param, callback){
            var _this = this;
            _this.status[0] = '';
            _this.status[3] = '';
            //商品列表
            _this.getProducts(param, 0);
            if(!_this.isFirst)return;
            //确认订单
            ordering = new Ordering({
                data: {
                    isUserInfo: true,
                    isCoupon: true
                },
                callbacks: {
                    loaded: function(data, params){
                        _this.loaded(data, params, 1);
                    }
                }
            });
            //自提点地址
            takeAddress = new TakeAddress({
                mode: 1,
                params: {
                    type: "0"
                },
                callbacks: {
                    loaded: function(data, params){
                        if(_this.status[0]){
                            _this.disposeProducts();
                        }
                        _this.loaded(data, params, 2);
                    }
                }
            });
        },
        /**
         * 商品列表
         */
        getProducts: function(param, callback){
            var _this = this;
            /*var address = (param.address||CFG_DB.DEF_PCD).replace(/\^+$/g, "");*/
            var address = (param.address||T.cookie('_address')||CFG_DB.DEF_PCD).replace(/\^+$/g, "");
            var prm = {
                address: address
            };
            if(_this.data.cartIds){
                prm.cart_ids = _this.data.cartIds;
            }else if(_this.data.ts){
                prm.date = _this.data.ts;
            }else{
                prm.type = 2;
            }
            T.GET({
                action: "in_order/cart_query_for_order",
                params: prm,
                success: function(data, params) {
                    data = data||{};
                    _this.data.data = data.data||[];
                    _this.data.serviceList = data.serviceList||[];
                    _this.data.orderProductPrice = T.RMB(data.totalProductPrice);
                    _this.data.shipFlag = data.shipFlag>=0?data.shipFlag:1; //1：需要拉取运费
                    _this.data.shipPrice = T.RMB(data.shipPrice);
                    if(_this.data.originalProductPrice>0 && data.totalProductPrice!=_this.data.originalProductPrice){
                        T.cfm('因为您的收货地址与之前选择不同，生产工厂有所变化，故部分商品价格有变，请您确认后购买。', function(_o){
                            _o.remove();
                        }, function(_o){
                            _o.remove();
                            history.back();
                        }, '温馨提示', '确认无误，继续购买', '重新选择');
                    }
                    if(_this.status[2]){
                        _this.disposeProducts();
                    }
                    _this.loaded(data, params, callback);
                },
                failure: function(data, params){
                    _this.backCart(data||{});
                }
            });
        },
        disposeProducts: function(){
            var _this = this;
            var data = _this.data;
            var productList = [], shipPrice = 0;
            var takeAddressIsEnabled = takeAddress.isEnabled(_this.data.address.address||T.cookie('_address')||CFG_DB.DEF_PCD);
            T.Each(data.data, function(i, item){
                T.Each(item.supplierDataList, function(row, supplier){
                    var blockIds = [supplier.supplierId];
                    productList = productList.concat(supplier.productList||[]);
                    T.Each(supplier.productList, function(j, product){
                        blockIds.push(product.productId);
                    });
                    supplier.blockId = supplier.supplierId + T.MD5(blockIds.join("-"));
					if(data.shipFlag!=1 && supplier.shipPrice>=0){
						shipPrice += supplier.shipPrice;
					}
                    //_this.setUsableDeliveryList(supplier); //获取可用的配送方式
                    T.Each(supplier.deliveryList, function(j, delivery){
                        delivery.CHECKED = 0;
                        if(j==0){
                            delivery.CHECKED = 1;
                            supplier.defDeliveryId = delivery.deliveryId;
                        }
                        delivery.takeDate = CFG_DB.TAKE_DATE_LIST[0]||{};
                    });
                    if(!takeAddressIsEnabled){ //如果没有可用自提点地址时，不显示上门自提
                        var deliveryList = [];
                        T.Each(supplier.deliveryList, function(k, delivery){
                            if(delivery.deliveryId!=CFG_DB.FCFID){
                                delivery.CHECKED = 0;
                                if(k==0){
                                    delivery.CHECKED = 1;
                                    supplier.defDeliveryId = delivery.deliveryId;
                                }
                                deliveryList.push(delivery);
                            }
                        });
                        supplier.deliveryList = deliveryList;
                    }
                });
            });
            if(productList.length<1){
                _this.backCart(data);
                return;
            }
			_this.data.shipPrice = T.RMB(shipPrice);
            _this.data.productList = productList;
            //购买流程图
            if(productList.length==1 && T.IsInstallService(productList[0].productId)){
                $("#step_img").attr("src", T.DOMAIN.RESOURCES + "step/3_2.png?" + T.VER);
            }
            data.takeDateList = CFG_DB.TAKE_DATE_LIST;
            data.FCFID = 2; //配送方式=>上门自提ID（Fixed come from id）
            data.FESID = 16;//配送方式=>加急服务ID（Fixed expedited service id）
            data.FDDID = 20;//配送方式=>多地分发ID（Fixed different distribute id）
            data.FHDID = 16;//22;//配送方式=>专车配送ID（Fixed home delivery id）
            _this.compiler("product_list", data);
            _this.data.data = data.data;
			if(data.shipFlag==1){
				_this.getShipPrice({}, 3);
			}else{
                _this.loaded(null, null, 3);
			}
        },
        backCart: function(data){
            T.alt(data.msg || '请先在购物车选择需要购买的商品。', function(_o) {
                _o.remove();
                window.location.replace(T.DOMAIN.CART +'index.html'+ (T.INININ ? '?' + T.INININ : ''));
            }, function(_o) {
                _o.remove();
                window.location.replace(T.DOMAIN.CART +'index.html'+ (T.INININ ? '?' + T.INININ : ''));
            }, '返回购物车');
        },
        /**
         * 获取运费
         * @param {Object} [params] //参数
         * @param {Function||Number} [callback] //回掉函数
         */
        getShipPrice: function(params, callback){
            var _this = this;
			if(_this.data.shipFlag!=1) return;
            $(".submit", _this.$cont).removeClass("dis").append('<span class="doing"><span>计算中...</span></span>');
            var options = [];
            T.Each(_this.data.data, function(i, item){
                var deliveryList = [];
                T.Each(item.supplierDataList, function(row, supplier){
                    var _delivery = {};
                    T.Each(supplier.deliveryList, function (k, delivery) {
                        if (delivery.CHECKED) {
                            _delivery = {
                                deliveryId: delivery.deliveryId,
                                deliveryModeId: delivery.deliveryModeId||0
                            };
                        }
                    });
                    var productList = [];
                    T.Each(supplier.productList, function (k, product) {
                        if(product.hasSupply<1){
                            productList.push({
                                productId: product.productId,
                                productParam: product.productAttr,
                                valuationMethod: product.valuationMethod,
                                valuationValue: product.valuationValue,
                                address: (_this.data.address.address||T.cookie('_address')||CFG_DB.DEF_PCD).replace(/\^+$/g, ""),
                                price: product.price
                            });
                            //valuationMethod
                            // 0=按重量（kg）:约0.15kg
                            // 1=按面积（㎡）:约1㎡
                            // 2=按体积（m³）:约1m³
                            // 3=按个数（个）:1个
                        }
                    });
                    if(_delivery.deliveryId&&productList.length){
                        _delivery.productList = productList;
                        deliveryList.push(_delivery);
                    }
                });
                if(deliveryList.length){
                    options.push({
                        supplierId: item.supplierId,
                        deliveryList: deliveryList
                    });
                }
            });
            //if(!_this.isFirst)T.loading();
            T.POST({
                action: "in_quotation/get_ship_price",
                params: {
                    data: options
                },
                success: function(data, params){
                    //T.loading(true);
                    if(data&&data.shipPrice>=0){ //支持配送
                        $(".dm-price", _this.$cont).addClass("hide");
                        T.Each(data.splitShip, function(i, item){
                            T.Each(item.deliveryList, function(k, dl){
                                var blockIds = [item.supplierId];
                                T.Each(dl.productList, function(j, product){
                                    blockIds.push(product.productId);
                                });
                                dl.blockId = item.supplierId + T.MD5(blockIds.join("-"));
                                $("#split_ship-" + dl.blockId).html(T.RMB(dl.shipPrice)).closest(".dm-price").removeClass("hide");
                            });
                        });
                        $(".submit .doing", _this.$cont).remove();
                        $(".submit", _this.$cont).removeClass("dis");
                        _this.data.shipPrice = data.shipPrice;
                        _this.loaded(data, params, callback);
                    }else{ //不支持配送
                        _this.getShipPriceError(data, params);
                    }
                },
                failure: function(data, params){
                    _this.getShipPriceError(data, params);
                }
            }, function(data, params){
                _this.getShipPriceError(data, params);
            }, function(data, params){
                _this.getShipPriceError(data, params);
            });
            _this.loaded(options, params, callback);
            console.log("getShipPrice==>", T.JSON.stringify(options));
        },
        getShipPriceError: function(data, params){
            var _this = this;
            data = data||{};
            $(".submit .doing", _this.$cont).remove();
            $(".submit", _this.$cont).addClass("dis");
            _this.data.shipPrice = 0;
            _this.loaded(data, params, function(){});
            if(data&&data.shipPrice<0){
                T.alt("您选择的商品暂不支持配送至该收货地址，请您更换收货地址。");
            }else{
                T.alt(data.msg|| T.TIPS.DEF);
            }
        },
        /**
         * 选中配送方式
         * @param {Number} blockId 块ID
         * @param {Number} deliveryId 配送方式ID
         * @param {Object} [data] 自提点地址/送货时间
         * @param {Boolean} [notShip] 是否不用获取运费
         */
        checkedDelivery: function(blockId, deliveryId, data, notShip){
            var _this = this;
            T.Each(_this.data.data, function(i, item){
                T.Each(item.supplierDataList, function(row, supplier){
                    if(supplier.blockId==blockId) {
                        T.Each(supplier.deliveryList, function (k, delivery) {
                            delivery.CHECKED = 0;
                            if (deliveryId == delivery.deliveryId) {
                                delivery.CHECKED = 1;
                                //上门自提
                                if(data&&delivery.deliveryId==CFG_DB.FCFID){
                                    delivery.takeAddress = data; //自提点地址
                                    _this.compiler("point", data, "point-"+supplier.blockId);
                                }
                                //专车配送
                                if(delivery.deliveryId==CFG_DB.FHDID){
                                    delivery.takeDate = data||CFG_DB.TAKE_DATE_LIST[0]; //专车配送，送货时间
                                }
                            }
                        });
                        if(!notShip)_this.getShipPrice();
                    }
                });
            });
            _this.showDeliveryMethod();
        },
        /**
         * 显示配送方式（如果不是同一种配送方式则显示“混合配送”）
         */
        showDeliveryMethod: function(){
            var _this = this;
            var  deliveryId = "", deliveryName = "";
            T.Each(_this.data.data, function(i, item){
                T.Each(item.supplierDataList, function(row, supplier){
                    T.Each(supplier.deliveryList, function(j, delivery){
                        if(delivery.CHECKED){
                            deliveryId = deliveryId||delivery.deliveryId;
                            if(deliveryId==delivery.deliveryId){
                                deliveryName = delivery.deliveryName;
                            }else{
                                deliveryName = "";
                                return false;
                            }
                        }
                    });
                });
            });
            $("#delivery_str").text(deliveryName||"混合配送");
        },
        getProductCount: function(){
            var _this = this;
            var count = 0;
            T.Each(_this.data.data, function(i, item){
                T.Each(item.supplierDataList, function(row, supplier){
                    T.Each(supplier.productList, function (k, product) {
                        if(product.hasSupply<1){
                            count++;
                        }
                    });
                });
            });
            return count;
        },
        /**
         * 加载完成
         */
        complete: function(){
            var _this = this;
            _this.data.productNum = _this.getProductCount()||0;
            _this.data.orderPrice = Number(_this.data.orderProductPrice) + Number(_this.data.shipPrice);
            _this.showDeliveryMethod();
            _this.data.shipDesc = '';
            ordering.data.orderType = _this.data.orderType;
            ordering.data.orderCode = _this.data.orderCode||"";
            ordering.data.productList = _this.data.productList||[];
            ordering.data.productNum = _this.data.productNum||0;
            ordering.data.orderPrice = _this.data.orderPrice||0;
            ordering.data.orderProductPrice = _this.data.orderProductPrice||0;
            ordering.data.shipPrice = _this.data.shipPrice||0;
            ordering.data.couponPrice = _this.data.couponPrice||0;
            ordering.data.couponCodes = "";
            ordering.data.categoryIdName = "categoryId";
            ordering.data.productIdName = "productId";
            ordering.data.productPriceName = "price";
            if(ordering.data.orderProductPrice>0&&_this.data.shipPrice==0){
                _this.data.shipDesc = '（包邮）';
            }
            ordering.getUsableCouponByOrder();
            if(_this.data.productNum<1){
                $(".submit", _this.$cont).addClass("dis");
            }
            //默认展开优惠券
            if (ordering.data.isCoupon && ordering.data.couponList.length > 0) {
                $(".coupon_pay:not(.dis,.sel)", _this.$cont).click();
            }
            if(!_this.isFirst)return;
            _this.isFirst = false;
			$("#address_str").text((_this.data.address.address||"").replace(/\^/gi,"")||"无");
            T.FORM().placeholder(T.DOM.byId('buyer_remark'), "建议填写已经和客服达成一致的说明"); //备注信息
            T.PageLoaded();
        },
        /**
         * 选择配送方式
         * @param $this
         * @param e
         */
        checkedDeliveryMethod: function($this, e){
            var _this = this;
            var $goodsRow = $this.closest(".goods_row", _this.$cont),
                deliveryId = $this.data("delivery_id"),
                blockId = $goodsRow.data("id");
            if(!deliveryId||!blockId)return;
            if(deliveryId==CFG_DB.FCFID){
                takeAddress.show({
                    pcd: _this.data.address.address||"",
                    addressId: $this.data("address_id")||""
                }, function(data){
                    $(".take_date", $goodsRow).hide();
                    $(".take_adr", $goodsRow).show();
                    $this.data("address_id", data.addressId||"");
                    $this.data("pcd", data.address||"");
                    var $dmInfo = $this.closest(".dm_info", _this.$cont);
                    $(".take_adr .upd", $dmInfo).data("address_id", data.addressId||"").data("pcd", data.address||"");
                    _this.checkedDelivery(blockId, deliveryId, data, $this.hasClass("sel"));
                    $this.addClass("sel").siblings(".sel").removeClass("sel");
                });
            }else if(deliveryId==CFG_DB.FHDID){
                $(".take_adr", $goodsRow).hide();
                $(".take_date", $goodsRow).show();
                _this.checkedDelivery(blockId, deliveryId, null, $this.hasClass("sel"));
                $this.addClass("sel").siblings(".sel").removeClass("sel");
            }else{
                $(".take_adr", $goodsRow).hide();
                $(".take_date", $goodsRow).hide();
                _this.checkedDelivery(blockId, deliveryId, null, $this.hasClass("sel"));
                $this.addClass("sel").siblings(".sel").removeClass("sel");
            }
        },
        /**
         * 选中配送时段
         * @param $this
         * @param e
         */
        checkedTakeDate: function($this, e){
            var _this = this;
            var dateId = $this.data("date_id");
            if(!dateId)return;
            var deliveryId = CFG_DB.FHDID,
                blockId = $this.closest(".goods_row", _this.$cont).data("id");
            var data = T.Array.get(CFG_DB.TAKE_DATE_LIST, dateId, "dateId");
            if(!data||!deliveryId||!blockId)return;
            var $radios = $this.closest(".radios", _this.$cont);
            $(".sel", $radios).removeClass("sel");
            $this.addClass("sel");
            _this.checkedDelivery(blockId, deliveryId, data, true);
        },
        /**
         * 修改自提点地址
         * @param $this
         * @param e
         */
        updateTakeAdr: function($this, e){
            var _this = this;
            var $dmInfo = $this.closest(".dm_info", _this.$cont);
            var $radio = $(".dm_list [data-delivery_id='2']", $dmInfo);
            $radio.click();
            return;
        },
        /**
         * 删除无法配送的商品
         * @param $this
         * @param e
         */
        changeCartStatus: function($this, e){
            var _this = this;
            var $item = $this.closest(".pdt_item ", _this.$cont);
            var cartId = $item.data("cart_id");
            if(!cartId)return;
            T.POST({
                action: CFG_DS.mycart.chk,
                params: {
                    cart_ids: cartId,
                    status: "0"
                },
                success:  function (data, params) {
                    var $el = $item;
                    var $goodsItem = $item.closest(".goods_item", _this.$cont);
                    if(!$item.siblings(".pdt_item").length){
                        $el = $this.closest(".goods_row ", _this.$cont);
                    }
                    var product = T.Array.get(_this.data.productList, cartId, "cartId");
                    if(product){
                        product._hasDelete = 1;
                    }
                    $el.animate({
                        opacity: 0
                    }, 300, function() {
                        $el.remove();
                        if($(".pdt_item", $goodsItem).length<1){
                            $goodsItem.remove();
                        }
                        if($(".pdt_item", _this.$cont).length<1){
                            location.replace(T.DOMAIN.CART + "index.html");
                        }
                    });
                    _this.load({
                        address: _this.data.address.address||T.cookie('_address')||CFG_DB.DEF_PCD
                    }, function(){});
                }
            });
        },
        /**
         * 组装订单参数
         */
        getParams: function(){
            var _this = this;
            var data = [], productNumber = 0, productDeleteNumber = 0, errorCount = 0;
            T.Each(_this.data.data, function(i, item){
                var deliveryList = [];
                T.Each(item.supplierDataList, function(row, supplier){
                    var _delivery = {};
                    T.Each(supplier.deliveryList, function (k, delivery) {
                        if (delivery.CHECKED) {
                            if(delivery.deliveryId==CFG_DB.FCFID){ //上门自提
                                if(delivery.takeAddress&&delivery.takeAddress.addressId){
                                    _delivery.takeAddressId = delivery.takeAddress.addressId;
                                }else{
                                    errorCount++;
                                    T.msg("请选择自提点！");
                                    return false;
                                }
                            }else if(delivery.deliveryId==CFG_DB.FHDID){ //专车配送
                                if(delivery.takeDate&&delivery.takeDate.dateId){
                                    _delivery.takeDate = delivery.takeDate.dateId;
                                }else{
                                    errorCount++;
                                    T.msg("请选择配送时间！");
                                    return false;
                                }
                            }
                            //配送方式
                            _delivery.deliveryId = delivery.deliveryId;
                            _delivery.deliveryModeId = delivery.deliveryModeId||0;
                        }
                    });
                    var cartIdList = []; //购物车商品集合
                    T.Each(supplier.productList, function (k, product) {
                        if(product.hasSupply<1&&!product._hasDelete){ //筛选可配送的商品
                            cartIdList.push(product.cartId);
                            productNumber++;
                        }
                        if(product._hasDelete){
                            productDeleteNumber++;
                        }
                    });
                    if(!_delivery.deliveryId){
                        errorCount++;
                        //T.msg("请选择配送方式！");
                        return false;
                    }else if(_delivery.deliveryId&&cartIdList.length){
                        _delivery.cartIdList = cartIdList;
                        deliveryList.push(_delivery);
                    }
                });
                if(errorCount<1&&deliveryList.length){
                    data.push({
                        supplierId: item.supplierId,
                        deliveryList: deliveryList
                    });
                }else{
                    return false;
                }
            });
            if(_this.data.productList.length!=(productNumber+productDeleteNumber)){
                T.alt("您好！您的商品中部分印刷商品，配送范围无法覆盖您选择的收货地址，请更换其它印刷商品或删除后再提交订单。");
                return false;
            }
            return data;
        },
        /**
         * 提交订单
         * @param $this
         * @param e
         */
        submit: function($this, e){
            var _this = this;
            if (!_this.data.address||!_this.data.address.addressId) {
                T.msg('请您填写收货人联系方式，以便于商品到达后及时联系您');
                return;
            }
            var options = _this.getParams();
            if(!options||!options.length)return;
            var params = {
                address_id: _this.data.address.addressId,
                data: options,
                buyer_remark: $("#buyer_remark").val()
            };
            //优惠服务
            if(_this.data.services.length){
                params.services = _this.data.services;
            }
            params = ordering.getParams(params);
            if(params){
				ordering.data.address = _this.data.address||{};
				ordering.submit("in_order/order_create", params);
            }
        },
        /*/!**
         * 商品支持配送方式特殊处理（如：KT版）
         * @param supplier 供应信息
         *!/
        setUsableDeliveryList: function(supplier){
            supplier = supplier||{};
            var special = false, products = {};
            T.Each(supplier.productList, function(i, product){
                if(CFG_DB.HD_PRO[product.productId]){
                    products[product.productId] = product;
                    special = true;
                }
            });
            if(!special)return;
            //排序
            //CFG_DB.FCFID = 2; //配送方式=>上门自提ID（Fixed come from id）
            //CFG_DB.FNDID = 17;//配送方式=>普通快递ID（Fixed Normal delivery id）
            //CFG_DB.FESID = 18;//配送方式=>加急服务ID（Fixed expedited service id）
            //CFG_DB.FDDID = 20;//配送方式=>多地分发ID（Fixed different distribute id）
            //CFG_DB.FHDID = 16;//22;//配送方式=>专车配送ID（Fixed home delivery id）
            var fcfList = [], fhdList = [], arr = [];
            T.Each(supplier.deliveryList, function(i, delivery){
                if(delivery.deliveryId==CFG_DB.FCFID){//上门自提
                    fcfList = [delivery];
                }else if(delivery.deliveryId==CFG_DB.FHDID){//专车配送
                    fhdList = [delivery];
                }else{
                    arr.push(delivery);
                }
            });
            //KT板特殊处理（最长边超过1米只支持专车配送，小于等于1米支持专车配送和上门自提）
            if(products[200036] && products[200036].productAttr){ //计算最长边长
                var attrs = T.getRequest(products[200036].productAttr.replace("-","_"), "_", ":");
                var size = (T.RE.size.exec(attrs["成品尺寸"]||'')||[])[0]||"";
                var sizes = size.split("*");
                var onlyFHD = false;
                if(sizes[0]&&sizes[1]){ //最长边长是否小于等于1
                    onlyFHD = Math.max(parseFloat(sizes[0]), parseFloat(sizes[1]))>1;
                }
                if(onlyFHD){//最长边大1米时，仅支持专车配送
                    supplier.deliveryList = fhdList;
                }else{ //最长边小于等于1米时，仅支持专车配送和上门自提
                    supplier.deliveryList = fhdList.concat(fcfList);
                }
            }
        },*/
        /**
         * 选择优惠服务
         * @param $this
         * @param e
         */
        checkedService: function ($this, e){
            var _this = this,
                checked = $this.hasClass("sel"),
                $item = $this.closest(".service_item"),
                $list = $this.closest(".service_list"),
                serviceId = $item.data("id");
            $(".checkbox", $list).removeClass("sel");
            var obj = T.Array.get(_this.data.serviceList, serviceId, "serviceId");
            if(checked){
                _this.data.servicePrice = 0;
                _this.data.services = [];
            }else if(obj){
                $this.addClass("sel");
                _this.data.servicePrice =  parseFloat(obj.servicePrice);
                _this.data.services = [obj.serviceId];
            }else{
                _this.data.servicePrice = 0;
                _this.data.services = [];
            }
            ordering.data.orderProductPrice = T.Number.add(_this.data.orderProductPrice, _this.data.servicePrice);
            ordering.data.orderPrice = T.Number.add(_this.data.orderPrice, _this.data.servicePrice);
            ordering.data.servicePrice = _this.data.servicePrice; //服务价格
            ordering.data.services = _this.data.services;
            ordering.getUsableCouponByOrder();
        }
    });
    T.Loader(function(){
        new PrintOrdering();
    });
});