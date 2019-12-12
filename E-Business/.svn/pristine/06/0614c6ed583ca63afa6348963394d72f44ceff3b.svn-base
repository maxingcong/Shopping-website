define("modules/sign_score", ["base", "tools"], function ($, T) {
    function SignScore(options){
        this.init();
    }
    SignScore.prototype = {
        $cont: $("#template-signbtn-view"),
        init: function(options){
            var _this = this;
            _this.events();
        },
        /**
         * 查询是否已签到，
         * @param  {Number} type 类型 type:0表示签到,type:1表示查询签到
         * @param  {Function} cb 回调函数
         */
        getSigned: function(type, cb){
            debugger
            var _this = this;
            T.GET({
                action: 'in_user/signed_send_coin',
                params: {type: type},
                success: function (data) {
                    _this.data = data;
                    cb&&cb.call(_this);
                    _this.trigger("loaded", data, type);
                }
            });
        },
        /**
         * 设置已签到样式
         */
        setSignedCss: function(){
            var _this = this;
            _this.data.isCoin && _this.$cont.addClass('forbid').text('已签到')
                                    .siblings('.cions').html('已连续签到<span class="yellow"> '+ (_this.data.loginDay||0) +' </span>天');
        },
        /**
         * 绑定事件
         */
        events: function(){
            var _this = this;
            _this.$cont.bind("click", function (e) {//签到送积分
                !_this.data.isCoin&&_this.getSigned(0, function(){//没有签到
                    T.msg(_this.data.msg||'签到成功');
                    _this.setSignedCss();
                    T.SetMessageStatus();
                })
            });
        }
    };
    //让具备事件功能
    T.Mediator.installTo(SignScore.prototype);
    return function(options){
        return new SignScore(options);
    };
});