require(["base", "tools"], function ($, T) {
    if(T._LOGED)window.location = T.DOMAIN.MEMBER+'index.html';
    var Register = {
        params: {},
        typeMap: { 1: '腾讯QQ', 2: '微信', 3: '新浪微博', 4:'人人网', 5:'豆瓣' },
        init: function(param){
            var _this = this;
            param = param||{};
            _this.params.type = decodeURIComponent(T.Base64.decode(param.type||""));
            _this.params.openid = decodeURIComponent(T.Base64.decode(param.openid||""));
            _this.params.nickname = decodeURIComponent(T.Base64.decode(param.nickname||""));
            _this.params.portrait = decodeURIComponent(T.Base64.decode(param.portrait||""));
            _this.params.redirect_uri = param.redirect_uri||"";

            _this.setTypeText();
            T.PageLoaded();

            if(T._STORE){
                CFG_FORM.register.items.username = CFG_COM.username_store;
                CFG_FORM.register.items.password.required = false;
                delete CFG_FORM.register.items.code;
            }
            $("input[name='inviter']").val(T._SNICKNAME||"");
            T.CaptchaToPhone({
                trigger : "#sendCode",
                account : "#account",
                source : "0"
            });
            //T.SendCode("#sendCode","#account",0);
            _this.bindForm();
            _this.events();
        },
        redirect: function(){
            location.replace(this.params.redirect_uri||(T.DOMAIN.WWW + "member/udetail.html"));
        },
        setTypeText: function(type,nickname){
            var _this = this,
                nickname = _this.params.nickname,
                type = _this.typeMap[_this.params.type]||"";
            var html = '<li>欢迎您！<b class="red">'+nickname+'</b></li>';
            html += nickname===''?'':'<li>来自'+type+'的用户，为了更好的为您服务；</li><li>请完善以下资料，开通您的自主账户。</li><li>开通后'+type+'账号仍可登录。</li>';
            T.DOM.byId('comtext').innerHTML = html;
        },
        getParams: function(params){debugger
            var _this = this;
            params.link_type = _this.params.type;
            params.link_key = _this.params.openid;
            params.nick_name = _this.params.nickname;
            params.ep_logo = _this.params.portrait;
            return params;
        },
        bindForm: function(){
            var _this = this;
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
            T.FORM("register_user", CFG_FORM.register, {
                before: function(){
                    var _form = this;
                    var params = {
                        user_type: "0",
                        username: _form.params.username,
                        password: _form.params.password
                    };
                    if(T._STORE){
                        params.source = "1"//;T._SNICKNAME;
                        if(T._SNICKNAME&&!params.inviter){
                            params.inviter = T._SNICKNAME;
                        }
                    }
                    if(_form.params.code)params.code = _form.params.code;
                    if(_form.params.inviter)params.inviter = _form.params.inviter;
                    _form.params = _this.getParams(params);
                }
                ,success: function (data, params) {
                    if(T.RE.email.test(params.username)) {
                        var txts = ["恭喜您，注册成功，请立即激活账户"];
                        txts.push("亲爱的会员，您已经通过邮箱 " + params.username + " 注册成为云印会员了。");
                        txts.push("我们已经把激活邮件发送到了 " + params.username + " 邮箱，快去激活吧！");
                        txts.push("<span class='red'>小贴士：如果您没有收到激活邮件，可能邮件被误放入垃圾邮件中了</span>");
                        T.alt(txts.join("<br/>"));
                    }else{
                        T.SetCookie(data, params);
                        T.msg("开通个人账户成功");
                        setTimeout(function(){
                            _this.redirect();
                        }, 500);
                    }
                }
            });
            $('#account').on('keyup', function(){
                $('#sendCode').removeClass('dis');
            });
            T.FORM("login_bind", CFG_FORM.login_bind, {
                before: function(){
                    var _form = this;
                    _form.action = "in_user/link_insert";
                    var params = {
                        login_flag: "0",
                        username: _form.params.username,
                        password: _form.params.password,
                        remember: _form.params.remember||"0"
                    };
                    if(T._STORE){
                        params.source = "1"//;
                        if(T._SNICKNAME&&!params.inviter){
                            params.inviter = T._SNICKNAME;
                        }
                    }
                    _form.params = _this.getParams(params);
                }
                ,success: function (data, params) {
                    if(data.result==3 && T.RE.email.test(params.username)) {
                        var txts = ["亲爱的会员，您的账户未激活，请立即激活账户"];
                        txts.push("我们已经把激活邮件发送到了 " + params.username + " 邮箱，快去激活吧！");
                        txts.push("<span class='red'>小贴士：如果您没有收到激活邮件，可能邮件被误放入垃圾邮件中了</span>");
                        T.alt(txts.join("<br/>"));
                    }else{
                        T.SetCookie(data, params);
                        T.msg("绑定账户成功");
                    }
                    setTimeout(function(){
                        _this.redirect();
                    }, 500);
                }
                ,failure: function(data, params){
                    T.msg(data.msg||'用户名不存在或密码不正确');
                }
            });
        },
        events: function(){
            var _this = this;
            $("#regtabs").delegate("span", "click", function (e) {
                var $li = $(this).addClass("sel").closest("li");
                $("span", $li.siblings("li")).removeClass("sel");
                $("#register").removeClass().addClass("register " + $(this).attr("name"));
            });
            (function ($btn) {
                $btn.bind('click', function (e) {
                    T.DOM.preventDefault(e);
                    T.DOM.stopPropagation(e);
                    var $this = $(this);
                    var href = $this.attr('href');
                    new T.Popup({
                        title: $this.text().replace(/《|》/g,'')||'云印服务协议',
                        type: 'iframe',
                        content: href,
                        ok: '确定',
                        no: ''
                    });
                });
            })($('.agreement_link'));
        }
    };
    T.Loader(function(){
        var param = T.getRequest();
        if(param.type && param.openid && param.token && T.MD5(param.type + param.openid + param.nickname + param.portrait)==param.token){
            Register.init(param);
        }
    });
});