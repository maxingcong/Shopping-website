define("modules/card", ["base", "tools"], function($, T){
    function Card(options){
        this.init(options||{});
    }
    Card.prototype = {
        params: {
            is_design: '1,2',
            index: 0,
            offset: 20
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
        load: function(params){
            var _this = this;
            _this.params = params||_this.params;
            T.GET({
                action: "in_user/card_query",
                params: _this.params,
                success: function (data) {
                    data.cardList = data.cardList||[];
                    data.count = data.total||data.cardList.length;
                    var view = T.Template("card_list", data, true);
                    $(view).removeClass("load");
                    if(_this.params.offset){
                        T.Paginbar({
                            num: 3,
                            size: _this.params.offset,
                            total: Math.ceil(data.count / _this.params.offset),
                            index: _this.params.index/_this.params.offset + 1,
                            paginbar: "paginbar_card_list",
                            callback: function(obj, index, size, total){
                                _this.params.index = _this.params.offset * (index - 1);
                                _this.load();
                            }
                        });
                    }
                    _this.trigger("loaded", data);
                }
            });
        },
        /**
         * 根据名片ID查名片详情
         * @param cardId
         */
        getDetail: function (cardId, success, failure) {
            var _this = this;
            T.GET({
                action: "in_user/card_query",
                params: {
                    card_id: cardId
                },
                success: function (data, params) {
                    data.cardList = data.cardList||[];
                    var card = data.cardList[0]||{};
                    if(card.cardId && card.templateId){
                        success && success(card, params);
                    }
                },
                failure: function(data, params){
                    failure && failure(data, params);
                }
            });
        },
        /**
         * 根据名片ID查询设计模板详情
         * @param cardId
         */
        getTempDetail: function (cardId, success, failure) {
            var _this = this;
            T.GET({
                action: "in_order/query_design_template_for_design",
                params: {
                    card_id: cardId
                },
                success: function (data, params) {
                    data.data = data.data||{};
                    if(data.cardId && data.templateId){
                        success && success({
                            cardId: data.cardId,
                            templateId: data.templateId,
                            propertiesJson: data.data
                        }, params);
                    }
                },
                failure: function(data, params){
                    failure && failure(data, params);
                }
            });
        },
        events: function(){
            var _this = this;
        }
    };
    //让具备事件功能
    T.Mediator.installTo(Card.prototype);
    return function(options){
        return new Card(options);
    };
});