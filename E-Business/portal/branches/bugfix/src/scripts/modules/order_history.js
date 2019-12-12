define(["base", "tools", "modules/reorder"], function($, T, reorder){
    //历史订单
    var order = {
        data: null,
        popup: null,
        PAGIN: {offset: 0, count: 10},
        reload: function(params, isFirst){
            order.PAGIN = params||order.PAGIN;
            T.GET({
                action: 'in_order/order_query_by_file'//'in_order/order_query'
                ,params: params||order.PAGIN//{order_code: '069078356729'}
                ,success: function (data) {
                    data.list = data.list||[];
                    data.order_count = data.list.length;
                    data.quantity_total = 0;
                    data.quantity_unit = '';
                    T.Each(data.list, function(k, v){
                        data.quantity_total += parseInt(v.quantity.replace(/\D/g, ''), 10)||0;
                        data.quantity_unit = v.quantity.replace(/\d/g, '');
                    });
                    data.quantity_total += data.quantity_unit;
                    if(data.quantity_total==0){
                        data.quantity_total = '';
                    }

                    if (data.list&&data.list.length>order.PAGIN.count) {
                        data.count = data.list.length;
                        data.list = data.list.slice(order.PAGIN.offset,order.PAGIN.offset+order.PAGIN.count);
                    }
                    var _data = T.FormatData(data||{});
                    _data.order_list = _data.list||[];
                    order.data = _data.order_list;

                    if(isFirst){
                        order.show(order.PAGIN);
                    }
                    T.Template('order_list', _data);
                    if(isFirst){
                        order.popup.setPosition();
                    }

                    if(order.PAGIN.count){
                        T.Paginbar({
                            num: 3,
                            size: order.PAGIN.count,
                            total: Math.ceil(_data.count / order.PAGIN.count),
                            index: Math.ceil(order.PAGIN.offset/order.PAGIN.count)+1,
                            paginbar: 'paginbar_order_list',
                            callback: order.pagin
                        });
                    }
                    //T.PageLoaded();
                }
            });
        },
        pagin: function (obj, index, size, total) {
            order.PAGIN.offset = (index-1)*order.PAGIN.count;
            order.reload(order.PAGIN);
        },
        show: function(params){
            order.popup = new T.Popup({
                id: 'history_order',
                zIndex: 1050,
                width: params.width||1220,
                title: '下单记录',
                type: 'html',
                content: '<div id="template_order_list_view" class="history_order"></div>',
                ok: '',
                no: ''
            });

            $("#template_order_list_view").delegate(".reorder", "click", function(e){
                var orderProductId = $(this).data("order_product_id")||"";
                if(!orderProductId)return;
                var orderProduct = T.Array.get(order.data, orderProductId, 'order_product_id');
                if(!orderProduct)return;debugger
                reorder.getPrice(orderProduct.product_id , {
                    card_id: order.PAGIN.card_id||'',
                    quantity: orderProduct.quantity,
                    product_name: orderProduct.product_name,
                    product_attr: orderProduct.product_attr,
                    sorce_file: order.PAGIN.file_name||'',
                    file_url: order.PAGIN.file_url||''
                });
            });
        }
    };
    return order;
});