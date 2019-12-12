var _modules = ["base", "tools"], _href = location.href, _productId = _href.slice(_href.indexOf("/portal/"), _href.indexOf(".html")).replace("/portal/", '');
_modules.push("portal/" + _productId);
require(_modules, function ($, T, ProductDetailCustom) {
    //父类中方法名一律使用大驼峰
    var ProductDetail = function() {
        var _this = this;
        _this.uuid = T.UUID();
        _this.params = T.getRequest(); //URL参数
        _this.data = {}; //产品数据
        _this.attrs = {}; //已选择产品参数对象
        _this.status = false; //拉取价格状态（是否拉取成功）
        _this.discountPrice = ''; //折扣价
        _this.salePrice = ''; //售价
        _this.deliveryDay = ''; //货期
        _this.deliveryDayAlt = '（指从投入生产到生产完成的时间，不包含配送）'; //货期提示
        _this.weight = ''; //重量
        _this.counter = 1; //款数
        _this.cid = ''; //分类ID
        _this.pid = ''; //产品ID
        _this.pattr = ''; //已选产品参数
        _this.uploaded = '0'; //是否已上传文件
        _this.buynow = ''; //是否为立即购买
        //热销产品
        /*_this.hotlist = [{
         productId: 200013,
         productName: '"新"名片',
         priceDesc: '低至3.8元/盒',
         imguri: 'http://cloud.ininin.com/image/2015-07-17-18-25-26-327.jpg',
         link: T.DOMAIN.WWW + 'product/200021.html'
         }, {
         productId: 61,
         productName: '"新"名片Pro',
         priceDesc: '低至5.8元/盒',
         imguri: 'http://cloud.ininin.com/image/2015-07-17-18-58-58-868.jpg',
         link: T.DOMAIN.WWW + 'product/200022.html'
         }, {
         productId: 54,
         productName: '宣传单',
         priceDesc: '低至0.06元/张',
         imguri: 'http://cloud.ininin.com/201411272142001.jpg',
         link: T.DOMAIN.WWW + 'product/54.html'
         }, {
         productId: '',
         productName: '设计服务',
         priceDesc: '',
         imguri: T.DOMAIN.RESOURCES + 'design/750x425.jpg',
         link: T.DOMAIN.DESIGN + 'index.html'
         }, {
         productId: '',
         productName: '账户充值',
         priceDesc: '',
         imguri: T.DOMAIN.RESOURCES + 'package/750x425.jpg',
         link: T.DOMAIN.PACKAGE + 'index.html'
         }];*/
        //初始化产品
        _this.Init = function(product, callback) {
            _this = this;
            _this.cid = product.categoryId;
            _this.pid = product.productId;
            _this.pname = product.productName;
            _this.productName = product.productName.replace(/\//g, "-");
            product.deliveryDayAlt = _this.deliveryDayAlt || '';
            if (!product.pImages) {
                product.pImages = product.productImg||null;
            }
            if (T.Typeof(product.pImages, /String/)) {
                product.pImages = product.pImages.split(',');
            }else{
                product.pImages = [];
            }
            T.Each(product.pImages, function(k, v) {
                if (!v || v == 'null') {
                    product.pImages[k] = k?'':product.productImg;
                }
            });
            product.productImg0 = product.pImages[0];
            //product._hotlist = _this.hotlist || [];
            //product._push_list = _this.push_list||[];//关联推送产品
            product.HAS_WEIGHT = false; //重量
            product.HAS_DELIVERY_DAY = true; //货期
            //product.TABS = _this.getTabs(product.productDesc);
            product.ParseInt = parseInt;
            product.options = _this.options||{}; //产品选项
            product.attrs = _this.attrs||{};//默认值
            product._address = CFG_DB.DEF_PCD;
            _this.analysisDesc(product);
            T.Template('product_attrs', product);
            T.Template("product_desc", product);
            if (typeof(callback) == 'function') callback.call(_this);
            _this.SelectAttrs();
        };
        /**
         * 解析产品描述
         * @param {Object} product 产品对象
         * @returns {Object} 产品对象
         */
        _this.analysisDesc = function(product){
            var _this = this;
            var json = "";
            try{
                json = T.JSON.parse(product.productDesc);
            }catch (e){
                json = product.productDesc;
            }
            var productDesc = [];
            if(typeof(json)==="string"){
                product.TABS = _this.getTabs(json);
            }else{
                T.Each(json, function(i, item){
                    if(item.title&&item.content){
                        productDesc.push(item);
                    }
                });
                product.productDesc = productDesc;
            }
        };
        /**
         * 解析老产品详情页签
         * @param productDesc
         * @returns {Array}
         */
        _this.getTabs = function(productDesc){
            productDesc = productDesc||"";
            var tabs = {
                "ininin_detail": "产品详情",
                "ininin_attr": "规格参数",
                "ininin_display": "产品展示",
                "ininin_tech": "工艺&尺寸",
                "ininin_price": "价格&货期",
                "ininin_note": "下单须知",
                "ininin_transport": "物流介绍",
                "ininin_service": "售后服务"
            };
            var _tabs = [];
            T.Each(tabs, function(k, v){
                if(productDesc.indexOf(k)>=0){
                    _tabs.push({
                        key: k,
                        value: v
                    });
                }
            });
            return _tabs;
        };
        //格式化产品参数
        _this.FormatAttrs = function(attrs) {
            var pattr = [];
            T.Each(attrs || _this.attrs, function(k, v) {
                pattr.push(k + ':' + v);
            });
            _this.pattr = pattr.join('_');
        };
        //设置下拉框选项列表
        _this.SetSelectOptions = function(obj, data, value) {
            var option = null,
                val = null,
                atr = $(obj).data("name") || "";
            if (obj && data && data.length) {
                $(obj).closest('.form_item').show();
            } else {
                $(obj).closest('.form_item').hide();
            }
            if (_this.attrs[atr]) delete _this.attrs[atr];
            if (!obj || !data || !data.length) return;
            obj.length = 0;
            for (var i = 0; val = data[i]; i++) {
                option = new Option(val, val);
                if (val === value || (typeof(value) === 'undefined' && i == 0)) {
                    option.selected = 'selected';
                    if (atr) _this.attrs[atr] = val;
                }
                obj.options.add(option);
            }
        };
        _this.SetPrice = function() { //设置价格
            if (_this.status) return;
            var htmls = [];
            var discountPrice = _this.discountPrice || 0;
            var salePrice = _this.salePrice || 0;
            var deliveryDay = _this.deliveryDay || 7;
            var weight = _this.weight || 0;
            if (deliveryDay < 1) deliveryDay = 7;
            if (discountPrice <= 0) discountPrice = salePrice;
            htmls.push('<div class="attr clearfix"><span class="atr">价格：</span><span class="vals">');
            //htmls.push('<span>'+T.RMB(discountPrice)+'</span><span> 元 * '+_this.counter+'款 = </span><b class="yellow">'+T.RMB(discountPrice)+'</b><span> 元</span>');
            htmls.push('<b class="yellow">' + T.RMB(discountPrice) + '</b><span> 元</span>');
            if (discountPrice - salePrice < 0) htmls.push('<i class="gray">' + T.RMB(salePrice) + '元</i>');
            if (_this.pid == 101 || _this.pid == 102 || _this.pid == 103 || _this.pid == 104) htmls.push('<span class="alt">（若选用第三方物流配送，请联系客服咨询运费）</span>');
            htmls.push('</span></div>');
            var html = htmls.join('');
            var dom = T.DOM.byId('product_price_' + _this.pid);
            if (dom) dom.innerHTML = html;
            dom = T.DOM.byId('gift_score_' + _this.pid);
            if (dom) dom.innerHTML = Math.ceil(discountPrice);
            dom = T.DOM.byId('delivery_day_' + _this.pid);
            if (dom) dom.innerHTML = deliveryDay;
            dom = T.DOM.byId('weight_' + _this.pid);
            if (dom) dom.innerHTML = T.RMB(weight);
            return html;
        };
        _this.GetPrice = function() { //获取价格
            if (!_this.pid || !_this.pattr || !_this.counter) return;
            _this.FormatAttrs();
            //计算中逻辑
            var htmls = [];
            htmls.push('<div class="attr clearfix"><span class="atr">价格：</span><span class="vals">');
            //htmls.push('<span>'+T.DOING+'</span><span> 元 * '+_this.counter+'款 = </span><b class="yellow">'+T.DOING+'</b><span> 元</span>');
            htmls.push('<b class="yellow">' + T.DOING + '</b><span> 元</span>');
            //htmls.push('<i class="gray">'+T.DOING+' 元</i>');
            htmls.push('</span></div>');
            var html = htmls.join('');
            var dom = T.DOM.byId('product_price_' + _this.pid);
            if (dom) dom.innerHTML = html;
            dom = T.DOM.byId('gift_score_' + _this.pid);
            if (dom) dom.innerHTML = T.DOING;
            dom = T.DOM.byId('delivery_day_' + _this.pid);
            if (dom) dom.innerHTML = T.DOING;
            dom = T.DOM.byId('weight_' + _this.pid);
            if (dom) dom.innerHTML = T.DOING;
            $("#form_details .submit .doing").remove();
            $("#form_details .submit").append('<span class="doing"><span>计算中...</span></span>');
            _this.status = true;
        };
        _this.Attrs = function($this, type) {
            var $vals = null,
                atr = '',
                val = '';
            if (type == 'select') {
                atr = $.trim($this.data("name") || "");
                val = $.trim($this.val());
            } else if (type == 'text') {
                $vals = $this.closest(".vals");
                $this.addClass("sel").siblings(".val").removeClass("sel");
                atr = $.trim($vals.data("name") || "");
                val = $.trim($this.text());
            } else if (type == 'input') {
                atr = $.trim($this.closest(".input").data("name") || "");
                val = $.trim($this.val());
            }
            if (atr) {
                _this.attrs[atr] = val;
            }
        }
        //获取默认属性
        _this.GetDefaultAttrs = function() {
            $("#form_details .val.sel").each(function(i, el) {
                _this.Attrs($(el), "text")
            });
            $("#form_details select").each(function(i, el) {
                _this.Attrs($(el), "select");
            });
            $("#form_details .textbox[name]").each(function(i, el) {
                _this.Attrs($(el), "input");
            });
            _this.FormatAttrs();
        };
        //选择属性
        _this.SelectAttrs = function() {
            $("#form_details").delegate(".submit", "mousedown", function(e) {
                if ($(this).hasClass("buynow")) {
                    _this.buynow = '1';
                } else {
                    _this.buynow = '0';
                }
            }).delegate(".val", "click", function(e) {
                _this.Attrs($(this), "text");
                if (_this.attrClickCallback) {
                    _this.attrClickCallback.call(_this, $(this));
                }
                _this.FormatAttrs();
                _this.GetPrice();
                return false;
            }).delegate("select", "change", function(e) {
                _this.Attrs($(this), "select");
                if (_this.selectChangeCallback) {
                    _this.selectChangeCallback.call(_this, $(this));
                }
                _this.FormatAttrs();
                _this.GetPrice();
                return false;
            });
        };
        _this.findFlagRelevanceList = function(product){
            if (product.productId) {
                T.GET({
                    action: "in_product_new/product_relevance/find_flag_relevance_list",
                    params: {
                        product_id: product.productId
                    },
                    success: function(data, params) {
                        var productList = [],
                            designList = [];
                        //关联产品
                        T.Each(data.infoList, function(index, v){
                            v.relevanceDesc = v.relevanceDesc || '';
                            v.productName = v.productName || '';
                            v.relevanceDescEllipsis = T.GetEllipsis(v.relevanceDesc, v.productName, 36);
                        });
                        T.Each(data.infoList, function(i, product){
                            if(product.relevanceType==1){
                                productList.push(product);
                            }else if(product.relevanceType==2){
                                designList.push(product);
                            }
                        });
                        _this.data.productList = productList;
                        _this.data.designList = designList;
                        data.flagInfo = data.flagInfo||{};
                        _this.data.flagList = data.flagInfo.flagName?String(data.flagInfo.flagName.replace(/^,|,$/, "").replace(/,+/, ",")).split(","):[]; //标签信息
                        T.Template("recommend_list", _this.data, true);
                        T.Template("label_list", _this.data, true);
                        T.HotSell(null, function(){
                            _this.complete(product, arguments[1]);
                        });
                    },
                    failure: function(data) {
                        T.HotSell(null, function(){
                            _this.complete(product, arguments[1]);
                        });
                    },
                    error: function(data) {
                        T.HotSell(null, function(){
                            _this.complete(product, arguments[1]);
                        });
                    }
                }, function(data) {
                    T.HotSell(null, function(){
                        _this.complete(product, arguments[1]);
                    });
                }, function(data) {
                    T.HotSell(null, function(){
                        _this.complete(product, arguments[1]);
                    });
                });
            }
        };
        _this.complete = function(data, params){
            T.PageLoaded();

            //生成静态页
            T.GenerateStaticPage({
                domain: _this.params.w, //域名
                dirname: 'product', //目录名
                pageid: data.productId, //文件名（页面名）
                keywords: {
                    "title": data.productName,
                    "keywords": data.productName,
                    "description": data.simpleDesc
                },
                callback: function(domain, path, pageid, keywords) { //生成成功回调函数
                    T.ShowLinks();
                }
            });
        };
        //加载产品
        _this.Loader = function(productId, callback) {
            if(!productId){
                var local = location.href;
                var idx = local.indexOf(".html");
                if(idx>0){
                    local = local.substring(0, idx);
                }
                idx = local.lastIndexOf("/");
                if(idx>0){
                    productId = local.substring(idx).replace(/\D/g, "");
                }
            }
            if(!productId)return;
            T.GET({
                action: 'in_product_new/query_product',
                params: {
                    product_id: productId
                },
                success: function(data) {
                    _this.Init(data, callback);
                    _this.findFlagRelevanceList(data);
                },
                failure: function(data) {
                    T.ShowLinks();
                    /*T.alt(data.msg || '没有该商品。', function(_o) {
                        _o.remove();
                        window.location = T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : '');
                    }, function(_o) {
                        _o.remove();
                        window.location = T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : '');
                    }, '返回首页');*/
                }
            });
        };
        return _this;
    };
    var productDetail = new ProductDetailCustom(ProductDetail);
    T.Loader(function () {
        productDetail.Loader(productDetail.productId, productDetail.init);
    });
});