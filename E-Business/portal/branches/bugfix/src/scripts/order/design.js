require(["base", "tools", "modules/apply_for_order"], function ($, T, ApplyForOrder) {
    /*
     订单状态：
     0=待支付（提交订单）
     1=已支付（包括货到付款）同时改变商品状态（待审核）
     2=订单已取消
     3=交易完成
     订单商品状态：
     #101=未提交需求
     #103=已提交需求
     105=设计中
     107=待对稿
     110=待修改
     111=修改中
     107=对稿
     109=定稿完成
     */
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    var myorder = {
        uuid: T.UUID(),
        popup: null,
        text: '',
        isSearch: false,
        PAGIN: {type:'10', currentPage: 1, pageSize: 10, order_status:''},
        PAY_TYPE_ARRAY: [
            0,//支付宝支付
            1,//货到付款
            2,//金额支付
            3,//余额支付(充值账户支付)
            //4,//优惠券支付
            5,//银行转账
            6,//后台支付
            7,//现金支付
            8,//刷卡支付
            9,//银联支付
            //10,//积分支付
            11,//微信支付
            //12,//普通账户支付
            //13,//赠送账户支付
            14,//企业银联支付
            //15,//赠送设计服务支付(只能在设计服务订单使用)
            16//月结支付
        ],
        PAY_TYPE_STRING: '',
        init: function (data) {
            myorder.PAY_TYPE_STRING = ','+myorder.PAY_TYPE_ARRAY.join(',')+',';

            myorder.reload(data, true);

            $("#search_order_input").bind("keydown.search", function(e){
                if($.trim($(this).val())&&e.keyCode==13){
                    $(this).siblings(".search_btn").click();
                }
            });
            $("#ofilter").delegate(".searchbar .search_btn", "click.search", function (e) {//过滤订单
                myorder.text = $("#search_order_input").val();
                if (!myorder.text) return;
                myorder.isSearch = true;
                myorder.PAGIN.currentPage = 1;
                myorder.PAGIN.order_code = myorder.text||'';
                myorder.reload();
            });
            $("#myorder").delegate("a.delete:not(.dis), a.delete-all:not(.dis)", "click", function (e) {//删除订单
                var $this = $(this);debugger
                var orderCode = "";
                if($this.hasClass("delete")){
                    var $item = $(this).closest("div.item");
                    orderCode = $item.attr("ocode");
                    if (!orderCode) return;
                    var order = T.Array.get(myorder.order_list, orderCode, 'order_code');
                    if (!order) return;
                }
                var text = '<p>确认删除该已取消的订单？</p>';
                text += '<p>删除后将不可恢复！</p>';
                var popup = new T.Popup({
                    fixed: true,
                    style: 'warning',
                    title: '删除已取消订单',
                    width: 400,
                    content: '<dl class="popbox vertical_middle warning"><dt class="vm_left "></dt><dd class="vm_right">'+text+'</dd></dl>',
                    ok: '确定删除',
                    no: '暂不删除'
                });
                popup.on("ok", function(){
                    //取消订单
                    var params = {
                        order_type: myorder.PAGIN.type
                    };
                    if(orderCode){
                        params.order_code = orderCode;
                    }
                    $this.addClass("dis");
                    T.POST({
                        action: "in_order/order_delete"
                        ,params: params
                        ,success: function(data){
                            T.msg("删除成功");
                            myorder.reload();
                            myorder.OrderNumQuery();
                        }
                    });
                    setTimeout(function () {
                        $this.removeClass("dis");
                    }, 15000)
                });
            }).delegate("a.apply-for-order", "click", function (e) {//提交申请
                var $item = $(this).closest("div.item");
                var orderCode = $item.attr("ocode");
                if (!orderCode) return;
                var order = T.Array.get(myorder.order_list, orderCode, 'order_code');
                if (!order) return;
                ApplyForOrder.reload(order, myorder.reload);
            }).delegate("a.cancel_order", "click", function (e) {//取消订单
                var $item = $(this).closest("div.item");
                var orderCode = $item.attr("ocode");
                if (!orderCode) return;
                var order = T.Array.get(myorder.order_list, orderCode, 'order_code');
                if (!order) return;
                myorder.OrderDetail(orderCode, function(order){
                    var text = '<h3 class="tit">订单取消申请：</h3>';
                    text += '<div class="input">取消原因：<select><option>商品选择错误</option><option>无法支付订单</option><option>其他</option></select></div>';
                    text += '<div class="red"><p>温馨提示：</p>';
                    text += '<p>· 订单成功取消后无法恢复；</p>';
                    text += '<p>· 订单已付金额将返还至现金账户；</p>';
                    text += '<p>· 使用的优惠券将直接返还。</p></div>';
                    var popup = new T.Popup({
                        fixed: true,
                        style: 'warning',
                        title: '取消订单 ',
                        width: 480,
                        content: '<dl class="popbox vertical_middle warning"><dt class="vm_left "></dt><dd class="vm_right">'+text+'</dd></dl>',
                        ok: '确定取消',
                        no: '暂不取消'
                    });
                    popup.on("ok", function(){
                        //取消订单
                        T.POST({
                            action: CFG_DS.myorder.cel
                            ,params: {order_code: orderCode}
                            ,success: function(data){
                                myorder.cancel($item, data);
                            }
                        });
                    });
                });
            }).delegate("a.up_help", "mouseenter", function (e) {
                var $this = $(this);
                $("#upload_text").css({top: $this.offset().top+28, left: $this.offset().left-260}).show();
                return false;
            }).delegate("a.up_help", "mouseleave", function (e) {
                $("#upload_text").hide();
            });
            $("#ofilter").delegate("li a", "click", function (e) { //筛选订单
                $("#ofilter li a").removeClass("sel");
                $(this).addClass("sel");
                myorder.isSearch = false;
                myorder.PAGIN.currentPage = 1;
                myorder.PAGIN.order_status = $(this).data("status");
                myorder.PAGIN.order_code = '';
                myorder.reload();
            });
            myorder.OrderNumQuery();
        },
        OrderNumQuery: function(){
            T.GET({
                action: COM_API.order_mun
                ,success: function(data){
                    T.BindData('data', data.design);
                }
                ,failure: function(data, params){}
                ,error: function(data, params){}
            });
        },
        OrderDetail: function(orderCode, callback){
            T.GET({
                action: CFG_DS.myorder.det
                ,params: {order_code: orderCode}
                ,success: function(data){
                    var _data = T.FormatData(data||{});
                    _data.order_list = _data.order_list||[];
                    if(callback)callback(_data.order_list[0]||{});
                }
            });
        },
        reload: function(params, isFirst){
            $("#template_order_list_view").html('<div class="loading"></div>');
            $("#paginbar").html("").addClass("hide");
            T.GET({
                action: CFG_DS.myorder.get
                ,params: params||myorder.PAGIN
                ,success: function(data){
                    if (data.orderList&&data.orderList.length>myorder.PAGIN.pageSize) {
                        data.totalCount = data.orderList.length;
                        data.orderList = data.orderList.slice((myorder.PAGIN.currentPage-1)*myorder.PAGIN.pageSize,myorder.PAGIN.currentPage*myorder.PAGIN.pageSize);
                    }
                    var _data = T.FormatData(data||{});
                    _data.order_list = _data.order_list||[];
                    _data.totalCount = _data.total_count||0;
                    myorder.order_list = _data.order_list;
                    _data.cancelCount = 0; //已取消的订单数
                    T.Each(myorder.order_list, function(i, order){
                        order.payable = true; //是否可支付
                        if(!T._OPERATOR_CODE){ //非代下单人员登录
                            if (order.pay_type == 4) { //信用支付未付服务费不可支付
                                order.payable = false
                            }
                            if (order.pay_type == 6) { //使用代金账户部分支付过不可支付
                                order.payable = false
                            }
                            if (order.pay_type == 7) { //阿米巴月结支付不可支付
                                order.payable = false
                            }
                        }
                        if (order.status == 2) {
                            _data.cancelCount++;
                        }
                        T.Each(order.order_product_list, function(k, product){
                            if(/*product.product_id==116 || product.product_id==117 || */product.product_id==134 || product.product_id==141 || product.product_id==116 || product.product_id==117){
                                product.status = -1;
                                product.status_str = order.status>0?"交易完成":"";
                            }
                            /*if(CFG_DB.NEWDSID && CFG_DB.NEWDSID.indexOf("|" + product.category_id + "|")>=0){
                                product._category_id = product.category_id;
                            }*/
                        });
                    });
                    _data.RMB = T.RMB;
                    //_data.TAKETYPE = CFG_DB.TAKETYPE;
                    //_data.PAYTYPE = CFG_DB.PAYTYPE;
                    _data.IMG = CFG_DB.IMG;
                    _data.DOMAIN = T.DOMAIN;
                    if (_data.order_list&&_data.order_list.length) {
                        T.Template('order_list', _data);
                    }else{
                        myorder.empty();
                    }
                    if(myorder.PAGIN.pageSize){
                        T.Paginbar({
                            num: 3,
                            size: myorder.PAGIN.pageSize,
                            total: Math.ceil(_data.totalCount / myorder.PAGIN.pageSize),
                            index: myorder.PAGIN.currentPage,
                            paginbar: 'paginbar',
                            callback: myorder.pagin
                        });
                    }
                    T.PageLoaded();
                }
            });
        },
        pagin: function (obj, index, size, total) {
            myorder.PAGIN.order_code = myorder.isSearch ? myorder.text : '';
            myorder.PAGIN.currentPage = index;
            myorder.reload();
        },
        cancel: function ($item) {
            T.msg('取消成功');
            /*$("ul .col7 p,ul .col7 .btn", $item).remove();
            $(".colspan1 .col2 .desc .ver", $item).remove();
            $("ul .col5", $item).html('<div class="ellipsis filename"></div>');
            $("ul .col7 div", $item).prepend("<p>订单已取消</p>");*/
            myorder.OrderNumQuery();
            myorder.reload();
            T.SetOrderStatus();
        },
        empty: function(){
            var dom = T.DOM.byId('template_order_list_view');
            if(dom)dom.innerHTML = '<div class="empty"><dl class="vertical_middle"><dt class="vm_left"></dt><dd class="vm_right">暂无数据</dd></dl></div>';
        }
    };
    T.Loader(function() {
        myorder.init();
        T.FORM().placeholder(T.DOM.byId('search_order_input'), "输入订单号");//输入订单号，商品名称
    });
});