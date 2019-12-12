require(["base", "tools"], function ($, T) {
    var feedback = {
        init: function(){
            T.FORM('feedback', CFG_FORM['feedback'], {
                before: function(){
                    var _this = this;
                    if (!T._LOGED) {
                        T.LoginForm();
                        _this.action = '';
                    }
                    //_this.params.to = 'service@ininin.com';//接收者
                    //_this.params.from = T._ACCOUNT||'';//发送者
                    _this.params.message_type = '2';
                    _this.params.priority_level = '3';
                    _this.params.deal_result = '0';
                    _this.params.user_account = T._ACCOUNT||'';//用户帐号
                    _this.params.submit_person = T._ACCOUNT||'云印电商';//提交人/来源
                }
                ,success: function (data) {
                    T.alt("提交成功",function(_this){
                        _this.remove();
                        window.location.reload();
                    },function(_this){
                        window.location.reload();
                    });
                }
            });
            T.PageLoaded();
        }
    };
    T.Loader(function(){
        feedback.init();
    });
});