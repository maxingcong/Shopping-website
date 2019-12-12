require(["base", "tools", "modules/case_list"], function ($, T, CaseList) {
    var List = T.Module({
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
        },
        getCaseList: function(){
            var _this = this;
            var params = {};
            params = T.Inherit(params, _this.data);
            params.index = String((_this.data.index-1)*_this.data.offset); //起始位置
            T.GET({
                action: 'in_product_new/production_list'
                ,params: params
                ,success: function(data){
                    console.log(data);
                    data.productionList = data.productionList||[];
                    T.Template('filter_list', data, true);
                    CaseList({data: data.productionList});
                    _this.loaded(data, {}, 0);
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
                dirname: 'design/case', //目录名
                pageid: 'index', //文件名（页面名）
                keywords: {
                    "title": "设计案例_优秀设计案例_平面设计效果图_云印设计",
                    "keywords": "云印设计,设计案例,优秀设计案例,平面设计效果图,名片案例,logo案例,VI案例,标志案例,平面设计欣赏",
                    "description": "云印设计案例集合了云印平面设计师优秀的设计作品,为广大企业客户提供设计参考"
                },
                callback: function(domain, path, pageid, keywords) { //生成成功回调函数
                    T.ShowLinks();
                }
            });
        }
    };
    T.Loader(function(){
        new List();
    });
});