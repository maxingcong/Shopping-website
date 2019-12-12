!(function(window, document, undefined) {
    "use strict";
    document.title = "消息详情-供应商平台";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var msg_detail = {
        /**
         * 初始化
         */
        init: function(){
            var _this = this,
                msg_id = T.REQUESTS.msg_id,
                id = T.REQUESTS.id;
            _this.markReaded(id);
            _this.getMsgDetail(msg_id);
            _this.bindEvents();
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
        },
        /**
         * 标记为已读
         * @param {String} id
         */
        markReaded: function(id){
            var _this = this;
            T.GET({
                action: CFG.API.msg.msg_readed,
                params: {
                    ids: id
                },
                success: function(res){
                    console.log(res);
                }
            });
        },
        /**
         * 获取消息详情
         * @param {String} msg_id
         */
        getMsgDetail: function(id){
            T.GET({
                action: CFG.API.msg.msg_detail,
                params: {
                    id: id
                },
                success: function(res){
                    $('#msg_wrapper').html(res.msg);
                }
            });
        }
    };
    msg_detail.init();
}(window, document));

