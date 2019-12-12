require(["base", "tools", "datetimepicker"], function ($, T) {
    var deferModules = ["modules/reorder", "widgets/previewer"];
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    //我的设计文件
    var myFile = {
        PAGIN: {index: 0, offset: 20, startTime : '', endTime : '', orderCode: '', orderByFlag: 2},
        popup: null,
        init: function(params){
            var range = T.Date.getDateRange(-30, 'day'),
                startTime = range.startDate,
                endTime = range.endDate,
                _this = this;
            _this.PAGIN = params||_this.PAGIN;
            _this.PAGIN.startTime = startTime;
            _this.PAGIN.endTime = endTime;
            _this.initUI();
            T.PageLoaded();
            _this.reload(params, true, function(){
                require(deferModules);
            });
            _this.bindEvents();
        },
        initUI: function(){
            var range = T.Date.getDateRange(-30, 'day'),
                startTime = range.startDate,
                endTime = range.endDate;
            var orderCode = document.getElementById('orderCode');
            T.FORM().placeholder(orderCode, '输入订单编号');
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
                _this.PAGIN.orderCode = $.trim($('#orderCode').val());
                _this.PAGIN.startTime = $('#startTime').val();
                _this.PAGIN.endTime = $('#endTime').val();
                _this.PAGIN.index = 0;
                _this.PAGIN.offset = 20;
                _this.PAGIN.orderByFlag = 2;
                _this.reload(_this.PAGIN, true);
            });
            $("#template_file_list_view").delegate(".look", "click", function(e){ //查看下单记录
                var $this = $(this);
                var fileId = $this.data("file_id")||"";
                if(order.popup){
                    order.popup.remove();
                    order.popup = null;
                }
                if(fileId){
                    var file = T.Array.get(_this.data, fileId, 'file_id');
                    order.reload({data: file.product_list, offset: 0, count: 10}, true);
                }
            }).delegate(".download", "click", function(e){ //下载
                var $this = $(this);
                var pdfPath = $this.data("pdf_path")?($this.data("pdf_path")+'?download'):"";
                var sourceFilePath = $this.data('source_file_path')?($this.data("source_file_path")+'?download'):"",
                    str = '';
                //var pdfPath = 'http://cloud.ininin.com/reload_user_file/1452761694781.xml?download';
                //var sourceFilePath = 'http://cloud.ininin.com/8e59674c6588d30be4eec7505185fe9a.jpg?download';
                if(pdfPath){
                    str+='<span class="radio sel" data-value="'+pdfPath+'"><span class="name">设计稿PDF</span></span>';
                }
                if(sourceFilePath){
                    var isCheck = pdfPath?'':'sel';
                    str+='<span class="radio '+isCheck+'" data-value="'+sourceFilePath+'"><span class="name">源文件</span></span>';
                }
                var view = T.cfm({
                    text: '<p class="red">温馨提示：您可以对PDF文件进行阅读、印刷；也可以对源文件使用图形图像软件进行编辑。</p>' +
                        '<div class="radios mt10 text_center">'+str+'</div>',
                    title: '下载',
                    ok: '下 载'
                }, function (_this) {
                    _this.remove();
                });
                var dom = view.dom;
                $(dom).find('#popup_confirm_ok').attr('href', pdfPath||sourceFilePath||'javasript:;');
                $(dom).delegate('.radio', 'click', function(){
                    $(this).addClass('sel').siblings('.radio').removeClass('sel');
                    $(dom).find('#popup_confirm_ok').attr('href', $(this).data('value')||'javasript:;');
                });
            }).delegate(".previewer", "click", function(){
                var urls = $(this).data('urls');
                if(urls){
                    require(deferModules, function(Reorder, Previewer){
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
            });
        },
        reload: function(params, isFirst, callback){
            var _this = this;
            $('#template_file_list_view').addClass('load');
            T.GET({ //查询设计文件
                action: CFG_DS.mydesignfile.get
                ,params: _this.PAGIN
                ,success: function (data) {
                    console.log(data);
                    $('#template_file_list_view').removeClass('load');
                    var _fileList = [];
                    T.Each(data.userDesignFileList, function(i, file){
                        if(file.fileId){
                            _fileList.push(file);
                        }
                    });
                    data.userDesignFileList = _fileList;
                    var _data = T.FormatData(data||{});
                    _data.userDesignFileList = _data.user_design_file_list||[];
                    _this.data = _data.userDesignFileList;
                    if(_data.userDesignFileList.length>0&&$('#orderCode').val()){ //清空输入框
                        $('#orderCode').val('').focus().blur();
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
    //历史订单
    var order = {
        data: null,
        popup: null,
        PAGIN: {offset: 0, count: 10},
        reload: function(params, isFirst){
            order.PAGIN = params||order.PAGIN;
            var _data = {};
            if(params.data.length>0){
                T.Each(params.data, function(i, product){
                    if(product.order_code&&product.product_id){
                        product.order_product_id = product.order_code+'_'+product.product_id;
                    }
                });
            }

            _data.order_list = params.data || [];
            order.data = _data.order_list;
            _data.order_count = _data.order_list.length;
            if (_data.order_list&&_data.order_list.length>order.PAGIN.count) {
                _data.order_list = _data.order_list.slice(order.PAGIN.offset,(order.PAGIN.offset+order.PAGIN.count))||[];
            }
            if(isFirst){
                order.show(order.PAGIN);
            }
            console.log(_data);
            T.Template('order_list', _data);
            if(isFirst){
                order.popup.setPosition();
            }
            if(order.PAGIN.count){
                T.Paginbar({
                    num: 3,
                    size: order.PAGIN.count,
                    total: Math.ceil(_data.order_count / order.PAGIN.count),
                    index: Math.ceil(order.PAGIN.offset/order.PAGIN.count)+1,
                    paginbar: 'paginbar_order_list',
                    callback: order.pagin
                });
            }
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
                if(!orderProduct)return;
                require(deferModules, function(Reorder, Previewer){
                    Reorder.getPrice(orderProduct.product_id , {
                        card_id: order.PAGIN.card_id||'',
                        quantity: orderProduct.quantity,
                        product_name: orderProduct.product_name,
                        product_attr: orderProduct.product_att,
                        sorce_file:orderProduct.sorce_file||'',
                        file_url:orderProduct.file_url||''
                    });
                });
            });
        }
    };
    T.Loader(function(){
        myFile.init();
    });
});