require(["base", "tools", "modules/ordering", "design/params", "design/price", "modules/design_editor", "uploader"], function ($, T, Ordering, ProductParams, ProductPrice, DesignEditor, Uploader) {
    if (!T._LOGED) T.NotLogin();
    var isUploading = false;
    var MakeCard = {
        data: {
            isCoupon: true, //是否使用优惠券抵扣
            isVIPLevel: true, //是否支持会员折扣
            categoryId: 9, //设计服务分类ID
            productId: 18, //设计服务产品ID,
            productParam: "", //设计服务产品属性,
            generalState: 0,  //是否加急
            product: {}, //产品信息
            counter: 1, //款数
            orderType: 10, //订单类型
            productList: [], //商品清单
            productNum: 0, //商品款数
            price: 0, //现价
            costPrice: 0, //原价
            giftScore: 0, //积分
            orderPrice: 0, //订单金额
            orderProductPrice: 0, //订单商品金额
            shipPrice: 0, //订单运费
            agreement: true, //阅读并接受 《云印设计服务协议》
            placeholders: {
                "contact": "请填写联系人",
                "phone": "请填写手机号码",
                "qq": "请填写QQ",
                "buyer_remark": "建议填写已经和客服达成一致的说明"
            },
            template: {} //模板信息
        },
        uploader: null,
        pdtParams: ProductParams(),
        pdtPrice: ProductPrice(),
        $cont: $("#make"),
        status: ['','','',''], //[支付信息,设计服务产品,模板信息,拉取价格]
        template: "#template_panel",
        cardList: "#template_card_list_view",
        ordering: {}, //支付信息
        designEditor: {}, //设计器
        init: function () {
            var _this = this;
            _this.data.templateId = T.REQUEST.tid;
            if(_this.data.templateId){
                var isFirst = true;
                _this.pdtPrice.on("success", function(data, paramsData){debugger
                    _this.data.orderPrice = data.price;
                    _this.data.orderProductPrice = data.price;
                    _this.data.product.price = data.price; //现价
                    _this.data.price = data.price; //现价
                    _this.data.costPrice = data.costPrice; //原价
                    _this.data.giftScore = data.giftScore; //积分
                    if(isFirst){
                        isFirst = false;
                        _this.data.product.price = data.price; //现价
                        _this.loaded(3);
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
                _this.pdtParams.on("rendered", function(opts){
                    _this.data.productParam = _this.pdtParams.getValue();
                    _this.getPrice();//拉取价格
                }).on("change.counter", function(opts, counter){
                    _this.changeCounter(counter);
                });
                //支付信息
                _this.ordering = new Ordering({
                    data: {
                        isUserInfo: true,
                        isCoupon: true,
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
                _this.designEditor = DesignEditor({
                    cont: "#designer",
                    editable: true,
                    templateId: _this.data.templateId,
                    success: function (data) {
                        _this.data.template = data;
                        _this.loaded(2);
                    }
                });
                _this.events();
            }else{
                //_this.back();
            }
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
                success: function(data, params) {debugger
                    data.showType = Number(data.showType)||0; //展示方式，1：单个属性不显示
                    data.params = _this.getJson(data.priceInfo);
                    data.pattr = _this.data.productParam || "";
                    _this.data.product = data||{};
                    _this.pdtParams.init(data);
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
         * 查询价格
         * @param {Number|Function} callback 回调
         */
        getPrice: function(){
            var _this = this;
            _this.pdtPrice.getPrice([{
                productId: _this.data.productId,
                productParam: _this.data.productParam,
                productCount: _this.data.counter,
                generalState: 0 //是否加急
            }], _this.data.product);
        },
        /**
         * 渲染属性
         */
        render: function(productId){debugger
            var _this = this;
            if(_this.data.product.designProductId==18 || _this.data.product.designProductId==139){ //会员所有修改服务免费
                _this.ordering.data.vipDiscount = 0;
                _this.ordering.complete(true);
            }else{ //设计修改会员只能用于修改设计服务
                _this.data.isVIPLevel = 0;
                _this.ordering.data.isVIPLevel = 0;
                _this.ordering.complete(true);
            }
            _this.data.product.price = _this.data.price; //现价
            _this.data.product.costPrice = _this.data.costPrice; //原价
            _this.data.product.giftScore = _this.data.giftScore; //积分
            _this.ordering.data.orderType = _this.data.orderType||"";
            _this.ordering.data.orderCode = _this.data.orderCode||"";
            _this.ordering.data.productList = [_this.data.product];
            _this.ordering.data.productNum = _this.data.productNum||1;
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

            var user = _this.ordering.data.user||{};
            _this.data.userContact = user.contact||"";
            if(T.RE.mobile.test(user.phone)){
                _this.data.userPhone = user.phone;
            }else if(T.RE.mobile.test(T._ACCOUNT)){
                _this.data.userPhone = T._ACCOUNT;
            }
            if(T.RE.qq.test(user.qq)){
                _this.data.userQQ = user.qq;
            }
            T.Template("product", _this.data.product, true);
            T.Template("template", _this.data.template, true);
            T.Template("contact_info", _this.data, true);
            T.BindData("data", _this.data, true);
            _this.$cont.removeClass("load");
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
                _this.render();
                _this.pdtParams.setCounter(_this.$cont);
            }
        },
        changeCounter: function (val) {
            var _this = this;
            if(val>1){
                $("#design_panel").hide();
                $("#template_panel").show();
                $("#payment_panel").addClass("hide");
                if(!_this.uploader){
                    _this.uploader = Uploader({
                        type: "xls,xlsx",
                        inputId: "file_upload",
                        text: "导入名片信息",
                        text2: "导入名片信息",
                        errorMsg: "只能导入Excel文件",
                        onSuccess: function(params){
                            $('#file_upload_uris').html('<a href="'+params.fileUri+'" title="'+params.fileName+'" target="_blank">'+params.fileName+'</a>');
                            _this.getExcel(params);
                        }
                    });
                }
            }else{
                val = 1;
                $("#design_panel").show();
                $("#template_panel").hide();
                $("#payment_panel").removeClass("hide");
            }
            _this.data.counter = val;
            _this.getPrice();
        },
        getExcel: function(params){
            var _this = this;
            if(!params.fileUri)return;
            $("#template_panel").addClass("hid");
            T.loading(false, 1000, '小in正在帮您解析数据，请耐心等候哟...');
            T.POST({
                action: "in_user/card_excel_read",
                params: {
                    url: params.fileUri
                },
                success: function (data) {
                    data = data||{};
                    data.data = data.data||[];
                    _this.data.excelData = data.data;
                    T.Template("import_result", data, true);
                    T.loading(true);
                },
                failure: function(data){
                    T.loading(true);
                    T.msg(data.msg||T.TIPS.DEF);
                }
            }, function(data){
                T.loading(true);
                T.msg(data.msg||T.TIPS.DEF);
            }, function(data){
                T.loading(true);
                T.msg(data.msg||T.TIPS.DEF);
            });
        },
        /**
         * 生成预览
         */
        preview: function(){
            var _this = this;
            if(!_this.data.excelData||!_this.data.excelData.length)return;
            T.loading(false, _this.data.excelData.length*200, '小in正在帮您批量生成，请耐心等候哟...');
            T.POST({
                action: "in_order/make_card",
                loading: true,
                params: {
                    template_id: _this.data.templateId,
                    card_infos: _this.data.excelData
                },
                success: function (data) {
                    data.cardList = data.cardList||[];
                    T.Each(data.cardList, function(i, card){
                        card.index = i+1;
                    });
                    _this.data.cardList = data.cardList;
                    setTimeout(function(){
                        T.Template("card_list", data, true);
                        _this.not_loaded = 2*_this.data.cardList.length;
                        _this.loadImage(_this.data.cardList);
                        T.loading(true);
                        $("#product_panel").hide();
                        $("#design_panel").hide();
                        $("#template_panel").hide();
                        $("#card_list_panel").show();
                        $("#payment_panel").removeClass("hide");
                        _this.data.counter = data.cardList.length;
                        _this.getPrice();
                    }, _this.data.cardList.length*10);
                },
                failure: function(data){
                    T.loading(true);
                    T.msg(data.msg||T.TIPS.DEF);
                }
            }, function(data){
                T.loading(true);
                T.msg(data.msg||T.TIPS.DEF);
            }, function(data){
                T.loading(true);
                T.msg(data.msg||T.TIPS.DEF);
            });
        },
        loadImage: function(cardList, index, flag){
            var _this = this;
            index = index||0;
            flag = flag||0;
            if(flag>1){
                flag = 0;
                index++;
            }
            if(index>=cardList.length){
                index = 0;
            }
            if(!_this.not_loaded)return;
            //console.log('loadImage=>',index, flag);
            if(cardList && cardList[index]){
                var card = cardList[index];
                if(card.loaded>=2){
                    _this.loadImage(cardList, index, ++flag);
                }else{
                    card.loaded = card.loaded||0;
                    var field = ['frontImage','backImage'][flag];
                    if(field){
                        T.LoadImage(card[field]+'?='+Math.random(), function(imgsrc, nw, nh){
                            var dom = T.DOM.byId('card-'+field+'-'+card.cardId);
                            if(dom){
                                console.log('LoadImage==>', nw, nh);
                                if(nw==400 && nh==300){
                                    _this.loadImage(cardList, index, ++flag);
                                }else{
                                    dom.innerHTML = '<img src="'+imgsrc+'" alt="'+card.cardName+'" />';
                                    card.loaded += 1;
                                    _this.not_loaded -= 1;
                                    _this.loadImage(cardList, index, ++flag);
                                }
                            }
                        }, function(){
                            _this.loadImage(cardList, index, ++flag);
                        }, 5);
                    }
                }
            }
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
        getParams: function (params){
            var _this = this;
            params = params||{};

            var forms = _this.getFormParams();

            params.template_id = _this.data.templateId;
            if(_this.data.counter>1){
                var cardIds = [];
                T.Each(_this.data.cardList, function(i, card){
                    cardIds.push(card.cardId);
                });
                if(!cardIds.length)return null;
                _this.data.counter = cardIds.length;
                params.card_ids = cardIds;
            }else{
                var json = _this.designEditor.getData();
                if(!json)return null;
                params.card_json = json;
                if(json.cardId){
                    params.card_id = json.cardId;
                }
            }
            
            params.data = [{
                productId: _this.data.productId,
                productParam: _this.data.productParam,
                generalState: _this.data.generalState,
                productCount: _this.data.counter
            }];

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
            //云印设计服务协议
            if(!_this.data.agreement){
                T.msg("请阅读并接受《云印设计服务协议》");
                return null;
            }
            //获取支付参数
            params.buyer_remark = forms.buyer_remark;
            params = _this.ordering.getParams(params);
            return params;
        },
        /**
         * 提交订单
         * @param params
         */
        submit: function(params){debugger
            var _this = this;
            if($(".submit .doing", _this.$cont).length)return;
            params = _this.getParams(params||{});
            if(!params) return;
            $(".submit", _this.$cont).addClass("dis");
            _this.timeObj = setTimeout(function(){
                $(".submit", _this.$cont).removeClass("dis");
            }, 30000);
            T.POST({
                action: "in_order/design_for_make_card",
                params: params,
                success: function(data, params) {
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
                }
            }, function(data, params){
                $(".submit", _this.$cont).removeClass("dis");
                _this.ordering.error(data||{}, 1);
            }, function(data, params){
                $(".submit", _this.$cont).removeClass("dis");
                _this.ordering.error(data||{}, 1);
            });
        },
        del: function(cardId, callback){
            var _this = this;
            if(!cardId)return;
            T.POST({
                action: "in_user/card_delete",
                params: {
                    card_id: cardId
                },
                success: function (data) {
                    T.Each(_this.data.cardList, function(i, card){
                        if(card.cardId==cardId){
                            _this.data.cardList.splice(i,1);
                            return false;
                        }
                    });
                    if(_this.data.cardList.length>0){
                        _this.data.counter -= 1;
                        _this.getPrice();
                    }else{
                        $("#product_panel").removeClass("hide");
                        $("#template_panel").removeClass("hide");
                        $("#design_panel").addClass("hide");
                        $("#card_list_panel").addClass("hide");
                        $("#payment_panel").addClass("hide");
                    }
                    T.msg("删除成功。");
                    callback && callback();
                }
            });
        },
        events: function () {
            var _this = this;
            _this.$cont.on("click.make", ".template_panel .submit:not(.dis)", function (e) {
                _this.preview();
            }).on("click.edit", ".d-card-list .edit", function(e){//编辑名片
                var $card = $(this).closest(".card");
                var cardId = $card.data("card_id")||"";
                if(!cardId)return;
                var designEditor = DesignEditor({
                    cardId: cardId,
                    editable: true,
                    save: function(data, params){
                        if(data && data.cardId){
                            T.Each(_this.data.cardList, function(i, card){
                                if(data.cardId && card.cardId==params.card_id){
                                    data.index = card.index||(i+1);
                                    _this.data.cardList[i] = data;
                                    var cardList = [data];
                                    $(".d-card-list .card[data-card_id='"+params.card_id+"']").replaceWith(T.Compiler.template("template-card_list", {cardList: cardList}));
                                    _this.not_loaded = 2 * cardList.length;
                                    _this.loadImage(cardList);
                                }
                            });
                            T.msg("保存成功");
                        }
                    }
                });
            }).on("click.del", ".d-card-list .del", function(e){//删除名片
                var $card = $(this).closest(".card");
                var cardId = $card.data("card_id")||"";
                if(!cardId)return;
                T.cfm("是否确认删除此名片信息？", function(_o){
                    _o.remove();
                    _this.del(cardId, function(data){
                        $card.animate({opacity: 0}, 300, function(){
                            $card.remove()
                        });
                    });
                }, function(_o){
                    _o.remove();
                }, "温馨提示", "确定删除", "暂不删除");
            }).on("click.btn_reload", ".d-card-list .btn_reload", function(e){//重新加载
                var src = $(this).data("src")||"";
                var $dom = $(this).closest(".image");
                if(src){
                    T.LoadImage(src+'?='+Math.random(), function(imgsrc, nw, nh){
                        if($dom.length){
                            $dom.html('<img src="'+imgsrc+'" />');
                        }
                    }, function(){}, 5);
                }
            }).on("click.design_agreement", ".design_agreement", function(e){ //阅读并接受设计服务协议
                var $this = $(this);
                if($this.hasClass("sel")){
                    $this.removeClass("sel");
                    _this.data.agreement = false;
                }else{
                    $this.addClass("sel");
                    _this.data.agreement = true;
                }
                return false;
            }).on("click.agreement_link", ".agreement_link", function(e){ //阅读并接受设计服务协议
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
            }).on("click.submit", ".newbox .submit:not(.dis)", function(e){ //提交订单
                _this.submit();
            });
        }
    };
    T.Loader(function(){
        MakeCard.init(true);
    });
});