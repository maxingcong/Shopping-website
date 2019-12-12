require(["base", "tools"], function ($, T) {
    var DesignEditor, Uploader, Previewer, HistoryOrder, MyTemplate, Comment, Receive;
    var deferModules = ["modules/design_editor", "uploader", "widgets/previewer", "modules/order_history", "modules/my_template", "modules/product_comment", "modules/receive_goods", "modules/quotation"];

    /*
     订单状态：
     0=待支付（提交订单）
     1=已支付（包括货到付款）同时改变商品状态（待审核）
     2=订单已取消
     3=交易完成
     订单商品状态：
     0=待审核(订单支付成功之后)
     1=审核不通过
     2=审核通过
     3=生产中
     4=配送中(已发货)
     5=已送达(已签收)
     6=已退款
     10=待上传
     11=已上传
     12=设计中
     15=待发货(生产完)
     20=待售后处理
     25=待重印
     */
    /*var logistics = {
     'EMS':'ems'
     ,'中国邮政':'ems'
     ,'申通快递':'shentong'
     ,'圆通速递':'yuantong'
     ,'顺丰速运':'shunfeng'
     ,'天天快递':'tiantian'
     ,'韵达快递':'yunda'
     ,'中通速递':'zhongtong'
     ,'龙邦物流':'longbanwuliu'
     ,'宅急送':'zhaijisong'
     ,'全一快递':'quanyikuaidi'
     ,'汇通速递':'huitongkuaidi'
     ,'民航快递':'minghangkuaidi'
     ,'亚风速递':'yafengsudi'
     ,'快捷速递':'kuaijiesudi'
     ,'华宇物流':'tiandihuayu'
     ,'中铁快运':'zhongtiewuliu'
     };*/
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    var isUploading = false;
    var odetail = {
        UUID: T.UUID(),
        params: T.getRequest(),
        mappop: null,
        logistics_pop: null,
        logistics_infos: [],
        IsInstallService: 0, //是否为安装服务
        init: function (data) {
            if (odetail.params.s == 1 || odetail.params.t == 20) {
                $("#menu").remove();
                $("#head_searchbar").remove();
                $("#order_step").show();
            }
            if (odetail.params.o) {
                odetail.reload(function () {
                    require(deferModules);
                });
                $("#odetail").delegate("a.comment", "click", function (e) {
                    var $item = $(this).closest('ul');
                    require(["modules/product_comment"], function (Comment) {
                        Comment.reload({
                            ocode: $item.attr('ocode'),
                            opid: $item.attr('opid'),
                            pid: $item.attr('pid'),
                            pname: $item.attr('pname')
                        }, odetail.reload);
                    });
                }).delegate("a.receive_goods", "click", function (e) {//确认收货
                    require(["modules/receive_goods"], function (Receive) {
                        Receive.reload(odetail.data, odetail.reload);
                    });
                }).delegate(".coord", "click", function (e) {
                    var name = $(this).data("name");
                    var title = name.replace(/（.*/, '');
                    var coord = $(this).data("coord");
                    if (!odetail.mappop && title && coord && BMap) {
                        odetail.mappop = new T.Popup({
                            id: 'mappop' + odetail.UUID,
                            title: title,
                            width: 640,
                            content: '<div id="baidumap" class="mappop"></div>',
                            ok: '',
                            no: '',
                            callback: function () {
                                // 百度地图API功能
                                var map = new BMap.Map("baidumap"); //创建Map实例
                                map.addControl(new BMap.NavigationControl());
                                var coords = coord.split(',');
                                var point = new BMap.Point(coords[0], coords[1]);
                                map.centerAndZoom(point, 61);
                                map.enableScrollWheelZoom(true);
                                // 覆盖区域图层
                                //map.addTileLayer(new BMap.PanoramaCoverageLayer());
                                // 构造全景控件
                                var stCtrl = new BMap.PanoramaControl();
                                stCtrl.setOffset(new BMap.Size(32, 32));
                                // 添加全景控件
                                map.addControl(stCtrl);
                                //创建图标
                                var myIcon = myIcon = new BMap.Icon("../../themes/images/mapicon.png", new BMap.Size(30, 38), {
                                    anchor: new BMap.Size(16, 36),
                                    imageOffset: new BMap.Size(-49, 0)
                                });
                                // 创建标注
                                var marker = new BMap.Marker(point, {icon: myIcon || ''});
                                // 添加标注
                                map.addOverlay(marker);

                                var address = name.replace(/^.*（/, "");
                                if (address) {
                                    var parts = address.split("联系电话");
                                    var adr = (parts[0] || "").replace(/\s+|\^+/g, "");
                                    var tel = (parts[1] || "").replace(/[^0-9-]/g, "");
                                    // 创建信息窗口对象
                                    var infoWindow = new BMap.InfoWindow('<div style="margin:0;font-size:14px;line-height:18px;padding:0 6px;">' +
                                        '地址：' + adr + '<br/>' +
                                        '电话：' + tel + '<br/>' +
                                        '</div>', {
                                        title: '<h3 style="">' + title + '</h3>', //标题
                                        width: 300, //宽度
                                        height: 0 //高度
                                    });
                                    // 开启信息窗口
                                    marker.addEventListener("click", function () {
                                        map.openInfoWindow(infoWindow, point);
                                    });
                                }


                                // 创建地址解析器实例
                                /* var myGeo = new BMap.Geocoder();
                                 // 将地址解析结果显示在地图上，并调整地图视野
                                 myGeo.getPoint("深圳市南山区", function (point) {
                                 if (point) {
                                 map.centerAndZoom(point, 16);
                                 // 创建标注
                                 var marker = new BMap.Marker(point);
                                 marker.enableDragging();
                                 marker.addEventListener("dragend", function (e) {
                                 alert("当前位置：" + e.point.lng + ", " + e.point.lat);
                                 });
                                 map.addOverlay(marker);
                                 }
                                 }, "广东省");
                                 // 根据坐标得到地址描述(116.364, 39.993)
                                 myGeo.getLocation(new BMap.Point(116.364, 39.993), function (result) {
                                 if (result) {
                                 //alert(result.address);
                                 }
                                 });*/
                            }
                        });
                        odetail.mappop.on("no", function () {
                            odetail.mappop = null;
                        });
                    }
                    return false;
                }).delegate(".logistics", "click", function (e) {
                    var $this = $(this);
                    var name = $this.data("name") || "";
                    var code = $this.data("code") || "";
                    if (name && code) {
                        odetail.logistics(name, code);
                    }
                }).delegate(".inf-list .inf-item", "click", function (e) {
                    var $this = $(this);
                    var idx = $this.data("idx");
                    if (idx >= 0 && odetail.quotation) {
                        $this.addClass("inf-sel").siblings(".inf-item").removeClass("inf-sel");
                        var info = odetail.quotation.infSubList[idx] || {};
                        odetail.quotationSubId = info.id;
                        odetail.quotation.infSubObj = info;
                        $("#div-quotation_project").html(T.Compiler.template("quotation_project", odetail.quotation));
                        /*T.BindData('data', {
                         weight: info.shipWeightType == 'Weight' ? '<b class="yellow">' + T.RMB(info.shipWeightType || 0) + '</b> kg' : '- kg',
                         delivery: info.delivery ? '<b class="yellow">' + info.delivery + '</b> 天' : '- 天',
                         sale: info.salePrice ? '<b class="yellow">' + T.RMB(info.salePrice) + '</b> 元' : '- 元'
                         });*/
                    }
                }).delegate(".add_cart", "click", function (e) { //询价单商品加入购物车
                    odetail.addCart(1);
                }).delegate("a.cancel_order", "click", function (e) {//取消订单
                    var orderCode = odetail.quotation.id;
                    if (!orderCode) return;
                    //取消订单
                    T.cfm("询价单取消后将不可恢复，是否确认取消？", function (_o) {
                        _o.remove();
                        //取消订单
                        T.POST({
                            action: "in_quotation/cancel_quotation"
                            , params: {id: orderCode, update_point: "User"}
                            , success: function (data) {
                                T.msg('取消成功');
                                odetail.reload();
                            }
                        });
                    }, function (_o) {
                        _o.remove();
                    }, '温馨提示', '确定取消', '暂不取消');
                });

                T.TIP({
                    container: '#template_order_view',
                    trigger: '.col8 .up_help',
                    content: function (trigger) {
                        return '预计出货时间是指商品生产完成的时间，不包含<a class="lnk" href="' + T.DOMAIN.FAQ + 'distribution.html" target="_blank">配送时间</a>。';
                    },
                    width: 'auto',
                    offsetX: 0,
                    offsetY: 0
                });
                T.TIP({
                    container: '#template_order_view', trigger: '.col5 .up_help', content: function (trigger) {
                        return $("#upload_text").html();
                    }, offsetX: 0, offsetY: 0
                });
                T.TIP({
                    container: '#template_order_view', trigger: '.not_pass', content: function (trigger) {
                        return $(trigger).data("value") || "";
                    }, offsetX: 0, offsetY: 0
                });
                //新名片首次免费
                T.TIP({
                    container: '#template_order_view',
                    trigger: '.col5 .select_design_help',
                    content: function (trigger) {
                        var productId = $(trigger).data("product_id") || 0;
                        return (productId == 200021 || productId == 200022) ? "首次购买“新”名片系列产品，即可获得价值50元的专属名片设计券，免费设计名片模板，为您的名片安家。" : "";
                    },
                    offsetX: -2,
                    offsetY: 2
                });
            }
            odetail.events();
        },
        //询价单商品加入购物车
        addCart: function (buynow) { //buynow：1，立即购买
            T.POST({
                action: "in_order/cart_quotation_add",
                params: {
                    buynow: buynow || 0,
                    quotation_id: odetail.quotation.id,
                    quotation_sub_id: odetail.quotationSubId,
                    address: (T.cookie("_address") || CFG_DB.DEF_PCD).replace(/\^+$/g, "")
                },
                success: function (data, params) {
                    window.location = T.DOMAIN.CART + "ordering.html?a=" + T.Params.encode(T.Base64.encode(T.Params.encode(data.cartIds)));
                }
            });
        },
        setPattr: function (value) {
            return ('' + (value || '')).replace(/_+/g, '_').replace(/_$/g, '');
        },
        reload: function (callback) {
            if (odetail.params.t == 20) { //商品询价订单
                T.GET({
                    action: "in_quotation/quotation_detail",
                    params: {
                        from: "User",
                        //inquirer: T._ACCOUNT,
                        id: odetail.params.o
                    },
                    success: function (data) {
                        if (callback)callback();
                        data = data || {};
                        var quotation = data.quotation || {};
                        if (quotation.status != "Draft") {
                            quotation.isBack = 0;
                        }
                        // quotation.isBack = 1;
                        quotation.infSubList = quotation.infSubList || [];
                        odetail.quotation = quotation;
                        if (quotation.status == 'Draft' || quotation.status == 'Canceled') {
                            quotation.stepImg = 'step/4_1.png';
                        } else if (quotation.status == 'Done' || quotation.status == 'Expired') {
                            quotation.stepImg = 'step/4_2.png';
                        }
                        quotation.RMB = T.RMB;
                        quotation.DOMAIN = T.DOMAIN;
                        quotation.nonEmpty = function (value) {
                            return !T.empty(value);
                        };
                        quotation.infSubObj = quotation.infSubList[0] || {};
                        odetail.quotationSubId = quotation.infSubObj.id;
                        quotation.getSolutionName = function (i) {
                            return '方案' + String.fromCharCode(65 + parseInt(i));
                        };

                        //_data.reason = "这里面是报价员回退询价单的备注信息这里面是报价员回退询价单的备注信息这里面是报价员回退询价单的备注信息这里面是报价员回退询价单的备注信息";

                        T.BindData('data', quotation);
                        quotation.keys = [{
                            name: 'productName',
                            value: '产品名称'
                        }, {
                            name: 'number',
                            value: '产品数量'
                        }, {
                            name: 'productSize',
                            value: '产品尺寸'
                        }, {
                            name: 'foldingSize',
                            value: '折后尺寸'
                        }, {
                            name: 'material',
                            value: '产品材质'
                        }, {
                            name: 'foldingType',
                            value: '折页类型'
                        }, {
                            name: 'printingMode',
                            value: '印刷方式'
                        }, {
                            name: 'surfaceTreatment',
                            value: '表面处理'
                        }, {
                            name: 'qualityRequirements',
                            value: '品质要求'
                        }, {
                            name: 'bindType',
                            value: '装订方式'
                        }, {
                            name: 'coverMaterial',
                            value: '封面材质'
                        }, {
                            name: 'pageMaterial',
                            value: '内文材质'
                        }, {
                            name: 'pageCount',
                            value: '内文P数'
                        }, {
                            name: 'laminating',
                            value: '覆膜'
                        }, {
                            name: 'roundCorner',
                            value: '切角'
                        }, {
                            name: 'hotStamping',
                            value: '烫金'
                        }, {
                            name: 'uv',
                            value: 'UV'
                        }, {
                            name: 'cutting',
                            value: '切割'
                        }, {
                            name: 'dieCutting',
                            value: '模切'
                        }, {
                            name: 'shape',
                            value: '形状'
                        }, {
                            name: 'ropeShape',
                            value: '绳子形状'
                        }, {
                            name: 'stringType',
                            value: '穿绳方式'
                        }, {
                            name: 'lamplight',
                            value: '发光'
                        }, {
                            name: 'backMaterial',
                            value: '背板'
                        }, {
                            name: 'install',
                            value: '安装'
                        }, {
                            name: 'installTime',
                            value: '安装时间'
                        }];
                        T.Template('quotation', quotation, true);
                        $("#step_img").attr("src", T.DOMAIN.RESOURCES + quotation.stepImg);

                        if (quotation.isBack == 1) {
                            //询价单：一般设计单，定制设计单
                            var mod, templateId = '';
                            if (data.type === 'Design') {
                                mod = ["modules/design_quotation"];
                                templateId = 'quotation_form_cus';
                                quotation.isoDetail = true;
                            } else {
                                mod = ["modules/quotation"];
                                templateId = 'quotation_form';
                            }
                            require(mod, function (Quotation) {
                                var quotationForm = Quotation({
                                    quotation: quotation
                                }, 1);
                                quotationForm.on("loaded", function (data, params) {
                                    quotationForm.render("#form_detail", templateId, 'odetail');
                                    T.PageLoaded();
                                });
                                quotationForm.load();
                            });
                        } else {
                            $("#odetail .inf-list .inf-item:first").click();
                            T.PageLoaded();
                        }
                    }
                });
            } else if (/\d{13}/.test(odetail.params.o) || odetail.params.t == 15) {
                T.GET({
                    action: CFG_DS.distorder.get,
                    params: {
                        dist_code: odetail.params.o
                    },
                    success: function (data) {
                        if (callback)callback();
                        var _data = T.FormatData(data || {});
                        _data.dist_order_list = _data.dist_order_list || [];
                        _data.order = _data.dist_order_list[0] || {};
                        if (_data.order.dist_code) {
                            _data.order.type = 15;
                            _data.order.order_type_str = '分发订单';
                            _data.order.step_img = 'step/2_3.png';
                            _data.order.dist_order_detail_list = _data.order.dist_order_detail_list || [];
                            //缓存订单信息
                            _data.order.original_price = _data.order.total_ship;
                            _data.order.total_price = _data.order.total_ship;
                            _data.order.paid_price = _data.order.need_pay || 0; //已付金额
                            _data.order.payable_price = _data.order.total_price - (_data.order.need_pay || 0); //应付金额
                            _data.order.ship_price = _data.order.total_ship; //运费
                            if (_data.order.ship_price < 0) _data.order.ship_price = 0;
                            if (_data.order.status > 0) {
                                _data.order._success = odetail.params.s || '';
                            }

                            //支付信息
                            var _pay_infos = [];
                            _data.order._pay_type = _data.order.pay_type;
                            T.Each(_data.order.order_pay_list, function (k, v) {
                                if (v && v.pay_status == 1) {
                                    if (v && v.pay_type == 15) {
                                        _data.order._pay_type = v.pay_type;
                                        _data.order.pay_type_str = v.pay_name;
                                        _pay_infos.push(v.pay_name);
                                    } else if (v && (v.pay_type == 17 || v.pay_type == 18)) { //加盟商支付特殊处理
                                        _data.order._pay_type = v.pay_type;
                                        _data.order.pay_type_str = "加盟商支付" + T.RMB(_data.order.total_price) + "元";
                                        _pay_infos = [_data.order.pay_type_str];
                                    } else {
                                        _pay_infos.push(v.pay_name + T.RMB(v.amount) + '元');
                                    }
                                }
                            });
                            _data.order._pay_infos = _pay_infos.length ? _pay_infos : ['无'];
                            //物流信息
                            var _logistics_infos = [];
                            if (_data.order.logistics_name && _data.order.logistics_code) {//物流信息
                                _logistics_infos = [{
                                    name: _data.order.logistics_name,
                                    code: _data.order.logistics_code
                                }];
                            }
                            var product_counter = [];
                            T.Each(_data.order.dist_order_detail_list, function (i, order) {
                                T.Each(order.dist_order_product_list, function (k, product) {
                                    var counter = T.Array.get(product_counter, product.order_code, 'order_code');
                                    if (!counter) {
                                        counter = {
                                            order_code: product.order_code,
                                            address_ids: [],
                                            product_ids: []
                                        };
                                        product_counter.push(counter);
                                    }
                                    T.Array.add(counter.address_ids, order.dist_id);
                                    T.Array.add(counter.product_ids, product.order_product_id);
                                    if (product.logistics_name && product.logistics_code && !T.Array.get(_logistics_infos, product.logistics_code, 'code')) {//物流信息
                                        _logistics_infos.push({
                                            name: product.logistics_name,
                                            code: product.logistics_code
                                        });
                                    }
                                });
                                if (order.logistics_name && order.logistics_code && !T.Array.get(_logistics_infos, order.logistics_code, 'code')) {//物流信息
                                    _logistics_infos.push({name: order.logistics_name, code: order.logistics_code});
                                }
                            });
                            _data.order.product_counter = product_counter;
                            _data.order._logistics_infos = odetail.logistics_infos = _logistics_infos.length ? _logistics_infos : [{
                                name: '无',
                                code: ''
                            }];
                            console.log(product_counter);

                            _data.order.TAKEDATE = CFG_DB.TAKEDATE;
                            _data.order.RMB = T.RMB;
                            _data.order.SetPattr = odetail.setPattr;
                            T.BindData('data', _data.order);
                            T.Template('order', _data.order);
                            $("#step_img").attr("src", T.DOMAIN.RESOURCES + _data.order.step_img);
                            T.PageLoaded();
                        } else {
                            T.alt(_data.msg || '订单不存在或已删除', function (_o) {
                                _o.remove();
                                window.location = T.DOMAIN.ORDER + 'index.html?t=15&' + T.INININ;
                            }, function (_o) {
                                _o.remove();
                                window.location = T.DOMAIN.ORDER + 'index.html?t=15&' + T.INININ;
                            }, '返回我的订单');
                        }
                    }
                });
            } else {
                T.GET({
                    action: CFG_DS.myorder.det
                    , params: {order_code: odetail.params.o}
                    , success: function (data) {
                        if (callback)callback();
                        var _data = T.FormatData(data || {});
                        _data.order_list = _data.order_list || [];
                        T.Each(_data.order_list, function (m, order) {
                            order.payable = true; //是否可支付
                            if(!T._OPERATOR_CODE){ //非代下单人员登录
                                if (order.pay_type == 4) { //信用支付未付服务费不可支付
                                    order.payable = false
                                }
                                if (order.pay_type == 6) { //使用代金账户部分支付过不可支付
                                    order.payable = false
                                }
                                if (order.pay_type == 7) { //阿米巴月结支付不可支付
                                    order.payable = false
                                }
                            }
                            var is_cancel = true, is_upload = true, is_receive = false;
                            T.Each(order.order_product_list, function (n, product) {
                                product._is_cancel = (order.status == 0 || order.status == 1) && (product.status == 1 || (product.status == 0 && !product.reviewer) || product.status == 10 || product.status == 11);
                                is_cancel = is_cancel && product._is_cancel;
                                product._is_upload = (order.status == 0 || order.status == 1) && (product.status == 1 || (product.status == 0 && !product.reviewer) || product.status == 10 || product.status == 11);
                                is_upload = is_upload && product._is_upload;
                                product._is_receive = order.status == 1 && product.status == 4;
                                is_receive = is_receive || product._is_receive;
                            });
                            order._is_cancel = is_cancel;
                            order._is_upload = is_upload;
                            order._is_receive = is_receive;
                        });
                        _data.order = _data.order_list[0] || {};
                        if (_data.order.order_code) {
                            _data.order.order_product_list = _data.order.order_product_list || [];
                            _data.order.order_pay_list = _data.order.order_pay_list || [];
                            _data.order.total_discount_price = _data.order.total_price - (_data.order.ship_price || 0);
                            _data.order.order_price = _data.order.total_price;
                            _data.order.RMB = T.RMB;
                            _data.order.IMG = CFG_DB.IMG;
                            _data.order.DOMAIN = T.DOMAIN;
                            _data.order.Eval = T.Eval;
                            _data.order.TAKEDATE = CFG_DB.TAKEDATE;
                            if (_data.order.status > 0) {
                                _data.order._success = odetail.params.s || '';
                            }

                            //_data.order.logistics_name = 'shunfeng';
                            //_data.order.logistics_code = '114438416201';
                            //支付信息
                            var _pay_infos = [], payObj = {};
                            debugger
                            _data.order._pay_type = _data.order.pay_type;
                            T.Each(_data.order.order_pay_list, function (k, v) {
                                if (v && v.pay_status == 1) {
                                    if (v && v.pay_type == 4) {
                                        var payName = v.pay_name + T.RMB(v.amount) + '元';
                                        payObj[payName] = (payObj[payName] || 0) + 1;
                                    } else if (v && v.pay_type == 15) {
                                        _data.order._pay_type = v.pay_type;
                                        _data.order.pay_type_str = v.pay_name;
                                        _pay_infos.push(v.pay_name);
                                    } else if (v && (v.pay_type == 17 || v.pay_type == 18)) {
                                        _data.order._pay_type = v.pay_type;
                                        _data.order.pay_type_str = "加盟商支付" + T.RMB(_data.order.total_price) + "元";
                                        _pay_infos = [_data.order.pay_type_str];
                                    } else {
                                        _pay_infos.push(v.pay_name + T.RMB(v.amount) + '元');
                                    }
                                }
                            });
                            T.Each(payObj, function (k, v) {
                                _pay_infos.push(k + '*' + v);
                            });
                            _data.order._pay_infos = _pay_infos.length ? _pay_infos : ['无'];
                            //物流信息
                            var _logistics_infos = [{name: '无', code: ''}];
                            if (_data.order.logistics_name && _data.order.logistics_code) {//物流信息
                                _logistics_infos = [{
                                    name: _data.order.logistics_name,
                                    code: _data.order.logistics_code
                                }];
                            }
                            var orderIndex = "", groupLogisticsInfos = [], takeTypeList = [], prevProduct;
                            debugger
                            if (_data.order.take_type_str && _data.order.take_type > 0)T.Array.add(takeTypeList, _data.order.take_type_str, false);
                            T.Each(_data.order.order_product_list, function (k, v) {
                                debugger
                                if (v.take_type_str)T.Array.add(takeTypeList, v.take_type_str, false);
                                if (orderIndex >= 0 && orderIndex != v.order_index) {
                                    if (prevProduct) {
                                        prevProduct._logistics_infos = groupLogisticsInfos;
                                        groupLogisticsInfos = [];
                                    }
                                    /*groupLogisticsInfos = [{
                                     name: "韵达快递",
                                     code: "1901303159414"
                                     }];*/
                                }
                                if (v.logistics_name && v.logistics_code) {//物流信息
                                    if (!T.Array.get(groupLogisticsInfos, v.logistics_code, 'code')) {
                                        groupLogisticsInfos.push({name: v.logistics_name, code: v.logistics_code});
                                    }
                                    if (!T.Array.get(_logistics_infos, v.logistics_code, 'code')) {
                                        _logistics_infos.push({name: v.logistics_name, code: v.logistics_code});
                                    }
                                }
                                if (_data.order.order_product_list.length == 1 || _data.order.order_product_list.length - k == 1) {
                                    v._logistics_infos = groupLogisticsInfos;
                                }
                                prevProduct = v;
                                orderIndex = v.order_index;
                                //是否为安装服务
                                if (T.IsInstallService(v.product_id)) {
                                    v._IsInstallService = 1;
                                    odetail.IsInstallService++;
                                }
                                v.sorce_file = (v.sorce_file || v.file_url || "").replace(/^.*\//, '');
                            });
                            _data.order._take_type_list = takeTypeList;
                            _data.order._logistics_infos = odetail.logistics_infos = _logistics_infos.length ? _logistics_infos : [{
                                name: '无',
                                code: ''
                            }];

                            var _uploaded = true;
                            var isCard = false, isPackage = false; //是否是账户充值
                            T.Each(_data.order.order_product_list, function (k, product) {
                                if (!product.sorce_file)_uploaded = false;
                                if (product.category_id == CFG_DB.DESIGN.MINGPIAN)isCard = true;
                                if (_data.order.type == 10 && (/*product.product_id==116 || product.product_id==117 || */product.product_id == 134 || product.product_id == 141 || product.product_id == 116 || product.product_id == 117)) {
                                    product.status = -1;
                                    product.status_str = _data.order.status > 0 ? "交易完成" : "";
                                    isPackage = true;
                                }
                            });
                            //购买流程图
                            if (odetail.IsInstallService) {
                                _data.order.step_img = 'step/3_3.png';
                                _data.order._success_str = '订单支付成功，请您保持电话畅通，我们的工作人员会尽快联系您。';
                            } else if (_data.order.type == 10) {
                                _data.order.step_img = 'step/2_3.png';
                                _data.order._success_str = '订单支付成功，正在为您选择设计师，预计24小时内完成设计';
                            } else if (_data.order.type == 5) {
                                _data.order.step_img = 'step/2_3.png';
                                _data.order._success_str = '订单支付成功';
                                _data.order.IMG = CFG_DB.IMG;
                            } else {
                                _data.order.step_img = 'step/1_3.png';
                                _data.order._success_str = '订单支付成功，' + (_uploaded ? '我们会尽快安排生产' : '请选择您需要印刷的文件');
                            }
                            if (isPackage) {
                                _data.order.step_img = 'step/2_3.png';
                                _data.order._success_str = '订单支付成功';
                            }

                            if (_data.order.receive_address) {
                                _data.order.receive_address = _data.order.receive_address.replace(/\^/g, '');
                            }
                            if (_data.order.take_type == 2 && _data.order.take_address) {
                                _data.order.take_address = _data.order.take_address.replace(/\^/g, '');
                            }
                            _data.order.invoice_content = _data.order.invoice_content.replace(/\^/g, '&nbsp;&nbsp;&nbsp;');
                            _data.order.DeliveryDate = T.DeliveryDate;
                            _data.order.SetPattr = odetail.setPattr;
                            _data.order.FDDID = CFG_DB.FDDID;
                            odetail.data = _data.order;
                            T.BindData('data', _data.order);
                            T.Template('order', _data.order);
                            $("#step_img").attr("src", T.DOMAIN.RESOURCES + _data.order.step_img);
                            //myorder.bindUpload(_data.order_list);
                            T.PageLoaded();
                        } else {
                            T.alt(_data.msg || '订单不存在或已删除', function (_o) {
                                _o.remove();
                                window.location = T.DOMAIN.ORDER + 'index.html' + (T.INININ ? '?' + T.INININ : '');
                            }, function (_o) {
                                _o.remove();
                                window.location = T.DOMAIN.ORDER + 'index.html' + (T.INININ ? '?' + T.INININ : '');
                            }, '返回我的订单');
                        }
                    }
                });
            }
        },
        logistics: function (com, nu) {//物流查询
            if (!com || !nu)return;
            var _this = this;
            T.GET({
                action: 'in_product/express_query'
                , params: {com: com, nu: nu}
                , success: function (data) {
                    if (data && /^http/.test(data.retUrl)) {
                        odetail.logistics_pop = T.Popup({
                            fixed: true,
                            id: odetail.UUID + 'logistics_popup',
                            zIndex: 1000,
                            style: 'logistics_popup',
                            title: com + '&nbsp;<b class="red">' + nu + '</b>&nbsp;<span class="alt">（本数据由<a href="http://kuaidi100.com" target="_blank">快递100</a>提供）</span>',
                            width: 528,
                            height: 334,
                            type: 'iframe',
                            content: data.retUrl
                        });
                        odetail.logistics_pop.setPosition();
                    }
                }
                , failure: function (data) {
                    _this.logisticsError(com, nu);
                }
                , error: function (data) {
                    _this.logisticsError(com, nu);
                }
            }, function (data) {
                _this.logisticsError(com, nu);
            }, function (data) {
                _this.logisticsError(com, nu);
            });
        },
        logisticsError: function (name, code) {
            top.window.open("http://www.kuaidi100.com/chaxun?com=" + name + "&nu=" + code, "", "height=" + window.screen.availHeight + ",width=" + window.screen.availWidth + ",top=0,left=0,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,location=yes,status=yes,channelmode=yes");
        },
        events: function () {
            $("#template_order_view").delegate(".select_file, ul[cid='30'] .filename[data-card_id], ul[cid='39'] .filename[data-card_id], ul[cid='40'] .filename[data-card_id], ul[cid='41'] .filename[data-card_id], ul[cid='42'] .filename[data-card_id], ul[cid='141'] .filename[data-card_id], ul[cid='142'] .filename[data-card_id]", "click", function (e) {
                var $this = $(this);
                var $item = $this.closest("ul");
                var opid = $item.attr("opid") || "";
                if (!opid)return;
                var product = T.Array.get(odetail.data.order_product_list, opid, 'order_product_id');
                if (product) {
                    var params = {
                        isUpdate: !!product.sorce_file,
                        order_code: product.order_code,
                        category_id: product.category_id,
                        product_id: product.product_id,
                        size: ((T.RE.size.exec(product.product_attr || '') || [])[0] || '').replace(/[^a-zA-Z0-9.*×]/, ''),
                        quantities: [],
                        data: {}
                    };
                    if (product.sorce_file || !product.quantity) {
                        params.data[product.quantity] = [{
                            "design_category_id": product.design_category_id,
                            "order_product_id": product.order_product_id,
                            "uploaded": "0"
                        }];
                        T.Array.add(params.quantities, product.quantity);
                    } else {
                        var reg = new RegExp('[-_]' + product.quantity + '[-_]|[-_]' + product.quantity.replace(/\D/g, '') + '[-_]', 'i');
                        var txt = (reg.exec(product.product_attr) || [])[0] || ('数量:' + product.quantity);
                        T.Each(odetail.data.order_product_list, function (i, v) {
                            var _reg = new RegExp('[-_]' + v.quantity + '[-_]|[-_]' + v.quantity.replace(/\D/g, '') + '[-_]', 'i');
                            var _txt = (_reg.exec(v.product_attr) || [])[0] || ('数量:' + v.quantity);
                            if (v._is_upload && v.category_id == product.category_id && v.product_id == product.product_id && v.product_attr.replace(_txt, txt) == product.product_attr && !v.sorce_file) {
                                params.data[v.quantity] = params.data[v.quantity] || [];
                                params.data[v.quantity].push({
                                    "design_category_id": v.design_category_id,
                                    "order_product_id": v.order_product_id,
                                    "uploaded": "0"
                                });
                                T.Array.add(params.quantities, v.quantity);
                            }
                        });
                    }
                    require(deferModules, function () {
                        DesignEditor = arguments[0];
                        Uploader = arguments[1];
                        Previewer = arguments[2];
                        HistoryOrder = arguments[3];
                        MyTemplate = arguments[4];
                        changeFiles.init(params, product, $this.hasClass("filename"));
                    });
                }
            });
        }
    };
    var myorder = {
        extensions: "jpg,jpeg,png,gif,pdf,psd,tif,tiff,ai,cdr,eps,indd,ppt,pptx,doc,docx,xls,xlsx,rar,zip,7z",
        bindUpload: function (product) {
            var _this = this;
            var $input = $("#order_file_upload");
            var $changeFile = $input.closest(".change_file");
            _this.uploader = Uploader({
                params: {
                    type: 10,
                    order_code: product.order_code,
                    order_product_id: product.order_product_id,
                    uploaded: "0"
                },
                spaceLimit: true,
                auto: false,
                type: _this.extensions,
                inputId: "order_file_upload",
                text: "选择文件",
                text2: "重新选择文件",
                uiCfg: {
                    name: true, //是否显示文件名
                    size: true, //是否显示文件大小
                    progress: true, //是否显示上传进度
                    loaded: true, //是否显示已上传
                    speed: true, //是否显示上传速度
                    remove: false //是否显示删除上传完成的文件
                },
                fileName: function (fix) {
                    return product.order_code + "_" + product.order_product_id + "_10_" + T.GetFileUrl();
                },
                onSelect: function (params) {
                    $input.val(params.fileName || "");
                    myorder.remind({
                        fileName: params.fileName,
                        uploaded: 1,
                        ok: function () {
                            _this.uploader.upload();
                        },
                        no: function () {
                            _this.uploader.refresh();
                            $input.val("");
                            $(".btns-center", $changeFile).hide();
                            //_this.bindUpload(product);
                        },
                        cancel: function () {
                            $input.val("");
                            $(".btns-center", $changeFile).hide();
                        }
                    });
                },
                onSuccess: function (params) {//上传成功
                    //myorder.upload(params, product);
                    changeFiles.uploadParams = params;
                    $(".btns-center", $changeFile).show();
                },
                onCancel: function () {
                    $input.val("");
                    $(".btns-center", $changeFile).hide();
                }
            });
        },
        getExtensionsReg: function (extensions) {
            var _this = this;
            return new RegExp("\^.+\\.(" + (extensions || _this.extensions).replace(/\s+/g, "").replace(/,/g, "|") + ")\$", "i");
        },
        /**
         * 上传提醒
         */
        remind: function (options) {
            var _this = this;
            var opts = options || {};
            var extensions = {
                ai: _this.getExtensionsReg("ai"),
                cdr: _this.getExtensionsReg("cdr"),
                eps: _this.getExtensionsReg("eps"),
                indd: _this.getExtensionsReg("indd"),
                jpg_png_pdf_gif: _this.getExtensionsReg("jpg,jpeg,png,gif,pdf"),
                ppt_word_excel: _this.getExtensionsReg("ppt,pptx,doc,docx,xls,xlsx"),
                psd_tiff: _this.getExtensionsReg("psd,tif,tiff"),
                zip_rar_7z: _this.getExtensionsReg("rar,zip,7z")
            };
            var fileType = "";
            T.Each(extensions, function (key, extension) {
                if (extension.test(opts.fileName)) {
                    fileType = key;
                    return false;
                }
            });
            if (fileType) {
                var popup = new T.Popup({
                    parentPopup: changeFiles.popup,
                    id: 'remind',
                    zIndex: 1050,
                    width: 900,
                    title: '选择印刷文件',
                    type: 'html',
                    content: T.Compiler.templateNative('template_remind', {
                        fileType: fileType,
                        uploaded: opts.uploaded || 0
                    }),
                    ok: '',
                    no: '',
                    noFn: function () {
                        popup && popup.remove();
                        opts.no && opts.no();
                        opts.cancel && opts.cancel();
                    },
                    callback: function (_popup) {
                        var $view = $("#remind_main");
                        $view.on("click", ".btns-center .btn-primary", function (e) {
                            popup && popup.remove();
                            opts.ok && opts.ok();
                        }).on("click", ".btns-center .btn-warning", function (e) {
                            popup && popup.remove();
                            opts.no && opts.no();
                            opts.cancel && opts.cancel();
                        }).on("click", ".btns-center .btn-default", function (e) {
                            popup && popup.remove();
                            opts.cancel && opts.cancel();

                        }).on("click", ".remind-list .remind-show", function (e) {
                            var $this = $(this).closest("dd");
                            if ($this.hasClass("shw")) {
                                $this.removeClass("shw");
                            } else {
                                $this.addClass("shw").siblings("dd").removeClass("shw");
                            }
                        }).on("click", ".remind-list .remind-hide", function (e) {
                            var $this = $(this).closest("dd");
                            $this.removeClass("shw");
                        });
                    }
                });
            }
        }
    };
    //我的名片
    var myCard = {
        chks: [],
        PAGIN: {is_design: '1,2', index: 0, offset: 10},
        reload: function (params, isFirst, callback) {//名片
            myCard.PAGIN = params || myCard.PAGIN;
            T.GET({
                action: CFG_DS.card.get
                , params: myCard.PAGIN
                , success: function (data) {
                    var _data = T.FormatData(data || {});
                    _data.card_list = _data.card_list || [];
                    _data.count = _data.total || _data.card_list.length;
                    myCard.data = _data.card_list;
                    //设置默认选中
                    T.Each(_data.card_list, function (k, card) {
                        T.Each(myCard.chks, function (i, v) {
                            if (card.card_id == v) {
                                card._checked = true;
                            }
                        });
                    });
                    _data.isUpdate = myCard.isUpdate;
                    _data.product = changeFiles.product || {};
                    T.Template('card_list', _data);
                    if (myCard.PAGIN.offset) {
                        T.Paginbar({
                            num: 3,
                            size: myCard.PAGIN.offset,
                            total: Math.ceil(_data.count / myCard.PAGIN.offset),
                            index: myCard.PAGIN.index / myCard.PAGIN.offset + 1,
                            paginbar: 'paginbar_card_list',
                            callback: myCard.pagin
                        });
                    }
                    if (isFirst && !_data.card_list.length) {
                        $(".ofilter ul li:eq(2) a", changeFiles.$dom).click();
                    }
                    if (myCard.loaded)myCard.loaded(isFirst);
                    if (callback)callback();
                }
            });
        },
        pagin: function (obj, index, size, total) {
            myCard.PAGIN.index = myCard.PAGIN.offset * (index - 1);
            myCard.reload(myCard.PAGIN);
        }
    };
    //我的文件
    var myFile = {
        chks: [],
        PAGIN: {type: 0, index: 0, offset: 10},
        accept: myorder.getExtensionsReg(),
        imgReg: myorder.getExtensionsReg("jpg,jpeg,png,gif"),
        reload: function (params, isFirst, callback) {
            var _this = this;
            _this.PAGIN = params || _this.PAGIN;
            if (_this.PAGIN.type > 0) {
                T.GET({
                    action: CFG_DS.myfile.get
                    , params: _this.PAGIN
                    , success: function (data) {
                        debugger
                        var _fileList = [];
                        T.Each(data.fileList, function (i, file) {
                            if (file.fileId && file.fileSrc && file.fileName && _this.accept.test(file.fileSrc)) {
                                if (_this.imgReg.test(file.previewPath || file.fileSrc)) {
                                    file.hasPreviewer = true;
                                }
                                file.fileName = (file.fileName || file.fileSrc || "").replace(/^.*\//, '');
                                _fileList.push(file);
                            }
                        });
                        data.fileList = _fileList;
                        data.product = changeFiles.product || {};
                        _this.data = data.fileList;
                        _this.chks = T.Array.check(data.designFileList, _this.defFileUrl || _this.chks, "pdfPath");
                        data.isUpdate = _this.isUpdate;
                        data.designCategoryId = _this.PAGIN.design_category_id;
                        data.TYPE = _this.PAGIN.type;
                        T.Template('file_list', data);
                        if (_this.PAGIN.offset) {
                            T.Paginbar({
                                num: 3,
                                size: _this.PAGIN.offset,
                                total: Math.ceil(data.totalCount / _this.PAGIN.offset),
                                index: Math.ceil(_this.PAGIN.index / _this.PAGIN.offset) + 1,
                                paginbar: 'paginbar_file_list',
                                callback: function (obj, index, size, total) {
                                    _this.pagin(obj, index, size, total);
                                }
                            });
                        }
                        if (_this.loaded)_this.loaded(isFirst);
                        if (callback)callback();
                    }
                });
            }
        },
        pagin: function (obj, index, size, total) {
            var _this = this;
            _this.PAGIN.index = (index - 1) * _this.PAGIN.offset;
            _this.reload(_this.PAGIN);
        }
    };
    //我的文件
    var myDesign = {
        chks: [],
        PAGIN: {type: 30, index: 0, offset: 10},
        imgReg: myorder.getExtensionsReg("jpg,jpeg,png,gif"),
        reload: function (params, isFirst, callback) {
            var _this = this;
            _this.PAGIN = params || _this.PAGIN;
            T.GET({
                action: CFG_DS.mydesignfile.get,
                params: _this.PAGIN,
                success: function (data) {
                    data = data || {};
                    var _designFileList = [];
                    T.Each(data.userDesignFileList, function (i, file) {
                        if (file.pdfPath/* && /.+\.pdf$/i.test(file.pdfPath)*/) {
                            if (_this.imgReg.test(file.pdfPreviewPath)) {
                                file.hasPreviewer = true;
                            }
                            file.fileName = file.pdfPath.replace(/^.*\//, '');
                            _designFileList.push(file);
                        }
                    });
                    data.designFileList = _designFileList;
                    data.product = changeFiles.product || {};
                    _this.data = data.designFileList;
                    T.Array.check(data.designFileList, _this.defFileUrl, "pdfPath");
                    data.designCategoryId = _this.PAGIN.design_category_id;
                    T.Template("design_file_list", data);
                    if (_this.PAGIN.offset) {
                        T.Paginbar({
                            num: 3,
                            size: _this.PAGIN.offset,
                            total: Math.ceil(data.totalCount / _this.PAGIN.offset),
                            index: Math.ceil(_this.PAGIN.index / _this.PAGIN.offset) + 1,
                            paginbar: 'paginbar_file_list',
                            callback: function (obj, index, size, total) {
                                _this.pagin(obj, index, size, total);
                            }
                        });
                    }
                    if (_this.loaded)_this.loaded(isFirst);
                    if (callback)callback();
                }
            });
        },
        pagin: function (obj, index, size, total) {
            var _this = this;
            _this.PAGIN.index = (index - 1) * _this.PAGIN.offset;
            _this.reload(_this.PAGIN);
        }
    };
    //选择文件
    var changeFiles = {
        popup: null,
        params: null,
        data: [],
        chks: {},
        index: 0,//选项卡索引
        product: null,//默认订单产品
        init: function (params, product, isFilename) {
            var _this = this;
            params = params || {};
            debugger
            params.isCard = T.hasPMPID(params.category_id);
            params.PMPID = params.isCard ? params.category_id : '-1';
            _this.product = product;
            _this.params = params;
            if (!isFilename) {
                _this.popup = new T.Popup({
                    id: 'reorder',
                    width: 900,
                    title: '选择印刷文件',
                    type: 'html',
                    content: T.Compiler.templateNative('template_change_files', params),
                    ok: '',
                    no: ''
                });
                _this.$dom = $("#change_files");
                if (params.isCard) {
                    _this.setQuantity(params.quantities[0]);
                    _this.$group = $(".groups .group:eq(0)", _this.$dom);
                }
                myCard.loaded = myFile.loaded = _this.loaded;
                myorder.bindUpload(product);
                _this.events();
            }
            T.TIP({
                container: '#reorder_panel',
                trigger: '.card_help',
                content: function (trigger) {
                    return '<p>名片模板是将您的名片文件或信息制作成在线可编辑模板，有了名片模板，您不论是修改自己名片信息还是制作同模板其他人的名片文件，都可以在线自助完成，再也不需要花时间沟通及等待设计师帮您改文件了。<p/>';
                },
                width: '320',
                offsetX: 0,
                offsetY: 0
            });
            if (params.isCard) {
                if (isFilename && product.card_id) {//如果点击名片名字
                    DesignEditor({
                        cardId: product.card_id,
                        orderCode: _this.product.order_code,
                        orderProductId: _this.product.order_product_id
                    }, function (card) {
                        _this.commit(card);
                    });
                } else {
                    _this.getCardList();
                    _this.getTemplateList();
                }
            }
        },
        getCardList: function () {
            var _this = this;
            debugger;
            var params = _this.params,
                product = _this.product;
            myCard.chks = [];
            if (params.isUpdate && product.card_id) {
                myCard.chks = [product.card_id];
            }
            myCard.isUpdate = params.isUpdate;
            $("#template_card_list_view").addClass("load");
            myCard.reload({size: params.size, is_design: '1,2', index: 0, offset: 10}, true, function () {
                $("#template_card_list_view").removeClass("load");
                if (!myCard.data || !myCard.data.length) {//如果没有名片，跳转至模板制作页
                    $(".ofilter ul li[data-type='2'] a", _this.$dom).click();
                    $(".change_file[data-type='1'] .btns-center", _this.$dom).hide();
                } else {
                    $(".change_file[data-type='1'] .btns-center", _this.$dom).show();
                }
            });
        },
        getTemplateList: function () {
            var _this = this;
            debugger;
            var params = _this.params,
                product = _this.product;
            var myTemplate = new MyTemplate();
            $("#template_design_template_list_view").addClass("load");
            myTemplate.reload({
                size: params.size,
                type: '0',
                owner_type: '1',
                offset: 0,
                count: 1,
                orderCode: odetail.params.o
            }, true, function () {
                $("#template_design_template_list_view").removeClass("load");
                if (this.data && this.data.length) {//如果没有模板
                    $(".ofilter .card_help", _this.$dom).show();
                }
            }, _this.product);
        },
        getFileList: function (type) {
            var _this = this;
            debugger;
            var params = _this.params,
                product = _this.product;
            myFile.chks = [];
            myFile.defFileUrl = '';
            if (params.isUpdate && product.file_url) {
                myFile.defFileUrl = product.file_url;
                myDesign.defFileUrl = product.file_url;
            }
            myFile.isUpdate = params.isUpdate;
            var fileObj = null;
            var $view = $(".change_file .block_content .file_list > div:first-child", _this.$dom);
            if (type == 30) {
                fileObj = myDesign;
                $view.attr("id", "template_design_file_list_view");
            } else {
                fileObj = myFile;
                $view.attr("id", "template_file_list_view");
            }
            _this.fileType = type;
            $("#template_file_list_view").addClass("load");
            fileObj.reload({
                type: type || "0",
                index: 0,
                offset: 10,
                /*category_id: params.category_id,
                 size: params.size,*/
                design_category_id: product.design_category_id || ""
            }, true, function () {
                $("#template_file_list_view").removeClass("load");
                $(".ofilter .searchbar", _this.$dom).show();
                if (!myFile.data.length) {
                    //$(".ofilter ul li:eq(2) a", _this.$dom).click(); //如果没有文件，跳转至上传本地文件页
                    $(".change_file[data-type='0'] .btns-center", _this.$dom).hide();
                } else {
                    $(".change_file[data-type='0'] .btns-center", _this.$dom).show();
                }
                if (_this.popup && _this.popup.setPosition) {
                    _this.popup.setPosition();
                }
            });
            /*if(product.file_url&&product.sorce_file){
             myorder.upload(product, product);
             }*/
        },
        reload: function () {//重新加载
            var _this = this;
            if (_this.params.isCard && _this.index == 1) {//名片类
                myCard.chks = _this.chks[_this.quantity] || [];
                myCard.reload(myCard.PAGIN, 0, function () {
                    if (!myCard.data || !myCard.data.length) {
                        $(".change_file[data-type='1'] .btns-center", _this.$dom).hide();
                    } else {
                        $(".change_file[data-type='1'] .btns-center", _this.$dom).show();
                    }
                });
            } else if (_this.fileType == 10 || _this.fileType == 20) {//我的资料,我的印刷PDF
                myFile.chks = _this.chks[_this.quantity] || [];
                myFile.reload(myFile.PAGIN, 0, function () {
                    if (!myFile.data.length) {
                        $(".change_file[data-type='0'] .btns-center", _this.$dom).hide();
                    } else {
                        $(".change_file[data-type='0'] .btns-center", _this.$dom).show();
                    }
                });
            } else if (_this.fileType == 30) {//我的设计文件
                myDesign.chks = _this.chks[_this.quantity] || [];
                myDesign.reload(myDesign.PAGIN, 0, function () {
                    if (!myDesign.data.length) {
                        $(".change_file[data-type='0'] .btns-center", _this.$dom).hide();
                    } else {
                        $(".change_file[data-type='0'] .btns-center", _this.$dom).show();
                    }
                });
            }
        },
        search: function (keyword) {
            var _this = this;
            if (_this.params.isCard && _this.index == 1) {//名片类
                myCard.PAGIN.keyword = keyword;
            } else if (_this.fileType == 10) {//我的资料
                myFile.PAGIN.keyword = keyword;
            } else if (_this.fileType == 20) {//我的印刷PDF
                myFile.PAGIN.order_code = keyword;
            } else if (_this.fileType == 30) {//我的设计文件
                myDesign.PAGIN.orderCode = keyword;
            }
            _this.reload();
        },
        setQuantity: function (quantity, isReload) {//当前选中数量
            var _this = this;
            if (!quantity)return;
            var data = _this.params.data[quantity] || [];
            if (!data.length)return;
            _this.data = data;
            _this.quantity = quantity;
            if (isReload) {
                _this.reload();
            }
        },
        check: function (value, checked, isRadio) {//设置选中的项
            var _this = this;
            if (!value)return;
            var chks = [], count = 0, total = _this.data.length;
            if (checked) {
                if (_this.params.isCard) {//名片类
                    count = myCard.chks.length;
                    if (count < total || isRadio) {
                        var card = T.Array.get(myCard.data, value, 'card_id');
                        if (card) {
                            T.Each(_this.data, function (k, v) {
                                if (isRadio || !v.card_id) {
                                    v.card_id = card.card_id;
                                    v.template_id = card.template_id;
                                    return false;
                                }
                            });
                            if (isRadio) {
                                myCard.chks = [value];
                            } else {
                                T.Array.add(myCard.chks, value);
                            }
                            _this.chks[_this.quantity] = myCard.chks;
                        }
                        count = myCard.chks.length;
                    } else {
                        T.msg("您选择的印刷文件数量已超过印刷名片人数！");
                    }
                    chks = myCard.chks;
                }
                /*else{//其他产品
                 count = myFile.chks.length;
                 if(count<total||isRadio){
                 var file = T.Array.get(myFile.data, value, 'file_id');
                 if(file){
                 T.Each(_this.data, function(k, v){
                 if(isRadio||!v.file_url){
                 v.sorce_file = file.file_name;
                 v.file_url = file.file_src;
                 v.file_id = file.file_id;
                 return false;
                 }
                 });
                 if(isRadio){
                 myFile.chks = [value];
                 }else{
                 T.Array.add(myFile.chks, value);
                 }
                 _this.chks[_this.quantity] = myFile.chks;
                 }
                 count = myFile.chks.length;
                 }else{
                 T.msg("您选择的印刷文件数量已超过印刷商品款数！");
                 }
                 chks = myFile.chks;
                 }*/
            } else {
                if (_this.params.isCard) {//名片类
                    T.Each(_this.data, function (k, v) {
                        if (v.card_id == value) {
                            v.card_id = '';
                            return false;
                        }
                    });
                    T.Each(myCard.chks, function (i, v) {
                        if (v != value) {
                            chks.push(v);
                        }
                    });
                    myCard.chks = chks;
                    _this.chks[_this.quantity] = myCard.chks;
                    count = chks.length;
                }
                /*else{//其他产品
                 T.Each(_this.data, function(k, v){
                 if(v.file_id==value){
                 v.sorce_file = '';
                 v.file_url = '';
                 v.file_id = '';
                 return false;
                 }
                 });
                 T.Each(myFile.chks, function(i, v){
                 if(v!=value){
                 chks.push(v);
                 }
                 });
                 myFile.chks = chks;
                 _this.chks[_this.quantity] = myFile.chks;
                 count = chks.length;
                 }*/
            }
            if (_this.$group && _this.$group.length) {
                $(".red", _this.$group).html(count);
            }
            //取消没有与订单产品对应的选项
            $(".table_view td input[type='checkbox']", _this.$dom).each(function (i, el) {
                var isExist = false;
                T.Each(chks, function (k, v) {
                    if (el.value == v) {
                        isExist = true;
                    }
                });
                if (!isExist) {
                    el.checked = false;
                    $(el).closest(".checkbox").removeClass("sel");
                }
            });
            return true;
        },
        loaded: function (isFirst) {//加载完毕
            var _this = changeFiles;
            if (isFirst && _this.popup) {
                _this.popup.setPosition();
            }
            //绑定选中事件
            if (_this.$dom && _this.$dom.length) {
                T.Checkboxs(_this.$dom[0], 'chk', 'chkall', function (input, checked) {
                    if (input.value) {
                        //设置选中的项
                        _this.check(input.value, checked);
                    }
                });
            }
        },
        submit: function () {
            var _this = this;
            var params = [];
            var action = '';
            if (_this.params.isCard) {//名片类
                action = 'in_order/select_print_file';
                T.Each(_this.params.data, function (i, data) {
                    T.Each(data, function (k, v) {
                        if (v.card_id) {
                            params.push(v);
                        }
                    });
                });
                debugger
                if (params.length == 1) {
                    params[0].order_product_id = _this.product.order_product_id;
                }
                _this.post(action, params);
            } else {//其他产品
                _this.commit();
                /*action = 'in_order/order_product_update';
                 T.Each(_this.params.data, function(i, data){
                 T.Each(data, function(k, v){
                 if(v.file_id&&v.file_url){
                 params.push(v);
                 }
                 });
                 });*/
            }
        },
        commit: function (card) {
            var _this = this;
            var params = [];
            var action = '';
            if (_this.params.isCard && (_this.index == 1 || _this.index == 2)) {//名片类
                action = 'in_order/select_print_file';
                if (card && card.card_id) {
                    params = [{
                        card_id: card.card_id,
                        template_id: card.template_id,
                        order_product_id: _this.product.order_product_id,
                        uploaded: "0"
                    }];
                }
            } else {//其他产品
                action = 'in_order/order_product_update';
                if (_this.uploadParams && _this.uploadParams.type && _this.uploadParams.fileUri && (_this.uploadParams.fileId || _this.uploadParams.fileSize > 0)) {
                    var obj = {
                        type: _this.uploadParams.type,
                        file_url: _this.uploadParams.fileUri,
                        order_product_id: _this.product.order_product_id,
                        uploaded: _this.uploadParams.uploaded || "0"
                    };
                    if (_this.uploadParams.fileId) {
                        obj.file_id = _this.uploadParams.fileId;
                    } else {
                        obj.uploaded = 1;
                    }
                    if (_this.uploadParams.fileSize) {
                        obj.file_size = _this.uploadParams.fileSize;
                    }
                    if (_this.uploadParams.fileName) {
                        obj.sorce_file = _this.uploadParams.fileName;
                    }
                    params = [obj];
                }
            }
            _this.post(action, params);
        },
        post: function (action, params) {//保存选择的文件信息
            var _this = this;
            if (params.length) {
                T.POST({
                    action: action
                    , params: {
                        order_code: odetail.params.o,
                        data: params
                    }
                    , success: function (data) {
                        odetail.reload();
                        if (_this.popup && _this.popup.remove) {
                            _this.popup.remove();
                            _this.popup = null;
                        }
                    }
                    , failure: function (data) {
                        T.msg(data.msg || T.TIPS.DEF);
                        odetail.reload();
                        if (_this.popup && _this.popup.remove) {
                            _this.popup.remove();
                            _this.popup = null;
                        }
                    }
                });
            } else if (_this.params.isUpdate) {
                if (_this.popup && _this.popup.remove) {
                    _this.popup.remove();
                    _this.popup = null;
                }
            } else {
                T.msg("请先选择印刷文件！");
            }
        },
        events: function () {//绑定事件
            var _this = this,
                $searchbar = $(".searchbar");
            $(".search_btn", $searchbar).nextAll().remove();
            var searchbarHtml = $searchbar.html();
            $(".searchbar", _this.$dom).hide();
            _this.$dom.delegate(".ofilter ul li a", "click", function (e) {//选择文件
                var $this = $(this), $li = $this.closest("li");
                var $ul = $this.closest("ul");
                var index = $li.data("type") || 0;
                if (index != 2) {
                    $("a", $ul).removeClass("sel");
                    $this.addClass("sel");
                }
                _this.index = index;//选项卡索引
                $(".change_file[data-type='" + index + "']", _this.$dom).show().siblings(".change_file").hide();
                var $ofilter = $this.closest(".ofilter");
                $(".searchbar").html(searchbarHtml);
                $(".searchbar .textbox", _this.$dom).each(function (i, el) {
                    T.FORM().placeholder(el, _this.index == 1 ? "姓名/职位/手机号" : "文件名/产品名");
                });
                if (index == 1) {
                    $(".searchbar", $ofilter).show();
                } else {
                    $(".searchbar", $ofilter).hide();
                }
                $(".change_file:eq(0)", _this.$dom).removeClass("hide_block_list");
            }).delegate(".block_list .item", "click", function (e) {
                var $this = $(this);
                var type = $this.data("type") || 0;
                $(".ofilter .searchbar", _this.$dom).show();
                $(".searchbar").html(searchbarHtml);
                $(".searchbar .textbox", _this.$dom).each(function (i, el) {
                    T.FORM().placeholder(el, _this.index == 1 ? "姓名/职位/手机号" : ({
                        10: "文件名/产品名",
                        20: "印刷订单编号",
                        30: "设计订单编号"
                    }[type] || ""));
                });
                $(".change_file:eq(0)", _this.$dom).addClass("hide_block_list");
                $(".change_file .block_content .file_type", _this.$dom).text($(".tit", $this).text());
                _this.getFileList(type);
            }).delegate(".searchbar .search_btn", "click", function (e) {//关键字搜索
                var $this = $(this);
                var keyword = $.trim($this.prev(".textbox").val());
                if (keyword !== '') {
                    _this.search(keyword);
                }
                return;
            }).delegate(".searchbar .textbox[name='keyword']", T.EVENTS.input, function (e) {//关键字搜索
                var $this = $(this);
                var keyword = $.trim($this.val());
                if (_this.params.isCard && _this.index == 1) {//名片类
                    if (myCard.PAGIN.keyword === keyword || keyword) {
                        return;
                    }
                } else if (_this.fileType == 10) {//其他产品
                    if (myFile.PAGIN.keyword === keyword || keyword) {
                        return;
                    }
                } else {
                    return;
                }
                _this.search(keyword);
                return;
            }).delegate(".groups .group", "click", function (e) {//提交保存
                var $this = $(this);
                $this.addClass("show").siblings(".group").removeClass("show");
                var value = $this.data("value") || "";
                _this.$group = $this;
                _this.setQuantity(value, true);//设置数量
            }).delegate(".table_view .radio", "click", function (e) {//选择
                var $this = $(this);
                var $table = $this.closest(".table_view");
                var fileId = $("input", $this).val();
                //设置选中的项
                if (_this.params.isCard && _this.index > 0) {
                    $(".radio", $table).removeClass("sel");
                    $this.addClass("sel");
                    _this.check($("input", $this).val(), true, true);
                } else {
                    var file = null, fileUri = "", data = {};
                    if (_this.fileType == 30) {
                        file = T.Array.get(myDesign.data, fileId, "fileId");
                        if (file) {
                            fileUri = file.pdfPath;
                            data = {
                                type: _this.fileType,
                                fileId: file.fileId,
                                fileUri: file.pdfPath,
                                fileName: file.fileName
                            };
                        }
                    } else {
                        file = T.Array.get(myFile.data, fileId, "fileId");
                        if (file) {
                            fileUri = file.fileSrc;
                            data = {
                                type: _this.fileType,
                                fileId: file.fileId,
                                fileUri: file.fileSrc,
                                fileName: file.fileName
                            };
                        }
                    }
                    if (fileUri && data.fileId) {
                        $(".radio", $table).removeClass("sel");
                        $this.addClass("sel");
                        _this.uploadParams = data;
                    }
                }
            }).delegate(".history-order", "click", function (e) { //历史下单记录
                var $tr = $(this).closest("tr");
                var fileId = $("input", $tr).val();
                if (_this.fileType === 30) {
                    var file = T.Array.get(myDesign.data, fileId, "fileId");
                    if (file && file.pdfPath) {
                        HistoryOrder.reload({file_url: file.pdfPath, offset: 0, count: 10, width: 900}, true);
                    }
                } else {
                    var file = T.Array.get(myFile.data, fileId, "fileId");
                    if (file && file.fileSrc) {
                        HistoryOrder.reload({file_url: file.fileSrc, offset: 0, count: 10, width: 900}, true);
                    }
                }
                return false;
            }).delegate(".see-preview", "click", function (e) {//预览
                var $tr = $(this).closest("tr");
                var fileId = $("input", $tr).val();
                var file = null;
                if (_this.fileType === 30) {
                    file = T.Array.get(myDesign.data, fileId, "fileId");
                    if (file && file.fileId && myDesign.imgReg.test(file.pdfPreviewPath)) {
                        Previewer({
                            uris: file.pdfPreviewPath,
                            type: _this.fileType
                        });
                    }
                } else {
                    file = T.Array.get(myFile.data, fileId, "fileId");
                    if (file && file.fileId && myFile.imgReg.test(file.fileSrc)) {
                        Previewer({
                            uris: file.previewPath || file.fileSrc,
                            type: _this.fileType
                        });
                    }
                }
                return false;
            })/*.delegate(".single", "click", function(e){//制作单人名片
             var $card = $(this).closest(".card");
             if(_this.popup){
             _this.popup.remove();
             }
             /!*Designer.get($card.data("template_id")||"", function(card){debugger
             _this.commit(card);
             });*!/
             return false;
             })*/.delegate(".table_view .edit", "click", function (e) {//提交保存
                var $this = $(this), cardId = $this.data("card_id") || "";
                if (cardId) {
                    DesignEditor({
                        cardId: cardId/*,
                         orderCode: _this.product.order_code,
                         orderProductId: _this.product.order_product_id*/
                    }/*, function(card){
                     T.msg("保存成功。");
                     //设置选中的项
                     if($this.closest(".radios").length){ //单选
                     myCard.chks = [card.card_id];
                     myCard.reload(null, false, function(data){
                     _this.check(card.card_id, true, true); //选中当前
                     });
                     }else{
                     if(cardId!=card.card_id){
                     var chks = [];
                     T.Each(myCard.chks, function(i, v){
                     if(v!=cardId){
                     chks.push(v);
                     }
                     });
                     chks.push(card.card_id);
                     myCard.chks = chks;
                     myCard.reload(null, false, function(data){
                     _this.check(cardId, false, false); //取消之前的选中
                     _this.check(card.card_id, true, false); //选中当前
                     });
                     }
                     }
                     myCard.reload();
                     }*/);
                }
                return false;
            }).delegate(".add-card", "click", function (e) {//添加新名片
                $(".ofilter ul li[data-type='2'] a", _this.$dom).click();
                return false;
            }).delegate(".add_file", "click", function (e) {//上传本地文件
                $(".ofilter ul li[data-type='3'] a", _this.$dom).click();
                return false;
            })/*.delegate(".btm_btns .file_btn", "click", function(e){//提交保存
             if(_this.index===0){
             _this.submit();
             }else{
             _this.commit();
             }
             })*/.delegate(".card-list .btns-center .btn-primary", "click", function (e) {//确认选择的名片文件
                _this.submit();
            }).delegate(".file_list .btns-center .btn-primary", "click", function (e) {//确认选择的文件
                if (_this.fileType == 10) {
                    myorder.remind({
                        fileName: _this.uploadParams.fileUri,
                        ok: function () {
                            _this.commit();
                        },
                        no: function () {

                        },
                        cancel: function () {

                        }
                    });
                } else {
                    _this.commit();
                }
            }).delegate(".file_list .btns-center .btn-default", "click", function (e) {//取消
                $(".ofilter ul li:eq(0) a", _this.$dom).click();
                return false;
            }).delegate(".file_upload .btns-center .btn-primary", "click", function (e) {//确认选择的文件
                _this.commit();
            }).delegate(".file_upload .btns-center .btn-default", "click", function (e) {//取消
                if (_this.popup && _this.popup.remove) {
                    _this.popup.remove();
                    _this.popup = null;
                }
            });
        }
    };
    T.Loader(function () {
        odetail.init();
    });
});