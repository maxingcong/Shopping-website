!(function(window, document, undefined) {
    "use strict";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    document.title =  "产品管理-供应商平台";
    var Product = {
        data: {
            index: 1, //当前页码
            offset: 10, //每页条数
            auditStatus: "Pass", //审核状态
            orderStatus: "" //接单状态
        },
        init: function(){
            var _this = this;
            _this.$cont = $("#product-list"); //容器
            _this.$view = $("#template-product_list-view"); //列表视图
            _this.render();
            _this.loadProduct();
            _this.events();
        },
        /**
         * 渲染页面
         */
        render: function(){
            var _this = this;
            T.Template("product_list", _this.data);
            T.BindData("data", _this.data);
        },
        /**
         * 获取产品列表
         * @param {Number} [pageIndex=1] 当前页码
         */
        loadProduct: function(index){
            var _this = this;
            index = index||1;
            var params = {
                index: String((index-1)*_this.data.offset), //起始位置
                offset: _this.data.offset //偏移数
            };
            if(_this.data.auditStatus){ //审核状态
                params.auditStatus = _this.data.auditStatus;
            }
            if(_this.data.orderStatus){ //接单状态
                params.orderStatus = _this.data.orderStatus;
            }
            if(_this.data.keywords){ //关键字
                params.keywords = _this.data.keywords;
            }
            $("#batchChangeOrderStatus").addClass("dis");
            _this.$view.addClass("load");
            T.GET({
                action: CFG.API.product.supplier_product,
                params: params,
                success: function(data, params){
                    data = data||{};
                    _this.$view.removeClass("load");
                    _this.data.supplierProducts = data.supplierProducts||[];
                    _this.data.recordCount = data.count||0;
                    T.Each(_this.data.supplierProducts, function(i, product){
                        var deliveryList = [];
                        T.Each(product.deliveryModeList, function(k, delivery){
                            T.Array.add(deliveryList, CFG.DELIVERY_METHOD[delivery.deliveryId]||"", false);
                        });
                        product.deliveryStr = deliveryList.join("、");
                    });
                    _this.render();debugger
                    _this.$cont.checkboxs("checkbox", "checkbox_all"); //全选
                    if(_this.data.supplierProducts.length>0){
                        $("#batchChangeOrderStatus").removeClass("dis");
                    }
                    //分页条
                    T.Paginbar({
                        num: 3,
                        size: _this.data.offset, //每页条数
                        total: Math.ceil(_this.data.recordCount/_this.data.offset), //总页数
                        index: index||1, //当前页码
                        paginbar: "paginbar", //容器ID
                        callback: function(obj, index, size, total){ //点击页码回调
                            _this.loadProduct(index);
                        }
                    });
                    _this.data.index = index;
                }
            });
        },
        /**
         * 更改接单状态
         * @param {Array} ids ID集合
         * @param {String} orderStatus 接单状态
         */
        changeOrderStatus: function(ids, orderStatus, callback){
            var _this = this;
            if(!ids||!orderStatus)return;
            T.POST({
                action: CFG.API.product.supplier_product_update_all,
                params: {
                    productIds: ids.join(","),
                    orderStatus: orderStatus
                },
                success: function(data, params){
                    data = data||{};
                    if(callback)callback();
                    _this.loadProduct();
                }
            });
        },
        /**
         * 删除可供应产品
         * @param id 可供应产品唯一标识
         */
        deleteSupplierProduct: function(id){
            var _this = this;
            if(!id)return;
            var $view = T.Template("modal_confirm", {
                content: "删除后无法恢复，确认删除吗？"
            });
            $("#myConfirm").modal("show");
            $view.off("click.confirm", ".confirm").on("click.confirm", ".confirm", function(e){
                $("#myConfirm").modal("hide");
                T.POST({
                    action: CFG.API.product.delete_supplier_product,
                    params: {
                        id: id
                    },
                    success: function(data, params){
                        data = data||{};
                        T.msg(data.msg||"删除成功");
                        setTimeout(function(){
                            _this.loadProduct();
                        }, 1000);
                    }
                });
            });
        },
        /**
         * 绑定事件
         */
        events: function(){
            var _this = this;
            $("#product-tabs").on("click.auditStatus", "li > a", function(e){ //审核状态
                _this.data.auditStatus = $(this).data("audit_status")||"";
                if(_this.data.auditStatus=="Pass"){
                    $("#batchChangeOrderStatus").show();
                }else{
                    $("#batchChangeOrderStatus").hide();
                }
                _this.loadProduct();
            });
            _this.$cont.on("change.orderStatus", "select[name='orderStatus']", function(e){ //接单状态
                _this.data.orderStatus = $(this).val()||"";
                _this.loadProduct();
            }).on("change.pageCount", "select[name='pageCount']", function(e){ //接单状态
                _this.data.index = 0;
                _this.data.offset = $(this).val()||10;
                _this.loadProduct();
            }).on("click.search", "#search", function(e){ //搜索
                _this.data.keywords = $("#keywords").val()||"";
                _this.loadProduct();
            }).on("click.batchChangeOrderStatus", "#batchChangeOrderStatus:not(.dis)", function(e){ //批量更改接单状态
                var ids = _this.$cont.getChecked("checkbox"); //产品ID集合
                var $modal = $("#modal-batchChangeOrderStatus");
                if(ids&&ids.length){
                    $modal.modal("show").off("click.save").on("click.save", ".save", function(e){ //保存
                        var orderStatus = $("input[name='orderStatus']:checked").val();
                        if(orderStatus){
                            _this.changeOrderStatus(ids, orderStatus, function(){
                                $modal.modal("hide");
                            });
                        }else{
                            T.msg("请先选择要更改的接单状态");
                        }
                    });
                }else{
                    T.msg("请先选择要更改接单状态的产品");
                }
            }).on("click.changeOrderStatus", "[name='btn-orderStatus']", function(e){ //更改接单状态
                var $tr = $(this).closest("tr", _this.$cont);
                var id = $tr.data("id");
                var orderStatus = $tr.data("order_status")||"";
                orderStatus = orderStatus=="normal"?"suspend":"normal";
                _this.changeOrderStatus([id], orderStatus);
            }).on("click.delete", ".delete", function(e){ //删除可供应产品
                var $tr = $(this).closest("tr", _this.$cont);
                var id = $tr.data("id");
                _this.deleteSupplierProduct(id);
            });
        }
    };
    Product.init();
    //window.Product = Product;
}(window, document));