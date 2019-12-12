/**
 * 查询订单列表/详情，上传文件/需求，取消订单
 * @summary 订单模块
 * @module modules/order
 */
define("modules/order", ["base", "tools"], function($, T){
    "use strict";
    var CFG = T.CFG, DOMAIN = T.DOMAIN;
    /**
     * Created by Woo on 2015/7/31
     * @author Woo
     * @version 1.0.1
     * @since 2015/7/31
     * @alias module:modules/order
     * @param {Object} settings
     * @constructor
     */
    function Order(){

    }
    Order.prototype = {
        /**
         * 查询订单列表
         * @param [callback] 参数
         */
        load: function(callback){
            var _this = this;
            T.GET({
                action: "in_order/order_query",
                params: _this.params,
                success: function (data, params) {
                    _this.dispose(data||{}, params, callback);
                }
            });
        },
        /**
         * 查询成功
         * @param data 数据
         * @param params 参数
         * @param [callback] 参数
         */
        dispose: function(data, params, callback){
            var _this = this;
            data.orderList = data.orderList||[];
            if(data.orderList.length){
                //数据处理
                T.Each(data.orderList, function(i, order){
                    //if(_this.params.order_code) { //查询单个订单时
                    //支付信息
                    var _payInfos = [];
                    var _payTypeStr = "";
                    T.Each(order.orderPayList, function (k, product) {
                        if (product && product.payStatus == 1) {
                            if (product && product.payType == 15) { //月结支付
                                _payTypeStr = product.payName + T.RMB(product.amount) + '元';
                            } else {
                                _payInfos.push(product.payName + T.RMB(product.amount) + '元');
                            }
                        }
                    });
                    if (_payTypeStr) { //月结支付
                        order._payInfos = [_payTypeStr];
                    } else {
                        order._payInfos = _payInfos.length ? _payInfos : [_payTypeStr || order.payTypeStr || ""];
                    }
                    var _logisticsInfos = []; //物流信息
                    if(order.type===10){ //设计服务订单
                        _logisticsInfos = [];
                        var _demandStatus = 0; //提交需求状态
                        T.Each(order.orderProductList, function (k, product) {
                            //设计服务需求提交状态
                            if((product.categoryId==9||product.categoryId==14||product.categoryId==23||product.categoryId==25||product.categoryId==29)&&order.status==1&&(product.status==101||product.status==103)){
                                product._demandStatus = 1;
                            }
                            //设计服务可提交需求的商品个数
                            _demandStatus += product._demandStatus;
                        });
                        //提交需求状态
                        order._demandStatus = _demandStatus;
                    }else if(order.type===5){ //账户充值订单
                        _logisticsInfos = [];
                    }else if(order.type===0){//印刷产品订单
                        var _uploadStatus = 0; //文件上传状态
                        if (order.logisticsName && order.logisticsCode) { //如果订单中存在物流信息
                            T.Array.add(_logisticsInfos, {name: order.logisticsName, code: order.logisticsCode});
                        }
                        T.Each(order.orderProductList, function (k, product) {
                            if (product.logisticsName && product.logisticsCode) { //如果订单商品中存在物流信息
                                T.Array.add(_logisticsInfos, {name: product.logisticsName, code: product.logisticsCode});
                            }
                            //订单商品文件上传状态
                            if((order.status==1&&(product.status==1||product.status==10||(product.status===0&&!product.reviewer)))||order.status===0){
                                product._uploadStatus = product.status==12?0:1;
                            }
                            //订单商品可上传文件的商品个数
                            _uploadStatus += product._uploadStatus;
                            //订单产品信息
                            product._productInfo = encodeURIComponent(T.Base64.encode(encodeURIComponent(T.JSON.stringify({
                                orderCode: order.orderCode,
                                orderProductId: product.orderProductId,
                                serialNumber: product.serialNumber,
                                categoryId: product.categoryId,
                                productId: product.productId,
                                productName: product.productName,
                                productAttr: product.productAttr
                            }))));
                            if(T.hasPMPID(product.categoryId)){
                                product._designCategoryId = 9;
                                product._productInfo = "";
                            }
                            if(product.productId==54||product.productId==200032||product.productId==200033){
                                product._designCategoryId = 23;
                            }
                            if(product.productId==149||product.productId==150||product.productId==151||product.productId==155||product.productId==156||product.productId==200030||product.productId==200031){
                                product._designCategoryId = 14;
                            }
                            if(product.productId==106||product.productId==108||product.productId==109||product.productId==200054){
                                product._designCategoryId = 25;
                            }
                            if(product.productId==110||product.productId==154||product.productId==200053||product.productId==200059){
                                product._designCategoryId = 29;
                            }
                            //是否为安装服务
                            if(product.productId==1001||product.productId==1002||product.productId==1003){
                                product._IsInstallService = 1;
                                order.IsInstallService++;
                            }
                        });
                        //订单文件上传状态
                        order._uploadStatus = _uploadStatus;
                    }
                    order._logisticsInfos = _logisticsInfos;
                    //}
                });
            }else if(_this.params.order_code){
                T.msg("订单不存在");
            }
            //缓存数据
            if(_this.params.order_code){ //查询单个订单时
                _this.data.order = data.orderList[0]||{};
            }else{
                _this.data.orderList = data.orderList;
            }
            //总页数
            _this.params.pageCount = Math.ceil(data.totalCount/_this.params.pageSize)||1;
            if(typeof(callback)=="function"){
                callback(data, params);
            }else{
                //查询完毕回调函数
                _this.loaded(data, params, callback);
            }
        },
        loaded: function(data, params, callback){
            var _this = this;
        },
        /**
         * 处理可选择印刷文件的订单商品数据
         * @param orderCode 订单编号
         * @param orderProductId 订单商品ID
         * @param categoryId 产品分类ID
         * @param productId 产品ID
         * @returns {Object}
         */
        select: function(orderCode, orderProductId, categoryId, productId){
            var _this = this;
            if(!orderCode||!orderProductId)return;
            // 获得订单信息
            var order = _this.data.order;
            if(!_this.params.order_code){
                order = T.Array.get(_this.data.orderList, orderCode, "orderCode")||[];
            }
            // 获得第孤单商品信息
            var product = T.Array.get(order.orderProductList, orderProductId, "orderProductId");
            if(product){ //存在指定订单商品ID的订单商品
                var options = {
                    isCard: product.categoryId == CFG.PPC01, //是否为名片类产品
                    isUpdate: !!product.sorceFile, //存在源文件名，则为修改
                    orderCode: product.orderCode, //订单编号
                    orderProductId: product.orderProductId, //订单商品ID
                    categoryId: product.categoryId, //产品分类ID
                    productId: product.productId, //产品ID
                    product: product, //订单商品
                    productNum: 0, //商品款数
                    quantity: product.quantity, //当前选中的数量
                    size: (T.RE.size.exec(product.productAttr||"")||[])[0]||"", //订单商品尺寸
                    params: {} //上传参数
                };
                // 构建修改订单文件的源数据
                if(product.cardId){ //存在名片ID
                    options.params[product.quantity] = {
                        chks: [product.cardId], //选中的ID
                        products: [{
                            order_product_id: product.orderProductId, //订单商品ID
                            card_id: product.cardId, //名片ID
                            template_id: "", //模板ID
                            uploaded: 0 //是否为新上传
                        }]
                    };
                    options.productNum++;
                    options.isUpdate = !!product.cardId;
                }else if(product.fileUrl){ //存在文件路径
                    options.params[product.quantity] = {
                        chks: [product.fileUrl], //选中的ID
                        products: [{
                            order_product_id: product.orderProductId, //订单商品ID
                            file_url: product.fileUrl, //文件路径
                            sorce_file: product.sorceFile, //源文件名
                            uploaded: 0 //是否为新上传
                        }]
                    };
                    options.productNum++;
                    options.isUpdate = !!product.sorceFile;
                }else{ //查找所有没有原文件名，且产品分类ID、产品ID、产品属性与当前订单商品相同的订单商品
                    T.Each(order.orderProductList, function(i, v){
                        if(v.categoryId==product.categoryId&&v.productId==product.productId&&v.productAttr==product.productAttr&&!v.sorceFile){
                            var params = options.params[v.quantity];
                            if(!params){
                                params = {
                                    chks: [], //选中的ID
                                    products: []
                                };
                                options.params[v.quantity] = params;
                            }
                            var param = {};
                            if(options.isCard){
                                param = {
                                    order_product_id: v.orderProductId, //订单商品ID
                                    card_id: "", //名片ID
                                    template_id: "", //模板ID
                                    uploaded: 0 //是否为新上传
                                };
                            }else{
                                param = {
                                    order_product_id: v.orderProductId, //订单商品ID
                                    file_url: v.fileUrl, //文件路径
                                    sorce_file: v.sorceFile, //源文件名
                                    uploaded: 0 //是否为新上传
                                };
                            }
                            params.products.push(param);
                            options.productNum++;
                        }
                    });
                }
                return options;
            }
        }
    };
    return function(options){
        return new Order(options);
    };
});