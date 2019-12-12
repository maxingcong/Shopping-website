require(["base", "tools", "widgets/navpos"], function($, T, NavPos){
    var activity = {
        $cont: $("#floor_content"),
        $nav: $("#template-floor_nav-view"),
        floor: {
            floorList : [
                {floorId: 1, floorName: '书写工具超值套装', icon: 'floor1'},
                {floorId: 2, floorName: '白板笔超值套装', icon: 'floor2'},
                {floorId: 3, floorName: '中性笔超值套装', icon: 'floor3'},
                {floorId: 4, floorName: '小微企业套装', icon: 'floor4'},
                {floorId: 5, floorName: '小型企业套装', icon: 'floor5'},
                {floorId: 6, floorName: '中型企业套装', icon: 'floor6'},
                {floorId: 7, floorName: '雏鹰飞翔入职套装', icon: 'floor7'},
                {floorId: 8, floorName: '前台套装', icon: 'floor8'},
                {floorId: 9, floorName: '会议室套装A', icon: 'floor9'},
                {floorId: 10, floorName: '会议室套装B', icon: 'floor10'},
                {floorId: 11, floorName: '创业起航套装', icon: 'floor11'},
                {floorId: 12, floorName: '文件管理套装', icon: 'floor12'},
                {floorId: 13, floorName: '生活消耗品套装', icon: 'floor13'},
                {floorId: 14, floorName: '物流套装', icon: 'floor14'},
                {floorId: 15, floorName: '管理精英套装', icon: 'floor15'}
            ]
        },
        init: function(){
            var _this = this;
            _this.events();
            T.Template("floor_nav", _this.floor, true);
            //楼层导航
            NavPos({
                $cont: _this.$cont,
                $nav: _this.$nav,
                namespace: "floor",
                navItem: ".nav-item",
                floorItem: ".floor-item"
            });
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
                    if (id=='199') {
                        txt = '恭喜您获得文具套装5元优惠券一张！';
                    }else if(id=='200'){
                        txt = '恭喜您获得文具套装10元优惠券一张！';
                    }else{
                        txt = '领取成功！';
                    }
                    T.msg(txt);
                    $btn.addClass('_dis').css('background-color', '#999').text('已领取');
                }
                ,failure: function(data){
                    //failedSend--data.msg
                    T.msg(data.msg.replace(/^\./,'')||'您已成功领取过优惠券，立即去使用吧！');
                    $btn.addClass('_dis').css('background-color', '#999');//.text('已领取');
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