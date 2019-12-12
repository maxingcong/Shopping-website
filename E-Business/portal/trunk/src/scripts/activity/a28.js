require(["base", "tools", "widgets/navpos"], function($, T, NavPos){
    var activity = {
        init: function(){
            var _this = this;
            _this.events();
        },
        getCoupon: function(id){
            var $get = $('#getCoupon'), $btn = $get.find('a[data-id="'+id+'"]');
            if ($btn.hasClass('_dis')) {//已领取不可用
                return;
            }
            T.GET({
                action:'in_order/receive_coupon_card'
                ,params: {
                    channel_id: id
                }
                ,success: function(data){
                    var txt;
                    if (id=='270') {
                        txt = '恭喜您获得满99减5通用券一张！';
                    }else if(id=='271'){
                        txt = '恭喜您获得满199减10通用券一张！';
                    }else if(id=='272') {
                        txt = '恭喜您获得满500减30通用券一张！';
                    }else{
                        txt = '领取成功！';
                    }
                    T.msg(txt);
                    $btn.addClass('_dis').css('color', '#3e0016').text('已领取');
                }
                ,failure: function(data){
                    //failedSend
                    T.msg(data.msg.replace(/^\./,'')||'您已成功领取过优惠券，立即去使用吧！');
                    $btn.addClass('_dis').css('color', '#3e0016').text('已领取');
                }
            });
        },
        events: function(){
            var _this = this;
            $('#getCoupon').on('click', '.get', function(){
                var id = $(this).data('id');
                if (!T._LOGED) {
                    T.LoginForm(0, function(){
                        _this.getCoupon(id);
                    });
                }else{//存在则直接领取
                    _this.getCoupon(id);
                }
            });
        }
    };
    activity.init();
});