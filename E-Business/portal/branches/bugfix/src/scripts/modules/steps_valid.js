define("modules/steps_valid", ["base", "tools"], function($, T){
    function Steps(options){
        this.init(options);
    }
    //分步验证
    Steps.prototype = {
        domNode: null, //根节点
        codeSource: {1:7, 2:8, 5:5, 6: 6}, //不同类型对应的发送和验证code的source值
        /**
         * @param {Object} options 参数
         * @param {Object|String} options.domNode 根节点
         * @param {Number} options.flag 1:首次设置|2:修改
         * @param {Number} options.type 1:登录密码|2:支付密码|3:手机号码|4:邮箱|5：安全问题|6: 找回登录密码
         */
        init: function(options){
            var _this = this;
            if(!options.domNode){
                return;
            }
            var flag = options.flag || 2;
            var type = options.type || 2;
            var domNode = options.domNode;
            if(typeof(domNode) == 'string'){
                domNode = document.getElementById(domNode);
            }
            _this.domNode = $(domNode);
            _this.steps = _this.createSteps(flag, type);//创建步骤
            if (options.before)options.before(_this);//修改步骤
            _this.renderTitle();//初始化步骤提示
            if(options.step){
                _this.goStep(options.step, options.options);
            }else if(flag==2){
                _this.goStep(1);
            }else if(flag==1){
                if(T.RE.mobile.test(T._ACCOUNT)){
                    _this.goStep(1, {
                        type: 0,
                        hasMobile: true
                    });
                }else{
                    _this.goStep(1, {
                        type: 1,
                        hasMobile: false
                    });
                }
            }
        },
        renderTitle: function(){
            var _this = this;
            var str = '';
            T.Each(_this.steps, function(index, v){
                var clsname = 'circle';
                v.index=index+1;
                if(index==0){
                    clsname = 'circle first';
                }else if(index==_this.steps.length-1){
                    clsname = 'circle last';
                }
                str += '<li><div class="'+clsname+'">'+(index+1)+'</div>'+ v.descText +'</li>';
            });
            $('.steps-title', _this.domNode).html(str);
        },
        goStep: function(index, options){
            var _this = this;
            if(!_this.steps.length){
                return;
            }
            if(index<1||index>_this.steps.length){
                return;
            }
            index = index||1;
            _this.steps[index-1].init(options);
            $('.steps-title li', _this.domNode).each(function(i, domEle){
                if(i<index){
                    $(domEle).addClass('active');
                }else{
                    $(domEle).removeClass('active');
                }
            });
        },
        /**
         * 创建步骤
         * @param {String} flag
         * @param {String} type
         */
        createSteps: function(flag, type){
            var _this = this,
                arr = [];
            var step1= {
                descText: '选择验证方式',
                init: function(){
                    var _self = this;
                    T.GET({
                        action: CFG_DS.udetail.get, success: function (data) {
                            var obj = {
                                hasMobile: true,
                                hasQuestion: false
                            };
                            if(data.safetyFlag){
                                obj.hasQuestion = true;
                            }
                            if(!T.RE.mobile.test(T._ACCOUNT)){
                                obj.hasMobile = false;
                            }
                            var view = T.Template('check_type', 'steps_content', obj, true);
                            $(view).undelegate('.radio', 'click').delegate('.radio', 'click', function(){
                                $(this).addClass('sel').siblings('.radio').removeClass('sel');
                            }).undelegate('.submit', 'click').delegate('.submit', 'click', function(){
                                var type = $('.radio.sel', $(view)).data('value');
                                _this.goStep(_self.index+1, {
                                    type: type,
                                    hasMobile: obj.hasMobile,
                                    hasQuestion: obj.hasQuestion
                                });
                            });
                        }
                    });
                }
            };
            var step2 = {
                descText: '验证身份',
                init: function(options){
                    if(!options){
                        return;
                    }
                    var _self = this;
                    var view = null;
                    var selfType = options.type,
                        hasMobile = options.hasMobile,
                        hasQuestion = options.hasQuestion,
                        username = options.username||T._ACCOUNT;
                    if(selfType==0&&hasMobile) { //手机号
                        var phoneEllipsis = username.substr(0,3) + '****' + username.substr(7);
                        view=T.Template('check_cellphone', 'steps_content', {flag:flag, phone: username, phoneEllipsis:phoneEllipsis}, true);
                        $(view).undelegate('.pre', 'click').delegate('.pre', 'click', function(){
                            _this.goStep(_self.index-1, username);
                        });
                        T.FORM('forgetpay_mobile', CFG_FORM['forgetpay_mobile'], {
                            before: function(){
                                var _this = this;
                                _this.params.username = username;
                                _this.params.source = 1;
                            }
                            ,success: function (data, params) {
                                //window.location = T.DOMAIN.PASSPORT + 'setpaypwd.html?username=' + params.username + '&code=' + params.code+(T.INININ?'&'+T.INININ:'');
                                _this.goStep(_self.index+1, {username:username, code:params.code});
                            }
                        });
                        T.CaptchaToPhone({
                            trigger : "#sendCode",
                            username: username,
                            source : 1
                        });
                        //T.SendCode('#sendCode','#account_mobile',1);
                    }else if(selfType==1&&!hasMobile) { //邮箱
                        view=T.Template('check_email', 'steps_content', {email: _this.toEllipsis(username), flag: flag}, true);
                        T.CaptchaToPhone({
                            trigger : "#sendEmail",
                            username: username,
                            source : _this.codeSource[type],
                            successTip: '发送邮件成功！'
                        }, {
                            success: function(){
                                var email = username,
                                    domain = email.substr(email.indexOf('@') + 1),
                                    url = '';
                                $('#sendedEmail').removeClass('hide').find('span').html(_this.toEllipsis(username));
                                $('.steps-btm', $(view)).html('<a id="resendEmail" class="btn btn-gray mr10" href="javascript:;">重新发送</a>');
                                /*163：http://mail.163.com/
                                 126：http://mail.126.com/
                                 yeah.net：http://www.yeah.net/
                                 QQ：mail.qq.com
                                 搜狐：mail.sohu.com
                                 新浪：mail.sina.com*/
                                if(domain=='sohu.com'||domain=='qq.com'||domain=='126.com'||domain=='163.com'){
                                    url='http://mail.'+domain+'/';
                                }else if(domain=='sina.com'||domain=='sina.cn'){
                                    url='http://mail.sina.com.cn/';
                                }else if(domain=='yeah.net'){
                                    url='http://www.yeah.net/';
                                }
                                if(url){
                                    $('.steps-btm', $(view)).append('<a class="btn btn-primary" target="_blank" href="'+url+'">去邮箱验证</a>');
                                }
                                $('#resendEmail').addClass("dis");
                                var step = 60;
                                _this.timer = setInterval(function () {
                                    if(step > 1){
                                        step--;
                                        $('#resendEmail').text('发送成功' + "（" + step + "）");
                                    }else{
                                        if(_this.timer){
                                            clearInterval(_this.timer);
                                            _this.timer = null;
                                        }
                                        $('#resendEmail').removeClass("dis").text('重新发送');
                                    }
                                }, 1000);
                                T.CaptchaToPhone({
                                    trigger : "#resendEmail",
                                    username: username,
                                    source : _this.codeSource[type],
                                    successTip: '发送邮件成功！',
                                    text: '重新发送'
                                });
                            }
                        });
                        $(view).undelegate('.pre', 'click').delegate('.pre', 'click', function(){
                            _this.goStep(_self.index-1, username);
                        });
                    }else if(selfType==2&&hasQuestion){ //安全问题
                        T.GET({
                            action: 'in_user/query_pwd_result',
                            params: {
                                user_name: username
                            },
                            success: function (data) {
                                if(data.protectResultList&&data.protectResultList.length>2){
                                    var data = data.protectResultList,
                                        arr = [];
                                    var num1 = Math.floor(Math.random()*data.length);
                                    arr.push(data.splice(num1, 1)[0]);
                                    var num2 = Math.floor(Math.random()*data.length);
                                    arr.push(data[num2]);
                                    view=T.Template('check_safetips', 'steps_content', {protectResultList: arr}, true);
                                    $(view).undelegate('.pre', 'click').delegate('.pre', 'click', function(){
                                        _this.goStep(_self.index-1, username);
                                    });
                                    T.FORM('check_safe_tips', CFG_FORM['check_safetips'], {
                                        before: function(){
                                            var _this = this,
                                                $answer1 = $('input[name=answer1]', $(view)),
                                                $answer2 = $('input[name=answer2]', $(view));
                                            var tips = $answer1.data('question')+'_'+ $.trim($answer1.val())+','+$answer2.data('question')+'_'+$.trim($answer2.val());
                                            _this.params.result_mark = tips;
                                            _this.params.type = '0';
                                            _this.params.user_name = username;
                                        }
                                        ,success: function (data, params) {
                                            _this.goStep(_self.index+1, {username:username,result_mark: params.result_mark});
                                        }
                                    });
                                }else{
                                    T.msg('安全问题数量为：'+data.protectResultList.length);
                                }
                            }
                        });
                    }
                },
                sendEmail: function(email, callback){
                    T.VCODE.init({username: email, source: _this.codeSource[type]}, function (data) {
                        if(callback){
                            callback();
                        }
                    }, function (data) {

                    });
                }
            };
            var step3 = {
                descText: '输入新密码',
                init: function(options){
                    if(!options.code&&!options.result_mark){
                        return;
                    }
                    var _self = this,
                        username = options.username||T._ACCOUNT;
                    if(type==1||type==2||type==6){
                        T.Template('change_pwd', 'steps_content', {flag:flag, type:type}, true);
                        T.FORM('set_pwd', CFG_FORM['set_pwd'], {
                            before: function(){
                                var _this = this;
                                _this.params.user_name = username;
                                _this.params.type = type==2?'1':'0';
                                _this.params.oper_type = '1';
                                if(options.code){
                                    _this.params.code = options.code;
                                }else{
                                    _this.params.result_mark = options.result_mark;
                                }
                            }
                            ,success: function (data) {
                                _this.goStep(_self.index+1);
                            }
                        });
                    }
                }
            };
            var step4 = {
                descText: flag==1?'设置成功':'修改成功',
                init: function(){
                    var sec = 5;
                    var view = T.Template('step_success', 'steps_content', {flag:flag}, true);
                    setInterval(function(){
                        if(sec>1){
                            sec--;
                            $('.yellow', $(view)).html(sec);
                        }else{
                            window.location = T.DOMAIN.WWW + 'member/safety.html';
                        }
                    }, 1000);
                }
            };
            if(flag==2){
                arr.push(step1, step2, step3, step4);
            }else if(flag==1) {
                arr.push(step2, step3, step4);
            }
            return arr;
        },
        /**
         * 将手机和邮箱变为130****5944和62*****74@qq.com形式
         * @param {String} str
         */
        toEllipsis: function(str){
            if(!str){
                return '';
            }
            if(T.RE.email.test(str)){
                var email = str,
                    domain = email.substr(email.indexOf('@')),
                    username = email.substr(0, email.indexOf('@'));
                if(username.length>4){
                    var tmp = username.substring(2,username.length-2);//邮箱保留邮箱用户名前2位和后2位
                    var ell = tmp.replace(/\S/g, '*');
                    username = username.replace(tmp, ell);
                    str = username + domain;
                }
            }else if(T.RE.mobile.test(str)){
                var tmp = str.substring(3,str.length-4);//手机号保留前3位和后4位
                var ell = tmp.replace(/\S/g, '*');
                str = str.replace(tmp, ell);
            }
            return str;
        },
        /**
         * 设置下拉框选项
         * @param {DOM} obj DOM对象
         * @param {Object} options 配置
         * @param {String} options.data 数据
         * @param {String} [options.key] 键
         * @param {String} [options.val] 值
         * @param {String} [options.value] 默认值
         * @param {Number} [options.len] 保留个数
         */
        setSelectOptions: function(obj, options){
            var option = null;
            if(!obj||!options||!options.data)return;
            obj.length = options.len||0;
            T.Each(options.data, function(o, item){
                if(options.key&&options.val){
                    option = new Option(item[options.val], item[options.key]);
                    if(item[options.key]===options.value)option.selected = 'selected';
                }else{
                    option = new Option(item||o, o);
                    if((item||o)===options.value)option.selected = 'selected';
                }
                obj.options.add(option);
            });
        }
    };
    //让其具备事件功能
    T.Mediator.installTo(Steps.prototype);
    return function(options){
        return new Steps(options);
    };
});