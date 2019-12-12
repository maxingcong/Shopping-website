require(["base", "tools", "modules/floor"], function($, T, Floor){
    var Home = T.Module({
        status: ["",""],
        init: function(){
            var _this = this;
            //大banner
            T.Advert({
                areaCode: "bhp",
                callback: function (data, params) {
                    _this.loaded(data, params, 0);
                },
                failure: function (data, params) {
                    _this.loaded(data, params, 0);
                }
            });
            //楼层
            Floor().loadFloorList(function(data, params){
                if(!$("#slider_list_bhp5").length){
                    $(".floor-item:eq(2)", this.$cont).after('<div id="slider_list_bhp5" class="floor-item"></div>');
                }
                T.Advert({
                    areaCode: "bhp5"
                });
                _this.loaded(data, params, 1);
            });
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
                dirname: '', //目录名
                pageid: "index", //文件名（页面名）
                keywords: {
                    "title": "【云印官网】名片_宣传单_折页_展架_画册_印刷_印刷O2O_云印技术",
                    "keywords": "云印,ininin.com,云印技术,云印官网,深圳云印,云印公司,印刷,设计,名片,宣传单,折页,展架,画册,印刷,印刷O2O",
                    "description": "云印官网—中国最大的互联网印刷和设计服务平台。为您提供最优质的名片、会员卡、宣传单、折页、易拉宝、X展架、封套、画册、宣传册、手提袋等产品印刷和设计服务！云印技术(深圳)有限公司"
                },
                callback: function(domain, path, pageid, keywords) {debugger //生成成功回调函数
                    T.ShowLinks();
                }
            });
        }
    };
    T.Loader(function () {
        new Home();
    });
});