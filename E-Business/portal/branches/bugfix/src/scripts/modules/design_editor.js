define(["base", "tools", "modules/card", "modules/card_template", "designer"], function($, T, Card, CardTemplate, Designer){
    function DesignEditor(options){debugger
        this.init(options||{});
    }
    DesignEditor.prototype = {
        card: Card(),
        designer: {}, //设计器
        cardTemplate: CardTemplate(),
        init: function (options) {
            var _this = this,
                opts = options||{};
            _this.options = opts;
            if(opts.cardId){
                _this.card.getTempDetail(opts.cardId, function(data, params){
                    opts.success && opts.success(data, params);
                    _this.load(data);
                }, function(data, params){
                    if(opts.failure){
                        opts.failure(data, params);
                    }else{
                        T.msg("名片信息不存在，请选择其他名片！");
                    }
                });
            }else if(opts.templateId){
                _this.cardTemplate.getDetail(opts.templateId, function(data, params){
                    opts.success && opts.success(data, params);
                    _this.load(data);
                }, function(data, params){
                    if(opts.failure){
                        opts.failure(data, params);
                    }else{
                        T.msg("模板信息不存在，请选择其他模板！");
                    }
                });
            }
        },
        load: function(data){
            var _this = this,
                opts = _this.options||{};
            data.json =  T.Typeof(data.propertiesJson, /Object/) ? data.propertiesJson : T.JSON.parse(data.propertiesJson)
            if(!data.json)return;
            if(!opts.cont){
                var uuid = T.UUID();
                opts.cont = "#" + uuid;
                _this.popup = new T.Popup({
                    width: 1220,
                    zIndex: 1500,
                    title: opts.editable?"编辑名片信息":"查看名片信息",
                    type: "html",
                    content: '<div id="' +uuid+ '" class="designer designer_load"></div>',
                    ok: "",
                    no: ""
                });
            }
            $(opts.cont).html(_this.getContent(data));
            _this.designer = Designer({
                container: opts.cont,
                editable: opts.editable,
                save: function(params){
                    if(_this.popup && _this.popup.remove){
                        _this.popup.remove();
                    }
                    if(data.cardId){
                        params.cardId = data.cardId;
                    }
                    _this.save(params);
                },
                data: data.json,
                callback: function(){
                    if(_this.popup && _this.popup.setPosition){
                        _this.popup.setPosition();
                    }
                }
            });
        },
        /**
         * 获取编辑器数据
         */
        getData: function () {
            var _this = this;
            if(_this.designer){
                return _this.designer.data;
            }
        },
        save: function (json) {
            var _this = this,
                opts = _this.options||{};
            if(!json.cardId)T.loading(false, 200, "小in正在帮您生成名片，请耐心等候哟...");
            T.POST({
                action: "in_order/make_card",
                params: {
                    template_id: json.templateId,
                    card_json: json,
                    card_id: json.cardId ? json.cardId : ""
                },
                success: function (data, params) {
                    T.loading(true);
                    data.cardList = data.cardList||[];
                    var card = data.cardList[0]||{};
                    if(_this.popup && _this.popup.remove){
                        _this.popup.remove();
                    }
                    _this.card.getDetail(params.card_id, function(data, params){
                        opts.save && opts.save(data, params);
                    }, function(data, params){
                        if(opts.failure){
                            opts.failure(data, params);
                        }else{
                            T.msg(data.msg||T.TIPS.DEF);
                        }
                    });
                },
                failure: function(data){
                    T.loading(true);
                    T.msg(data.msg||T.TIPS.DEF);
                }
            }, function(data){
                T.loading(true);
                T.msg(data.msg||T.TIPS.DEF);
            }, function(data){
                T.loading(true);
                T.msg(data.msg||T.TIPS.DEF);
            });
        },
        getContent: function(data) {
            var _this = this,
                opts = _this.options||{};
            return '<div class="dbody clearfix">\
						<div class="dedit">\
							<dl class="dtexts"></dl>\
						</div>\
						<div class="dview clearfix"></div>\
					</div>\
					'+(opts.editable?(data.cardId?'<div class="dfoot"><a class="btn btn-primary save" href="javascript:;">保 存</a><a class="btn btn-default" href="javascript:;">取 消</a></div>':''):'<div class="d-alt red">如果您需要制作其他人的名片，请<a href="'+T.DOMAIN.WWW+'card/index.html#1" target="_blank">使用模板生成名片</a>。</div>');
        }
    };
    //让具备事件功能
    T.Mediator.installTo(DesignEditor.prototype);
    return function(options){
        return new DesignEditor(options);
    };
});
