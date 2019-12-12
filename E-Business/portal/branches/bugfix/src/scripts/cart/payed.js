require(["base", "tools"], function ($, T) {
    if(!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    var paySourceDomain = T.cookie("pay_source_domain");
    var payed = {
        params: T.getRequest(),
        init: function () {
            T.GET({
                action: 'in_payment/pay_return'+location.search
                //,params: payed.params
                ,success: function(response){
                    if(response.orderCode){
                        T.GET({
                            action: CFG_DS.myorder.get
                            ,params: {order_code: response.orderCode}
                            ,success: function(data){
                                var _data = T.FormatData(data||{});
                                _data.order_list = _data.order_list||[];
                                _data.order = _data.order_list[0]||{};
                                if(_data.order.order_code){
                                    if(_data.order.type==10&&!paySourceDomain){
                                        payed.GoDatum(_data.order.order_code, _data.order.status, _data.order.type);
                                    }else{
                                        payed.GoDetail(_data.order.order_code, _data.order.status, _data.order.type);
                                    }
                                }else{
                                    window.location.replace((paySourceDomain||T.DOMAIN.WWW) + 'member/index.html' + (T.INININ?'?'+T.INININ:''));
                                }
                            }
                            ,failure: payed.failure
                            ,error: payed.failure
                        }, payed.failure, payed.failure);
                    }else{
                        payed.failure();
                    }
                }
                ,failure: payed.failure
                ,error: payed.failure
            }, payed.failure, payed.failure);
        },
        failure: function(data){
            window.location.replace((paySourceDomain||T.DOMAIN.WWW) + 'member/index.html'+(T.INININ?'?'+T.INININ:''));
        },
        GoDetail: function(order_code, order_status, order_type){
            window.location.replace((paySourceDomain||T.DOMAIN.WWW) + 'member/' + 'odetail.html?o=' + order_code +'&t=' + order_type +'&s='+order_status+(T.INININ?'&'+T.INININ:''));
        },
        GoDatum: function(order_code, order_status){
            window.location.replace((paySourceDomain||T.DOMAIN.WWW) + 'design/' + 'datum.html?o=' + order_code +'&s='+order_status+(T.INININ?'&'+T.INININ:''));
        }
    };
    T.Loader(function(){
        payed.init();
    });
});