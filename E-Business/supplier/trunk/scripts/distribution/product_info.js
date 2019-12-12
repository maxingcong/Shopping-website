!(function(window, document, undefined) {
    "use strict";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var product_info = {
        query_type: '', //商品状态快捷选项
        step: 0, //检查下载文件是否存在失败的次数
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            _this.$cont = $('#product_info');
            _this.initUI();
            _this.render();
            _this.queryInfo();
            _this.bindEvents();
        },
        /**
         * 初始化UI
         */
        initUI: function(){
            var _this = this,
                date_range = T.getDateRange(-8, 'day'),//最近一周
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
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            $('#searchBtn').on('click', function(){ //搜索
                _this.queryInfo();
            });
            /*$('#resetBtn').on('click', function(){ //重置选项
                var date_range = T.getDateRange(-8, 'day'),
                    start_time = date_range.startDate,
                    end_time = date_range.endDate;
                //重置时间组件
                _this.startTime.datetimepicker('update');
                _this.endTime.datetimepicker('update');
                $('#startTime').val(start_time);
                $('#endTime').val(end_time);
                //重置下拉框和输入框
                $('select[name=productStatus]').val('');
                $('select[name=takeType]').val('');
                $("#orderCode").val('');
                $("#logisticsCode").val('');
                $("#receivelTel").val('');
                _this.query_type = '';
            });*/
            $('#product-tabs').on('click', 'li>a', function(){ //快捷选项
                _this.query_type = $(this).data('product_status');
                _this.queryInfo();
                $(this).closest('li').addClass('active').siblings().removeClass('active');
            });
            _this.$cont.on('click', '#batchDelivery', function(){ //批量出货
                var $checked = $("input:checkbox[name='checkbox']:checked");
                if($checked.length>0){
                    $('#batchDeliveryModl').modal('show');
                }else{
                    T.msg('请先勾选需要批量出货的商品！');
                }
            });
            $('#batchDeliveryModl').on('click', '.save', function(){ //批量出货弹出框确定按钮
                var $checked = $("input:checkbox[name='checkbox']:checked"),
                    arr = [];
                if($checked.length>0){
                    $checked.each(function(){
                        arr.push($(this).data('delivery_info'));
                    });
                }else{
                    T.msg('请先勾选需要批量出货的商品！');
                    return;
                }
                _this.orderUpdate(arr);
                _this.printDeliveryOrder(arr);
                $('#batchDeliveryModl').modal('hide');
            });
            $('#exportExcel').on('click', function(){
                if($('#exportExcel').hasClass('dis')){
                    return;
                }
                _this.exportExcel();
            });
            _this.startTime.on('changeDate', function(e){ //开始时间
                _this.endTime.datetimepicker("setStartDate", $('#startTime').val());
            });
            _this.endTime.on('changeDate', function(e){ //结束时间
                _this.startTime.datetimepicker("setEndDate", $('#endTime').val());
            });
        },
        /**
         * 渲染
         */
        render: function(data){
            T.Template('distribution_product_info', data||{});
        },
        /**
         * 打印出货单
         */
        printDeliveryOrder: function(arr){
            var obj = {},
                barCodeArr = [];
            obj.operator = T.Cookie.get('_a_name');
            obj.deliveryTime = new Date().Format();
            obj.infoList = [];
            for(var i= 0,l=arr.length;i<l;i++){
                var infoArr = arr[i].split('-');
                var infoObj = {};
                var barCodeDiv = document.createElement('div');
                var barCodeStr = $(barCodeDiv).barcode(infoArr[0]+'-'+infoArr[1], 'code128', {barHeight: 30}).html();
                infoObj.orderCode = infoArr[0];
                infoObj.orderProductId = infoArr[1];
                infoObj.productName = infoArr[2];
                infoObj.takeTypeStr = infoArr[3];
                barCodeArr.push(barCodeStr);
                obj.infoList.push(infoObj);
            }
            var dom = document.createElement('div');
            var html = Utils.template('delivery_order_print', obj);
            for(var j= 0,bl=obj.infoList.length;j<bl;j++){
                html = html.replace('barCode'+j, barCodeArr[j]);
            }
            dom.innerHTML = html;
            $(dom).printArea({
                mode : 'popup',
                popHt: 500,
                popWd: 500
            });
        },
        /**
         * 是否有可出货商品
         */
        canDelivery: function(data){
            var can_delivery = false;
            if(data.resultData && data.resultData.length>0){
                var resultData = data.resultData;
                for(var i= 0,rl=resultData.length;i<rl;i++){
                    var infoList = resultData[i].infoList;
                    for(var j= 0,il=infoList.length;j<il;j++){
                        var recordList = infoList[j].recordList;
                        for(var k= 0,kl=recordList.length;k<kl;k++){
                            if(recordList[k].status==3||recordList[k].status==4||recordList[k].status==15){
                                can_delivery = true;
                                break;
                            }
                        }
                    }
                }
            }
            return can_delivery;
        },
        /**
         * 出货
         */
        orderUpdate: function(arr){
            var _this = this,
                codeArray = [];
            for(var i= 0,l=arr.length;i<l;i++){
                var info = arr[i].split('-');
                codeArray.push(info[0] + '-' + info[1]);
            }
            var params = {
                dataJson: {
                    orderCoderAndserialNumber: codeArray
                },
                operator: T.Cookie.get('_a_name'),
                fromSystem: 'supplierSystem'
            };
            T.POST({
                action: CFG.API.order.sort_out,
                params: params,
                success: function(res){
                    T.msg('操作成功！');
                    _this.queryInfo();
                },
                failure: function(res) {
                    T.msg(res.msg);
                },
                error: function(res) {
                }
            });
        },
        /**
         * 导出Excel
         */
        exportExcel: function(index){
            var _this = this,
                params = {
                    supplier: T.Cookie.get('_a_name'),
                    //current_page: index||1,
                    //page_count:10,
                    status: $('select[name=productStatus]').val(),
                    take_type: $('select[name=takeType]').val(),
                    order_code: $("#orderCode").val(),
                    logistics_code: $("#logisticsCode").val(),
                    receivel_tel: $("#receivelTel").val(),
                    start_time: $('#startTime').val()+" 00:00:00",
                    end_time: $('#endTime').val()+ " 23:59:59",
                    query_type: _this.query_type
                };
            T.GET({
                action: CFG.API.order.export_production,
                params: params,
                success: function(res){
                    if(res.excelUrl){
                        $('#exportExcel').text('正在导出').addClass('dis');
                        _this.getFile(res.excelUrl);
                    }
                }
            });
        },
        /**
         * 获取文件是否存在
         */
        getFile: function(fileUrl){
            var _this = this;
            $.ajax({
                type: "GET",
                url: fileUrl,
                cache: false,
                success: function(res){
                    _this.downloadFile(fileUrl);
                    _this.step = 0;
                    $('#exportExcel').text('导出Excel').removeClass('dis');
                },
                error: function(res){
                    if(res.status != 0){
                        if(_this.step < 60){
                            _this.step +=1;
                            setTimeout(function(){
                                _this.getFile(fileUrl);
                            }, 1000);
                        }else{
                            _this.step = 0;
                            $('#exportExcel').text('导出Excel').removeClass('dis');
                        }
                    }else{
                        setTimeout(function(){
                            _this.downloadFile(fileUrl);
                            $('#exportExcel').text('导出Excel').removeClass('dis');
                        }, 1000);
                    }
                }
            });
        },
        downloadFile: function(url){
            if(!url)return;
            var iframe = null;
            try { // for I.E.
                iframe = document.createElement('<iframe>');
            } catch (ex) { //for other browsers, an exception will be thrown
                iframe = T.element("iframe",{
                    src: "about:blank"//'about:blank'
                });
            }
            if(!iframe)return;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            setTimeout(function(){
                iframe.src = url;
                setTimeout(function(){
                    document.body.removeChild(iframe);
                },1000);
            },100);
        },
        /**
         * 商品信息查询
         */
        queryInfo: function(index){
            var _this = this,
                params = {
                    supplier: T.Cookie.get('_a_name'),
                    current_page: index||1,
                    page_count:10,
                    status: $('select[name=productStatus]').val(),
                    take_type: $('select[name=takeType]').val(),
                    order_code: $("#orderCode").val(),
                    logistics_code: $("#logisticsCode").val(),
                    receivel_tel: $("#receivelTel").val(),
                    start_time: $('#startTime').val()+" 00:00:00",
                    end_time: $('#endTime').val()+ " 23:59:59",
                    query_type: _this.query_type
                };
            $('#template-distribution_product_info-view').addClass('load');
            T.GET({
                action: CFG.API.order.product_info,
                params: params,
                success: function(res){
                    $('#template-distribution_product_info-view').removeClass('load');
                    res.canDelivery = _this.canDelivery(res);
                    _this.render(res);
                    _this.$cont.checkboxs("checkbox", "checkbox_all"); //全选
                    //分页条
                    T.Paginbar({
                        num: 3,
                        size: 10, //每页条数
                        total: Math.ceil(res.totalCount/10), //总页数
                        index: index||1, //当前页码
                        paginbar: "paginbar", //容器ID
                        callback: function(obj, index, size, total){ //点击页码回调
                            _this.queryInfo(index);
                        }
                    });
                }
            });
        }
    };
    product_info.init();
}(window, document));
