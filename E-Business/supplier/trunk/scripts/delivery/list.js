!(function(window, document, undefined) {
    "use strict";
    document.title =  "运费设置-供应商平台";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var delivery = {
        data: {
            shipper: "Supplier", //发货人
            receiver: "User", //收货人
            receiverStr: "用户"
        },
        init: function(){debugger
            var _this = this;
            _this.$cont = $("#delivery_list");
            _this.$view = $("#template-delivery_list-view"); //列表视图
            //_this.loadModeList();
            _this.events();
            $("#delivery-tabs li:eq("+(T.REQUESTS.receiver=="In"?1:0)+") a").trigger("click");
        },
        /**
         * 渲染页面
         */
        render: function(){
            var _this = this;
            _this.$cont.removeClass("load");
            T.Template("delivery_list", _this.data);
            T.BindData("data", _this.data);
        },
        /**
         * 查询代发货点列表
         */
        loadReplacePointList: function(){
            var _this = this;
            T.GET({
                action: CFG.API.delivery.replace_point_list,
                success: function(data){
                    data.replacePoint = _this.data.replacePoint;
                    var $view = T.Template("replace_point_list", "modal_content", data);
                    $("#myModal").modal("show");
                    $view.on("click.save", ".save", function(e){//保存编辑
                        if(!$('input[name=replacePoint]:checked').val()){
                            T.msg('请选择仓储中心！');
                            return;
                        }
                       _this.updateReplacePoint();
                    });
                }
            });
        },
        /**
         * 修改供应商代发货点
         */
        updateReplacePoint: function(){
            var _this = this;
            T.POST({
                action: CFG.API.delivery.update_supplier_replace_point,
                params: {
                    replaceDeliveryPointId: $('input[name=replacePoint]:checked').val()
                },
                success: function(data){
                    _this.loadModeList();
                    $("#myModal").modal("hide");
                    T.msg('操作成功！');
                }
            });
        },
        /**
         * 查询供应商支持的配送方式集合
         */
        loadModeList: function(){
            var _this = this;
            _this.$view.addClass("load");
            T.GET({
                action: CFG.API.delivery.support_mode_list,
                params: {
                    shipper: _this.data.shipper,
                    receiver: _this.data.receiver
                },
                success: function(data, params){
                    data = data||{};debugger
                    _this.$view.removeClass("load");
                    if(_this.data.receiver == 'In'){
                        _this.data.eliveryModeResult = data.inModeList||[];
                    }else{
                        _this.data.eliveryModeResult = data.userModeList||[];
                    }
                    _this.data.replacePoint = data.replacePoint||null;
                    _this.render();
                }
            });
        },
        /**
         * 根据配送方式查询计价模板列表
         * @param deliveryId
         * @param deliveryModeId
         */
        loadModeTemplateList: function(deliveryId, deliveryModeId){
            var _this = this;
            if(!deliveryId||!deliveryModeId)return;
            T.GET({
                action: CFG.API.delivery.mode_template_list,
                params: {
                    deliveryModeId: deliveryModeId
                },
                success: function(data, params){debugger
                    data = data||{};
                    _this.data.deliveryModeTemplate = data.deliveryModeTemplate||[];
                    var modeTemplateList = [];
                    //组装数据
                    T.Each(CFG.LOGISTICS_PRICE_TYPE, function(key, val){
                        var item = {};
                        T.Each(_this.data.deliveryModeTemplate, function(k, modeTemplate){
                            modeTemplate.deliveryId = modeTemplate.deliveryId||deliveryId;
                            modeTemplate.deliveryModeId = deliveryModeId;
                            modeTemplate.deliveryName = CFG.DELIVERY_METHOD[modeTemplate.deliveryId||deliveryId];
                            modeTemplate.valuationMethodName = CFG.LOGISTICS_PRICE_TYPE[modeTemplate.valuationMethod]||"";
                            if(key==modeTemplate.valuationMethod){
                                item = modeTemplate;
                            }
                        });
                        if(!item.id){
                            item = {
                                deliveryId: deliveryId,
                                deliveryModeId: deliveryModeId,
                                deliveryName: CFG.DELIVERY_METHOD[deliveryId],
                                valuationMethod: key,
                                valuationMethodName: val
                            };
                        }
                        modeTemplateList.push(item);
                    });
                    _this.data.modeTemplateList = modeTemplateList;
                    T.Template("mode_template_list", "mode_template_list-"+deliveryModeId, _this.data);
                }
            });
        },
        /**
         * 变更状态，启用/禁用
         * @param id
         */
        changeStatus: function(id, disableStatus){
            var _this = this;
            if(!id)return;
            T.POST({
                action: CFG.API.delivery.update_disable_status_all,
                params: {
                    ids: id,
                    disableStatus: String(disableStatus)
                },
                success: function(data, params){
                    var modeTemplate = T.Array.get(_this.data.deliveryModeTemplate, id, "id");
                    if(modeTemplate.deliveryId&&modeTemplate.deliveryModeId){
                        _this.loadModeTemplateList(modeTemplate.deliveryId, modeTemplate.deliveryModeId);
                    }
                }
            });
        },
        events: function(){
            var _this = this;
            $("#delivery-tabs").on("click.tab", "li > a", function(e){ //配送模式
                var index = $(this).data("index");
                if(index==1){
                    _this.data.receiver = "In";
                    _this.data.receiverStr = "云印仓储中心";
                }else{
                    _this.data.receiver = "User";
                    _this.data.receiverStr = "用户";
                }
                _this.loadModeList();
            });
            _this.$cont.on("click.status", "[name='btn-status']", function(e){
                var $tr = $(this).closest("tr");
                var id = $tr.data("id");
                var modeTemplate = T.Array.get(_this.data.modeTemplateList, id, "id");
                if(modeTemplate.id){
                    _this.changeStatus(modeTemplate.id, modeTemplate.disableStatus==1?0:1);
                }
            }).on("click.shwhid", ".shwhid", function(e){
                var $this = $(this);
                var $icon = $(".fa", $this);
                var $text = $("span", $this);
                var $tr = $this.closest("tr");
                var $box = $tr.next("tr");
                var $prev = $tr.prev("tr");
                var $next = $box.next("tr");
                if($icon.hasClass("fa-angle-double-down")){ //展开
                    $tr.addClass("show_row");
                    $icon.removeClass("fa-angle-double-down");
                    $icon.addClass("fa-angle-double-up");
                    $text.text("收起");
                    $prev.show();
                    $box.show();
                    $next.show();
                    var deliveryId = $tr.data("delivery_id")||"";
                    var deliveryModeId = $tr.data("delivery_mode_id")||"";
                    _this.loadModeTemplateList(deliveryId, deliveryModeId);
                }else{ //收起
                    $tr.removeClass("show_row");
                    $icon.removeClass("fa-angle-double-up");
                    $icon.addClass("fa-angle-double-down");
                    $text.text("展开");
                    $prev.hide();
                    $box.hide();
                    $next.hide();
                }
            }).on('click', '#selReplace', function(){
                _this.loadReplacePointList();
            })
        }
    };
    delivery.init();
}(window, document));