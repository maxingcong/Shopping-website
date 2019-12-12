require(["base", "tools"], function($, T){
    var Articles = T.Module({
        status: ['','',''],
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
            //大banner
            T.Advert({
                areaCode: "art",
                callback: function (data, params) {
                    _this.loaded(data, params, 0);
                },
                failure: function (data, params) {
                    _this.loaded(data, params, 0);
                }
            });
            _this.loadRecommend();
            _this.reload();
        },
        loadRecommend: function(){
            var _this = this;
            T.GET({
                action: 'in_app/article/best'
                ,params: null
                ,success: function (data, params) {
                    data.data = data.data || [];
                    T.Template('topic_list', data, true);
                    _this.loaded(data, params, 1);
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
                ,success: function (data, params) {
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
                    T.Template('article_list', data, true);
                    _this.loaded(data, params, 2);
                },failure: function(data){
                    console.log(data);
                }
            });
        },
        complete: function(){
            setTimeout(function(){
                MAKER.init();
            }, 1000);
        }
    });
    var MAKER = {
        init: function() {
            //生成静态页
            T.GenerateStaticPage({
                domain: T.REQUEST.w, //域名
                dirname: 'design/article', //目录名
                pageid: 'index', //文件名（页面名）
                keywords: {
                    "title": "云印设计说-分享印刷和设计最新的内容",
                    "keywords": "设计文章，设计说，设计，云印设计，名片设计，单页设计，展架设计，海报设计",
                    "description": "云印设计说-为您分享最新和最全的设计知识"
                },
                callback: function(domain, path, pageid, keywords) { //生成成功回调函数
                    T.ShowLinks();
                }
            });
        }
    };
    T.Loader(function () {
        new Articles;
    });
});