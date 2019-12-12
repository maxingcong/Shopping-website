!(function(window, document, undefined) {
    "use strict";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var financial_info = {
        data: {
            issueInvoice: '', //能否开具发票
            bankAccount: '', //银行账号
            accountName: '', //开户名
            bankName: '' //开户行
        },
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            _this.render();
            _this.getInfo();
            _this.captchaToPhone = T.CaptchaToPhone({
                trigger : "#sendCode",
                username : T.Cookie.get('_a_account'),
                source : "10"
            });
            _this.bindEvents();
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            $('#checkPhone').on('click', '.modal-footer button', function(){ //下一步
                var authCode = $.trim($('#fAuthCode').val());
                if(!T.RE.code.test(authCode)){
                    T.msg('请输入6位数字验证码!');
                    return;
                }
                _this.checkCode();
            });
        },
        /**
         * 渲染
         * @param {Object} data 数据
         */
        render: function(data){
            T.Template('financial_info', data?data: {});
            $('#user_mb').text(T.Cookie.get('_a_account'));
        },
        /**
         * 检查验证码
         */
        checkCode: function(){
            var _this = this;
            T.loading();
            T.POST(
                {
                    action: CFG.API.checkcode,
                    params: {
                        username: T.Cookie.get('_a_account'),
                        code: $.trim($('#fAuthCode').val())
                    },
                    success: function(res){
                        console.log(res);
                        T.loading('true');
                        $('#checkPhone').modal('hide');
                        _this.captchaToPhone.reset();
                        _this.toNextStep();
                    },
                    failure: function(res){
                        T.loading('true');
                        T.msg(res.msg);
                    }
                }
            );
        },

        /**
         * 下一步
         */
        toNextStep: function(){
            var _this = this;
            var $view = T.Template('financial_list', 'modal_content', _this.data);
            $view.on('click', '.save', function(){
                _this.updateInfo();
            });
            $('#fAuthCode').val('');
            $('#myModal').modal('show');
        },
        /**
         * 获取供应商信息
         */
        getInfo: function(){
            var _this = this;
            T.GET({
                action: CFG.API.supplier.supplier_detail,
                params: null,
                success: function(res){
                    var supplier = res.supplier || {};
                    _this.render(supplier);
                    _this.data.issueInvoice = supplier.issueInvoice || '';
                    _this.data.bankAccount = supplier.bankAccount || '';
                    _this.data.accountName = supplier.accountName || '';
                    _this.data.bankName = supplier.bankName || '';
                    console.log(res);
                }
            });
        },
        /**
         * 修改供应商信息
         */
        updateInfo: function(){
            var _this = this,
                bankAccount = $.trim($('#fBankAccount').val()),
                accountName = $.trim($("#fAccountName").val()),
                bankName = $.trim($('#fBankName').val()),
                //issueInvoice = $('input[name=invoice]:checked').val(),
                params = {};
            //银行卡号：9-19位不等的数字
            /*if(!/^\d{9,19}$/.test(bankAccount)){
                T.msg('请输入正确的银行账号!');
                return;
            }*/
            if(!bankAccount){
                T.msg('请输入银行账号!');
                return false;
            }
            if(!accountName){
                T.msg('请输入开户名！');
                return;
            }
            if(!bankName){
                T.msg('请输入开户行！');
                return;
            }
            /*if(!issueInvoice){
                T.msg('请选择发票信息！');
                return;
            }*/
            if(bankAccount == _this.data.bankAccount && accountName == _this.data.accountName && bankName == _this.data.bankName /*&& issueInvoice == _this.data.issueInvoice*/){
                T.msg('未修改任何信息！');
                return;
            }
            if(bankAccount != _this.data.bankAccount){
                params.bankAccount = bankAccount;
            }
            if(accountName != _this.data.accountName){
                params.accountName = accountName;
            }
            if(bankName != _this.data.bankName){
                params.bankName = bankName;
            }
            /*if(issueInvoice != _this.data.issueInvoice){
                params.issueInvoice = issueInvoice;
            }*/
            T.loading();
            T.POST({
                action: CFG.API.supplier.update_supplier,
                params: params,
                success: function(res){
                    console.log(res);
                    T.loading('true');
                    T.msg('修改成功！');
                    $('#myModal').modal('hide');
                    _this.getInfo();
                }
            });
        }
    };
    financial_info.init();
}(window, document));