require(["base", "tools", "modules/product_comment", "modules/receive_goods", "modules/design_editor", "modules/apply_for_order"], function ($, T, Comment, Receive, DesignEditor, ApplyForOrder) {
    /*
     订单状态：
     0=待支付（提交订单）
     1=已支付（包括货到付款）同时改变商品状态（待审核）
     2=订单已取消
     3=交易完成
     订单商品状态：
     #0=待审核(订单支付成功之后)
     #1=审核不通过
     2=审核通过
     3=生产中
     4=配送中(已发货)
     5=已送达(已签收)
     6=已退款
     #10=待上传
     @11=已上传
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
        PAGIN: {type: '0', pageSize: 10, currentPage: 1, order_status: ''},
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
            myorder.PAY_TYPE_STRING = ',' + myorder.PAY_TYPE_ARRAY.join(',') + ',';

            myorder.reload(data, true);

            $("#search_order_input").bind("keydown.search", function (e) {
                if ($.trim($(this).val()) && e.keyCode == 13) {
                    $(this).siblings(".search_btn").click();
                }
            });
            $("#ofilter").delegate(".searchbar .search_btn", "click.search", function (e) {//过滤订单
                myorder.text = $("#search_order_input").val();
                if (!myorder.text) return;
                myorder.isSearch = true;
                myorder.PAGIN.currentPage = 1;
                myorder.PAGIN.order_code = myorder.text || '';
                myorder.reload();
            });
            $("#myorder").delegate("a.comment", "click", function (e) {
                var $item = $(this).closest('ul');
                Comment.reload({
                    ocode: $item.attr('ocode'),
                    opid: $item.attr('opid'),
                    pid: $item.attr('pid'),
                    pname: $item.attr('pname')
                }, myorder.reload);
            }).on("click.filename", ".filename[data-card_id]", function (e) {
                var $this = $(this);
                DesignEditor({
                    cardId: $this.data("card_id") || ""
                });
                return false;
            }).delegate("a.delete:not(.dis), a.delete-all:not(.dis)", "click", function (e) {//删除订单
                var $this = $(this);
                var orderCode = "";
                if ($this.hasClass("delete")) {
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
                    content: '<dl class="popbox vertical_middle warning"><dt class="vm_left "></dt><dd class="vm_right">' + text + '</dd></dl>',
                    ok: '确定删除',
                    no: '暂不删除'
                });
                popup.on("ok", function () {
                    //取消订单
                    var params = {
                        order_type: myorder.PAGIN.type
                    };
                    if (orderCode) {
                        params.order_code = orderCode;
                    }
                    $this.addClass("dis");
                    T.POST({
                        action: "in_order/order_delete"
                        , params: params
                        , success: function (data) {
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
            }).delegate("a.receive_goods", "click", function (e) {//确认收货
                var $item = $(this).closest("div.item");
                var orderCode = $item.attr("ocode");
                if (!orderCode) return;
                var order = T.Array.get(myorder.order_list, orderCode, 'order_code');
                if (!order) return;
                Receive.reload(order, myorder.reload);
            }).delegate("a.cancel_order", "click", function (e) {//取消订单
                var $item = $(this).closest("div.item");
                var orderCode = $item.attr("ocode");
                if (!orderCode) return;
                var order = T.Array.get(myorder.order_list, orderCode, 'order_code');
                if (!order) return;
                myorder.OrderDetail(orderCode, function (order) {
                    var text = '<h3 class="tit">订单取消申请：</h3>';
                    text += '<div class="input">取消原因：<select><option>商品选择错误</option><option>商品数量选择错误</option><option>收货人信息有误</option><option>无法支付订单</option><option>其他</option></select></div>';
                    text += '<div class="red"><p>温馨提示：</p>';
                    text += '<p>· 订单成功取消后无法恢复；</p>';
                    text += '<p>· 订单已付金额将返还至现金账户；</p>';
                    text += '<p>· 使用的优惠券将直接返还。</p></div>';
                    var popup = new T.Popup({
                        fixed: true,
                        style: 'warning',
                        title: '取消订单 ',
                        width: 480,
                        content: '<dl class="popbox vertical_middle warning"><dt class="vm_left "></dt><dd class="vm_right">' + text + '</dd></dl>',
                        ok: '确定取消',
                        no: '暂不取消'
                    });
                    popup.on("ok", function (o) {
                        o.remove();
                        //取消订单
                        T.POST({
                            action: CFG_DS.myorder.cel
                            , params: {order_code: orderCode}
                            , success: function (data) {
                                myorder.cancel($item, data);
                            }
                        });
                    });
                });
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

            T.TIP({
                container: '#template_order_list_view', trigger: '.up_help', content: function (trigger) {
                    return '预计出货时间是指商品生产完成的时间，不包含<a class="lnk" href="' + T.DOMAIN.FAQ + 'distribution.html" target="_blank">配送时间</a>。';
                }, offsetX: 0, offsetY: 0
            });
            T.TIP({
                container: '#template_order_list_view', trigger: '.not_pass', content: function (trigger) {
                    return $(trigger).data("value") || "";
                }, offsetX: 0, offsetY: 0
            });
        },
        OrderNumQuery: function () {
            T.GET({
                action: COM_API.order_mun
                , params: {type: '0'}
                , success: function (data) {
                    T.BindData('data', data.common);
                }
                , failure: function (data, params) {
                }
                , error: function (data, params) {
                }
            });
        },
        OrderDetail: function (orderCode, callback) {
            T.GET({
                action: CFG_DS.myorder.det
                , params: {order_code: orderCode}
                , success: function (data) {
                    var _data = T.FormatData(data || {});
                    _data.order_list = _data.order_list || [];
                    if (callback) callback(_data.order_list[0] || {});
                }
            });
        },
        reload: function (params, isFirst) {
            $("#template_order_list_view").html('<div class="loading"></div>');
            $("#paginbar").html("").addClass("hide");
            T.GET({
                action: CFG_DS.myorder.get
                , params: params || myorder.PAGIN
                , success: function (data) {
                    if (data.orderList && data.orderList.length > myorder.PAGIN.pageSize) {
                        data.totalCount = data.orderList.length;
                        data.orderList = data.orderList.slice((myorder.PAGIN.currentPage - 1) * myorder.PAGIN.pageSize, myorder.PAGIN.currentPage * myorder.PAGIN.pageSize);
                    }
                    var _data = T.FormatData(data || {});
                    _data.order_list = _data.order_list || [];
                    _data.totalCount = _data.total_count || 0;
                    _data.cancelCount = 0; //已取消的订单数
                    T.Each(_data.order_list, function (m, order) {
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
                        var is_cancel = true, is_upload = true, is_receive = false;
                        order._upload_count = 0;
                        //是否为安装服务
                        order._IsInstallService = 0;
                        T.Each(order.order_product_list, function (n, product) {
                            product._is_cancel = (order.status == 0 || order.status == 1) && (product.status == 1 || (product.status == 0 && !product.reviewer) || product.status == 10 || product.status == 11);
                            is_cancel = is_cancel && product._is_cancel;
                            product._is_upload = (order.status == 0 || order.status == 1) && (product.status == 1 || (product.status == 0 && !product.reviewer) || product.status == 10 || product.status == 11);
                            is_upload = is_upload && product._is_upload;
                            product._is_receive = order.status == 1 && product.status == 4;
                            is_receive = is_receive || product._is_receive;

                            if (product.file_url || product.sorce_file) order._upload_count++;
                            //是否为安装服务
                            if (T.IsInstallService(product.product_id)) {
                                product._IsInstallService = 1;
                                order._IsInstallService++;
                            }
                            product.sorce_file = (product.sorce_file || product.file_url || "").replace(/^.*\//, '');
                        });
                        order._is_cancel = is_cancel;
                        order._is_upload = is_upload;
                        order._is_receive = is_receive;
                    });
                    myorder.order_list = _data.order_list;
                    _data.FDDID = CFG_DB.FDDID;
                    _data.RMB = T.RMB;
                    //_data.TAKETYPE = CFG_DB.TAKETYPE;
                    //_data.PAYTYPE = CFG_DB.PAYTYPE;
                    _data.IMG = CFG_DB.IMG;
                    _data.DOMAIN = T.DOMAIN;
                    _data.DeliveryDate = T.DeliveryDate;
                    if (_data.order_list && _data.order_list.length) {
                        T.Template('order_list', _data);
                    } else {
                        myorder.empty();
                    }
                    if (myorder.PAGIN.pageSize) {
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
            $("ul .col5", $item).html('<div class="ellipsis filename">__________</div>');
            $("ul .col7 div", $item).prepend("<p>订单已取消</p>");*/
            myorder.OrderNumQuery();
            myorder.reload();
            T.SetOrderStatus();
        },
        queryOrderProduct: function ($upload_button, params, success) {
            T.GET({
                action: CFG_DS.myorder.det
                , params: {order_code: params.order_code}
                , success: function (data) {
                    var _data = T.FormatData(data || {});
                    var order_list = _data.order_list || [];
                    var order = order_list[0] || {};
                    var order_product_list = order.order_product_list || [];
                    var product = T.Array.get(order_product_list, params.order_product_id, 'order_product_id');
                    if (product) {
                        $(".status_str", $upload_button.closest("ul")).text(product.status_str || '');
                        var html = '<div class="ellipsis filename"><a href="' + product.file_url + '?download/' + product.sorce_file + '" title="' + product.sorce_file + '" target="_blank">' + product.sorce_file + '</a></div>';
                        var msg = success ? '上传文件成功。' : '上传文件失败，请稍后重新上传。';
                        if (order.status == 0) {
                            msg = success ? msg : '上传文件成功，请尽快支付，以便我们尽快为您安排生产。';
                        } else if (order.status == 2) {
                            msg = success ? msg : '该商品订单已取消，不能上传文件。';
                        }
                        if ((order.status == 1 && (product.status == 1 || product.status == 10 || (product.status == 0 && !product.reviewer))) || order.status == 0) {
                            $(".uploadify-button-text,.utxt", $upload_button).text(product.file_url ? "重新上传" : "上传文件");
                            $upload_button.siblings(".ellipsis").remove();
                            $upload_button.after(html);
                        } else {
                            msg = success ? msg : '该商品已进入“' + product.status_str + '”流程，不能上传文件，如要重新上传文件请联系客服。';
                            $upload_button.closest(".col5 div").html(html);
                        }
                        if (success) {
                            T.msg(msg);
                        } else {
                            T.alt(msg);
                        }
                    }
                }
            });
        },
        empty: function () {
            var dom = T.DOM.byId('template_order_list_view');
            if (dom) dom.innerHTML = '<div class="empty"><dl class="vertical_middle"><dt class="vm_left"></dt><dd class="vm_right">暂无数据</dd></dl></div>';
        }
    };
    T.Loader(function () {
        myorder.init();
        T.FORM().placeholder(T.DOM.byId('search_order_input'), "输入订单号");//输入订单号，商品名称
    });
});