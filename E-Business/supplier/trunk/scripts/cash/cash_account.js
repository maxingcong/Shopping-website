!(function(window, document, undefined) {
    "use strict";
    document.title = "现金账户记录-供应商平台";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var cash_account = {
        data: {
            index: 1, //当前页码
            offset: 10, //每页条数
            list_type: "Income" //列表类型
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
            $('#list_tabs').on('click', 'li > a', function(e){
                _this.data.list_type = $(this).data("list_type")||"";
                _this.loadList();
            });
            _this.$cont.on("change.pageCount", "select[name='pageCount']", function(e){
                _this.data.index = 0;
                _this.data.offset = $(this).val()||10;
                _this.loadList();
            });
        },
        /**
         * 渲染页面
         * @param {Object} 数据
         */
        render: function(data){
            var _this = this;
            T.Template("account_list", data||{});
            T.BindData("data", _this.data);
        },
        /**
         * 获取列表
         * @param {Number} 当前页码
         */
        loadList: function(index){
            var _this = this,
                index = index||1,
                params = {
                    index: String((index-1)*_this.data.offset), //起始位置
                    offset: _this.data.offset //偏移数
                };
            if(_this.data.list_type){ //列表类型
                params.type = _this.data.list_type;
            }
            $('#template-account_list-view').addClass('load');
            T.GET({
                action: CFG.API.account.account_list,
                params: params,
                success: function(res){
                    $('#template-account_list-view').removeClass('load');
                    _this.data.recordCount = res.totalCount||0;
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
    cash_account.init();
}(window, document));