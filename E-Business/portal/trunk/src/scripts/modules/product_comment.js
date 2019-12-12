define(["base", "tools"], function($, T){
    //商品评价
    var comment = {
        data: {
            product_quality: 0, //商品质量评分
            service_quality: 0, //服务质量评分
            delivery_time: 0 //交付周期评分
        },
        popup: null,
        callback: null, //成功后回调
        reload: function(params, callback){
            var _this = this;
            params = params || {};
            if(!params.ocode || !params.opid || !params.pid || !params.pname){
                return;
            }
            _this.data.product_quality = 0;
            _this.data.service_quality = 0;
            _this.data.delivery_time = 0;
            _this.data.order_code = params.ocode;
            _this.data.order_product_id = params.opid;
            _this.data.product_id = params.pid;
            _this.data.product_name = params.pname;
            _this.callback = callback;
            _this.show();
            T.Template('comment_panel', {});
            _this.bindEvents();

        },
        bindEvents: function(){
            var _this = this;
            _this.popup.on("ok", function(){
                if(!_this.data.product_quality||!_this.data.service_quality||!_this.data.delivery_time){
                    T.msg('请对商品质量、服务质量和交货周期评分！');
                    return false;
                }
                var product_text = $.trim($('#productComment').val());
                var service_text = $.trim($('#serviceComment').val());
                if(product_text){
                    _this.data.product_comment = product_text;
                }
                if(service_text){
                    _this.data.service_comment = service_text;
                }
                T.POST({
                    action: 'in_order/product_comment_create',
                    params: _this.data,
                    success: function(data){
                        T.msg('评价成功！');
                        if(_this.callback){
                            _this.callback();
                        }
                    }
                });
            });
            $("#template_comment_panel_view").on("click", ".col", function(e){
                var cl = $(this).data('index'), color = '', text = '';
                var $p = $(this).closest('p');
                $p.find('.col').removeClass('star-gray').removeClass('star-orange').removeClass('star-red');
                $(this).nextAll('.star-dsc').remove();
                switch(cl){
                    case 1: {
                        color = 'gray';
                        text = '<span class="star-dsc">失望</span>';}
                        break;
                    case 2: {
                        color = 'gray';
                        text = '<span class="star-dsc">不满</span>';}
                        break;

                    case 3: {
                        color = 'orange';
                        text = '<span class="star-dsc yellow">一般';}
                        break;
                    case 4: {
                        color = 'orange';
                        text = '<span class="star-dsc yellow">满意';}
                        break;
                    case 5: {
                        color = 'red';
                        text = '<span class="star-dsc red">惊喜</span>';}
                        break;
                }
                if($p.data('type') == 1){
                    _this.data.product_quality = cl;
                }else if($p.data('type') == 2){
                    _this.data.service_quality = cl;
                }else if($p.data('type') == 3){
                    _this.data.delivery_time = cl;
                }
                $(this).addClass('star-'+color).prevAll('.col').addClass('star-'+color);
                $(this).closest('p').append(text);
            });
        },
        show: function(){
            var _this = this;
            _this.popup = new T.Popup({
                id: 'product_comment',
                zIndex: 1050,
                width: 900,
                title: '商品评价',
                type: 'html',
                content: '<div id="template_comment_panel_view" class="comment-panel"></div>',
                ok: '提交评价',
                no: '取消'
            });
        }
    };
    return comment;
});