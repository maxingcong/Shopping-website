!(function(window, document, undefined) {
    "use strict";
    document.title = "编辑物流模板-供应商平台";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var deliveryTemplate = {
        pcd: PCD.multiSelect(),
        data: {},
        init: function(){
            var _this = this;
            _this.$cont = $("#delivery-detail"); //容器
            _this.$priceAreaList = $("#template-price_area_list-view"); //计价区域列表视图
            _this.$freeAreaList = $("#template-free_area_list-view"); //包邮区域列表视图
            _this.$batchSetFreight = $("#template-batch_set_freight-view"); //批量设置运费
            _this.data.id = T.REQUESTS.id;
            _this.data.deliveryId = T.REQUESTS.deliveryId;
            _this.data.type = T.REQUESTS.type||"Weight";
            _this.data.deliveryModeId = T.REQUESTS.modeId;
            _this.data.LOGISTICS_PRICE_TYPE = CFG.LOGISTICS_PRICE_TYPE;
            $("#oneKeyToSetPriceAreaValue").hide();
            if(_this.data.id&&CFG.DELIVERY_METHOD[_this.data.deliveryId]){
                _this.loadTemplateDetail();
            }else if(CFG.LOGISTICS_PRICE_TYPE[_this.data.type]&&CFG.DELIVERY_METHOD[_this.data.deliveryId]&&_this.data.deliveryModeId){
                _this.loadSupplierDetail();
            }else{
                setTimeout(function(){
                    T.PlatformRedirect(T.DOMAIN.WWW + "delivery/list.html", true);
                }, 300);
            }
            _this.events();
        },
        /**
         * 渲染页面
         */
        render: function(){
            var _this = this;
            _this.$cont.removeClass("load");debugger
            _this.setValuationMethod(_this.data.type);
            T.Template("template_detail", _this.data);
            //设置地址级联
            PCD.initSelect("address", _this.data.deliveryModeTemplate.departPlace||"");
            var optionsData = CFG.LOGISTICS;
            /*上门自提：上门自提
            加急快递：顺丰
            工厂发货：工厂发货
            专车配送：专车配送
            物流发货：德邦物流、天地华宇、速尔物流、优速物流、远成物流、佳怡物流、龙邦物流*/
            if(_this.data.deliveryModeTemplate.deliveryId==2){ //上门自提
                optionsData = [{
                    "name": "上门自提"
                }];
            }else if(_this.data.deliveryModeTemplate.deliveryId==18){ //加急快递
                optionsData = [{
                    "key": "shunfeng",
                    "name": "顺丰速运"
                }];
            }else if(_this.data.deliveryModeTemplate.deliveryId==5){ //工厂发货
                optionsData = [{
                    "name": "工厂发货"
                }];
            }else if(_this.data.deliveryModeTemplate.deliveryId==16){ //专车配送
                optionsData = [{
                    "name": "专车配送"
                }];
            }else if(_this.data.deliveryModeTemplate.deliveryId==4){ //物流发货
                optionsData = [{
                    "name": "德邦物流"
                },{
                    "name": "天地华宇"
                },{
                    "name": "速尔物流"
                },{
                    "name": "优速物流"
                },{
                    "name": "远成物流"
                },{
                    "name": "佳怡物流"
                },{
                    "name": "龙邦物流"
                }];
            }
            //初始化物流公司下拉框
            $("#selectLogisticsCompany").setOptions({
                data: optionsData,
                key: 'name',
                val: 'name',
                value: _this.data.deliveryModeTemplate.shippingCompany||"",
                len: 1
            });
            var shippingCompany = $("#selectLogisticsCompany").val();
            if(_this.data.deliveryModeTemplate.deliveryId==17&&_this.data.deliveryModeTemplate.shippingCompany&&!shippingCompany){
                $("#selectLogisticsCompany").val(CFG.LOGISTICS[CFG.LOGISTICS.length-1].name)
                    .next().show().val(_this.data.deliveryModeTemplate.shippingCompany);
            }
            T.Template("price_area_list", _this.data);
            T.Template("free_area_list", _this.data);
            T.BindData("data", _this.data);
            //如果设置了指定条件包邮，则显示包邮区域
            if(_this.data.deliveryModeTemplate&&_this.data.deliveryModeTemplate.freeAreaList&&_this.data.deliveryModeTemplate.freeAreaList.length){
                $("#pinkagePost").click();
            }
            setTimeout(function(){
                _this.renderValuationMethod();
            }, 10);
            $("#oneKeyToSetPriceAreaValue").show();
        },
        /**
         * 设置物流计价方式
         * @param {String} [valuationMethod=_this.data.deliveryModeTemplate.valuationMethod] 物流计价方式
         */
        setValuationMethod: function(valuationMethod){
            var _this = this;
            var valuationMethod = valuationMethod||_this.data.deliveryModeTemplate.valuationMethod;
            if(valuationMethod=="Number"){
                _this.data.METHOD = "件数";
                _this.data.UNIT = "件";
                _this.data.OPTIONS = {
                    "Sum": "金额",
                    "Number": "件数",
                    "SumNumber": "金额+件数"
                };
            }else if(valuationMethod=="Acreage"){
                _this.data.METHOD = "面积";
                _this.data.UNIT = "㎡";
                _this.data.OPTIONS = {
                    "Sum": "金额",
                    "Acreage": "面积",
                    "SumAcreage": "金额+面积"
                };
            }else if(valuationMethod=="Volume"){
                _this.data.METHOD = "体积";
                _this.data.UNIT = "m³";
                _this.data.OPTIONS = {
                    "Sum": "金额",
                    "Volume": "体积",
                    "SumVolume": "金额+体积"
                };
            }else{
                _this.data.METHOD = "重";
                _this.data.UNIT = "kg";
                _this.data.OPTIONS = {
                    "Sum": "金额",
                    "Weight": "重量",
                    "SumWeight": "金额+重量"
                };
            }
            _this.renderValuationMethod();
        },
        /**
         * 渲染物流计价方式
         */
        renderValuationMethod: function(){
            var _this = this;
            //设置物流计价方式
            $(".logistics-price-type", _this.$cont).html(_this.data.METHOD);
            ////设置物流计价单位
            $(".logistics-price-type-unit", _this.$cont).html(_this.data.UNIT);
            //设置包邮条件
            $("select[name='freeType']", _this.$cont).each(function(i, el){
                var idx = el.selectedIndex;
                $(el).setOptions({
                    data: _this.data.OPTIONS
                });
                el.selectedIndex = idx;
                _this.selectFreeType($(el));
            });
            if(_this.data.UNIT == "件"){ //按件数时只能是整数
                $("input[name='maxAmount'], input[name='firstWeight'], input[name='addWeight']", _this.$cont).each(function(i, el){
                    var $input = $(this);
                    $input.val(_this.parseInputValue($input.val(), $input.attr("name")));
                });
            }
        },
        /**
         * 获取区域字符串
         * @param {String} destination //区域
         * @returns {string}
         */
        getAreaStr: function(destination){
            return (destination||"").replace(/^;+/, "").replace(/;+$/, "");
        },
        /**
         * 获取区域数组
         * @param {String} destination //区域
         * @returns {Array}
         */
        getAreaList: function(destination){
            return destination?this.getAreaStr(destination).split(";"):[];
        },
        /**
         * 查询供应商信息
         */
        loadSupplierDetail: function(){
            var _this = this;
            T.GET({
                action: CFG.API.supplier.supplier_detail,
                success: function(data, params){
                    data = data||{};
                    data.supplier = data.supplier||{};
                    _this.data.deliveryModeTemplate = {};
                    _this.data.deliveryModeTemplate.deliveryId = _this.data.deliveryId;
                    _this.data.deliveryModeTemplate.deliveryModeId = _this.data.deliveryModeId;
                    _this.data.deliveryModeTemplate.deliveryName = CFG.DELIVERY_METHOD[_this.data.deliveryId];
                    _this.data.deliveryModeTemplate.valuationMethod = _this.data.type;
                    _this.data.deliveryModeTemplate.valuationMethodName = CFG.LOGISTICS_PRICE_TYPE[_this.data.deliveryModeTemplate.valuationMethod]||"";
                    _this.data.deliveryModeTemplate.departPlace = data.supplier.companyAddress||"";
                    _this.data.priceAreaDisabled = [];
                    _this.data.freeAreaDisabled = [];
                    _this.render();
                }
            });
        },
        /**
         * 加载物流模板
         */
        loadTemplateDetail: function(){
            var _this = this;
            T.GET({
                action: CFG.API.delivery.find_mode_template,
                params: {
                    id: _this.data.id
                },
                success: function(data, params){debugger
                    data = data||{};
                    _this.data.deliveryModeTemplate = data.deliveryModeTemplate||{};
                    _this.data.deliveryModeTemplate.deliveryId = _this.data.deliveryId;
                    _this.data.deliveryModeTemplate.deliveryName = _this.data.deliveryModeTemplate.deliveryName||CFG.DELIVERY_METHOD[_this.data.deliveryId];
                    if(!_this.data.deliveryModeTemplate.valuationMethod){
                        _this.data.deliveryModeTemplate.valuationMethod = "Weight";
                    }
                    _this.data.deliveryModeTemplate.valuationMethodName = CFG.LOGISTICS_PRICE_TYPE[_this.data.deliveryModeTemplate.valuationMethod]||"";
                    var disabled = [];
                    T.Each(_this.data.deliveryModeTemplate.priceAreaList, function(i, priceArea){
                        if(priceArea.destination){
                            disabled = disabled.concat(_this.getAreaList(priceArea.destination));
                        }
                    });
                    _this.data.priceAreaDisabled = disabled;
                    disabled = [];
                    T.Each(_this.data.deliveryModeTemplate.freeAreaList, function(i, freeArea){
                        if(freeArea.destination){
                            disabled = disabled.concat(_this.getAreaList(freeArea.destination));
                        }
                    });
                    _this.data.freeAreaDisabled = disabled;
                    _this.render();
                    _this.$cont.checkboxs("priceArea", "priceArea_all"); //全选
                }
            });
        },
        /**
         * 选择包邮条件
         * @param {jQuery} $select 下拉框对象
         */
        selectFreeType: function($select){
            var _this = this;
            if($select&&$select[0]){
                var idx = $select[0].selectedIndex;
                var $span = $select.next("span");
                $span.html(Utils.template("template-free_type_option", {
                    type: idx,
                    minAmount: $("input[name='minAmount']", $span).val(),
                    maxAmount: $("input[name='maxAmount']", $span).val(),
                    METHOD: _this.data.METHOD,
                    UNIT: _this.data.UNIT,
                    Number: Number,
                    RMB: T.RMB
                }));
            }
        },
        /**
         * 获取模板参数
         * @returns {{}}
         */
        getParams: function(){
            var _this = this;
            var params = {};
            params.deliveryModeTemplate = {};
            if(_this.data.deliveryModeTemplate.id){
                params.deliveryModeTemplate.id = _this.data.deliveryModeTemplate.id;
            }
            params.deliveryModeTemplate.deliveryId = _this.data.deliveryModeTemplate.deliveryId||""; //配送方式
            params.deliveryModeTemplate.deliveryModeId = _this.data.deliveryModeTemplate.deliveryModeId||""; //配送方式
            params.deliveryModeTemplate.shippingCompany = $("#selectLogisticsCompany").val()||"";
            params.deliveryModeTemplate.departPlace = $("input[name='departPlace']", _this.$cont).val()||"";
            params.deliveryModeTemplate.valuationMethod = _this.data.deliveryModeTemplate.valuationMethod;//$("input[name='logisticsPriceType']:checked", _this.$cont).val()||params.deliveryModeTemplate.valuationMethod||""; //计价方式
            params.deliveryModeTemplate.status = String(_this.data.deliveryModeTemplate.status||0);
            params.deliveryModeTemplate.freeDelivery = _this.data.deliveryModeTemplate.freeDelivery||0; //是否指定条件包邮
            params.deliveryModeTemplate.description = $("textarea[name='description']", _this.$cont).val()||"";
            if(!params.deliveryModeTemplate.shippingCompany){
                T.msg("请选择物流公司！");
                return;
            }
            if(params.deliveryModeTemplate.shippingCompany==CFG.LOGISTICS[CFG.LOGISTICS.length-1].name){
                params.deliveryModeTemplate.shippingCompany = $("#selectLogisticsCompany").next().val();
                if(!params.deliveryModeTemplate.shippingCompany){
                    T.msg("请填写物流公司！");
                    return;
                }
            }
            /*if(!params.deliveryModeTemplate.valuationMethod){
                T.msg("请选择物流计价方式！");
                return;
            }*/
            params.areaPriceData = [];
            $("tbody>tr", _this.$priceAreaList).each(function(i, el){
                var item = {};
                var $tr = $(el);
                var id = $tr.data("id");
                var destination = $tr.data("destination")||"";
                if(id&&!destination){
                    var area = T.Array.get(_this.data.deliveryModeTemplate.priceAreaList, id, "id");
                    if(area){
                        destination = destination||area.destination||"";
                    }
                }
                if(id)item.id = id;
                if(destination){
                    item.objectId = 3; // 1：“同省、同市、同区”，2：仓储中心，3：具体地址
                    item.destination = destination;
                    item.firstWeight = (_this.data.UNIT==="件"?parseInt(Math.round($("input[name='firstWeight']", $tr).val()), 10):Math.abs(parseFloat($("input[name='firstWeight']", $tr).val())))||1;
                    item.firstPrice = Math.abs(parseFloat($("input[name='firstPrice']", $tr).val()))||0;
                    item.addWeight = (_this.data.UNIT==="件"?parseInt(Math.round($("input[name='addWeight']", $tr).val()), 10):Math.abs(parseFloat($("input[name='addWeight']", $tr).val())))||1;
                    item.addPrice = Math.abs(parseFloat($("input[name='addPrice']", $tr).val()))||0;
                    item.deliveryTime = Math.abs(parseFloat($("input[name='deliveryTime']", $tr).val()))||0;
                    params.areaPriceData.push(item);
                }
            });
            if(!params.areaPriceData.length){
                T.msg("请填写物流配送区域及价格！");
                return;
            }
            params.freePriceData = [];
            if($("#pinkagePost:checked").length){//指定包邮条件
                $("tbody>tr", _this.$freeAreaList).each(function(i, el){
                    var item = {};
                    var $tr = $(el);
                    var id = $tr.data("id");
                    var destination = $tr.data("destination")||"";
                    if(id&&!destination){
                        var area = T.Array.get(_this.data.deliveryModeTemplate.freeAreaList, id, "id");
                        if(area){
                            destination = destination||area.destination||"";
                        }
                    }
                    if(id)item.id = id;debugger
                    var freeType = $("select[name='freeType']", $tr).val();
                    if(freeType&&destination){
                        item.destination = destination;
                        item.freeType = freeType;
                        item.minAmount = Math.abs(parseFloat($("input[name='minAmount']", $tr).val()))||0;
                        item.maxAmount = freeType.indexOf("Number")<0?Math.abs(parseFloat($("input[name='maxAmount']", $tr).val()))||0:parseInt(Math.round($("input[name='maxAmount']", $tr).val()), 10)||0;
                        params.freePriceData.push(item);
                    }
                });
            }
            params.deliveryModeTemplate.freeDelivery = String(params.freePriceData.length);
            return params;
        },
        /**
         * 保存物流模板
         */
        saveTemplate: function(){
            var _this = this;
            var params = _this.getParams();
            if(params){
                var action = CFG.API.delivery.edit_mode_template;
                if(!params.deliveryModeTemplate.id){
                    action = CFG.API.delivery.save_mode_template;
                }
                T.POST({
                    action: action,
                    params: params,
                    success: function(data, params){
                        T.msg("保存成功");
                        setTimeout(function(){
                            T.PlatformRedirect(T.DOMAIN.WWW + "delivery/list.html", true);
                        }, 1000);
                    }
                });
            }
        },
        /**
         * 选择区域
         * @param {jQuery} $tr 当前行
         * @param {Number} [type=0] 类型，0：物流配送区域及价格，1：指定条件包邮
         */
        selectArea: function($tr, type){
            var _this = this;
            var cfg = {
                level: 2,
                checked: [],
                disabled: (type==1?_this.data.freeAreaDisabled:_this.data.priceAreaDisabled)||[]
            };
            cfg.checked = _this.getAreaList($tr.data("destination")||"");
            var id = $tr.data("id");
            if(id&&cfg.checked&&!cfg.checked.length){
                var areaList = type==1?_this.data.deliveryModeTemplate.freeAreaList:_this.data.deliveryModeTemplate.priceAreaList;
                var area = T.Array.get(areaList, id, "id");
                if(area&&area.destination){
                    cfg.checked = _this.getAreaList(area.destination);
                }
            }

            //加载模板
            var $view = T.Template("address_multi_select", "modal_content", {
                TITLE: "添加可配送区域"
            });
            //初始化地址树
            _this.pcd.init(cfg);
            $("#myModal").modal("show");
            $view.off("click.save").on("click.save", ".save", function(e){
                var data = _this.pcd.getChecked(); //获取选中
                if(data&&data.data&&data.data.length){
                    var destination = ";"+data.data.join(";")+";";
                    if(id||$tr.data("destination")){
                        $(".destination", $tr).html(_this.getAreaStr(destination));
                    }else{
                        if(type==1){ //指定条件包邮
                            var $tbody = $("tbody", _this.$freeAreaList);
                            $tr = $(Utils.template("template-free_area_each", {
                                deliveryModeTemplate:{
                                    freeAreaList: [{
                                        destination: _this.getAreaStr(destination)
                                    }]
                                },
                                METHOD: _this.data.METHOD,
                                UNIT: _this.data.UNIT,
                                OPTIONS: _this.data.OPTIONS
                            })).appendTo($tbody);
                            $tbody.next("thead").hide();
                        }else{ //物流配送区域及价格
                            var $tbody = $("tbody", _this.$priceAreaList);
                            $tr = $(Utils.template("template-price_area_each", {
                                deliveryModeTemplate:{
                                    priceAreaList: [{
                                        CHECKED: $("input[name='priceArea_all']:checked", _this.$priceAreaList).length,
                                        destination: _this.getAreaStr(destination)
                                    }]
                                },
                                METHOD: _this.data.METHOD,
                                UNIT: _this.data.UNIT,
                                OPTIONS: _this.data.OPTIONS
                            })).appendTo($tbody);
                            $tbody.next("thead").hide();
                            _this.setSerialNumber();
                        }
                    }
                    $tr.data("destination", destination);
                    if(type==1){ //指定条件包邮
                        //设置禁用区域
                        _this.data.freeAreaDisabled = T.Array.merge(_this.data.freeAreaDisabled, data.data, cfg.checked, true);
                    }else{ //物流配送区域及价格
                        //设置禁用区域
                        _this.data.priceAreaDisabled = T.Array.merge(_this.data.priceAreaDisabled, data.data, cfg.checked, true);
                    }
                    $("#myModal").modal("hide");
                }else{
                    T.msg("请选择配送区域！");
                }
                console.log("address_multi_select", data);
            });
        },
        /**
         * 设置序号
         */
        setSerialNumber: function(){
            var _this = this;
            $(".serial-number", _this.$priceAreaList).each(function(i, el){
                $(el).html(i+1);
            });
            _this.$cont.checkboxs("priceArea", "priceArea_all"); //全选
        },
        /**
         * 解析输入框的值
         * @param {Number|String} val 输入值
         * @param {String} name 输入框name
         * @returns {*}
         */
        parseInputValue: function(val, name){
            var _this = this;
            if(_this.data.UNIT == "件" && (name=="maxAmount" || name=="firstWeight" || name=="addWeight")){
                val = String(val).replace(/[^0-9.]/g, "");
                val = parseInt(Math.round(val), 10)||0;
            }else{
                val = String(val).replace(/[^0-9.]/g, "");
                val = Math.round((parseFloat(val)||0)*100)/100;
            }
            if(name=="firstWeight" || name=="addWeight"){
                val = val||1;
            }
            return val;
        },
        events: function(){
            var _this = this;
            _this.$cont.on("change.selectLogisticsCompany", "#selectLogisticsCompany", function(e){ //选择物流计价方式
                var $this = $(this);
                if($this.val()==CFG.LOGISTICS[CFG.LOGISTICS.length-1].name){
                    $this.next().show();
                }else{
                    $this.next().hide();
                }
            }).on("click.edit-price-area", ".edit-price-area", function(e){ //添加/编辑配送区域
                _this.selectArea($(this).closest("tr"), 0);
            }).on("click.del-price-area", ".del-price-area", function(e){ //删除配送区域
                var $tr = $(this).closest("tr");
                var area = T.Array.get(_this.data.deliveryModeTemplate.priceAreaList, $tr.data("id"), "id")||{};
                //设置禁用区域
                _this.data.priceAreaDisabled = T.Array.merge(_this.data.priceAreaDisabled, [], _this.getAreaList($tr.data("destination")||area.destination||""), true);
                $tr.remove();
                _this.setSerialNumber();
                return false;
            }).on("click.multi-del-price-area", ".multi-del-price-area", function(e){ //批量删除配送区域
                var count = $("tbody>tr", _this.$priceAreaList).length;
                var $inputs = $("tbody input[name='priceArea']:checked", _this.$priceAreaList);
                if(count>0&&$inputs.length>0){
                    if(count==$inputs.length){
                        $("tbody", _this.$priceAreaList).next("thead").hide();
                    }
                    $inputs.each(function(i, el){
                        var $tr = $(el).closest("tr");
                        var area = T.Array.get(_this.data.deliveryModeTemplate.priceAreaList, $tr.data("id"), "id")||{};
                        //设置禁用区域
                        _this.data.priceAreaDisabled = T.Array.merge(_this.data.priceAreaDisabled, [], _this.getAreaList($tr.data("destination")||area.destination||""), true);
                        $tr.remove();
                    });
                    _this.setSerialNumber();
                }else{
                    T.msg("请先选择要删除的配送区域！");
                }
                return false;
            }).on("click.edit-free-area", ".edit-free-area", function(e){ //添加/编辑包邮区域
                _this.selectArea($(this).closest("tr"), 1);
            }).on("click.del-free-area", ".del-free-area", function(e){ //删除包邮区域
                var $tr = $(this).closest("tr");
                var area = T.Array.get(_this.data.deliveryModeTemplate.freeAreaList, $tr.data("id"), "id")||{};
                //设置禁用区域
                _this.data.freeAreaDisabled = T.Array.merge(_this.data.freeAreaDisabled, [], _this.getAreaList($tr.data("destination")||area.destination||""), true);
                $(this).closest("tr").remove();
                return false;
            }).on("click.logisticsPriceType", "input[name='logisticsPriceType']", function(e){ //选择物流计价方式
                _this.setValuationMethod($(this).val());
            }).on("change.freeType", "select[name='freeType']", function(e){ //选择包邮方式
                _this.selectFreeType($(this));
            });
            _this.$freeAreaList.on("blur.number", ".form-control[type='text'][name]", function(e){ //输入框失焦
                var $input = $(this);
                $input.val(_this.parseInputValue($input.val(), $input.attr("name")));
            }).on("afterpaste.number", ".form-control[type='text'][name]", function (e) { //粘贴时过滤掉非数字字符
                var $input = $(this);
                $input.val(_this.parseInputValue($input.val(), $input.attr("name")));
            });
            _this.$priceAreaList.on("blur.number", ".form-control[type='text'][name]", function(e){ //输入框失焦
                var $input = $(this);
                $input.val(_this.parseInputValue($input.val(), $input.attr("name")));
            }).on("afterpaste.number", ".form-control[type='text'][name]", function (e) { //粘贴时过滤掉非数字字符
                var $input = $(this);
                $input.val(_this.parseInputValue($input.val(), $input.attr("name")));
            }).on("click.batch-set-freight", ".batch-set-freight", function(e){ //批量设置运费
                T.Template("batch_set_freight", {
                    METHOD: _this.data.METHOD,
                    UNIT: _this.data.UNIT
                });
                $("#batchSetFreight").modal("show");
            });
            _this.$batchSetFreight.on("blur.number", ".form-control[type='text'][name]", function(e){ //输入框失焦
                var $input = $(this);
                $input.val(_this.parseInputValue($input.val(), $input.attr("name")));
            });
            $("#batchSetFreight").off("click.save").on("click.save", ".save", function(e){ //批量设置运费
                $("input[name]", _this.$batchSetFreight).each(function(i, el){
                    var $input = $(el);
                    var name = $input.attr("name");
                    $("input[name='"+name+"']", _this.$priceAreaList).val(_this.parseInputValue($input.val(), name));
                });
                $("#batchSetFreight").modal("hide");
            });
            $("#oneKeyToSetPriceAreaValue").click(function(e){ //一键使用默认物流价格
                if(_this.data.deliveryModeTemplate.priceAreaList){
                    var area = _this.data.deliveryModeTemplate.priceAreaList[0];
                    if(area){
                        $("input[name='firstWeight']", _this.$priceAreaList).val(area.firstMeteringSize||1);
                        $("input[name='firstPrice']", _this.$priceAreaList).val(area.firstMeteringSizePrice||0);
                        $("input[name='addWeight']", _this.$priceAreaList).val(area.additionalMeteringSize||1 );
                        $("input[name='addPrice']", _this.$priceAreaList).val(area.additionalMeteringSizePrice||0);
                        $("input[name='deliveryTime']", _this.$priceAreaList).val(area.deliveryTime||0);
                    }
                }
            });
            $("#oneKeyToEmptyPriceAreaValue").click(function(e){ //一键清空价格区域值
                $("input[type='text']", _this.$priceAreaList).val("");
            });
            $("#pinkagePost").click(function(e){ //指定条件包邮展开关闭
                $(this).parent().prev().click();
            });
            $("#saveTemplate").click(function(e){ //提交审核
                _this.saveTemplate();
            });
        }
    };
    deliveryTemplate.init();
}(window, document));