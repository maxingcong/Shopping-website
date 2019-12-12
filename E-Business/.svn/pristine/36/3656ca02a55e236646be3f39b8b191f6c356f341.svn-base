require(["base", "tools", "modules/case_list"], function ($, T, CaseList) {
    var Home = T.Module({
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
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
                }
                ,failure: function(data){
                    console.log(data);
                }
            });
        }
    });
    T.Loader(function(){
        new Home();
    });
});