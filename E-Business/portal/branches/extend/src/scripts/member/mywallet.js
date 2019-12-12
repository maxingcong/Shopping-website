require(["base", "tools", "modules/account_info"], function ($, T, AccountInfo) {
    if (!T._LOGED) T.NotLogin();
    var MyWallet = {
        params: {v: 1, pageSize: 20, currentPage: 1},
        status: ['',''],//[用户信息,余额列表]
        init: function (data) {
            var _this = this;
            //个人资料
            var accountInfo = AccountInfo();
            accountInfo.on("loaded", function(data, params){
                _this.loaded(0);
            });
            accountInfo.load();
            //加载余额列表
            _this.loadWalletList();
            //绑定事件
            _this.events();
        },
        /**
         * 加载余额列表
         * @param [params]
         */
        loadWalletList: function (params) {
            var _this = this;
            T.GET({
                action: CFG_DS.mywallet.get,
                params: params||_this.params,
                success: function (data) {
                    data.userWalletList = data.userWalletList||[];
                    data.totalCount = data.totalCount||0;
                    data.ACCOUNT = CFG_DB.ACCOUNT;
                    data.allWallet = T.RMB(data.allWallet);
                    T.Template("balance_panel", data, true);//余额展示
                    T.Template("user_wallet_list", data, true);
                    if(_this.params.pageSize){
                        T.Paginbar({
                            num: 3,
                            size: _this.params.pageSize,
                            total: Math.ceil(data.totalCount / _this.params.pageSize),
                            index: _this.params.currentPage,
                            paginbar: "paginbar",
                            callback: function(){
                                _this.paging.apply(_this, arguments);
                            }
                        });
                    }
                    _this.loaded(1);
                }
            });
        },
        paging: function (obj, index, size, total) {
            var _this = this;
            _this.params.currentPage = index;
            _this.loadWalletList();
        },
        events: function(){
            var _this = this;
            $("#filter_wallet").bind("change", function (e) { //筛选交易记录
                _this.params.currentPage = 1;
                _this.params.type = $(this).val();
                _this.loadWalletList();
            });
        },
        loaded: function(index){
            var _this = this;
            _this.status[index] = 1;
            if(_this.status.join("").length==_this.status.length){
                T.PageLoaded();
            }
        }
    };
    T.Loader(function(){
        MyWallet.init();
    });
});