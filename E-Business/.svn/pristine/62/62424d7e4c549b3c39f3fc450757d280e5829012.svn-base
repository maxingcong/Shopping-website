require(["base", "tools"], function ($, T) {
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    var safety = {
        init: function (data) {
            var user = data||{};
            $("#upanel").removeClass("hide");
            T.Template('safe_info', user, true);
            T.GET({
                action: 'in_user/complete_user_query',
                success: function (data) {
                    var count = data.safetyCount|| 1, percent = '', desc = '', cls='';
                    if(count==1){
                        percent = '40%';
                        desc = '较低';
                        cls = 'level2';
                    }else if(count==2){
                        percent = '80%';
                        desc = '较高';
                        cls = 'level4';
                    }else if(count==3){
                        percent = '100%';
                        desc = '安全';
                        cls = 'level5';
                    }
                    $('#safe_percent').html(percent);
                    $('#safe_desc').html(desc);
                    $('.safe-circle').addClass(cls);
                }
            });
        }
    };
    T.Loader(function() {
        T.GET({
            action: CFG_DS.udetail.get, success: function (data) {
                safety.init(data);
                T.PageLoaded();
            }
        });
    });
});