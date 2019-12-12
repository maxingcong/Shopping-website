require(["base", "tools"], function ($, T) {
    var params = T.getRequest();
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    var setpaypwd = {
        init: function (data) {
            T.FORM('setnewpaypwd', CFG_FORM['setnewpaypwd'], {
                before: function(){
                    var _this = this;
                    params.source = '2';
                    _this.params = T.Inherit(_this.params,params);
                }
                ,success: function (data) {
                    T.alt("设置支付密码成功。", setpaypwd.suc, setpaypwd.suc);
                }
            });
            /*if (data.data) {
             var action = CFG_FORM['setpaypwd'].action;
             action.param = params;
             T.FormValidator.init('setnewpaypwd', T.inherit(CFG_FORM['setnewpaypwd'], {
             action: action,
             success: function (data) {
             T.alt("设置支付密码成功。", setpaypwd.suc, setpaypwd.suc);
             }
             }));
             } else {
             T.alt("链接已失效，请重新申请修改支付密码！", setpaypwd.suc, setpaypwd.suc);
             }*/
        },
        suc: function () {
            window.location = T.DOMAIN.WWW;
        }
    };
    setpaypwd.init();
    T.PageLoaded();
    /*if (setpaypwd.q) {
     T._JSONPOST($.extend(CFG_DS.setpaypwd.get, { param: { data: setpaypwd.q} }), function (data) {
     if (data.errno == 0) {
     setpaypwd.init(data);
     T.pageLoaded();
     }
     });
     } else {
     window.location = T.DOMAIN.WWW + '?v='+T.VERSION;
     };*/
});