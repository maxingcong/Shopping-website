require(["base", "tools", "modules/floor"], function($, T, Floor){
    var Home = T.Module({
        status: [""],
        init: function(){
            var _this = this;
            //楼层
            Floor({
                params: {
                    floorType: "4"
                }
            }).loadFloorList(function(data, params){
                _this.loaded(data, params, 0);
            });
        },
        complete: function(){
            var _this = this;
            _this.status =  [""];
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
                dirname: '', //目录名
                pageid: "fliggy/index", //文件名（页面名）
                keywords: {
                    "title": "",
                    "keywords": "",
                    "description": ""
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