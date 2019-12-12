require(["base", "tools"], function($, T){
    var Home = T.Module({
        status: ["",""],
        init: function(){
            var _this = this;
            //大banner
            T.Advert({
                areaCode: "designer",
                callback: function (data, params) {debugger
                    _this.loaded(data, params, 0);
                },
                failure: function (data, params) {
                    _this.loaded(data, params, 0);
                }
            });
            _this.reload();
        },
        reload: function(){
            var _this = this;
            T.GET({
                action: 'in_product_new/designer_list'
                ,params: {}
                ,success: function (data, params) {
                    data._bk = _this.breakword;
                    T.Template('designer_list', data, true);
                    _this.loaded(data, params, 1);
                    T.PageLoaded();
                }
            });
        },
        breakword: function(str){
            return str?str.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '<br/>') :'';
        },
        complete: function(){
            var _this = this;
            _this.status =  ["",""];
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
                dirname: "design/designer", //目录名
                pageid: "index", //文件名（页面名）
                keywords: {
                    "title": "云印设计师_平面设计师_云印设计",
                    "keywords": "找平面设计师",
                    "description": "云印设计师平台为云印的平面设计师提供了个人展示的平台"
                },
                callback: function(domain, path, pageid, keywords) { //生成成功回调函数
                    T.ShowLinks();
                }
            });
        }
    };
    T.Loader(function () {
        new Home();
    });
});