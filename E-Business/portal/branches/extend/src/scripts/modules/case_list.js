define("modules/case_list", ["base", "tools", "modules/project_view"], function($, T, ProjectView){
    function CaseList(options) {
        this.contId= options.id||'case_list';
        this.$cont = $('#template-'+ this.contId +'-view');
        this.caseList = options.data||[];
        this.removeDom = options.removeDom||false;//取消收藏后是否删除元素
        this.blankTemplate = options.blankTemplate||'';//没有数据时显示的内容,不传则显示'暂无案例'
    }
    CaseList.prototype = {
        viewData: T.Storage({key: 'ininin_design_view'}),
        thumbData: T.Storage({key: 'ininin_design_thumb'}),
        init: function(){
            var _this = this;
            _this.render();
            _this.bindEvents();
            return this;
        },
        render: function(data){
            var _this = this;
            _this.caseList = data||_this.caseList;
            T.Each(_this.caseList, function(i, item){
                if(_this.viewData.has(item.productionId)){
                    item.hasBrowse = true;
                }
                if(_this.thumbData.has(item.productionId)){
                    item.hasCommend = true;
                }
            });
            T.Template('case_list', this.contId, {productionList: _this.caseList, blankTemplate: this.blankTemplate}, true);
        },
        bindEvents: function(){
            var _this = this;
            _this.$cont.on('click', '.d-operator i', function(){
                var $this = $(this);
                var id = $this.closest('.d-info').data('id');
                if($this.hasClass('commend')&&!$this.hasClass('sel')){
                    _this.viewOrCommend(2, id, function(){
                        var $span = $this.next('span');
                        $this.addClass('sel');
                        $span.text(parseInt($span.text())+1);
                        T.msg('点赞成功');
                    });
                }else if($this.hasClass('mark')){
                    if (!T._LOGED) {
                        T.LoginForm(0, function(){
                            _this.collection($this, id);
                        });
                        return false;
                    }
                    if(!$this.hasClass('sel')){
                        _this.collection($this, id);
                    }else{
                        T.POST({
                            action: 'in_product_new/cancel_collection'
                            ,params: {
                                production_id: id
                            }
                            ,success: function(data){
                                var $span = $this.next('span');
                                $this.removeClass('sel');
                                $span.text(parseInt($span.text())-1);
                                T.msg('取消成功');
                                if(_this.removeDom){
                                    var $li = $this.closest('li');
                                    if($li.siblings('li').length<1){
                                        $li.remove();
                                        _this.caseList = [];
                                        _this.render();
                                    }else{
                                        $li.remove();
                                    }
                                }
                            }
                            ,failure: function(data){
                                console.log(data);
                            }
                        });
                    }
                }
            }).on('click', '.d-img', function(){
                var $this = $(this),
                    $info = $this.closest('.d-info'),
                    $browse = $('.browse', $info),
                    $commend = $('.commend', $info),
                    $mark = $('.mark', $info),
                    $browseNum = $browse.next('span'),
                    $commendNum = $commend.next('span'),
                    $markNum = $mark.next('span'),
                    id = $info.data('id');
                new ProjectView({
                    id: id,
                    zindex: 259,
                    viewNumber: parseInt($browseNum.text()),
                    viewClosed: function(data) {
                        $browseNum.text(data.viewNumber);
                        $commendNum.text(data.likeNumber);
                        $markNum.text(data.collectionNumber);
                        $browse.addClass('sel');
                        if(_this.thumbData.has(id)){
                            $commend.addClass('sel');
                        }
                        if(data.isCollection){
                            $mark.addClass('sel');
                            $mark.attr('title', '取消收藏');
                        }else{
                            $mark.removeClass('sel');
                            if(_this.removeDom){
                                var $li = $info.closest('li');
                                if($li.siblings('li').length<1){
                                    $li.remove();
                                    _this.caseList = [];
                                    _this.render();
                                }else{
                                    $li.remove();
                                }
                            }
                        }
                    }
                });
            });
        },
        collection: function(dom, id){
            T.POST({
                action: 'in_product_new/collection_production'
                ,params: {
                    production_id: id
                }
                ,success: function(data){
                    var $span = dom.next('span');
                    dom.addClass('sel');
                    dom.attr('title', '取消收藏');
                    $span.text(parseInt($span.text())+1);
                    T.msg('收藏成功');
                }
                ,failure: function(data){
                    console.log(data);
                }
            });
        },
        /**
         * 点赞或浏览
         */
        viewOrCommend: function(type, id, callback){
            var _this = this;
            T.POST({
                action: 'in_product_new/view_like_production'
                ,params: {
                    type: type||2,
                    production_id: id
                }
                ,success: function(data){
                    if(type==1){
                        _this.viewData.add(id);
                    }else if(type==2){
                        _this.thumbData.add(id);
                    }
                    if(callback){
                        callback();
                    }
                }
                ,failure: function(data){
                    console.log(data);
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
                var str = T.Compiler.template("template-case_list", {productionList: data});
                str = str.replace('<ul class="clearfix">', "").replace('</ul>', '');
                $('ul', _this.$cont).append(str);
            }
        }
    };
    return function(options){
        return new CaseList(options).init();
    };
});