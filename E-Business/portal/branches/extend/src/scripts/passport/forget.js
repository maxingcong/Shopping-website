require(["base", "tools", "modules/steps_valid"], function ($, T, Steps) {
    if(T._LOGED)window.location = T.DOMAIN.MEMBER+'index.html'+(T.INININ?'?'+T.INININ:'');
    var forget = {
        params: T.getRequest(),
        init: function () {
            var _this = this;
            var options = {
                domNode: 'upanel',
                flag: 2,
                type: 6
            };
            $("#upanel").removeClass("hide");
            if(T.getRequest().code&&T.getRequest().source==6){
                options.step = 4;
                options.options = {code:T.getRequest().code, username:T.getRequest().username};
            }
            options.before = _this.replaceStep;
            Steps(options);
        },
        replaceStep: function(target){
            var _this = target;
            _this.steps.splice(0,1,{
                descText: '填写账号',
                init: function() {
                    var _self = this;
                    T.Template('user_name', 'steps_content', {}, true);
                    T.FORM('check_username', CFG_FORM['check_username'], {
                        success: function (data, params) {
                            $('#userName').addClass('error').find('.msg').html('该账号不存在').show();
                        }
                        , failure: function (data, params) {
                            _this.goStep(_self.index + 1, params.username);
                        }
                    });
                    $('input[name=username]').focus();
                }
            },{
                descText: '选择验证方式',
                init: function(username){
                    var _self = this;
                    if(!username){
                        return;
                    }
                    T.GET({
                        action: 'in_user/query_pwd_result',
                        params: {
                            user_name: username
                        },
                        success: function (data) {
                            var obj = {
                                hasMobile: true,
                                hasQuestion: false,
                                username: username
                            };
                            if(data.protectResultList&&data.protectResultList.length){
                                obj.hasQuestion = true;
                            }
                            if(T.RE.email.test(username)){
                                obj.hasMobile = false;
                            }
                            obj.usernameEllipsis = _this.toEllipsis(username);
                            var view = T.Template('forget_check_type', 'steps_content', obj, true);
                            $(view).undelegate('.pre','click').delegate('.pre', 'click', function(){
                                _this.goStep(_self.index-1);
                            }).undelegate('.btn-primary','click').delegate('.btn-primary', 'click', function(){
                                _this.goStep(_self.index+1, {
                                    type: $(this).data('value'),
                                    hasMobile: obj.hasMobile,
                                    hasQuestion: obj.hasQuestion,
                                    username: username
                                });
                            });
                        }
                    });
                }
            });
            _this.steps.splice(_this.steps.length-1,1,{
                descText: '修改成功',
                init: function(){
                    T.Template('forget_step_success', 'steps_content', {}, true);
                }
            });
        }
    };
    T.Loader(function() {
        forget.init();
        T.PageLoaded();
    });
});