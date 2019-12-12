define("oauth/sina", ["base", "tools"], function($, T){
    function OAuthSina(options){
        this.init(options);
    }
    OAuthSina.prototype = {
        data: {
            type: 3
        },
        init: function(options){
            var _this = this;
            var opts = options||{};
            _this.btnId = opts.btnId||"";
            if(!window.WB2 || !opts.btnId)return;
            _this.$cont = $("#" + _this.btnId);
            _this.$cont.html(_this.$cont.data("value")||"");
            if (WB2.checkLogin()) {
                _this.$cont.on("click", function(e){debugger
                    _this.trigger("success", _this.data);
                });
                _this.checkLogin(T.getRequest("?" + (T.cookie("weibojs_2422438855")||"")));
            }else{
                _this.bindLogin();
            }
        },
        checkLogin: function(opts){
            var _this = this;
            if(opts && opts.uid){
                WB2.anyWhere(function(W) {
                    W.parseCMD("/users/show.json", function (o, bStatus) {
                        try {
                            _this.data.openid = String(o.id);
                            _this.data.nickname = o.screen_name==null?"":o.screen_name;
                            _this.data.portrait = o.profile_image_url==null?"":o.profile_image_url;
                        } catch (e) {
                            _this.bindLogin();
                        }
                        _this.$cont.html(_this.$cont.data("value")||"");
                    }, {
                        uid: opts.uid
                    }, {
                        method: "get"
                    });
                });
            }else{
                _this.bindLogin();
            }
        },
        bindLogin: function(){
            var _this = this;
            WB2.anyWhere(function (W) {
                W.widget.connectButton({
                    id: _this.btnId,
                    type: "3,2",
                    callback: {
                        login: function (o) { //登录后的回调函数
                            _this.data.openid = String(o.id);
                            _this.data.nickname = o.screen_name==null?"":o.screen_name;
                            _this.data.portrait = o.profile_image_url==null?"":o.profile_image_url;
                            _this.$cont.html(_this.$cont.data("value")||"");
                            _this.trigger("success", _this.data);
                        },
                        logout: function () { //退出后的回调函数
                            T.cookie("sid", "", { expires: -1, path: "/", domain: T.DOMAIN.DOMAIN });
                            window.reload();
                        }
                    }
                });
            });
        }
    };
    //让具备事件功能
    T.Mediator.installTo(OAuthSina.prototype);
    return function(options){
        return new OAuthSina(options);
    };
});