require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            quotation: '',
            init: function(){
                var that = this;
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){
                    if (demandMain.data.quotationId) {//创建时-提交这些描述
                        if(that.quotation.otherRequirements!==""){
                            param["产品名称"] = that.quotation.productName;
                        }
                        if(that.quotation.otherRequirements!==""){
                            param["询价单号"] = that.quotation.id;
                        }
                        if(that.quotation.otherRequirements!==""){
                            param["询价日期"] = that.quotation.dateCreatedStr;
                        }
                        if(that.quotation.otherRequirements!==""){
                            param["产品描述"] = that.quotation.otherRequirements;
                        }
                    }else if(demandMain.data.orderCode){//已创建的订单-修改需求
                        var demand = demandMain.data.demand||{}, paramsInfo = demand.paramsInfo||{};
                        param["产品名称"] = paramsInfo["产品名称"];
                        param["产品描述"] = paramsInfo["产品描述"];
                        param["询价单号"] = paramsInfo["询价单号"];
                        param["询价日期"] = paramsInfo["询价日期"];
                    }
                });
                demandMain.getPrice = function(data){debugger
                    this.pdtPrice.trigger('success', data);
                };
                if (demandMain.data.quotationId) {//存在询价单——重写
                    demandMain.getOrder = function(callback) {
                        var _this = this;
                        T.GET({
                            action:"in_product/quotation_detail",
                            params: {
                                from: "User",
                                id: _this.data.quotationId
                            },
                            success: function(data) {
                                var q = that.quotation = data.quotation;
                                var info = q.infSubList[0];
                                info.price = info.salePrice + (info.urgentCost||0);
                                _this.data.quotationSubId = info.id;
                                _this.data.product.productName = q.productName
                                _this.data.product.id = q.id;
                                _this.data.product.dateCreatedStr = q.dateCreatedStr;
                                _this.data.product.otherRequirements = q.otherRequirements;
                                var file = [];
                                if(q.attachmentName && q.attachmentPath){
                                    file.push({
                                        fileName: q.attachmentName,
                                        fileUrl: q.attachmentPath,
                                        uploaded: '0'
                                    });
                                }
                                _this.data.demand = _this.data.demand||{paramsInfo: ''};
                                _this.data.demand.paramsInfo = {materials: file};
                                _this.getPrice(info);
                                _this.loaded(callback);
                                
                            },
                            failure: function(data, params){
                                fail(data, params);
                            }
                        });
                    }
                }else if(!demandMain.data.orderCode){
                    fail({});
                };
                demandMain.init({
                    custom: [],
                    namesOrder: []
                });
                function fail(data, params) {
                    T.alt(data.msg || '该设计产品已下架，请选择其他设计产品。', function(_o) {
                        _o.remove();
                        window.location.replace(T.DOMAIN.DESIGN);
                    }, function(_o) {
                        _o.remove();
                        window.location.replace(T.DOMAIN.DESIGN);
                    }, "返回设计服务列表");
                }
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});