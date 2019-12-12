require(["base", "tools"], function ($, T) {
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    var user = {
        $cont: $("#template_vip_service_view"),
        init: function (params, callback) {
            var _this = this;
            _this.reload(params, callback);
            _this.events();
        },
        reload: function (params, callback) {
            var _this = this;
            T.GET({
                action: "in_user/user_query",
                params: params||_this.params,
                success: function (data) {
                    _this.data = data||{};
                    _this.render();
                    if(callback)callback(_this.data);
                }
            });
        },
        render: function(){
            var _this = this;
            T.Template('vip_service', _this.data);
        },
        update: function($this){
            var canInsteadOrder = $this.data("value");
            if(typeof(canInsteadOrder)=='undefined')return;
            var tit = "禁用";
            var text = "禁用后，服务人员将不能帮您进行代下单，代申请发票等操作。";
            if(canInsteadOrder==1){
                tit = "开启";
                text = "开启后，服务人员可以帮您进行代下单，代申请发票等操作。";
            }
            T.cfm(text, function(_o){
                _o.remove();
                T.GET({
                    action: "in_user/user_update",
                    params: {can_instead_order: canInsteadOrder},
                    success: function (data) {
                        T.msg(tit+"成功");
                        $this.addClass("sel").siblings(".radio").removeClass("sel");
                    }
                });
            }, function(_o){
                _o.remove();
            }, tit+"服务人员代操作", "确认"+tit, "暂不"+tit);
        },
        events: function(){
            var _this = this;
            if(_this.binded)return;
            _this.$cont.delegate(".toorder .radio", "click", function (e) {//是否委托下单
                var $this = $(this);
                if(!$this.hasClass("sel")){
                    _this.update($this);
                }
            });
            _this.binded = 1;
        }
    };
    var main = {
        status: [''],//['用户信息','VIP服务信息']
        init: function(){
            var _this = this;
            user.init(null, function(data){
                _this.loaded(0);
            });
        },
        loaded: function(i){
            var _this = this;
            _this.status[i] = '1';
            if(_this.status.length==_this.status.join('').length){
                T.PageLoaded();
            }
        }
    };
    T.Loader(function(){
        main.init();
    });
});