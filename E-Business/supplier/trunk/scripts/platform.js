!(function(window, document, undefined) {
    "use strict";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var platform = {
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            _this.render();
            _this.bindEvents();
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            $('#header_logout').on('click', function(){ //退出
                T.POST({
                    action: CFG.API.logout,
                    params: null,
                    success: function(){
                        _this.unCookie();
                        window.location.reload();
                    },
                    error: function(){
                        _this.unCookie();
                        window.location.reload();
                    }
                });
                setTimeout(function(){
                    _this.unCookie();
                    window.location.reload();
                },0);
            });
            $('#header_changepw').on('click', function(){ //修改密码
                var $view = T.Template('change_password', 'modal_content', {});
                $view.on('click', '.save', function(){
                    var headerPassword = $.trim($('#headerPassword').val()),
                        headerRepassword = $.trim($('#headerRepassword').val());
                    if(!T.RE.pwd.test(headerPassword)){
                        T.msg('请输入6~16位密码！');
                        return;
                    }
                    if(headerPassword != headerRepassword){
                        T.msg('两次输入的密码不一致！');
                        return;
                    }
                    _this.updatePassword();
                });
                $('#myModal').modal('show');
            });
        },
        /**
         * 渲染页面
         */
        render: function(){
            $('#supplier_username').text(T.Cookie.get('_a_name') || T.Cookie.get('_a_account'));
        },
        /**
         * 修改密码
         */
        updatePassword: function(){
            var _this = this;
            T.loading();
            T.POST({
                action: CFG.API.update_password,
                params: {
                    username: T.Cookie.get('a_account'),
                    password: $.trim($('#headerPassword').val())
                },
                success: function(res){
                    console.log(res);
                    T.loading('true');
                    T.msg('密码修改成功，下次登录请使用新密码！');
                    $('#myModal').modal('hide');
                },
                error: function(res){
                    console.log(res);
                }
            });
        },
        /**
         * 清除Cookie
         */
        unCookie : function(){
            T.Cookie.set('sid', "", { expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
            T.Cookie.set('_user_type', "", { expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
            T.Cookie.set('_a_account', "", { expires: -1, path: '/'});
            T.Cookie.set('_a_name', "", { expires: -1, path: '/'});
            T.Cookie.set('_a_status', "", { expires: -1, path: '/'});
        }
    };
    platform.init();
}(window, document));
