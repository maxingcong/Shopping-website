require(["base", "tools"], function($, T){
    var articles = {
        isLoading: false,
        PAGIN: {
            page: 1, //当前页码
            rows: 8, //每页条数
            sort_type: '1' //排序字段
        },
        storage : T.Storage({
            key: "ininin_article_view"
        }),
        init: function() {
            var _this = this;
            _this.$cont = $('#template-article_list-view');
            _this.loadRecommend();
            _this.reload();
            _this.bindEvents();
        },
        bindEvents: function(){
            var _this = this;
            $('.designsay').on('click', '.filter-bar a:not(.sel)', function(){
                $(this).addClass('sel').siblings('a').removeClass('sel');
                _this.PAGIN.sort_type = $(this).data('type');
                _this.PAGIN.page = 1;
                _this.reload();
            });
            $(window).scroll(function () {
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height();
                var windowHeight = $(this).height();
                if (scrollTop + windowHeight == scrollHeight) {
                    if(!_this.isLoading){
                        //滚动条到底部触发
                        _this.PAGIN.page += 1;
                        _this.reload(true);
                    }
                }
            });
        },
        /**
         * 添加条目
         */
        addItems: function(data){
            if(!data){
                return;
            }
            var _this = this;
            if(data.length>0){
                var str = T.Compiler.template("template-article_list", {data: data});
                _this.$cont.append(str);
            }
        },
        loadRecommend: function(){
            T.GET({
                action: 'in_app/article/best'
                ,params: null
                ,success: function (data) {
                    debugger
                    data.data = data.data || [];
                    T.Template('topic_list', data, true);
                },failure: function(data){
                    console.log(data);
                }
            });
        },
        reload: function(isScroll){
            var _this = this;
                /*params = {};
            params = T.Inherit(params, _this.PAGIN);*/
            //params.page = String((_this.PAGIN.page-1)*_this.PAGIN.rows); //起始位置
            if(isScroll){
                _this.$cont.addClass('loading-more');
            }
            _this.isLoading = true;
            T.GET({
                action: 'in_app/article/designsay'
                ,params: _this.PAGIN
                ,success: function (data) {
                    debugger
                    data.data = data.data||[];
                    T.Each(data.data, function(index, v){
                        var describe = v.describe || '';
                        describe = T.GetEllipsis(describe, 100);
                        v.simpleDescribe = describe;
                        v.createTimeFormat = new Date(v.createTime).Format();
                        if(_this.storage.has(v.objectId)){
                            v.isViewed = true;
                        }
                    });
                    if(!isScroll){
                        T.Template('article_list', data, true);
                    }else{
                        if(data.data.length<1){
                            _this.PAGIN.page -= 1;
                        }
                        setTimeout(function(){
                            _this.$cont.removeClass('loading-more');
                            _this.addItems(data.data);
                        }, 500);
                    }
                    _this.isLoading = false;
                },failure: function(data){
                    console.log(data);
                    _this.isLoading = false;
                }
            });
        }
    };
    articles.init();
});