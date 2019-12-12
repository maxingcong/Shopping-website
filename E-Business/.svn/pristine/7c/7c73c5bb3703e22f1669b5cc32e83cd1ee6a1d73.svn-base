require(["base", "tools", "location"], function ($, T, PCD) {
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    var uinfo = {
        MAP: null,
        myGeo: null,
        marker: null,
        data: null,
        ep_purpose: [],
        formOrg: $("#info_org_form"),
        init: function (data) {
            if (!data) return;
            data.user_name = T._ACCOUNT;
            uinfo.data = data = T.FormatData(data||{});
            uinfo.data.address = PCD.parseValue(uinfo.data.ep_address).address;
            T.BindData('ent', uinfo.data);
            uinfo.checked(data);
            var pca = data.ep_address;
            PCD.initSelect('address', pca);
            T.FORM('info_org_form', CFG_FORM['user_info'], {
                before: function(){
                    var _this = this;
                    _this.data = uinfo.data;
                    _this.params.ep_address = _this.params.province+'^'+_this.params.city+'^'+_this.params.area+'^'+_this.params.address;
                    if(_this.params.address&&_this.params.ep_name&&_this.data.user_type!=1){
                        _this.params.user_type = '1';
                    }else{
                        delete _this.params.user_type;
                    }
                }
                ,success: function (o, params) {
                    uinfo.data = T.Inherit(uinfo.data, params);
                    if(params.hasOwnProperty('ep_name')){
                        if(T._STORE){
                            var _UINFO = T._USERKEY?T.JSON.parse(T.cookie(T._USERKEY)||'{}'):{};
                            _UINFO.userName = _UINFO.account||'';
                            _UINFO.nickName = params.ep_name||'';
                            T.SetCookie(_UINFO);
                        }else{
                            if(params.ep_name){
                                $("#user_name").text(params.ep_name).attr("title",params.ep_name);
                            }else{
                                $("#user_name").text(T._ACCOUNT).attr("title",T._ACCOUNT);
                            }
                            T.cookie("_nickname",params.ep_name||"", {expires: 100*365, path: '/'});
                        }
                    }
                    T.msg("修改成功。");
                }
            });
            $("input[name='ep_address']").val(data.ep_address.substring(data.ep_address.lastIndexOf('^')+1));
            uinfo.bindEvents();
        },
        bindEvents: function(){
            uinfo.formOrg.on('click', '.radio', function(){
                $(this).addClass('sel').siblings('.radio').removeClass('sel');
                $(this).nextAll('input').val($(this).data('value'));
            }).on('click', '.checkbox', function(){
                $(this).toggleClass('sel');
                if($(this).hasClass('sel')){
                    T.Array.add(uinfo.ep_purpose, $(this).data('value'));
                }else{
                    T.Array.remove(uinfo.ep_purpose, $(this).data('value'), 'purpose');
                }
                $(this).nextAll('input').val(uinfo.ep_purpose.join(','));
            });
        },
        checked: function(data){
            if(data.sex==0||data.sex==1){
                $('#link_sex .radio').each(function(index, domEle){
                    if($(domEle).data('value')==data.sex){
                        $(domEle).addClass('sel');
                        return false;
                    }
                });
            }
            if(data.ep_trade){
                $('#company_trade .radio').each(function(index, domEle){
                    if($(domEle).data('value')==data.ep_trade){
                        $(domEle).addClass('sel');
                        return false;
                    }
                });
            }
            if(data.ep_person_sum){
                $('#company_personsum .radio').each(function(index, domEle){
                    if($(domEle).data('value')==data.ep_person_sum){
                        $(domEle).addClass('sel');
                        return false;
                    }
                });
            }
            if(data.ep_purpose){
                uinfo.ep_purpose = data.ep_purpose.split(',');
                var ep_purpose = uinfo.ep_purpose;
                for(var i= 0,l=ep_purpose.length;i<l;i++){
                    $('#company_purpose .checkbox').each(function(index, domEle){
                        if($(domEle).data('value')==ep_purpose[i]){
                            $(domEle).addClass('sel');
                            return false;
                        }
                    });
                }
            }
        }
    };
    T.Loader(function() {
        T.GET({
            action: CFG_DS.udetail.get
            ,success: function (data) {
                uinfo.init(data);
                T.PageLoaded();
            }
            ,failure: function(data){
                T.alt(data.msg|| T.Tips.DEF, function(_o){
                    _o.remove();
                });
            }
        });
    });
});