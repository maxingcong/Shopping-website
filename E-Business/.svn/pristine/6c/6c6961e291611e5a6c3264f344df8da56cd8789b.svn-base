//http://alpha.ininin.com/oauth/tianan_cyber.html?user_id=Zjg5OTcwMGI1NDA5N2MyOTAxNTQwOTg2NDZhYjAwMDE=&username=MTg1NzY3Nzg3MjE=&name=u7nIww==&tel=MTg1NzY3Nzg3MjE=&ent_address=&ent_name=uLu0urnoucjNttfKucm33dPQz965q8u+&checkcode=7ac6719baa76f5083ce7e8fc029e9562&redirect_uri=http%3A%2F%2Fwww.ininin.com%2Fproduct%2F200037.html
//http://alpha.ininin.com/oauth/xzlm.html?v=2&username=YWFh&tel=MQ%3d%3d&ent_address=MQ%3d%3d&ent_name=MQ%3d%3d&name=MQ%3d%3d&checkcode=38ea8dbeeb9df6d525e38d90ff6bb5a0
/*
redirect_uri：重定向地址
*/
define("oauth", ["base", "tools"], function ($, T) {
    return {
        data: {
            source: "", //登录来源
            securityUser: "" //登录方式
        },
        params: T.getRequest()||{},
        init: function(options){debugger
            var _this = this,
                opts = options||{};
            _this.data.source = opts.source;
            _this.data.securityUser = opts.securityUser;
            if(_this.data.source && _this.data.securityUser){
                T.Each(_this.params, function(k, v){
                    _this.params[k] = _this.decodeURI(v);
                });
                _this.login();
            }else{
                _this.loaded(null);
            }
        },
        decodeURI: function(value){
            var _value = "";
            try{
                _value = decodeURIComponent(value);
            }catch(e){}
            return _value;
        },
        login: function() {
            var _this = this;
            var params = {};

            params.source = _this.data.source;
            params.userid = _this.params.user_id; //用户的唯一标记符
            params.username = _this.params.username; //用户手机或者邮箱
            params.checkcode = _this.params.checkcode; //校验码

            if(_this.params.name!=null){
                params.realname = _this.params.name; //联系人
            }
            if(_this.params.tel!=null){
                params.tel = _this.params.tel; //固定电话
            }
            if(_this.params.ent_address!=null){
                params.entaddress = _this.params.ent_address; //企业地址
            }
            if(_this.params.ent_name!=null){
                params.entname = _this.params.ent_name; //企业名称
            }debugger
            var checkCode = T.MD5((params.userid||"") + (params.username||"") + (params.realname||"") + (params.tel||"") + (params.entaddress||"") + (params.entname||""));
            if(params.username && params.checkcode){
                T.POST({
                    action: "in_user/login",
                    params: params,
                    success: function (data, params) {
                        params = params||{};
                        T.SetCookie(data, params);
                        T.cookie("_security_user", _this.data.securityUser); //登录方式
                        _this.loaded(data);
                    }, failure: _this.loaded, error: _this.loaded
                }, _this.loaded, _this.loaded);
            }else{
                _this.loaded(null);
            }
        },
        loaded: function(data){debugger
            var _this = this;
            location.replace(_this.params.redirect_uri||T.DOMAIN.WWW);
        }
    };
});