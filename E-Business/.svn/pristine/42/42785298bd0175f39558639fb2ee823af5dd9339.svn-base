define("modules/project_view", ["base", "tools", "modules/design_share"], function($, T, designShare){
    /**
     * 展示案例
     * 放大效果+翻页
     * @param {Object} options
     * @param {String} id  案例的id
     * @param {String} options.data 传递过来的案例数据
     * @param {String} options.zindex 展示案例时背景遮罩的 z-index 值
     * * @param {String} options.viewNumber 浏览数
     * @param {String} options.viewOpen 开启前触发
     * @param {String} options.viewClosed 关闭触发
     * @returns {} undefined
     */
    function ProjectView(options) {
        options = options||{};
        this.passd = options.data||{};
        this._case = {}; //IE7 敏感
        this.scrollPos = $(window).scrollTop();
        this.id = options.id;
        this.zindex = parseInt(options.zindex||259);  //处理样式层叠关系
        this.viewNumber = parseInt(options.viewNumber) ||0;
        this.viewOpen = options.viewOpen;
        this.viewClosed = options.viewClosed;
        this.collecting = false; //ajax doing
        this.isThumb = this.storage.has(this.id)? 'done' : '';//是否对本 id 点赞
        this.getProject();
        this.projEvents();
    }
    ProjectView.prototype = {
        constructor: ProjectView,
        $cont: $('#template-project_view-view'),
        zoom: '#zoom_view',
        storage: T.Storage({key: 'ininin_design_thumb'}),
        /**
         * 创建一个背景遮罩
         * @param  {Number} z 遮罩的 css 样式 z-index 值
         * @return {$DOM}  dom
         */
        createMask: function(z){//透明遮罩
            var mask = $('#mask'+z);
            if (!mask.length) {
                mask = $('<div id="mask'+ z +'" class="screen-mask" style="z-index: '+z+';">');
                $('body').append(mask);
            }
            return mask.show();
        },
        getProject: function(){
            var _this = this;
            T.GET({
                action: 'in_product_new/production_detail'
                ,params: {production_id: _this.id}
                ,success: function (data) {debugger
                    $('body').addClass('case-viewing');
                    _this.$mask0 = _this.createMask(_this.zindex);//请求成功后再添加遮罩
                    var dp = _this._case = data.production||{};
                    dp.viewNumber = Math.max(_this.viewNumber + 1, parseInt(_this._case.viewNumber));
                    dp.likeNumber = _this._case.likeNumber = _this._case.likeNumber||0;
                    dp.isCollection = _this._case.isCollection?'done' : '';
                    dp.isThumb = _this.isThumb;
                    dp.hasDesign = dp.designProductList && dp.designProductList.length;
                    dp.hasPrint = dp.printProductList && dp.printProductList.length;
                    _this.projRender(dp);
                }
            });
        },
        /**
         * 渲染案例项目
         * @return {undefined} undefined
         */
        projRender: function(data) {
            var _this = this;
            _this.uris = [];//作品图列表
            _this.$cont.css('height','auto');
            setTimeout(function(){//IE FF 模板渲染需延迟
                T.Template('project_view', data, true);//案例详情
                $('#project_wrap').scrollTop(0);
                $('.zoom-in img', _this.$cont).each(function(){
                    var src = $(this).attr('src');
                    src && _this.uris.push(src);
                });
                data.shareTitle = data.caseName + ' - '+ data.designProductName;
                data.uris = _this.uris;
                //data.href = location.href;
                designShare(data);
            },20);
            _this.scan();//向服务器记录一笔
        },
        zoomView: function(options){
            options = options||{};
            if (!options.src || this.uris.length == 0) {
                return false;
            }
            this.$mask1 = this.createMask( options.zindex || this.zindex+10 );
            this.zoomRender(options.src||this.uris[0]);
            this.zoomEvents();
        },
        zoomRender: function(src){debugger
            var _this = this,
                uris = _this.uris,
                i = T.Array.indexOf(uris, src);
            var data = {
                _width: (uris.length+1)*100 + '%',
                uris: uris
            }
            T.Template('zoom_box', data, true);
            var _s = new T.Slider({
                cont: '#template-zoom_box-view',
                percent: true,
                direction: "lr",
                autoplay: false
            });
            $(_this.zoom).show();
            _s.slider(i);
        },
        projClose: function(){ //关闭
            var data = {
                productionId: this.id,
                viewNumber: this._case.viewNumber,
                collectionNumber: this._case.collectionNumber,
                likeNumber: this._case.likeNumber,
                isCollection: this._case.isCollection
            };
            $('body').removeClass('case-viewing');
            this.$mask0.hide();
            this.$cont.html('').css('height','0px');
            $(window).scrollTop(this.scrollPos);
            typeof this.viewClosed == 'function' && this.viewClosed(data);
        },
        zoomClose: function(){
            this.$mask1.hide();
            //remove 放大模板
            $(this.zoom).hide();
        },
        scan: function() {//浏览
            var _this = this;
            T.POST({
                action: "in_product_new/view_like_production",
                params: {production_id: _this.id, type: 1},
                success: function (data, params) {
                    T.Storage({key: 'ininin_design_view'}).add(_this.id);
                }
                //如果失败
            });
        },
        giveThumb: function(dom) {//点赞
            var _this = this;
            T.POST({
                action: "in_product_new/view_like_production",
                params: {production_id: _this.id, type: 2},
                success: function (data, params) {
                    T.msg('点赞成功');
                    //_this.msgUp($('#thumb'), '+1');
                    _this._case.likeNumber += 1;
                    dom.addClass('done');
                    var $thumb = _this.$cont.find('.pro-thumb').next('span');
                    $thumb.text( parseInt( $thumb.text()||0 ) + 1);
                    _this.storage.add(_this.id);
                }
            });
        },
        collect: function(dom, e) {//收藏
            var _this = this;
            T.POST({
                action: "in_product_new/collection_production",
                params: {production_id: _this.id},
                success: function (data, params) {
                    _this.collecting = false;
                    _this._case.isCollection = true;//已收藏
                    _this._case.collectionNumber += 1;
                    //_this.msgUp($('#collect'), '+1');
                    T.msg('收藏成功');
                    dom.addClass('done');
                    var $star = _this.$cont.find('.pro-star').next('span');
                    $star.text( parseInt( $star.text()||0 ) + 1);
                }
            });
        },
        noCollect:function(dom, e){//取消收藏
            var _this = this;
            T.POST({
                action: "in_product_new/cancel_collection",
                params: {production_id: _this.id},
                success: function (data, params) {
                    _this.collecting = false;
                    _this._case.isCollection = false;//取消收藏
                    _this._case.collectionNumber -= 1;
                    T.msg('取消成功');
                    dom.removeClass('done');
                    var $star = _this.$cont.find('.pro-star').next('span');
                    $star.text( parseInt( $star.text()||0 ) - 1);
                }
            });
        },
        msgUp: function(dom, msg){
            var pos, txt;
            msg = msg||'+1';
            pos = $('<div style="position: relative;width:1px;height:1px; margin:0 auto;"></div>');
            txt = $('<span style="position:absolute;z-index:9;font-size:16px;color:#333;right:-10px;top:-20px;">'+msg+'</span>');
            pos.append(txt);
            dom.append(pos);
            txt.stop(true,true).animate({
                top: -60,
                right: -40,
                opacity: 0.2
            }, 1000, function(){
                txt.remove();
            });
        },
        projEvents: function(){
            var _this = this;
            $('body').off('click.proclose').on('click.proclose', '.project-view', function(e){ //点击透明地方
                _this.projClose();
                T.DOM.stopPropagation(e);
            })
            .off('click.proj').on('click.proj', '.project, .project-right', function(e){ //点击可视主体
                T.DOM.stopPropagation(e);
            })
            .off('click.proview').on('click.proview', '.zoom-in img', function(e){debugger//点击某一张图片
                _this.zoomView({
                    src: $(this).attr('src'),
                    zindex: 269
                });
                T.DOM.stopPropagation(e);
            })

            _this.$cont.off('click.thumb').on('click.thumb', '#thumb', function(e) {//点赞
                var $this = $(this);
                if ($this.hasClass('done')) {
                    T.msg('您已点过赞了');
                    return false;
                }
                _this.giveThumb($this);
            })
            .off('click.collect').on('click.collect', '#collect', function(e) {//收藏
                var $this = $(this);
                if (!T._LOGED) {
                    T.LoginForm(0, function(){
                        //TO DO
                        //未登录前查看详情是未收藏的，此登录后，之前已收藏可能还显示未收藏
                        _this.collect($this, e);
                    });
                }else if (!_this.collecting && $this.hasClass('done')){//取消收藏
                    _this.collecting = true;
                    _this.noCollect($this, e);
                }else if(!_this.collecting){
                    _this.collecting = true;
                    _this.collect($this, e);
                }
                return false;
            })
            .on("scroll.proview resize.proview", function(e) {
                var isIE7 = !!window.ActiveXObject && !!window.XMLHttpRequest && !document.documentMode||(document.documentMode==7);
                var winH = $(window).height();
                var cTop = _this.$cont.scrollTop();
                var pro = $('#project');
                var proright = $('#project_right');
                var proH = pro.outerHeight();
                var prorightH = proright.outerHeight();
                if (proH < winH && prorightH < winH) {return false;}
                if (proH < winH) {//左区块过短，则固定它
                    pro.addClass('fixed');
                }

                if (prorightH < winH) {//右区块过短，则固定它
                    proright.addClass('fixed');
                    isIE7 && proright.css('margin-left','-140px');
                }else if (prorightH - cTop + 50> winH) {//未固定
                    proright.removeClass('fixed');
                    isIE7 && proright.css({'float':'right', 'margin-left':'auto'});
                }else{//固定
                    proright.addClass('fixed').css('bottom', 10);
                    isIE7 && proright.css('margin-left','-140px');
                }
            });

        },
        zoomEvents: function() {
            var _this = this;
            $('body').off('click.zoomclose').on('click.zoomclose', '#zoom_view', function(e){// 关闭debugger;
                _this.zoomClose();
                T.DOM.stopPropagation(e);
            }).off('click.zoom').on('click.zoom', '#zoom_cont', function(e){ //阻止事件冒泡debugger;
                if($(e.target || e.srcElement).hasClass('close')){
                    _this.zoomClose();
                }
                T.DOM.stopPropagation(e);
                return false;
            });
        }
    };
    //返回构造函数
    return function(options){
        return new ProjectView(options);
    };
});