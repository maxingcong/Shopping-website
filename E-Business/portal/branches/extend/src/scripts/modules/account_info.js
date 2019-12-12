define("modules/account_info", ["base", "tools", "widgets/up_image"], function ($, T, UpImage) {
    function AccountInfo(options){
        this.init();
    }
    AccountInfo.prototype = {
        $cont: $("#template-accountinfo-view"),
        upImage: UpImage(),
        status: ['','',''],
        data: {
            VIP_LEVEL: T.VIP_LEVEL
        },
        init: function(options){
            var _this = this;
            _this.events();
        },
        load: function(){
            var _this = this;
            T.GET({ //个人资料
                action: CFG_DS.udetail.get,
                success: function (data, params) {
                    _this.status[0]='1';
                    data.username = T._NICKNAME;
                    _this.data = T.Inherit(_this.data, data);
                    _this.reload();
                }
            });
            T.GET({ //资料完整度
                action: 'in_user/complete_user_query',
                success: function (data) {
                    _this.status[1]='1';
                    var completeCount=data.completeCount>12?12:data.completeCount;
                    data.completePercent = completeCount?Math.floor((completeCount)*100/12)+'%':'0%';
                    _this.data = T.Inherit(_this.data, data);
                    _this.reload();
                }
            });
            T.GET({ //会员等级
                action: "in_user/user_vip_query",
                success: function (data, params) {
                    _this.status[2]='1';
                    _this.data.vipLevel = parseInt(data.vipLevel, 10) || 0; //会员等级
                    if(/^\d+-\d+-\d+$/.test(data.effectiveTime)){
                        _this.data.effectiveTimeStr = data.effectiveTime.replace("-", "年").replace("-", "月") + "日";
                    }else{
                        _this.data.vipLevel = 0;
                    }
                    _this.data.effectiveDay = parseInt(data.effectiveDay, 10) || 0; //剩余天数
                    _this.data.vipDiscount = parseFloat(data.discount); //会员折扣
                    _this.data.vipDiscountNum = parseFloat(T.Number.mul(_this.data.vipDiscount, 10)); //会员折扣
                    if(!_this.data.VIP_LEVEL[_this.data.vipLevel]){
                        _this.data.vipLevel = 0;
                    }
                    _this.reload();
                }
            });
            //会员特权说明
            T.TIP({
                container: '#template-accountinfo-view',
                trigger: '.vip-icon',
                content: function(trigger) {
                    return T.Compiler.template("vip_info", _this.data);
                },
                left: true,
                width: 'auto',
                offsetX: 0,
                offsetY: 0
            });
        },
        /**
         * 保存头像
         * @param opts
         */
        save: function(opts){
            var _this = this;
            if(opts && opts.figureurl){
                T.POST({
                    action: CFG_FORM["user_info"].action,
                    params: {
                        figureurl: opts.figureurl
                    },
                    success: function(data, params){
                        T.msg("保存成功");
                        _this.data.figureurl = opts.figureurl;
                        _this.upImage.destroy();
                        $(".acc_brief img", _this.$cont).attr("src", opts.figureurl);
                    }
                });
            }
        },
        /**
         * 绑定事件
         */
        events: function(){
            var _this = this;
            //保存头像
            _this.upImage.on("save", function(opts){
                _this.save(opts);
            });
            //编辑头像
            _this.$cont.on("click", ".headimg_edit", function(e){
                _this.upImage.show(_this.data);
            });
        },
        reload: function(){
            var _this = this;
            if (_this.status.join('').length == _this.status.length) {
                T.Template("accountinfo", _this.data, true);
                _this.trigger("loaded", _this.data);
            }
        }
    };
    //让具备事件功能
    T.Mediator.installTo(AccountInfo.prototype);
    return function(options){
        return new AccountInfo(options);
    };
});