define("modules/ordering", ["base", "tools"], function ($, T) {
    return T.Module({
        uuid: T.UUID(),
        $cont: $("#payform"),
        tips: ['您选择优惠券已经足够抵扣订单商品金额', '您选择的优惠券已经可以抵扣订单金额', '您选择的优惠券已经可以抵扣配送运费'],
        data: {
            orderType: "", //订单类型
            orderCode: "", //订单编号
            productList: [], //商品清单
            services: [], //服务清单
            servicePrice: 0, //服务价格
            productNum: 0, //商品款数
            orderPrice: 0, //订单金额
            orderProductPrice: 0, //订单商品金额（特例：分发订单为订单金额）
            shipPrice: 0, //订单运费（特例：分发订单将运费记为订单商品金额）

            isUserInfo: 0, //是否查询用户信息
            isCoupon: 1, //是否可用优惠券抵扣
            isWallet: 0, //是否可用余额抵扣
            isCanCredit: 0, //是否可用信用支付
            isCanMonthly: 0, //是否可用月结支付
            isAgent: 0, //是否可用加盟商支付
            isVIPLevel: 0, //是否支持会员折扣
            hasAmoebaPayPassword: 0, //阿米巴账户是否已设置支付密码
            hasPayPassword: 0, //是否已设置支付密码
            payPassword: "", //支付密码
            isVIP: 0, //是否使用会员折扣支付

            isAlipayPay: true, //是否支持支付宝支付
            isWeChatPay: true, //是否支持微信支付
            isWalletPay: true, //是否支持现金账户支付
            isAmoebaCashPay: false, //是否支持代金账户支付
            isCreditPay: false, //是否支持信用支付
            isMonthlyPay: false, //是否支持月结支付
            isOnlineBanking: false, //是否支持银联在线支付
            isEnterpriseOnlineBanking: false, //是否支持企业网银支付
            isEnterpriseRemittance: false, //是否支持企业汇款
            //isCompanyPay: true, //是否支持企业支付
            isAgentPay: false, //加盟商支付
            isAgentCash: false, //加盟商现金账户是否可用
            isAgentRebate: false, //加盟商返现账户是否可用

            userLevelId: 0, //用户等级ID
            vipLevel: 0, //会员等级
            vipDiscount: 1, //会员折扣
            usedAmount: 0, //已使用月结额度
            creditAmount: "0.00", //信用账户总额度
            useCreditAmount: "0.00", //信用账户可用额度
            monthlyAmount: "0.00", //月结账户总额度
            useMonthlyAmount: "0.00", //月结账户可用额度
            walletTotalPrice: "0.00", //总余额
            amoebaCashAmount: "0.00", //代金账户总余额

            couponPrice: 0, //优惠券抵扣金额
            walletPrice: 0, //余额抵扣金额

            paidPrice: 0, //已抵扣金额
            payablePrice: 0, //应支付金额

            categoryIdName: "categoryId", //产品分类ID字段名
            productIdName: "productId", //产品ID字段名
            //productPriceName: "price", //产品价格字段名

            couponCodes: "", //已选择的优惠券编号，多个以“;”隔开

            VIP_LEVEL: T.VIP_LEVEL,

            paymentData: {} //支付数据
        },
        status: ['', '', '', ''], //[用户信息,已使用月结额度,余额,优惠券,会员等级]
        events: {
            "click .coupon_list .node[data-index]": "chooseCoupon", //选择优惠券
            "mouseenter .coupon_list .i": function ($this) { //显示优惠券详情
                $this.closest(".node").addClass("hover");
            },
            "mouseenter .coupon_list .node.sel": "setCounter",
            "mouseleave .coupon_list .node": function ($this) { //隐藏优惠券详情
                $this.removeClass("hover");
            },
            "click .coupon_list .counter b.dis": function ($this) { //隐藏优惠券详情
                var $node = $this.closest(".node"),
                    msg = this.tips[0];
                if (this.data.orderType > 0) {
                    msg = this.tips[1];
                }
                if ($node.hasClass(".t3")) {
                    msg = this.tips[2];
                }
                if (msg) {
                    T.msg(msg);
                }
            },
            //"click .coupon_list .addnode": "gainCoupon", //兑换优惠券
            "click .coupon_list .addbtn": "redeemedCoupon", //兑换优惠券
            "click .coupon_pay .showmore, .coupon_pay .hidemore": "shwHidCoupon", //展开/收起优惠券列表
            "click .coupons:not(.credit_pay):not(.monthly_pay):not(.amoeba_cash_pay) dt.tit": "chooseDeduction", //选择抵扣方式
            "click dt.tit a": function ($this, e) {
                e.stopPropagation();
            },
            "focus [name='pay_password']": function ($this, e) { //输入支付密码
                var _this = this;
                _this.inputPayPassword = true;
            },
            "blur [name='pay_password']": function ($this, e) { //输入支付密码
                var _this = this;
                if (_this.checkPayPwd($this.val())) {
                    _this.useWallet();
                }
            }
        },
        init: function () {
            var _this = this;
            if (!_this.data.isUserInfo) {
                _this.loaded(null, null, 0);
            } else {
                _this.getUser(0);
            }
            if (!_this.data.isCanCredit || !_this.data.isCanMonthly || !_this.data.isWallet) {
                _this.loaded(null, null, 1);
            } else {
                _this.getPaymentData(1);
            }
            /*if(!_this.data.isCanMonthly){
                _this.loaded(null, null, 1);
            }else{
                _this.getMonthly(1);
            }
            if(!_this.data.isWallet){
                _this.loaded(null, null, 2);
            }else{
                _this.getWallet(2);
            }*/
            if (!_this.data.isCoupon) {
                _this.loaded(null, null, 2);
            } else {
                _this.getCoupon(2);
            }
            if (!_this.data.isVIPLevel) {
                _this.loaded(null, null, 3);
            } else {
                _this.getVIPLevel(3);
            }

            T.TIP({
                container: "#order",
                trigger: ".small_icon_help",
                content: function (trigger) {
                    return $(trigger).data("text");
                },
                width: 340,
                offsetX: 360,
                offsetY: 0
            });
            T.TIP({
                container: "#order",
                trigger: ".pdt_not",
                content: function (trigger) {
                    return '您好！您的商品中部分印刷商品，配送范围无法覆盖您选择的收货地址，请更换其它印刷商品或删除后再提交订单。';
                },
                width: 340,
                offsetX: 0,
                offsetY: 0
            });
            T.TIP({
                container: '#oinfo',
                trigger: '.newbox .icon_help',
                content: function (trigger) {
                    return '您可以在提交订单前选择上方的优惠券/现金账户，抵扣部分订单金额';
                },
                width: 'auto',
                offsetX: 0,
                offsetY: -65
            });
        },
        /**
         * 查询用户信息
         * @param {Number|Function} callback 回调
         */
        getUser: function (callback) {
            var that = this;
            T.GET({
                action: "in_user/user_query",
                success: function (data, params) {
                    that.data.userLevelId = parseInt(data.levelId, 10) || 0; //用户等级ID
                    that.data.hasPayPassword = data.hasPayPassword == 1; //是否已设置支付密码
                    that.data.hasAmoebaPayPassword = true; //信用账户是否已设置支付密码
                    //that.data.isCanMonthly = data.canMonthly == 1 && data.monthlyAmount > 0; //是否支持月结支付
                    //that.data.monthlyAmount = T.RMB(data.monthlyAmount); //月结额度
                    that.data.user = data; //用户信息
                    that.loaded(data, params, callback);
                }
            });
        },
        /**
         * 查询用户月结额度
         * @param {Number|Function} callback 回调
         */
        /*getMonthly: function(callback) {
            var _this = this;
            T.GET({
                action: "in_order/used_amount_query",
                success: function(data, params) {
                    _this.data.usedAmount = data.usedAmount || 0; //已使用月结额度
                    _this.loaded(data, params, callback);
                }
            });
        },*/
        /**
         * 查询余额
         * @param {Number|Function} callback 回调
         */
        /*getWallet: function(callback) {
            var _this = this;
            T.GET({
                action: "in_order/user_all_wallet_query",
                success: function(data, params) {
                    _this.data.walletTotalPrice = T.RMB(data.allWallet); //总余额
                    _this.loaded(data, params, callback);
                }
            });
        },*/
        /**
         * 订单支付前查询相关数据
         * @param {Number|Function} callback 回调
         */
        getPaymentData: function (callback) {
            var that = this;
            var params = {orderCode: that.data.orderCode}
            if (T._TYPE == 3 && T._OPERATOR_CODE) {
                params.bdCode = T._OPERATOR_CODE
            }
            T.GET({
                action: "in_order/query_payment_data",
                params: params,
                success: function (data) {
                    that.data.creditAmount = T.RMB(data.totalCreditAmount); //信用账户总额度
                    that.data.useCreditAmount = T.RMB(data.currentCreditAmount || 0); //信用账户可用额度
                    that.data.monthlyAmount = T.RMB(data.allMonthly); //月结帐户总额度
                    that.data.useMonthlyAmount = T.RMB(data.useMonthly || 0); //月结帐户可用额度
                    that.data.walletTotalPrice = T.RMB(data.allWallet || 0); //现金账户总余额
                    that.data.amoebaCashAmount = T.RMB(data.amoebaCashAmount || 0); //代金账户总余额

                    var payTypeList = data.payTypeList || []
                    //支付宝支付
                    that.data.isAlipayPay = T.Array.indexOf(payTypeList, 0) > -1
                    //微信支付
                    that.data.isWeChatPay = T.Array.indexOf(payTypeList, 11) > -1
                    //银联在线支付
                    that.data.isOnlineBanking = T.Array.indexOf(payTypeList, 9) > -1
                    //现代金户支付
                    that.data.isAmoebaCashPay = T.Array.indexOf(payTypeList, 25) > -1
                    //现金账户支付
                    that.data.isWalletPay = that.data.isWallet && T.Array.indexOf(payTypeList, 22) > -1
                    that.data.isWallet = false
                    //月结支付
                    that.data.isMonthlyPay = that.data.isCanMonthly && T.Array.indexOf(payTypeList, 16) > -1
                    //信用账户支付
                    that.data.isCreditPay = that.data.isCanCredit && T.Array.indexOf(payTypeList, 24) > -1
                    //企业网银支付
                    that.data.isEnterpriseOnlineBanking = T.Array.indexOf(payTypeList, 14) > -1
                    //企业汇款
                    that.data.isEnterpriseRemittance = T.Array.indexOf(payTypeList, 5) > -1
                    //代理商支付
                    that.data.isAgentCash = that.data.isAgent && T.Array.indexOf(payTypeList, 17) > -1
                    that.data.isAgentRebate = that.data.isAgent && T.Array.indexOf(payTypeList, 18) > -1
                    that.data.isAgentPay = that.data.isAgentCash || that.data.isAgentRebate
                    that.data.paymentData = data
                    that.loaded(data, params, callback);
                },
                failure: function () {
                    that.goDetail(that.data);
                },
                error: function () {
                    that.goDetail(that.data);
                }
            });
        },
        /**
         * 查询会员等级
         * @param {Number|Function} callback 回调
         */
        getVIPLevel: function (callback) {
            var _this = this;
            T.GET({
                action: "in_user/user_vip_query",
                success: function (data, params) {
                    _this.data.vipLevel = parseInt(data.vipLevel, 10) || 0; //会员等级
                    _this.data.vipDiscount = parseFloat(data.discount); //会员折扣
                    _this.data.vipDiscountNum = parseFloat(T.Number.mul(_this.data.vipDiscount, 10)); //会员折扣
                    if (!_this.data.VIP_LEVEL[_this.data.vipLevel]) {
                        _this.data.vipLevel = 0;
                    }
                    _this.loaded(data, params, callback);
                }
            });
        },
        /**
         * 查询优惠券
         * @param {Number|Function} callback 回调
         */
        getCoupon: function (callback) {
            var _this = this;
            T.GET({
                action: "in_order/coupon_query_for_web",
                params: {
                    coupon_status: "0",
                    order_by: 1 //order_by:1时按过期时间倒叙，其他=记录时间倒叙
                },
                success: function (data, params) {
                    _this.data.usableList = data.couponCardList || []; //[overdueList]
                    _this.getUsableCouponByOrder();
                    _this.loaded(data, params, callback);
                }
            });
        },
        /**
         * 检查优惠券是否可用
         * @param coupon
         * @returns {boolean}
         */
        checkCouponUsable: function (coupon) {
            var _this = this,
                regBlank = /\s+/g, //空格符
                regDivide = /,/g; //分隔符
            //没有优惠券好
            if (!coupon.usable) return false;
            //当运费为0时
            if (coupon.couponType == 3 && _this.data.shipPrice <= 0) {
                return false;
            }
            //优惠券类型限制，0：印刷券，1：设计券，2：通用券，3：运费券
            if (_this.data.orderType === 0) { //印刷订单
                if (coupon.couponType !== 0 && coupon.couponType !== 2 && coupon.couponType !== 3) {
                    return false;
                }
            } else if (_this.data.orderType === 5) { //账户充值订单
                return false;
            } else if (_this.data.orderType === 10) { //设计订单
                if (coupon.couponType !== 1 && coupon.couponType !== 2) {
                    return false;
                }
            }
            //消费限制（couponType===3为运费券，订单商品金额为订单运费）
            var productPrice = coupon.couponType === 3 ? _this.data.shipPrice : _this.data.orderProductPrice;
            //如果订单商品金额小于限定金额
            if (coupon.orderPrice >= 0 && productPrice < coupon.orderPrice) {
                return false;
            }
            //商品款数限制（如果购买商品款数小于限定款数）
            if (coupon.productNum >= 0 && _this.data.productNum < coupon.productNum) {
                return false;
            }
            //用户等级限制（如果用户等级不在限定等级中）
            var userUseGrade = ("," + (coupon.userUseGrade || "") + ",").replace(regBlank, "");
            if (userUseGrade.replace(regDivide, "") && userUseGrade.indexOf("," + _this.data.userLevelId + ",") < 0) {
                return false;
            }
            /*//用户限制（如果限定账户不包含当前登录账户）
            if (coupon.forUser && (";" + coupon.forUser + ";").indexOf(";" + T._ACCOUNT + ";")<0){
                return false;
            }
            //订单限制（如果限定订单号不包含当前订单号）
            if (coupon.forOrder && (";" + coupon.forOrder + ";").indexOf(";" + _this.data.ordeCode + ";")<0){
                return false;
            }*/
            //产品限制
            var isUsable = true;
            var forDisableCategoryIds = ""; //不可用产品分类ID
            var forDisableProductIds = ""; //不可用产品ID
            var forEnableCategoryIds = ""; //可用产品分类ID
            var forEnableProductIds = ""; //可用产品ID
            if (_this.data.orderType === 0) { //印刷订单
                forDisableCategoryIds = ("," + (coupon.banProductCategory || "") + ",").replace(regBlank, "");
                forDisableProductIds = ("," + (coupon.banProduct || "") + ",").replace(regBlank, "");
                forEnableCategoryIds = ("," + (coupon.byProductCategory || "") + ",").replace(regBlank, "");
                forEnableProductIds = ("," + (coupon.forProduct || "") + ",").replace(regBlank, "");
            } else if (_this.data.orderType === 5) { //账户充值订单
                forEnableProductIds = ("," + (coupon.forRecharge || "") + ",").replace(regBlank, "");
            } else if (_this.data.orderType === 10) { //设计订单
                forDisableCategoryIds = ("," + (coupon.banDesignCategory || "") + ",").replace(regBlank, "");
                forDisableProductIds = ("," + (coupon.banDesign || "") + ",").replace(regBlank, "");
                forEnableCategoryIds = ("," + (coupon.byDesignCategory || "") + ",").replace(regBlank, "");
                forEnableProductIds = ("," + (coupon.forDesign || "") + ",").replace(regBlank, "");
            }
            /*
             * 不可使用限制
             */
            //指定分类限制时（没指定分类时，表示无分类限制）
            if (forDisableCategoryIds.replace(regDivide, "")) {
                //如果购买商品包含不可使用的产品分类
                T.Each(_this.data.productList, function (i, product) {
                    if (forDisableCategoryIds.indexOf("," + product[_this.data.categoryIdName] + ",") >= 0) {
                        isUsable = false;
                        return false;
                    }
                });
                if (!isUsable) return false;
            }
            //指定产品限制时（没指定产品时，表示无产品限制）
            if (forDisableProductIds.replace(regDivide, "")) {
                //如果购买商品包含不可使用的产品
                T.Each(_this.data.productList, function (i, product) {
                    if (forDisableProductIds.indexOf("," + product[_this.data.productIdName] + ",") >= 0) {
                        isUsable = false;
                        return false;
                    }
                });
                if (!isUsable) return false;
            }
            /*
             * 可使用限制
             */
            //指定分类限制时（没指定分类时，表示无分类限制）
            if (forEnableCategoryIds.replace(regDivide, "")) {
                //如果购买商品不在可使用的产品分类中
                T.Each(_this.data.productList, function (i, product) {
                    if (forEnableCategoryIds.indexOf("," + product[_this.data.categoryIdName] + ",") < 0) {
                        isUsable = false;
                        return false;
                    }
                });
                if (!isUsable) return false;
            }
            //指定产品限制时（没指定产品时，表示无产品限制）
            if (forEnableProductIds.replace(regDivide, "")) {
                //如果购买商品不在可使用的产品中
                T.Each(_this.data.productList, function (i, product) {
                    if (forEnableProductIds.indexOf("," + product[_this.data.productIdName] + ",") < 0) {
                        isUsable = false;
                        return false;
                    }
                });
                if (!isUsable) return false;
            }
            return true;
        },
        /**
         * 获取指定订单可用优惠券
         */
        getUsableCouponByOrder: function () {
            var _this = this;
            _this.data.couponList = [];
            var _usableList = [];
            if (_this.data.orderProductPrice > 0) {
                _this.data.usableList = _this.data.usableList || [];
                T.Each(_this.data.usableList, function (i, coupon) {
                    coupon.couponType = parseInt(coupon.couponType, 10);
                    if (_this.checkCouponUsable(coupon)) {
                        T.Array.add(_usableList, coupon, false, "usable");
                    }
                });
            }
            _this.data.couponCodes = T.Array.check(_usableList, _this.data.couponCodes, "usable", true).join(";");
            _this.data.couponTypeCN = ['印刷券', '设计券', '通用券', '运费券'];
            _this.data.couponList = _this.data.services.length ? [] : _usableList; //本订单可用优惠券
            _this.data.couponStatus = 0;
            _this.data.couponCount = _this.data.couponList.length;
            _this.data.Number = Number;
            _this.data.RMB = T.RMB;
            _this.data._collapsed = $("#template-coupon_list-view").hasClass("collapsed");
            T.Template("coupon_list", _this.data, true);
            T.BindData("data", _this.data);
            T.FORM().placeholder(T.DOM.byId('record_code_input'), "请输入兑换码或口令");
            if (!_this.data.isVIP) {
                $(".coupon_pay:not(.dis,.sel)", _this.$cont).click();
            }
            if (_this.data._collapsed) {
                var $view = $(".coupon_list", _this.$cont);
                if (_this.data.couponList.length > 7) {
                    $view.siblings(".shwmore").show();
                    $(".node:gt(6)", $view).hide();
                } else {
                    $view.height("auto").siblings(".shwmore").hide();
                }
            }
            //_this.chooseCoupon($(".coupon_list .node.sel:not(.t3):first", _this.$cont).removeClass("sel"));
            //_this.chooseCoupon($(".coupon_list .node.t3:first", _this.$cont).removeClass("sel"));
            //$(".coupon_list .node.sel:first", _this.$cont).click().click();
            $(".coupon_list .node.sel:not(.dis):first", _this.$cont).click().click();
            //$(".coupon_list .node.t3:first", _this.$cont).click();
            _this.useCoupon();
        },
        /**
         * 计算优惠券可抵扣金额
         * @param {Object} coupon 优惠券对象
         * @returns {number}
         */
        getCouponPrice: function (coupon, count) {
            var _this = this;
            var productPrice = 0,
                couponPrice = 0;
            if (_this.checkCouponUsable(coupon)) {
                if (coupon.couponType === 3) {
                    productPrice = _this.data.shipPrice;
                } else {
                    productPrice = _this.data.orderProductPrice;
                }
                if (coupon.preferWay == 1) { //折扣券
                    couponPrice = productPrice * T.Number.div(10 - coupon.couponPrice, 10);
                    if (coupon.maxDiscount > 0) {
                        couponPrice = Math.min(couponPrice, parseFloat(coupon.maxDiscount) || 0);
                    }
                } else {
                    //抵扣金额不得超过优惠券面值和商品金额及订单商品金额
                    couponPrice = Math.min(coupon.couponPrice, productPrice);
                }
                var num = count || 1, //Math.ceil(productPrice/couponPrice),
                    codes = String(coupon.usable || "").split(",");
                num = Math.min(num, codes.length);
                if (codes.length > 1) {
                    num = coupon.useType == 1 ? num : 1;
                    coupon.useCode = codes.slice(0, num).join(";");
                } else {
                    coupon.useCode = coupon.usable;
                }
                couponPrice = T.Number.mul(couponPrice, num);
            }
            return couponPrice;
        },
        /**
         * 使用优惠券
         */
        useCoupon: function () {
            var _this = this;
            var couponCodes = [], coupon = null, couponPrice = 0, couponShipPrice = 0;
            $(".coupon_list .node[data-index].sel", _this.$cont).each(function (i, el) {
                var $el = $(el);
                coupon = _this.data.couponList[$el.data("index")];
                var count = parseInt($.trim($(".counter input", $el).val()), 10) || 1;
                if (_this.data.isCoupon && coupon) {
                    if (coupon.couponType == 3) {
                        if (couponShipPrice < _this.data.shipPrice) {
                            //计算优惠券抵扣的金额
                            couponShipPrice += Math.min(_this.getCouponPrice(coupon, count), _this.data.shipPrice);
                            couponCodes.push(coupon.useCode);
                        }
                        /*else{
                                                    $el.removeClass("sel");
                                                    $(".checkbox", $el).removeClass("sel");
                                                }*/
                    } else {
                        if (couponPrice < _this.data.orderProductPrice) {
                            //计算优惠券抵扣的金额
                            couponPrice += Math.min(_this.getCouponPrice(coupon, count), _this.data.orderProductPrice);
                            couponCodes.push(coupon.useCode);
                        }
                        /*else{
                                                    $el.removeClass("sel");
                                                    $(".checkbox", $el).removeClass("sel");
                                                }*/
                    }
                }
            });
            //如果优惠券金额大于商品金额，则只抵扣商品金额
            _this.data.couponPrice = Math.min(couponPrice, _this.data.orderProductPrice);
            _this.data.couponShipPrice = Math.min(couponShipPrice, _this.data.shipPrice);
            _this.data.couponCodes = couponCodes.join(";");
            console.log('couponCodes=>', _this.data.couponCodes.split(';').length, '=', _this.data.couponCodes);
            //如果优惠券抵扣金额大于等于订单商品金额
            $(".counter b", _this.$cont).removeClass("dis");
            if (_this.data.couponPrice >= _this.data.orderProductPrice) {
                $(".node:not(.sel):not(.t3)", _this.$cont).each(function (i, el) {
                    $(el).addClass("dis");
                    $(".checkbox", el).addClass("dis");
                });
                $(".node:not(.t3) .counter b", _this.$cont).addClass("dis");
            } else if ($(".node.multi.sel:not(.t3)", _this.$cont).length) {
                $(".node.multi:not(.t3)", _this.$cont).each(function (i, el) {
                    $(el).removeClass("dis");
                    $(".checkbox", el).removeClass("dis");
                });
            }
            if (_this.data.couponShipPrice >= _this.data.shipPrice) {
                $(".node.t3:not(.sel)", _this.$cont).each(function (i, el) {
                    $(el).addClass("dis");
                    $(".checkbox", el).addClass("dis");
                });
                $(".node.t3 .counter b", _this.$cont).addClass("dis");
            } else if ($(".node.t3.multi.sel", _this.$cont).length) {
                $(".node.t3.multi", _this.$cont).each(function (i, el) {
                    $(el).removeClass("dis");
                    $(".checkbox", el).removeClass("dis");
                });
            }
            _this.useWallet();
        },
        /**
         * 使用余额
         */
        useWallet: function () {
            var _this = this;
            if (_this.inputPayPassword) {
                _this.data.payPassword = $("#pay_password").val();
            }
            if (_this.data.isWallet && T.RE.pwd.test(_this.data.payPassword)) { //输入支付密码格式正确
                var payablePrice = T.Number.sub(_this.data.orderPrice, parseFloat(_this.data.couponPrice || 0), parseFloat(_this.data.couponShipPrice || 0));
                if (_this.data.walletTotalPrice < payablePrice) { //余额不够支付需支付金额
                    _this.data.walletPrice = _this.data.walletTotalPrice;
                } else { //余额可以支付需支付金额
                    _this.data.walletPrice = payablePrice;
                }
            } else {
                _this.data.walletPrice = 0;
            }
            _this.setDeduction();
        },
        /**
         * 设置抵扣信息
         * 使用优惠券、余额后，计算剩余应支付金额
         */
        setDeduction: function () {
            var _this = this;
            if (_this.data.payType) {
                _this.data.walletPrice = 0;
                _this.data.couponPrice = 0;
                _this.data.couponShipPrice = 0;
            }
            if (_this.data.services.length) {
                _this.data.couponPrice = 0;
                _this.data.couponShipPrice = 0;
            }
            if (_this.data.isVIP && _this.data.isVIPLevel > 0) {
                if (_this.data.vipDiscount > 0) {
                    $("#vip_discount_num").show();
                }
                _this.data.paidPrice = T.Number.sub(_this.data.orderPrice, T.Number.mul(_this.data.orderPrice, _this.data.vipDiscount));
            } else {
                $("#vip_discount_num").hide();
                _this.data.paidPrice = T.Number.add(parseFloat(_this.data.walletPrice || 0), parseFloat(_this.data.couponPrice || 0), parseFloat(_this.data.couponShipPrice || 0));
            }
            _this.data.payablePrice = T.Number.sub(_this.data.orderPrice, _this.data.paidPrice);
            _this.data.walletDeduction = T.RMB(_this.data.walletPrice);
            if (_this.data.walletPrice > 0) {
                $("#wallet_deduction").show();
                _this.data.walletDeduction = "-" + _this.data.walletDeduction;
            } else {
                $("#wallet_deduction").hide();
            }
            _this.data.couponDeduction = T.RMB(T.Number.add(parseFloat(_this.data.couponPrice || 0), parseFloat(_this.data.couponShipPrice || 0)));
            if (_this.data.couponPrice > 0 || _this.data.couponShipPrice > 0) {
                $("#coupon_deduction").show();
                _this.data.couponDeduction = "-" + _this.data.couponDeduction;
            } else {
                $("#coupon_deduction").hide();
            }
            _this.data.totalDeduction = "0.00";
            if (_this.data.paidPrice > 0) {
                _this.data.totalDeduction = "-" + T.RMB(_this.data.paidPrice);
            }
            T.BindData("data", _this.data);
        },
        /**
         * 验证支付密码
         * @param {String} val 支付密码
         * @returns {boolean}
         */
        checkPayPwd: function (val) {
            var _this = this;
            val = $.trim(val);
            if (_this.data.isWallet || _this.data.payType == 16 || _this.data.payType == 24 || _this.data.payType == 25) {
                val = val || "";
                if (val === "" || !_this.inputPayPassword) {
                    T.msg("请填写支付密码");
                } else if (val.length < 6) {
                    T.msg("请填写不少于6位密码");
                } else if (val.length > 16) {
                    T.msg("请填写不超过16位密码");
                } else if (T.RE.pwd.test(val)) {
                    _this.data.payPassword = val;
                    return true;
                } else {
                    T.msg("密码不能包含空格");
                }
            }
        },
        /**
         * 选择抵扣方式
         * @param {jQuery|Zepto} $this 当前DOM对象
         * @param {Event} e 事件源
         */
        chooseDeduction: function ($this, e) {
            debugger
            var _this = this;
            if ($this.data("type") == "amoeba_cash") {
                $(_this.payPwdBox).prependTo("#amoeba_cash_pay dd.amoeba_cash_pay");
            }
            if ($this.data("type") == "wallet") {
                $(_this.payPwdBox).prependTo("#wallet_pay dd.wallet_pay");
            }
            if ($this.hasClass("dis") || _this.data.orderType == 5) {
                if (_this.data.payType == 20) {
                    T.msg('优惠券抵扣不可与会员优惠折扣混合使用。');
                } else if (_this.data.isCoupon) {
                    T.msg('会员优惠折扣不可与优惠券抵扣混合使用。');
                } else {
                    T.msg("本订单不可" + $('>b', $this).text() + "支付");
                }
                return;
            }
            var $coupons = $("#coupons");
            if ($this.hasClass("sel")) {
                $this.removeClass("sel");
                $this.next("dd").stop(true, true).animate({
                    height: 0
                }, 200, function () {
                    $this.next("dd").removeClass("shw");
                });
                if ($this.data("type") == "wallet") {
                    $(".vip_pay", $coupons).removeClass("dis");
                    _this.data.payType = "";
                    _this.data.isWallet = false;
                    _this.data.walletPrice = 0;
                    _this.setDeduction();
                } else if ($this.data("type") == "coupon") {
                    $(".vip_pay", $coupons).removeClass("dis");
                    _this.data.payType = "";
                    _this.data.isCoupon = false;
                    _this.data.couponPrice = 0;
                    _this.data.couponShipPrice = 0;
                    _this.setDeduction();
                } else if ($this.data("type") == "vip") {
                    $(">dt.checkbox:not(.vip_pay)", $coupons).removeClass("dis");
                    _this.data.payType = "";
                    _this.data.isVIP = false;
                    _this.setDeduction();
                }
            } else {
                var $next = $this.next("dd");
                $this.addClass("sel");
                $next.addClass("shw").stop(true, true).animate({
                    height: $next.children("div,dl").outerHeight(true)
                }, 200, function () {
                    $next.height("auto");
                });
                if ($this.data("type") == "wallet") {
                    $(".vip_pay", $coupons).addClass("dis");
                    _this.data.payType = "";
                    _this.data.isWallet = true;
                    _this.useCoupon();
                } else if ($this.data("type") == "coupon") {
                    $(".vip_pay", $coupons).addClass("dis");
                    _this.data.payType = "";
                    _this.data.isCoupon = true;
                    _this.useCoupon();
                } else if ($this.data("type") == "vip") {
                    $(">dt.checkbox:not(.vip_pay)", $coupons).addClass("dis");
                    _this.data.payType = 20;
                    _this.data.isVIP = true;
                    _this.useCoupon();
                }
            }
        },
        /**
         * 选择优惠券
         * @param {jQuery|Zepto} $this 当前DOM对象
         * @param {Event} e 事件源
         */
        chooseCoupon: function ($this, e) {
            var _this = this;
            if ($(e.target).closest(".counter").length) return;
            var coupon = _this.data.couponList[$this.data("index")];
            var isT3 = $this.hasClass("t3") ? ".t3" : "";
            if ($this.hasClass("sel")) {
                $this.removeClass("sel");
                $(".checkbox", $this).removeClass("sel");
                if ($this.hasClass("single")) {
                    if (isT3) { //运费券
                        $this.siblings(".node.t3").removeClass("dis");
                    } else {
                        $this.siblings(".node:not(.t3)").removeClass("dis");
                    }
                }
                if ($this.hasClass("multi") && !$(".node.multi.sel", _this.$cont).length) {
                    if (isT3) { //运费券
                        $this.siblings(".node.t3").removeClass("dis");
                    } else {
                        $this.siblings(".node:not(.t3)").removeClass("dis");
                    }
                } else if ($this.hasClass("multi") && $(".node.multi.sel", _this.$cont).length) {
                    if (isT3) { //运费券
                        $this.siblings(".node.multi.t3").removeClass("dis");
                    } else {
                        $this.siblings(".node.multi:not(.t3)").removeClass("dis");
                    }
                }
            } else {
                if (!isT3 && _this.data.orderProductPrice > 0 && _this.data.couponPrice >= _this.data.orderProductPrice) {//如果优惠券抵扣金额大于等于订单商品金额
                    if (e && _this.data.orderType > 0) {
                        T.msg(this.tips[1]);
                    } else if (e) {
                        T.msg(this.tips[0]);
                    }
                    return;
                }
                if (isT3 && _this.data.shipPrice > 0 && _this.data.couponShipPrice >= _this.data.shipPrice) {//如果优惠券抵扣金额大于等于订单运费金额
                    if (e && _this.data.orderType === 0) {
                        T.msg(this.tips[2]);
                    }
                    return;
                }
                if (e && $this.hasClass("dis")) {
                    T.msg("此优惠券不能与您已选择的优惠券叠加使用");
                    return;
                }
                if ($this.hasClass("single")) {
                    if (isT3) { //运费券
                        $this.siblings(".node.t3").addClass("dis");
                        $(".node.t3, .node.t3 .checkbox", _this.$cont).removeClass("sel");
                    } else {
                        $this.siblings(".node:not(.t3)").addClass("dis");
                        $(".node:not(.t3), .node:not(.t3) .checkbox", _this.$cont).removeClass("sel");
                    }
                }
                if ($this.hasClass("multi")) {
                    if (isT3) { //运费券
                        $this.siblings(".node.single.t3").addClass("dis");
                        $(".node.single.t3, .node.single.t3 .checkbox", _this.$cont).removeClass("sel");
                    } else {
                        $this.siblings(".node.single:not(.t3)").addClass("dis");
                        $(".node.single:not(.t3), .node.single:not(.t3) .checkbox", _this.$cont).removeClass("sel");
                    }
                }
                _this.setCounter($this);
                $this.addClass("sel");
                $(".checkbox", $this).addClass("sel");
            }
            _this.useCoupon();
        },
        /**
         * 设置数字输入框
         * @param {jQuery|Zepto} $this 当前DOM对象
         * @param {Event} e 事件源
         */
        setCounter: function ($this, e) {
            var _this = this;
            var coupon = _this.data.couponList[$this.data("index")];
            var isT3 = $this.hasClass("t3") ? ".t3" : "";
            if (coupon) {
                var price = 0;
                if (isT3) {
                    price = T.Number.sub(parseFloat(_this.data.shipPrice || 0), parseFloat(_this.data.couponShipPrice || 0));
                } else {
                    price = T.Number.sub(parseFloat(_this.data.orderProductPrice || 0), parseFloat(_this.data.couponPrice || 0));
                }
                var num = e ? parseInt($.trim($(".counter input", $this).val()), 10) || 1 : 0;
                var count = Math.ceil(price / coupon.couponPrice) + num;
                count = Math.min(coupon.usableCount || 1, count);
                e || $(".counter input", $this).val(Math.min(num, count) || 1);
                $this.counter({
                    cont: ".counter",
                    min: 1,
                    max: count || 1,
                    step: 1,
                    change: function ($input, val, flag) {
                        _this.useCoupon();
                    }
                });
            }
        },
        /*/!**
         * 获得优惠券
         * @param {jQuery|Zepto} $this 当前DOM对象
         * @param {Event} e 事件源
         *!/
        gainCoupon: function($this, e){
            if (!$this.siblings(".insert").length) {
                $this.before('<li title="我有优惠券兑换码或口令" class="insert"><span class="checkbox"></span><span class="img"><label><input id="record_code_input" class="textbox" type="text" name="record_code" autocomplete="off" /></label><a id="redeemed_coupon" class="addbtn" href="javascript:;">兑 换</a></span></li>');
                $this.hide();
                T.FORM().placeholder(T.DOM.byId('record_code_input'), "请输入兑换码或口令");
            }
        },*/
        /**
         * 兑换优惠券
         * @param {jQuery|Zepto} $this 当前DOM对象
         * @param {Event} e 事件源
         */
        redeemedCoupon: function ($this, e) {
            var _this = this;
            var $input = $("#record_code_input");
            var recordCode = $.trim($input.val());
            if (recordCode) {
                T.RedeemedCoupon(recordCode, function (res) {
                    _this.getCoupon(function (data, params) {
                        if (res && res.cardCode && !T.Array.get(_this.data.couponList, res.cardCode, "cardCode")) {
                            T.msg('优惠券兑换码兑换成功，但不可使用于本订单，您可以在我的优惠中查看。');
                        }
                    });
                });
            } else {
                T.CouponAltPopup({
                    msg: '请输入优惠券兑换码或口令！'
                });
            }
        },
        /**
         * 展开/收起优惠券列表
         * @param {jQuery|Zepto} $this 当前DOM对象
         * @param {Event} e 事件源
         */
        shwHidCoupon: function ($this, e) {
            var $couponList = $(".coupon_list", $this.closest(".coupon_pay"));
            if ($this.hasClass("showmore")) {
                $(".node:gt(6)", $couponList).show();
                $this.removeClass("showmore").addClass("hidemore").text("收起全部");
                $couponList.stop(true, true).animate({
                    height: Math.ceil(($(".node", $couponList).length + 1) / 4) * $(".node:eq(0)", $couponList).outerHeight(true)
                }, 300, function (e) {
                    $couponList.height("");
                });
                $couponList.parent().removeClass("collapsed");
            } else {
                $this.removeClass("hidemore").addClass("showmore").text("展开全部");
                $couponList.stop(true, true).animate({
                    height: 270
                }, 300, function (e) {
                    $(".node:gt(6)", $couponList).hide();
                    $couponList.parent().addClass("collapsed");
                });
            }
        },
        /**
         * 设置月结/余额支付
         */
        setCreditAndWallet: function () {
            var that = this;
            if (that.data.isCreditPay) { //支持信用支付
                $(".credit_pay .tit .desc", that.$cont).html('您的信用额度 <b id="form_credit_amount" class="red">' + T.RMB(that.data.creditAmount) + '</b> 元，可用额度 <b id="form_use_credit_amount" class="red">' + T.RMB(that.data.useCreditAmount) + '</b> 元');
                $(".credit_pay .tit", that.$cont).removeClass('dis');
            } else {
                $("#credit_pay").remove();
            }
            if (that.data.isMonthlyPay) { //支持月结支付
                $(".monthly_pay .tit .desc", that.$cont).html('您的月结额度 <b id="form_monthly_amount" class="red">' + T.RMB(that.data.monthlyAmount) + '</b> 元，可用额度 <b id="form_use_monthly_amount" class="red">' + T.RMB(that.data.useMonthlyAmount) + '</b> 元');
                $(".monthly_pay .tit", that.$cont).removeClass('dis');
            } else {
                $("#monthly_pay").remove();
            }
            if (that.data.isCreditPay || that.data.isMonthlyPay || that.data.isAmoebaCashPay) {
                $("#wallet_pay .wallet_pay.last").removeClass("first");
            } else {
                $("#wallet_pay .wallet_pay.last").addClass("first");
            }
            $(that.$cont).off("click.credit_pay").on("click.credit_pay", ".credit_pay > dt", function (e) {
                debugger
                var $this = $(this);
                if ($this.hasClass("dis")) {
                    T.msg(that.data.isMonthlyPay ? '本订单不可使用信用账户支付。' : "您暂未申请信用账户，3个月累计消费满50万元，可申请成为信用客户。");
                    return;
                }
                if ($this.hasClass("sel")) {
                    $(that.payPwdBox).prependTo("#wallet_pay dd.wallet_pay");
                    $this.removeClass("sel");
                    $this.closest(".credit_pay").removeClass("shw").siblings(".coupons").show();
                    //$("#payment .payments").show();
                    $("#payment .ofilter").show();
                    $("#payment .dtab").removeClass("hide");
                    $("#payment .ofilter a:first").click();
                    $("#payment .paylist a[data-value='109']").show();
                    $("#payment .payments>.title").text('请选择支付方式：');
                    that.data.payType = "";
                } else {
                    $(that.payPwdBox).prependTo("#credit_pay dd.credit_pay");
                    $this.addClass("sel");
                    $this.closest(".credit_pay").addClass("shw").siblings(".coupons").hide();
                    //$("#payment .payments").hide();
                    $("#payment .ofilter").hide();
                    $("#payment .onlinepay").removeClass("hide").siblings(".dtab").addClass("hide");
                    $("#payment .paylist a[data-value='109']").hide();
                    $("#payment .payments>.title").text('请选择服务费支付方式：');
                    that.data.payType = 24;
                }
                that.useCoupon();
            });
            $(that.$cont).off("click.monthly_pay").on("click.monthly_pay", ".monthly_pay > dt", function (e) {
                var $this = $(this);
                if ($this.hasClass("dis")) {
                    T.msg(that.data.isMonthlyPay ? '本订单不可使用企业月结支付支付。' : "您暂未申请月结账户，3个月累计消费满5万元，可申请成为月结客户。");
                    return;
                }
                if ($this.hasClass("sel")) {
                    $(that.payPwdBox).prependTo("#wallet_pay dd.wallet_pay");
                    $this.removeClass("sel");
                    $this.closest(".monthly_pay").removeClass("shw").siblings(".coupons").show();
                    $("#payment .payments").show();
                    that.data.payType = "";
                } else {
                    $(that.payPwdBox).prependTo("#monthly_pay dd.monthly_pay");
                    $this.addClass("sel");
                    $this.closest(".monthly_pay").addClass("shw").siblings(".coupons").hide();
                    $("#payment .payments").hide();
                    that.data.payType = 16;
                }
                that.useCoupon();
            });
            $(that.$cont).off("click.amoeba_cash_pay").on("click.amoeba_cash_pay", ".amoeba_cash_pay > dt", function (e) {
                var $this = $(this);
                if ($this.hasClass("sel")) {
                    $(that.payPwdBox).prependTo("#wallet_pay dd.wallet_pay");
                    $this.removeClass("sel");
                    $this.closest(".amoeba_cash_pay").removeClass("shw").siblings(".coupons").show();
                    //$("#payment .payments").show();
                    $("#payment .ofilter").show();
                    $("#payment .dtab").removeClass("hide");
                    $("#payment .ofilter a:first").click();
                    $("#payment .paylist a[data-value='109']").show();
                    that.data.payType = "";
                } else {
                    $(that.payPwdBox).prependTo("#amoeba_cash_pay dd.amoeba_cash_pay");
                    $this.addClass("sel");
                    $this.closest(".amoeba_cash_pay").addClass("shw").siblings(".coupons").hide();
                    //$("#payment .payments").hide();
                    $("#payment .ofilter").hide();
                    $("#payment .onlinepay").removeClass("hide").siblings(".dtab").addClass("hide");
                    $("#payment .paylist a[data-value='109']").hide();
                    that.data.payType = 25;
                }
                that.useCoupon();
            });
            /*if (that.data.orderType != 5 && that.data.isWallet && that.data.walletTotalPrice > 0) {debugger
                $(".wallet_pay:not(.dis)", that.$cont).click();
                //that.inputPayPassword = true;
            } else if (that.data.orderType == 5 || !that.data.isWallet) {
                that.data.isWalletPay = false;
                $("#wallet_pay").remove();
            }*/
        },
        complete: function (data) { //加载完毕
            var _this = this;
            if ($("#pay_form").length) {
                $("#payform").html(T.Compiler.template("pay_form", _this.data));
            }
            if ($("#pay_info").length) {
                $("#oinfo").html(T.Compiler.template("pay_info", _this.data));
            }
            _this.payPwdBox = T.DOM.byId('pay_pwd_box');
            T.FORM().placeholder(T.DOM.byId('pay_password'), '请填写支付密码');
            if (_this.callbacks.loaded && data !== true) {
                _this.callbacks.loaded.call(_this, _this.data);
            }
        },
        /**
         * 支付并创建订单
         * @param params
         */
        getParams: function (params) {
            var _this = this;
            params = params || {};
            params.pay_id = 2;
            params.invoice_id = "0";
            if (T._TYPE == 3 && T._OPERATOR_CODE) { //代下单操作人编号
                params.operator_code = T._OPERATOR_CODE;
            }
            //支付信息
            if (_this.data.payType == 24) { //信用账户支付
                params.pay_type = _this.data.payType;
                if (_this.data.hasAmoebaPayPassword && _this.data.useCreditAmount > 0) {
                    if (_this.checkPayPwd($("#pay_password").val())) {
                        params.amoeba_password = _this.data.payPassword;
                    } else {
                        return;
                    }
                } else if (!_this.data.hasAmoebaPayPassword && _this.data.useCreditAmount > 0) {
                    T.msg("您还未设置支付密码，请先设置支付密码！");
                    return;
                } else if (_this.data.useCreditAmount <= 0) {
                    T.msg("信用账户可用额度不足，请选择其他支付方式！");
                    return;
                } else {
                    return;
                }
            } else if (_this.data.payType == 25) { //代金账户支付
                if (_this.data.hasAmoebaPayPassword && _this.data.amoebaCashAmount > 0) {
                    if (_this.checkPayPwd($("#pay_password").val())) {
                        params.amoeba_password = _this.data.payPassword;
                    } else {
                        return;
                    }
                } else if (!_this.data.hasAmoebaPayPassword && _this.data.amoebaCashAmount > 0) {
                    T.msg("您还未设置支付密码，请先设置支付密码！");
                    return;
                }
            } else if (_this.data.payType == 16) { //月结支付
                params.pay_type = _this.data.payType;
                if (_this.data.hasPayPassword && _this.data.useMonthlyAmount > 0) {
                    if (_this.checkPayPwd($("#pay_password").val())) {
                        params.password = _this.data.payPassword;
                    } else {
                        return;
                    }
                } else if (!_this.data.hasPayPassword && _this.data.useMonthlyAmount > 0) {
                    T.msg("您还未设置支付密码，请先设置支付密码！");
                    return;
                } else if (_this.data.useMonthlyAmount <= 0) {
                    T.msg("月结账户额度可用不足，请选择其他支付方式！");
                    return;
                } else {
                    return;
                }
            } else if (_this.data.payType == 20) { //会员折扣支付
                params.pay_type = _this.data.payType;
            } else {
                //支付信息
                if (_this.data.isCoupon && _this.data.couponCodes) {//优惠券支付
                    params.coupon_code = _this.data.couponCodes;
                }
                //余额支付
                if (_this.data.isWallet) {
                    if (_this.data.hasPayPassword && _this.data.walletTotalPrice > 0) {
                        if (_this.checkPayPwd($("#pay_password").val())) {
                            params.password = _this.data.payPassword;
                        } else {
                            return;
                        }
                    } else if (!_this.data.hasPayPassword && _this.data.walletTotalPrice > 0) {
                        T.msg("您还未设置支付密码，请先设置支付密码！");
                        return;
                    }
                }
            }
            return params;
        },
        /**
         * 提交订单
         * @param $this
         * @param e
         */
        submit: function (action, params) {
            var _this = this;
            var $oinfo = $("#oinfo");
            if ($(".doing", $oinfo).length || $(".submit", $oinfo).hasClass("dis")) return;
            params = params || {};
            params.buyer_remark = params.buyer_remark || $("#buyer_remark").val();
            params = _this.getParams(params);
            if (action && params) {
                $(".submit", $oinfo).addClass("dis");
                _this.timeObj = setTimeout(function () {
                    $(".submit", $oinfo).removeClass("dis");
                }, 30000);
                T.POST({
                    action: action,
                    params: params,
                    success: function (data, params) {
                        data = data || {};
                        /*支付时resultType取值
                         0=未选择支付方式，创建订单成功
                         1=选择支付方式，部分支付成功
                         2=选择支付方式，完全支付成功
                         3=优惠券失败
                         4=支付密码错误
                         5=月结月不足or不可用
                         6=赠送设计服务，支付成功*/
                        if (params.pay_id == 1) {
                            _this.goDetail(data, 1);
                        } else if (data.orderCode || data.resultType >= 0) {
                            if (data.orderCode && data.resultType < 2) { //部分支付成功
                                _this.goPayment(data);
                            } else if (data.orderCode && data.resultType == 2) { //完全支付成功
                                _this.goDetail(data, 1);
                            } else if (data.orderCode) {
                                _this.goPayment(data);
                            } else {
                                _this.error(data || {});
                            }
                        } else {
                            _this.error(data || {});
                        }
                        if (_this.timeObj) {
                            clearTimeout(_this.timeObj);
                        }
                    },
                    failure: function (data, params) {
                        $(".submit", $oinfo).removeClass("dis");
                        data = data || {};
                        if (data.resultType == 3) { //优惠券不可用
                            //T.msg(data.msg || '优惠券不可用，请重新选择优惠券！');
                            T.msg(data.msg || '优惠券不可用，请重新选择优惠券！');
                            setTimeout(function () {
                                location.reload();
                            }, 1000);
                        } else if (data.resultType == 4) { //支付密码错误
                            //T.msg(data.msg || '支付密码错误，请重新输入！');
                            T.msg(data.msg || '支付密码错误，请重新输入！');
                        } else if (data.resultType == 5) { //月结月不足or不可用
                            //T.msg(data.msg || '月结帐户余额不足，请选择其他支付方式！');
                            T.msg(data.msg || '月结额度不足，请选择其他支付方式！');
                        } else {
                            _this.error(data || {});
                        }
                        if (_this.timeObj) {
                            clearTimeout(_this.timeObj);
                        }
                    }
                }, function (data, params) {
                    _this.error(data || {}, 1);
                }, function (data, params) {
                    _this.error(data || {}, 1);
                });
            }
        },
        error: function (data, level) {
            var _this = this;
            var $oinfo = $("#oinfo");
            if (level == 1) {
                $(".submit", $oinfo).removeClass("dis");
                if (data.result == 3) {
                    T.LoginForm();
                } else {
                    T.alt(data.msg || T.TIPS.DEF, function (_o) {
                        _o.remove();
                    });
                }
                if (_this.timeObj) {
                    clearTimeout(_this.timeObj);
                }
            } else {
                if (_this.data.orderType > 0) {
                    T.msg(data.msg || T.TIPS.DEF);
                } else {
                    T.alt(data.msg || T.TIPS.DEF, function (_o) {
                        _o.remove();
                        window.location.replace(T.DOMAIN.CART + 'index.html');
                    }, function (_o) {
                        _o.remove();
                        window.location.replace(T.DOMAIN.CART + 'index.html');
                    }, '返回购物车');
                }
            }
        },
        /**
         * 到订单列表
         * @param data
         */
        goOrderList: function (data) {
            var pageName = "index";
            if (data.type == 5) {
                pageName = "package";
            } else if (data.type == 10) {
                pageName = "design";
            }
            window.location.replace(T.DOMAIN.ORDER + pageName + ".html");
        },
        /**
         * 查看订单详情
         * @param data
         * @param s
         */
        goDetail: function (data, success) {
            var _this = this;
            if (window.PCD && _this.data.address && _this.data.address.address) {
                window.PCD.setCookie(_this.data.address.address);
            }
            window.location.replace(T.DOMAIN.MEMBER + 'odetail.html?o=' + data.orderCode + '&t=' + (data.type || 0) + (success ? '&s=' + success : '') + (T.INININ ? '&' + T.INININ : ''));
        },
        /**
         * 去支付
         * @param data
         */
        goPayment: function (data) {
            var _this = this;
            if (window.PCD && _this.data.address && _this.data.address.address) {
                window.PCD.setCookie(_this.data.address.address);
            }
            window.location.replace(T.DOMAIN.CART + "payment.html?o=" + data.orderCode + '&t=' + (data.type || 0) + (T.INININ ? '&' + T.INININ : ''));
        },
        /**
         * 提交设计需求
         * @param orderCode
         */
        goDatum: function (data) {
            var _this = this;
            var product = {}, isNewDesign = false;
            if (_this.data.productList && _this.data.productList.length == 1) {
                product = _this.data.productList[0] || {};
            }
            if (product && product.productId) {
                window.location.replace(T.DOMAIN.DESIGN + "product/" + product.productId + ".html?o=" + data.orderCode);
            }
        },
        /**
         * 继续购物
         */
        goShop: function () {
            window.location.replace(T.DOMAIN.WWW + (T.INININ ? "?" + T.INININ : ""));
        }
    });
});