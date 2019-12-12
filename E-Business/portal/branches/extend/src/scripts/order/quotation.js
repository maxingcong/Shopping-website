require(["base", "tools"], function ($, T) {
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
        PAGIN: {
            type:'20',
            index: 0,
            offset: 10,
            //inquirer: T._ACCOUNT,
            status:''
        },
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
                myorder.PAGIN.index = 0;
                myorder.PAGIN.id = myorder.text||'';
                myorder.reload();
            });
            $("#myorder").delegate("a.delete:not(.dis), a.delete-all:not(.dis)", "click", function (e) {//删除订单
                var $this = $(this);debugger
                var orderCode = "";
                if($this.hasClass("delete")){
                    var $item = $(this).closest("div.item");
                    orderCode = $item.attr("ocode");
                    if (!orderCode) return;
                    var order = T.Array.get(myorder.quotation_list, orderCode, 'id');
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
                    var params = {};
                    if(orderCode){
                        params.id = orderCode;
                    }
                    $this.addClass("dis");
                    T.POST({
                        action: "in_quotation/quotation_delete"
                        ,params: params
                        ,success: function(data){
                            T.msg("删除成功");
                            myorder.reload();
                        }
                    });
                    setTimeout(function () {
                        $this.removeClass("dis");
                    }, 15000)
                });
            }).delegate("a.cancel_order", "click", function (e) {//取消订单
                var $item = $(this).closest("div.item");
                var orderCode = $item.attr("ocode");
                if (!orderCode) return;
                var order = T.Array.get(myorder.quotation_list, orderCode, 'id');
                if (!order) return;
                //取消订单
                T.cfm("询价单取消后将不可恢复，是否确认取消？", function(_o){
                    _o.remove();
                    //取消订单
                    T.POST({
                        action: "in_quotation/cancel_quotation"
                        ,params: {id:orderCode, update_point: "User"}
                        ,success: function(data){
                            myorder.cancel($item, data);
                        }
                    });
                }, function(_o){
                    _o.remove();
                }, '温馨提示','确定取消','暂不取消');
            }).delegate("a.up_help", "mouseenter", function (e) {
                var $this = $(this);
                $("#upload_text").css({top: $this.offset().top+28, left: $this.offset().left-260}).show();
                return false;
            }).delegate("a.up_help", "mouseleave", function (e) {
                $("#upload_text").hide();
            })/*.delegate(".add_cart", "click", function (e) { //询价单商品加入购物车
                var $this = $(this), id = $this.data("id")||'';
                myorder.addCart(1, id);
            })*/;
            $("#ofilter").delegate("li a", "click", function (e) { //筛选订单
                $("#ofilter li a").removeClass("sel");
                $(this).addClass("sel");
                myorder.isSearch = false;
                myorder.PAGIN.index = 0;
                myorder.PAGIN.status = $(this).data("status")||"";
                myorder.PAGIN.id = '';
                myorder.reload();
            });
        },
        reload: function(params, isFirst){
            $("#template_order_list_view").html('<div class="loading"></div>');
            $("#paginbar").html("").addClass("hide");
            T.GET({
                action: "in_quotation/quotation_list_front"
                ,params: params||myorder.PAGIN
                ,success: function(data){
                    if (data.quotationList&&data.quotationList.length>myorder.PAGIN.offset) {
                        data.count = data.quotationList.length;
                        data.quotationList = data.quotationList.slice(myorder.PAGIN.index*myorder.PAGIN.offset,(myorder.PAGIN.index+1)*myorder.PAGIN.offset);
                    }
                    data.statusNum = data.statusNum||{};
                    var statusNum = {
                        draft: data.statusNum.Draft||0,
                        expired: data.statusNum.Expired||0,
                        canceled: data.statusNum.Canceled||0,
                        done: data.statusNum.Done||0
                    };
                    if(!myorder.PAGIN.status){
                        data.count = statusNum.draft + statusNum.expired + statusNum.canceled + statusNum.done;
                    }else{
                        data.count = data.statusNum[myorder.PAGIN.status]||0;
                    }
                    data.statusNum = statusNum;
                    var _data = T.FormatData(data||{});
                    _data.quotation_list = _data.quotation_list||[];
                    myorder.quotation_list = _data.quotation_list;
                    _data.cancelCount = 0; //已取消的订单数
                    T.Each(_data.quotation_list, function(i, order){
                        if (order.status == "Canceled") {
                            _data.cancelCount++;
                        }
                    });
                    _data.RMB = T.RMB;
                    //_data.TAKETYPE = CFG_DB.TAKETYPE;
                    //_data.PAYTYPE = CFG_DB.PAYTYPE;
                    _data.IMG = CFG_DB.IMG;
                    _data.DOMAIN = T.DOMAIN;
                    if (_data.quotation_list&&_data.quotation_list.length) {
                        T.Template('order_list', _data);
                    }else{
                        myorder.empty();
                    }
                    T.BindData('data', _data.status_num||{});
                    if(myorder.PAGIN.offset){
                        T.Paginbar({
                            num: 3,
                            size: myorder.PAGIN.offset,
                            total: Math.ceil(_data.count / myorder.PAGIN.offset),
                            index: Math.ceil(myorder.PAGIN.index/myorder.PAGIN.offset) + 1,
                            paginbar: 'paginbar',
                            callback: myorder.pagin
                        });
                    }
                    T.PageLoaded();
                }
            });
            T.GET({
                action: "in_quotation/read_quotation"
                ,success: function(data){
                    T.BindData('data', {
                        new_count: data.num||0
                    });
                }
                ,failure: function(data, params){}
                ,error: function(data, params){}
            },function(data){},function(data){});
        },
        pagin: function (obj, index, size, total) {
            myorder.PAGIN.id = myorder.isSearch ? myorder.text : '';
            myorder.PAGIN.index = (index-1)*10;
            myorder.reload();
        },
        /*//询价单商品加入购物车
        addCart: function(buynow, id){ //buynow：1，立即购买
            var order = T.Array.get(myorder.quotation_list, id, "id");
            if(!order)return;
            T.POST({
                action: "in_order/cart_quotation_add",
                params: {
                    buynow: buynow||0,
                    quotation_id: order.id,
                    quotation_sub_id: order.quotation_sub_id,
                    address: (T.cookie("_address")||CFG_DB.DEF_PCD).replace(/\^+$/g, "")
                },
                success: function(data, params) {
                    window.location = T.DOMAIN.CART + "ordering.html?a=" + T.Params.encode(T.Base64.encode(T.Params.encode(data.cartIds)));
                }
            });
        },*/
        cancel: function ($item) {
            T.msg('取消成功');
            $("ul .col7 p,ul .col7 .btn", $item).remove();
            $(".colspan1 .col2 .desc .ver", $item).remove();
            $("ul .col5", $item).html('<div class="ellipsis filename"></div>');
            $("ul .col7 div", $item).append("<p>已取消</p>");
            myorder.reload();
        },
        empty: function(){
            var dom = T.DOM.byId('template_order_list_view');
            if(dom)dom.innerHTML = '<div class="empty"><dl class="vertical_middle"><dt class="vm_left"></dt><dd class="vm_right">暂无数据</dd></dl></div>';
        }
    };
    T.Loader(function() {
        myorder.init();
        T.FORM().placeholder(T.DOM.byId('search_order_input'), "输入询价单编号");//输入订单号，商品名称
    });
});