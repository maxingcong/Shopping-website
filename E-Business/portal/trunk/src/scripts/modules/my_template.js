define(["base", "tools"], function($, T){
    //我的专属模板
    function MyTemplate(){}
    MyTemplate.prototype = {
        PAGIN: {type:'0', owner_type:'1', offset: 0, count: 2},
        reload: function(params, isFirst, callback, product){
            var _this = this;
            _this.PAGIN = params||_this.PAGIN;
            T.GET({
                action: CFG_DS.template.get
                ,params: params||_this.PAGIN
                ,success: function (data) {
                    data.designTemplateList = data.designTemplateList||[];
                    if (data.designTemplateList&&data.designTemplateList.length>_this.PAGIN.count) {
                        data.count = data.designTemplateList.length;
                        data.designTemplateList = data.designTemplateList.slice(_this.PAGIN.offset,_this.PAGIN.offset+_this.PAGIN.count);
                    }
                    var _data = T.FormatData(data||{});
                    _data.design_template_list = _data.design_template_list||[];
                    _data.product = product||{};
                    _this.data = _data.design_template_list;
                    _data.order_code = _this.PAGIN.orderCode;
                    T.Template('design_template_list', _data);
                    if(_this.PAGIN.count){
                        T.Paginbar({
                            num: 3,
                            size: _this.PAGIN.count,
                            total: Math.ceil(_data.count / _this.PAGIN.count),
                            index: Math.ceil(_this.PAGIN.offset/_this.PAGIN.count)+1,
                            paginbar: 'paginbar_design_template_list',
                            callback: function(obj, index, size, total){
                                _this.pagin(obj, index, size, total);
                            }
                        });
                    }
                    if(callback)callback.call(_this);
                    //T.PageLoaded();
                }
            });
        },
        pagin: function (obj, index, size, total) {
            var _this = this;
            _this.PAGIN.offset = (index-1)*_this.PAGIN.count;
            _this.reload(_this.PAGIN);
        }
    };
    return MyTemplate;
});
