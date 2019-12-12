require(["base", "tools", "modules/case_list"], function($, T, CaseList){
    var Designer = {
        $cont: $('#template-case_list-view'),
        caseDom: '',
        dId: '', //T.getRequest()['did'],
        PAGIN: {
            index: 0, 
            offset: 9, 
            order_by: '',
            order_by_type: 'desc' //desc 默认降序 
        },
        init: function(id) {
            this.dId = id;
            this.reload();
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
                            MAKER.maker(data);
                        }else{
                            T.alt('设计师不存在', function() {
                                location.replace('./index.html');
                            });
                        }
                        T.PageLoaded();
                    }else{//部分更新
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
        }
    };
    
    var DesignerList = {
        init: function() {
            this.reload();
        },
        reload: function(){
            T.GET({
                action: 'in_product_new/designer_list'
                ,params: {}
                ,success: function (data) {//拉取所有设计师
                    console.log(data);
                    MAKER.list = data.designerList||[''];
                    MAKER.init();
                }
            });
        }
    };
    var MAKER = {
        index: 0,
        init: function(){
            Designer.init(MAKER.list[MAKER.index].designerId);
        },
        maker: function(data) {
            console.log(data);
            debugger;
            //生成静态页
            T.GenerateStaticPage({
                domain: T.REQUEST.w, //域名
                dirname: 'design/designer', //目录名
                pageid: data.designer.designerId, //文件名（页面名）
                keywords: {
                    "title": (data.designer.jobPosition||'设计师') + (data.designer.designerAlias?'-'+data.designer.designerAlias : ''),
                    "keywords": "云印,ininin.com,云印技术,云印官网,深圳云印,云印公司,印刷,设计,名片,会员卡,宣传用品,办公用品",
                    "description": "云印设计服务频道，云印提供各种印刷品设计服务、印刷服务、制作。云印，设计“省”心，印刷“简”单。"
                },
                callback: function(domain, path, pageid, keywords) { //生成成功回调函数
                    MAKER.index++;
                    MAKER.timeout();
                }
            });
        },
        timeout: function() {
            if (MAKER.index < MAKER.list.length) {
                setTimeout(MAKER.init, 100);
            } else {
                T.ShowLinks();
            }
        }
    };
    T.Loader(function(){
        //拉取设计师列表
        DesignerList.init();
    })
});