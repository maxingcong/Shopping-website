!(function(window, document, undefined) {
    "use strict";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var invoice = {
        accountInfo: null, //现金账户信息
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            _this.initUI();
            _this.getAccountInfo();
            _this.bindEvents();
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            $('#invoice_sent_btn').on('click',function(){ //确认按钮
                //if($(this).hasClass('dis') || !_this.accountInfo.issueInvoice || _this.accountInfo.invoiceAmount == 0){
                if(!$(this).hasClass('dis') && _this.accountInfo.invoiceAmount > 0){
                    _this.sendInvoice();
                }
            });
            $('#invoiceAmount').on("blur", function() {
                var val = _this.parseValue($(this).val(), _this.accountInfo.invoiceAmount);
                $(this).val(val<0?'':val);
            });
            $('#deliverySelect').on('change', function(){
                if($(this).val() == '其他'){
                    $('#deliveryInput').removeClass('hide');
                }else{
                    $('#deliveryInput').addClass('hide');
                }
            });
        },
        /**
         * 初始化UI
         */
        initUI: function(){
            var dom = document.getElementById('deliverySelect');
            //下拉框初始化
            T.SetSelectOptions(dom,{
                data: CFG.LOGISTICS,
                key: 'name',
                val: 'name'
            });
        },
        /**
         * 渲染
         */
        render: function(){
            var _this = this;
            /*if(!_this.accountInfo.issueInvoice){ //账户不可开发票
                $('#invoice_sent_btn').addClass('dis');
                $('#invoice_msg').removeClass('hide');
            }else */if(_this.accountInfo.invoiceAmount == 0){ //账户可开发票额度为0
                $('#invoice_sent_btn').addClass('dis');
            }else{
                $('#invoice_sent_btn').removeClass('dis');
            }
            $('#invoiceAmountWp').text(_this.accountInfo.invoiceAmount?T.RMB(_this.accountInfo.invoiceAmount): T.RMB(0));//待开发票额度
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
         * 发票寄送
         */
        sendInvoice: function(){
            var _this = this,
                invoiceAmountVal = $('#invoiceAmount').val(), //本次寄送额度
                deliverySelectVal = $('#deliverySelect').val(), //物流公司下拉框
                deliveryInputVal = $.trim($('#deliveryInput').val()), //其他物流公司名称
                sendInfoVal = $.trim($("#sendInfo").val()); //快递单号
            if(!invoiceAmountVal || invoiceAmountVal <= 0){
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
                $("#sendInfo").focus();
                return;
            }
            var params = {};
            params.invoiceAmount = invoiceAmountVal;
            params.logisticsName = deliverySelectVal == '其他'?deliveryInputVal: deliverySelectVal;
            params.logisticsCode = sendInfoVal;
            T.loading();
            T.POST({
                action: CFG.API.invoice,
                params: params,
                success: function(res){
                    T.loading('true');
                    console.log(res);
                    T.msg('操作成功！');
                    _this.getAccountInfo();
                }
            });
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
                    _this.render();
                }
            });
        }
    };
    invoice.init();
}(window, document));
