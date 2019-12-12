require(["base", "tools"], function ($, T) {
    if(T._LOGED)window.location = T.DOMAIN.MEMBER+'index.html'+(T.INININ?'?'+T.INININ:'');
    var passport = {
        email: T.getQueryString('u'),
        init: function () {
            var obj = T.DOM.byId('account_email');
            if (obj) obj.innerHTML = passport.email;
            var logurl = T.GetEmilLoginURL(passport.email);
            var mailbox = T.DOM.byId('enter_mailbox');
            if (mailbox){
                T.DOM.attr(mailbox, 'href', logurl);
            }else{
                $(mailbox).remove();
            }
        }
    };
    if (passport.email){
        passport.init();
    }
    T.PageLoaded();
});