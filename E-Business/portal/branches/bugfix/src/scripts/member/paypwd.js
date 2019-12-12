require(["base", "tools", "modules/steps_valid"], function ($, T, Steps) {
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    var paypwd = {
        params: T.getRequest(),
        init: function (data) {
            var user = data||{},
                options = {
                    domNode: 'upanel',
                    type: 2
                };
            $("#upanel").removeClass("hide");
            if (user.hasPayPassword==1) {
                options.flag = 2;
            } else {
                $('#pageName').html('设置支付密码');
                options.flag = 1;
            }
            if(T.getRequest().code&&T.getRequest().source==8){
                if (user.hasPayPassword==1) {
                    options.step = 3;
                }else{
                    options.step = 2;
                }
                options.options = {code:T.getRequest().code};
            }
            Steps(options);
        }
    };
    T.Loader(function() {
        T.GET({
            action: CFG_DS.udetail.get, success: function (data) {
                paypwd.init(data);
                T.PageLoaded();
            }
        });
    });
});