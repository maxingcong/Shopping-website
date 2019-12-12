!(function(window, document, undefined) {
    "use strict";
    document.title = "消息通知-供应商平台";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var msg_notify = {
        data: {
            index: 1, //当前页码
            offset: 10, //每页条数
            list_type: "noRead" //列表类型
        },
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            _this.$cont = $("#list_tab_panel"); //容器
            _this.render();
            _this.loadList();
            _this.bindEvents();
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            $('#list_tabs').on('click', 'li > a', function(e){ //tabs
                _this.data.list_type = $(this).data("list_type")||"";
                _this.loadList();
            });
            $('#mark_readed_btn').on('click', function(){ //标记为已读
                var arr = [],ids = '';
                _this.$cont.find('input:checked').each(function(index, ele){
                    var msg_id = $(this).data('msg_id');
                    if(msg_id){
                        arr.push(msg_id);
                    }
                });
                ids = arr.toString();
                if(ids){
                    _this.markReaded(ids);
                }
            });
            _this.$cont.on('change.pageCount', 'select[name="pageCount"]', function(e){ //每页显示条数改变
                _this.data.index = 0;
                _this.data.offset = $(this).val()||10;
                _this.loadList();
            });
        },
        /**
         * 渲染页面
         */
        render: function(data){
            var _this = this;
            T.Template("msg_list", data?data: {});
            T.BindData("data", _this.data);
        },
        /**
         * 标记为已读
         * @param {String} id集合
         */
        markReaded: function(ids){
            var _this = this;
            T.GET({
                action: CFG.API.msg.msg_readed,
                params: {
                    ids: ids
                },
                success: function(res){
                    console.log(res);
                    _this.loadList();
                }
            });
        },
        /**
         * 根据对象key/value过滤对象数组
         * @param {Array} arr 对象数组
         * @param {String} value 对象属性值
         * @param {String} key 对象属性名
         * @returns {Array} ret 过滤后的对象数组
         */
        getNoRead: function(arr,value,key){
            var ret = [];
            if(typeof(value)=='undefined'||typeof(key)=='undefined'||key==='')return ret;
            T.Each(arr,function(k,v){
                if(v[key]==value){
                    ret.push(v);
                }
            });
            return ret;
        },
        /**
         * 获取列表
         * @param {Number} 当前页码
         */
        loadList: function(index){
            var _this = this;
            index = index||1;
            var params = {
                currentPage: String(index), //当前页
                pageSize: _this.data.offset //偏移数
            };
            $('#template-msg_list-view').addClass('load');
            T.GET({
                action: CFG.API.msg.msg_list,
                params: params,
                success: function(res){
                    console.log(res);
                    $('#template-msg_list-view').removeClass('load');
                    if(_this.data.list_type == 'noRead'){
                        res.notifictions = _this.getNoRead(res.notifictions, '未读', 'status'); //获得未读消息
                    }
                    _this.data.recordCount = res.notifictions.length||0;
                    _this.render(res);
                    _this.$cont.checkboxs("checkbox", "checkbox_all"); //全选
                    //分页条
                    T.Paginbar({
                        num: 3,
                        size: _this.data.offset, //每页条数
                        total: Math.ceil(_this.data.recordCount/_this.data.offset), //总页数
                        index: index||1, //当前页码
                        paginbar: "paginbar", //容器ID
                        callback: function(obj, index, size, total){ //点击页码回调
                            _this.loadList(index);
                        }
                    });
                    _this.data.index = index;
                }
            });
        }
    };
    msg_notify.init();
}(window, document));
