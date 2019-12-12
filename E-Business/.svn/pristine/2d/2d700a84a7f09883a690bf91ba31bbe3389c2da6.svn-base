require(["base", "tools", "modules/ordering"], function ($, T, Ordering) {
    if (!T._LOGED) T.NotLogin();
    var ordering, Order = T.Module({
        uuid: T.uuid(),
        $cont: $("#order"),
        data: {
            address: {}, //配送地址
            orderType: Number(T.REQUEST.t), //订单类型
            orderCode: T.REQUEST.o, //订单编号
            productList: [], //商品清单
            productNum: 0, //商品款数
            orderPrice: 0, //订单金额
            orderProductPrice: 0, //订单商品金额（特例：分发订单为订单金额）
            shipPrice: 0 //订单运费（特例：分发订单将运费记为订单商品金额）
        },
        isFirst: true, //是否首次加载
        status: ['',''], //[订单信息,确认订单]
        events: {
            "click .oinfo .submit:not(.dis)": "submit" //提交订单
        },
        init: function(options) {
            var _this = this;
            options = options || {};
            if((_this.data.orderType==5 || _this.data.orderType==10) && _this.data.orderCode){
                _this.getOrder({
                    order_code: _this.data.orderCode
                }, 0);
                //确认订单
                ordering = new Ordering({
                    data: {
                        isCoupon: _this.data.orderType!=5
                    },
                    callbacks: {
                        loaded: function(data, params){
                            _this.loaded(data, params, 1);
                        }
                    }
                }, 1);
            }else{
                _this.backOrder();
            }
        },
        /**
         * 订单信息
         */
        getOrder: function(param, callback){
            var _this = this;
            T.GET({
                action: CFG_DS.myorder.get,
                params: param,
                success: function(data, params) {debugger
                    data.orderList = data.orderList||[];
                    var order = data.orderList[0]||{};
                    if(Number(order.status)===0){ //如果订单未支付，则初始化支付信息
                        _this.data.orderType = order.type;
                        if(order.orderProductList && order.orderProductList.length && (order.type==5 || order.type==10)){
                            _this.data.orderProductPrice = order.totalPrice||0;
                            _this.data.productList = order.orderProductList||[];
                            _this.data.designDefImg = T.DOMAIN.RESOURCES + "design/750x425.jpg";
                            _this.data.packageDefImg = T.DOMAIN.RESOURCES + "package/750x425.jpg";
                            _this.compiler("product_list", _this.data);
                            _this.loaded(data, params, callback);
                        }else{
                            ordering.goOrderList(_this.data);
                        }
                    }else{
                        ordering.goDetail(_this.data);
                    }
                },
                failure: function(data, params){
                    T.alt(data.msg || '订单不存在或已删除', function(_o) {
                        _o.remove();
                        _this.backOrder();
                    }, function(_o) {
                        _o.remove();
                        _this.backOrder();
                    }, '返回我的订单');
                },
                error: function(data, params){
                    ordering.goOrderList(_this.data);
                }
            });
        },
        /**
         * 提交订单
         * @param $this
         * @param e
         */
        submit: function($this, e) {
            var _this = this;
            var _this = this;
            ordering.submit(_this.data.orderType==5?"in_order/sure_plan_order":"in_order/sure_design_order", {
                order_code: _this.data.orderCode
            });
        },
        /**
         * 加载完成
         */
        complete: function(){
            var _this = this;
            _this.data.productNum = _this.data.productList.length;
            _this.data.orderPrice = Number(_this.data.orderProductPrice) + Number(_this.data.shipPrice);
            ordering.data.address = {};
            ordering.data.orderType = _this.data.orderType;
            ordering.data.orderCode = _this.data.orderCode||"";
            ordering.data.productList = _this.data.productList||[];
            ordering.data.productNum = _this.data.productNum||0;
            ordering.data.orderPrice = _this.data.orderPrice||0;
            ordering.data.orderProductPrice = _this.data.orderProductPrice||0;
            ordering.data.shipPrice = _this.data.shipPrice||0;
            ordering.data.couponPrice = _this.data.couponPrice||0;
            ordering.data.couponCodes = "";
            ordering.data.categoryIdName = "categoryId";
            ordering.data.productIdName = "productId";
            ordering.data.productPriceName = "totalPrice";
            ordering.getUsableCouponByOrder();
            if(_this.data.productNum<1){
                $(".submit", _this.$cont).addClass("dis");
            }
            if(_this.data.orderType==5){
                $(".coupon_pay", _this.$cont).addClass("dis");
            }
            //默认展开优惠券
            if (_this.data.orderType!=5 && ordering.data.isCoupon && ordering.data.couponList.length > 0) {
                $(".coupon_pay:not(.dis,.sel)", _this.$cont).click();
            }
            if(!_this.isFirst)return;
            _this.isFirst = false;
            T.FORM().placeholder(T.DOM.byId('buyer_remark'), "建议填写已经和客服达成一致的说明"); //备注信息
            T.PageLoaded();
        },
        backOrder: function(){
            location.replace(T.DOMAIN.ORDER + "index.html" + (T.INININ ? "?" + T.INININ : ""));
        }
    });
    T.Loader(function(){
        new Order();
    });
});