!(function(window, document, undefined) {
    "use strict";
    document.title = "基本信息-供应商平台";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var basicInfo = {
        curSelProducts: {}, //当前选择的产品
        curAddress: '', //当前地址
        supplierInfo: null, //供应商信息
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            _this.$cont = $('.page-basic'); //容器
            T.Template('basic_info', {});
            _this.getSupplierInfo(); //获取供应商信息
            _this.bindEvents();
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            $('#add_products_btn').on('click', function(){ //选择可生产产品弹窗-确认按钮
                var obj = _this.getCurrentSelected();
                T.Template('products',obj);
                _this.curSelProducts = obj;
                $('#addProducts').modal('hide');
            });
            _this.$cont.on('click', '#change_address_btn', function(){ //修改地址
                if(!_this.map){
                    var $view = T.Template("change_address","modal_content", {}); //修改地址弹窗
                    $view.on('keyup','#addressInput', function(){ //具体街道
                        _this.location();
                    }).on('click', '#saveAddress', function(){ //保存地址修改
                        if(!$.trim($('#addressInput').val())){
                            T.msg('请输入地址！');
                            return;
                        }
                        _this.curAddress =_this.curAddress.split('^')[0]+'^'+_this.curAddress.split('^')[1]+'^'+(_this.curAddress.split('^')[2]||'')+'^'+ $.trim($('#addressInput').val());
                        var params = {companyAddress: _this.curAddress};
                        _this.updateInfo(params, function(){ //回调
                            $('#addressInput').val('');
                            $("#myModal").modal("hide");
                        });
                    });
                    $('#defAddress').text(_this.curAddress.split('^')[0]+_this.curAddress.split('^')[1]+(_this.curAddress.split('^')[2]||''));//修改公司基本信息--'公司地址'值
                    _this.initMap(); //地图初始化
                }
                $("#myModal").modal("show");
            }).on('click', '#template-products-view a.btn-link', function(){ //产品删除
                var category = $(this).closest('tr').data('category'),
                    product = $(this).data('product'),
                    curSelProducts = _this.curSelProducts, //当前产品列表
                    curCategory = T.Array.get(curSelProducts.categoryList, category, 'categoryName'); //当前类别
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
                            var tdRowspan = _this.findRowspan($(this).closest('tr')[0]);//找到当前分类有rowspan属性的td
                            if(tdRowspan){
                                $(tdRowspan).attr('rowspan', curCategory.products.length);
                            }
                        }
                    }
                    $(this).closest('tr').remove(); //删除节点
                }
            }).on('click', '#basicSaveBtn', function(){ //保存
                _this.checkInfo();
            });
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
            $.getJSON(T.DOMAIN.WWW+'scripts/data/product.json',function(data){
                _this.renderTpl(data);
            });
        },
        renderTpl: function(res){
            var _this = this;
            T.Template('category',res);
            T.Template('products', _this.curSelProducts||{});
            $('#addProducts .panel').checkboxs("checkbox", "checkbox_all", function(input, value){//点击回调

            });
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
                _this.map.centerAndZoom(_this.curAddress.split('^')[1],15);
                _this.location();
            }
        },
        /**
         * 地图定位
         */
        location: function(){
            var _this = this;
            var myGeo = new BMap.Geocoder();
            var address = _this.curAddress.split('^')[0] + _this.curAddress.split('^')[1] + (_this.curAddress.split('^')[2]||'') + $('#addressInput').val();
            //alert(province+city+area)
            myGeo.getPoint( address, function(point){
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
                    /*alert("定位错误");*/
                }
            }, _this.curAddress.split('^')[0]);
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
                        curObj.products.push({productName:$(element).data('product')});
                    }else{
                        curSelProducts.categoryList.push({
                            categoryName: category,
                            products: [{productName:$(element).data('product')}]
                        });
                    }
                }
            });
            return curSelProducts;
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

        /**
         * 获取供应商信息
         */
        getSupplierInfo: function(){
            var _this = this;
            T.GET({
                action: CFG.API.supplier.supplier_detail,
                params: null,
                success: function(res){
                    var supplier = res.supplier || {};
                    T.Template('basic_info', supplier);
                    _this.curSelProducts = T.JSON.parse(supplier.productShow);
                    _this.queryCategory();
                    _this.curAddress = supplier.companyAddress;
                    $('#companyAddress').text(_this.curAddress.replace(/\^/g, ''));
                    _this.supplierInfo = supplier;
                    console.log(res);
                }
            });
        },

        /**
         * 校验表单
         */
        checkInfo: function(){
            var _this = this,
                productList = _this.getProducts();
            if(!productList.categoryList || productList.categoryList.length==0){
                T.msg('请至少选择一个可生产产品！');
                return;
            }
            var params = {},
                legal_person_mb = $.trim($('#legal_person_mb').val()),
                tel_phone = $.trim($('#tel_phone').val()),
                company_fax = $.trim($('#company_fax').val()),
                web_site = $.trim($('#web_site').val()),
                year_output = $.trim($('#year_output').val()),
                person_number = $.trim($('#person_number').val()),
                factory_machine = $.trim($('#factory_machine').val()),
                link_man = $.trim($('#link_man').val()),
                link_sex = $('input[name=sex]:checked').val(),
                email = $.trim($('#email').val()),
                link_mobile = $.trim($('#link_mobile').val()),
                link_position = $.trim($('#link_position').val()),
                link_qq = $.trim($('#link_qq').val());
            if(legal_person_mb != _this.supplierInfo.corporateRepCellphone){
                params.corporateRepCellphone = legal_person_mb;
            }
            if(tel_phone != _this.supplierInfo.corporateRepTelephone){
                params.corporateRepTelephone = tel_phone;
            }
            if(company_fax != _this.supplierInfo.companyFax){
                params.companyFax = company_fax;
            }
            if(web_site != _this.supplierInfo.companyWebsite){
                params.companyWebsite = web_site;
            }
            if(year_output != _this.supplierInfo.annualOutputValue){
                params.annualOutputValue = year_output;
            }
            if(person_number != _this.supplierInfo.companyNumber){
                params.companyNumber = person_number;
            }
            if(factory_machine != _this.supplierInfo.supplierEquipment){
                params.supplierEquipment = factory_machine;
            }
            if(link_man != _this.supplierInfo.contactsName){
                params.contactsName = link_man;
            }
            if(link_sex != _this.supplierInfo.contactsSex){
                params.contactsSex = link_sex;
            }
            if(email != _this.supplierInfo.contactsEmail){
                params.contactsEmail = email;
            }
            if(link_mobile != _this.supplierInfo.contactsCellphone){
                params.contactsCellphone = link_mobile;
            }
            if(link_position != _this.supplierInfo.contactsPosition){
                params.contactsPosition = link_position;
            }
            if(link_qq != _this.supplierInfo.contactsQq){
                params.contactsQq = link_qq;
            }
            params.productList = productList;
            _this.updateInfo(params);
        },

        /**
         * 修改供应商信息
         */
        updateInfo: function(params, callback){
            var _this = this;
            T.loading();
            T.POST({
                action: CFG.API.supplier.update_supplier,
                params: params,
                success: function(res){
                    console.log(res);
                    T.loading('true');
                    T.msg('修改成功！');
                    _this.getSupplierInfo();
                    if(callback){
                        callback();
                    }
                }
            });
        }
    };
    basicInfo.init();
}(window, document));