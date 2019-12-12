!(function(window, document, undefined) {
    "use strict";
    document.title =  "订单详情-供应商平台";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var order_details = {
        domNode: $('.page-order-details'),
        order: {}, //当前订单
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            _this.render();
            _this.queryOrderDetails();
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            _this.domNode.on('click', '#template-order_details-view button', function(){
                if($(this).data('attr') == 'download'){ //下载可印刷文件
                    var $this = $(this),
                        $td = $this.closest('td'),
                        $tr = $(this).closest('tr'),
                        product_attr = $td.data('product_attr'),
                        product_url = $td.data('product_url'),
                        download_filename = $td.data('download_filename'),
                        print_flag = $this.data('print_flag'),
                        url = '';
                    //download_filename = download_filename.match(/.+\./);
                    //url = product_url + '?download/' + download_filename +  product_url.replace(/.+\./, "");
                    url = product_url + '?download/' + download_filename;
                    var $view = T.Template('confirm_attr', 'modal_content', {attr: product_attr, url: url});
                    $view.on('click', '.save', function(){
                        if(!print_flag){
                            T.POST({
                                action: CFG.API.order.update,
                                params: {
                                    order_product_id: $tr.data('product_id'),
                                    order_code: _this.order.orderCode,
                                    user_name: _this.order.userName,
                                    print_file_download_flag: '1',
                                    username: T.Cookie.get('_a_name'),
                                    fromSystem: '2'
                                },
                                success: function(res){
                                    console.log(res);
                                    $this.after('<span class="badge">已下载</span>');
                                    $this.data('print_flag', '1');
                                }
                            });
                        }
                        $('#myModal').modal('hide');
                    });
                    $('#myModal').modal('show');
                }
            });
            $('#getBack').on('click', function(){ //返回
                T.PlatformRedirect(T.DOMAIN.WWW + 'order/order.html?type='+T.REQUESTS.product_status+'', true);
            });
            //确认订单
            $('#confirm_order').on('click',function(){
                T.Template('o_product_list','product_list1',_this.order);
                $('#goProduction').checkboxs("checkbox", "checkbox_all", function(input, value){//点击回调

                });
                $('#goProduction').modal('show');
            });
            //确认并进入生产
            $('#goProduction').on('click', '.modal-footer button', function(){
                var arr = [],
                    ids = ''; //商品id集合
                $('#goProduction').find('.checkbox input:checked').each(function(index, ele){
                    var product_id = $(this).data('product_id');
                    if(product_id){
                        arr.push(product_id);
                    }
                });
                ids = arr.join(';');
                if(ids){
                    _this.orderUpdate(ids, 'production');
                    $('#goProduction').modal('hide');
                }else{
                    T.msg('没有可供生产的商品！');
                }
            });
            //拒单
            $('#refuse_order').on('click',function(){
                T.Template('o_product_list','product_list2',_this.order);
                $('#refuseProduction').checkboxs("checkbox", "checkbox_all", function(input, value){//点击回调

                });
                $('#refuseProduction').modal('show');
            });
            //确认拒单
            $('#refuseProduction').on('click', '.modal-footer button', function(){
                var arr = [],
                    ids = '', //商品id集合
                    refuseReason = $('#refuseProduction input[name=refuseReason]:checked').val();
                $('#refuseProduction').find('.checkbox input:checked').each(function(index, ele){
                    var product_id = $(this).data('product_id');
                    if(product_id){
                        arr.push(product_id);
                    }
                });
                ids = arr.join(';');
                if(ids){
                    if(!refuseReason){
                        T.msg('请选择拒单原因！');
                        return;
                    }
                    if(refuseReason == '其他'){
                        if(!$.trim($('#oRefuseReason').val())){
                            T.msg('请输入其他原因！');
                            return;
                        }else{
                            refuseReason = $.trim($('#oRefuseReason').val());
                        }
                    }
                    _this.orderUpdate(ids, 'refuse', refuseReason);
                    $('#refuseProduction').modal('hide');
                }else{
                    T.msg('未选择商品！');
                }
            });
        },
        /**
         * 渲染页面
         */
        render: function(){
            var _this = this,
                canProduct = false,
                orderProductList = _this.order.orderProductList || [];
            T.Template('order_details', _this.order);
            $('#orderStatus').text(_this.order.statusStr || '');
            for(var i= 0,l=orderProductList.length; i<l; i++){
                if(_this.order.status && orderProductList[i].status == 2 &&　orderProductList[i].supplierRefuseFlag!=1){
                    canProduct = true;
                    break;
                }
            }
            if(canProduct){ //显示确认订单和拒单按钮
                $('#confirm_order').removeClass('hide');
                $('#refuse_order').removeClass('hide');
            }else{
                $('#confirm_order').addClass('hide');
                $('#refuse_order').addClass('hide');
            }
        },
        /**
         * 获取订单详情
         */
        queryOrderDetails: function(){
            var _this = this,
                req = T.REQUESTS,
                params = {};
            if(req.order_code){
                params.order_code = req.order_code;
            }
            if(req.record_time){
                params.record_time = decodeURIComponent(req.record_time);
            }
            if(!params.order_code || !params.record_time){
                return;
            }
            T.GET({
                action: CFG.API.order.query_one,
                params: params,
                success: function(res){
                    _this.order = res.orderList? res.orderList: {};
                    //页面展示的联系人信息和收货地址处理
                    if (_this.order.orderProductList&&_this.order.orderProductList.length>0){
                        var product = _this.order.orderProductList[0];
                        if(product.supplierShipMethod==1){
                            _this.order.actualReceiveName = product.supplierShipContacts;
                            _this.order.actualReceiveMobile = product.supplierShipContactsPhone;
                            _this.order.actualReceiveAddress = product.supplierShipAddress.replace(/\^/g, '');
                            _this.order.actualTakeTypeStr = product.supplierDeliveryName||'';
                        }else if(product.supplierShipMethod==2){
                            _this.order.actualReceiveName = product.takeAddress.split('（')[0];
                            _this.order.actualReceiveMobile = product.takeAddress.substring(product.takeAddress.indexOf('联系电话：')+5, product.takeAddress.length-1);
                            _this.order.actualReceiveAddress = product.takeAddress.replace(/\^/g, '');
                            _this.order.actualTakeTypeStr = product.supplierDeliveryName||'';
                        }else{
                            _this.order.actualReceiveName = _this.order.receiveName;
                            _this.order.actualReceiveMobile = _this.order.receiveMobile;
                            _this.order.actualReceiveAddress = _this.order.receiveAddress.replace(/\^/g, '');
                            _this.order.actualTakeTypeStr = product.takeTypeStr||'';
                        }
                    }
                    _this.render();
                    _this.bindEvents();
                    console.log(res);
                }
            });
        },
        /**
         * 更改商品状态
         * @param {String} ids 商品id集合
         * @param {String} type 操作类型
         * @param {String} remark 备注信息
         */
        orderUpdate: function(ids, type, remark){
            var _this = this,
                params = {};
            params.order_product_id = ids;
            params.order_code = _this.order.orderCode;
            params.user_name = _this.order.userName;
            params.username = T.Cookie.get('_a_name');
            params.fromSystem = '2';
            if(type == 'production'){
                params.status = 3; //生产中
                params.remark = '';
            }else if(type == 'refuse'){
                params.supplier_refuse_flag = 1; //已拒单
                params.remark = remark;
            }
            T.loading();
            T.POST({
                action: CFG.API.order.update,
                params: params,
                success: function(res){
                    console.log(res);
                    T.loading('true');
                    T.msg('操作成功！');
                    _this.queryOrderDetails();
                }
            });
        }
    };
    order_details.init();
}(window, document));