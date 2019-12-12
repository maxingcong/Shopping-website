require(["base", "tools", "modules/case_list"], function($, T, CaseList){

    var Designer = {
        $cont: $('#template-case_list-view'),
        caseDom: '',
        dId: '',
        PAGIN: {
            index: 0, 
            offset: 9, 
            order_by: '',
            order_by_type: 'desc' //desc 默认降序 
        },
        init: function(id) {
            this.dId = id;
            this.reload();
            this.bindEvents();
        },
        reload: function(partRender){
            var _this = this;
            if(typeof _this.dId == 'undefined') {
                return;
            }else{
                _this.PAGIN['designer_id'] = _this.dId;
            }
            _this.isLoading = true;
            T.GET({
                action: 'in_product_new/designer_home'
                ,params: _this.PAGIN
                ,success: function (data) {
                    data.productionList = data.productionList||[];
                    if(!partRender){
                        if (data.designer) {
                            T.Template('designer_detail', data.designer, true);//设计师详情
                            T.Slider({
                                cont: "#figure_list",
                                direction: "lr",
                                autoplay: true
                            });
                            T.Template('design_items', data, true); //设计师项目列表
                            _this.caseDom = CaseList({data: data.productionList}); //案例列表
                            
                        }else{
                            T.alt('设计师不存在', function() {
                                location.replace('./index.html');
                            });
                        }
                        T.PageLoaded();
                    }else{debugger //部分更新
                        partRender(data);
                    }
                    _this.isLoading = false;
                    _this.PAGIN.index += Math.min(data.productionList.length, _this.PAGIN.offset);//下次查询的起始位置
                }
                ,failure: function(data) {
                    T.alt(data.msg||'设计师不存在', function() {
                        location.replace('./index.html');
                    });
                }
            });
        },
        bindEvents: function() {
            var _this = this;
            $('#design-projects').on('click', '.filter-bar a', function() {
                _this.PAGIN.index = 0;//置0
                _this.PAGIN.order_by = $(this).data('order_by');
                $(this).addClass('sel').siblings('a').removeClass('sel');
                _this.reload(function(data){
                    _this.caseDom = CaseList({data: data.productionList});
                })
            });
            $(window).on('scroll', function () {
                var winS = $(window).scrollTop();
                var docH = $(document).height();
                var winH = $(window).height();
                if (winS + winH >= docH) {
                    if(!_this.isLoading){ //滚动条到底部触发
                        _this.$cont.addClass('loading-more');
                        _this.reload(function(data){debugger
                            setTimeout(function(){
                                //T.Template('design_items', data, true);
                                _this.$cont.removeClass('loading-more');
                                _this.caseDom.addItems(data.productionList);
                            },300);
                        });
                    }
                }
            });
        }
    }
    T.Loader(function(){
        var local = location.href.substring(0, location.href.indexOf(".html"));
        Designer.init(local.substring(local.lastIndexOf("/")+1)||"");
    });
});