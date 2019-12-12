require(["base", "tools"], function($, T){
    var activity = {
        init: function(){
            var _this = this;
            _this.events();
        },
        getCoupon: function(id){
            var $get = $('#getCoupon'), $btn = $get.find('a[data-id="'+id+'"]');
            if(!$btn.length){
                $btn = $get;
            }
            if ($btn.hasClass('_dis')) {//已领取不可用
                T.msg('已领取，不可重复领取！');
                return;
            }
            T.GET({
                action:'in_order/receive_coupon_card'
                ,params: {
                    channel_id: id
                }
                ,success: function(data){
                    T.msg('领取成功！');
                    $btn.addClass('_dis');
                    $btn.find('.a-btn').text('已领取');
                }
                ,failure: function(data){
                    T.msg(data.msg.replace(/^\./,'')||'您已成功领取过优惠券，立即去使用吧！');
                    $btn.addClass('_dis');
                    $btn.find('.a-btn').text('已领取');
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