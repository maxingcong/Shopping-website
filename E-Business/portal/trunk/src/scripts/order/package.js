require(["base", "tools", "modules/apply_for_order"], function ($, T, ApplyForOrder) {
    /*
     订单状态：
     0=待支付（提交订单）
     1=已支付（包括货到付款）同时改变商品状态（待审核）
     2=订单已取消
     3=交易完成
     订单商品状态：
     0=待审核(订单支付成功之后)
     1=审核不通过
     2=审核通过
     3=生产中
     4=配送中(已发货)
     5=已送达(已签收)
     6=已退款
     10=待上传
     11=已上传
     15=待发货(生产完)
     20=待售后处理
     25=待重印
     */
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    var myorder = {
        uuid: T.UUID(),
        popup: null,
        text: '',
        isSearch: false,
        PAGIN: {type:'5', currentPage: 1, pageSize: 10, order_status:''},
        init: function (data) {
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
                T.cfm('订单取消后将不可恢复，是否确认取消？', function(_o){
                    _o.remove();
                    T.POST({
                        action: CFG_DS.myorder.cel
                        ,params: {order_code: orderCode}
                        ,success: function(data){
                            myorder.cancel($item, data);
                        }
                    });
                }, function(_o){
                    _o.remove();
                }, '温馨提示','确定取消','暂不取消');
            }).delegate("a.order_links", "click", function (e) {//选择以上传文件
                myfile.show({category_id: $(this).data("category_id")}, $(this).closest(".upload_button"));
                return false;
            }).delegate("a.up_help", "mouseenter", function (e) {
                var $this = $(this);
                $("#upload_text").css({top: $this.offset().top+25, left: $this.offset().left-205}).show();
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
                    T.BindData('data', data.plan);
                }
                ,failure: function(data, params){}
                ,error: function(data, params){}
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
                    _data.RMB = T.RMB;
                    //_data.TAKETYPE = CFG_DB.TAKETYPE;
                    //_data.PAYTYPE = CFG_DB.PAYTYPE;
                    _data.IMG = CFG_DB.IMG;
                    _data.DOMAIN = T.DOMAIN;
                    _data.cancelCount = 0; //已取消的订单数
                    T.Each(_data.order_list, function(m, order) {
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
                    });
                    myorder.order_list = _data.order_list;
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