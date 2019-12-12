!(function(window, document, undefined) {
    "use strict";
    var changePw = {
        domNode: $('#bs-container'),

        uniqueFlag: false, //用户唯一性标识
        usernameChecking: false, //校验用户名接口调用状态

        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            _this.captchaToPhone = T.CaptchaToPhone({
                trigger : "#sendCode",
                account : "#account_mobile",
                source : "10"
            });
            $('#sendCode').addClass('dis');
            _this.bindEvents();
        },

        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            $('#sendCode').on('click', function(){ //发送验证码
                if($(this).hasClass('dis')){
                    if(!T.RE.mobile.test($.trim($('#account_mobile').val())))return;
                    if(_this.usernameChecking){
                        T.msg('正在检查用户名！');
                        return;
                    }
                    if(_this.uniqueFlag){
                        T.msg('账号不存在，请确认后重新输入!');
                        return;
                    }
                }
            });
            $('#account_mobile').on('keyup', function(){
                if(T.RE.mobile.test($.trim($(this).val()))&&!_this.captchaToPhone.timer){
                    $('#sendCode').removeClass('dis');
                }else{
                    $('#sendCode').addClass('dis');
                }
            });
            $('#nextStep').on('click', function(){ //下一步
                _this.checkStep1();
            });
            $('#confirmApply').on('click', function(){ //确认提交
                if(_this.checkStep2()){
                    _this.updatePassword();
                }
            });
            $('#goIndex').on('click', function(){
                window.location = T.DOMAIN.WWW;
            });
            $('#account_mobile').on('blur', function(){
                _this.checkUsername($.trim($(this).val())); //检查用户名
            });
        },

        /**
         * 检查验证码
         */
        checkCode: function(){
            var _this = this;
            if(!T.RE.code.test($.trim($('#auth_code').val()))){
                return;
            }
            T.POST(
                {
                    action: CFG.API.checkcode,
                    params: {
                        username: $.trim($('#account_mobile').val()),
                        code: $.trim($('#auth_code').val())
                    },
                    success: function(res){
                        console.log(res);
                        _this.goStep('2');
                    },
                    failure: function(res){
                        T.msg('验证码不正确');
                    }
                }
            );
        },

        /**
         * 检查用户名唯一性
         */
        checkUsername: function(username){
            var _this = this;
            if(!T.RE.mobile.test(username)){
                return;
            }
            _this.usernameChecking = true;
            T.GET(
                {
                    action: CFG.API.check_username,
                    params: {
                        username: username
                    },
                    success: function(res){
                        console.log(res);
                        _this.usernameChecking = false;
                        _this.uniqueFlag = true;
                        $('#sendCode').addClass('dis');
                        T.msg('账号不存在，请确认后重新输入!');
                    },
                    error: function(res){
                        console.log(res);
                        _this.usernameChecking = false;
                        _this.uniqueFlag = false;
                    }
                }
            );
        },

        /**
         * 跳转至相应的页面
         * @param {String} step 步骤
         */
        goStep: function(step){
            var _this = this;
            var contentN = '.content' + step;
            _this.domNode.find(contentN).addClass('active').siblings().removeClass('active');
            _this.domNode.find('.panel-heading li').removeClass('current');
            _this.domNode.find('.panel-heading li')[step-1].className = 'current';
        },

        checkStep1: function(){
            var _this = this;
            var account_mobile = $.trim($('#account_mobile').val());
            var auth_code = $.trim($('#auth_code').val());
            if(!T.RE.mobile.test(account_mobile)){
                T.msg('请输入正确格式的手机号码！');
                return;
            }
            if(_this.usernameChecking){
                T.msg('正在检查用户名！');
                return;
            }
            if(_this.uniqueFlag){
                T.msg('账号不存在，请确认后重新输入!');
                return;
            }
            if(!T.RE.code.test(auth_code)){
                T.msg('请输入6位数字验证码！');
                return;
            }
            _this.checkCode();
        },
        checkStep2: function(){
            var _this = this,
                password = $.trim($('#password').val()),
                repassword = $.trim($('#repassword').val());
            if(!T.RE.pwd.test(password)){
                T.msg('请输入6~16位密码！');
                return false;
            }
            if(password != repassword){
                T.msg('两次输入的密码不一致！');
                return false;
            }
            return true;
        },
        /**
         * 修改密码
         */
        updatePassword: function(){
            var _this = this;
            T.loading();
            T.POST({
                action: CFG.API.update_password_by_code,
                params: {
                    username: $.trim($('#account_mobile').val()),
                    password: $.trim($('#password').val()),
                    code: $.trim($('#auth_code').val())
                },
                success: function(res){
                    console.log(res);
                    T.loading('true');
                    T.msg('密码设置成功！');
                    _this.goStep('3')
                },
                error: function(res){
                    console.log(res);
                }
            });
        }
    };
    changePw.init();
}(window, document));




