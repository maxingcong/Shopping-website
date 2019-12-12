require(["base", "tools"], function ($, T) {
    if (!T._LOGED) window.location = T.DOMAIN.WWW+(T.INININ?'?'+T.INININ:'');
    T.FORM('forgetpay_email', CFG_FORM['forgetpay_email'], {
        before: function(){
            var _this = this;
            _this.params.source = '2';
        }
        ,success: function (data, params) {
            window.location = T.DOMAIN.PASSPORT + 'passportpay.html?u=' + params.username+(T.INININ?'&'+T.INININ:'');
        }
    });
    T.FORM('forgetpay_mobile', CFG_FORM['forgetpay_mobile'], {
        before: function(){
            var _this = this;
            _this.params.source = '2';
        }
        ,success: function (data, params) {
            window.location = T.DOMAIN.PASSPORT + 'setpaypwd.html?username=' + params.username + '&code=' + params.code+(T.INININ?'&'+T.INININ:'');
        }
    });
    $("#regtabs").delegate("span", "click", function (e) {
        var $li = $(this).addClass("sel").closest("li");
        $("span", $li.siblings("li")).removeClass("sel");
        $("#forget").removeClass().addClass("register " + $(this).attr("name"));
    });
    T.SendCode('#sendCode','#account_mobile',2);
    T.PageLoaded();
});