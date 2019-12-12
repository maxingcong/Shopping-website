!(function(window, document, undefined) {
    "use strict";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var bigLabeltemplate = "<div id='page' style='width:300px;margin-left: 20px;height:106mm;margin-top:14px;'><div><span style='font-weight: bold;font-size: 10px'>orderCode</span>&nbsp;<span style='font-weight: bold;font-size: 10px'>date</span><span style='font-size: 10px;'>金额: price</span></div><div style='border:1px solid black;margin-right: 25px;'><div style='font-weight: bold;'>name</div><div style='font-size:12px;'>desc</div></div><div style='margin-top: 2px;margin-right: 25px;'><span style='font-weight: bold;font-size: 12px'>收货人: username</span><span>cellphone</span>&nbsp;<span>phone</span></div><div style='margin-top: 10px;'></div><div style='border:1px solid black;margin-top: 15px;margin-right: 25px;'><div style='font-weight: bold;'>name2 <span style='margin-left: 20%;font-size: 18px;'>batch</span></div><div>desc2</div></div><div style='border:1px solid black;margin-right: 25px;padding: 1px;'><div style='font-weight: bold;font-size: 16px;'>servicePoint</div><div style='font-weight: bold;bold;font-size: 10px;'>servicePointAddress</div></div><div style='border:1px solid black;margin-right: 25px;padding: 1px;'><div><span style='font-weight: bold;font-size: 18px;'>username2</span><span>cellphone2</span>&nbsp;<span>phone2</span></div><div><span style='font-weight: bold;'>收货地址:</span>userAddress</div></div><div style='width: 200px; height: 26px; margin: 2px 0;'>barCode</div><div>订单商品号:orderCode2</div><div><span style='font-weight: bold;margin-left: 10px;'>配送人:</span><span style='font-weight: bold;margin-left: 30px;'>签收人:</span><span style='font-weight: bold;font-size: 20px;margin-left: 25px;'>今日:index</span></div></div>";
    var sort_out = {
        data: null,
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            _this.$cont = $('#sort_out');
            _this.bindEvents();
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            $('#orderCode').on('keydown', function(event){ //订单-商品号扫描
                if(event.keyCode==13){
                    var orderCode = $('#orderCode').val();
                    if(!orderCode){
                        T.msg('请扫描条形码！');
                        return;
                    }
                    _this.sortAndGetInfo([orderCode]);
                }
            });
            $('#searchBtn').on('click', function(){ //搜索
                var orderCode = $('#orderCode').val();
                if(!orderCode){
                    T.msg('请扫描条形码！');
                    return;
                }
                _this.sortAndGetInfo([orderCode]);
            });
            _this.$cont.on('click', '#completeProduction', function(){ //批量完成生产
                _this.completeProduction();
            }).on('click', '#batchPrintBigLabel', function(){ //批量打印大标签
                _this.batchPrintBigLabel();
            }).on('click', '.table-product-price button', function(){ //完成生产
                var $tr = $(this).closest('tr'),
                    $modal = $('#completeProductionModl'),
                    orderCode_productId = $tr.data("order_code")+"-"+$tr.data("order_productid");
                $modal.modal('show');
                $modal.off('click', '.modal-footer .save').on('click', '.modal-footer .save', function(){
                    _this.sortAndGetInfo([orderCode_productId]);
                    $modal.modal('hide');
                });
            });
            $("#printerDiv").on('hidden.bs.modal', function (e) { //打印预览层关闭
                $("#orderCode")[0].focus();
            });
        },
        /**
         * 渲染
         */
        render: function(data){
            T.Template('sort_product_list', data||{});
        },
        /**
         * 批量完成生产
         */
        completeProduction: function(){
            var _this = this,
                $checked = $("input:checkbox[name='checkbox']:checked"),
                codeArray = [];
            if($checked.length<1){
                T.msg('请勾选需要批量完成生产的订单商品!');
                return;
            }
            var $modal = $('#completeProductionModl');
            $modal.modal('show');
            $modal.off('click', '.modal-footer .save').on('click', '.modal-footer .save', function(){
                $checked.each(function(){
                    var $tr = $(this).closest('tr'),
                        orderCode_productId = $tr.data("order_code")+"-"+$tr.data("order_productid");
                    codeArray.push(orderCode_productId);
                });
                _this.sortAndGetInfo(codeArray);
                $modal.modal('hide');
            });
        },
        /**
         * 处理打印类型
         */
        processPrint:function(){
            var _this = this,
                data = _this.data;
            if(data && data.infoList && data.infoList.length > 0){
                var info = data.infoList[0];
                if(info){
                    var printType = info.printType;
                    switch(printType-0){
                        case 0:
                            $("#orderCode").val('');
                            $("#orderCode").focus();
                            break;
                        case 1:_this.printSmallLabel();break;
                        case 2:_this.printBigLabel();break;
                        case 3:_this.printBigLabel();break;
                        case 4:
                            if(confirm("该商品已经打印小标签，是否需要再次打印")){
                                _this.printSmallLabel();
                            }
                            break;
                        default:
                            $("#orderCode").val('');
                            $("#orderCode").focus();
                    }
                }
            }
        },
        /**
         * 打印小标签
         */
        printSmallLabel:function(){

        },
        /**
         * 打印大标签
         */
        printBigLabel: function(chk_value){
            var _this = this,
                infoList = [],
                orderCodeObj = {},
                data = _this.data;
            $("#printerContent").empty();
            if(data && data.infos){
                var infos = data.infoList;
                if(chk_value && chk_value.length > 0){
                    for(var i = 0 ; i < data.infos.length ; i++){
                        var info = data.infos[i];
                        var orderCode = info.recordCode + "-" + info.batchNum;
                        if(!orderCodeObj[orderCode]){
                            orderCodeObj[orderCode] = true;
                        }else{
                            continue;
                        }
                        if(_this.check(chk_value,orderCode)){
                            infoList.push(info);
                        }
                    }
                }else{
                    for(var i = 0 ; i < infos.length ; i++){
                        var tempinfo = infos[i];
                        var info=tempinfo.sameBatchNumProductionDistribution[0];
                        if(info.recordCode && info.batchNum){
                            var orderCode = info.recordCode + "-" + info.batchNum;
                            if(!orderCodeObj[orderCode]){
                                orderCodeObj[orderCode] = true;
                            }else{
                                continue;
                            }
                            if(tempinfo.printType == 1){
                                continue;
                            }
                            info['allNum']=tempinfo['allNum'];
                            info['hasNum']=tempinfo['hasNum'];
                            info['orderTime']=tempinfo['orderTime'];
                            info['orderPrice']=tempinfo['orderPrice'];
                            info['todayAllBatchNum']=tempinfo['todayAllBatchNum'];
                            infoList.push(info);
                        }
                    }
                }
                for(var i = 0 ; i < infoList.length ; i++){
                    var info = infoList[i];
                    var orderCode = info.recordCode + "-" + info.batchNum;
                    var bigLabelStr = bigLabeltemplate;
                    bigLabelStr = bigLabelStr.replace("page","page" + (i+1));
                    bigLabelStr = bigLabelStr.replace("orderCode",orderCode);
                    bigLabelStr = bigLabelStr.replace("orderCode2",orderCode);
                    if(info.orderTime){
                        bigLabelStr = bigLabelStr.replace("date",info.orderTime.split(' ')[0]);
                    }else{
                        bigLabelStr = bigLabelStr.replace("date",'');
                    }
                    bigLabelStr = bigLabelStr.replace("price",info.orderPrice);
                    bigLabelStr = bigLabelStr.replace("name",info.productName);
                    bigLabelStr = bigLabelStr.replace("name2",info.productName);
                    bigLabelStr = bigLabelStr.replace("desc",info.productAttr);
                    bigLabelStr = bigLabelStr.replace("desc2",info.productAttr);
                    bigLabelStr = bigLabelStr.replace("username",info.receiveName);
                    bigLabelStr = bigLabelStr.replace("username2",info.receiveName);
                    bigLabelStr = bigLabelStr.replace("cellphone",info.receiveMobile);
                    bigLabelStr = bigLabelStr.replace("cellphone2",info.receiveMobile);
                    bigLabelStr = bigLabelStr.replace("phone",info.receivelTel);
                    bigLabelStr = bigLabelStr.replace("phone2",info.receivelTel);
                    bigLabelStr = bigLabelStr.replace("batch",info.hasNum + "/" + info.allNum);
                    var takeType = info.takeType;
                    switch(takeType - 0){
                        case 2 :
                            bigLabelStr = bigLabelStr.replace("servicePoint",info.takeAddressName);
                            bigLabelStr = bigLabelStr.replace("servicePointAddress",info.takeAddress);
                            break;
                        case 16:
                            bigLabelStr = bigLabelStr.replace("servicePoint",'加急服务');
                            bigLabelStr = bigLabelStr.replace("servicePointAddress",'');
                            break;
                        case 17:
                            bigLabelStr = bigLabelStr.replace("servicePoint",info.takeTypeStr);
                            bigLabelStr = bigLabelStr.replace("servicePointAddress",'');
                            break;
                    }
                    bigLabelStr = bigLabelStr.replace("servicePoint",info.takeAddress);
                    bigLabelStr = bigLabelStr.replace("userAddress",info.receiveAddress);
                    bigLabelStr = bigLabelStr.replace("index",info.todayAllBatchNum);
                    var barCodeDiv = document.createElement('div');
                    var barCodeStr = $(barCodeDiv).barcode(orderCode, 'code128',  {barHeight: 26, showHRI: false}).html();
                    bigLabelStr = bigLabelStr.replace("barCode", barCodeStr);
                    $("#printerContent").append(bigLabelStr);
                }
            }
            $("#printerDiv").modal('show');
            var myDoc = {
                settings:{
                    topMargin:10,
                    leftMargin:1,
                    bottomMargin:10,
                    rightMargin:1,
                    printer:'big_label_printer'
                },
                documents: document,
                copyrights: '杰创软件拥有版权  www.jatools.com'
            };
            jatoolsPrinter.print(myDoc, false);
        },
        /**
         * 批量打印大标签
         */
        batchPrintBigLabel:function(){
            var _this = this,
                $checked = $("input:checkbox[name='checkbox']:checked"),
                chk_value =[];
            if($checked.length<1){
                T.msg("请选择要打印大标签的订单商品！");
                return;
            }
            $checked.each(function(){
                var recordCode=$(this).data("record_code");
                chk_value.push(recordCode);
            });
            _this.printBigLabel(chk_value);
        },
        check:function(chk_value,orderCode){
            for(var i = 0 ;i < chk_value.length ; i++){
                if(chk_value[i] == orderCode){
                    return true;
                }
            }
            return false;
        },
        /**
         * 分拣并返回信息
         */
        sortAndGetInfo: function(codeArray){
            var _this = this,
                params = {
                    dataJson: {
                        orderCoderAndserialNumber: codeArray
                    },
                    operator: T.Cookie.get('_a_name'),
                    fromSystem: 'supplierSystem'
                };
            $('#template-sort_product_list-view').addClass('load');
            T.POST({
                action: CFG.API.order.sort_out,
                params: params,
                success: function(res){
                    $('#template-sort_product_list-view').removeClass('load');
                    _this.data = res;
                    if(res.infos && res.infos.length>0){
                        _this.render(res);
                        try {
                            _this.processPrint();
                        } catch(e) {

                        }
                        $('#orderCode').val("");
                        _this.$cont.checkboxs("checkbox", "checkbox_all"); //全选
                    }
                },
                failure: function(res) {
                    $('#template-sort_product_list-view').removeClass('load');
                    T.msg(res.msg);
                },
                error: function(res) {
                    $('#template-sort_product_list-view').removeClass('load');
                }
            });
        }
    };
    sort_out.init();
}(window, document));

