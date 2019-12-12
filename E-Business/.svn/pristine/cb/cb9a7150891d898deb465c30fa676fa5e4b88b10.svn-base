var _modules = ["base", "tools", "location", "widgets/zoomer"], _href = location.href, _productId = _href.slice(_href.indexOf("/product/"), _href.indexOf(".html")).replace("/product/", '');
_modules.push("portal/" + _productId);
require(_modules, function ($, T, PCD, ImageZoom, ProductDetailCustom) {
    //安装类产品ID 1000 开始
    //打样类产品ID 2000 开始
    //父类中方法名一律使用大驼峰
    var _ImageZoom = null, ProductDetail = function () {
        var _this = this;
        _this.uuid = T.UUID();
        _this.params = T.getRequest();//URL参数
        _this.hashAttr = location.hash.replace(/^#/, "") || ""; //产品属性参数
        try{
            _this.hashAttr = decodeURIComponent(_this.hashAttr);
        }catch(e){}
        _this.data = {};//产品数据
        _this.attrs = {};//已选择产品参数对象
        _this.status = false;//拉取价格状态（是否拉取成功）
        _this.discountPrice = '';//折扣价
        _this.salePrice = '';//售价
        _this.deliveryDay = '';//货期
        _this.defDeliveryDay = 8;//默认货期
        _this.deliveryDayAlt = '生产周期是指从投入生产到生产完成的时间，货物生产完成并发出后仍需1-3天的配送时间，您即可收到。';//货期提示
        _this.proJointAlt = '拼接是指超过喷绘材料的边界值时，由于无法喷绘，此时采取喷绘多张，用胶水粘在一起，以此来达到该目的。拼接不额外收费，不影响正常使用。';
        _this.weight = '';//重量
        _this.counter = 1;//款数
        _this.cid = '';//分类ID
        _this.pid = '';//产品ID
        _this.pattr = '';//已选产品参数
        _this.productImg0 = ''; //产品图列表中第一幅图
        //_this.contentOffset = null;
        _this.uploaded = '0';//是否已上传文件
        _this.buynow = '';//是否为立即购买
        _this.quantity = '';//设置固定数量
        _this.quantity_unit = '';//数量单位
        _this.SHOW_PRICE = 0;//价格显示方式
        _this.HAS_WEIGHT = false;//重量
        _this.HAS_DELIVERY_DAY = true;//货期
        _this.HAS_AVG_PRICE = false;//是否计算平均价
        _this.AVG_KEEP_FIGURES = 4;//平均价保留小数位数
        //属性名匹配字符串
        _this.baseInfoName = "";
        //必须的属性
        _this.required = {
            selects: []//必选属性
            , inputs: []//必填属性
        };
        //表单配置
        _this.formCfg = {
            action: 'in_order/cart_add',
            prevent: true,
            items: {}
        };
        //默认属性
        _this.attrs = {};
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
        _this.Init = function (product, callback) {debugger
            _this.cid = product.categoryId;
            _this.pid = product.productId;
            _this.pname = product.productName;
            _this.productName = product.productName.replace(/\//g, "-");
            //设置默认值
            if(_this.hashAttr&&_this.baseInfoName){
                var atrs = _this.baseInfoName.replace(/-/, "_").split("_");
                var vals = _this.hashAttr.replace(/-/, "_").split("_");
                T.Each(atrs, function(i, atr){
                    var val  = vals[i];
                    if(T.Array.indexOf(_this.options[atr], val)>=0){
                        _this.attrs[atr] = val;
                    }else if(val&&atr=="数量"){
                        _this.attrs[atr] = val;
                    }
                });
            }

            product.deliveryDayAlt = _this.deliveryDayAlt||'';
            if (!product.pImages) {
                product.pImages = product.productImg||null;
            }
            if (T.Typeof(product.pImages, /String/)) {
                product.pImages = product.pImages.split(',');
            }else{
                product.pImages = [];
            }
            T.Each(product.pImages, function (k, v) {
                if (!v || v == 'null') {
                    product.pImages[k] = k?'':product.productImg;
                }
            });
            _this.productImg0 = product.productImg0 = product.pImages[0];
            //product._hotlist = _this.hotlist||[];
            //product._push_list = _this.push_list||[];//关联推送产品
            product.HAS_WEIGHT = _this.HAS_WEIGHT;//重量
            product.HAS_DELIVERY_DAY = _this.HAS_DELIVERY_DAY;//货期
            product.ParseInt = parseInt;
            product.options = _this.options||{}; //产品选项
            product.attrs = _this.attrs||{};//默认值
            product._address = product._address||T.cookie("_address")||CFG_DB.DEF_PCD; //配送地址
            _this.analysisDesc(product);
            debugger;
            T.Template('product_attrs', product);
            T.Template("product_desc", product);
            //配送地址
            $("#delivery_address").geoLocation({
                level: 3,
                callback: function (value, province, city, district) {
                    console.log('delivery_address==>callback: ' + value + '');
                    $("#delivery_region").geoLocation("setValue", value);
                }
            });
            /*var dom = T.DOM.byId('data_product_desc');
            if (dom)dom.innerHTML = product.productDesc || '';*/
            _ImageZoom = new ImageZoom({
                uuid: T.UUID(),
                trigger: T.DOM.byId('proimg'),
                pname: product.productName || '',
                imguri: product.productImg || ''
            });
            _this.BindEvents();
            if (typeof(callback) == 'function')callback.call(_this);
            _this.AutoHeight();
            _this.SelectAttrs();
            T.TIP({
                container: '#form_details',
                trigger: '.icon_help',
                content: function(trigger) {
                    return $(trigger).data("text")||"";
                },
                'max-width': '360px',
                width: 'auto',
                offsetX: 0,
                offsetY: 0
            });
            T.TIP({container:'#form_details', trigger:'.pro_joint .lnk', content: function(trigger){
                return _this.proJointAlt;
            }, width:'360px', offsetX: 390, offsetY: -80});
            T.TIP({container:'#form_details', trigger:'.delivery_date .lnk', content: function(trigger){
                return _this.deliveryDayAlt;
            }, 'max-width': '285px', width:'auto', offsetX: 0, offsetY: 0});
            $("#product_attr_imguri_def").click();//设置默认产品属性图片
            //绑定QQ客服
            T.BindQQService();
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
         * 获取内容各区块的offset.top值
         */
        _this.getContentOffset = function(){
            var _this = this;
            var anchors = [], tops=[];
            var $productDesc = $("#template_product_desc_view");
            var li = $('.desctab li', $productDesc);
            if (li.data('target')) {//老的产品
                li.each(function(i, el){
                    var anchor = $(el).data("target");
                    anchors.push(anchor);
                    tops.push(Math.floor($('.pshow [alt$="'+anchor+'"]', $productDesc).offset().top));
                })
            }else{//新产品
                li.each(function(i, el){
                    var anchor = $(el).data("index");
                    anchors.push(anchor);
                    tops.push(Math.floor($('.p_contents [data-index="'+anchor+'"]', $productDesc).offset().top));
                })
            }
            //return _this.contentOffset = {anchors: anchors, tops: tops};
            return {anchors: anchors, tops: tops};
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
        /**
         * 页签被选中，当点击或者滚动时
         */
        _this.focusTabs = function(){
            var $productDesc = $("#template_product_desc_view");
            var li = $('.desctab li', $productDesc);
            if (!li.length) {return;}
            var offset = _this.getContentOffset();
            var scroll_h = $(window).scrollTop() + $("#header_fixed").outerHeight() + li.closest('.desctab').outerHeight()+9;
            var tops = offset.tops;
            //console.log(scroll_h);
            if (scroll_h < tops[0]) {
                li.eq(0).addClass("sel").siblings("li").removeClass("sel");
            }else if (scroll_h >= tops[tops.length-1]) {
                li.eq([tops.length-1]).addClass("sel").siblings("li").removeClass("sel");
            }else{
                for (var i = 0; i < tops.length -1; i++) {
                    if(tops[i] <= scroll_h && scroll_h < tops[i+1]){
                        li.eq([i]).addClass("sel").siblings("li").removeClass("sel");
                        break;
                    }
                }
            }
        };
        _this.Decimal = function (num, options) {
            num = (num + '').replace(/[^0-9.]/g, '');
            num = parseFloat(num);
            num = isNaN(num)?'':num;
            var arr = ('' + num).split('');
            var idx = 0;
            for (var i = 0; i < arr.length; i++) {
                if (idx > 2) {
                    arr[i] = '';
                }
                if (arr[i] == '.' || idx) {
                    idx++;
                }
            }
            var val = parseFloat(arr.join(''));
            if(options){
                val = Math.max(options.min, Math.min(options.max, val));
            }
            return  isNaN(val)?'':val;
        };
        //格式化产品参数
        _this.FormatAttrs = function (attrs) {
            var pattr = [];
            if(_this.baseInfoName){
                attrs = attrs||_this.attrs;
                var atrs = _this.baseInfoName.replace(/-/, "_-_").split("_");
                T.Each(atrs, function (k, v) {
                    if (v != ""){
                        pattr.push(_this.FormatValue(attrs[v]||v));
                    }
                });
                _this.pattr = pattr.join('_').replace(/_-_/, '-');
                /*T.Each(attrs || _this.attrs, function (k, v) {
                 if (v !== '')pattr.push(_this.FormatValue(v));
                 });
                 _this.pattr = pattr.join('_').replace(/_-_/, '-');*/
            }else{
                T.Each(attrs || _this.attrs, function (k, v) {
                    if (v !== '')pattr.push(_this.FormatValue(k) + ':' + _this.FormatValue(v));
                });
                _this.pattr = pattr.join('_');
            }
        };
        //设置下拉框选项列表
        _this.SetSelectOptions = function (obj, data, value) {
            var option = null, val = null, atr = $(obj).data("name") || "";
            if (obj && data && data.length) {
                $(obj).closest('.form_item').show();
            } else {
                $(obj).closest('.form_item').hide();
            }
            if (_this.attrs[atr])delete _this.attrs[atr];
            if (!obj || !data || !data.length)return;
            obj.length = 0;
            for (var i = 0; val = data[i]; i++) {
                option = new Option(val, val);
                if (val === value || (typeof(value) === 'undefined' && i == 0)) {
                    option.selected = 'selected';
                    if (atr)_this.attrs[atr] = val;
                }
                obj.options.add(option);
            }
        };
        _this.SetPrice = function () {//设置价格
            if (_this.status)return;
            var htmls = [];
            var discountPrice = _this.discountPrice || 0;
            var salePrice = _this.salePrice || 0;
            var deliveryDay = _this.deliveryDay || _this.defDeliveryDay;
            var weight = _this.weight || 0;
            if (deliveryDay < 1)deliveryDay = 8;
            if (discountPrice <= 0)discountPrice = salePrice;
            htmls.push('<div class="attr clearfix"><span class="atr">价格：</span><span class="vals">');
            if(_this.SHOW_PRICE==1){
                htmls.push('<span>'+T.RMB(discountPrice/_this.counter)+'</span><span>元 * '+_this.counter + _this.quantity_unit+' = </span><b class="yellow">'+T.RMB(discountPrice)+'</b><span> 元</span>');
            }else{
                htmls.push('<b class="yellow">' + T.RMB(discountPrice) + '</b><span> 元</span>');
            }
            if (discountPrice - salePrice < 0)htmls.push('<i class="gray">' + T.RMB(salePrice) + '元</i>');
            //平均价
            if(_this.HAS_AVG_PRICE){
                var _num = Math.pow(10, _this.AVG_KEEP_FIGURES);
                var avgPrice = Math.round(discountPrice*_num/parseInt(_this.attrs['数量'], 10))/_num;
                htmls.push('，<span>平均</span> <b class="yellow">' + avgPrice + '</b> <span>元/'+_this.quantity_unit+'</span>');
            }
            if (_this.pid == 101 || _this.pid == 102 || _this.pid == 103 || _this.pid == 104)htmls.push('<span class="alt">（若选用第三方物流配送，请联系客服咨询运费）</span>');
            htmls.push('</span></div>');
            var html = htmls.join('');
            var dom = T.DOM.byId('product_price_' + _this.pid);
            if (dom)dom.innerHTML = html;
            dom = T.DOM.byId('gift_score_' + _this.pid);
            if (dom)dom.innerHTML = Math.ceil(discountPrice);
            dom = T.DOM.byId('delivery_day_' + _this.pid);
            if (dom)dom.innerHTML = deliveryDay;
            dom = T.DOM.byId('delivery_date_' + _this.pid);
            if (dom)dom.innerHTML = T.DeliveryDate('',deliveryDay, 1);
            dom = T.DOM.byId('weight_' + _this.pid);
            if (dom)dom.innerHTML = T.RMB(weight);
            return html;
        };
        _this.GetPrice = function () {//获取价格
            if (!_this.pid || !_this.pattr || !_this.counter)return;
            _this.FormatAttrs();
            var attrs = [{
                productId: _this.pid,
                productParam: _this.pattr,
                productCount: (_this.counter || 1),
                address: (_this.address||CFG_DB.DEF_PCD).replace(/\^+$/g, "")
            }];
            var _pattr = T.JSON.stringify(attrs);
            if(_this._pattr==_pattr){
                return;
            }
            _this._pattr = _pattr;
            //计算中逻辑
            var htmls = [];
            htmls.push('<div class="attr clearfix"><span class="atr">价格：</span><span class="vals">');
            //htmls.push('<span>'+T.DOING+'</span><span> 元 * '+_this.counter+'款 = </span><b class="yellow">'+T.DOING+'</b><span> 元</span>');
            htmls.push('<b class="yellow">' + T.DOING + '</b><span> 元</span>');
            //htmls.push('<i class="gray">'+T.DOING+' 元</i>');
            htmls.push('</span></div>');
            var html = htmls.join('');
            var dom = T.DOM.byId('product_price_' + _this.pid);
            if (dom)dom.innerHTML = html;
            dom = T.DOM.byId('gift_score_' + _this.pid);
            if (dom)dom.innerHTML = T.DOING;
            dom = T.DOM.byId('delivery_day_' + _this.pid);
            if (dom)dom.innerHTML = T.DOING;
            dom = T.DOM.byId('delivery_date_' + _this.pid);
            if (dom)dom.innerHTML = T.DOING;
            dom = T.DOM.byId('weight_' + _this.pid);
            if (dom)dom.innerHTML = T.DOING;
            $("#form_details .submit .doing").remove();
            $("#form_details .submit").append('<span class="doing"><span>计算中...</span></span>');
            _this.status = true;
            T.POST({
                action: CFG_DS.product.get_price,
                params: {
                    type: '0',
                    data: attrs
                },
                success: function (data) {
                    if (data.data && data.data[0]) {
                        $("#form_details .submit .doing").remove();
                        location.hash = encodeURIComponent(_this.pattr);
                        _this.status = false;
                        _this.discountPrice = data.data[0].discountPrice;
                        _this.salePrice = data.data[0].price;
                        _this.deliveryDay = data.data[0].deliveryDay;
                        if (_this.pid == 200006 || _this.pid == 200007) {
                            _this.deliveryDay = 1;
                        }
                        _this.weight = data.data[0].valuationValue;
                        _this.SetPrice();
                    }
                }
            });
        };
        _this.Attrs = function ($this, type) {
            var $vals = null, atr = '', val = '';
            if (type == 'select') {
                atr = $.trim($this.data("name") || "");
                val = $.trim($this.val());
            } else if (type == 'text') {
                $vals = $this.closest(".vals");
                $this.addClass("sel").siblings(".val").removeClass("sel");
                atr = $.trim($vals.data("name") || "");
                val = $.trim($this.text());
            } else if (type == 'input') {
                atr = $.trim($this.data("name") || "");
                $("input[name]", $this).each(function (i, el) {
                    if($(el).val()!==""){
                        val += $.trim($(el).val()) + ($(el).data("unit") || "");
                    }
                });
            }
            if (atr == "折页方式"){
                _this.attrs[atr] = val.replace(/（.+）$/, '');
            }else if(atr) {
                _this.attrs[atr] = val;
            }
        };
        //获取默认属性
        _this.GetDefaultAttrs = function () {
            $("#form_details .val.sel").each(function (i, el) {
                _this.Attrs($(el), "text");
            });
            $("#form_details :not(.input) select").each(function (i, el) {
                _this.Attrs($(el), "select");
            });
            $("#form_details .input").each(function (i, el) {
                _this.Attrs($(el), "input");
            });
            _this.FormatAttrs();
        };
        //选择属性
        _this.SelectAttrs = function () {
            $("#form_details").delegate(".submit", "mousedown.submit", function (e) {
                if ($(this).hasClass("buynow")) {
                    _this.buynow = '1';
                } else {
                    _this.buynow = '0';
                }
            }).delegate(".val", "click.val", function (e) {
                var $this = $(this);
                if ($this.hasClass('no_allowed')) {
                    return false;
                };
                _this.Attrs($this, "text");
                //属性图片展示 <a id="product_attr_imguri_def" class="val sel" href="javascript:;" data-imguri="<?=IMAGES?>design/100.png">中文</a>
                //id：默认产品属性图片的ID
                //imguri：产品属性图片路径
                var imguri = $this.data("imguri")||"";
                if(imguri){
                    if (_this.getAttrImguri) {
                        imguri = _this.getAttrImguri.call(_this, $this, imguri) || imguri;
                    }
                    var $img = $("#proimg img");
                    $img.attr("src", imguri);
                    $img.data('imguri', imguri);
                    _ImageZoom.load(imguri);
                }
                var obj = {
                    isValidPass: 1 //是否通过验证
                };
                if (_this.attrClickCallback) {
                    _this.attrClickCallback.call(_this, $this, obj);
                }
                if(obj.isValidPass){
                    _this.FormatAttrs();
                    _this.GetPrice();
                }
                return false;
            }).delegate(":not(.input) select", "change.select", function (e) {
                var $this = $(this);
                _this.Attrs($this, "select");
                if (_this.selectChangeCallback) {
                    _this.selectChangeCallback.call(_this, $this);
                }
                _this.FormatAttrs();
                _this.GetPrice();
                return false;
            });
        };
        //格式化输入内容，去除特殊字符
        _this.FormatValue = function(value){
            return (value+"").replace(/[:_'"]+/g, "");
        };
        /**
         * 设置产品属性
         * @param {String} attr 属性名
         * @param {String} value 属性值
         * @param {String} [required] 是否必填，默认否
         * @returns {Boolean}
         * @constructor
         */
        _this.SetAttr = function(attr, value, required){
            value = _this.FormatValue(value);
            if(value!==""){
                _this.attrs[attr] = value;
            }else if(required){
                T.msg("请填写"+attr);
                return true;
            }
        };
        //初始化表单
        _this.BindForm = function (options) {
            options = options||{};
            _this.formCfg.items = _this.formItems||_this.formCfg.items;
            T.FORM('form_details', _this.formCfg, {
                before: function () {
                    var _form = this;
                    _form.action = _this.formCfg.action;
                    if (!T._LOGED) {
                        T.LoginForm(0, function(){
                            _form.submit();
                        });
                        _form.action = '';
                        return;
                    }
                    if(options.before){
                        if(!options.before.call(_this, _form)){
                            _form.action = '';
                            return;
                        }
                    }
                    T.Each(_this.required.selects, function (k, v) {
                        if (typeof(_this.attrs[v]) == 'undefined' || _this.attrs[v] === '') {
                            _form.action = '';
                            T.msg('请选择' + v);
                            return;
                        }
                    });
                    T.Each(_this.required.inputs, function (k, v) {
                        if (typeof(_this.attrs[v]) == 'undefined' || _this.attrs[v] === '') {
                            _form.action = '';
                            T.msg('请填写' + v);
                            return;
                        }
                    });
                    _form.params = {};
                    //得到数量
                    var quantity = '', unit = '';
                    if(_this.quantity){ //如果设置了固定数量，则使用固定数量
                        quantity = _this.quantity;
                    }else{//获取产品属性中的数量
                        T.Each(_this.attrs, function(k, v){
                            if(/^数量/.test(k)||/数量$/.test(k)){//设置以数量开头或以数量结尾的属性为购买数量
                                if(/^\d+$/.test(v)){//如果是没有单位的数量
                                    unit = k.replace(/^.*（|）$/g, '').replace('数量', '');
                                    quantity = v + unit;
                                }else{
                                    quantity = v;
                                }
                                return false;
                            }
                        });
                        if(!quantity){//如果数量值为空
                            T.msg("请选择购买数量！");
                            _this.action = '';
                            return;
                        }
                    }
                    var params = [];
                    _this.FormatAttrs(); //格式化参数
                    for(var i=0; i<_this.counter; i++){
                        params.push({
                            pnum: 1,
                            quantity: quantity,
                            cid: _this.cid,
                            pid: _this.pid,
                            pattr: _this.pattr,
                            pname: _this.pname,
                            uploaded: _this.uploaded,
                            buynow: _this.buynow||'0',
                            address: (T.cookie("_address")||CFG_DB.DEF_PCD).replace(/\^+$/g, "")
                        });
                    }
                    _form.params.buynow = _this.buynow||'0';
                    _form.params.data = params;
                    if ($("#form_details .input").length != $("#form_details .input.done").length) {
                        _form.action = '';
                        T.alt('您还有属性未经确认，请点击ok确认后再提交？');
                        /*T.cfm('您还有属性未经确认，请点击ok确认后在提交？', function(_o){
                         _o.remove();
                         _form.action = _this.formCfg.action;
                         _form.submit();
                         }, function(_o){
                         _o.remove();
                         }, '温馨提示','继续提交','稍后再说');*/
                    }
                }, success: function (data, params) {
                    if (params.buynow == 1) {
                        window.location = T.DOMAIN.CART + "ordering.html?a=" + T.Params.encode(T.Base64.encode(T.Params.encode(data.date + ","+ T.RMB(_this.salePrice))));
                    } else {
                        /*T.suc({ text: "加入购物车成功。", title: '加入购物车成功', ok: '继续订购', no: '去购物车结算' }, function (_this) {
                            _this.remove();
                        }, function (_this) {
                            _this.remove();
                            window.location.href = T.DOMAIN.CART +'index.html'+ (T.INININ ? '?' + T.INININ : '');
                        }, function (_this) {
                            _this.remove();
                        });
                        T.Cart.reload();*/
                        _this.throwLine($('#form_details .addcart'), $('#car_number'), _this.productImg0, 15, -80);
                    }
                }
            });
        };
        //绑定事件
        _this.BindEvents = function () {
            var _this = this;
            //输入框发生改变
            var changeInput = function($this){
                var $cont = $this.closest(".input");
                var $inputs = $("input[name], select[name]", $cont);
                var valNum = 0;
                $inputs.each(function(i, el){
                    var $input = $(el);
                    var _prefix = $input.data("prefix")||""; //前缀
                    if ($input.data("value") == _prefix+""+$input.val()) {
                        valNum++;
                    }
                });
                if ($inputs.length==valNum) {
                    $cont.addClass("done");
                } else {
                    $cont.removeClass("done");
                }
            }
            $("#form_details .input input").bind(T.EVENTS.input, function (e) {
                changeInput($(this));
            });
            $("#form_details .input select").bind("change", function (e) {
                changeInput($(this));
            });
            $("#delivery_address").on("valueChange.location", function(e, data){
                data = data||{};
                _this.address = data.value||CFG_DB.DEF_PCD;
            });
            //产品图片切换
            $("#imglist").delegate("li", "mouseenter", function () {
                var src = $(this).data('imguri') || "";
                var $img = $("#proimg img");
                $img.attr("src", src);
                $img.data('imguri', src);
                _ImageZoom.load(src);
            });
            $(".recommend").on("mouseenter", ".desctab li[data-idx]", function(e){
                var $this = $(this),
                    $recommend = $this.closest(".recommend"),
                    idx = $this.data("idx");
                $this.addClass("sel").siblings("li[data-idx]").removeClass("sel");
                $(".tabdetail[data-idx='"+idx+"']", $recommend).show().siblings(".tabdetail[data-idx]").hide();
            });
            var $productDesc = $("#template_product_desc_view");
            var $hotSell = $("#template-hot_sell-view");
            //滚动条滚动时
            $(window).bind("scroll.pdesc resize.pdesc", function (e) {
                if (!$productDesc.length)return;
                var _top = $(window).scrollTop();
                var _top2 = $productDesc.offset().top;
                var _top3 = $("#header_fixed").outerHeight();
                if ((_top + _top3) > _top2) {
                    $productDesc.addClass("pfixed");
                    $(".ptabs", $productDesc).css({top: _top3 - 1});
                } else {
                    $productDesc.removeClass("pfixed");
                }
                /*var _top4 = $("#product_fixed_pos").offset().top;
                 if((_top+_top3)>_top4){
                 $("#product_fixed").addClass("fixed").css({top:_top3});
                 }else{
                 $("#product_fixed").removeClass("fixed");
                 }*/
                var winTop = _top + $(window).height();
                var _top4 = $hotSell.offset().top + $hotSell.outerHeight();
                var _top5 = $("#footer").offset().top;
                if (_top5 < winTop) {
                    $("ul", $hotSell).addClass("fixed").css({bottom: winTop - _top5 + 30});
                } else if (_top4 < winTop) {
                    $("ul", $hotSell).addClass("fixed").css({bottom: 20});
                } else {
                    $("ul", $hotSell).removeClass("fixed");
                }
                //页签被选中
                _this.focusTabs();
            });
            //产品信息切换
            $productDesc.on("click", ".ptabs li", function (e) {
                var key = $(this).data('index') || $(this).data("target");//新产品 or 老产品
                var index = $(this).index();
                var _top = $("#header_fixed").outerHeight() + $(this).closest(".ptabs").outerHeight();
                var offset = _this.getContentOffset();
                $("html, body").stop(true, true).animate({
                    scrollTop: offset.tops[index] - _top
                }, 400);
            });
        };
        //右侧条高度自适应
        _this.AutoHeight = function () {
            var h = $("#dpanel").height();
            $("#prolist li").css("padding", Math.floor((h - 110 * 3) / 6) + 'px 0');
            //$("#imglist").css("padding-top",(h-$("#proimg").outerHeight()-60)/2);
        };
        //加载产品
        _this.Loader = function (productId, callback) {
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
                action: 'in_product_new/query_product', params: {product_id: productId}, success: function (data) {
                    _this.Init(data, callback);
                    T.PageLoaded();
                }, failure: function (data) {
                    T.alt("没有找到对应商品，该商品已下架或不存在，请选购其他商品", function (_o) {
                        _o.remove();
                        window.location = T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : '');
                    }, function (_o) {
                        _o.remove();
                        window.location = T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : '');
                    }, '返回首页');
                }
            });
            _this.findFlagRelevanceList({productId: productId});
            T.HotSell();
        };
        /**
         * 加入购物车的抛物线效果
         * @param start $dom 起点元素
         * @param end $dom 终点元素
         * @param speed {Number} 速度
         * @param offset {Number} 抛物线对称轴偏离终点的位移，eg: -40 表示对称轴在终点的左侧40像素的处
         * @param data 传给抛物线的商品数据
         */
        _this.throwLine = function(start, end, data, speed, offset){
            var imgSrc = data + '?imageMogr2/thumbnail/!32x32r/auto-orient/gravity/Center/crop/32x32'
            var scroll_h = $(window).scrollTop();
            var x1 = start.offset().left + start.outerWidth() /2;
            var y1 = -start.offset().top;
            var x2 = end.offset().left + end.outerWidth() /2;
            var y2 = -end.offset().top;
            var a = offset||-40; //对称轴相对end元素偏移px量  (对称轴横坐标=x2+a)
            var speed = speed||10; //单位时间内运动px值
            var b = (y1-y2) / ((x1-x2) * (x1-x2-2*a));
            var c = y1 - b*(x1-x2-a)*(x1-x2-a);
            //抛物线线方程：y = b(x-m)*(x-m) + c
            var x = x1, y;//(x, y)小球的实时坐标
            var ball = $('<span class="throwpro" style="display:inline-block;position:fixed;left:'+
                x1+'px;top:'+(-y1-scroll_h)+'px;width:32px;height:32px;border:2px solid #0487e2;z-index:999"><img src="'+imgSrc+'"></span>').appendTo($('body'));
            var timer = setInterval(function(){
                if (speed >6 && x2-x < speed) {//防止speed过大跨过购物车
                    speed = 2;
                }
                x += speed;
                y = b*(x-x2-a)*(x-x2-a)+c;
                ball.css({'left': x, 'top': -y-scroll_h});
                if (x >= x2) {
                    clearInterval(timer);
                    ball.animate({opacity: 0}, 600, function(){
                        ball.remove();
                    });
                    T.Cart.reload();
                }
            }, 25);
        },
        //设置计数器
        _this.setCounter = function($dom, options, callback){
            options = options||{min:1, max:1000};
            options.step = options.step||1;
            $dom.delegate(".counter a, .counter b", "selectstart.counter", function() {
                return false;
            }).delegate(".counter a", "click.counter", function(e) { //减数量
                var $minus = $(this);
                var $input = $minus.siblings("input");
                var val = parseInt($input.val(), 10);
                if (val > options.min) {
                    val-=options.step;
                    val = Math.max(val, options.min);
                    $input.val(val);
                }
                if(callback)callback($input, val);
                return false;
            }).delegate(".counter b", "click.counter", function(e) { //加数量
                var $plus = $(this);
                var $input = $plus.siblings("input");
                var val = parseInt($input.val(), 10);
                if (val < options.max) {
                    val+=options.step;
                    val = Math.min(val, options.max);
                    $input.val(val);
                }
                if(callback)callback($input, val);
                return false;
            }).delegate(".counter input", "blur.counter", function(e) { //输入数字
                var $input = $(this);
                var val = $input.val();
                if (isNaN(val)) {
                    val = 1;
                }
                val = parseInt(val, 10) || 1;
                if (val > options.max) {
                    val = options.max;
                }
                if (val < 1) {
                    val = 1;
                }
                val = Math.max(val, options.min);
                val = Math.min(val, options.max);
                $input.val(val);
                if(callback)callback($input, val);
                return false;
            }).delegate(".counter input", "keydown.counter", function(e) {
                var $input = $(this);
                if ($.trim($input.val()) && e.keyCode == 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    $input.blur();
                }
            }).delegate(".counter input", "keyup.counter afterpaste.counter", function (e) {
                var $input = $(this);
                $input.val($input.val().replace(/\D\./g, ''));
            }).delegate(".counter input", "focus.counter", function (e) {
                $(this).trigger("blur.counter");
            });
        };
        //限定输入框只能输入数字并绑定回车确认
        _this.SetNumberInput = function($dom, options){
            options = options||{};
            $dom = $($dom);
            options.input = options.input||".textbox"; //输入框
            options.okbtn = options.okbtn||".btn"; //确认按钮
            $dom.delegate(options.input, "keypress.number", function (e) { //键盘按下
                var $input = $(this);
                var keyCode = e.keyCode || e.which || e.charCode;//keyCode>=48 && keyCode<=57
                if (keyCode == 13) {
                    $input.siblings(options.okbtn).click();
                    return false;
                } else if ((keyCode < 48 || keyCode > 57) && keyCode != 8 && keyCode != 46 && keyCode != 37 && keyCode != 38 && keyCode != 39 && keyCode != 40){
                    return false;
                }
            }).delegate(options.input, "keyup.number afterpaste.number", function (e) { //粘贴时过滤掉非数字字符
                var $input = $(this);
                var name = $input.attr("name")||"";
                var option = options[name]||{};
                $input.val($input.val().replace(option.reg||/[^0-9.]/g, ''));
            }).delegate(options.input, "blur.number", function (e) { //失焦
                var $input = $(this);
                $input.val(_this.Decimal($input.val()));
            }).delegate(options.okbtn, "click.number", function (e) { //确认事件
                var $input = $(options.input, $dom);
                _validNumberInput($input, options);
            });
        };
        //验证输入框数字
        function _validNumberInput($inputs, _options){
            var $cont = $inputs.closest(".input"); //输入框容器
            var attr = $cont.data("name"); //输入产品的属性名
            var vals = [];
            $inputs.each(function(i, el){
                var $input = $(el);
                var name = $input.attr("name")||"";
                var options = _options[name]||{};
                var _prefix = $input.data("prefix")||""; //前缀
                var _unit = $input.data("unit"); //单位
                var _val = parseFloat($input.val()); //输入的数值
                var val = _val; //是否为提交时验证
                if(options.valid){ //自定义验证
                    options.valid(options, $input, vals, attr, val, _unit);
                }else if(options.mode==1){ //前开后开：大于等于最小值，且小于等于最大值
                    if (val >= options.min && val <= options.max && attr) {
                        vals.push(val + (_unit || ""));
                        $input.data("value", _prefix+""+val);
                    } else if(val==="") { //未输入
                        if(options.noInput)options.noInput($input, val);
                    } else if (val < options.min) { //小于等于最小值
                        if(options.lessThanMin)options.lessThanMin($input, val);
                    } else if (val > options.max) { //大于最大值
                        if(options.moreThan)options.moreThan($input, val);
                    } else { //未输入
                        if(options.noInput)options.noInput($input, val);
                    }
                }else{ //前闭后开：大于最小值，且小于等于最大值
                    if (val > options.min && val <= options.max && attr) {
                        vals.push(val + (_unit || ""));
                        $input.data("value", _prefix+""+val);
                    } else if(val==="") { //未输入
                        if(options.noInput)options.noInput($input, val);
                    } else if (val <= options.min) { //小于等于最小值
                        if(options.lessThanMin)options.lessThanMin($input, val);
                    } else if (val > options.max) { //大于最大值
                        if(options.moreThan)options.moreThan($input, val);
                    } else { //未输入
                        if(options.noInput)options.noInput($input, val);
                    }
                }
                /*var _value = _this.Decimal($input.val(), options)||$input.data("value");
                 if(_value!==""&&_value!=null){
                 $input.val(_value);
                 }*/
            });
            //输入框全部有值，则拉取价格
            if(vals.length==$inputs.length){
                var value = "";
                T.Each(vals, function(k, v){
                    value += v;
                });
                _this.attrs[attr] = value;
                $cont.addClass("done");
                _this.GetPrice(); //拉取价格
                return true;
            }
        }
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
                    },
                    failure: function(data) {},
                    error: function(data) {}
                }, function(data) {}, function(data) {});
            }
        };
        return _this;
    };
    var productDetail = new ProductDetailCustom(ProductDetail);
    T.Loader(function () {
        productDetail.Loader(productDetail.productId, productDetail.init);
    });
});