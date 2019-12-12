define(["base", "tools"], function($, T){
    //再次下单
    var products = {
        data: {},
        popup: null,
        params: {},
        quantity_key: '',
        quantity_value: '',
        getPrice: function(pid, params){//查询产品
            products.params = params||{};
            T.POST({
                action: 'in_quotation/get_price',
                params: {//data:200013,300g铜版纸_2盒_90mm*54mm-覆哑膜_直角,1
                    type: "0",
                    data: [{
                        productId: pid,
                        productParam: params.product_attr,
                        productCount: 1,
                        address: (T.cookie("_address")||CFG_DB.DEF_PCD).replace(/\^+$/g, "")
                    }]
                },
                success: function(data) {
                    data = data||{};
                    if(data.data&&data.data[0]){
                        products.addCart(data.data[0]);
                    }
                },
                failure: function(data) {
                    T.alt(data.msg || '该商品已下架，请选择其他商品。', function(_o) {
                        _o.remove();
                    }, function(_o) {
                        _o.remove();
                        window.location = T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : '');
                    }, '返回首页');
                }
            });
        },
        addCart: function(product){
            T.POST({
                action: 'in_order/cart_add',
                params: {
                    buynow: '1',
                    data: [{
                        pnum: "1",
                        quantity: products.params.quantity,
                        //cid: product.categoryId||"",
                        pid: product.productId,
                        pattr: products.params.product_attr,
                        pname: products.params.product_name,
                        sorce_file: products.params.sorce_file,
                        file_url: products.params.file_url,
                        uploaded: "0",
                        buynow: "1",
                        address: (T.cookie("_address")||CFG_DB.DEF_PCD).replace(/\^+$/g, "")
                    }]
                },
                success: function(data, params){
                    window.location = T.DOMAIN.CART + "ordering.html?a=" + T.Params.encode(T.Base64.encode(T.Params.encode(data.date +","+ T.RMB(product.price))));
                }
            });
        }
    };
    return products;
});
