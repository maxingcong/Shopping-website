require(["base", "tools", "datetimepicker"], function ($, T) {
    var deferModules = ["modules/reorder", "widgets/previewer"];
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    //我的印刷PDF
    var myFile = {
        PAGIN: {type: '20', index: 0, offset: 20, start_time: '', end_time: '', file_name: '', order_code: '', orderByFlag: 2},
        popup: null,
        init: function(params){
            var range = T.Date.getDateRange(-30, 'day'),
                startTime = range.startDate,
                endTime = range.endDate,
                _this = this;
            _this.PAGIN = params||_this.PAGIN;
            _this.PAGIN.start_time = startTime;
            _this.PAGIN.end_time = endTime;
            _this.initUI();
            T.PageLoaded();
            _this.reload(params, true, function(){
                require(deferModules);
            });
            _this.bindEvents();
        },
        initUI: function(){
            var range = T.Date.getDateRange(-30, 'day')
                ,startTime = range.startDate
                ,endTime = range.endDate;
            var fileName = document.getElementById('fileName');
            var orderCode = document.getElementById('orderCode');
            T.FORM().placeholder(fileName, '输入文件名关键词');
            T.FORM().placeholder(orderCode, '输入印刷订单号');
            $('#startTime').val(startTime);
            $('#endTime').val(endTime);
            $('#startTime').datetimepicker({
                lang:"ch",           //语言选择中文
                format:"Y-m-d",      //格式化日期
                timepicker:false,    //关闭时间选项
                todayButton:false,    //关闭选择今天按钮
                maxDate: endTime,
                onSelectDate: function(){
                    $('#endTime').datetimepicker({minDate: $('#startTime').val()});
                }
            });
            $('#endTime').datetimepicker({
                lang:"ch",           //语言选择中文
                format:"Y-m-d",      //格式化日期
                timepicker:false,    //关闭时间选项
                todayButton:false,    //关闭选择今天按钮
                maxDate: endTime,
                minDate: startTime,
                onSelectDate: function(){
                    $('#startTime').datetimepicker({maxDate: $('#endTime').val()});
                }
            });
        },
        bindEvents: function(){
            var _this = this;
            $('#yfilter').delegate('.submit', 'click', function(){ //筛选
                _this.PAGIN.file_name = $.trim($('#fileName').val());
                _this.PAGIN.order_code = $.trim($('#orderCode').val());
                _this.PAGIN.start_time = $('#startTime').val();
                _this.PAGIN.end_time = $('#endTime').val();
                _this.PAGIN.index = 0;
                _this.PAGIN.offset = 20;
                _this.PAGIN.orderByFlag = 2;
                _this.reload(_this.PAGIN, true);
            });
            $("#template_file_list_view").delegate(".reorder", "click", function(e){ //再次印刷
                var orderProductId = $(this).data("order_serial_number")||"";
                if(!orderProductId)return;
                var orderCode = orderProductId.split('_')[0];
                var serialNumber = orderProductId.split('_')[1];
                T.GET({
                    action: CFG_DS.myorder.get,
                    params: {
                        order_code: orderCode
                    },
                    success: function(data){
                        var order = data.orderList[0],
                            productList = order.orderProductList || [];
                        T.Each(productList, function(i, product){
                            if(product.serialNumber==serialNumber){
                                require(deferModules, function(Reorder, Previewer){
                                    Reorder.getPrice(product.productId , {
                                        card_id: product.cardId||'',
                                        quantity: product.quantity,
                                        product_name: product.productName,
                                        product_attr: product.productAttr,
                                        sorce_file:product.sorceFile||'',
                                        file_url:product.fileUrl||''
                                    });
                                });
                            }
                        });
                    }
                });

            }).delegate(".previewer", "click", function(){
                var urls = $(this).data('urls');
                if(urls){
                    require(deferModules, function(Reorder, Previewer) {
                        new Previewer({
                            uris: urls
                        });
                    });
                }
            }).delegate("#orderByTime", "click", function(){
                if(_this.PAGIN.orderByFlag==1){
                    _this.PAGIN.orderByFlag = 2;
                    _this.PAGIN.index = 0;
                    _this.PAGIN.offset = 20;
                }else{
                    _this.PAGIN.orderByFlag = 1;
                    _this.PAGIN.index = 0;
                    _this.PAGIN.offset = 20;
                }
                _this.reload();
            }).delegate("#orderByProduct", "click", function(){
                if(_this.PAGIN.orderByFlag==3){
                    _this.PAGIN.orderByFlag = 4;
                    _this.PAGIN.index = 0;
                    _this.PAGIN.offset = 20;
                }else{
                    _this.PAGIN.orderByFlag = 3;
                    _this.PAGIN.index = 0;
                    _this.PAGIN.offset = 20;
                }
                _this.reload();
            });
        },
        reload: function(params, isFirst, callback){
            var _this = this;
            $('#template_file_list_view').addClass('load');
            T.GET({ //获取文件
                action: CFG_DS.myfile.get
                ,params: _this.PAGIN
                ,success: function (data) {
                    console.log(data);
                    $('#template_file_list_view').removeClass('load');
                    var _fileList = [];
                    T.Each(data.fileList, function(i, file){
                        if(file.orderCode&&file.serialNumber){
                            file.order_product_id = file.orderCode + '_' + file.serialNumber;
                        }
                        if(file.fileId){
                            _fileList.push(file);
                        }
                    });
                    data.fileList = _fileList;
                    var _data = T.FormatData(data||{});
                    _data.file_list = _data.file_list||[];
                    _this.data = _data.file_list;
                    if(_data.file_list.length>0){
                        if($('#fileName').val()){ //清空输入框
                            $('#fileName').val('').focus().blur();
                        }
                        if($('#orderCode').val()){
                            $('#orderCode').val('').focus().blur();
                        }
                    }
                    if(isFirst){
                        _data.orderByFlag = 0;
                    }else{
                        _data.orderByFlag = _this.PAGIN.orderByFlag;
                    }
                    T.Template('file_list', _data);
                    if(_this.PAGIN.offset){
                        T.Paginbar({
                            num: 3,
                            size: _this.PAGIN.offset,
                            total: Math.ceil(_data.total_count / _this.PAGIN.offset),
                            index: Math.ceil(_this.PAGIN.index/_this.PAGIN.offset)+1,
                            paginbar: 'paginbar',
                            callback: _this.pagin
                        });
                    }
                    if(callback){
                        callback();
                    }
                }
            });
        },
        pagin: function (obj, index, size, total) {
            myFile.PAGIN.index = (index-1)*myFile.PAGIN.offset;
            myFile.reload(myFile.PAGIN);
        }
    };
    T.Loader(function(){
        myFile.init();
    });
});