require(["base", "tools", "modules/account_info", "modules/sign_score"], function ($, T, AccountInfo, SignScore) {
    if (!T._LOGED) T.NotLogin();
    var myininin = {
        data: {},
        hotSell: [],//热销产品
        index: 0,
        init: function (data) {
            var _this = this;
            //个人资料
            var accountInfo = AccountInfo();
            accountInfo.on("loaded", function(data, params){
                T.PageLoaded();
            });
            accountInfo.load();
            //账户余额
            T.GET({
                action: "in_order/user_all_wallet_query",
                success: function (data) {
                    _this.data.allWallet =  T.RMB(data.allWallet);
                    _this.render();
                }
            });
            //优惠券
            T.GET({
                action: "in_order/coupon_query_for_web",
                success: function (data) {
                    _this.data.usableCount = data.usableCardNum||0;
                    _this.render();
                }
            });
            //月结额度
            T.GET({
                action: 'in_order/used_amount_query',
                success: function (data) {
                    //{"result":0,"msg":"","data":{"allMonthly":0,"canUse":0,"result":0,"usedAmount":0}
                    _this.data.allMonthly =  T.RMB(data.allMonthly);
                    _this.data.canUse =  T.RMB(data.canUse);
                    _this.render();
                }
            });
            //发票信息
            T.GET({
                action: 'in_invoice/invoice_order_query',
                params: { offset: 0, count: 10},
                success: function (data) {
                    data = data.data;
                    _this.data.allSurplusInvoicePrice = T.RMB(data.allSurplusInvoicePrice);
                    _this.render();
                }
            });
            //积分信息
            _this.loadCoin();
            //查询签到
            var signScore = SignScore();
            signScore.on("loaded", function(data, type){
                if(type==0){//主动签到，重新加载消息积分列表
                    _this.loadCoin();
                }
            });
            signScore.getSigned(1, signScore.setSignedCss);//查询是否签到 type:1

            //热销产品
            _this.loadHotList();
            //绑定事件
            _this.bindEvents();
        },
        /**
         * 热销产品
         */
        loadHotList: function(){
            var _this = this;
            T.GET({
                action: 'in_search/product/search',
                params: {
                    args: '',
                    sortField: 'sales_volume',
                    sortDirection: 'desc',
                    from: 0,
                    size: 48
                },
                success: function(data){
                    var _data = data.data.data || {};
                    if(_data.product&&_data.product.length){
                        _this.hotSell = _data.product.slice(0, 20);//销量前20的产品
                        _data.product = _this.hotSell.slice(_this.index, _this.index+8);
                        _this.index += 8;
                    }
                    T.Each(_data.product, function(index, v){
                        v.simpleDesc = v.simpleDesc || '';
                        v.productName = v.productName || '';
                        v.simpleDescEllipsis = T.GetEllipsis(v.simpleDesc, v.productName, 46);
                    });
                    T.Template('hot_list', _data, true);
                }
            });
        },
        bindEvents: function(){
            var _this = this;
            $('#changeHotsell').on('click', function(){
                if(!_this.hotSell.length){
                    return;
                }
                var product = _this.hotSell.slice(_this.index, _this.index+8);
                if(_this.index+8>20){
                    _this.index = 8-(20-_this.index);
                    product = product.concat(_this.hotSell.slice(0, _this.index));
                }else{
                    _this.index += 8;
                }
                T.Each(product, function(index, v){
                    v.simpleDesc = v.simpleDesc || '';
                    v.productName = v.productName || '';
                    v.simpleDescEllipsis = T.GetEllipsis(v.simpleDesc, v.productName, 46);
                });
                T.Template('hot_list', {product: product}, true);
            });
        },
        /**
         * 积分信息
         */
        loadCoin: function(){
            var _this = this;
            T.GET({
                action: CFG_DS.myintegral.get,
                params: {
                    v: 1
                },
                success: function (data) {
                    _this.data.allMyCoin = data.allMyCoin;
                    _this.data.allGetCoin = data.allGetCoin;
                    _this.render();
                }
            });
        },
        render: function () {
            var _this = this;
            T.BindData("data", _this.data);
        }
    };
    T.Loader(function(){
        myininin.init();
    });
});