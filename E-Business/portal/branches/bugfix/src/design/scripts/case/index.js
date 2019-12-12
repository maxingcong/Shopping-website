require(["base", "tools", "modules/case_list"], function ($, T, CaseList) {
    var List = T.Module({
        isLoading: false,
        data: {
            design_category_id: '', //设计类型Id
            industry_id: '', //行业Id
            order_by: '', //排序字段
            order_by_type: 'desc', //排序方式
            index: 1, //当前页码
            offset: 16 //每页条数
        },
        init: function(){
            var _this = this;
            _this.$cont = $('#template-case_list-view');
            T.Template('filter_list', {}, true);
            _this.getCaseList(true);
            _this.bindEvents();
        },
        bindEvents: function(){
            var _this = this;
            $('#template-filter_list-view').on('click', ".design a", function(){
                _this.data.design_category_id = $(this).data('category_id')||'';
                _this.data.index = 1;
                $(this).addClass('sel').siblings().removeClass('sel');
                _this.getCaseList();
            }).on('click', '.industry a', function(){
                _this.data.industry_id = $(this).data('industry_id')||'';
                _this.data.index = 1;
                $(this).addClass('sel').siblings().removeClass('sel');
                _this.getCaseList();
            });
            $('.filter-bar').on('click', 'a', function(){
                _this.data.order_by = $(this).data('order_by')||'';
                _this.data.index = 1;
                $(this).addClass('sel').siblings().removeClass('sel');
                _this.getCaseList();
            });
            $(window).scroll(function () {
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height();
                var windowHeight = $(this).height();
                if (scrollTop + windowHeight == scrollHeight) {
                    if(!_this.isLoading){
                        //滚动条到底部触发
                        _this.data.index += 1;
                        _this.getCaseList(false, true);
                    }
                }
            });
        },
        getCaseList: function(isFirst, isScroll){
            var _this = this;
            var params = {};
            params = T.Inherit(params, _this.data);
            params.index = String((_this.data.index-1)*_this.data.offset); //起始位置
            if(isScroll){
                _this.$cont.addClass('loading-more');
            }
            _this.isLoading = true;
            T.GET({
                action: 'in_product_new/production_list'
                ,params: params
                ,success: function(data){
                    console.log(data);
                    data.productionList = data.productionList||[];
                    if(!isScroll){
                        if(isFirst){
                            T.Template('filter_list', data, true);
                        }
                        if(!_this.caseListObj){
                            _this.caseListObj = CaseList({data: data.productionList});
                        }else{
                            _this.caseListObj.render(data.productionList);
                        }
                    }else{
                        if(data.productionList.length<1){
                            _this.data.index -= 1;
                        }
                        setTimeout(function(){
                            _this.$cont.removeClass('loading-more');
                            _this.caseListObj.addItems(data.productionList);
                        }, 500);
                    }
                    _this.isLoading = false;
                }
                ,failure: function(data){
                    console.log(data);
                    _this.isLoading = false;
                }
            });
        }
    });
    T.Loader(function(){
        new List();
    });
});