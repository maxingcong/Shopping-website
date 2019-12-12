define("modules/design_quotation", ["base", "tools", "uploader"], function($, T, Uploader){
    function Quotation(options){
        this.init(options);
    }
    Quotation.prototype = {
        data: {
            quotationId: "", //询价单id
            productId: "", //产品id
            quotation: {}, //询价单信息
            uploadParams: {} //上传的附件信息
        },
        status: [""], //[询价单信息]
        init: function(options){
            var _this = this;
            options = options||{};
            _this.data.productId = options.productId||"";
            _this.data.quotationId = options.quotationId||"";
            if((options.quotation && options.quotation.id) || !options.quotationId){
                _this.status[0] = 1;//已有询价单
                _this.data.quotation = options.quotation||{};
                _this.data.quotationId = _this.data.quotation.id||"";
            }

        },
        load: function(){
            var _this = this;
            if(_this.status[0]){//已有询价单
                _this.loaded(null, null, 0);
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
            $cont.html(T.Compiler.template(templateId, ret));
            $cont.removeClass("load");
            //上传文件
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
                prefix: "142-",
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
        },
        /**
         * 加载完成
         */
        loaded: function(data, params, index){debugger
            var _this = this;
            _this.status[index] = 1;
            if(_this.status.length===_this.status.join("").length){
                if(_this.data.quotation.isBack==1){ //询价单被退回，未通过审核
                    _this.formCfg.action = "in_quotation/update_quotation";
                }
                _this.trigger("loaded");
            }
        },
        /**
         * 询价单详情
         * @param id 询价单ID
         */
        getQuotationDetail: function(id) {
            var _this = this;
            T.GET({
                action: "in_quotation/quotation_detail",
                params: {id: id, from: "Design"},
                success: function (data, params) {
                    _this.data.quotation = data.quotation||{};
                    _this.loaded(data, params, 0);
                },
                failure: function (data, params) { //查询失败不影响产品加载
                    _this.loaded(data, params, 0);
                }
            });
        },
        formCfg: {
            action: 'in_quotation/insert_quotation', //创建询价单
            prevent: true,
            items: {
                product_name: {
                    tips: {
                        placeholder: "如：展架设计",
                        empty: '请填写产品名称',
                        mismatch: '请填写产品名称',
                        error: '请填写产品名称'
                    },
                    rule: 'nonempty',
                    required: true
                },
                other_requirements: {//设计详述
                    tips: {
                        placeholder: "如您方便，请您描述更详细的设计需求",
                        empty: '请填写备注信息',
                        maxlength: '备注信息不得超过300字',
                        mismatch: '请填写备注信息',
                        error: '请填写备注信息'
                    },
                    rule: 'nonempty',
                    maxlength: 300
                },
                inquirer_name: {//联系人-询价人
                    tips: {
                        placeholder: "您的称呼",
                        empty: '请填写称呼',
                        mismatch: '请填写正确的称呼',
                        error: '请填写称呼'
                    },
                    rule: 'nonempty',
                    required: true
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
            T.FORM(formId, _this.formCfg, {
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

                    _form.params.product_id = _this.data.productId||'';  //默认id
                    //_form.params.target_id = _this.data.targetId||''; //目标id
                    _form.params.category_id = _this.data.categoryId||''; //分类id
                    if(_this.data.quotation.isBack==1){ //询价单被退回，未通过审核
                        _form.params.id = _this.data.quotation.id;
                        _form.params.update_point = 'Design'; //修改人所在的节点
                        _form.params.updator = T._SACCOUNT||T._ACCOUNT; //创建者
                        _form.params.is_back = '0';
                    }else{
                        _form.params.source = 'User'; //来自设计
                        _form.params.creator = T._SACCOUNT||T._ACCOUNT; //创建者
                    }
                    //_form.params.inquirer_name = T._ACCOUNT; //询价人!=创建者
                    _form.params.type = 'Design';//设计类型
                    _form.params.current_point = 'Design'; //当前节点
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
                    if (!T.RE.mobile.test(_form.params.phone)) {
                        T.msg("请填写联系人手机");
                        _form.action = '';
                        return;
                    }
                    //产品描述
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
                success: function (data, params) {//传送门-询价单编号参数 o
                    window.location = T.DOMAIN.MEMBER + "odetail.html?o=" + (data.id||_this.data.quotation.id) + '&t=20';
                },
                failure: function (data, params) {
                    T.msg(data.msg || T.TIPS.DEF);
                    $(".submit", $cont).removeClass("dis");
                }
            });
        }
    };
    //具备事件功能
    T.Mediator.installTo(Quotation.prototype);
    return function(options){
        return new Quotation(options);
    };
});
