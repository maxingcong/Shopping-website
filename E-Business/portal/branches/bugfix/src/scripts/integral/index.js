require(["base", "tools"], function ($, T) {
    var integral = {
        data: {},
        status: ['',''],
        init: function(){
            if(T._LOGED){
                $("#user_not_login").remove();
                integral.data.user_name = T._ACCOUNT||'';
                integral.myintegral();
                integral.udetail();
            }else{
                $("#user_loged").remove();
            }
            $("#login_btn2").click(function(e){
                T.LoginForm();
                return false;
            });
            /*	$(window).bind("scroll.pdesc resize.pdesc", function(e){
             var _top = $(window).scrollTop();
             var winTop = _top+$(window).height();
             var _top4 = $("#tegral_tit").offset().top+$("#tegral_tit").outerHeight();
             var _top5 = $("#footer").offset().top;
             if(_top5<winTop){
             $("#tegral_con").addClass("fixed").css({bottom:winTop-_top5+15});
             }else if(_top4<winTop){
             $("#tegral_con").addClass("fixed").css({bottom: -1});
             }else{
             $("#tegral_con").removeClass("fixed");
             }
             }).resize();*/
        },
        myintegral: function(){
            T.GET({
                action: 'in_order/in_coin_query'
                ,success: function (data) {
                    integral.status[1] = '1';
                    var _data = T.FormatData(data||{});
                    integral.data.all_my_coin = _data.all_my_coin;
                    integral.loaded();
                }
            });
        },
        udetail: function(){
            T.GET({
                action: 'in_user/user_query'
                ,success: function (data) {
                    integral.status[3] = '1';
                    var _data = T.FormatData(data||{});
                    integral.data.level = _data.level||'';
                    integral.loaded();
                }
            });
        },
        loaded: function(){
            if(integral.status.join('')=='11'){
                integral.status = ['','','','',''];
                var cn = {"铁牌":"level1","铜牌":"level2","银牌":"level3","金牌":"level4","钻石":"level5"}[integral.data.level]||"level1";
                var dom = T.DOM.byId('grade_img');
                if(dom){
                    T.DOM.addClass(dom,cn);
                }
                T.BindData('data', integral.data);
                T.PageLoaded();
            }
        }
    };
    T.Loader(function() {
        integral.init();
    });
});