define("modules/card_template", ["base", "tools"], function($, T){
    function CardTemplate(options){
        this.init(options||{});
    }
    CardTemplate.prototype = {
        data: {},
        params: {
            type:'0',
            owner_type:'1',
            offset: 0,
            count: 6
        },
        $cont: $("#card"),
        init: function (options, isEvent) {
            var _this = this;
            _this.events();
        },
        /**
         * 获取名片列表
         * @param params
         */
        load: function (params) {
            var _this = this;
            _this.params = params||_this.params;
            T.GET({
                action: "in_order/query_design_template",
                params: _this.params,
                success: function (data) {debugger
                    data.templateList = data.designTemplateList||[];
                    if(data.templateList && data.templateList.length>_this.params.count){
                        data.count = data.templateList.length;
                        data.templateList = data.templateList.slice(_this.params.offset, _this.params.offset + _this.params.count);
                    }
                    _this.data.templateList = data.templateList;
                    var view = T.Template("template_list", data, true);
                    $(view).removeClass("load");
                    if(_this.params.count){
                        T.Paginbar({
                            num: 3,
                            size: _this.params.count,
                            total: Math.ceil(data.count / _this.params.count),
                            index: Math.ceil(_this.params.offset/_this.params.count)+1,
                            paginbar: "paginbar_template_list",
                            callback: function(obj, index, size, total){
                                _this.params.offset = (index-1)*_this.params.count;
                                _this.load();
                            }
                        });
                    }
                    _this.trigger("loaded", data);
                }
            });
        },
        /**
         * 根据模板ID查询模板详情
         * @param templateId
         */
        getDetail: function (templateId, success, failure) {
            var _this = this;
            T.GET({
                action: "in_order/query_design_template",
                params: {
                    type:'0',
                    owner_type:'1',
                    template_id: templateId
                },
                success: function (data, params) {
                    data.designTemplateList = data.designTemplateList||[];
                    var temp = data.designTemplateList[0]||{};
                    if(temp.templateId){
                        if(!/^http/.test(temp.excelUrl)){
                            temp.excelUrl = T.DOMAIN.CLOUD + temp.excelUrl;
                        }
                        success && success(temp, params);
                    }
                },
                failure: function(data, params){
                    failure && failure(data, params);
                }
            });
        },
        rename: function(templateId){
            var _this = this;
            var temp = T.Array.get(_this.data.templateList, templateId, 'templateId');
            if(!temp)return;
            _this.popup = new T.Popup({
                width: 480,
                title: "编辑模板名称",
                type: "html",
                content: T.Compiler.template("template-rename", temp),
                ok: "保 存",
                no: "取 消",
                callback: function(){
                    T.FORM().placeholder(T.DOM.byId("template_name"), "请填写模板名称");
                }
            });
            _this.popup.on("ok", function(_o){
                var templateName = $("#template_name").val();
                if(templateName){
                    _this.save(templateId, templateName);
                }else{
                    T.msg("请填写模板名称");
                }
            });
        },
        save: function(templateId, templateName){
            var _this = this;
            if(!templateId||!templateName)return;
            T.POST({
                action: "in_order/design_template_rename",
                params: {
                    template_id: templateId,
                    template_name: templateName
                },
                success: function (data) {debugger
                    T.msg("保存成功。");
                    if(_this.popup && _this.popup.remove){
                        _this.popup.remove();
                        _this.popup = null;
                    }
                    _this.load();
                }
            });
        },
        events: function(){
            var _this = this;
            _this.$cont.off("click.rename").on("click.rename", ".template-list .edit", function(e){
                var $card = $(this).closest(".card");
                _this.rename($card.data("template_id")||"");
                return false;
            });
        }
    };
    //让具备事件功能
    T.Mediator.installTo(CardTemplate.prototype);
    return function(options){
        return new CardTemplate(options);
    };
});