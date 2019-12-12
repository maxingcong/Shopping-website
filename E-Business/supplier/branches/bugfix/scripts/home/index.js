!(function(window, document, undefined) {
    "use strict";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var home = {
        accountInfo: null,//现金账户信息
        data: {
            waitAmount: T.RMB(0), //待入账金额
            totalAmount: T.RMB(0), //现金账户
            noShipCount: 0, //应发货订单
            noProduceCount: 0, //待生产订单
            shipExpired: 0, //发货逾期订单
            monthMoneyCount: T.RMB(0), //本月接单总金额
            monthOrderCount: 0 //本月订单数
        },
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            _this.getAccountInfo(); //现金账户信息
            _this.getIndex(); //订单信息
            _this.getManagerInfo();
            _this.bindEvents();
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            $('#cash_btn').on('click', function(){ //申请提现按钮
                if(!_this.accountInfo.cashAmount){
                    T.alt('可提现金额为0！');
                }else if(!_this.accountInfo.withdraw){
                    T.alt('当前您有未处理的提现申请，请等待该提现申请处理完毕后再次进行申请。');
                }else {
                    var info = _this.accountInfo;
                    info.RMB = T.RMB;
                    T.Template('apply_for_cash', info);
                    var dom = document.getElementById('deliverySelect');
                    T.SetSelectOptions(dom,{ //物流公司填充
                        data: CFG.LOGISTICS,
                        key: 'name',
                        val: 'name'
                    });
                    //$('#discountAmount').text(T.RMB(0)); //实际结算金额
                    $('#applyForCash').modal('show');
                    setTimeout(function(){
                        $('#cashAmount').focus();
                    }, 500);

                }
            });
            $('#applyForCash').on('click','.save',function(){ //申请提现对话框
                var cashAmountVal = $('#cashAmount').val(), //申请提现金额
                    invoiceAmountVal = $('#invoiceAmount').val(), //本次开发票额度
                    deliverySelectVal = $('#deliverySelect').val(), //物流公司下拉框
                    deliveryInputVal = $.trim($('#deliveryInput').val()), //其他物流公司名称
                    sendInfoVal = $.trim($('#sendInfo').val()), //快递单号
                    params = {};
                if(!cashAmountVal || cashAmountVal<=0){
                    T.msg('提现金额必须大于0！');
                    $('#cashAmount').focus();
                    return;
                }
                //可选开发票，满足条件再对寄送发票的信息做校验
                if(_this.accountInfo.invoiceAmount>0 && (invoiceAmountVal || deliveryInputVal || sendInfoVal)){
                    if(!invoiceAmountVal || invoiceAmountVal<=0){
                        T.msg('本次寄送发票额度必须大于0！');
                        $('#invoiceAmount').focus();
                        return;
                    }
                    if(deliverySelectVal == '其他' && !deliveryInputVal){
                        T.msg('请填写物流公司！');
                        $('#deliveryInput').focus();
                        return;
                    }
                    if(!sendInfoVal){
                        T.msg('请填写快递单号！');
                        $('#sendInfo').focus();
                        return;
                    }
                    params.logisticsName = deliverySelectVal == '其他'?deliveryInputVal: deliverySelectVal;
                    params.logisticsCode = sendInfoVal;
                    params.invoiceAmount = invoiceAmountVal;
                }
                params.requestAmount = cashAmountVal;
                T.POST({
                    action:CFG.API.account.account_apply,
                    params: params,
                    success: function(res){
                        console.log(res);
                        T.msg('申请成功！');
                        //更新现金账户信息
                        _this.getAccountInfo();
                        $('#applyForCash').modal('hide');
                    }
                });
            }).on('blur', '#cashAmount', function(){ //提现金额输入框
                var val = _this.parseValue($(this).val(), _this.accountInfo.cashAmount);
                $(this).val(val<0?'':val);
                //$('#discountAmount').text(T.RMB($(this).val()*(1-_this.accountInfo.taxPoint)));
            }).on('blur', '#invoiceAmount', function(){ //本次开发票输入框
                var val = _this.parseValue($(this).val(), _this.accountInfo.invoiceAmount);
                $(this).val(val<0?'':val);
            }).on('change', '#deliverySelect', function(){ //物流公司选择下拉框
                if($(this).val() == '其他'){ //选择其他项，显示物流公司输入框
                    $('#deliveryInput').removeClass('hide');
                }else{
                    $('#deliveryInput').addClass('hide');
                }
            });
            $('.toolbar').on('mouseover', 'a', function(){
                $(this).prev('.contact-mobile').stop(true).animate({
                    width: '135px'
                },300);
            }).on('mouseout', 'a', function(){
                $(this).prev('.contact-mobile').stop(true).animate({
                    width: 0
                },300);
            });
        },
        /**
         * 解析输入框的值
         */
        parseValue: function(val, maxVal){
            var ret = NaN;
            ret = parseFloat(val);
            if(isNaN(ret)||ret<=0){
                ret = -1;
            }else if(ret>maxVal){
                ret = maxVal.toFixed(2);
            }else{
                ret = ret.toFixed(2);
            }
            return ret;
        },
        /**
         * 渲染页面
         */
        render: function(){
            var _this = this;
            if(_this.accountInfo.withdraw){ //可提现
                $('#cash_btn').removeClass('dis');
            }else{ //不可提现
                $('#cash_btn').addClass('dis');
            }
            T.BindData("data", _this.data);
        },
        /**
         * 获取现金账户信息
         */
        getAccountInfo: function(){
            var _this = this;
            T.GET({
                action: CFG.API.account.account_info,
                success: function(res){
                    console.log(res);
                    _this.accountInfo = res;
                    _this.data.totalAmount = T.RMB(res.totalAmount);
                    _this.data.waitAmount = T.RMB(res.waitAmount);
                    _this.render();
                }
            });
        },
        /**
         * 生产拓展经理信息
         */
        getManagerInfo: function(){
            T.GET({
                action: CFG.API.manager_info,
                success: function(res){
                    /*{
                        cellPhone: "15394231306"
                        email: "szchugan@ininin.com"
                        manager: "储干"
                        msg: ""
                        name: "储干"
                    }*/
                    $('#business_mobile').html(res.cellPhone||'暂无');
                }
            });
        },
        /**
         * 获取订单信息
         */
        getIndex: function(){
            var _this = this;
            T.GET({
                action: CFG.API.order.index,
                success: function(res){
                    console.log(res);
                    _this.data.noShipCount = res.noShipCount;
                    _this.data.noProduceCount = res.noProduceCount;
                    _this.data.shipExpired = res.shipExpired;
                    _this.data.monthMoneyCount = T.RMB(res.monthMoneyCount);
                    _this.data.monthOrderCount = res.monthOrderCount;
                    T.BindData("data", _this.data);
                }
            });
        }
    };
    home.init();
}(window, document));