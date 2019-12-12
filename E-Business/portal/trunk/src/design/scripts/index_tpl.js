require(["base", "tools", "modules/case_list"], function ($, T, CaseList) {
    var Home = T.Module({
        status: ["",""],
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            //大banner
            T.Advert({
                areaCode: "design",
                callback: function (data, params) {
                    _this.loaded(data, params, 0);
                },
                failure: function (data, params) {
                    _this.loaded(data, params, 0);
                }
            });
            _this.getCaseList();
        },
        /**
         * 获取案例列表
         */
        getCaseList: function(){
            var _this = this;
            T.GET({
                action: 'in_product_new/query_production_home'
                ,params: {}
                ,success: function(data){
                    console.log(data);
                    data.productionList = data.productionList||[];
                    CaseList({data: data.productionList});
                    _this.loaded(data, {}, 1);
                }
                ,failure: function(data){
                    console.log(data);
                }
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
                dirname: 'design', //目录名
                pageid: 'index', //文件名（页面名）
                keywords: {
                    "title": "【云印设计】标志设计_logo设计_VI设计_名片设计_画册设计_宣传单设计_平面设计",
                    "keywords": "云印设计,标志设计,logo设计,VI设计,名片设计,平面设计,宣传单设计,海报设计,画册设计,标志仿制,名片仿制",
                    "description": "云印设计是专业的互联网平面设计公司,主要从事标志设计,VI设计,logo设计,画册设计,宣传单设计,海报设计,名片设计等.云印拥有专业的设计师团队,为客户提供专业的商务设计及印刷服务"
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