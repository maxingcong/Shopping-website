define("oauth/login", ["base", "tools"], function($, T){
    //联合登陆
    function OAuthLogin(options){
    }
    OAuthLogin.prototype = {
        params: T.getRequest(),
        typeMap: { 1: 'QQ', 2: '微信', 3: '新浪微博', 4:'人人网', 5:'豆瓣' },
        init: function(options, callback){
            var _this = this;
            if(T._LOGED && _this.params.redirect_uri.indexOf(T.DOMAIN.MEMBER+"union.html")==0){
                _this.bind(options, callback);
            }else{
                _this.login(options, callback);
            }
        },
        /**
         * 未登录，登录
         * @param opts
         */
        login: function(opts, callback){
            var _this = this;
            T.POST({
                action: "in_user/link_login",
                params: {
                    link_type: opts.type,
                    link_key: opts.openid
                },
                success: function (data, params) {debugger
                    T.SetCookie(data, params);
                    var requests = T.getRequest();
                    location.replace(opts.redirect_uri||_this.params.redirect_uri||T.DOMAIN.WWW);
                    _this.trigger("success", _this.data);
                    callback && callback(_this.data);
                },
                failure: function (data, params) {debugger
                    if(data.result==2){
                        T.alt("被授权登录账户已冻结", function(_o){
                            location.replace(T.DOMAIN.WWW);
                        }, function(_o){
                            location.replace(T.DOMAIN.WWW);
                        });
                    }else if(data.result==3){
                        var txts = ["亲爱的会员，您的账户未激活，请立即激活账户"];
                        txts.push("我们已经把激活邮件发送到了邮箱，快去激活吧！");
                        txts.push("<span class='red'>小贴士：如果您没有收到激活邮件，可能邮件被误放入垃圾邮件中了</span>");
                        T.alt(txts.join("<br/>", function(_o){
                            location.replace(T.DOMAIN.WWW);
                        }, function(_o){
                            location.replace(T.DOMAIN.WWW);
                        }));
                    }else{
                        var param = {
                            type: T.Base64.encode(encodeURIComponent(opts.type||"")),
                            openid: T.Base64.encode(encodeURIComponent(opts.openid||"")),
                            nickname: T.Base64.encode(encodeURIComponent(opts.nickname||"")),
                            portrait: T.Base64.encode(encodeURIComponent(opts.portrait||"")),
                            redirect_uri: opts.redirect_uri||_this.params.redirect_uri||""
                        };
                        param.token = T.MD5(param.type + param.openid + param.nickname + param.portrait);
                        location.replace(T.DOMAIN.PASSPORT + "openuser.html?" + T.Transfer.encodeHashString(param));
                    }
                }
            });
        },
        /**
         * 已登录，绑定
         * @param opts
         */
        bind: function(opts, callback){
            this.check(opts, callback);
        },
        /**
         * 验证是否绑定了其他账号
         */
        check: function(opts, callback){
            var _this = this;
            T.POST({
                action: "in_user/link_check",
                params: {
                    link_type: opts.type,
                    link_key: opts.openid
                },
                success: function (data, params) {
                    _this.insert(opts, callback);
                },
                failure: function (data, params) {
                    var popup = new T.Popup({
                        fixed: true,
                        title: '温馨提示',
                        width: 480,
                        content: '<dl class="popbox vertical_middle warning"><dt class="vm_left "></dt><dd class="vm_right">您的' + _this.typeMap[opts.type] + '已绑定其他云印账号，继续操作，将解绑原有的云印账号，并绑定该云印账号！</dd></dl>',
                        ok: '继续绑定',
                        no: '暂不绑定'
                    });
                    popup.on("ok", function(){
                        _this.insert(opts, callback);
                    });
                    popup.on("no", function(){
                        _this.trigger("failure", data);
                        callback && callback(_this.data);
                    });
                }
            });
        },
        /**
         * 绑定账号
         * @param opts
         * @param callback
         */
        insert: function(opts, callback){
            var _this = this;
            T.POST({
                action: "in_user/link_insert",
                params: {
                    login_flag: "1",
                    link_type: opts.type,
                    link_key: opts.openid
                },
                success: function (data, params) {debugger
                    _this.trigger("success", data);
                    callback && callback(_this.data);
                }
            });
        }
    };
    //让具备事件功能
    T.Mediator.installTo(OAuthLogin.prototype);
    return function(options){
        return new OAuthLogin(options);
    };
});