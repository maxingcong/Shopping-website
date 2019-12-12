define(["base", "tools"], function($, T){
    //确认收货
    var receive = {
        data: null,
        popup: null,
        callback: null,
        reload: function(data, callback){
            var _this = this;
            if(!data){
                return;
            }
            _this.data = data;
            console.log(_this.data);
            _this.callback = callback;
            _this.show();
            data.RMB = T.RMB;
            T.Template('receive_panel', _this.data);
            _this.bindEvents();
        },
        bindEvents: function(){
            var _this = this;
            _this.popup.on("ok", function(){
                var opid = [];
                var $checkbox = $('.table_view .checkbox', '#template_receive_panel_view');
                $checkbox.each(function(index, domEle){
                    if($(domEle).hasClass('sel')){
                        opid.push($(domEle).data('opid'));
                    }
                });
                if(!opid.length){
                    T.msg('请先选择确认收货的商品！');
                    return false;
                }
                T.POST({
                    action: 'in_order/sign_update_for_web',
                    params: {
                        order_product_id: opid.join(';'),
                        order_code: _this.data.order_code
                    },
                    success: function(data){
                        T.msg('操作成功！');
                        if(_this.callback){
                            _this.callback();
                        }
                    }
                });
            });
            var $cont = $('#template_receive_panel_view');
            $cont.delegate('.checkbox', 'click', function(){
                if($(this).hasClass('sel')){
                    $(this).removeClass('sel');
                    if($(this).hasClass('checkbox_all')){
                        $('.table_view .checkbox', $cont).removeClass('sel');
                    }else{
                        $('.checkbox_all', $cont).removeClass('sel');
                    }
                }else{
                    $(this).addClass('sel');
                    if($(this).hasClass('checkbox_all')){
                        $('.table_view .checkbox', $cont).addClass('sel');
                    }else{
                        var all = true;
                        $('.table_view .checkbox', $cont).each(function(index, domEle){
                            if(!$(domEle).hasClass('sel')){
                                all = false;
                                return false;
                            }
                        });
                        if(all){
                            $('.checkbox_all', $cont).addClass('sel');
                        }
                    }
                }
            });
        },
        show: function(){
            var _this = this;
            _this.popup = new T.Popup({
                id: 'receive_goods',
                zIndex: 1050,
                width: 900,
                title: '确认收货',
                type: 'html',
                content: '<div id="template_receive_panel_view" class="receive_panel checkboxs"></div>',
                ok: '确认收货',
                no: '取消'
            });
        }
    };
    return receive;
});