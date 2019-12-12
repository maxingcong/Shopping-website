require(["base", "tools"], function ($, T) {
    var requests = T.getRequest(location.hash);
    function redirectUri(){
        var backurl = requests.backurl;
        var href = location.href.replace(/[#?].*$/, "");
        if(String(requests.backurl||'').indexOf(T.DOMAIN.PASSPORT + 'index.html')==0 || !requests.backurl || href==T.DOMAIN.PASSPORT){
            backurl = T.DOMAIN.MEMBER+'index.html';
        }
        var sid = T.cookie("sid");
        if(sid!=null && sid!=""){
            location.replace(requests.backurl || backurl);
        }
    }
    if(T._LOGED)redirectUri();
    var register = {
        init: function(){
            var _this = this;
            T.CaptchaToPhone({
                trigger : "#sendCode",
                account : "#account",
                source : "0"
            });
            //T.SendCode('#sendCode','#account',0);
            if(T._STORE){
                $("#account").val(T._USERNAME||"");
                $("input[name='inviter']").val(T._SNICKNAME||'');

                CFG_FORM.register.items.username = CFG_COM.username_store;
                CFG_FORM.register.items.password.required = false;
                delete CFG_FORM.register.items.code;
                $("#register_user .form_code").remove();
            }
            debugger
            CFG_FORM['register'].items.username.tips['unique'] = function(item){
                $('#sendCode').addClass('dis');
                if(T.RE.mobile.test(item.value)){
                    return '该手机号已被注册';
                }else if(T.RE.email.test(item.value)){
                    return '该邮箱已被注册';
                }else{
                    return '该账号已被注册';
                }
            };
            T.FORM('register_user', CFG_FORM.register, {
                before: function(){
                    var _form = this;
                    var params = {
                        user_type: '0',
                        username: _form.params.username,
                        password: _form.params.password||'123456'
                    };
                    if(T._STORE){
                        params.source = '1';//T._SNICKNAME;
                        if(T._SNICKNAME&&!params.inviter){
                            params.inviter = T._SNICKNAME;
                        }
                    }
                    if(_form.params.code)params.code = _form.params.code;
                    if(_form.params.inviter)params.inviter = _form.params.inviter;
                    _form.params = params;
                    _form.params.inviter = $.trim(_form.params.inviter);
                }
                ,success: function (data, param) {
                    if(T.RE.email.test(param.username)){
                        var txts = ["恭喜您，注册成功，请立即激活账户"];
                        txts.push("亲爱的会员，您已经通过邮箱 "+param.username+" 注册成为云印会员了。");
                        txts.push("我们已经把激活邮件发送到了 "+param.username+" 邮箱，快去激活吧！");
                        txts.push("<span class='red'>小贴士：如果您没有收到激活邮件，可能邮件被误放入垃圾邮件中了</span>");
                        T.alt(txts.join("<br/>"));
                    }else{
                        T.SetCookie(data, param);
                        T.msg("恭喜您，注册成功");
                        setTimeout(function(){
                            redirectUri();
                        }, 800);
                    }
                }
            });
            this.bindEvents();
        },
        bindEvents: function(){
            $('.agreement_link').on('click', function(e){
                T.DOM.preventDefault(e);
                T.DOM.stopPropagation(e);
                var $this = $(this);
                var href = $this.attr('href');
                var popup = new T.Popup({
                    title: $this.text().replace(/《|》/g,'')||'云印服务协议',
                    type: 'iframe',
                    content: href,
                    ok: '我已阅读并接受',
                    no: ''
                });
                popup.on("ok", function(){
                    $("input[name='agreement']").not(":checked").click();
                });
            });
            $('#account').on('keyup', function(){
                $('#sendCode').removeClass('dis');
            });
        }
    };

    var pwdErrorCount = 0; //密码错误次数
    var login = {
        init: function(){
            var _this = this;
            var loginForm = T.DOM.byId('user_login');
            if(loginForm)$("input[name='username']",loginForm).val(T._ACCOUNT);
            var captcha,
                hasVerifyCode = false,
                verifyCodeValue, //校验码
                verifyCallback; //验证成功回调
            T.CaptchaToPhone({
                trigger : "#userSendCodeLogin",
                account : "#userAccountLogin",
                source : 2
            });
            if(loginForm){
                //用户登录
                _this.LOGINFORM = T.FORM('user_login_form', CFG_FORM['login'], {
                    before: function(){
                        var _form = this;
                        _form.action = "in_user/login";
                        if((hasVerifyCode && verifyCodeValue) || !hasVerifyCode || _form.params.code){
                            _form.issid = true;
                            _form.issource = true;
                            var params = {
                                username: _form.params.username,
                                remember: _form.params.remember||"0"
                            };
                            if(hasVerifyCode && verifyCodeValue)params.checkcode = verifyCodeValue;
                            if(_form.params.code)params.code = _form.params.code;
                            if(_form.params.password)params.password = _form.params.password;
                            _form.params = params;
                            if(T._STORENAME.indexOf('_'+params.username+'_')>=0){
                                params.source = '1';
                                params.remember = '1';
                            }
                        }else{
                            if(captcha && captcha.verify){
                                _form.action = "";
                                verifyCallback = function(verifyCode){ //验证成功缓存校验码，并重新提交
                                    verifyCallback = null;
                                    _form.submit();
                                };
                                captcha.verify();
                            }
                        }
                    }
                    ,success: function (data, param) {
                            var curr_url = T.DOMAIN.PASSPORT+'index.html';
                            if(T._STORENAME.indexOf('_'+param.username+'_')>=0){
                                data.type = 2;
                            }else if(T._TYPE==2){
                                param._action = "check_user";
                            }
                            T.SetCookie(data, param);
                            redirectUri();
                    }
                    ,failure: function(data, params){
                        pwdErrorCount = data.errorCount;
                        if(data.result==3 && T.RE.email.test(params.username)) {
                            var txts = ["亲爱的会员，您的账户未激活，请立即激活账户"];
                            txts.push("我们已经把激活邮件发送到了 " + params.username + " 邮箱，快去激活吧！");
                            txts.push("<span class='red'>小贴士：如果您没有收到激活邮件，可能邮件被误放入垃圾邮件中了</span>");
                            T.alt(txts.join("<br/>"));
                        }else if(pwdErrorCount>=2){
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
                               T.alt('该账户输入错误密码次数过多，已被冻结3小时，您可自助<a class="forget" href="/passport/forget.html">找回密码</a>。如有疑问，请拨打云印客服电话：400-680-9111', function(_o){
                                    _o.remove();
                               }, function(_o){
                                    _o.remove();
                               });
                            }else if(data.codeResult==1 || (params && params.code)){
                                T.msg(data.msg||'输入验证码有误，请重新输入');
                            }else{
                                T.msg(data.msg||'用户名不存在或密码不正确');
                            }
                        }else{
                            $("#captcha").addClass("hide");
                            if(params && params.code){
                                T.msg(data.msg||'输入验证码有误，请重新输入');
                            }else{
                                T.msg(data.msg||'用户名不存在或密码不正确');
                            }
                        }
                    }
                });
                _this.showCodeLogin();
                _this.LOGINFORM.showInput('code', 'username', false);
                _this.LOGINFORM.showInput('password', 'username', true);
                _this.bindEvents();
            }
        },
        bindEvents: function(){
            var _this = this;
            $(document).bind('keyup', function(e) {
                T.KeydownEnter(e);
            });
            $("#userAccountLogin").bind("blur",_this.showCodeLogin);
            $("#userLoginChange").bind("click",function(e){//使用验证码登录 or 密码登录
                var btn = $("#userLoginChange");
                if(btn.hasClass('loginbycode')){
                    btn.html("普通方式登录<i class='icon'></i>");
                    _this.LOGINFORM.showInput('code', 'username', true);
                    _this.LOGINFORM.showInput('password', 'username', false);
                    hasVerifyCode = false;
                    $("#captcha").addClass("hide");
                }else{
                    btn.html("手机动态码登录<i class='icon'></i>");
                    _this.LOGINFORM.showInput('code', 'username', false);
                    _this.LOGINFORM.showInput('password', 'username', true);
                    if(pwdErrorCount>=2){
                        hasVerifyCode = true;
                        $("#captcha").removeClass("hide");
                    }else{
                        hasVerifyCode = false;
                        $("#captcha").addClass("hide");
                    }
                }
                btn.toggleClass('loginbycode loginbypwd');
            });
        },
        showCodeLogin: function(){
            var account = $("#userAccountLogin").val();
            if(T.RE.mobile.test(account)){
                $("#userLoginChange").show();
                $("#userLoginChange").html("手机动态码登录<i class='icon'></i>").show();
            }else{
                $("#userLoginChange").hide();
                login.LOGINFORM.showInput('code', 'username', false);
                login.LOGINFORM.showInput('password', 'username', true);
            }
        }
    };
    if(requests.type){
        document.title = '注册';
        $('#register').removeClass('hide');
    }else{
        document.title = '登录';
        $('#user_login').removeClass('hide');
    }
    login.init();
    register.init();
    $('#goLogin').on('click', function(){
        document.title = '登录';
        $('#user_login').removeClass('hide');
        $('#register').addClass('hide');
    });
    $('#goRegister').on('click', function(){
        document.title = '注册';
        $('#register').removeClass('hide');
        $('#user_login').addClass('hide');
    });
    T.PageLoaded();
});