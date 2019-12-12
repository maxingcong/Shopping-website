require(["base", "tools"], function($, T){
    var detail = {
        id: '',
        params: T.getRequest()||{},
        init: function(data){
            var _this = this;
            T.Each(_this.params, function(k, v){
                _this.params[k] = _this.decodeURI(v);
            });
            _this.login();
            _this.browse(detail.id);
            //绑定QQ客服
            T.BindQQService();
            //页签切换
            $("#tabs").delegate("a.tab", "click", function(e){
                _this.tabSwitchover($(this) ,e);
            });
            //点击链接时授权
            /*$(document).delegate("a[href]", "click", function(e){
             var $this = $(this);
             var backurl = $this.attr("href")||"";
             if(backurl&&backurl!="javascript:;"&&$this.attr("id")!="qqservice"&&backurl.indexOf("www.cnzz.com")<0){
             e.preventDefault();
             if(backurl){
             backurl = T.DOMAIN.WWW+(backurl.replace(T.DOMAIN.WWW, ""));
             //_this.login(backurl);
             if(location.search.length>1){
             _this.openToRedirectURI(T.DOMAIN.WWW+"oauth/58auth.html"+location.search+"&backurl="+encodeURIComponent(backurl));
             }else{
             _this.openToRedirectURI(backurl);
             }
             }
             return false;
             }
             });
             T.PageLoaded();*/
        },
        tabSwitchover: function($this, e){//页签切换
            if(!$this.length)return;
            var index = $this.data("index")||0;
            if(typeof(index)!="number")return;
            $this.addClass("sel").siblings("a.tab").removeClass("sel");
            $(".plist").hide();
            $("#tab_view_"+index).show();
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
            if(_this.params.userid){
                params.source = 3;
                params.userid = _this.params.userid;
                params.phone = "";
                if(_this.params.phone!=null){
                    params.phone = _this.params.phone;
                }
                params.username = params.phone;
                if(_this.params.realname!=null){
                    params.realname = _this.params.realname;
                }
                if(_this.params.entaddress!=null){
                    params.entaddress = _this.params.entaddress;
                }
                if(_this.params.entname!=null){
                    params.entname = _this.params.entname;
                }
                if(_this.params.checkcode!=null){
                    params.checkcode = _this.params.checkcode;
                }
                T.POST({
                    action: "in_user/login",
                    params: params,
                    success: function (data, params) {
                        params = params||{};
                        T.SetCookie(data, params);
                        T.cookie("_security_user", "58"); //登录方式
                        _this.loaded(data);
                        //_this.openToRedirectURI(backurl);
                    }, failure: _this.loaded, error: _this.loaded
                }, _this.loaded, _this.loaded);
            }else{
                _this.loaded(null);
            }
        },
        loaded: function(data){
            $("body").removeClass("load");
        },
        openToRedirectURI: function(uri){
            top.window.open(uri, "", "height="+window.screen.availHeight +",width="+window.screen.availWidth+",top=0,left=0,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,location=yes,status=yes,channelmode=yes");
        },
        browse: function(id){
            if(!id)return;
            T.POST({
                action:'in_feedback/browse_activity'
                ,params: {id: id}
                ,success: function(data){}
                ,failure: function(data){}
                ,error: function(data){}
            },function(data){},function(data){});
        }
    };
    T.Loader(function(){
        var local = location.href.substring(0,location.href.indexOf('.html'));
        detail.id = local.substring(local.lastIndexOf('/')+2)||'';
        if(detail.id){
            detail.init();
        }
    });
});