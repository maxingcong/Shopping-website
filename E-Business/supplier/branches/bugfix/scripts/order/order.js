!(function(window, document, undefined) {
    "use strict";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var order = {
        domNode: $('.page-order'),
        data: {
            index: 1, //当前页码
            offset: 10, //每页条数
            product_status: "2", //订单商品类型
            order_status: "", //订单状态
            start_time: "", //开始时间
            end_time: "" //结束时间
        },
        orderList: [],  //订单列表
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            var product_status = T.REQUESTS.type;
            _this.initUI();
            _this.render();
            if(product_status){
                _this.data.product_status = product_status;
                _this.setActive(product_status);
                $('#productStatus').val(product_status);
            }
            _this.queryOrderList();
            _this.bindEvents();
        },

        initUI: function(){
            var _this = this,
                date_range = T.getDateRange(-60, 'day'),
                start_time = date_range.startDate,
                end_time = date_range.endDate;
            _this.startTime = $('#startTime').datetimepicker({
                format: 'yyyy-mm-dd',
                language: 'zh-CN',
                autoclose: true,
                weekStart: 1,
                startView: 2,
                minView: 2,
                forceParse: false,
                initialDate: start_time,
                endDate: new Date()
            });
            _this.endTime = $('#endTime').datetimepicker({
                format: 'yyyy-mm-dd',
                language: 'zh-CN',
                autoclose: true,
                weekStart: 1,
                startView: 2,
                minView: 2,
                forceParse: false,
                initialDate: end_time,
                endDate: new Date()
            });
            $('#startTime').val(start_time);
            $('#endTime').val(end_time);
            _this.data.start_time = start_time;
            _this.data.end_time = end_time;
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            _this.domNode.on('click', '.nav-tabs li>a', function(e){ //tabs
                _this.data.product_status = $(this).data('product_status');
                $('#productStatus').val($(this).data('product_status'));
                _this.queryOrderList();
            }).on('click', 'a.go-details', function(){
                var detail_url = $(this).data('detail_url');
                if(detail_url){
                    T.PlatformRedirect(detail_url, true);
                }
            }).on('click', '.tab-content button', function(){
                var attr = $(this).data('attr'),
                    $tb = $(this).closest('table'),
                    order_code = $tb.data('order_code');
                if(attr == 'confirm' || attr == 'details'){ //订单详情
                    var detail_url = $(this).data('detail_url');
                    if(detail_url){
                        T.PlatformRedirect(detail_url, true);
                    }
                }else if(attr == 'delivery'){ //发货
                    var obj = T.Array.get(_this.orderList, order_code, 'orderCode')||{};
                    var $view = T.Template('delivery_products', 'modal_content', obj);
                    var dom = document.getElementById('deliverySelect');
                    if(dom){
                        //下拉框初始化
                        T.SetSelectOptions(dom,{
                            data: CFG.LOGISTICS,
                            key: 'name',
                            val: 'name'
                        });
                    }
                    $view.checkboxs("checkbox", "checkbox_all", function(input, value){//点击回调

                    });
                    $view.on('click', '#confirmDelivery', function(){ //发货对话框--确认发货
                        var arr = [],ids = '',deliveryInfo={};
                        $view.find('.checkbox input:checked').each(function(index, ele){
                            var product_id = $(this).data('product_id');
                            if(product_id){
                                arr.push(product_id);
                            }
                        });
                        ids = arr.join(';');
                        if(ids){
                            if(obj.orderProductList&&obj.orderProductList.length){
                                var product = obj.orderProductList[0];
                                if(product.takeType == '4' || product.takeType == '17' || product.takeType == '18'){ //普通快递、加急快递、物流发货
                                    var deliverySelect = $('#deliverySelect').val(),
                                        sendInfo = $.trim($('#sendInfo').val());
                                    if(deliverySelect == '其他' && !$.trim($('#deliveryInput').val())){
                                        T.msg('请填写物流公司！');
                                        return;
                                    }
                                    if(!sendInfo){
                                        T.msg('请填写快递单号！');
                                        return;
                                    }
                                    deliveryInfo.logisticsName = deliverySelect == '其他'?$.trim($('#deliveryInput').val()): deliverySelect; //快递公司
                                    deliveryInfo.logisticsCode = sendInfo; //快递单号
                                }
                                /*if(product.takeType == '16'){ //专车配送
                                 deliveryInfo.distribution = $('#deliveryMan').val(); //配送人
                                 $('#deliveryMb').val(); //配送人联系方式
                                 }
                                 if(product.takeType == '5'){ //工厂取货
                                 $('#facMb').val(); //工厂联系方式
                                 }*/
                                _this.orderUpdate(ids, $(this).data('order_code'), $(this).data('user_name'), deliveryInfo);
                            }
                            $('#myModal').modal('hide');
                        }else{
                            T.msg('未选择任何商品！');
                        }
                    }).on('change', '#deliverySelect', function(){
                        if($(this).val() == '其他'){
                            $('#deliveryInput').removeClass('hide');
                        }else{
                            $('#deliveryInput').addClass('hide');
                        }
                    });
                    $('#myModal').modal('show');
                }else if(attr == 'download'){ //下载
                    var $this = $(this),
                        $td = $this.closest('td'),
                        $table = $(this).closest('table'),
                        $tr = $(this).closest('tr'),
                        product_attr = $td.data('product_attr'),
                        product_url = $td.data('product_url'),
                        download_filename = $td.data('download_filename'),
                        print_flag = $this.data('print_flag'),
                        url = '';
                    //download_filename = download_filename.match(/.+\./);
                    //url = product_url + '?download/' + download_filename + product_url.replace(/.+\./, "");

                    url = product_url + '?download/' + download_filename;
                    var $view = T.Template('confirm_attr', 'modal_content', {attr: product_attr, url: url});
                    $view.on('click', '.save', function(){
                        if(!print_flag){
                            T.POST({
                                action: CFG.API.order.update,
                                params: {
                                    order_product_id: $tr.data('product_id'),
                                    order_code: $table.data('order_code'),
                                    user_name: $table.data('user_name'),
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
            }).on("change.pageCount", "select[name='pageCount']", function(e){
                _this.data.index = 1;
                _this.data.offset = $(this).val()||10;
                _this.queryOrderList();
            });
            $('#searchBtn').on('click', function(){ //搜索
                _this.queryOrderList();
            });
            $('#orderStatus').on('change', function(){ //订单状态
                _this.data.order_status = $(this).val();
                _this.queryOrderList();
            });
            $('#productStatus').on('change', function(){ //商品状态
                _this.data.product_status = $(this).val();
                _this.setActive($(this).val());
                _this.queryOrderList();
            });
            _this.startTime.on('changeDate', function(e){ //开始时间
                _this.data.start_time = $('#startTime').val();
                _this.endTime.datetimepicker("setStartDate", _this.data.start_time);
                _this.queryOrderList();
            });
            _this.endTime.on('changeDate', function(e){ //结束时间
                _this.data.end_time = $('#endTime').val();
                _this.startTime.datetimepicker("setEndDate", _this.data.end_time);
                _this.queryOrderList();
            });
        },
        /**
         * 渲染页面
         */
        render: function(data){
            var _this = this;
            if(data){
                T.Template("order_list", data);
            }else{
                T.Template("order_list", {});
            }
            T.BindData("data", _this.data);
        },
        /**
         * 设置tabs的选中状态
         */
        setActive: function(type){
            var _this = this;
            _this.domNode.find('.nav-tabs li').removeClass('active');
            _this.domNode.find('.nav-tabs a[data-product_status='+type+']').closest('li').addClass('active');
        },
        /**
         * 获取当前需要展示的列表
         * @param {Number} 当前页码
         */
        getCurList: function(index){
            var _this = this;
            var index = (index-1)*_this.data.offset || 0,//起始位置
                offset = _this.data.offset+index || 10,//结束位置
                arr = [],
                orderList = _this.orderList;
            if(orderList.length == 0){
                return arr;
            }
            if(orderList.length < offset){
                offset = orderList.length;
            }
            for(var i=index; i<offset ; i++){
                arr.push(orderList[i]);
            }
            return arr;
        },
        /**
         * 获取配送方式
         * @param {Array} 商品集合
         */
        getDeliveryWay: function(products){
            var arr = [], hasExpress=false, hasSpecialCar=false, hasHomeDelivery=false, hasFactory=false;
            if(products.length>0){
                for(var i= 0,l=products.length; i<l; i++){
                    var takeType = products[i].takeType;
                    if((takeType == '4' || takeType == '17' || takeType =='18') && hasExpress){
                        continue;
                    }
                    if((takeType == '2' && hasHomeDelivery)){
                        continue;
                    }
                    if((takeType == '16' && hasSpecialCar)){
                        continue;
                    }
                    if((takeType == '5' && hasFactory)){
                        continue;
                    }
                    if(takeType){
                        arr.push({takeType: products[i].takeType, takeTypeStr: products[i].takeTypeStr, takeAddress: products[i].takeAddress});
                        if((takeType == '4' || takeType == '17' || takeType =='18')){
                            hasExpress = true;
                        }
                        if((takeType == '2')){
                            hasHomeDelivery = true;
                        }
                        if((takeType == '16')){
                            hasSpecialCar = true;
                        }
                        if((takeType == '5')){
                            hasFactory = true;
                        }
                    }
                }
            }
            return arr;
        },
        /**
         * 获取订单列表
         */
        queryOrderList: function(index){
            var _this = this,
                params = {},
                index = index||1;
            if($.trim($('#orderCode').val())){
                params.order_code = $.trim($('#orderCode').val()); //订单编号
            }
            if(_this.data.product_status && (_this.data.product_status != 'all')){
                params.status = _this.data.product_status; //订单商品状态
            }
            if(_this.data.order_status){
                params.order_status = _this.data.order_status; //订单状态
            }
            if(_this.data.start_time){
                params.start_time = _this.data.start_time + ' 00:00:00'; //开始时间
            }
            if(_this.data.end_time){
                params.end_time = _this.data.end_time + ' 23:59:59'; //结束时间
            }
            params.index = String((index-1)*_this.data.offset); //起始位置
            params.offset = _this.data.offset;
            $('#template-order_list-view').addClass('load');
            T.GET({
                 action: CFG.API.order.order_list,
                 params: params,
                 success: function(res){
                     console.log(res);
                     $('#template-order_list-view').removeClass('load');
                     _this.data.recordCount = res.count||0;
                     _this.orderList = res.orderList || [];
                     var product_status = _this.data.product_status;
                     T.Each(_this.orderList, function(index, v){
                         v.orderStatusType = product_status;
                         //页面展示的联系人信息和收货地址处理
                         if (v.orderProductList&&v.orderProductList.length>0){
                             var product = v.orderProductList[0];
                             if(product.supplierShipMethod==1){ //供应商发货到仓储中心
                                 v.actualReceiveName = product.supplierShipContacts;
                                 v.actualReceiveMobile = product.supplierShipContactsPhone;
                                 v.actualReceiveAddress = product.supplierShipAddress.replace(/\^/g, '');
                                 v.actualTakeTypeStr = product.supplierDeliveryName||'';
                             }else if(product.supplierShipMethod==2){ //供应商发货到服务点
                                 v.actualReceiveName = product.takeAddress.split('（')[0];
                                 v.actualReceiveMobile = product.takeAddress.substring(product.takeAddress.indexOf('联系电话：')+5, product.takeAddress.length-1);
                                 v.actualReceiveAddress = product.takeAddress.replace(/\^/g, '');
                                 v.actualTakeTypeStr = product.supplierDeliveryName||'';
                             }else{ //供应商发货到客户
                                 v.actualReceiveName = v.receiveName;
                                 v.actualReceiveMobile = v.receiveMobile;
                                 v.actualReceiveAddress = v.receiveAddress.replace(/\^/g, '');
                                 v.actualTakeTypeStr = product.takeTypeStr||'';
                             }
                             v.detailUrl = T.DOMAIN.WWW + 'order/order_details.html?order_code='+ v.orderCode+'&record_time='+ encodeURIComponent(v.recordTime)+'&product_status='+product_status+'';
                         }
                     });
                     _this.render({orderList: _this.orderList});
                     if(_this.orderList.length>0){
                        if(params.order_code){
                            $('#orderCode').val('');
                        }
                     }
                     T.Paginbar({
                         num: 3,
                         size: _this.data.offset, //每页条数
                         total: Math.ceil(res.count/_this.data.offset), //总页数
                         index: index||1, //当前页码
                         paginbar: "paginbar", //容器ID
                         callback: function(obj, index, size, total){ //点击页码回调
                             _this.queryOrderList(index);
                         }
                     });
                 }
            });
        },
        /**
         * 更改商品状态
         * @param {String} ids 商品id集合
         * @param {String} code 订单编号
         * @param {String} userName 订单对应的用户名
         * @param {Object} deliveryInfo 寄送信息
         */
        orderUpdate: function(ids, code, userName, deliveryInfo){
            var _this = this,
                params = {};
            params.order_product_id = ids;
            params.order_code = code;
            params.user_name = userName;
            params.status = 4; //商品状态--已发货
            params.fromSystem = '2';
            if(deliveryInfo.logisticsName){
                params.logistics_name = deliveryInfo.logisticsName;
            }
            if(deliveryInfo.logisticsCode){
                params.logistics_code = deliveryInfo.logisticsCode;
            }
            params.remark = '';
            params.username = T.Cookie.get('_a_name');
            T.loading();
            T.POST({
                action: CFG.API.order.update,
                params: params,
                success: function(res){
                    console.log(res);
                    T.loading('true');
                    T.msg('操作成功！');
                    _this.queryOrderList();
                }
            });
        }
    };
    order.init();
}(window, document));