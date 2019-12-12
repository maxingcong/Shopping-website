require(["base", "tools"], function ($, T) {
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    var message = {
        uuid: T.UUID(),
        popup: null,
        PAGIN: {detail: 1, is_read: 0, offset: 0, count: 20},//is_read: 不传查全部消息，0表示未读，1表示已读
        dom: T.DOM.byId('message'),
        domview: T.DOM.byId('template_msg_list_view'),
        init: function () {
            message.reload(null, true);//首次加载全部
            message.events();
        },
        reload: function (params, isFirst) {//首次查未读消息
            var _this = this;
            $("input[name='midall']").each(function(i, el){
                $(el).removeAttr("checked").closest(".checkbox").removeClass("sel")
            });
            T.GET({
                action: CFG_DS.message.get
                ,params: params||_this.PAGIN
                ,success: function (data) {
                    T.Template('msg_list', data, true);
                    if(_this.PAGIN.count){
                        T.Paginbar({
                            num: 3,
                            size: _this.PAGIN.count,
                            total: Math.ceil(data.count / _this.PAGIN.count),
                            index: Math.ceil(_this.PAGIN.offset/_this.PAGIN.count)+1,
                            paginbar: 'paginbar',
                            callback: _this.pagin
                        });
                    }
                    //T.Checkboxs(_this.domview,'mid',null,_this.check);
                    T.Checkboxs(_this.dom,'mid','midall',_this.check);
                    if(!isFirst){
                        T.SetStatus();
                    }
                    T.PageLoaded();
                }
            });
        },
        /**
         * 翻页
         */
        pagin: function (obj, index, size, total) {
            message.PAGIN.offset = (index-1)*message.PAGIN.count;
            message.reload(message.PAGIN);
        },
        /**
         * 获取已选checkbox
         * @return {DOM}
         */
        getchk: function(){
            return T.GetChecked(message.domview,'mid');
        },
        check: function(o,chk){
            if(o.name=='midall')return;
            chk?T.DOM.addClass(T.DOM.closest(o,'tr'),'sel'):T.DOM.removeClass(T.DOM.closest(o,'ul'),'sel');
        },
        markread: function(params){
            T.msg("标记成功");
            //无需发请求，直接在dom上小改
            $("tbody input:checked",message.domview).each(function(i,el){
                var tr = $(el).closest("tr");
                tr.find('.col5 div').attr('title','已读').text('已读');
                tr.removeClass("unread");
            });
            debugger
            T.SetMessageStatus();
        },
        read: function(db){
            message.popup = T.Popup({
                fixed: false,
                id: message.uuid + 'popup',
                zIndex: 1800,
                title: '消息详情',
                ok: '确 认',
                width: 760,
                content: '<div class="msgpage">\
                        <dl class="clearfix">\
                            <dt class="field">标题：</dt>\
                            <dd class="desc">'+db.title+'</dd>\
                        </dl>\
                        <dl class="clearfix">\
                            <dt class="field">发件人：</dt>\
                            <dd class="desc">'+db.from+'</dd>\
                        </dl>\
                        <dl class="clearfix">\
                            <dt class="field">发送时间：</dt>\
                            <dd class="desc">'+db.recordTime+'</dd>\
                        </dl>\
                        <dl class="clearfix">\
                            <dt class="field">内容：</dt>\
                            <dd id="'+message.uuid+'popupcontent" class="desc mcontent"><div class="doing"></div></dd>\
                        </dl>\
                    </div>'
            });
            T.GET({
                action: CFG_DS.message.get
                ,params: {detail:2, read:1, id_list: db.msg_id}
                ,success: function (data) {
                    var _msg = data.msgList[0];
                    if (_msg) {
                        message.loadContent(_msg);
                    }
                    db.$tr.find('.col5 div').attr('title','已读').text('已读');
                    T.SetMessageStatus();
                }
            });
        },
        events: function(){
            var _this = this;
            $("#ofilter").delegate("li a", "click", function (e) { //筛选消息
                var status = $(this).data('status');
                $("#ofilter li a").removeClass("sel");
                $(this).addClass("sel");
                _this.PAGIN.offset = 0;
                if(typeof status == 'undefined'){//全部
                    delete _this.PAGIN.is_read;
                }else{//未读
                    _this.PAGIN.is_read = status;
                }
                _this.reload();
            });
            $("#message").delegate("a.markread", "click", function (e) {//标记为已读
                var chks = _this.getchk();
                if(!chks||!chks.length){
                    T.msg('请先选择一条消息！');
                    return;
                }
                T.GET({
                    action: CFG_DS.message.get
                    ,params: {detail:0, read:1, id_list: chks.join(',')}
                    ,success: function (data) {
                        _this.markread(data);
                    }
                });
            }).delegate("td.col2", "click", function (e) {//阅读消息
                var $ul = $(this).closest("tr");
                var mid = $(".col1 input",$ul).val();
                if(!mid)return;
                $ul.removeClass("unread");
                _this.read({
                    $tr: $ul,
                    msg_id: mid,
                    from: $(".col3",$ul).text(),
                    recordTime: $(".col4",$ul).text(),
                    title: $(".col2",$ul).text()
                });
            });
        },
        loadContent: function(data){
            if(!message.popup)return;
            var desc = T.DOM.byId(message.uuid+'popupcontent');
            if(!desc)return;
            desc.innerHTML = data.content;
            message.popup.setPosition();
        }/*,
         empty: function(){
         if(message.domview)message.domview.innerHTML = '<div class="empty"><dl class="vertical_middle"><dt class="vm_left"></dt><dd class="vm_right">暂无数据。</dd></dl></div>';
         if(message.dom)T.DOM.addClass(message.dom,'blankspace');
         }*/
    };
    T.Loader(function(){
        message.init();
    });
});