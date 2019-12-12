require(["base", "tools", "modules/account_info"], function ($, T, AccountInfo) {
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    var mycoupon = {
        data: {},
        status: ['',''],
        params: {
            order_by: '0', //order_by:1时按过期时间倒叙，其他=记录时间倒叙
            coupon_type: '',
            coupon_status: '0'
        },
        $cont: $("#template-coupon_list-view"),
        init: function (data) {
            var _this = this;
            _this.load(null, true);
            //优惠券兑换
            T.Couponbar($("#offline_coupon"), function(){
                _this.load();
            });
            //个人资料
            var accountInfo = AccountInfo();
            accountInfo.on("loaded", function(data, params){
                _this.loaded(0);
            });
            accountInfo.load();
            _this.events();
        },
        load: function (params, isFirst) {
            var _this = this;
            T.GET({
                action: CFG_DS.mycoupon.get_new,
                params: params||_this.params,
                success: function (data) {
                    data.couponTypeCN = ['印刷券','设计券','通用券','运费券'];
                    data.couponList = data.couponCardList||[];
                    data.couponStatus = _this.params.coupon_status||0;
                    _this.data = data;
                    T.Template("coupon_list", data, true);
                    if(isFirst){
                        _this.loaded(1);
                    }
                }
            });
        },
        loaded: function(i){//数据加载完毕
            var _this = this;
            _this.status[i] = "1";
            if(_this.status.join('').length==_this.status.length){
                T.BindData("data", _this.data, true);
                T.Template("coupon_panel", _this.data, true);
                T.PageLoaded();
                T.FORM().placeholder(T.DOM.byId('record_code_input'), "请输入优惠券兑换码");
            }
        },
        events: function(){
            var _this = this;
            $("#ofilter").on("click.filter", "li a", function (e) { //筛选订单
                $("#ofilter li a").removeClass("sel");
                $(this).addClass("sel");
                var couponType = $(this).data("type");
                if(couponType!=null){
                    _this.params.coupon_type = couponType;
                }else{
                    _this.params.coupon_type = "";
                }
                _this.params.coupon_status = '0';
                $("#ofilter2 li a").removeClass("sel").eq(0).addClass("sel");
                _this.load();
            });
            $("#ofilter2").on("click.filter2", "li a", function (e) { //切换tab
                $("#ofilter2 li a").removeClass("sel");
                $(this).addClass("sel");
                _this.params.coupon_status = $(this).data("status");
                _this.load();
            });
            _this.$cont.on("click.more", ".showmore, .hidemore", function(e){//查看更多
                var $this = $(this);
                var $couponList = $(".coupon_list", $this.closest(".group"));
                if($this.hasClass("showmore")){
                    $this.removeClass("showmore").addClass("hidemore").text("收起全部");
                    $couponList.stop(true, true).animate({
                        height: Math.ceil($(".node", $couponList).length/4)*$(".node:eq(0)", $couponList).outerHeight(true)-11
                    },300);
                }else{
                    $this.removeClass("hidemore").addClass("showmore").text("展开全部");
                    $couponList.stop(true, true).animate({height:400},300);
                }
            });
        }
    };
    T.Loader(function() {
        mycoupon.init();
    });
});