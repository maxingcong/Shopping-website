/**
 * 图片验证码
 * @param options
 * @returns {{getValue: getValue, verify: verify, refresh: refresh}}
 * @constructor
 */
function Captcha(options){
    var _this = this,
        opts = options||{};
    opts.img = opts.img||"img"; //图片
    opts.code = opts.code||"input[name='code']"; //输入框
    opts.account = opts.account||"input[name='account']"; //账号输入框
    opts.refresh = opts.refresh||".refresh"; //刷新按钮
    _this.data = {
        token: ""
    };
    _this.options = opts;
    if(opts.trigger){
        $(opts.trigger).off("click.captcha").on("click.captcha", function(e){
            _this.show();
            _this.init();
        });
    }else{
        _this.init();
    }
}
Captcha.prototype = {
    init: function(){
        var _this = this,
            opts = _this.options;
        _this.$cont = $(opts.cont); //验证码容器
        _this.$img = $(opts.img, _this.$cont); //验证码图片
        _this.$input = $(opts.input, _this.$cont); //验证码输入框
        _this.$account = $(opts.account, _this.$cont); //账号输入框
        _this.$trigger = $(opts.trigger, _this.$cont); //触发按钮
        _this.$img.off("click.captcha").on("click.captcha", function(e){
            _this.refresh();
        });
        $(opts.refresh, _this.$cont).off("click.captcha").on("click.captcha", function(e){
            _this.refresh();
        });
        _this.refresh();
    },
    /**
     * 显示验证码弹出框
     */
    show: function(){
        var _this = this,
            opts = _this.options;
        contId = "captcha" + new Date().getTime();
        var html = '<div class="forms form_vcode" id="'+contId+'"><input type="text" class="vcode" value="" name="code"/><img class="img" src=""/><a class="refresh" href="javascript:;">换一张</a></div>';
        _this.popup = T.cfm(html, function(){
            _this.verify();
            return false;
        }, function (_o) {
            _o.remove();
        }, "请输入图片验证码", "发 送");
        opts.cont = "#" + contId;
    },
    /**
     * 获取输入的验证码
     * @returns {*}
     */
    getValue: function(){
        var _this = this;
        return $.trim(T.toDBC(_this.$input.val()));
    },
    /**
     * 校验验证码
     */
    verify: function(params){
        var _this = this,
            opts = _this.options;
        var code = _this.getValue(),
            account = $.trim(T.toDBC(_this.$account.val()));
        if(_this.data.token && code){
            T.POST({
                action: "http://alpha.action.ininin.com/in_common/captcha_verify",
                params: {
                    token: _this.data.token,
                    capt_val: code
                },
                success: function(data, params){
                    //验证码校验通过，继续业务处理
                    if (T.RE.mobile.test(account) && !_this.timer && !_this.$trigger.hasClass("dis")){
                        _this.sendCode(data.token);
                    }else{
                        opts.success.call(_this, data.token);
                    }
                },
                failure: function(data, params){
                    //验证码校验通过，刷新验证码，提示用户重新输入
                    T.msg(data.msg||"输入验证码有误，请重新输入");
                    _this.refresh();
                }
            });
        }else{
            _this.refresh();
        }
    },
    /**
     * 加载验证码
     */
    refresh: function(){
        var _this = this;
        //获取唯一码
        T.GET({
            action: "http://alpha.action.ininin.com/in_common/get_captcha_token",
            success: function(data, params){
                _this.data.token = data.token||"";
                //加载验证码
                _this.$img.attr("src", /*T.DOMAIN.ACTION*/"http://alpha.action.ininin.com/" + "in_common/get_captcha" + T.ConvertToQueryString({token: _this.data.token}));
            },
            failure: function(data, params){

            }
        }, function(){}, function(){});
    },
    /**
     * 发送手机验证码
     */
    sendCode: function(account, token){
        var _this = this;
        T.POST({
            action: COM_API.sendcode,
            params: params,
            success: function (data) {
                if (T.VCODE.pop) {
                    T.VCODE.pop.remove();
                }
                if (success) {
                    success(data);
                } else {
                    T.msg('发送验证码成功');
                }
            }, failure: function (data, params) {
                if (T.VCODE.pop) {
                    T.VCODE.pop.remove();
                }
                if (failure)failure(data);
                T.alt(data.msg || T.TIPS.DEF, function (_o) {
                    _o.remove();
                });
            }
        });
    }
};
T.Captcha = function(options){
    return new Captcha(options);
};