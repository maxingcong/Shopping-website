require(["base", "tools"], function ($, T) {
    if (!T._LOGED) window.location = T.DOMAIN.WWW+(T.INININ?'?'+T.INININ:'');
    var passport = {
        init: function (data) {
            var obj = T.DOM.byId('account_email');
            if (obj) obj.innerHTML = data.email;
            var logurl = T.GetEmilLoginURL(data.email);
            var mailbox = T.DOM.byId('enter_mailbox');
            if (mailbox){
                T.DOM.attr(mailbox, 'href', logurl);
            }else{
                $(mailbox).remove();
            }
        }
    };
    var data = { errno: 0, email: T.getQueryString('u') };
    if (typeof data == 'object') passport.init(data);
    T.PageLoaded();
});