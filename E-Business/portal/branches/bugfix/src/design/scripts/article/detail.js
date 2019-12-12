require(["base", "tools", "modules/design_share"], function($, T, designShare){
    var Article = {
        id: '',
        $cont: $('#template-article-view'),
        storage: T.Storage({key: 'ininin_article_thumb'}),
        init:function (id, opts) {
            opts = opts||{};
            this.id = id;
            //this.isThumb = this.storage.has(this.id)? 'done' : '';//是否对本 id 点赞
            this.getArticle();
            this.events();
        },
        getArticle: function(){
            var _this = this;
            T.GET({
                action: 'in_app/article/detail'
                ,params: {articleId: _this.id}
                ,success: function (data) {debugger
                    var art = data.data||{};
                    if (!art.articleId) {return;}
                    document.title = art.articleTitle;
                    art.author = data.author||'云小印';
                    art.hasRefer = art.refArticleInfoList && art.refArticleInfoList.length;
                    art.viewNumber = parseInt(art.pageViewsNumber);
                    //art.isThumb = _this.isThumb;
                    art.isThumb = art.isLikes?'done' : '';
                    art.createTime = new Date(art.createTime).Format();
                    _this.render(art);
                }
            });
        },
        /**
         * 渲染文章详情
         * @return {undefined} undefined
         */
        render: function(data) {
            var _this = this, share = {};
            T.PageLoaded();
            T.Template('article', data, true);//案例详情
            share.shareTitle = data.articleTitle;
            share.digest = data.describe;
            share.uris = [data.coverImageUrl];
            designShare(share);
            _this.scan();//向服务器记录一笔
        },
        scan: function() {//浏览
            var _this = this;
            T.POST({
                action: 'in_app/discovery/pageview',
                params: {objectId: _this.id, objectType: 1},
                success: function (data, params) {
                    T.Storage({key: 'ininin_article_view'}).add(_this.id);
                }
            });
        },
        giveThumb: function(dom) {//点赞
            var _this = this;
            T.POST({
                action: 'in_app/discovery/likes',
                params: {objectId: _this.id, actionType: 2, objectType: 1},//文章点赞
                success: function (data, params) {
                    T.msg('点赞成功');
                    //_this.msgUp($('#thumb'), '+1');
                    dom.addClass('done');
                    var $thumb = _this.$cont.find('.pro-thumb').next('span');
                    $thumb.text( parseInt( $thumb.text()||0 ) + 1);
                    _this.storage.add(_this.id);
                }
            });
        },
        /*collect: function(dom, e) {//收藏
            var _this = this;
            T.POST({
                action: "in_product_new/collection_production",
                params: {production_id: _this.id},
                success: function (data, params) {
                    //_this.collecting = false;
                    //_this.isCollection = true;//已收藏
                    //_this.collectionNumber += 1;
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
                    //_this.collecting = false;
                    //_this.isCollection = false;//取消收藏
                    //_this.collectionNumber -= 1;
                    T.msg('取消成功');
                    dom.removeClass('done');
                    var $star = _this.$cont.find('.pro-star').next('span');
                    $star.text( parseInt( $star.text()||0 ) - 1);
                }
            });
        },*/
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
        events: function(){
            var _this = this;
            _this.$cont.on('click.thumb', '#thumb', function(e) {//点赞
                var $this = $(this);
                if (!T._LOGED) {
                    T.LoginForm(0, function(){
                        _this.giveThumb($this);
                    });
                }else if ($this.hasClass('done')) {
                    T.msg('您已点过赞了');
                    return false;
                }else{
                    _this.giveThumb($this);
                }
            })
            /*.on('click.collect', '#collect', function(e) {//收藏
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
            });*/

        }
    };
    T.Loader(function(){
        var local = location.href.substring(0, location.href.indexOf(".html"));
        //Article.init(local.substring(local.lastIndexOf("/")+1)||"");
        var id = T.getRequest()['aid'];
        typeof id != 'undefined' && Article.init(id);
    });
});