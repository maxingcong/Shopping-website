!(function(window, document, undefined) {
    "use strict";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    function Product(options){
        var _this = this;
        options = options||{};
        _this.$cont = options.$cont;
        _this.modes = ["基础重量","基础价格", "基础货期"]; //编辑模式，0：编辑重量，1：编辑价格，2：编辑货期
        _this.product = {
            firstNames: [],
            firstNamesCount: 0,
            lastNames: [],
            lastNamesCount: 0,
            namesColCount: 0,
            lastNamesColCount: 0,
            names: [],
            attrs: [],
            values: [],
            json: [] //[属性,价格,货期]
        };
        /**
         * 解析产品数据
         * @param product 产品数据
         * @param [pattr] 选中的产品属性字符串
         */
        _this.analysis = function(product, pattr){
            var _this = this;
            pattr = pattr||"";
            if (product && product.params && product.baseInfoName) {
                var baseInfoName = product.baseInfoName;
                product.baseInfoName = baseInfoName.replace(/\-+$|\_+$/, ""); //去掉属性串多余的分隔符
                var baseInfoName = product.baseInfoName;
                var _idx = baseInfoName.indexOf("-");
                var firstName = baseInfoName, lastName = "";
                if (_idx > 0){
                    firstName = baseInfoName.substring(0, _idx);
                    lastName = baseInfoName.substring(_idx+1).replace("-", "_");
                }
                var firstNames = firstName?firstName.split("_"):[]; //基础属性集合
                var lastNames = lastName?lastName.split("_"):[]; //附加属性集合
                var names = firstNames.concat(lastNames); //属性名数组
                var attrs = {}; //属性值对象数组
                //创建与属性名等长的属性值二维数组
                for (var name="", i = 0; name=names[i]; i++) {
                    attrs[name] = [];
                }
                var values = pattr.replace("-", "_").split("_"); //已选择的属性值数组
                T.Each(product.params, function(key, param) {
                    var keys = key.replace("-", "_").split("_");
                    //基本属性
                    for (var attr="", j = 0; attr = keys[j]; j++) {
                        T.Array.add(attrs[names[j]], attr, false);
                    }
                    //附加属性
                    T.Each(param["工艺属性"], function(k, vals) {
                        var idx = T.Array.indexOf(names, k);
                        if(idx>=0){
                            T.Each(vals, function(atr, val) {
                                T.Array.add(attrs[names[idx]], atr, false);
                            });
                        }
                    });
                });
                product.firstNames = firstNames;
                product.firstNamesCount = firstNames.length;
                product.lastNames = lastNames;
                product.lastNamesCount = lastNames.length;
                product.namesColCount = names.length;
                product.lastNamesColCount = 0;
                for(var l=product.firstNamesCount; l<product.namesColCount; l++){
                    product.lastNamesColCount =+ attrs[names[l]].length;
                }
                product.names = names;
                product.attrs = attrs;
                product.values = values;
            }else{
                product.names = [];
            }
            _this.product = T.Inherit(_this.product, product);
            return product;
        };
        /**
         * 获取参数值
         * @param {Number} editMode 编辑模式
         * @returns {{}}
         */
        _this.getProductParams = function(editMode){
            _this.setProductParams(editMode);
            var params = _this.product.json[editMode]||{};
            if(params){
                var data = {};
                T.Each(params, function(k, items){
                    data[k] = {};
                    data[k]["基础值"] = items["基础值"]||0;
                    T.Each(items["工艺属性"], function(i, item){
                        if(T.Typeof(item,/Object/)){
                            T.Each(item, function(key, val){
                                data[k][key] = val||0;
                            });
                        }else{
                            data[k][i] = item||0;
                        }
                    });
                });
                return data;
            }
        };
        /**
         * 读取表格数据更新产品重量/价格/货期
         * @param {Number} editMode 编辑模式
         */
        _this.setProductParams = function(editMode){
            var _this = this;
            var params = _this.product.json[editMode]||{};
            if(!params)return;
            $(".table-product-price table[data-mode='"+editMode+"'] .form-control", _this.$cont).each(function(i, el){
                var $input = $(el);
                var name = $input.data("name");
                var attr = $input.data("attr");
                var firstName = $input.data("first_name");
                var value = _this.parseInputValue($input.val(), editMode);
                if(name&&firstName){
                    if(attr){
                        if(params[firstName]){
                            if(params[firstName]["工艺属性"]){
                                if(typeof(params[firstName]["工艺属性"][name])!="undefined"){
                                    if(name==attr){
                                        params[firstName]["工艺属性"][name] = value;
                                    }else if(typeof(params[firstName]["工艺属性"][name][attr])!="undefined"){
                                        params[firstName]["工艺属性"][name][attr] = value;
                                    }
                                }
                            }
                        }
                    }else if(name=="基础值"){//基础值
                        if(params[firstName]){
                            params[firstName][name] = value;
                        }
                    }
                }
            });
        };
        /**
         * 解析输入框的值
         */
        _this.parseInputValue = function(val, mode){
            var ret = NaN;
            if(mode==2||mode==3||mode==5){//货期、纸张损耗
                ret = Math.round(parseFloat(val));
            }else{
                ret = parseFloat(val);
            }
            if(isNaN(ret)){
                ret = -1;
            }
            if(ret<0){
                ret = -1;
            }
            return ret;
        };
        /**
         * 绑定事件
         */
        _this.events = function(){
            _this.$cont.on("blur.input", ".table-product-price .form-control", function(e) {//输入框失焦验证
                var $input = $(this);
                var $cont = $input.closest(".table", _this.$cont);
                var val = _this.parseInputValue($input.val(), $cont.data("mode"));
                $input.val(val>=0?val:"");
            }).on("click.multi-row", ".table-product-price .multi-row", function(e){//多行批量编辑
                var $this = $(this);
                var $cont = $this.closest(".table", _this.$cont);
                var name = $this.data("name")||"";
                var editMode = $cont.data("mode");
                var editModeStr = _this.modes[editMode];
                if(name){
                    var data = {
                        TITLE: "批量编辑"+name,
                        name: name,
                        attrs: _this.product.attrs[name]
                    };
                    if(editModeStr&&name=="基础值"){//基础值
                        data.TITLE = "批量编辑"+editModeStr;
                        data.attrs = [editModeStr];
                    }else if(editMode>2){
                        data.attrs = [name];
                    }
                    var $view = T.Template("product_attrs", "modal_content", data);
                    $("#myModal").modal("show");
                    $view.on("click.save", ".save", function(e){//保存编辑
                        $(".table .form-control", $view).each(function(i, el){
                            var attr = $(el).closest("td").data("attr");
                            var value = $(el).val();
                            if(attr){
                                if(name=="基础值"){//基础值
                                    $("input[data-name='"+name+"']", $cont).val(value>=0?value:"");
                                }else{
                                    $("input[data-attr='"+attr+"']", $cont).val(value>=0?value:"");
                                }
                            }
                        });
                        $("#myModal").modal("hide");
                    }).on("blur.input", ".form-control", function(e) {//输入框失焦验证
                        var $input = $(this);
                        var val = _this.parseInputValue($input.val(), editMode);
                        $input.val(val>=0?val:"");
                    });
                }
            });
        };
        _this.events();
    }
    var pdt, ProductDetail = {
        data: {
            auditStatus: "", //审核状态
            orderStatus: "" //接单状态
        },
        paramsTableTemplate: "product_params_table", //产品属性表
        status: ['', ''], //状态[物理/可供应产品详情,供应商的配送方式]
        handerNumSettingData: [
            {
                name: '骑马钉',
                options: ['16P一手', '8P一手']
            },
            {
                name: '锁线胶装',
                options: ['16P一手', '8P一手']
            },{
                name: '无线胶装',
                options: ['16P一手', '8P一手']
            },{
                name: 'YO圈装',
                options: ['16P一手', '8P一手']
            }
        ],
        init: function(){
            var _this = this;
            _this.data = {
                showMode: 0, //显示模式，0：查看，1：编辑，2：新增
                quoteExcel: "" //Excel空白模板
            };
            _this.$cont = $("#product-detail"); //容器
            pdt = new Product({
                $cont: _this.$cont
            });
            _this.modes = pdt.modes||[];
            if(T.REQUESTS.id){
                _this.data.showMode = 0;
                $("#curr_pos_text").text("查看可供应产品详情");
                document.title =  "查看可供应产品详情-供应商平台";
                _this.data.id = T.REQUESTS.id;
                _this.loadProduct();
            }else{
                _this.data.showMode = 2;
                $("#curr_pos_text").text("新建可供应产品");
                document.title =  "新建可供应产品-供应商平台";
                T.Template("product_detail", _this.data);
                _this.renderColumns();
                _this.render();
                _this.loadCategoryList();
            }
            _this.showBtn();
            _this.events();
        },
        clearData: function(){
            var _this = this;
            _this.data.physicalId = "";
            _this.data.baseInfoName = "";
            _this.data.quoteExcel = "";
            _this.data.deliveryDayInfo = null;
            _this.data.costPriceInfo = null;
            _this.data.automated = false;

            _this.data.paperLossName = '';
            _this.data.processPriceName = '';
            _this.data.aveDeliveryTime = -1;
            _this.data.paperLossPrice = null;
            _this.data.innerPaperLossPrice = null;
            _this.data.processPrice = null;
            _this.data.handerNum = null; //手数设置

            _this.data.isReceiverToIn = false;
            _this.data.isReceiverToUser = false;
            _this.data.productSupportDeliveryList = []; //产品支持的配送方式
            _this.data.deliveryList = []; //供应商到支持的配送方式
            _this.data.inModeList = []; //供应商到云印支持的配送方式
            _this.data.userModeList = []; //供应商到用户支持的配送方式
            _this.data.approvedDeliveryList = []; //供应商已通过审核的配送方式
            _this.data.deliveryToInList = []; //发货给云印仓储中心
            _this.data.deliveryToUserList = []; //发货给用户
            _this.render();
        },
        /**
         * 按钮显示控制
         */
        showBtn: function(){
            var _this = this;
            if(_this.data.showMode==1){
                $("#curr_pos_text").text("编辑可供应产品");
                document.title =  "编辑可供应产品-供应商平台";
            }
            if(_this.data.showMode>0){
                $("#productUpdateBtn").hide();
                $("#productSaveBtn").show();
            }else{
                $("#productUpdateBtn").show();
                $("#productSaveBtn").hide();
            }
        },
        renderColumns: function(){
            var _this = this;
            T.Template('product_info_details', _this.data);
            if(!_this.data.automated){
                //导入货期Excel
                Uploader({
                    type: "xls,xlsx",
                    inputId: "import_delivery_excel",
                    text: "上传Excel",
                    text2: "重新上传Excel",
                    onSuccess: function(params){//上传完成
                        _this.importExcel(params.fileUri, "#template-product_delivery_table-view");
                    }
                });
                //导入价格Excel
                Uploader({
                    type: "xls,xlsx",
                    inputId: "import_price_excel",
                    text: "上传Excel",
                    text2: "重新上传Excel",
                    onSuccess: function(params){//上传完成
                        _this.importExcel(params.fileUri, "#template-product_price_table-view");
                    }
                });
            }
        },
        /**
         * 渲染页面
         */
        render: function(){
            var _this = this;
            if(!_this.data.automated){
                pdt.analysis({
                    json: [_this.data.quoteInfo, _this.data.costPriceInfo, _this.data.deliveryDayInfo],
                    params: _this.data.quoteInfo,
                    baseInfoName: _this.data.baseInfoName
                });
                $('#product_attrs').removeClass('hide');
                T.Template("product_params", pdt.product);
                _this.loadDeliveryTable();
                _this.loadPriceTable();
            }else{//自动报价产品
                $('#product_attrs').addClass('hide');
                T.Template("product_delivery_table", {showMode: _this.data.showMode, aveDeliveryTime: _this.data.aveDeliveryTime});
                _this.loadProcessPriceTable();
                _this.loadPaperLossTable();
                if(_this.data.physicalId=='299'){//画册自动报价
                    _this.loadPaperLossInnerTable();
                    T.Template("option_settings", {showMode: _this.data.showMode, optionSettingsData: _this.handerNumSettingData, currentValue: _this.data.handerNum});
                }else{
                    _this.loadCostPriceTable();
                }
            }
            T.Template("product_delivery", _this.data);
            T.BindData("data", _this.data);
            _this.showBtn();
            var suffix = "", idx = _this.data.quoteExcel.lastIndexOf(".");
            if(idx>0){
                suffix = _this.data.quoteExcel.substring(idx);
            }
            $("#down_delivery_excel", _this.$cont).attr("href", _this.data.quoteExcel + "?download/" + encodeURIComponent(_this.data.productName + "-生产货期模板") + suffix);
            $("#down_price_excel", _this.$cont).attr("href", _this.data.quoteExcel + "?download/" + encodeURIComponent(_this.data.productName + "-供货价格模板") + suffix);
            $(".btn-excel", _this.$cont).addClass("hide");
            if(_this.data.physicalId&&(_this.data.baseInfoName||_this.data.processPriceName)){
                if(_this.data.showMode>0){
                    $(".btn-excel", _this.$cont).removeClass("hide");
                }
                $("#productSaveBtn").removeClass("dis");
            }else{
                $("#productSaveBtn").addClass("dis");
            }
            if(_this.data.quoteExcel&&_this.data.productName){
                $(".quote-excel", _this.$cont).removeClass("dis");
            }else{
                $(".quote-excel", _this.$cont).addClass("dis");
            }
        },
        /**
         * 导入Excel数据
         * @param {String} excelUrl Excel路径
         * @param {String} tableId 表格ID
         */
        importExcel: function(excelUrl, tableId){
            var _this = this;
            var $table = $(".table-product-price table", tableId);
            var mode = $table.data("mode");
            if(excelUrl&&$table&&$table.length&&mode>0){
                //quote_excel=http://cloud.ininin.com/1453452524507.xlsx
                T.POST({
                    action: CFG.API.product.physics_upload_excel,
                    params: {
                        quote_excel: excelUrl
                    },
                    success: function(data, params){
                        data = data||{};
                        function getValue(key, name, attr){
                            var param = null, value = null;
                            if(T.Typeof(data.params, /Object/)&&key){
                                param = data.params[key];
                            }
                            if(T.Typeof(param, /Object/)){
                                if(name&&attr){
                                    param = param["工艺属性"];
                                    if(T.Typeof(param, /Object/)){
                                        param = param[name];
                                        if(T.Typeof(param, /Object/)){
                                            value = param[attr];
                                        }
                                    }
                                }else if(name){
                                    value = param[name];
                                }
                            }
                            return value;
                        }
                        if(T.Typeof(data.params, /Object/)){
                            $(".form-control", $table).each(function(i, el){
                                var $input = $(el);
                                var value = getValue($input.data("first_name")||"", $input.data("name")||"", $input.data("attr")||"");
                                if(value!=null){
                                    var val = pdt.parseInputValue(value, mode);
                                    $input.val(val>=0?val:"");
                                }
                            });
                        }
                    }
                });
            }
        },
        /**
         * 获取分类产品列表
         */
        loadCategoryList: function(){
            var _this = this;
            T.GET({
                action: CFG.API.product.physics_product_category,
                success: function(data, params){
                    data = data||{};
                    _this.data.categoryList = data.categoryList[0].categoryList||[];
                    _this.$cont.removeClass("load");
                    //加载产品分类
                    $("#selectProductCategory").setOptions({
                        data: _this.data.categoryList,
                        key: "categoryId",
                        val: "categoryName",
                        len: 1
                    });
                }
            });
        },
        /**
         * 获取指定分类的所有产品
         * @param categoryId
         */
        loadProductList: function(categoryId){
            var _this = this;
            T.GET({
                action: CFG.API.product.physics_product_list,
                params: {
                    physical_category_id: categoryId
                },
                success: function(data, params){
                    data = data||{};
                    _this.data.productList = data.data||[];
                    //加载产品分类
                    $("#selectProduct").setOptions({
                        data: _this.data.productList,
                        key: "physicalId",
                        val: "physicalName",
                        len: 1
                    });
                }
            });
        },
        /**
         * 加载货期表
         */
        loadDeliveryTable: function(){
            var _this = this;
            pdt.product.editMode = 2;
            pdt.product.params = _this.data.deliveryDayInfo;
            pdt.product.showMode = _this.data.showMode;
            pdt.product.editModeStr = _this.modes[pdt.product.editMode]||"";
            T.Template(_this.paramsTableTemplate, "product_delivery_table", pdt.product);
        },
        /**
         * 加载价格表
         */
        loadPriceTable: function(){
            var _this = this;
            pdt.product.editMode = 1;
            pdt.product.params = _this.data.costPriceInfo;
            pdt.product.showMode = _this.data.showMode;
            pdt.product.editModeStr = _this.modes[pdt.product.editMode]||"";
            T.Template(_this.paramsTableTemplate, "product_price_table", pdt.product);
        },
        /**
         * 加载纸张损耗|纸张损耗（封面）表
         */
        loadPaperLossTable: function(){
            var _this = this;
            pdt.analysis({
                params: _this.data.paperLossPrice,
                baseInfoName: _this.data.paperLossName
            });
            pdt.product.editMode = 3;
            pdt.product.showMode = _this.data.showMode;
            pdt.product.automated = _this.data.automated;
            T.Template(_this.paramsTableTemplate, "paper_loss_table", pdt.product);
        },
        /**
         * 加载纸张损耗表（内页）
         */
        loadPaperLossInnerTable: function(){
            var _this = this;
            pdt.analysis({
                params: _this.data.innerPaperLossPrice,
                baseInfoName: _this.data.paperLossName
            });
            pdt.product.editMode = 5;
            pdt.product.showMode = _this.data.showMode;
            pdt.product.automated = _this.data.automated;
            T.Template(_this.paramsTableTemplate, "paper_loss_inner_table", pdt.product);
        },
        /**
         * 加载工艺价格表
         */
        loadProcessPriceTable: function(){
            var _this = this;
            pdt.analysis({
                params: _this.data.processPrice,
                baseInfoName: _this.data.processPriceName
            });
            pdt.product.editMode = 4;
            pdt.product.showMode = _this.data.showMode;
            T.Template(_this.paramsTableTemplate, "process_price_table", pdt.product);
        },
        /**
         * 加载单页价格表
         */
        loadCostPriceTable: function(){
            var _this = this;
            pdt.analysis({
                params: _this.data.costPriceInfo,
                baseInfoName: _this.data.baseInfoName
            });
            pdt.product.editMode = 1;
            pdt.product.showMode = _this.data.showMode;
            pdt.product.editModeStr = _this.modes[pdt.product.editMode]||"";
            T.Template(_this.paramsTableTemplate, "cost_price_table", pdt.product);
        },
        /**
         * 根据物理产品ID获取产品属性
         * @param {Number} physicalId 物理产品ID
         */
        loadPhysicalProduct: function(physicalId){
            var _this = this;
            if(physicalId>0){
                _this.status = ["", "", ""];
                T.GET({
                    action: CFG.API.product.physics_product_detail,
                    params: {
                        physical_id: physicalId
                    },
                    success: function(data, params){
                        data = data||{};
                        if(data.data){
                            _this.status[0] = 1;
                            var product = data.data[0]||{};
                            if(_this.data.showMode==0||product.productVariety==2||(product.productVariety!=2&&_this.data.automated)){
                                _this.data.automated = product.productVariety===2?true:false;//自动报价产品标识
                                _this.renderColumns();
                            }
                            _this.data.physicalId = physicalId||"";
                            _this.data.productSupportDeliveryList = product.physicalProductRelated||[];
                            _this.data.baseInfoName = product.baseInfoName||"";
                            _this.data.paperLossName = product.lossbaseInfoName||''; //自动报价-纸张损耗
                            _this.data.processPriceName = product.processbaseInfoName||''; //自动报价-工艺价格
                            _this.data.quoteInfo = product.quoteInfo||{};
                            _this.data.quoteExcel = product.quoteExcel||"";
                            if(!_this.data.id){
                                if(!_this.data.automated){
                                    _this.data.deliveryDayInfo = T.JSON.parse(T.JSON.stringify(product.quoteInfo||{}));
                                    _this.data.costPriceInfo = T.JSON.parse(T.JSON.stringify(product.quoteInfo || {}));
                                }else{//自动报价产品
                                    if(_this.data.physicalId=='299'){//画册自动报价
                                        _this.data.baseInfoName = '材质类型_数量_成品尺寸';
                                        _this.data.handerNum = {
                                            骑马钉: '',
                                            锁线胶装: '',
                                            无线胶装: '',
                                            YO圈装: ''
                                        };
                                        _this.data.innerPaperLossPrice = T.JSON.parse(T.JSON.stringify(product.paperLossPrice||{}));//内页纸张损耗
                                    }else{
                                        _this.data.costPriceInfo = T.JSON.parse(T.JSON.stringify(product.quoteInfo||{}));//单页价格
                                    }
                                    _this.data.aveDeliveryTime = -1;//平均货期
                                    _this.data.paperLossPrice = T.JSON.parse(T.JSON.stringify(product.paperLossPrice||{}));//纸张损耗
                                    _this.data.processPrice = T.JSON.parse(T.JSON.stringify(product.processPrice||{}));//工艺价格
                                }
                            }
                            _this.loaded();
                        }
                    }
                });
                _this.loadDeliveryList();
                _this.loadApprovedDeliveryList();
            }
        },
        /**
         * 查询供应商的配送方式
         */
        loadDeliveryList: function(){
            var _this = this;
            T.GET({
                action: CFG.API.delivery.support_mode_list,
                params: {
                    shipper: "Supplier"
                },
                success: function(data, params){
                    _this.status[1] = 1;
                    data = data||{};
                    _this.data.inModeList = data.inModeList||[];
                    _this.data.userModeList = data.userModeList||[];
                    _this.data.deliveryList = _this.data.inModeList.concat(_this.data.userModeList);
                    _this.loaded();
                }
            });
        },
        /**
         * 查询供应商已通过审核的配送方式
         */
        loadApprovedDeliveryList: function(){
            var _this = this;
            T.GET({
                action: CFG.API.product.delivery_list_for_product,
                success: function(data, params){
                    _this.status[2] = 1;
                    data = data||{};
                    _this.data.approvedDeliveryList = data.deliveryForProductList||[];
                    _this.loaded();
                }
            });
        },
        /**
         * 获取产品详情
         */
        loadProduct: function(){
            var _this = this;
            T.GET({
                action: CFG.API.product.supplier_product_detail,
                params: {
                    id: _this.data.id
                },
                success: function(data, params){
                    data = data||{};
                    _this.data.supplierProduct = data.supplierProduct||{};
                    _this.data.automated = _this.data.supplierProduct.productVariety===2?true:false;//自动报价产品标识
                    _this.data.physicalId = _this.data.supplierProduct.physicalId||"";
                    _this.data.baseInfoName = _this.data.supplierProduct.baseInfoName||"";
                    _this.data.paperLossName = _this.data.supplierProduct.lossbaseInfoName||''; //自动报价-纸张损耗
                    _this.data.processPriceName = _this.data.supplierProduct.processbaseInfoName||''; //自动报价-工艺价格
                    _this.data.productName = _this.data.supplierProduct.productName||"";
                    if(!_this.data.automated){
                        _this.data.deliveryDayInfo = T.JSON.parse(T.JSON.stringify(_this.data.supplierProduct.deliveryDayInfo||{}));
                        _this.data.costPriceInfo = T.JSON.parse(T.JSON.stringify(_this.data.supplierProduct.costPriceInfo||{}));
                    }else{//自动报价产品
                        if(_this.data.physicalId=='299'){//画册自动报价
                            _this.data.baseInfoName = '材质类型_数量_成品尺寸';
                            _this.data.handerNum = T.JSON.parse(T.JSON.stringify(_this.data.supplierProduct.handerNum||{}));//手数设置
                            _this.data.innerPaperLossPrice = T.JSON.parse(T.JSON.stringify(_this.data.supplierProduct.innerLossPrice||{}));//内页纸张损耗
                        }else{
                            _this.data.costPriceInfo = T.JSON.parse(T.JSON.stringify(_this.data.supplierProduct.costPriceInfo||{}));//单页价格
                        }
                        _this.data.aveDeliveryTime = _this.data.supplierProduct.aveDeliveryTime;//平均货期
                        _this.data.paperLossPrice = T.JSON.parse(T.JSON.stringify(_this.data.supplierProduct.paperLossPrice||{}));//纸张损耗|封面纸张损耗
                        _this.data.processPrice = T.JSON.parse(T.JSON.stringify(_this.data.supplierProduct.processPrice||{}));//工艺价格
                    }
                    T.Template("product_detail", _this.data);
                    _this.loadPhysicalProduct(_this.data.supplierProduct.physicalId);
                }
            });
        },
        /**
         * 获取配送模式集合
         * @param {String} receiver 收货人，In：仓储中心，User：用户
         * @returns {Array}
         */
        getDeliveryModeList: function(receiver){
            var _this = this;
            var deliveryHash = {};
            //过滤供应商支持的配送方式
            T.Each(_this.data.deliveryList, function(i, delivery){
                if(delivery.receiver==receiver){
                    deliveryHash[delivery.delivery_id] = {
                        deliveryId: delivery.delivery_id,
                        deliveryModeId: delivery.id
                    };
                }
            });
            //设置是否已审核通过
            T.Each(_this.data.approvedDeliveryList, function(i, delivery){
                if(delivery.receiver===receiver && deliveryHash[delivery.deliveryId]){
                    deliveryHash[delivery.deliveryId].approve = true;
                }
            });
            //设置默认选中
            _this.data["isReceiverTo"+receiver] = false;
            if(_this.data.supplierProduct){
                T.Each(_this.data.supplierProduct.deliveryModeList, function(i, delivery){
                    if(delivery.receiver===receiver && deliveryHash[delivery.deliveryId]){
                        deliveryHash[delivery.deliveryId].checked = true;
                        _this.data["isReceiverTo"+receiver] = true;
                    }
                });
            }
            var deliveryModeList = [];
            T.Each(_this.data.productSupportDeliveryList, function(i, delivery){
                if(delivery && delivery.distributionType){
                    var item = deliveryHash[delivery.distributionType];
                    if(item && item.deliveryModeId){
                        var deliveryMode = {
                            deliveryId: delivery.distributionType,
                            deliveryModeId: item.deliveryModeId||"",
                            deliveryName: CFG.DELIVERY_METHOD[delivery.distributionType]||"",
                            receiver: receiver,
                            approve: item.approve,
                            checked: item.checked
                        };
                        deliveryModeList.push(deliveryMode);
                    }
                }
            });
            return deliveryModeList;
        },
        getHanderNum: function(){
            var _this = this,
                sett = {},
                $dom = $('#template-option_settings-view');
            T.Each(_this.data.handerNum, function(k,v){
                sett[k] = $('input[name='+k+']:checked', $dom).val()||'';
            });
            return sett;
        },
        loaded: function(){
            var _this = this;
            if(_this.status.length==_this.status.join("").length){
                _this.$cont.removeClass("load");
                _this.data.deliveryToInList = _this.getDeliveryModeList("In");
                _this.data.deliveryToUserList = _this.getDeliveryModeList("User");
                console.log("productSupportDeliveryList", T.JSON.stringify(_this.data.productSupportDeliveryList));
                _this.render();
            }
        },
        /**
         * 保存
         */
        save: function(){
            var _this = this;
            if(!_this.data.automated){
                var deliveryDayInfo = pdt.getProductParams(2); //货期
                var costPriceInfo = pdt.getProductParams(1); //价格
                if(!deliveryDayInfo||!costPriceInfo)return;
                var params = {
                    physicalId: _this.data.physicalId,
                    deliveryDayInfo: deliveryDayInfo,
                    costPriceInfo: costPriceInfo
                };
            }else{
                pdt.product.json= [{}, _this.data.costPriceInfo, {}, _this.data.paperLossPrice, _this.data.processPrice,  _this.data.innerPaperLossPrice];
                if(_this.data.physicalId == '299'){//画册自动报价
                    var innerLossPrice =  pdt.getProductParams(5); //纸张损耗（内页）
                    var handerNum = _this.getHanderNum();
                }else{
                    var costPriceInfo = pdt.getProductParams(1); //单页价格
                }
                var paperLossPrice = pdt.getProductParams(3); //纸张损耗|纸张损耗（封面）
                var processPrice = pdt.getProductParams(4); //工艺价格
                var aveDeliveryTime = $.trim($('#aveDeliveryTime').val());
                if(!paperLossPrice||!processPrice||(!costPriceInfo&&!innerLossPrice))return;
                var params = {
                    aveDeliveryTime: pdt.parseInputValue(aveDeliveryTime, 2),
                    physicalId: _this.data.physicalId,
                    paperLossPrice: paperLossPrice,
                    processPrice: processPrice
                };
                if(innerLossPrice){
                    params.innerLossPrice = innerLossPrice;
                }
                if(costPriceInfo){
                    params.costPriceInfo = costPriceInfo;
                }
                if(handerNum){
                    params.handerNum = handerNum;
                }
            }
            debugger
            var receiverToInList = _this.$cont.getChecked("receiverToIn")||[];
            var receiverToUserList = _this.$cont.getChecked("receiverToUser")||[];
            var deliveryModeIds = receiverToInList.concat(receiverToUserList).join(","); //选中的配送方式
            if(deliveryModeIds){
                params.modeIds = deliveryModeIds;
            }
            var action = CFG.API.product.supplier_product_insert;
            if(_this.data.id>0){ //修改
                action = CFG.API.product.supplier_product_update;
                params.id = _this.data.id;
            }else{
                params.firstAttribute = _this.data.productName;
            }
            if(!_this.data.baseInfoName&&!_this.data.processPriceName){
                T.msg("该产品未配置属性，请选择其他产品！");
                return;
            }
            if(!params.physicalId)return;
            T.POST({
                action: action,
                params: params,
                success: function(data, params){
                    T.msg("保存成功");
                    setTimeout(function(){
                        T.PlatformRedirect(T.DOMAIN.WWW + "product/list.html", true);
                    }, 1000)
                },
                error: function(data){
                    T.msg(data.msg);
                }
            });
        },
        /**
         * 根据分类ID获取子级分类
         * @param categoryList
         * @param categoryId
         */
        getCategoryListByCategoryId: function(categoryList, categoryId){
            var _this = this;
            var result = null;
            T.Each(categoryList, function(i, category){
                if(category.categoryList&&category.categoryId==categoryId&&category.categoryList.length){
                    result = category.categoryList;
                    return false;
                }
            });
            return result;
        },
        /**
         * 根据产品ID获取物理产品ID
         * @param productId
         * @returns {string}
        getPhysicalIdByProductId: function(productId){
            var _this = this;
            var physicalId = "";
            T.Each(_this.data.productList, function(i, product){
                if(product.productId==productId){
                    physicalId = product.physicalId;
                    return false;
                }
            });
            return physicalId;
        },
         */
        /**
         * 绑定事件
         */
        events: function(){
            var _this = this;
            var categoryList = [];
            _this.$cont.on("click.auditStatus", "#productSaveBtn:not(.dis)", function(e){ //保存
                _this.save();
            }).on("change.productCategory", "select[name='productCategory']", function(e){ //选择产品分类
                var $this = $(this);
                var categoryId = $this.val();
                $this.nextAll("select").remove();
                $("#selectProduct").setOptions({
                    data: [],
                    len: 1
                });
                _this.clearData();
                _this.renderColumns();
                if(categoryId>0){
                    if($this.attr("id")=="selectProductCategory"){
                        categoryList = _this.data.categoryList;
                    }
                    categoryList = _this.getCategoryListByCategoryId(categoryList, categoryId);
                    if(categoryList&&categoryList.length){//有子级分类
                        // 加载产品分类
                        var $select = $('<select class="form-control ml10" name="productCategory"><option value="">请选择产品分类</option></select>').insertAfter($this);
                        $select.setOptions({
                            data: categoryList,
                            key: "categoryId",
                            val: "categoryName",
                            len: 1
                        });
                    }else{
                        //加载具体产品
                        _this.loadProductList(categoryId);
                    }
                }
            }).on("change.product", "select[name='product']", function(e){ //选择具体产品
                var physicalId = $(this).val();
                //var physicalId = _this.getPhysicalIdByProductId(productId)||0;
                if(physicalId>0){//加载产品属性
                    _this.data.physicalId = physicalId;
                    _this.data.productName = $("option:selected", this).text()||"";
                    _this.loadPhysicalProduct(physicalId);
                }else{ //清除上一次的数据
                    _this.clearData();
                }
            }).on("change.receiverTo", "input[name='receiverToInAll'], input[name='receiverToUserAll']", function(e){ //配送方式支持
                var $this = $(this);
                var checked = $this.is(":checked");
                var name = ($this.attr("name")||"").replace(/All$/, "");
                if(name){
                    if(checked){
                        $("input[name='"+name+"']:enabled", _this.$cont).prop("checked", true);
                    }else{
                        $("input[name='"+name+"']:checked", _this.$cont).prop("checked", false);
                    }
                }
            }).on("change.receiver", "input[name='receiverToIn'], input[name='receiverToUser']", function(e){ //配送方式
                var $this = $(this);
                var name = $this.attr("name")||"";
                if(name){
                    if($("input[name='"+name+"']:checked", _this.$cont).length>0){
                        $("input[name='"+name+"All']:enabled", _this.$cont).prop("checked", true);
                    }else{
                        $("input[name='"+name+"All']:enabled", _this.$cont).prop("checked", false);
                    }
                }
            }).on('blur', '#aveDeliveryTime', function(){
                var val = $('#aveDeliveryTime').val();
                var ret = pdt.parseInputValue(val, 2);
                $('#aveDeliveryTime').val(ret>=0?ret:"");
            });
            $("#productUpdateBtn").on("click", function(e){ //修改按钮
                _this.data.showMode = 1;
                document.title =  "编辑可供应产品-供应商平台";
                _this.render();
            });
        }
    };
    ProductDetail.init();
}(window, document));