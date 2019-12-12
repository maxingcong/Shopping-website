require(["base", "tools", "modules/ordering"], function ($, T, Ordering) {
    if (!T._LOGED) T.NotLogin();
    var ordering, Payment = T.Module({
        uuid: T.uuid(),
        data: {
            orderType: Number(T.REQUEST.t), //订单类型
            orderCode: T.REQUEST.o, //订单编号
            productList: [], //商品清单
            productNum: 0, //商品款数
            orderPrice: 0, //订单金额
            orderProductPrice: 0, //订单商品金额（特例：分发订单为订单金额）
            shipPrice: 0, //订单运费（特例：分发订单将运费记为订单商品金额）
            totalAgentPrice: 0, //代理价
            paymentMethod: 1, //支付类型，1：订单支付，2：支付服务费
            serviceChargeNeedPayment: '0.00', //应支付服务费

            //userPhone: "", //用户手机号
            //userChannel: "", //用户渠道
            //orderChannel: "",  //下单渠道
            isOrderDiscount: false, //是否为折扣订单

            isVipDiscount: false, //是否使用会员折扣支付

            agentCashPrice: 0, //加盟商现金账户余额
            agentRebatePrice: 0, //加盟商返现账户余额
            //isCardDesign: false, //是否为名片设计服务
            isInstallService: false, //是否为安装服务

            order: {}, //订单信息
            payType: "", //支付类型
            serviceChargePayType: "", //信用支付服务费支付类型
            payMode: 2 //支付方式
        },
        isFirst: true, //是否首次加载
        wxpopup: null, //微信二维码弹出框
        timeobj: null, //定时器对象
        interval: 3000, //定时查询时间间隔0
        requests: {}, //定时查询参数
        status: [''], //订单支付信息
        events: {
            "click .ofilter a": "switchoverPayType", //切换支付类型
            "click .onlinepay .radio": "changeOnlinePay", //选择银联在线银行
            "click .companypay .radio": "changeCompanyPay", //选择企业网银支付
            "click .agentpay dt.tit": "changeAgentPay", //选择加盟商支付方式
            "click .remittance": "sendRemittance", //发送汇款信息到手机
            "blur input[name='agent_pwd']": function ($this, e) { //输入支付密码
                this.checkPayPwd($this.val());
            },
            "click .submit:not(.remittance):not(.dis)": function ($this, e) { //支付
                this.submit();
            }
        },
        $cont: $("#payment"),
        init: function (options) {
            var that = this;
            options = options || {};
            if (that.data.orderCode) {
                //确认订单
                ordering = new Ordering({
                    data: {
                        orderCode: that.data.orderCode,
                        isUserInfo: true,
                        isCanCredit: true,
                        isCanMonthly: true,
                        isWallet: true,
                        isCoupon: false
                    },
                    callbacks: {
                        loaded: function (data, params) {
                            /*if (T.RE.mobile.test(T._ACCOUNT)) { //如果用户账号是手机号
                                that.data.userPhone = T._ACCOUNT;
                            } else if (data.user) { //如果用户信息中存在手机号
                                that.data.userPhone = data.user.phone || "";
                            }*/
                            //支付宝支付
                            that.data.isAlipayPay = ordering.data.isAlipayPay
                            //微信支付
                            that.data.isWeChatPay = ordering.data.isWeChatPay
                            //银联在线支付
                            that.data.isOnlineBanking = ordering.data.isOnlineBanking
                            //现金账户支付
                            that.data.isWalletPay = ordering.data.isWalletPay
                            //月结支付
                            that.data.isMonthlyPay = ordering.data.isMonthlyPay
                            //信用支付
                            that.data.isCreditPay = ordering.data.isCreditPay
                            //企业网银支付
                            that.data.isEnterpriseOnlineBanking = ordering.data.isEnterpriseOnlineBanking
                            //企业汇款
                            that.data.isEnterpriseRemittance = ordering.data.isEnterpriseRemittance
                            //代理商支付
                            that.data.isAgentCash = ordering.data.isAgentCash
                            that.data.isAgentRebate = ordering.data.isAgentRebate
                            that.data.isAgentPay = ordering.data.isAgentPay
                            that.disposeOrder(data.paymentData)
                            that.loaded(data, params, 0);
                        }
                    }
                }, 1);
            } else {
                that.backOrder();
            }
        },
        /**
         * 订单信息
         */
        /*getOrder: function (param, callback) {
            var that = this;
            T.GET({
                action: CFG_DS.myorder.get,
                params: param,
                success: function (data, params) {
                    data.orderList = data.orderList || [];
                    var order = data.orderList[0] || {};
                    if (Number(order.status) === 0) { //如果订单未支付，则初始化支付信息
                        that.data.orderType = order.type; //订单类型
                        that.data.isCanDiscount = order.canDiscount == 1; //是否为折扣订单
                        if (order.orderProductList && order.orderProductList.length) {
                            that.data.productList = order.orderProductList || [];
                            that.disposeOrder(order);
                            that.data.order = order;
                            that.loaded(data, params, callback);
                        } else {
                            ordering.goOrderList(that.data);
                        }
                        that.data.isVipDiscount = false; //是否使用设计会员折扣支付过
                        T.Each(order.orderPayList, function (i, pay) {
                            if (pay.payStatus == 1 && pay.payType == 20) {
                                that.data.isVipDiscount = true;
                            }
                        });
                    } else {
                        ordering.goDetail(that.data);
                    }
                },
                failure: function (data, params) {
                    T.alt(data.msg || '订单不存在或已删除', function (_o) {
                        _o.remove();
                        that.backOrder();
                    }, function (_o) {
                        _o.remove();
                        that.backOrder();
                    }, '返回我的订单');
                },
                error: function (data, params) {
                    ordering.goOrderList(that.data);
                }
            });
        },*/
        /**
         * 查询加盟商账户余额
         * @param [userChannel] 用户渠道编号
         */
        /*getAgentAccount: function (userChannel) {
            var that = this;
            userChannel = userChannel || that.data.userChannel;
            T.GET({
                issid: true,
                action: "in_agent/agent_account/query_account",
                params: {
                    agent_code: userChannel
                },
                success: function (data, params) {
                    that.data.agentCashPrice = data.cash || 0; //加盟商现金账户余额
                    that.data.agentRebatePrice = data.rebate || 0; //加盟商返现账户余额
                    if (data.cash > 0) {
                        that.isAgentCash = true;
                    }
                    if (data.rebate > 0) {
                        that.isAgentRebate = true;
                    }
                    that.loaded(data, params, 2);
                }
            });
        },*/
        /**
         * 处理订单信息
         * @param order
         */
        disposeOrder: function (data) {
            var that = this;
            //that.data.orderChannel = data.userChannel || ""; //下单渠道
            that.data.orderTypeStr = "普通订单";
            /*if (order.totalProductPrice <= 0) {
                order.totalProductPrice = Math.max(T.Number.sub(order.totalPrice, order.shipPrice), 0);
            }*/
            that.data.isOrderDiscount = data.isOrderDiscount === 1
            if (that.data.isOrderDiscount) { //折扣订单不支持加盟商支付
                that.data.canDiscountStr = '，折扣后金额 <span class="red">' + T.RMB(data.totalPrice) + '</span> 元 ';
                //var totalPrice = T.Number.add(order.totalProductPrice, order.shipPrice); //打折前
                that.data.orderTypeStr = "折扣订单";
                /*if (order.totalProductPrice > 0 && totalPrice > order.totalPrice) {
                    that.data.orderTypeStr = '折扣订单（已为您节省 <b class="red">' + T.RMB(T.Number.sub(totalPrice - order.totalPrice)) + '</b> 元）';
                }*/
                that.data.orderTypeStr = '折扣订单（已为您节省 <b class="red">' + T.RMB(data.savedAmount) + '</b> 元）';
            }
            /*T.Each(order.orderProductList, function (k, product) {
                /!*!//是否为名片设计服务
                if(product.categoryId==CFG_DB.DESIGN.MINGPIAN){
                    that.data.isCardDesign = true;
                }*!/
                if (product.productId == 116 || product.productId == 117) {
                    that.data.isCanMonthly = false;
                    that.data.isWallet = false;
                }
                //是否为安装服务
                if (T.IsInstallService(product.productId)) {
                    that.data.isInstallService++;
                }
            });*/

            var stepImg = T.DOMAIN.RESOURCES + "step/2_3.png"; //购买流程图
            if (data.orderType == 5) { //账户充值订单（只能第三方）
                that.data.orderType = 5;
            } else if (data.orderType == 10) { //设计服务订单（支持设计券、现金券抵扣）
                that.data.orderType = 10;
                //that.data.altMsg = that.data.isCardDesign?"":"支付成功后，请尽快提交设计需求";
            } else { //印刷订单（支持印刷券、现金券抵扣）
                that.data.orderType = 0;
                that.data.altMsg = "支付成功后，请尽快选择您需要印刷的文件";
                if (data.isInstallService) {
                    stepImg = T.DOMAIN.RESOURCES + "step/3_3.png";
                } else {
                    stepImg = T.DOMAIN.RESOURCES + "step/1_3.png";
                }
            }
            $("#step_img").attr("src", stepImg);

            /*//测试
            order.totalPrice = order.totalPrice * 0.8;
            order.needPay = order.totalPrice * 0.2;*/

            //订单信息
            that.data.recordTime = data.recordTime; //下单时间
            that.data.paymentMethod = data.paymentMethod || 1; //下单时间
            that.data.serviceChargeNeedPayment = data.serviceChargeNeedPayment || 0; //信用支付服务费
            that.data.originalPrice = data.originalTotalPrice; //折扣前总金额
            that.data.orderPrice = data.totalPrice || 0; //当前总金额
            that.data.payablePrice = data.orderNeedPayment || 0; //应付金额
            that.data.paidPrice = T.Number.sub(that.data.orderPrice, that.data.payablePrice); //已付金额
            that.data.shipPrice = Math.max(data.shipPrice || 0, 0); //运费
            that.data.orderProductPrice = data.totalProductPrice; //Math.max(T.Number.sub(that.data.orderPrice, that.data.shipPrice), 0); //订单商品金额
            that.data.productNum = data.productNum; //商品总款数
            that.data.totalAgentPrice = data.totalAgentPrice; //商品代理总金额

            //订单信息
            /*that.data.originalPrice = Math.max(T.Number.add(order.totalProductPrice, order.shipPrice), order.totalPrice); //折扣前总金额
            that.data.orderPrice = order.totalPrice || 0; //当前总金额
            that.data.paidPrice = order.needPay || 0; //已付金额
            that.data.payablePrice = T.Number.sub(that.data.orderPrice, that.data.paidPrice); //应付金额
            that.data.shipPrice = Math.max(order.shipPrice || 0, 0); //运费
            that.data.orderProductPrice = order.totalProductPrice; //Math.max(T.Number.sub(that.data.orderPrice, that.data.shipPrice), 0); //订单商品金额
            that.data.productNum = parseInt(order.productNum, 10) || order.orderProductList.length; //商品总款数
            that.data.totalAgentPrice = Math.max(T.Number.add((that.data.totalAgentPrice || that.data.orderProductPrice), that.data.shipPrice), 0); //商品代理总金额
            if (that.data.payablePrice < that.data.orderPrice) {
                that.data.totalAgentPrice = that.data.payablePrice;
            }

            if (that.data.payablePrice >= 500) {
                that.data.isEnterpriseOnlineBanking = true;
            }*/
            //如果上品折扣低于9折，不支持余额支付，大于等于9折时为true
            //that.data.isNineDiscount = that.data.orderPrice >= T.Number.add(T.RMB(T.Number.mul(that.data.orderProductPrice, .9)), that.data.shipPrice);
            //that.data.isWallet = that.data.isNineDiscount;
        },
        /**
         * 渲染数据
         * @param data
         */
        render: function (data) {
            var that = this;
            /*that.data.isAgentPay = that.data.isAgentPay && (that.data.payablePrice == that.data.orderPrice);
            if (that.data.isAgentPay && (that.data.userChannel.toUpperCase() == that.data.orderChannel.toUpperCase())) { //是否为加盟商
                that.data.isAgentPay = true;
                that.data.isAgentCash = true;
                that.data.isAgentRebate = true;
            } else {
                that.data.isAgentPay = false;
                that.data.isAgentCash = false;
                that.data.isAgentRebate = false;
            }*/
            T.Template("order", that.data, true);
            T.Template("payment", that.data, true);
            T.BindData("order", that.data);
        },
        /**
         * 加载完成
         */
        complete: function () {
            var that = this;
            ordering.data.address = {};
            ordering.data.orderType = that.data.orderType;
            ordering.data.orderCode = that.data.orderCode || "";
            ordering.data.productList = that.data.productList || [];
            ordering.data.productNum = that.data.productNum || 0;
            ordering.data.orderPrice = that.data.payablePrice || 0;
            ordering.data.orderProductPrice = that.data.orderProductPrice || 0;
            ordering.data.shipPrice = that.data.shipPrice || 0;
            ordering.data.couponPrice = that.data.couponPrice || 0;
            ordering.data.couponCodes = "";
            ordering.data.categoryIdName = "categoryId";
            ordering.data.productIdName = "productId";
            ordering.data.productPriceName = "totalPrice";
            ordering.getUsableCouponByOrder();
            if (that.data.productNum < 1) {
                $(".submit", that.$cont).addClass("dis");
            }
            ordering.setCreditAndWallet();
            //当订单已支付过或者用户是加盟商的用户，不能使用月结支付
            if (that.data.isAgentPay || (that.data.isVipDiscount && that.data.orderPrice != that.data.payablePrice)) {
                ordering.data.isMonthlyPay = false;
                $("#monthly_pay").remove();
                $("#wallet_pay .wallet_pay.last").addClass("first");
            }
            //账户充值订单不支持月结、余额支付
            if (that.data.isAgentPay || that.data.orderType == 5) {
                ordering.data.isMonthlyPay = false;
                ordering.data.isWalletPay = false;
                $("#monthly_pay").remove();
                $(".wallet_pay", that.$cont).addClass("dis");
                $("#wallet_pay .wallet_pay.last").addClass("first");
            }
            if (!ordering.data.isAmoebaCashPay) {
                $("#amoeba_cash_pay").remove();
                $("#monthly_pay .monthly_pay").addClass("last");
            }
            if (!ordering.data.isWalletPay) {
                $("#wallet_pay").remove();
                $("#monthly_pay .monthly_pay").addClass("last");
            }
            /*if(!that.data.isNineDiscount && !that.data.isVipDiscount){
                $("#payform").append('<div class="gap_ml_30 pb10 red">订单折扣低于9折，无法享受账户充值优惠，将无法使用现金账户支付，如有任何疑问请联系客服</div>');
            }*/

            //汇款单号示意图
            T.TIP({
                container: '#payment',
                trigger: '.companypay .icon_help',
                content: function (trigger) {
                    return $("#receipt_number_img").html();
                },
                style: 'tips_cont',
                width: 743,
                left: true,
                offsetX: 23,
                offsetY: -220
            });
            if (!that.isFirst) return;
            that.isFirst = false;
            //加盟商支付密码
            T.FORM().placeholder(T.DOM.byId("agent_pay_password"), "请填写支付密码");
            T.FORM().placeholder(T.DOM.byId("receipt_number"), "请填写回单编号");
            T.BindQQService();
            T.PageLoaded();
        },
        switchoverPayType: function ($this, e) {
            var that = this;
            var mode = $this.data("type");
            if (typeof(mode) != "undefined") {
                if (mode == 3) {
                    $("#submit, #data_altMsg", that.$cont).hide();
                } else {
                    $("#submit, #data_altMsg", that.$cont).show();
                }
                if (mode == 4) {
                    $("#order_payablePrice").html(T.RMB(that.data.totalAgentPrice));
                } else {
                    $("#order_payablePrice").html(T.RMB(that.data.payablePrice));
                }
                that.data.payMode = mode;
                $(".ofilter a", that.$cont).removeClass("sel");
                $this.addClass("sel");
                $(".dtab[type='" + mode + "']", that.$cont).removeClass("hide").siblings(".dtab").addClass("hide");
            }
        },
        changeOnlinePay: function ($this, e) {
            var that = this;
            var type = ($this.data("value") || 0) - 100;
            if (type >= 0) {
                that.data.serviceChargePayType = 0
                if (ordering.data.payType == 24) {
                    that.data.serviceChargePayType = type
                } else {
                    that.data.payType = type;
                }
                $this.addClass("sel").siblings(".radio").removeClass("sel");
            }
        },
        changeCompanyPay: function ($this, e) {
            debugger
            var that = this;
            var payType = $this.data("value") - 100
            if (payType > 0 && that.data.payablePrice >= 500) {
                that.submit({pay_type: payType});
            } else {
                T.msg("订单应付金额需满500元，方可使用企业网银在线支付~");
            }
        },
        changeAgentPay: function ($this, e) {
            var that = this;
            if ($this.hasClass("dis") || that.data.orderPrice <= 0) {
                T.msg(that.data.orderTypeName + "不可" + $('>b', $this).text() + "支付");
                return;
            }
            var isPaypwd = 0;
            if ($this.hasClass("sel")) {
                $this.removeClass("sel");
                if ($this.data("type") == "agent_cash") {
                    that.data.isAgentCash = false;
                } else if ($this.data("type") == "agent_rebate") {
                    that.data.isAgentRebate = false;
                }
                isPaypwd = $this.siblings("dt.tit.sel").length;
            } else {
                $this.addClass("sel");
                if ($this.data("type") == "agent_cash") {
                    that.data.isAgentCash = true;
                } else if ($this.data("type") == "agent_rebate") {
                    that.data.isAgentRebate = true;
                }
                isPaypwd = $this.siblings("dt.tit.sel").length + 1;
            }
            //显示隐藏支付密码框
            var $paypwd = $this.siblings(".hidden.last");
            if (isPaypwd) {
                $paypwd.addClass("shw").stop(true, true).animate({
                    height: $paypwd.children("div, dl").outerHeight(true)
                }, 200, function () {
                    $paypwd.height("auto");
                });
            } else {
                $paypwd.stop(true, true).animate({
                    height: 0
                }, 200, function () {
                    $paypwd.removeClass("shw");
                });
            }
        },
        sendRemittance: function ($this, e) {
            var that = this;
            var value = $.trim($("#receipt_number").val());
            if (/^\S{8,32}$/.test(value)) {
                that.submit({
                    pay_type: 5,
                    remittance_number: value
                });
            } else {
                T.msg("请填写正确的回单编号");
            }
        },
        checkPayPwd: function (val) {
            var that = this;
            if (that.data.payMode != 4) return;
            val = $.trim(val || "");
            if (val === '') {
                T.msg('请填写支付密码');
            } else if (val.length < 6) {
                T.msg('请填写不少于6位密码');
            } else if (val.length > 16) {
                T.msg('请填写不超过16位密码');
            } else if (T.RE.pwd.test(val)) {
                that.data.agentPwd = val;
                return true;
            } else {
                T.msg('密码不能包含空格');
            }
        },
        getParams: function (params) {
            debugger
            var that = this;
            if (!that.notPay()) {
                params = params || {};
                params.payment_method = that.data.paymentMethod || 1
                params.order_code = that.data.orderCode;
                if (that.data.payMode != 4) {
                    var ret = ordering.getParams();
                    if (!ret) return;
                    if (ret.pay_type) {
                        params.pay_type = ret.pay_type;
                    }
                    if (ret.coupon_code) {
                        params.coupon_code = ret.coupon_code;
                    }
                    if (ret.amoeba_password) {
                        params.amoeba_password = ret.amoeba_password;
                    }
                    if (ret.password) {
                        params.password = ret.password;
                    }
                    if (ret.operator_code) {
                        params.bd_code = ret.operator_code;
                    }
                }
                if (!params.pay_type) {
                    if (that.data.payMode == 2) {
                        params.pay_type = that.data.payType || '0';
                    } /*else if (that.data.payMode == 3) {
                        if (that.data.isEnterpriseRemittance) {
                            params.pay_type = 5;
                        } else {
                            params.pay_type = 14;
                        }
                    }*/ else if (that.data.payMode == 4) {
                        params.pay_type = 17;
                        if (that.data.isAgentCash || that.data.isAgentRebate) {
                            if (that.data.isAgentCash) {
                                params.use_agent_cash = 1;
                            }
                            if (that.data.isAgentRebate) {
                                params.use_agent_rebate = 1;
                            }
                        } else {
                            T.msg("请选择支付方式");
                            return;
                        }
                        if (that.checkPayPwd($("#agent_pay_password").val())) {
                            params.agent_pwd = that.data.agentPwd;
                        } else {
                            return;
                        }
                    } else {
                        T.msg("请选择支付方式");
                        return;
                    }
                }
                if (params.pay_type == 24) {
                    params.service_charge_pay_type = that.data.serviceChargePayType || '0';
                }
                return params;
            }
        },
        submit: function (params) {
            var that = this;
            if ($(".doing", that.$cont).length || $(".submit", that.$cont).hasClass("dis")) return;
            params = that.getParams(params);
            if (params) {
                $(".submit", that.$cont).addClass("dis");
                that.timeObj = setTimeout(function () {
                    $(".submit", that.$cont).removeClass("dis");
                }, 30000);
                T.POST({
                    action: "in_payment/order_pay",
                    params: params,
                    success: function (data, params) {
                        /*支付时resultType取值
                         0=未选择支付方式，创建订单成功
                         1=选择支付方式，部分支付成功
                         2=选择支付方式，完全支付成功
                         3=优惠券失败
                         4=支付密码错误
                         5=月结月不足or不可用
                         6=赠送设计服务，支付成功*/
                        if (data.resultType == 1 && params.pay_type != 11 && data.form) { //需要调用第三方支付平台支付,执行form
                            $("form[name='pay_form']").remove();
                            //data.form = '<form id=&quot;pay_form&quot; name=&quot;pay_form&quot; action=&quot;https://mapi.alipay.com/gateway.do?_input_charset=utf-8&quot; method=&quot;post&quot;><input type=&quot;hidden&quot; name=&quot;seller_user_id&quot; value=&quot;2088111771660435&quot;/><input type=&quot;hidden&quot; name=&quot;batch_no&quot; value=&quot;20160612164321&quot;/><input type=&quot;hidden&quot; name=&quot;partner&quot; value=&quot;2088111771660435&quot;/><input type=&quot;hidden&quot; name=&quot;service&quot; value=&quot;refund_fastpay_by_platform_pwd&quot;/><input type=&quot;hidden&quot; name=&quot;_input_charset&quot; value=&quot;utf-8&quot;/><input type=&quot;hidden&quot; name=&quot;sign&quot; value=&quot;cd952416f89f8935e31f564263a4eecc&quot;/><input type=&quot;hidden&quot; name=&quot;notify_url&quot; value=&quot;http://alpha.action.ininin.com/in_payment/pay_notify&quot;/><input type=&quot;hidden&quot; name=&quot;batch_num&quot; value=&quot;1&quot;/><input type=&quot;hidden&quot; name=&quot;sign_type&quot; value=&quot;MD5&quot;/><input type=&quot;hidden&quot; name=&quot;refund_date&quot; value=&quot;2016-06-12 16:43:30&quot;/><input type=&quot;hidden&quot; name=&quot;detail_data&quot; value=&quot;2016061221001004980253775442^0.01^协商退款&quot;/><input type=&quot;submit&quot; value=&quot;确认&quot; style=&quot;display:none;&quot;></form>';
                            data.form = data.form.replace(/&quot;/g, '\"').replace(/&lt;/g, '<');
                            var payDiv = document.createElement('div');
                            document.body.appendChild(payDiv);
                            payDiv.innerHTML = data.form;
                            //$("input[type='submit']",payDiv).remove();
                            T.loading();
                            setTimeout(function () {
                                document.forms["pay_form"].submit();
                                setTimeout(function () {
                                    payDiv.parentNode.removeChild(payDiv);
                                }, 10);
                            }, 10);
                        } else if ((params.pay_type == 11 || params.service_charge_pay_type == 11) && data.codeUrl) { //微信支付，将codeUrl参数生成为二维码
                            that.requests = {
                                order_code: that.data.orderCode,
                                order_status: "1,3"
                            };
                            that.wxpopup = T.Popup({
                                fixed: true,
                                id: that.uuid + 'wxpopup',
                                zIndex: 1800,
                                title: '微信支付：<span class="red"> ' + T.RMB(data.thirdPayAmount || 0) + '</span> 元',
                                width: 500,
                                content: '<div class="wxpaycode"><div id="' + that.uuid + 'wxqrcode" class="wxcode"></div><p class="red">请使用微信扫一扫，扫描二维码支付</p></div>',
                                callback: function () {
                                    //生成为二维码
                                    $("#" + that.uuid + "wxqrcode").qrcode({
                                        width: 300,
                                        height: 300,
                                        background: "#fff",
                                        foreground: "#000",
                                        render: T.IS.CVS ? 'canvas' : 'table',
                                        text: data.codeUrl || ''
                                    });
                                    //轮询订单支付状态
                                    if (that.timeobj) {
                                        clearInterval(that.timeobj);
                                        that.timeobj = null;
                                    }
                                    that.timeobj = setInterval(function () {
                                        that.timeStatus();
                                    }, that.interval);
                                }
                            });
                            that.wxpopup.on("no", function () {
                                $(".submit", that.$cont).removeClass("dis");
                                that.popup = null;
                                if (that.timeobj) {
                                    clearInterval(that.timeobj);
                                    that.timeobj = null;
                                }
                                if (params.pay_type == 24 || params.pay_type == 25) {
                                    window.location.reload()
                                }
                            });
                        } else if (data.resultType == 2 || (data.orderCode || params.pay_type == 5)) { //支付成功
                            that.payDone(that.data.orderCode, params.remittance_number);
                        } else {
                            T.msg(data.msg || T.TIPS.DEF);
                        }
                        if (that.timeObj) {
                            clearTimeout(that.timeObj);
                        }
                    },
                    failure: function (data, params) {
                        $(".submit", that.$cont).removeClass("dis");
                        if (data.result == 1 && data.resultType == 6) { //折扣订单不支持账户充值支付
                            T.msg(data.msg || '折扣订单不支持充值账户支付，请刷新页面后继续支付！');
                            setTimeout(function () {
                                location.reload();
                            }, 1000);
                        } else {
                            T.msg(data.msg || T.TIPS.DEF);
                        }
                    }
                });
            }
        },
        /**
         * 支付完成
         * @param orderCode
         * @param remittanceNumber
         */
        payDone: function (orderCode, remittanceNumber) {
            var that = this;
            if (that.wxpopup) {
                that.wxpopup.remove();
                that.wxpopup = null;
            }
            if (that.timeobj) {
                clearInterval(that.timeobj);
                that.timeobj = null;
            }
            /*if (that.data.orderType == 10 && !remittanceNumber) {
                T.suc({
                    text: "订单支付成功。",
                    title: '订单支付成功',
                    ok: '继续购物',
                    no: that.data.orderType == 10 ? '提交设计需求' : '查看订单详情'
                }, ordering.goShop, function() {
                    ordering.goDatum(that.data);
                }, ordering.goShop);
            } else */
            if (remittanceNumber) {
                T.alt('操作成功，我们将尽快确认您的款项到账情况。', function () {
                    ordering.goDetail(that.data, 1);
                }, function () {
                    ordering.goDetail(that.data, 1);
                });
            } else {
                ordering.goDetail(that.data, 1);
            }
        },
        /**
         * 轮询订单支付状态
         */
        timeStatus: function () {
            var that = this;
            T.GET({
                action: CFG_DS.myorder.get,
                params: that.requests,
                success: function (data) {
                    if (data.result == 0 && data.orderList && data.orderList.length == 1) {
                        that.payDone();
                    }
                },
                failure: function (data, params) {
                },
                error: function (data, params) {
                }
            }, function (data) {
            }, function (data) {
            });
        },
        /**
         * 订单金额为0，不可支付
         * @returns {boolean}
         */
        notPay: function () {
            var that = this;
            if (that.data.orderPrice <= 0) {
                T.alt('该订单不能支付，请联系QQ客服改价后再支付！');
                return true;
            }
        },
        backOrder: function () {
            location.replace(T.DOMAIN.ORDER + "index.html" + (T.INININ ? "?" + T.INININ : ""));
        }
    });
    T.Loader(function () {
        new Payment();
    });
    //require(["jquery/qrcode"]);
});