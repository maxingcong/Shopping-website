define("modules/quotation", ["base", "tools", "uploader", "location"], function($, T, Uploader, PCD){
    function Quotation(options){
        this.init(options);
    }
    Quotation.prototype = {
        data: {
            quotationId: "", //询价单ID
            productList: [], //可询价产品集合
            quotation: {}, //询价单信息
            uploadParams: {}, //上传的附件信息
            bindingList: [
                {key:"无线胶装", val:"无线胶装"},
                {key:"穿线胶装", val:"穿线胶装"},
                {key:"骑马钉", val:"骑马钉"},
                {key:"胶头装", val:"胶头装"},
                {key:"方背精装带灰板", val:"方背精装带灰板"},
                {key:"园背精装带灰板", val:"园背精装带灰板"},
                {key:"YO圈装", val:"YO圈装"},
                {key:"古线装", val:"古线装"},
                {key:"", val:"其他"}
            ],
            materialList: [
                {key:"瓦楞纸包装", val:"瓦楞纸包装"},
                {key:"卡纸包装", val:"卡纸包装"},
                {key:"铁盒包装", val:"铁盒包装"},
                {key:"", val:"其他"}
            ],
            printingList: [
                {key:"单面单色", val:"单面单色"},
                {key:"单面双色", val:"单面双色"},
                {key:"单面四色", val:"单面四色"},
                {key:"双面单色", val:"双面单色"},
                {key:"双面双色", val:"双面双色"},
                {key:"双面四色", val:"双面四色"},
                {key:"", val:"其他"}
            ], //印刷方式
            surfaceList:  [
                {key:"单面覆光膜", val:"单面覆光膜"},
                {key:"单面覆哑膜", val:"单面覆哑膜"},
                {key:"双面覆光膜", val:"双面覆光膜"},
                {key:"双面覆哑膜", val:"双面覆哑膜"},
                {key:"单面过光油", val:"单面过光油"},
                {key:"单面过哑油", val:"单面过哑油"},
                {key:"双面过光油", val:"双面过光油"},
                {key:"双面过哑油", val:"双面过哑油"},
                {key:"无", val:"无"},
                {key:"", val:"其他"}
            ], //表面处理
            qualityList: [
                {key:"高", val:"高"},
                {key:"中", val:"中"},
                {key:"低", val:"低"}
            ] //质量要求
        },
        status: ["", ""], //[可询价产品集合,询价单信息]
        init: function(options){
            var _this = this;
            options = options||{};
            _this.data.productId = options.productId||"";
            _this.data.quotationId = options.quotationId||"";
            if((options.quotation && options.quotation.id) || !options.quotationId){
                _this.status[1] = 1;
                _this.data.quotation = options.quotation||{};
                _this.data.quotationId = _this.data.quotation.id||"";
            }

        },
        load: function(){
            var _this = this;
            _this.getQuotationProduct();
            if(_this.status[1]){
                _this.loaded(null, null, 1);
            }else{
                _this.getQuotationDetail(_this.data.quotationId);
            }
        },
        /**
         * 渲染
         * @param $cont 容器
         * @param templateId 模板
         */
        render: function($cont, templateId, formId){
            var _this = this;
            var ret = _this.data.quotation;
            $cont = $cont||_this.$cont;
            ret.productList = _this.data.productList;
            ret.bindingList = _this.data.bindingList;
            ret.materialList = _this.data.materialList;
            ret.printingList = _this.data.printingList;
            ret.surfaceList = _this.data.surfaceList;
            ret.qualityList = _this.data.qualityList;
            $cont.html(T.Compiler.template(templateId, ret));
            $cont.removeClass("load");

            //配送地址
            var address = _this.data.quotation.address||T.cookie('_address')||CFG_DB.DEF_PCD;
            $("#delivery_address").data("value", address);
            $("#delivery_address .value").text(address.replace(/\^/g,''));
            if(!formId)return;
            $("#delivery_address").geoLocation({
                level: 3,
                defaultAddress: _this.data.quotation.address||"",
                callback: function (value, province, city, district) {
                    $("#delivery_region").geoLocation("setValue", value);
                }
            });
            _this.data.uploadParams = {
                fileUri: ret.attachmentPath||"",
                fileName: ret.attachmentName || (ret.attachmentPath||"").replace(/^.*\//, "")
            };
            _this.uploader = Uploader({
                params: $.extend({
                    id: T.UUID()
                }, _this.data.uploadParams),
                auto: true,
                type: "*",
                prefix: "200000-",
                inputId: "file_upload",
				sizeLimit: "20M",
                text: "点击上传",
                text2: "重新上传",
                uiCfg: {
                    name: true, //是否显示文件名
                    size: true, //是否显示文件大小
                    progress: true, //是否显示上传进度
                    loaded: false, //是否显示已上传
                    speed: true, //是否显示上传速度
                    remove: true //是否显示删除上传完成的文件
                },
                onSuccess: function(params){//上传成功
                    _this.data.uploadParams = params;
                },
                onCancel: function(file){
                    _this.data.uploadParams = {};
                },
                onRemove: function(file){
                    _this.data.uploadParams = {};
                }
            });
            _this.events($cont);
            _this.bindForm($cont, formId);
            T.TIP({
                container: '#'+formId,
                trigger: '.icon_help',
                content: function(trigger) {
                    return $(trigger).data("text")||"";
                },
                'max-width': '360px',
                width: 'auto',
                offsetX: 0,
                offsetY: 0
            });
            $("#product_sort").val(_this.data.productId || _this.data.quotation.productId);
            if(_this.data.quotationId){
                //装订方式
                var bindingMode = _this.data.quotation.extraInfo;
                if(T.Array.indexOf(_this.data.bindingList, bindingMode, "key")>=0){
                    $("select[name='binding_mode_select']", $cont).val(bindingMode).change();
                }else{
                    $("select[name='binding_mode_select']", $cont).val("").change();
                    $("input[name='binding_mode']", $cont).val(bindingMode);
                }
                //材质
                var material = _this.data.quotation.material;
                if(T.Array.indexOf(_this.data.materialList, material, "key")>=0){
                    $("select[name='material_select']", $cont).val(material).change();
                }else{
                    $("select[name='material_select']", $cont).val("").change();
                    $("input[name='material_pack']", $cont).val(printingMode);
                }
                //印刷方式
                var printingMode = _this.data.quotation.printingMode;
                if(T.Array.indexOf(_this.data.printingList, printingMode, "key")>=0){
                    $("select[name='printing_mode_select']", $cont).val(printingMode).change();
                }else{
                    $("select[name='printing_mode_select']", $cont).val("").change();
                    $("input[name='printing_mode']", $cont).val(printingMode);
                }
                //表面处理
                var surfaceTreatment = _this.data.quotation.surfaceTreatment;
                if(T.Array.indexOf(_this.data.surfaceList, surfaceTreatment, "key")>=0){
                    $("select[name='surface_treatment_select']", $cont).val(surfaceTreatment).change();
                }else{
                    $("select[name='surface_treatment_select']", $cont).val("").change();
                    $("input[name='surface_treatment']", $cont).val(surfaceTreatment);
                }
                //质量要求
                $("select[name='quality_requirements']", $cont).val(_this.data.quotation.qualityRequirements);
            }
            //产品分类
            $("select[name='product_sort']", $cont).change();
        },
        /**
         * 加载完成
         */
        loaded: function(data, params, index){
            var _this = this;
            _this.status[index] = 1;
            if(_this.status.length===_this.status.join("").length){
                if(_this.data.quotation.isBack==1){ //询价单被退回，未通过审核
                    _this.formCfg.action = "in_product/update_quotation";
                }
                _this.trigger("loaded");
            }
        },
        /**
         * 查询可询价产品集合
         */
        getQuotationProduct: function(){
            var _this = this;
            T.GET({
                action: "in_product/query_quotation_product",
                params: {},
                success: function (data, params) {
                    data.allQuatation = data.allQuatation||[];
                    var productList = [];
                    for (var k = 0; k < data.allQuatation.length; k++) {
                        productList = productList.concat(data.allQuatation[k].products);
                    }
                    //排序，将其他定制放到最后一个
                    for (var i = 0, len = productList.length; i < len; i++) {
                        if(productList[i].productId==200055){
                            productList.push(productList.splice(i,1)[0]);
                            i = len;
                        }
                    }
                    _this.data.productList = productList;
                    _this.loaded(data, params, 0);
                }
            });
        },
        /**
         * 询价单详情
         * @param id 询价单ID
         */
        getQuotationDetail: function(id) {
            var _this = this;
            T.GET({
                action: "in_product/quotation_detail",
                params: {id: id, from: "User"},
                success: function (data, params) {
                    var quotation = data.quotation||{};
                    if(typeof(quotation.bindingMode)=="undefined"){
                        quotation.bindingMode = "";
                    }
                    if(typeof(quotation.printingMode)=="undefined"){
                        quotation.printingMode = "";
                    }
                    if(typeof(quotation.surfaceTreatment)=="undefined"){
                        quotation.surfaceTreatment = "";
                    }
                    if(typeof(quotation.qualityRequirements)=="undefined"){
                        quotation.qualityRequirements = "";
                    }
                    _this.data.quotation = quotation;
                    _this.loaded(data, params, 1);
                },
                failure: function (data, params) { //查询失败不影响产品加载
                    _this.loaded(data, params, 1);
                }
            });
        },
        events: function($cont){
            var _this = this;
            $cont.on("valueChange.location", ".mod_selectbox", function(e, data){//改变配送区域
                data = data||{};
                _this.data.address = data.value||CFG_DB.DEF_PCD;
            }).on("change.select_product", "select[name='product_sort']", function(e){
                var productId = $(this).val();
                $("input[name='product_size']").nextAll("input").remove();
                $("textarea[name='other_requirements']").nextAll("textarea").remove();
                if(productId==200051){ //定制画册
                    _this.formCfg.items.other_requirements.tips.placeholder = '内文单页材质及内文P数、烫金/银、局部UV、击凸，请备注好相应的工艺有几处以及长*宽mm的数据';
                    $(".item-album", $cont).removeClass("hide");
                }else{
                    _this.formCfg.items.other_requirements.tips.placeholder = '如：需要烫金';
                    $(".item-album", $cont).addClass("hide");
                }
                if(productId==200050){ //定制手提袋
                    _this.formCfg.items.product_size.tips.placeholder = '如：长100*宽80*高60';
                }else{
                    _this.formCfg.items.product_size.tips.placeholder = '如：宽100*高80';
                }
                T.FORM().placeholder(T.DOM.byId('other_requirements'), _this.formCfg.items.other_requirements.tips.placeholder);
                T.FORM().placeholder(T.DOM.byId('product_size'), _this.formCfg.items.product_size.tips.placeholder);
                if(productId==200074){ //定制包装
                    $(".item-com", $cont).addClass("hide");
                    $(".item-pack", $cont).removeClass("hide");
                }else{
                    $(".item-pack", $cont).addClass("hide");
                    $(".item-com", $cont).removeClass("hide");
                    $("input[name='product_size']", $cont).focus().blur();
                }
                if(productId==200047){ //定制折页
                    $(".item-fold, .item-size .required ", $cont).removeClass("hide");
                    $("input[name='unfold_size']", $cont).focus().blur();
                    if(_this.formObj){
                        _this.formObj.items.product_size.required = true;
                        _this.formObj.items.unfold_size.required = true;
                    }
                }else{
                    $(".item-fold, .item-size .required ", $cont).addClass("hide");
                    if(_this.formObj){
                        _this.formObj.items.product_size.required = false;
                        _this.formObj.items.unfold_size.required = false;
                    }
                }
            }).on("change.select", ".select.select_rich", function(e){
                _this.selectChange($(this));
            });
        },
        selectChange: function($this, e){
            var hasTitle = $this.data("has_title");
            var otherValue = $this.data("other");
            otherValue = otherValue==null?"":otherValue;
            var $text = $this.siblings(".text");
            var $input = $("input[name]", $text);
            var key = $.trim($this.val());
            var val = $.trim(hasTitle?$(":selected", $this).text():$this.val());
            if(String(key)===String(otherValue)){
                $input.val($text.data("value")||"");
                $text.removeClass("hid");
                $text.prev(".required").hide();
            }else{
                if(!$text.hasClass("hid")){
                    $text.data("value", $input.val());
                }
                $input.val(val);
                $text.addClass("hid");
                $text.prev(".required").show();
            }
            setTimeout(function(){
                $input.focus().blur()
            },10);
        },
        formCfg: {
            action: 'in_product/insert_quotation', //创建询价单
            prevent: true,
            items: {
                product_name: {
                    tips: {
                        placeholder: "如：手提袋",
                        empty: '请填写产品名称',
                        mismatch: '请填写产品名称',
                        error: '请填写产品名称'
                    },
                    rule: 'nonempty',
                    required: true
                },
                number: {
                    tips: {
                        placeholder: "如：100本",
                        empty: '请填写数量',
                        mismatch: '请填写正确格式的数量',
                        error: '请填写数量'
                    },
                    rule: 'nonempty',
                    pattern: /^[0-9]{1,10}[\u4e00-\u9fa5]{1}$/,
                    required: true
                },
                product_size: {
                    tips: {
                        placeholder: "如：宽100*高80",
                        empty: '请填写产品尺寸',
                        mismatch: '产品尺寸书写格式不正确',
                        error: '产品尺寸书写格式不正确',
                        maxlength: '产品尺寸信息不得超过50字',
                        min: '产品尺寸不能小于1',
                        max: '产品尺寸不能大于10000'
                    },//[\u4e00-\u9fa5]?[1-9]+\d{0,7}(\.\d{1,2})?
                    pattern: /^[\u4e00-\u9fa5]?[1-9]+\d{0,7}(\.\d{1,2})?\*[\u4e00-\u9fa5]?[1-9]+\d{0,7}(\.\d{1,2})?(\*[\u4e00-\u9fa5]?[1-9]+\d{0,7}(\.\d{1,2})?)?$/,
                    //pattern: /^[\u4e00-\u9fa5]?[0-9]{1,5}\*[\u4e00-\u9fa5]?[0-9]{1,5}(\*[\u4e00-\u9fa5]?[0-9]{1,5})?$/,
                    rule: 'nonempty',
                    maxlength: 50
                },
                unfold_size: {
                    tips: {
                        placeholder: "如：宽300*高80",
                        empty: '请填写展开尺寸',
                        mismatch: '展开尺寸书写格式不正确',
                        error: '展开尺寸书写格式不正确',
                        maxlength: '展开尺寸信息不得超过50字',
                        min: '展开尺寸不能小于1',
                        max: '展开尺寸不能大于10000'
                    },
                    pattern: /^[\u4e00-\u9fa5]?[1-9]+\d{0,7}(\.\d{1,2})?\*[\u4e00-\u9fa5]?[1-9]+\d{0,7}(\.\d{1,2})?(\*[\u4e00-\u9fa5]?[1-9]+\d{0,7}(\.\d{1,2})?)?$/,
                    rule: 'nonempty',
                    maxlength: 50
                },
                binding_mode: {
                    tips: {
                        placeholder: "如：无线胶装",
                        empty: '请填写装订方式',
                        mismatch: '请填写装订方式',
                        error: '请填写装订方式'
                    },
                    rule: 'nonempty'
                },
                material: {
                    tips: {
                        placeholder: "如：150g铜版纸",
                        empty: '请填写产品材质',
                        mismatch: '请填写产品材质',
                        error: '请填写产品材质'
                    },
                    maxlength: 100,
                    rule: 'nonempty'
                },
                material_pack: {
                    tips: {
                        placeholder: "如：瓦楞纸包装",
                        empty: '请填写产品材质',
                        mismatch: '请填写产品材质',
                        error: '请填写产品材质'
                    },
                    maxlength: 100,
                    rule: 'nonempty'
                },
                printing_mode: {
                    tips: {
                        placeholder: "如：双面四色印刷",
                        empty: '请填写印刷方式',
                        mismatch: '请填写印刷方式',
                        error: '请填写印刷方式'
                    },
                    rule: 'nonempty'
                },
                surface_treatment: {
                    tips: {
                        placeholder: "如：双面覆哑膜",
                        empty: '请填写表面处理信息',
                        maxlength: '表面处理信息不得超过100字',
                        mismatch: '请填写表面处理信息',
                        error: '请填写表面处理信息'
                    },
                    maxlength: 100,
                    rule: 'nonempty'
                },
                quality_requirements: {
                    tips: {
                        placeholder: "如：要求高品质",
                        empty: '请填写品质要求',
                        mismatch: '请填写品质要求',
                        error: '请填写品质要求'
                    },
                    rule: 'nonempty'
                },
                other_requirements: {
                    tips: {
                        placeholder: "如：需要烫金",
                        empty: '请填写备注信息',
                        maxlength: '备注信息不得超过300字',
                        mismatch: '请填写备注信息',
                        error: '请填写备注信息'
                    },
                    rule: 'nonempty',
                    maxlength: 300
                },
                phone: {
                    tips: {
                        placeholder: "方便客服MM与您联系",
                        empty: '请填写联系方式',
                        mismatch: '请填写正确的联系方式',
                        error: '请填写联系方式'
                    },
                    rule: 'nonempty',
                    pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
                    required: true
                }
            }
        },
        formatValue: function(value){
            return (value + "").replace(/[:_'"]+/g, "");
        },
        /**
         * 绑定表单
         */
        bindForm: function($cont, formId){
            var _this = this;
            var formAction = _this.formCfg.action||"";
            _this.formObj = T.FORM(formId, _this.formCfg, {
                before: function () {
                    var _form = this;
                    _form.action = formAction;
                    if($(".submit", $cont).hasClass("dis")){
                        _form.action = "";
                        return;
                    }
					if(_this.uploader && _this.uploader.isUploading){
                        T.msg("您的附件正在上传，请上传完毕后再提交！");
                        _form.action = "";
                        return;
					}
                    _form.action = _this.formCfg.action;
                    _form.params.product_id = _this.data.productId;  //默认id
                    _form.params.address = $('#delivery_address').data('value')||CFG_DB.DEF_PCD;//收货地址
                    if(_this.data.quotation.isBack==1){ //询价单被退回，未通过审核
                        _form.params.id = _this.data.quotation.id;
                        _form.params.update_point = 'User'; //修改人所在的节点
                        _form.params.updator = T._SACCOUNT||T._ACCOUNT; //创建者
                    }else{
                        _form.params.source = 'User'; //用户
                        _form.params.creator = T._SACCOUNT||T._ACCOUNT; //创建者
                    }
                    _form.params.inquirer = T._ACCOUNT; //询价人

                    if (!T._LOGED) {
                        T.LoginForm(0, function(){
                            _form.submit();
                        });
                        _form.action = '';
                        return;
                    }
                    //提交表单前
                    _form.params.product_name = _this.formatValue(_form.params.product_name);
                    if (_form.params.product_name===""){
                        T.msg("请填写有效的产品名");
                        _form.action = '';
                        return;
                    }
                    var $productSort = $('#product_sort'),
                        productId = $productSort.val(),
                        isPack = productId==200074; //是否为定制包装
                    if (productId){
                        _form.params.product_id = productId;
                        _form.params.target_id = $(":selected", $productSort).data('target_id')||_this.data.productId;
                    }else{
                        T.msg("请选择产品分类");
                        _form.action = '';
                        return;
                    }
                    if (!/^[0-9]{1,10}[\u4e00-\u9fa5]{1}$/.test(_form.params.number)) {
                        T.msg("请正确填写产品数量");
                        _form.action = '';
                        return;
                    }
                    if(isPack){
                        delete _form.params.product_size;
                    }else if (/^[\u4e00-\u9fa5]?[0-9]{1,5}\*[\u4e00-\u9fa5]?[0-9]{1,5}(\*[\u4e00-\u9fa5]?[0-9]{1,5})?$/.test(_form.params.product_size)) {
                        _form.params.product_size = _form.params.product_size.replace(/[\u4e00-\u9fa5]?/g,'').replace(/\*/g,'mm*')+'mm';
                    } else if (productId==200047 && !_form.params.product_size){
                        T.msg("请填写产品尺寸");
                        _form.action = '';
                        return;
                    } else if (_form.params.product_size) {
                        T.msg("产品尺寸书写格式不正确");
                        _form.action = '';
                        return;
                    }else if(productId!=200047){
                        delete _form.params.product_size;
                    }
                    if(productId==200047){
                        if (/^[\u4e00-\u9fa5]?[0-9]{1,5}\*[\u4e00-\u9fa5]?[0-9]{1,5}(\*[\u4e00-\u9fa5]?[0-9]{1,5})?$/.test(_form.params.unfold_size)) {
                            _form.params.unfold_size = _form.params.unfold_size.replace(/[\u4e00-\u9fa5]?/g,'').replace(/\*/g,'mm*')+'mm';
                        }else{
                            T.msg("展开尺寸书写格式不正确");
                            _form.action = '';
                            return;
                        }
                        if (_form.params.product_size && _form.params.unfold_size){
                            var size1 = _form.params.product_size.replace(/\D/g, '').split('*');
                            var size2 = _form.params.unfold_size.replace(/\D/g, '').split('*');
                            if(Math.max.apply(Math.max, size1) > Math.max.apply(Math.max, size2) || Math.min.apply(Math.min, size1) > Math.min.apply(Math.min, size2)){
                                T.msg("展开尺寸不得小于产品尺寸");
                                _form.action = '';
                                return;
                            }
                        } else if (!_form.params.unfold_size){
                            T.msg("请填写展开尺寸");
                            _form.action = '';
                            return;
                        }
                    }
                    if (!T.RE.mobile.test(_form.params.phone)) {
                        T.msg("请填写联系人手机");
                        _form.action = '';
                        return;
                    }

                    var unfoldSize = _this.formatValue(_form.params.unfold_size);
                    if (productId==200047 && unfoldSize!==""){ //定制折页
                        _form.params.extra_info = unfoldSize;
                    }
                    if(typeof(_form.params.unfold_size)!='undefined'){
                        delete _form.params.unfold_size;
                    }

                    var bindingMode = _this.formatValue(_form.params.binding_mode);
                    if (productId==200051 && bindingMode!==""){ //定制画册
                        _form.params.extra_info = bindingMode;
                    }
                    if(typeof(_form.params.binding_mode)!='undefined'){
                        delete _form.params.binding_mode;
                    }

                    _form.params.material = _this.formatValue(_form.params.material);
                    _form.params.material_pack = _this.formatValue(_form.params.material_pack);
                    if(isPack){
                        _form.params.material = _form.params.material_pack;
                    }
                    if (_form.params.material===""){
                        delete _form.params.material;
                    }
                    delete _form.params.material_pack;

                    _form.params.printing_mode = _this.formatValue(_form.params.printing_mode);
                    if (isPack || _form.params.printing_mode===""){
                        delete _form.params.printing_mode;
                    }
                    _form.params.surface_treatment = _this.formatValue(_form.params.surface_treatment);
                    if (isPack || _form.params.surface_treatment===""){
                        delete _form.params.surface_treatment;
                    }
                    _form.params.quality_requirements = _this.formatValue(_form.params.quality_requirements);
                    if (isPack || _form.params.quality_requirements===""){
                        delete _form.params.quality_requirements;
                    }
                    _form.params.other_requirements = _this.formatValue(_form.params.other_requirements);
                    if (_form.params.other_requirements===""){
                        delete _form.params.other_requirements;
                    }
                    //附件
                    if(_this.data.uploadParams && _this.data.uploadParams.fileUri && _this.data.uploadParams.fileName){
                        _form.params.attachment_path = _this.data.uploadParams.fileUri;
                        _form.params.attachment_name = _this.data.uploadParams.fileName;
                    }
                    $(".submit", $cont).addClass("dis");
                    _this.timeObj = setTimeout(function(){
                        $(".submit", $cont).removeClass("dis");
                    }, 30000);
                },
                success: function (data, params) {
                    window.location = T.DOMAIN.MEMBER + "odetail.html?o=" + (data.id||_this.data.quotation.id) + '&t=20';
                },
                failure: function (data, params) {
                    T.msg(data.msg || T.TIPS.DEF);
                    $(".submit", $cont).removeClass("dis");
                }
            });
            $("select", $cont).trigger("change.select");
        }
    };
    //具备事件功能
    T.Mediator.installTo(Quotation.prototype);
    return function(options){
        return new Quotation(options);
    };
});
