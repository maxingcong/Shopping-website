require(["base", "tools", "modules/sign_score", "modules/account_info"], function ($, T, SignScore, AccountInfo) {
    if (!T._LOGED) T.NotLogin();
    var MyIntegral = {
        params: {v: 1, pageSize: 20, currentPage: 1},
        status: ['','',''], //[用户信息,签到信息,积分列表]
        init: function () {
            var _this = this;
            //个人资料
            var accountInfo = AccountInfo();
            accountInfo.on("loaded", function(data, params){
                _this.loaded(0);
            });
            accountInfo.load();
            //查询签到
            var signScore = SignScore();
            signScore.on("loaded", function(data, type){
                _this.loaded(1);
                if(type==0){//主动签到，重新加载消息积分列表
                    _this.loadCoinList();
                }
            });
            signScore.getSigned(1, signScore.setSignedCss);//查询是否签到 type:1
            //加载积分列表
            _this.loadCoinList();
        },
        /**
         * 加载积分列表
         * @param [params]
         */
        loadCoinList: function (params) {
            var _this = this;
            T.GET({
                action: CFG_DS.myintegral.get,
                params: params||_this.params,
                success: function (data) {
                    data.inCoinList = data.inCoinList||[];
                    data.totalCount = data.totalCount||0;
                    T.Template("score_panel", data, true);
                    T.Template("in_coin_list", data, true);
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
                    _this.loaded(2);
                }
            });
        },
        paging: function (obj, index, size, total) {
            var _this = this;
            _this.params.currentPage = index;
            _this.loadCoinList();
        },
        loaded: function(index){
            var _this = this;
            _this.status[index] = 1;
            if(_this.status.join("").length==_this.status.length){
                T.PageLoaded();
            }
        }
    };
    T.Loader(function() {
        MyIntegral.init();
    });
});