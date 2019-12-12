define("design/product/main", ["base", "tools", "modules/ordering", "design/params", "design/price", "modules/uploader", "widgets/time_bucket"], function($, T, Ordering, ProductParams, ProductPrice, Uploader, TimeBucket){
    "use strict";
    if (!T._LOGED) T.NotLogin();
    function DemandMain(options){}
    DemandMain.prototype = {
        data: {
            isUpdate: 0, //是否为修改
            isCoupon: true, //是否使用优惠券抵扣
            isVIPLevel: true, //是否支持会员折扣
            categoryId: T.REQUEST.cid||"", //设计服务分类ID
            productId: T.REQUEST.pid||"", //设计服务产品ID,
            productParam: T.REQUEST.param||"", //设计服务产品属性,
            generalState: T.REQUEST.expedited||0, //是否加急
            product: {}, //产品信息
            counter: parseInt(T.REQUEST.counter, 10)||1, //款数
            orderType: 10, //订单类型
            orderCode: T.REQUEST.o||"", //订单编号
            relationOrderCode: T.REQUEST.ro||"", //关联订单编号
            relationOrderProductId: T.REQUEST.rop||"", //关联订单商品ID
            quotationId: T.REQUEST.qo||"",
            productList: [], //商品清单
            productNum: 1, //商品款数
            price: 0, //现价
            costPrice: 0, //原价
            giftScore: 0, //积分
            orderPrice: 0, //订单金额
            orderProductPrice: 0, //订单商品金额
            shipPrice: 0, //订单运费
            contactTime: "", //联系时段
            demand: {}, //设计需求
            paramsInfo: {}, //需求信息
            agreement: true, //阅读并接受 《云印设计服务协议》
            custom: {
                names: [], //属性名集合
                values: {} //属性值集合
            }, //定制属性
            options: {
                names: [], //属性名集合
                values: {} //属性值集合
            }, //可选属性
            attr: {}, //选择的属性
            disAttr: {}, //关联印刷订单时，不可修改的属性
            disKeys: {}, //不可选的属性值
            attrStyles: {
                "洁白系": "color color1",
                "蓝色系": "color color2",
                "深灰系": "color color3",
                "橙黄系": "color color4",
                "红色系": "color color5",
                "绿色系": "color color6"
            }, //属性样式
            placeholders: {
                "contact": "请填写联系人",
                "phone": "请填写手机号码",
                "qq": "请填写QQ",
                "buyer_remark": "建议填写已经和客服达成一致的说明"
            },
            isDatum: 0,//是否必须上传设计素材
            isMulti: false, //是否多人制作
            required: false, //是否必填
            datumList: [], //素材列表
            cardParams: [], // 名片参数
            printProduct: {}, //关联印刷订单产品信息
            printProductList: [], //关联印刷订单产品列表
            relationPrintOrderSerialNumber: [], //关联印刷订单商品序号
            isRelationPrintOrder: 0 //是否已关联印刷订单
        },
        uploader: Uploader(),
        pdtParams: ProductParams(),
        pdtPrice: ProductPrice(),
        $cont: $("#demand"),
        status: ['','','','',''], //[支付信息,设计服务产品,订单信息,设计素材,拉取价格]
        init: function(options){
            var _this = this,
                opts = options||{};
            var local = location.href.substring(0, location.href.indexOf(".html"));
            _this.data.productId = local.substring(local.lastIndexOf("/")+1)||"";
            //解析定制属性
            var ret = _this.getOptions(opts.custom);
            ret.namesOrder = opts.namesOrder || ret.names;
            _this.data.custom = ret;
            _this.data.optionsTemplateName = opts.optionsTemplateName||"";
            _this.data.customTemplateName = opts.customTemplateName||"";
            //_this.data.initFixed = opts.initFixed||{};//固定的
            _this.data.placeholders =  $.extend(_this.data.placeholders, opts.placeholders);
            _this.data.isMulti = opts.isMulti;
            _this.data.required = opts.required;
            //支付信息
            if(opts.isCoupon!=null){
                _this.data.isCoupon = opts.isCoupon; //是否使用优惠券抵扣
            }
            if(opts.isVIPLevel!=null){
                _this.data.isVIPLevel = opts.isVIPLevel; //是否支持会员折扣
            }
            if(opts.isContactTime){ //是否有联系时段
                _this.data.contactTime = "下单后立即联系";
            }
            _this.pdtParams.on("rendered", function(opts){
                _this.data.productParam = _this.pdtParams.getValue();
                _this.getPrice();//拉取价格
            }).on("change.counter", function(opts, counter){
                _this.data.counter = counter;
                //拉取价格
                _this.getPrice();
            });
            var isFirst = true;
            _this.pdtPrice.on("success", function(data, paramsData){
                if(!data)return;
                _this.data.orderPrice = data.price; //现价
                _this.data.orderProductPrice = data.price; //现价
                _this.data.product.price = data.price; //现价
                _this.data.price = data.price; //现价
                _this.data.costPrice = data.costPrice; //原价
                _this.data.giftScore = data.giftScore; //积分
                if(isFirst){
                    _this.data.product.price = data.price; //现价
                    isFirst = false;
                    _this.loaded(4);
                }else{
                    _this.ordering.data.productNum = _this.data.counter||1;
                    _this.ordering.data.orderPrice = data.price;
                    _this.ordering.data.orderProductPrice = data.price;
                    _this.ordering.getUsableCouponByOrder();
                }
                T.BindData("data", data, true);
                $(".submit .doing", _this.$cont).remove();
            }).on("pricing", function(){
                $(".submit", _this.$cont).append('<span class="doing"><span>计算中...</span></span>');
            });
            //加载数据
            if(_this.data.orderCode){//已建的订单编号
                _this.data.isCoupon = false;
                _this.data.isVIPLevel = false;
                //支付信息
                _this.ordering = new Ordering({
                    data: {
                        isUserInfo: true,
                        isCoupon: _this.data.isCoupon,
                        isWallet: false,
                        isCanMonthly: false,
                        isVIPLevel: _this.data.isVIPLevel
                    },
                    callbacks: {
                        loaded: function(data){
                            _this.loaded(0);
                        }
                    }
                });
                _this.getProduct(1); //设计服务产品
                _this.getOrder(2); //订单信息
                _this.getDemand(3); //设计素材
                _this.loaded(4); //拉取价格
            }else{
                //支付信息
                _this.ordering = new Ordering({
                    data: {
                        isUserInfo: true,
                        isCoupon: _this.data.isCoupon,
                        isWallet: false,
                        isCanMonthly: false,
                        isVIPLevel: _this.data.isVIPLevel
                    },
                    callbacks: {
                        loaded: function(data){
                            _this.loaded(0);
                        }
                    }
                });
                _this.getProduct(1); //设计服务产品
                if(_this.data.relationOrderCode || _this.data.quotationId){
                    _this.getOrder(2); //订单信息
                }else{
                    _this.loaded(2); //订单信息
                }
                _this.loaded(3); //设计素材
            }
            //绑定事件
            _this.events();
        },
        //默认配置数据
        cfgData: {
            "行业": "通用行业;IT互联网;建筑装潢;批发零售;教育科研;房产物业;花卉礼品;机械制造;家居装饰;医疗卫生;电信科技;农林化工;餐饮旅游;交通运输;水利环保;美容妆饰;金融保险;文化体育;司法律政;其他",
            "风格": "商务;活泼;简洁;文艺;中国风;欧美风;古朴;其他",
            "色系": "洁白系;蓝色系;深灰系;橙黄系;红色系;绿色系;其他"
        },
        getOptions: function(data){
            var _this = this;
            var options = {
                names: [],
                values: {}
            };
            T.Each(data, function(i, item) {
                item.attrValue = item.attrValue||_this.cfgData[item.attrName]||"";
                if(item.attrName && item.attrValue){
                    options.names.push(item.attrName);
                    options.values[item.attrName] = [];
                    var parts = String(item.attrValue).split(";");
                    T.Each(parts, function(i, v){
                        if(v!="" && v!=null){
                            options.values[item.attrName].push(v);
                        }
                    });
                }
            });
            options.namesOrder = options.names;
            return options;
        },
        getJson: function (str) {
            var json = "";
            try{
                json = T.JSON.parse(str);
            }catch (e){}
            return json;
        },
        /**
         * 查询设计产品
         * @param {Number|Function} callback 回调
         */
        getProduct: function(callback){
            var _this = this;
            T.GET({
                action: "in_product_new/web_design/query_design_product_detail",
                params: {
                    design_product_id: _this.data.productId
                },
                success: function(data, params) {
                    data.showType = Number(data.showType)||0; //展示方式，1：单个属性不显示
                    data.params = _this.getJson(data.priceInfo);
                    data.pattr = _this.data.productParam || "";
                    var options = _this.getOptions(data.productAttributes);
                    _this.data.options = options;
                    document.title = data.designCategoryName + "-" + data.designProductName;
                    _this.data.product = $.extend(true, data, _this.pdtParams.cfg[data.designProductId]);
                    _this.pdtParams.init(_this.data.product);
                    //_this.getPrice(); //拉取价格
                    _this.loaded(callback);
                },
                failure: function(data, params){
                    T.alt(data.msg || '该设计产品已下架，请选择其他设计产品。', function(_o) {
                        _o.remove();
                        window.location.replace(T.DOMAIN.DESIGN);
                    }, function(_o) {
                        _o.remove();
                        window.location.replace(T.DOMAIN.DESIGN);
                    }, "返回设计服务列表");
                }
            });
        },
        /**
         * 查询订单信息
         * @param {Number|Function} callback 回调
         */
        getOrder: function(callback){
            var _this = this;
            T.GET({
                action:"in_order/order_query",
                params: {
                    order_code: _this.data.orderCode || _this.data.relationOrderCode
                },
                success: function(data, params) {
                    data.orderList = data.orderList || [];
                    var order = data.orderList[0] || {};
                    if(order.type==10){//是设计订单，则为修改
                        _this.data.isUpdate = 1;//修改
                    }else if(order.type==0){//是印刷订单
                        _this.data.printProductList = [];
                        T.Each(order.orderProductList, function(i, product){
                            if(product.orderProductId==_this.data.relationOrderProductId){
                                product.attrs = (product.productAttr||"").replace(/-/g, "_").split("_");
                                _this.data.isRelationPrintOrder = true;
                                _this.data.printProduct = product;
                                _this.data.printProductList.push(product);
                            }
                        });
                        if(_this.data.isMulti){ //名片多人制作
                            _this.data.printProductList = [];
                            var size = "";
                            T.Each(_this.data.options.values["尺寸"], function(i, value){
                                if(_this.data.printProduct.productAttr.indexOf(value)>=0){
                                    size = value;
                                }
                            });
                            T.Each(order.orderProductList, function(i, product){
                                if(T.hasPMPID(product.categoryId) && product.productAttr.indexOf(size)>=0){
                                    _this.data.printProductList.push(product);
                                    _this.data.relationPrintOrderSerialNumber.push(product.serialNumber);
                                    _this.data.cardParams.push([product.orderProductId, product.productName, product.productAttr, product.quantity]);
                                    if(product.orderProductId==_this.data.relationOrderProductId){
                                        product.attrs = (product.productAttr||"").replace(/-/g, "_").split("_");
                                        _this.data.printProduct = product;
                                    }
                                }
                            });
                            if(_this.data.printProductList.length){
                                _this.data.isRelationPrintOrder = true;
                            }
                        }
                    }else{
                        location.search = "";
                    }
                    _this.data.order = order;
                    _this.loaded(callback);
                }
            });
        },
        /**
         * 查询设计素材
         * @param {Number|Function} callback 回调
         */
        getDemand: function(callback){
            var _this = this;
            T.GET({
                action: "in_order/query_demand",
                params: {
                    order_code: _this.data.orderCode
                },
                success: function(data, params){
                    data.demandList = data.demandList||[];
                    _this.data.demand = data.demandList[0]||{};
                    _this.data.paramsInfo = _this.data.demand.paramsInfo||{};
                    _this.loaded(callback);
                }
            });
        },
        /**
         * 查询价格
         * @param {Number|Function} callback 回调
         */
        getPrice: function(){
            var _this = this;
            _this.pdtPrice.getPrice([{
                productId: _this.data.productId,
                productParam: _this.data.productParam,
                productCount: _this.data.counter,
                generalState: _this.data.generalState||0 //是否加急
            }], _this.data.product);
        },
        /**
         * 获取表单参数
         * @returns {*|{}}
         */
        getFormParams: function(){
            var _this = this;
            var params = {};
            $("[name]", _this.$cont).each(function(i, el){
                var $el = $(el),
                    name = $el.attr("name"),
                    value = $.trim($el.val());
                params[name] = value;
            });
            return params;
        },
        /**
         * 获取提交参数
         * @param params
         * @returns {*|{}}
         */
        getParams: function (params){debugger
            var _this = this;
            params = params||{};
            var param = {},
                forms = _this.getFormParams();
            if(_this.data.required){ //检查必填字段是否有值
                var bool = false;
                T.Each(_this.data.options.names.concat(_this.data.custom.names), function(i, name){
                    var value = _this.data.attr[name];
                    if(name && (value==null || value==="")){
                        T.msg("请选择" + name);
                        bool = true;
                        return false;
                    }
                });
                if(bool) return null;
            }
            T.Each(_this.data.custom.names.concat(_this.data.options.names), function(i, name){
                var value = _this.data.attr[name];
                if(name && value!=null && value!==""){
                    param[name] = value;
                }
            });
            if(_this.uploader.fileList.length){
                param.materials = _this.uploader.fileList;
            }
            if(_this.data.isUpdate) {//修改需求
                var demand = _this.data.demand || {},
                paramsInfo = demand.paramsInfo || {};
                params.demand_type = 1;
                params.order_code = _this.data.orderCode;
                param.demand_id = demand.demandId;
                param.order_product_id = demand.orderProductId;
                param.design_service_id = demand.designServiceId;
                //关联印刷订单商品
                if (paramsInfo['关联印刷订单商品'] && paramsInfo['商品属性']) {
                    param.relationPrintProductId = paramsInfo.relationPrintProductId;
                    param['关联印刷订单商品'] = paramsInfo['关联印刷订单商品'];
                    param['商品属性'] = paramsInfo['商品属性'];
                }
                if(paramsInfo['关联印刷订单']){
                    param['关联印刷订单'] = paramsInfo['关联印刷订单'];
                }
                if(paramsInfo['关联印刷订单商品序号']){
                    param['关联印刷订单商品序号'] = paramsInfo['关联印刷订单商品序号'];
                }
                param['类别'] = paramsInfo['类别'] || (_this.data.product.designCategoryName + '-' + _this.data.product.designProductName);
                if (demand.designServiceId == 77 || demand.designServiceId == 78) { //APP端模板设计
                    param["模板ID"] = paramsInfo["模板ID"] || "";
                    param["模板源文件"] = paramsInfo["模板源文件"] || "";
                }
            }else{
                //params.data = _this.data.product.designProductId + "," + _this.data.counter;
                params.data = [{
                    productId: _this.data.productId,
                    productParam: _this.data.productParam,
                    generalState: _this.data.generalState,
                    productCount: _this.data.counter
                }];
                param.design_service_id = _this.data.product.designProductId;
                //关联印刷订单商品
                if(_this.data.isRelationPrintOrder){
                    param.relationPrintProductId = _this.data.printProduct.productId;
                    if(_this.data.printProductList.length>1){ //关联多款印刷订单商品时，只传订单号
                        param['关联印刷订单'] = _this.data.printProduct.orderCode;
                        param['关联印刷订单商品序号'] = _this.data.relationPrintOrderSerialNumber.join(',');
                    }else{
                        param['关联印刷订单商品'] = _this.data.printProduct.orderCode + "-" + _this.data.printProduct.serialNumber;
                        param['商品属性'] = _this.data.printProduct.productAttr;
                    }
                }
                param["类别"] = _this.data.product.designCategoryName + '-' + _this.data.product.designProductName;
            }
            var ret = _this.trigger("get.params", param, forms);
            if(!ret) return null;
            params.param = [param];

            //设计询价单
            if(_this.data.quotationId && _this.data.quotationSubId){
                params.quotation_id = _this.data.quotationId;
                params.quotation_sub_id = _this.data.quotationSubId;
            }
            //联系人
            if(forms.contact!==""){
                params.contact_name = forms.contact;
            }else{
                T.msg("请填写联系人");
                return null;
            }
            //手机号码
            if(T.RE.mobile.test(forms.phone)){
                params.contact_phone = forms.phone;
            }else if(forms.phone!==""){
                T.msg("请填写正确的手机号码");
                return null;
            }else{
                T.msg("请填写手机号码");
                return null;
            }
            //QQ
            if(T.RE.qq.test(forms.qq)){
                params.contact_qq = forms.qq;
            }else if(forms.qq!==""){
                T.msg("请填写正确的QQ");
                return null;
            }
            //联系时段
            if(_this.data.contactTime){
                params.contact_time = _this.data.contactTime;
            }
            //云印设计服务协议
            if(!_this.data.agreement){
                T.msg("请阅读并接受《云印设计服务协议》");
                return null;
            }
            if(!_this.data.isUpdate){//非修改需求
                //获取支付参数
                params.buyer_remark = forms.buyer_remark;
                params = _this.ordering.getParams(params);
            }
            debugger;
            return params;
        },
        /**
         * 提交需求
         * @param params
         */
        submit: function(params){
            var _this = this;
            if($(".submit .doing", _this.$cont).length)return;
            params = _this.getParams(params||{});
            if (!_this.isInputOk()) {
                return;
            }
            if(_this.uploader && _this.uploader.isUploading){//正在上传
                T.msg("正在上传文件，请稍后提交");
                return;
            }
            if(!params) return;
            if(_this.data.isUpdate){
                T.POST({
                    action: "in_order/save_demand",
                    params: params,
                    success: function(data, params) {
                        _this.ordering.goDetail(_this.data, 1);
                    }
                });
            }else{
                $(".submit", _this.$cont).addClass("dis");
                _this.timeObj = setTimeout(function(){
                    $(".submit", _this.$cont).removeClass("dis");
                }, 30000);
                T.POST({
                    action: "in_order/design_order_create_for_web",
                    params: params,
                    success: function(data, params){
                        //$(".submit", _this.$cont).removeClass("dis");
                        data = data||{};
                        /*支付时resultType取值
                         0=未选择支付方式，创建订单成功
                         1=选择支付方式，部分支付成功
                         2=选择支付方式，完全支付成功
                         3=优惠券失败
                         4=支付密码错误
                         5=月结月不足or不可用
                         6=赠送设计服务，支付成功*/
                        if (params.pay_id == 1) {
                            _this.ordering.goDetail(data, 1);
                        } else if(_this.data.isUpdate){//修改需求
                            _this.ordering.goDetail(_this.data);
                        } else if(data.orderCode || data.resultType>=0) {
                            if (data.orderCode && data.resultType < 2) { //部分支付成功
                                _this.ordering.goPayment(data);
                            }else if (data.orderCode && data.resultType == 2) { //完全支付成功
                                _this.ordering.goDetail(data, 1);
                            } else if(data.orderCode){
                                _this.ordering.goPayment(data);
                            }else{
                                _this.ordering.error(data||{});
                            }
                        }else{
                            _this.ordering.error(data||{});
                        }
                        if(_this.timeObj){
                            clearTimeout(_this.timeObj);
                        }
                    },
                    failure: function(data, params){
                        $(".submit", _this.$cont).removeClass("dis");
                        data = data||{};
                        if (data.resultType == 3) { //优惠券不可用
                            T.msg(data.msg || '优惠券不可用，请重新选择优惠券！');
                            setTimeout(function() {
                                location.reload();
                            }, 1000);
                        } else if (data.resultType == 4) { //支付密码错误
                            T.msg(data.msg || '支付密码错误，请重新输入！');
                        } else if (data.resultType == 5) { //月结月不足or不可用
                            T.msg(data.msg || '月结帐户余额不足，请选择其他支付方式！');
                        }else{
                            _this.ordering.error(data||{});
                        }
                        if(_this.timeObj){
                            clearTimeout(_this.timeObj);
                        }
                    },
                    error: function(data, params){
                        $(".submit", _this.$cont).removeClass("dis");
                        T.alt(data.msg || T.TIP.DEF);
                    }
                }, function(data, params){
                    $(".submit", _this.$cont).removeClass("dis");
                    _this.ordering.error(data||{}, 1);
                }, function(data, params){
                    $(".submit", _this.$cont).removeClass("dis");
                    _this.ordering.error(data||{}, 1);
                });
            }
        },
        /**
         * 设置关联印刷产品属性
         */
        setRelationAttr: function(){
            var _this = this;
            T.Each(_this.data.options.values, function(name, values){
                var ret = [];
                T.Each(values, function(i, value){
                    T.Each(_this.data.printProduct.attrs, function(k, attr){
                        if(value==attr){
                            _this.data.attr[name] = value;
                            ret = [value];
                        }
                    });
                });
                if(ret.length){
                    _this.data.options.values[name] = ret;
                }
            });
        },
        /**
         * 设置默认值
         */
        setDefault: function(){debugger
            var _this = this;
            var demand = _this.data.demand||{},
                paramsInfo = demand.paramsInfo || {};
            _this.data.demandParamsInfo = paramsInfo;
            if(paramsInfo["商品属性"]){
                _this.data.printProduct.attrs = (paramsInfo["商品属性"]||"").replace(/-/g, "_").split("_"); //印刷商品属性
            }
            T.Each(_this.data.custom.names.concat(_this.data.options.names), function(i, name){
                _this.data.attr[name] = "";
                if(paramsInfo[name]!=null){
                    _this.data.attr[name] = paramsInfo[name];
                }
            });
            _this.setRelationAttr();
            _this.data.datumList = paramsInfo.materials||[];
        },
        /**
         * 渲染属性
         */
        render: function(productId){debugger
            var _this = this;
            _this.setDefault();
            if(_this.data.isUpdate){
                $("#payform, #oinfo, .btmline").remove();
                var demand = _this.data.demand||{},
                    paramsInfo = demand.paramsInfo || {};
                /*老订单数据初始化*/
                demand.demandId = demand.demandId||"";
                demand.orderProductId = demand.orderProductId||"";
                demand.designServiceId = demand.designServiceId||_this.data.product.designProductId||"";
                if(_this.data.order && _this.data.order.orderProductList && _this.data.order.orderProductList[0]){
                    demand.orderProductId = demand.orderProductId||_this.data.order.orderProductList[0].orderProductId||"";
                }
                /*end*/
                _this.data.designId = demand.designServiceId||"";
                _this.data.design = {
                    categoryName: paramsInfo["类别"]
                };
                if (paramsInfo['关联印刷订单商品'] && paramsInfo['商品属性']) {//是否已关联印刷订单
                    _this.data.isRelationPrintOrder = 1;
                    _this.data.printProduct.orderCode = paramsInfo['关联印刷订单商品'].replace(/\-.*$/, '');
                    _this.data.printProduct.productName = paramsInfo.productName;
                    _this.data.printProduct.productAttr = paramsInfo['商品属性'];
                }
                _this.data.userContact = _this.data.order.contact || "";
                if(T.RE.mobile.test(_this.data.order.phone)){
                    _this.data.userPhone = _this.data.order.phone;
                }
                if(T.RE.qq.test(_this.data.order.qq)){
                    _this.data.userQQ = _this.data.order.qq;
                }
                _this.data.contactTime = _this.data.order.contactTime || _this.data.contactTime || "";
            }else{
                //会员折扣对VI设计和设计补差价无效
                if(_this.data.product.designCategoryId==108 || _this.data.product.designCategoryId==125){
                    _this.data.isVIPLevel = 0;
                    _this.ordering.data.isVIPLevel = 0;
                    _this.ordering.complete(true);
                }
                if(_this.data.product.designProductId==18 || _this.data.product.designProductId==139){ //会员所有修改服务免费
                    _this.ordering.data.vipDiscount = 0;
                    _this.ordering.complete(true);
                }else if(_this.ordering.data.vipLevel==3){ //设计修改会员只能用于修改设计服务
                    _this.data.isVIPLevel = 0;
                    _this.ordering.data.isVIPLevel = 0;
                    _this.ordering.complete(true);
                }
                T.Template("pay_form", _this.data, true);
                _this.ordering.data.orderType = _this.data.orderType||"";
                _this.ordering.data.orderCode = _this.data.orderCode||"";
                _this.ordering.data.productList = [_this.data.product];
                _this.ordering.data.productNum = _this.data.productNum||_this.data.counter;
                _this.ordering.data.orderPrice = _this.data.orderPrice||0;
                _this.ordering.data.orderProductPrice = _this.data.orderProductPrice||0;
                _this.ordering.data.shipPrice = _this.data.shipPrice||0;
                _this.ordering.data.couponPrice = _this.data.couponPrice||0;
                _this.ordering.data.couponCodes = "";
                _this.ordering.data.categoryIdName = "designCategoryId";
                _this.ordering.data.productIdName = "designProductId";
                _this.ordering.data.productPriceName = "price";
                console.log("加载完毕>getProductList=>", _this.ordering.data.productList);
                _this.ordering.getUsableCouponByOrder();
                //默认展开优惠券
                if (_this.ordering.data.isCoupon && _this.ordering.data.couponList.length > 0) {
                    $(".coupon_pay:not(.dis,.sel)", _this.$cont).click();
                }
            }

            var user = _this.ordering.data.user||{};
            _this.data.userContact = _this.data.userContact||user.contact||"";
            if(T.RE.mobile.test(user.phone)){
                _this.data.userPhone = _this.data.userPhone||user.phone;
            }else if(T.RE.mobile.test(T._ACCOUNT)){
                _this.data.userPhone = _this.data.userPhone||T._ACCOUNT;
            }
            if(T.RE.qq.test(user.qq)){
                _this.data.userQQ = _this.data.userQQ||user.qq;
            }

            T.Template("demand", _this.data, true);
            T.BindData("data", _this.data, true);
            _this.trigger('render.after');debugger
            _this.uploader.fileList = _this.data.datumList;
            _this.uploader.upload();
            T.PageLoaded();
            T.Each(_this.data.placeholders, function(name, text){
                T.FORM().placeholder($("[name='"+name+"']")[0], text);
            });
        },
        /**
         * 加载完成
         */
        loaded: function(callback){
            var _this = this;
            _this.status[callback] = "1";
            if(_this.status.length==_this.status.join("").length){
                _this.trigger('render.before');
                _this.render();
                _this.trigger('render.completed');
                _this.pdtParams.setCounter(_this.$cont);
            }
        },
        /**
         * 验证输入并获取，包括尺寸输入和定制属性输入
         * @param  {jquery dom} $el  触发事件的元素
         * @param  {String} type 'size' | 'custom'
         * @return {Undefined} undefined
         */
        verifyInput: function($el, type){ //输入验证
            var _this = this,
                $cont = $el.closest(".inputbox"),
                $inputs = $('input', $cont);
            var atr = $el.closest(".vals").data("name"),
                val = $el.closest(".val").data("value")||'',
                unit = $el.closest(".val").data("unit")||'',
                list = [];
            $inputs.each(function(i, el) {
                var $input = $(el);
                var inval = T.toDBC(String($input.val()));
                if (!inval) {
                    type=='custom' && T.msg('请填入' + atr );
                    return false;
                }
                list.push(inval + unit);
            });
            $cont.removeClass("done");
            if (list.length == $inputs.length) {
                $cont.addClass('done');
                _this.data.attr[atr] = val  + ':'+ list.join('*');
            }
        },
        /**
         * 定制输入是否确认有值
         * @returns {boolean}
        */
        isInputOk : function(){
            var _this = this, isOk = true,
                inputbox = $('.inputbox:visible', _this.$cont);
            inputbox.each(function(i, el){
                var name;
                if (!$(el).hasClass('done')) {
                    name = $(el).closest('.vals').data('name');
                    if(_this.data.required){ //检查必填字段是否有值
                        T.alt("“"+ name + "”属性未填写完全，请填写完后再提交");
                        return isOk = false;
                    }
                }
            });
            return isOk;
        },
        events: function(){
            var _this = this;
            _this.$cont.on("click.attr", ".d-attrs .val", function(e){
                var $this = $(this),
                    $vals = $this.closest(".vals");
                if ($this.hasClass("sel")) {return;}
                var inputbox  = $this.find('.inputbox');
                var atr = $vals.data("name");
                var val = $this.data("value");
                if(atr && val){
                    if(_this.data.attr[atr] && _this.data.isRelationPrintOrder){
                        if(T.Array.indexOf(_this.data.disAttr, atr)>=0){
                            if(_this.data.attr[atr]==val){
                                _this.data.attr[atr] = val;
                                $this.addClass("sel").siblings(".val").removeClass("sel");
                            }else{
                                T.msg('已关联印刷订单商品，'+atr+'不可修改');
                            }
                            return;
                        }
                    }
                    if (inputbox.length) {//有输入框
                        _this.verifyInput(inputbox);
                    }else{
                        _this.data.attr[atr] = val;
                    }
                    $this.addClass("sel").siblings(".val, .color").removeClass("sel");
                    _this.trigger("click.attr", $this, e);
                }
            })
            .on("blur.textbox", ".d-custom .textbox", function(e){
                _this.verifyInput($(this), 'custom');
            })
            .on("keypress.number", ".d-size .textbox", function(e){ //键盘按下
                var keyCode = e.keyCode || e.which || e.charCode;//keyCode>=48 && keyCode<=57
                if (keyCode == 13) {
                    _this.verifyInput($(this), 'size');
                    return false;
                } else if ((keyCode < 48 || keyCode > 57) && keyCode != 8 && keyCode != 46 && keyCode != 37 && keyCode != 38 && keyCode != 39 && keyCode != 40){
                    return false;
                }
                _this.verifyInput($(this), 'size');
            })
            .on("keyup.number afterpaste.number", ".d-size .textbox", function (e) { //粘贴时过滤掉非数字字符
                var $input = $(this);
                var keyCode = e.keyCode || e.which || e.charCode;
                if(keyCode<37 || keyCode>40){
                    $input.val(T.toDBC(String($input.val())).replace(/\D/g, ""));
                    _this.verifyInput($input, 'size');
                }
            })
            .on("click.uploader", ".choice_yunfile:not(.dis)", function (e) {
                _this.uploader.fileList = _this.data.datumList;
                _this.uploader.init();
            })
            .on("click.design_agreement", ".design_agreement", function(e){ //阅读并接受设计服务协议
                var $this = $(this);
                if($this.hasClass("sel")){
                    $this.removeClass("sel");
                    _this.data.agreement = false;
                }else{
                    $this.addClass("sel");
                    _this.data.agreement = true;
                }
                return false;
            })
            .on("click.agreement_link", ".agreement_link", function(e){ //阅读并接受设计服务协议
                var $this = $(this),
                    href = $this.attr("href");
                var popup = new T.Popup({
                    title: $this.text().replace(/《|》/g, "")||"云印设计服务协议",
                    type: "iframe",
                    content: href,
                    ok: "我已阅读并接受",
                    no: ""
                });
                popup.on("ok", function(_this){
                    $("input[name='agreement']").not(":checked").click();
                });
                return false;
            }).on("click.dm_list", ".contact_more .d-contact .dm_list .radio", function (e) {
                var $this = $(this),
                    value = $this.data("value");
                if(value=="下单后立即联系"){
                    _this.data.contactTime = value;
                    $this.addClass('sel').siblings('.radio').removeClass('sel');
                }else{
                    TimeBucket({
                        contactTime: value,
                        getTime: function(t) {
                            _this.data.contactTime = t;
                            $this.data("value", t);
                            $this.addClass('sel').siblings('.radio').removeClass('sel');
                        }
                    });
                }
            }).on("click.submit", ".submit:not(.dis)", function(e){ //提交订单
                _this.submit();
            });
        }
    };
    //让具备事件功能
    T.Mediator.installTo(DemandMain.prototype);
    return function(options){
        return new DemandMain(options);
    };
});