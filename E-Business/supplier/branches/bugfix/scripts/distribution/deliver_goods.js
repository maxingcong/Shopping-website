!(function(window, document, undefined) {
    "use strict";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    /**
     * 快递单模板
     */
    var template1 = "<div id='page' style='width: 874px;height: 483px;'><div style='position: relative;top: 140px;left: 40px;'>云印 www.ininin.com</div><div style='position: relative;top: 150px;left: 40px;'>广东省 深圳市 南山区</div><div style='position: relative;top: 160px;left: 10px;'>科技园北区源兴科技大厦南座1403</div><div style='position: relative;top: 175px;left: 20px;'>云小印</div><div style='position: relative;top: 155px;left: 120px;'>400-680-9111</div><div style='position: relative;top: 40px;left: 300px;'>company</div><div style='position: relative;top: -30px;left: 520px;font-size:25px;font-weight:bold;'>mps</br> mc</br> ma</div><div style='position: relative;top: -65px;left: 250px;'>province city area</div>	<div style='position: relative;top: -55px;left: 265px;'>address</div><div style='position: relative;top: -45px;left: 270px;'>username</div><div style='position: relative;top: -60px;left: 370px'>cellphone</div><div style='position: relative;top: -20px;left: 10px;'>goods</div><div style='position: relative;top: 50px;left: 530px;'>orderCode</div></div>";

    var deliver_goods = {
        data: null,
        visit_type: 1,
        check_value: [],
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            _this.$cont = $('#deliverGoods');
            _this.bindEvents();
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            $('#orderCode').on('keydown', function(event){ //订单批次号
                if(event.keyCode==13){
                    var orderCode = $('#orderCode').val();
                    if(!orderCode){
                        T.msg('请扫描条形码！');
                        return;
                    }
                    T.Array.add(_this.check_value, orderCode);
                    _this.getList();
                }
            });
            $('#searchBtn').on('click', function(){ //搜索
                var orderCode = $('#orderCode').val();
                if(!orderCode){
                    T.msg('请扫描条形码！');
                    return;
                }
                T.Array.add(_this.check_value, orderCode);
                _this.getList();
            });
            _this.$cont.on('click', '#bindingLogistics', function(){ //绑定物流单号
                if(_this.check_value.length<1){
                    T.msg('请扫描条形码！');
                    return;
                }
                var params = _this.getParams();
                if(params){
                    _this.updateDeliver(params);
                }
            }).on('click', '#bindingDelivery', function(){ //绑定配送信息
                if(_this.check_value.length<1){
                    T.msg('请扫描条形码！');
                    return;
                }
                var params = _this.getParams();
                if(params){
                    _this.updateDeliver(params);
                }
            }).on('click', '#batchDeliver', function(){ //批量发货
                var $checked = $("input:checkbox[name='checkbox']:checked");
                if($checked.length>0){
                    $('#deliverGoodsModl').modal('show');
                }else{
                    T.msg("请勾选需要批量发货的订单商品！");
                }
            }).on('click', '.table-product-price button', function(){ //去发货
                var orderCode_batchNum=$(this).data("ordercode")+"-"+$(this).data("batchnum");
                $("#orderCode").val(orderCode_batchNum);
                _this.check_value=[];
                _this.check_value.push(orderCode_batchNum);
                if(_this.visit_type==1){
                    try{
                        _this.processPrint(2);
                    }catch(e){

                    }
                    $("#logisticsCode")[0].focus();
                }else{
                    $("#deliveryStaff")[0].focus();
                }
            }).on('click', '#toDelivery', function(){
                $('#toDeliveryModl').modal('show');
            }).on('click', '#toLogistics', function(){
                $('#toLogisticsModl').modal('show');
            });
            $('#deliverGoodsModl').on('click', '.save', function(){ //发货对话框确认按钮
                _this.getChecked();
                if(_this.check_value.length>0){
                    try {
                        if(_this.visit_type==1){
                            _this.printExpress()
                        }else{
                            _this.processPrint(_this.data.printType);
                        }
                    } catch (e) {

                    }
                }
                $('#deliverGoodsModl').modal('hide');
            });
            $('#toDeliveryModl').on('click', '.save', function(){ //切换为专车配送
                _this.visit_type=2;
                $("#logisticsCode").val("");
                $("#deliveryStaff").val("");
                $("#contactInformation").val("");
                $('#logisticsWrapper').addClass('hide');
                $('#deliveryWrapper').removeClass('hide');
                $('#toDeliveryModl').modal('hide');
                $('#deliveryStaff')[0].focus();
            });
            $('#toLogisticsModl').on('click', '.save', function(){ //切换为快递配送
                try {
                    _this.processPrint(2);
                } catch (e) {

                }
                _this.visit_type=1;
                $("#logisticsCode").val("");
                $("#deliveryStaff").val("");
                $("#contactInformation").val("");
                $('#logisticsWrapper').removeClass('hide');
                $('#deliveryWrapper').addClass('hide');
                $('#toLogisticsModl').modal('hide');
            });
            $("#printerDiv").on('hidden.bs.modal', function (e) {
                $("#logisticsCode")[0].focus();
            });
        },
        /**
         * 渲染
         */
        render: function(data){
            T.Template('deliverGoods_list', data||{});
        },
        /**
         * 处理打印事件
         * @param printType
         */
        processPrint:function(printType){
            var _this = this;
            switch(printType - 0){
                case 1 :""; break;
                case 2 :_this.printExpress(); break;
                case 3 :
                    if(confirm("已经打印过快递单，是否重新打印")){
                        _this.printExpress();
                    }
                    break;
            }
        },
        /**
         * 打印快递单
         */
        printExpress: function(){
            var _this = this,
                data = _this.data;
            $("#printerContent").empty();
            if(data && data.info) {
                var info = data.info;
                var str = template1;
                str = str.replace("page", "page1");
                var receiveAddress = info.receiveAddress;
                var tmp = receiveAddress.split('^');
                str = str.replace("province", tmp[0]);
                str = str.replace("mps", tmp[0]);
                str = str.replace("company", info.epName);
                str = str.replace("city", tmp[1]);
                str = str.replace("mc", tmp[1]);
                str = str.replace("area", tmp[2]);
                str = str.replace("ma", tmp[2]);
                str = str.replace("address", tmp[3]);
                str = str.replace("username", info.receiveName);
                str = str.replace("cellphone", info.receiveMobile);
                str = str.replace("goods", "印刷品");
                str = str.replace("orderCode", info.orderCode);
                $("#printerContent").append(str);
                $("#printerDiv").modal('show');
                setTimeout(function(){
                    $("#printerDiv").modal('hide');
                }, 2000);
            }
            var myDoc = {
                settings:{topMargin:10,
                    leftMargin:1,
                    bottomMargin:10,
                    rightMargin:1,
                    printer:'express_printer' },
                documents: document,
                copyrights: '杰创软件拥有版权  www.jatools.com'
            };
            jatoolsPrinter.print(myDoc, false);
            //jatoolsPrinter.printPreview(myDoc)
        },
        getChecked: function(){
            var _this = this,
                $checked = $("input:checkbox[name='checkbox']:checked"),
                arr = [];
            if($checked.length>0){
                $checked.each(function(){
                    var orderCode_batchNum=$(this).data("ordercode")+"-"+$(this).data("batchnum");
                    arr.push(orderCode_batchNum);
                });
                _this.check_value = arr;
            }else{
                T.msg("请勾选需要批量发货的订单商品！");
            }
        },
        getParams: function(){
            var _this = this;
            var parms={};
            var logistics_name=$("select[name=logisticsName]").val();
            var logistics_code=$("#logisticsCode").val();
            var delivery_staff=$("#deliveryStaff").val();
            var contact_information=$("#contactInformation").val();
            if(_this.visit_type==1){
                if($.trim(logistics_name)==""||$.trim(logistics_code)==""){
                    T.msg("请填写物流名以及物流单号！");
                    return false;
                }
                parms.data=T.JSON.stringify(_this.check_value);
                parms.logistics_name=logistics_name;
                parms.logistics_code=logistics_code;
                parms.visit_type=_this.visit_type;
                parms.operator=T.Cookie.get('_a_name');
                parms.fromSystem='2';
            }else if(_this.visit_type==2){
                if($.trim(delivery_staff)==""||$.trim(contact_information)==""){
                    T.msg("请填写配送人员信息以及联系方式！");
                    return false;
                }
                parms.data=T.JSON.stringify(_this.check_value);
                parms.delivery_staff=delivery_staff;
                parms.contact_information=contact_information;
                parms.visit_type=_this.visit_type;
                parms.operator=T.Cookie.get('_a_name');
                parms.fromSystem='2';
            }
            return parms;
        },
        /**
         * 发货
         */
        updateDeliver:function(params){
            var _this = this;
            T.POST({
                action :CFG.API.order.update_deliver,
                params : params,
                success : function(res) {
                    _this.render(res);
                    _this.$cont.checkboxs("checkbox", "checkbox_all"); //全选
                    T.msg("发货成功！");
                    _this.check_value = [];
                    $('#orderCode').val("");
                    $('#orderCode')[0].focus();
                }
            });
        },
        /**
         * 获取扫描商品信息
         */
        getList: function(){
            var _this = this;
            $('#template-deliverGoods_list-view').addClass('load');
            T.GET({
                action: CFG.API.order.query_deliver,
                params: {
                    data:$("#orderCode").val(),
                    fromSystem: 'supplierSystem'
                },
                success: function(res){
                    $('#template-deliverGoods_list-view').removeClass('load');
                    _this.data = res;
                    if(res.infoList && res.infoList.length>0){
                        _this.render(res);
                        try{
                            _this.processPrint(res.printType);
                        }catch(e){

                        }
                        _this.$cont.checkboxs("checkbox", "checkbox_all"); //全选
                        if(res.takeType==17){
                            _this.visit_type=1;
                        }else{
                            _this.visit_type=2;
                        }
                    }
                },
                failure: function(res) {
                    T.msg(res.msg);
                    $('#template-deliverGoods_list-view').removeClass('load');
                }
            });
        }
    };
    deliver_goods.init();
}(window, document));