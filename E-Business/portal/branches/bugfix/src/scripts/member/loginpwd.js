require(["base", "tools", "modules/steps_valid"], function ($, T, Steps) {
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    var loginpwd = {
        params: T.getRequest(),
        init: function () {
            if(T.getRequest().code&&T.getRequest().source==7){
                Steps({domNode: 'upanel', flag: 2, type: 1, step: 3, options: {code:T.getRequest().code}});
            }else{
                Steps({domNode: 'upanel', flag: 2, type: 1});
            }
        }
    };
    T.Loader(function() {
        loginpwd.init();
        T.PageLoaded();
    });
});