require(["base", "tools"], function ($, T) {
    var params = T.getRequest();
    if(T._LOGED)window.location = T.DOMAIN.MEMBER+'index.html'+(T.INININ?'?'+T.INININ:'');
    var setpwd = {
        params: T.getRequest(),
        suc: function () {
            var params = {
                username: setpwd.params.username,
                password: setpwd.params.password
            };
            T.POST({
                action: 'in_user/login'
                ,params: params
                ,success: function(data){
                    params.userkey = T.UUID(32).toUpperCase();
                    T.SetCookie(data, params);
                    window.location = T.DOMAIN.MEMBER+'index.html'+(T.INININ?'?'+T.INININ:'');
                }
                ,failure: function(){
                    window.location = T.DOMAIN.WWW+(T.INININ?'?'+T.INININ:'');
                }
            });
        }
    };
    T.FORM('setpwd', CFG_FORM['setpwd'], {
        before: function(){
            var _this = this;
            params.source = '1';
            setpwd.params.password = params.password = _this.params.password;
            _this.params = params;
        }
        ,success: function (data) {
            T.alt("设置密码成功。", setpwd.suc, setpwd.suc);
        }
    });
    T.PageLoaded();
});