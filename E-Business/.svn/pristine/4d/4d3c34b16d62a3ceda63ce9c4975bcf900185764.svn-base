!(function(window, document, undefined) {
    "use strict";
    if(T.hasLogin() && T.Cookie.get('_a_status') == 'Pass'){
        window.location = T.DOMAIN.WWW + 'platform.html';
    }
    var apply = {
        domNode: $('#bs-container'),

        businessLicensePath: '', //营业执照号图片路径
        corporateIdForwardSide: '', //身份证正面照路径
        corporateIdBackSide: '', //身份证反面照路径
        organizationCodePath: '', //组织机构代码图片路径
        taxRegistrationNumberPath: '', //税务登记号图片路径
        facEquipmentPath: '', //厂房设备照片路径

        curSelProducts: {}, //当前选择的产品

        isReadAgreement: false, //是否阅读完协议
        uniqueFlag: false, //用户唯一性标识
        codeFlag: false, //验证码正确标识
        companyFlag: false, //公司名称唯一性标识
        usernameChecking: false, //校验用户名接口调用状态
        codeChecking: false, //校验验证码接口调用状态
        companyChecking: false, //公司名称接口调用状态

        supplierInfo: {}, //供应商信息

        accessType: 'register', //访问类型

        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            if(T.hasLogin() && T.Cookie.get('_a_status') == 'NotPass'){
                _this.accessType = 'notpass';
            }
            if(this.accessType=='notpass'){
                $('#bs-navbar').find('.navbar-right').append('<li>|</li><li><a id="header_logout" href="#"><i class="fa fa-sign-out"></i> 安全退出</a></li>');
                $('#supplierLogo').attr('href', 'javascript:;');
            }
            $('#step_name').html(_this.accessType=='notpass'?'审核结果':'账号注册')
            T.Template('supplier_info', {accessType: _this.accessType});
            _this.queryCategory();
            if(_this.accessType == 'notpass'){
                _this.getSupplierInfo();
            }else{
                window.PCD.init();
                _this.initUI();
                _this.captchaToPhone = T.CaptchaToPhone({
                    trigger : "#sendCode",
                    account : "#account_mobile",
                    source : "10"
                });
                $('#sendCode').addClass('dis');
            }
            _this.bindEvents();
        },
        /**
         * 初始化UI
         */
        initUI: function(){
            var _this = this;
            //初始化时间控件
            _this.domNode.find('.form_datetime').datetimepicker({
                format: 'yyyy-mm-dd',
                language: 'zh-CN',
                autoclose: true,
                weekStart: 1,
                startView: 2,
                minView: 2,
                forceParse: false,
                initialDate: _this.supplierInfo.plantTime?_this.supplierInfo.plantTime.substr(0,10): ''
            });
            _this.initMap();
        },

        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            /*$('#ininin_agreement').on('scroll', function(){ //加盟协议对话框滚动
             var st = this.scrollTop;
             var sh = this.scrollHeight;
             var h = this.clientHeight;
             if((st+h)>=(sh-10)){
             _this.isReadAgreement = true;
             $('#i_agreement').removeClass('dis');
             $('#i_disagreement').removeClass('dis');
             $('#accept_agreement').removeAttr('disabled');
             $(this).off("scroll");
             }
             });*/
            $('#service').on('click', 'button', function(){ //加盟协议对话框底部按钮
                /*if(!_this.isReadAgreement){
                 return;
                 }*/
                if(this.id == 'i_agreement'){ //同意
                    if(!$('#accept_agreement').prop('checked')){
                        $('#accept_agreement').trigger('click');
                    }
                }else if(this.id == 'i_disagreement'){ //不同意
                    if($('#accept_agreement').prop('checked')){
                        $('#accept_agreement').trigger('click');
                    }
                }
                $('#service').modal('hide');
            });
            //选择可生产产品弹窗 确认按钮
            $('#add_products_btn').on('click', function(){
                var obj = _this.getCurrentSelected();
                T.Template('products',obj);
                _this.curSelProducts = obj;
                $('#addProducts').modal('hide');
            });
            $('#header_logout').on('click', function(){ //退出
                T.POST({
                    action: CFG.API.logout,
                    params: null,
                    success: function(){
                        _this.unCookie();
                        window.location= T.DOMAIN.WWW;
                    },
                    error: function(){
                        _this.unCookie();
                        window.location= T.DOMAIN.WWW;
                    }
                });
                setTimeout(function(){
                    _this.unCookie();
                    window.location= T.DOMAIN.WWW;
                },0);
            });
            $('#supplierLogo').on('click', function(){
                if(_this.accessType=='notpass'){
                    $('#header_logout').trigger('click');
                }
            });
            //底部按钮：上一步|下一步|申请加盟|返回首页
            _this.domNode.on('click', '.bottom-btn button', function(e){
                var index = $(this).data('index');
                var direction = $(this).data('direction');
                if ( index == 'index') {
                    //返回首页
                    if(_this.accessType=='notpass'){
                        $('#header_logout').trigger('click');
                    }else{
                        window.location = T.DOMAIN.WWW;
                    }
                } else if ( index == 'applyForJoin') {
                    //申请加盟
                    //验证1、2、3、4、5步表单元素
                    if(!_this.checkStep1()){
                        _this.goStep('1');
                        return;
                    }
                    if(!_this.checkStep2()){
                        _this.goStep('2');
                        return;
                    }
                    if(!_this.checkStep3()){
                        _this.goStep('3');
                        return;
                    }
                    if(!_this.checkStep4()){
                        _this.goStep('4');
                        return;
                    }
                    if(!_this.checkStep5()){
                        _this.goStep('5');
                        return;
                    }
                    //提交表单
                    _this.applyForJoin();
                } else {
                    //下一步
                    if(direction == 'R'){
                        //验证(index-1)步表单元素
                        if(_this['checkStep' + (index-1)]()){
                            _this.goStep(index);
                            if(index==2){
                                _this.location();
                            }
                        }
                    }else{
                        //上一步
                        _this.goStep(index);
                    }
                }
            }).on('click', '#template-products-view a.btn-link', function(){ //产品删除
                var category = $(this).closest('tr').data('category'),
                    product = $(this).data('product'),
                    curSelProducts = _this.curSelProducts;
                var curCategory = T.Array.get(curSelProducts.categoryList, category, 'categoryName');
                if(curCategory){
                    if(curCategory.products.length == 1){
                        var curCategoryIndex = T.Array.indexOf(curSelProducts.categoryList, category, 'categoryName'); //删除分类
                        curSelProducts.categoryList.splice(curCategoryIndex, 1);
                    }else{
                        var curProductsIndex = T.Array.indexOf(curCategory.products, product, 'productName'); //删除产品
                        curCategory.products.splice(curProductsIndex, 1);
                        if(curProductsIndex == 0){
                            $(this).closest('tr').next().prepend('<td rowspan="'+curCategory.products.length+'">'+category+'</td>');
                        }else{
                            var tdRowspan = _this.findRowspan($(this).closest('tr')[0]);
                            if(tdRowspan){
                                $(tdRowspan).attr('rowspan', curCategory.products.length);
                            }
                        }
                    }
                    $(this).closest('tr').remove(); //删除节点
                }
            }).on('click', 'input[name=delivery]', function(){
                if($(this).val()=='1'){
                    $('#delivery_range_wrap').removeClass('hide');
                    $('#delivery_range').focus();
                }else{
                    $('#delivery_range').val('');
                    $('#delivery_range_wrap').addClass('hide');
                }
            }).on('blur', '#apply_form input',function(){//焦点移出
                var id = $(this).attr('id');
                switch(id){
                    case 'account_mobile':{ //手机号
                        _this.checkUsername($.trim($('#account_mobile').val()));
                        break;
                    }
                    case 'auth_code':{ //验证码
                        _this.checkCode($.trim($('#account_mobile').val()), $.trim($('#auth_code').val()));
                        break;
                    }
                    case 'company_name':{ //公司名称
                        var company_name = $.trim($('#company_name').val());
                        if(_this.accessType=='register'||(_this.accessType=='notpass'&&company_name!=_this.supplierInfo.companyName)
                        ){
                            _this.checkCompany(company_name);
                        }
                        break;
                    }
                    default :
                        break;
                }
            }).on('click','#sendCode', function(){ //发送验证码
                if($(this).hasClass('dis')){
                    if(!T.RE.mobile.test($.trim($('#account_mobile').val())))return;
                    if(_this.usernameChecking){
                        T.msg('正在检查用户名！');
                        return;
                    }
                    if(!_this.uniqueFlag){
                        T.msg('该手机号已经注册过，请返回首页登录！');
                        return;
                    }
                }
            }).on('keyup', '#account_mobile', function(){
                if(T.RE.mobile.test($.trim($(this).val()))&&!_this.captchaToPhone.timer){
                    $('#sendCode').removeClass('dis');
                }else{
                    $('#sendCode').addClass('dis');
                }
            }).on('change','#pid-a', function(){//地址定位
                _this.location();
            }).on('change','#cid-a', function(){
                _this.location();
            }).on('change','#did-a', function(){
                _this.location();
            }).on('keyup', '#address', function(){
                _this.location();
            });
        },
        /**
         * 清除Cookie
         */
        unCookie : function(){
            T.Cookie.set('sid', "", { expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
            T.Cookie.set('_user_type', "", { expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
            T.Cookie.set('_a_account', "", { expires: -1, path: '/'});
            T.Cookie.set('_a_name', "", { expires: -1, path: '/'});
            T.Cookie.set('_a_status', "", { expires: -1, path: '/'});
        },
        findRowspan: function(ele){
            var _this = this,
                prev = $(ele).prev('tr')[0],
                td = $(prev).find('td[rowspan]')[0];
            if(td){
                return td;
            }else{
                return _this.findRowspan(prev);
            }
        },
        /**
         * 获取可生产产品的json数据
         */
        queryCategory: function(){
            var _this = this;
            T.Template('products', {});
            $.getJSON(T.DOMAIN.WWW+'scripts/data/product.json',function(data){
                T.Template('category',data);
                $('#addProducts .panel').checkboxs("checkbox", "checkbox_all", function(input, value){//点击回调

                });
            });
        },
        /**
         * 获取弹窗内当前选择产品
         */
        getCurrentSelected: function(){
            var _this = this;
            var curSelProducts = {};
            curSelProducts.categoryList=[];
            $('#addProducts input:checked').each(function(index, element){
                if($(element).data('product')){
                    var category = $(element).closest('ul').data('category');
                    var curObj = T.Array.get(curSelProducts.categoryList, category, 'categoryName');
                    if(curObj){
                        curObj.products.push({productName:$(element).data('product'), homeDelivery:'0', express:'0'});
                    }else{
                        curSelProducts.categoryList.push({
                            categoryName: category,
                            products: [{productName:$(element).data('product'), homeDelivery:'0', express:'0'}]
                        });
                    }
                }
            });
            return curSelProducts;
        },
        /**
         * 检查验证码
         */
        checkCode: function(username, code){
            var _this = this;
            if(!T.RE.code.test(code)){
                return;
            }
            _this.codeChecking = true;
            T.POST(
                {
                    action: CFG.API.checkcode,
                    params: {
                        username: username,
                        code: code
                    },
                    success: function(res){
                        console.log(res);
                        _this.codeChecking = false;
                        _this.codeFlag = true;
                    },
                    failure: function(res){
                        T.msg('验证码不正确');
                        _this.codeChecking = false;
                        _this.codeFlag = false;
                    }
                }
            );
        },
        /**
         * 检查用户名唯一性
         */
        checkUsername: function(username){
            var _this = this;
            if(!T.RE.mobile.test(username)){
                return;
            }
            _this.usernameChecking = true;
            T.GET(
                {
                    action: CFG.API.check_username,
                    params: {
                        username: username
                    },
                    success: function(res){
                        console.log(res);
                        _this.usernameChecking = false;
                        _this.uniqueFlag = true;
                    },
                    error: function(res){
                        console.log(res);
                        _this.usernameChecking = false;
                        _this.uniqueFlag = false;
                        $('#sendCode').addClass('dis');
                        T.msg('该手机号已经注册过，请返回首页登录！');
                    }
                }
            );
        },
        /**
         * 检查公司名称的唯一性
         */
        checkCompany: function(companyName){
            var _this = this;
            if(!companyName){
                return;
            }
            _this.companyChecking = true;
            T.GET(
                {
                    action: CFG.API.check_companyname,
                    params: {
                        companyName: companyName
                    },
                    success: function(res){
                        console.log(res);
                        _this.companyChecking = false;
                        _this.companyFlag = true;
                    },
                    failure: function(res){
                        console.log(res);
                        _this.companyChecking = false;
                        _this.companyFlag = false;
                        T.msg(res.msg);
                    }
                }
            );
        },
        /**
         * 初始化百度地图
         */
        initMap: function(){
            var _this = this;
            if(BMap != undefined){
                _this.map = new BMap.Map("baidumap");
                var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});
                var top_left_navigation = new BMap.NavigationControl();
                var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL});
                _this.map.addControl(top_left_control);
                _this.map.addControl(top_left_navigation);
                _this.map.addControl(top_right_navigation);
                _this.map.centerAndZoom($("#cid-a").val(),15);
                _this.location();
            }
        },
        /**
         * 地图定位
         */
        location: function(){
            var _this = this;
            var province = $("#pid-a").val();
            var city = $("#cid-a").val();
            var area = $("#did-a").val()||'';
            var address = $.trim($("#address").val());
            var myGeo = new BMap.Geocoder();
            //alert(province+city+area)
            myGeo.getPoint(province+city+area+address, function(point){
                if (point) {
                    _this.map.centerAndZoom(point, 16);
                    _this.map.clearOverlays();
                    _this.map.addOverlay(new BMap.Marker(point));
                    var marker = new BMap.Marker(point,{
                        enableDragging: true,
                        raiseOnDrag: true
                    });
                    marker.enableDragging();
                    _this.map.centerAndZoom(point, 15);
                    _this.map.addOverlay(marker);
                }else{
                    /*T.msg("定位错误");*/
                }
            }, province);
        },
        /**
         * 初始化上传组件
         */
        initUpload: function(){
            var _this = this;
            if(!this.upload1){
                this.upload1 = Uploader({
                    type: "gif,jpg,png",
                    inputId: "upl_bsLicense",
                    text: _this.supplierInfo.businessLicensePath?"重新上传营业执照":"上传营业执照",
                    text2: "重新上传营业执照",
                    onSuccess: function(params){//上传完成
                        $('#upl_bsLicense-cont').next('.upload-info').attr({ href: params.fileUri, title: params.fileName}).html(params.fileName);
                        _this.businessLicensePath = params.fileUri;
                    }
                });
                this.upload2 = Uploader({
                    type: "gif,jpg,png",
                    inputId: "upl_frontalView",
                    text: _this.supplierInfo.corporateIdForwardSide?"重新上传正面照":"正面照",
                    text2: "重新上传正面照",
                    onSuccess: function(params){
                        $('#upl_frontalView-cont').next('.upload-info').attr({ href: params.fileUri, title: params.fileName}).html(params.fileName);
                        _this.corporateIdForwardSide = params.fileUri;
                    }
                });
                this.upload3 = Uploader({
                    type: "gif,jpg,png",
                    inputId: "upl_reverseView",
                    text: _this.supplierInfo.corporateIdBackSide?"重新上传反面照":"反面照",
                    text2: "重新上传反面照",
                    onSuccess: function(params){
                        $('#upl_reverseView-cont').next('.upload-info').attr({ href: params.fileUri, title: params.fileName}).html(params.fileName);
                        _this.corporateIdBackSide = params.fileUri;
                    }
                });
                this.upload4 = Uploader({
                    type: "gif,jpg,png",
                    inputId: "upl_orgNumber",
                    text: _this.supplierInfo.organizationCodePath?"重新上传":"组织机构代码证照片",
                    text2: "重新上传",
                    onSuccess: function(params){
                        $('#upl_orgNumber-cont').next('.upload-info').attr({ href: params.fileUri, title: params.fileName}).html(params.fileName);
                        _this.organizationCodePath = params.fileUri;
                    }
                });
                this.upload5 = Uploader({
                    type: "gif,jpg,png",
                    inputId: "upl_taxId",
                    text: _this.supplierInfo.taxRegistrationNumberPath?"重新上传":"税务登记证照片",
                    text2: "重新上传",
                    onSuccess: function(params){
                        $('#upl_taxId-cont').next('.upload-info').attr({ href: params.fileUri, title: params.fileName}).html(params.fileName);
                        _this.taxRegistrationNumberPath = params.fileUri;
                    }
                });
                this.upload6 = Uploader({
                    type: "gif,jpg,png",
                    inputId: "upl_factoryPhoto",
                    text: _this.supplierInfo.facEquipmentPath?"重新上传":"上传",
                    text2: "重新上传",
                    onSuccess: function(params){
                        $('#upl_factoryPhoto-cont').next('.upload-info').attr({ href: params.fileUri, title: params.fileName}).html(params.fileName);
                        _this.facEquipmentPath = params.fileUri;
                    }
                });
            }
        },
        /**
         * 跳转至相应的页面
         * @param {String} step 步骤
         */
        goStep: function(step){
            var _this = this;
            var contentN = '.content' + step;
            _this.domNode.find(contentN).addClass('active').siblings().removeClass('active');
            _this.domNode.find('.panel-heading li').removeClass('current');
            _this.domNode.find('.panel-heading li')[step-1].className = 'current';
        },
        checkStep1: function(){
            var _this = this;
            if(_this.accessType == 'notpass'){
                return true;
            }
            var account_mobile = $.trim($('#account_mobile').val());
             var auth_code = $.trim($('#auth_code').val());
             var password = $.trim($('#password').val());
             if(!T.RE.mobile.test(account_mobile)){
             T.msg('请输入正确格式的手机号码！');
             return false;
             }
             if(_this.usernameChecking){
             T.msg('正在检查用户名！');
             return false;
             }
             if(!_this.uniqueFlag){
             T.msg('该手机号已经注册过，请返回首页登录！');
             return false;
             }
             if(!T.RE.code.test(auth_code)){
             T.msg('请输入6位数字验证码！');
             return false;
             }
             if(_this.codeChecking){
             T.msg('正在检查验证码！');
             return false;
             }
             if(!_this.codeFlag){
             T.msg('验证码不正确！');
             return false;
             }
             if(!T.RE.pwd.test(password)){
             T.msg('请输入6~16位密码！');
             return false;
             }
             if(!$('#accept_agreement').prop('checked')){
             T.msg('请阅读并接受《云印供应商服务协议》！');
             return false;
             }
            return true;
        },
        checkStep2: function(){
            var _this = this;
            var company_name = $.trim($('#company_name').val());
            var legal_person = $.trim($('#legal_person').val());
            var address = $.trim($('#address').val());
            if(!company_name){
                T.msg('请输入公司名称!');
                return false;
            }
            if(_this.companyChecking){
                T.msg('正在检查企业名！');
                return false;
            }
            if(!_this.companyFlag&&(_this.accessType=='register'||(_this.accessType=='notpass'&&company_name!=_this.supplierInfo.companyName))){
                T.msg('企业名已存在！');
                return false;
            }
            if(!legal_person){
                T.msg('请输入法人代表!');
                return false;
            }
            if(!address){
                T.msg('请输入详细地址!');
                return false;
            }
            _this.initUpload();
            return true;
        },
        checkStep3: function(){
            var _this = this;
            var bs_license = $.trim($('#bs_license').val());
            var id_number = $.trim($('#id_number').val());
            var org_number = $.trim($('#org_number').val());
            if(_this.upload1.isUploading || _this.upload2.isUploading || _this.upload3.isUploading || _this.upload4.isUploading || _this.upload5.isUploading || _this.upload6.isUploading){
                T.msg('正在上传文件!');
                return false;
            }
            if(!/^\w{15,18}$/.test(bs_license)){
                T.msg('请输入15~18位营业执照号!');
                return false;
            }
            /*if(!/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(id_number)){
             T.msg('请输入18位法人身份证号!');
             return false;
             }*/
            if(org_number && !/^\w{5,20}$/.test(org_number)){
                T.msg('请输入5~20位组织机构代码!');
                return false;
            }
            if(_this.accessType=='register'&&!_this.businessLicensePath){
                T.msg('请上传营业执照！');
                return false;
            }
            /*if(!_this.corporateIdForwardSide){
             T.msg('请上传法人身份证正面照！');
             return false;
             }
             if(!_this.corporateIdBackSide){
             T.msg('请上传法人身份证反面照！');
             return false;
             }*/
            return true;
        },
        checkStep4: function(){
            var _this = this,
                bank_account = $.trim($('#bank_account').val()),
                account_name = $.trim($('#account_name').val()),
                account_bank = $.trim($('#account_bank').val());
            /*issue_invoice = $('input[name=invoice]:checked').val();*/
            //银行卡号：9-19位不等的数字
            /*if(!/^\d{9,19}$/.test(bank_account)){
             T.msg('请输入正确的银行账号!');
             return false;
             }*/
            if(!bank_account){
                T.msg('请输入银行账号!');
                return false;
            }
            if(!account_name){
                T.msg('请输入开户名!');
                return false;
            }
            if(!account_bank){
                T.msg('请输入开户行!');
                return false;
            }
            /*if(!issue_invoice){
             T.msg('请选择发票信息!');
             return false;
             }*/
            return true;
        },
        checkStep5: function(){
            return true;
        },

        /**
         * 获取要提交的产品列表
         */
        getProducts: function(){
            var _this = this;
            var curSelProducts = _this.curSelProducts;
            $('#product_list input').each(function(index, element){
                var category = $(element).closest('tr').data('category');
                var curCategory = T.Array.get(curSelProducts.categoryList, category, 'categoryName');
                if(curCategory){
                    var curProduct = T.Array.get(curCategory.products, $(element).data('product'), 'productName');
                    if(curProduct){
                        if($(this).prop('checked')){
                            curProduct[$(element).data('attr')] = '1';
                        }else{
                            curProduct[$(element).data('attr')] = '0';
                        }
                    }
                }
            });
            return curSelProducts;
        },

        getSupplierInfo: function(){
            var _this = this;
            T.GET({
                action: CFG.API.supplier.supplier_detail,
                params: null,
                success: function(res){
                    console.log(res);
                    var supplier = res.supplier || {};
                    supplier.accessType = 'notpass';
                    T.Template('supplier_info', supplier);
                    _this.curSelProducts = supplier.productShow?T.JSON.parse(supplier.productShow):{};
                    _this.supplierInfo = supplier;
                    var arr = supplier.companyAddress?supplier.companyAddress.split('^'):[];
                    $('#pcd-a').val(arr[0]+'^'+arr[1]+'^'+(arr[2]||''));
                    window.PCD.init();
                    $("#address").val(arr[3]||'');
                    _this.initUI();
                    $('#build_time').val(supplier.plantTime?supplier.plantTime.substr(0,10): ''); //建厂时间
                    if(supplier.carDelivery=='1'){
                        $('#delivery_range_wrap').removeClass('hide');
                    }
                    T.Template('products', _this.curSelProducts);
                }
            });
        },

        /**
         * 提交表单
         */
        applyForJoin: function(){
            var _this = this;
            var address = $("#pid-a").val() +'^'+ $("#cid-a").val() +'^'+ ($("#did-a").val()||'') +'^'+ $.trim($("#address").val());
            var productList = _this.getProducts();
            if(!productList.categoryList || productList.categoryList.length==0){
                T.msg('请至少选择一个可生产产品！');
                return;
            }
            var params = {
                companyName: $.trim($('#company_name').val()), //公司名称
                corporateRep: $.trim($('#legal_person').val()), //法人代表
                companyAddress: address, //公司地址
                businessLicenseNumber: $.trim($('#bs_license').val()), //营业执照号
                //businessLicensePath: _this.businessLicensePath, //营业执照照片
                corporateIdCard: $.trim($('#id_number').val()), //法人身份证号
                //corporateIdForwardSide: _this.corporateIdForwardSide, //法人身份证正面照
                //corporateIdBackSide: _this.corporateIdBackSide, //法人身份证反面照
                //organizationCodePath: _this.organizationCodePath,
                //taxRegistrationNumberPath: _this.taxRegistrationNumberPath,
                //facEquipmentPath: _this.facEquipmentPath,
                bankAccount: $.trim($('#bank_account').val()), //银行账号
                accountName: $.trim($('#account_name').val()), //开户名
                bankName: $.trim($('#account_bank').val()), //开户行
                //issueInvoice: $('input[name=invoice]:checked').val(), //发票信息
                issueInvoice: '1', //发票信息
                productList: productList,
                corporateRepCellphone : $.trim($('#legal_person_mb').val()),
                corporateRepTelephone : $.trim($('#tel_phone').val()),
                companyFax : $.trim($('#company_fax').val()),
                companyWebsite : $.trim($('#web_site').val()),
                annualOutputValue : $.trim($('#year_output').val()),
                companyNumber : $.trim($('#person_number').val()),
                factoryArea : $.trim($('#factory_area').val()),
                supplierEquipment : $.trim($('#factory_machine').val()),
                carDelivery : $('input[name=delivery]:checked').val()||'0',
                distributionRange : $.trim($('#delivery_range').val()),
                advantageDescription : $.trim($('#advantage').val()),
                contactsName : $.trim($('#link_man').val()),
                contactsSex : $('input[name=sex]:checked').val()||'0',
                contactsEmail : $.trim($('#email').val()),
                contactsCellphone : $.trim($('#link_mobile').val()),
                contactsPosition : $.trim($('#link_position').val()),
                contactsQq : $.trim($('#link_qq').val()),
                organizationCode : $.trim($('#org_number').val()),
                taxRegistrationNumber : $.trim($('#tax_id').val())
            };
            if($('#build_time').val()){
                params.plantTime = $('#build_time').val();
            }
            if(_this.accessType == 'register'){
                params.cellPhone = $.trim($('#account_mobile').val()); //手机号
                params.password = $.trim($('#password').val()); //密码
            }
            if(_this.organizationCodePath){
                params.organizationCodePath = _this.organizationCodePath;
            }
            if(_this.corporateIdForwardSide){ //法人身份证正面照
                params.corporateIdForwardSide = _this.corporateIdForwardSide;
            }
            if(_this.corporateIdBackSide){ //法人身份证反面照
                params.corporateIdBackSide = _this.corporateIdBackSide;
            }
            if(_this.businessLicensePath){ //营业执照照片
                params.businessLicensePath = _this.businessLicensePath;
            }
            if(_this.taxRegistrationNumberPath){
                params.taxRegistrationNumberPath = _this.taxRegistrationNumberPath;
            }
            if(_this.facEquipmentPath){
                params.facEquipmentPath = _this.facEquipmentPath;
            }
            T.POST({
                action: _this.accessType == 'register'?CFG.API.register:CFG.API.supplier.update_supplier,
                params: params,
                success: function(res){
                    console.log(res);
                    _this.unCookie();
                    _this.goStep('6');
                },
                failure: function(res){
                    T.msg(res.msg);
                },
                error: function(res){
                    T.msg(res.msg);
                }
            });
        }
    };
    apply.init();
}(window, document));



