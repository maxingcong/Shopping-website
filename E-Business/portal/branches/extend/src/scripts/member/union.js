require(["base", "tools", "oauth/sina", "oauth/login"], function($, T, OAuthSina, OAuthLogin){
    if (!T._LOGED) T.NotLogin();
    /**
     * link_type
     * 1 - QQ
     2 - 微信
     3 – 新浪
     4 – 人人网
     5 – 豆瓣
     */
    var oauthLogin, UnionBind = {
        data: {
            unionList: [{
                flag: "sina",
                linkType: 3,
                linkName: "新浪微博",
                hasBind: false
            },{
                flag: "qq",
                linkType: 1,
                linkName: "腾讯QQ",
                hasBind: false
            },{
                flag: "wechat",
                linkType: 2,
                linkName: "微信",
                hasBind: false
            }],
            isBindSina: false,
            isBindQQ: false,
            isBindWechat: false
        },
        $cont: $("#template-union-view"),
        init: function(){
            var _this = this;
            _this.load();
            _this.events();
            oauthLogin = OAuthLogin();
            oauthLogin.on("success", function(data){
                T.msg("绑定成功");
                _this.load();
            }).on("failure", function(data){
                _this.load();
            });
        },
        /**
         * 查询绑定结果
         */
        load: function(){
            var _this = this;
            //link_type,link_key(不传参数查询当前登录用户所有)
            T.GET({
                action: "in_user/link_query",
                success: function (data) {
                    _this.data.isBindQQ = false;
                    _this.data.isBindWechat = false;
                    _this.data.isBindSina = false;
                    T.Each(_this.data.unionList, function(i, union){
                        union.hasBind = false;
                        T.Each(data.list, function(k, item){
                            if(item.linkType==union.linkType && item.loginFlag==1){
                                union.hasBind = true;
                                if(item.linkType==1){
                                    _this.data.isBindQQ = true;
                                }
                                if(item.linkType==2){
                                    _this.data.isBindWechat = true;
                                }
                                if(item.linkType==3){
                                    _this.data.isBindSina = true;
                                }
                            }
                        });
                    });
                    T.Template("union", _this.data, true);
                    T.PageLoaded();
                    if(!_this.data.isBindQQ){
                        T.OAuth.qq("union_bind-qq");
                    }
                    if(!_this.data.isBindWechat){
                        T.OAuth.wechat("union_bind-wechat");
                    }
                    if(!_this.data.isBindSina){
                        _this.oauthSina();
                    }
                }
            });
        },
        /**
         * 新浪微博联合绑定
         */
        oauthSina: function(){
            var _this = this;
            var oauthSina = OAuthSina({
                btnId: "union_bind-sina"
            });
            oauthSina.on("success", function(data){
                if (data && data.openid) {
                    oauthLogin.bind(data);
                }
            });
        },
        unbind: function(union){
            var _this = this;
            T.GET({
                action: "in_user/link_delete",
                params: {
                    link_type: union.linkType
                },
                success: function (data) {
                    T.msg("解绑成功");
                    _this.load();
                }
            });
        },
        events: function(){
            var _this = this;
            _this.$cont.on("click", ".oper", function(e){
                var index = $(this).closest(".item").data("index");
                var union = _this.data.unionList[index];
                if(index>=0 && union && union.hasBind){
                    _this.unbind(union);
                }else{

                }
            });
        }
    };
    T.Loader(function(){
        UnionBind.init();
    });
});