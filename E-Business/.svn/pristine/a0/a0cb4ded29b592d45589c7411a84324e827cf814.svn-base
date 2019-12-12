require(["base", "tools", "oauth/sina", "oauth/login"], function($, T, OAuthSina, OAuthLogin){
    var oauthLogin, UnionLogin = {
        init: function(){
            var _this = this;
            oauthLogin = OAuthLogin();
            var oauthSina = OAuthSina({
                btnId: "sina_login_btn"
            });
            oauthSina.on("success", function(data){
                if (data && data.openid) {
                    oauthLogin.login(data);
                }
            });
        }
    };
    T.Loader(function() {
        UnionLogin.init();
    });
});