!(function(window, document, undefined) {
    "use strict";
    if(T.hasLogin() && T.Cookie.get('_a_status') == 'Pass'){
        window.location = T.DOMAIN.WWW + 'platform.html';
    }
    if(T.hasLogin() && T.Cookie.get('_a_status') == 'NotPass'){
        window.location = T.DOMAIN.WWW + 'recruit.html';
    }
    var pwdErrorCount = 0, //密码错误次数
        captcha,
        hasVerifyCode = false,
        verifyCodeValue, //校验码
        verifyCallback; ///验证成功回调
    var index = {
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            _this.$cont = $('.sys-login');
            _this.bindEvents();
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            $('#login_btn').on('click',function(e){ //登录
                var $loginMobile = $('#login_mobile'),
                    $loginPassword = $('#login_password'),
                    $loginNotice = $('#login_notice'),
                    loginMobileVal = $.trim($loginMobile.val()),
                    loginPasswordVal = $.trim($loginPassword.val());
                if(!T.RE.mobile.test(loginMobileVal)){
                    $loginNotice.html('账号输入错误');
                    $loginMobile.focus();
                    return;
                }
                if(!T.RE.pwd.test(loginPasswordVal)){
                    $loginNotice.html('请输入6~16位密码');
                    $loginPassword.focus();
                    return;
                }
                $loginNotice.html('');
                var params = {},
                    action = '';
                params = {
                    username: loginMobileVal,
                    password: loginPasswordVal
                };
                if((hasVerifyCode && verifyCodeValue) || !hasVerifyCode){
                    action = CFG.API.login;
                    if(hasVerifyCode && verifyCodeValue)params.checkcode = verifyCodeValue;
                    _this.doLogin(action, params);
                }else{
                    if(captcha && captcha.verify){
                        action = '';
                        verifyCallback = function(verifyCode){ //验证成功缓存校验码，并重新提交
                            action = CFG.API.login;
                            verifyCallback = null;
                            params.checkcode = verifyCode;
                            _this.doLogin(action, params);
                        };
                        captcha.verify();
                    }
                }
            });
            _this.$cont.on('keypress', 'input', function(e){
                if(e.keyCode == 13){
                    $('#login_btn').trigger('click');
                }
            });
        },
        /**
         * 登录
         */
        doLogin: function(action, params){
            var _this = this;
            T.loading();
            //登录接口
            T.POST({
                action: action,
                params: params,
                success: function(res){
                    var status = res.supplierStatus||"";
                    T.loading('true');
                    if(!status){
                        T.alt('没有审核状态！');
                        return;
                    }
                    T.Cookie.set('sid', res.sid||"", { expires: 3, path: '/', domain: T.DOMAIN.DOMAIN});
                    T.Cookie.set('_user_type', 3, { expires: 3, path: '/', domain: T.DOMAIN.DOMAIN});
                    T.Cookie.set('_a_account', res.userName||"", { expires: 3, path: '/'});
                    T.Cookie.set('_a_name', res.companyName||"", { expires: 3, path: '/'});
                    T.Cookie.set('_a_status', status, { expires: 3, path: '/'});
                    if(status == 'Pass'){//审核通过
                        var redirect_uri = T.GetRequest().redirect_uri;
                        if(redirect_uri){
                            window.location = decodeURIComponent(redirect_uri);
                        }else{
                            window.location = T.DOMAIN.WWW + 'platform.html';
                        }
                    }else if(status == 'NotPass'){
                        //审核不通过
                        window.location = T.DOMAIN.WWW + 'recruit.html';
                    }else{
                        //审核中
                        T.alt('审核中');
                    }
                },
                error: function(data){
                    T.loading('true');
                    pwdErrorCount = data.errorCount||0;
                    if(pwdErrorCount>=2){
                        hasVerifyCode = true;
                        captcha = T.Captcha({
                            cont : "#captcha"
                        }, {
                            refresh: function(token){ //刷新时清空校验码
                                verifyCodeValue = "";
                            },
                            success: function(verifyCode){ //验证成功缓存校验码
                                verifyCodeValue = verifyCode;
                                verifyCallback && verifyCallback(verifyCode);
                            }
                        });
                        $("#captcha").removeClass("hide");
                        if(pwdErrorCount>=5){
                            T.alt('该账户输入错误密码次数过多，已被冻结3小时，您可自助<a class="forget" href="'+T.DOMAIN.WWW+'forget/index.html">找回密码</a>。如有疑问，请拨打云印客服电话：400-680-9111', function(_o){
                                _o.remove();
                            }, function(_o){
                                _o.remove();
                            });
                        }else if(data.codeResult==-1){
                            $('#login_notice').html(data.msg||'输入验证码有误，请重新输入');
                        }else{
                            $('#login_notice').html(data.msg||'用户名不存在或密码不正确');
                        }
                    }else{
                        $("#captcha").addClass("hide");
                        $('#login_notice').html(data.msg||'用户名不存在或密码不正确');
                    }
                },
                failure: function(data){
                    T.loading('true');
                    T.alt(data.msg || T.TIPS.DEF, function (_this) {
                        _this.remove();
                    }, function (_this) {
                        _this.remove();
                    });
                }
            });
        }
    };
    index.init();
}(window, document));
