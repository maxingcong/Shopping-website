require(["base", "tools", "modules/steps_valid"], function ($, T, Steps) {
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    var safetips = {
        params: T.getRequest(),
        init: function (data) {
            var _this = this;
            var user = data||{},
                options = {
                    domNode: 'upanel',
                    type: 5
                };
            $("#upanel").removeClass("hide");
            _this.safetyFlag = user.safetyFlag;
            if (user.safetyFlag==1) {
                options.flag = 2;
            } else {
                $('#pageName').html('设置安全问题');
                options.flag = 1;
            }
            if(T.getRequest().code&&T.getRequest().source==5){
                if (user.safetyFlag==1) {
                    options.step = 3;
                }else{
                    options.step = 2;
                }
                options.options = {code:T.getRequest().code};
            }
            options.before = _this.replaceStep;
            Steps(options);
        },
        replaceStep: function(target){
            var _this = target;
            _this.steps.splice(safetips.safetyFlag?2:1,1,{
                descText: safetips.safetyFlag?'修改安全问题':'设置安全问题',
                questions: ['','',''],
                init: function(options){
                    if(!options.code&&!options.result_mark){
                        return;
                    }
                    var _self = this,
                        username = options.username||T._ACCOUNT;
                    var view = T.Template('change_safetips', 'steps_content', {}, true);
                    var dom1 = document.getElementById('firstTips'),
                        dom2 = document.getElementById('secondTips'),
                        dom3 = document.getElementById('thirdTips');
                    T.GET({
                        action: 'in_user/query_pwd_question',
                        params: null,
                        success: function(data){
                            var sateTips = data.protectQuestionList||[];
                            var options = {
                                data: sateTips,
                                key: 'question',
                                val: 'question'
                            };
                            //下拉框初始化
                            _this.setSelectOptions(dom1, options);
                            _this.setSelectOptions(dom2, options);
                            _this.setSelectOptions(dom3, options);
                            $('select', $(view)).each(function(index, domEle){
                                $(domEle).prepend('<option value="">请选择安全问题</option>');
                            });
                        }
                    });
                    T.FORM('set_safe_tips', CFG_FORM['set_safetips'], {
                        before: function(){
                            var _this = this;
                            var firstAnswer = $.trim($('input[name=answer1]').val()),
                                secondAnswer = $.trim($('input[name=answer2]').val()),
                                thirdAnswer = $.trim($('input[name=answer3]').val());
                            var resultMark = dom1.value+'_'+firstAnswer+','+dom2.value+'_'+secondAnswer+','+dom3.value+'_'+thirdAnswer;
                            _this.params.user_name = username;
                            _this.params.type = '1';
                            if(options.code){
                                _this.params.code = options.code;
                                _this.params.result_mark = resultMark;
                            }else if(options.result_mark){
                                _this.params.result_mark = options.result_mark;
                                _this.params.new_result_mark = resultMark;
                            }
                        }
                        ,success: function (data, params) {
                            _this.goStep(_self.index+1);
                        }
                    });
                    $(view).undelegate('select', 'change').delegate('select', 'change', function(){
                        var $other1 = $(dom2),
                            $other2 = $(dom3),
                            newval = $(this).val(),
                            oldval = _self.questions[0];
                        if($(this).attr('id')=='secondTips'){
                            $other1 = $(dom1);
                            $other2 = $(dom3);
                            oldval = _self.questions[1];
                            _self.questions[1]=newval;
                        }else if($(this).attr('id')=='thirdTips'){
                            $other1 = $(dom1);
                            $other2 = $(dom2);
                            oldval = _self.questions[2];
                            _self.questions[2]=newval;
                        }else{
                            _self.questions[0]=newval;
                        }
                        $('option', $other1).add($('option', $other2)).each(function(index,domEle){
                            var val = $(domEle).attr('value');
                            if(newval&&(val==newval)){
                                $(domEle).hide();
                            }
                            if(val&&(val==oldval)){
                                $(domEle).show();
                            }
                        });
                    });
                }
            });
        }
    };
    T.Loader(function() {
        T.GET({
            action: CFG_DS.udetail.get, success: function (data) {
                safetips.init(data);
                T.PageLoaded();
            }
        });
    });
});