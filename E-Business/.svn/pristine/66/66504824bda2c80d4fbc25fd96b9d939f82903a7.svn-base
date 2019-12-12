require(["base", "tools", "location", "uploader", "modules/account_info"], function ($, T, PCD, Uploader, AccountInfo) {
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    var INV_CONTENTS = CFG_DB.INVOICE.CONTENT;
	var INV_CONTENTS_SORT = CFG_DB.INVOICE.CONTENT_SORT;
    var isUploading = false;
    var myinvoice = {
        uuid: T.UUID(),
        isApply: location.hash == '#1',//是否为申请发票
        data: {
            allSurplusInvoicePrice: 0//待开发票金额
        },
        logistics_pop: null,//物流弹出框
        $myinvoice: $("#myinvoice"),//发票历史记录DOM
        $applyinvoice: $("#applyinvoice"),//申请发票DOM
        $invoicePrice: $("input[name='invoice_price']"),//申请发票金额输入框
        status: ['', '', ''],//[发票记录,发票,地址] 加载状态
        PAGIN: {offset: 0, count: 10},//分页配置
        init: function () {//初始化页面
            var _this = this;
            if (_this.isApply) {
                _this.loadForm();
                invoice.get();
                address.get();
            } else {
                _this.loadList();//显示申请发票历史列表
            }
            _this.reload();
            //个人资料
            var accountInfo = AccountInfo();
            accountInfo.on("loaded", function (data, params) {
                //_this.status[1] = '1';
                //_this.reload();
            });
            accountInfo.load();
            _this.bindEvents();
            T.PageLoaded();
        },
        loadList: function () {//显示发票记录
            myinvoice.$myinvoice.addClass("load").show();
            myinvoice.$applyinvoice.hide();
        },
        loadForm: function () {//显示申请发票
            myinvoice.$myinvoice.hide();
            myinvoice.$applyinvoice.addClass("load").show();
        },
        reloaded: function () {
            var _data = myinvoice.data;
            if (myinvoice.loadedCount != 2) return;
            _data.STATUS = {Draft: "待审核", NotPass: "审核不通过", Pass: "审核通过"};
            T.Each(_data.invoiceList, function (i, item) {
                if (item.type == "增值税专用发票") {
                    item._status = "已删除";
                    item._pass = "gray";
                }
                T.Each(myinvoice.addTaxInvoiceList, function (k, v) {
                    if (item.invoiceTemplateId == v.invoiceId) {
                        v._status = item._status = CFG_DB.INVOICE.STATUS[v.status] || "已删除";
                        if (v.status == "Pass") {
                            v._pass = item._pass = "pass";
                        } else if (v.status == "NotPass") {
                            v._pass = item._pass = "red";
                        } else if (v.status == "Draft") {
                            v._pass = item._pass = "draft";
                        }
                    }
                });
            });
            _data.RMB = T.RMB;
            if (parseFloat(_data.agentSurplusInvoicePrice || 0) > 0) {
                $("#myinvoice .colb .icon_help, #applyinvoice .headline .icon_help").css("display", "inline-block");
            }
            //绑定数据
            T.Template('invoice_record', _data, true);
            T.Template('invoice_panel', _data, true);
            //T.BindData('data', _data);
            //T.BindData('form', _data);
            if (myinvoice.PAGIN.count) {//分页控件
                T.Paginbar({
                    num: 3,
                    size: myinvoice.PAGIN.count,
                    total: Math.ceil(_data.count / myinvoice.PAGIN.count),
                    index: Math.ceil(myinvoice.PAGIN.offset / myinvoice.PAGIN.count) + 1,
                    paginbar: 'paginbar',
                    callback: myinvoice.pagin
                });
            }
            myinvoice.$myinvoice.removeClass("load");
            if (myinvoice.isApply) {
                myinvoice.loaded();
            }
        },
        reload: function (params, isFirst) {
            myinvoice.loadedCount = 0;
            if (isFirst === 0) {
                myinvoice.loadedCount++;
            }
            T.GET({
                action: 'in_invoice/invoice_query_add_tax'
                , params: params || myinvoice.PAGIN
                , success: function (data) {
                    myinvoice.loadedCount++;
                    myinvoice.addTaxInvoiceList = data.addTaxInvoiceList || [];
                    myinvoice.reloaded();
                }
            });
            if (isFirst === 0) return;
            T.GET({
                action: 'in_invoice/invoice_order_query'
                , params: params || myinvoice.PAGIN
                , success: function (data) {
                    myinvoice.status[0] = '1';
                    myinvoice.loadedCount++;
                    data = data.data || {};
                    //数据分页处理
                    if (data.invoiceList && data.invoiceList.length > myinvoice.PAGIN.count) {
                        data.count = data.invoiceList.length;
                        data.invoiceList = data.invoiceList.slice(myinvoice.PAGIN.offset, myinvoice.PAGIN.offset + myinvoice.PAGIN.count);
                    }
                    data.allSurplusInvoicePrice = T.RMB(data.allSurplusInvoicePrice); //待开发票金额
                    data.totalConsumePrice = T.RMB(data.totalConsumePrice); //累计消费金额
                    data.totalInvoicePrice = T.RMB(data.totalInvoicePrice); //已开发票金额
                    data.invoiceList = data.invoiceList || [];
                    myinvoice.data = data;
                    myinvoice.reloaded();
                }
            });
        },
        pagin: function (obj, index, size, total) {//发票记录分页处理
            myinvoice.PAGIN.offset = (index - 1) * myinvoice.PAGIN.count;
            myinvoice.reload(myinvoice.PAGIN);
        },
        bindEvents: function () {//绑定事件
            /*T.TIP({
             container: '#myinvoice .colb, #applyinvoice .headline',
             trigger: '.icon_help',
             content: function(trigger) {
             return "其中 "+ T.RMB(myinvoice.data.inSurplusInvoicePrice)+" 元可直接在云印系统申请， "+ T.RMB(myinvoice.data.agentSurplusInvoicePrice)+" 元需要向您的承印网点申请";
             },
             width: 'auto',
             offsetX: 0,
             offsetY: 0
             });*/
            T.TIP({
                container: '#myinvoice',
                trigger: '.invoice .det',
                content: function (trigger) {
                    var invoiceCode = $(trigger).data("code");
                    var arr = '';
                    if (invoiceCode) {
                        var invoice = T.Array.get(myinvoice.data.invoiceList, invoiceCode, 'invoiceCode');
                        if (invoice && invoice.receiveAddress) {
                            arr = [];
                            arr.push('收货地址：' + (invoice.receiveAddress || '').replace(/\^/g, ''));
                            arr.push('收货人：' + (invoice.receiveName || ''));
                            arr.push('手机号：' + (invoice.receiveMobile || invoice.receiveTel || ''));
                            arr = '<div class="adrinfo"><p>' + arr.join('</p><p>') + '</p></div>';
                        }
                    }
                    return arr;
                },
                width: 'auto',
                offsetX: 0,
                offsetY: 0
            });

            myinvoice.$myinvoice.delegate(".headline .btn", "click", function () {//申请发票按钮
                myinvoice.isApplyInvoice = 1;
                myinvoice.loadForm();
                myinvoice.reload();
                invoice.get();
                address.get();
            }).delegate(".logistics", "click", function (e) {//查看发票物流
                var $this = $(this);
                var name = $this.data("name") || "";
                var code = $this.data("code") || "";
                if (name && code) {
                    myinvoice.logistics(name, code);
                }
            }).delegate(".look", "click", function (e) {//查看发票
                var $this = $(this);
                var invoiceId = $this.data("invoicetemplateid") || "";
                var item = T.Array.get(myinvoice.addTaxInvoiceList, invoiceId, "invoiceId");
                if (item && item.invoiceId) {//可能因为被删除无法查看
                    invoice.queryEffectiveTitle(function (data) {
                        invoice.showForm(item, 1);
                    });
                }
            }).delegate(".invoice_download", "click", function (e) {//下载发票
                myinvoice.logInvoiceDownload($(this).data("code"));
            });
            myinvoice.$applyinvoice.delegate(".headline .btn, .cancel", "click", function () {//发票记录按钮
                myinvoice.isApplyInvoice = 0;
                myinvoice.loadList();
                myinvoice.reload();
            }).delegate("input[name='invoice_price']", "blur", function () {//发票金额输入框处理
                var invoice_price = parseFloat($(this).val());
                var ship = '免费寄送';
                if (invoice_price > myinvoice.data.usable_invoice_price) {
                    T.msg('申请发票金额不得超过' + T.RMB(myinvoice.data.usable_invoice_price) + '元！');
                    invoice_price = Math.min(invoice_price, myinvoice.data.usable_invoice_price);
                }
                if (invoice_price < 200) {
                    ship = '运费到付';
                }
                $(this).val(T.RMB(invoice_price));
                $("#invoice_ship").html(ship);
            });

            address.events();//地址列表事件
            invoice.events();//发票列表事件
        },
        applyed: function (data, param) {//申请发票成功
            T.msg('申请发票成功');
            myinvoice.loadList();
            myinvoice.reload();
        },
        /**
         * 下载发票
         * @param invoiceCode
         */
        logInvoiceDownload: function (invoiceCode) {
            if (invoiceCode) {
                T.GET({
                    action: 'in_invoice/log_invoice_order_download'
                    , params: {invoiceCode: invoiceCode}
                    , success: function (data) {
                    }
                    , failure: function (data) {
                    }
                    , error: function (data) {
                    }
                }, function (data) {
                }, function (data) {
                });
            }
        },
        loaded: function () {//数据加载完毕
            if (myinvoice.status.join('') == '111') {
                if (myinvoice.data.allSurplusInvoicePrice <= 0) {//如果待开发票金额为0
                    T.msg('亲，您的待开票金额为0，不可申请发票！');
                    myinvoice.loadList();
                    myinvoice.$myinvoice.removeClass("load");
                    return;
                }
                myinvoice.loadForm();
                myinvoice.status = ['', '', ''];
                myinvoice.$applyinvoice.removeClass("load");
                myinvoice.$invoicePrice.val(T.RMB(myinvoice.data.allSurplusInvoicePrice)).blur();

                //检查发票内容是否有效
                function checkContentType(contentType) {
                    var parts = String(contentType || '').split(',');
                    var bool = true;
                    T.each(parts, function (i, val) {
                        if (!INV_CONTENTS[val]) {
                            bool = false;
                            return false;
                        }
                    });
                    return bool;
                }

                //申请发票
                T.FORM('apply_invoice', CFG_FORM['apply_invoice'], {
                    before: function () {
                        debugger
                        var _this = this;
                        _this.action = '';
                        _this.params.invoice_price = T.RMB(_this.params.invoice_price);
                        var invoiceItem = T.Array.get(invoice.invdb, _this.params.invoice_id, 'invoiceId');
                        if (!invoiceItem || !/^\d+$/.test(_this.params.invoice_id)) {
                            T.msg('请选择要申请的发票信息！');
                        } else if (invoiceItem.titleType != 1 && !invoiceItem.idCode) {
                            $("#invoice_item_" + _this.params.invoice_id + " .upd").click();
                        } else if (!checkContentType(invoiceItem.contentType)) { //发票内容无效
                            $("#invoice_item_" + _this.params.invoice_id + " .upd").click();
                        } else if (_this.params.invoice_type == 2 && !(_this.params.address_id > 0)) {
                            T.msg('请选择寄送地址！');
                        } else if (_this.params.invoice_price <= 0) {
                            T.msg('申请发票金额必须大于0！');
                        } else if (_this.params.invoice_price > parseFloat(myinvoice.data.allSurplusInvoicePrice)) {
                            T.msg('申请发票金额不得超过' + T.RMB(myinvoice.data.allSurplusInvoicePrice) + '元！');
                        } else if (_this._cfm) {
                            _this.action = CFG_FORM.apply_invoice.action;
                        } else {
                            var altStr = (_this.params.invoice_type == 2 && _this.params.invoice_price < 200) ? '，发票运费到付（收到发票时将快递费用直接付给快递人员）。<p class="alt"> <span class="red">温馨提示</span>：发票金额满200元可免快递费，如果您不急于报销，可以累积满200元后统一开票。</p>' : '。';
                            T.cfm('<div class="invoice_alt">您申请发票金额为 <b class="red">' + T.RMB(_this.params.invoice_price) + '</b> 元' + altStr + '<p class="red">申请后将无法取消，是否确认申请？</p></div>', function (_o) {
                                _o.remove();
                                _this._cfm = true;
                                _this.action = CFG_FORM.apply_invoice.action;
                                var params = {
                                    invoice_id: _this.params.invoice_id,
                                    invoice_price: _this.params.invoice_price
                                };
                                if (_this.params.invoice_type == 2) {
                                    params.address_id = _this.params.address_id;
                                }
                                _this.params = params;
                                _this.submit();
                            }, function (_o) {
                                _o.remove();
                            }, '确认申请', '确认申请', '暂不申请');
                        }
                    }
                    , success: function (data, param) {
                        if (invoice.invdom) invoice.invdom.remove();
                        myinvoice.applyed(data, param);
                    }
                });
            }
        },
        logistics: function (com, nu) {//物流查询
            if (!com || !nu) return;
            var _this = this;
            T.GET({
                action: 'in_product/express_query'
                , params: {com: com, nu: nu}
                , success: function (data) {
                    if (data && /^http/.test(data.retUrl)) {
                        myinvoice.logistics_pop = T.Popup({
                            fixed: true,
                            id: myinvoice.uuid + 'logistics_popup',
                            zIndex: 1000,
                            style: 'logistics_popup',
                            title: com + '&nbsp;<b class="red">' + nu + '</b>&nbsp;<span class="alt">（本数据由<a href="http://kuaidi100.com" target="_blank">快递100</a>提供）</span>',
                            width: 528,
                            height: 334,
                            type: 'iframe',
                            content: data.retUrl
                        });
                        myinvoice.logistics_pop.setPosition();
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
        }
    };
    //发票列表
    var invoice = {
        invid: '',
        invdb: [],
        invdom: null,
        invform: null,
        invoiceTitleList: [], //发票抬头集合
        $invlist: $("#invlist"),
        get: function (isAdd) {//获得发票列表
            T.GET({
                action: CFG_DS.invoice.get
                , success: function (data) {
                    myinvoice.status[1] = '1';
                    if (data.invoiceId) {
                        data.invoiceList = [data];
                    } else {
                        data.invoiceList = data.invoiceList || [];
                    }
                    T.Each(data.invoiceList, function (k, v) {
                        v._status = CFG_DB.INVOICE.STATUS[v.status] || "";
                        if (v.status == "Pass") {
                            v._pass = "pass";
                        } else if (v.status == "NotPass") {
                            v._pass = "red";
                        } else if (v.status == "Draft") {
                            v._pass = "draft";
                        }
                    });
                    data.ENUM = CFG_DB.INVOICE;
                    invoice.invdb = data.invoiceList;
                    T.Template('invoice_list', data, true);
                    invoice.checked(isAdd);
                    myinvoice.loaded();
                }
            });
        },
        add: function (data) {
            T.msg("添加成功");
            if (myinvoice.isApplyInvoice) {
                invoice.get(true);
            } else {
                myinvoice.reload(null, 0);
            }
        },
        upd: function (data) {
            T.msg("修改成功");
            if (myinvoice.isApplyInvoice) {
                invoice.get();
            } else {
                myinvoice.reload(null, 0);
            }
        },
        del: function ($li, data) {
            T.msg("删除成功");
            $li.animate({opacity: 0}, 500, function () {
                invoice.get();
            });
        },
        checked: function (isAdd) {
            var $item = $("#invoice_item_" + invoice.invid + " .radio");
            if ($item.length < 1) {
                $item = $("li.invitem:eq(0) .radio", invoice.$invlist);
            }
            if (isAdd) {
                $item = $("li.invitem:last .radio", invoice.$invlist);
            }
            $item.click();
        },
        showForm: function (item, source) {
            var _this = this;
            if (!item) return;
            var _status = item._status ? '<b class="' + item._pass + '">[' + item._status + ']</b>' : '';
            invoice.invdom = T.dailog(invoice.getInvForm(item.contentType), '修改发票信息' + _status);
            $("input[name='invoice_type'][value='" + item.invoiceType + "']", invoice.invform).click();
            $("input[name='title_type'][value='" + item.titleType + "']", invoice.invform).click();
            $("input[name='invoice_title']", invoice.invform).val(item.invoiceTitle || "").focus();
            $("input[name='company_id_code']", invoice.invform).val(item.idCode || "").focus();
            //$("input[name='content_type'][value='" + item.contentType + "']", invoice.invform).click();
            $("input[name='id_code']", invoice.invform).val(item.idCode || "").focus();
            $("input[name='register_address']", invoice.invform).val(item.registerAddress || "").focus();
            $("input[name='register_phone']", invoice.invform).val(item.registerPhone || "").focus();
            $("input[name='bank']", invoice.invform).val(item.bank || "").focus();
            $("input[name='bank_account']", invoice.invform).val(item.bankAccount || "").focus();
            $("input[name='data_path']", invoice.invform).val(item.dataPath || "").focus();
            $("input[name='data_name']", invoice.invform).val(item.dataName || "").focus();
            $("input[name='company_name']", invoice.invform).val(item.invoiceTitle || "").focus();
            $("#hid_invoice_id", invoice.invform).val(item.invoiceId);
            _this.showFileUri("#file_uploaduri", {
                fileUrl: item.dataPath,
                fileName: (item.dataName || item.dataPath || "").replace(/^.*\//, "") //兼容处理
            });
            setTimeout(function () {
                $("#form_item_content_type").removeClass("hide");
                if (item.invoiceId) {//不能修改发票类型
                    $("#form_item_invoice_type").addClass("hide");
                }
                if (item.invoiceType == 2) {//如果是增值税发票，则不能修改发票类型
                    if (source == 1) {
                        $("#form_item_content_type").addClass("hide");
                    }
                }
                $(".form_btm", invoice.invform).removeClass("hide");
                /**
                 * Draft:待审核
                 * NotPass:不通过
                 * Pass:通过
                 */
                if (item.invoiceType == 2 && item.status == "Pass") {//如果是增值税发票，并且通过审核，则发票信息不能修改，只能修改发票内容
                    $("#invoice input[type='text']").attr("readonly", "readonly");
                    $(".file_btn.upload_button", invoice.invform).appendTo("#invoiceTypeOne");
                    //$(".drop-down", invoice.invform).hide();
                    //$("#invoice").addClass("hide-drop-down");
                    if (source == 1) {
                        $(".form_btm", invoice.invform).addClass("hide");
                    }
                    _this.setInvoiceTitleReadonly(true);
                } else {
                    //$(".drop-down", invoice.invform).show();
                    //$("#invoice").removeClass("hide-drop-down");
                    $("#invoice input[type='text']").removeAttr("readonly", "readonly");
                    _this.setInvoiceTitleReadonly(false);
                }
                T.TIP({
                    dom: $(invoice.invform).closest(".popup_panel")[0],
                    container: '#invoice_form',
                    trigger: '.invoice_preview',
                    content: function (trigger) {
                        return $("#invoice_preview_img").html();
                    },
                    style: 'tips_cont',
                    width: 240,
                    left: true,
                    offsetX: -50,
                    offsetY: -363
                });
                if (invoice.invdom) invoice.invdom.setPosition();
            }, 10);
        },
        queryEffectiveTitle: function (cb) {
            var _this = this;
            var invoiceList = [];
            T.GET({
                action: 'in_invoice/query_effective_title'
                , success: function (data) {
                    _this.canInsert = data.canInsert;
                    _this.invoiceTitleList = [];
                    invoiceList = data.invoiceList;
                    T.each(data.invoiceList, function (i, item) {
                        _this.invoiceTitleList.push(item.invoiceTitle);
                    });
                    cb(data);
                }
            });
            $("#invoice").on("mouseenter", ".drop-list", function (e) {
                var $this = $(this),
                    $input = $(".drop-input", $this),
                    $items = $(".drop-items", $this);
                $this.closest(".form_item").css("position", "static");
                $items.width($input.outerWidth() - 2);
                var pos = $input.position();
                $items.css({
                    top: (pos.top + $input.outerHeight() - 1) + 'px',
                    left: pos.left + 'px'
                });
                var htmls = [];
                T.each(_this.invoiceTitleList, function (i, value) {
                    htmls.push('<a class="drop-item" href="javascript:;" title="' + value + '" data-value="' + value + '">' + value + '</a>');
                });
                $items.html(htmls.join(''));
            }).on("mouseenter", ".drop-list .drop-down", function (e) {
                var $this = $(this),
                    $drop = $this.closest(".drop-list");
                $drop.addClass("open");
            }).on("mouseleave", ".drop-list", function (e) {
                var $this = $(this);
                $this.removeClass("open");
                $this.closest(".form_item").css("position", "relative");
            }).on("click", ".drop-item", function (e) {
                var $this = $(this),
                    $drop = $this.closest(".drop-list"),
                    value = $this.data("value");
                if (value != null) {
                    $("input:first", $drop).val(value);
                    T.each(invoiceList, function (i, item) {
                        if (item.invoiceTitle == value) {
                            $("#invoice input[name='id_code']").val(item.idCode == null ? '' : item.idCode).focus();
                            $("#invoice input[name='register_address']").val(item.registerAddress == null ? '' : item.registerAddress).focus();
                            $("#invoice input[name='register_phone']").val(item.registerPhone == null ? '' : item.registerPhone).focus();
                            $("#invoice input[name='bank']").val(item.bank == null ? '' : item.bank).focus();
                            $("#invoice input[name='bank_account']").val(item.bankAccount == null ? '' : item.bankAccount).focus().blur();
                            $("#invoice input[name='data_path']").val(item.dataPath == null ? '' : item.dataPath);
                            _this.showFileUri('#file_uploaduri', {
                                fileUrl: item.dataPath,
                                fileName: (item.dataName || item.dataPath || "").replace(/^.*\//, "") //兼容处理
                            });
                        }
                    });
                }
                $drop.removeClass("open");
                $this.closest(".form_item").css("position", "relative");
            });
        },
        setInvoiceTitleReadonly: function (pass) {
            var _this = this,
                invoiceTitle = _this.invoiceTitleList[0] || '',
                $invoiceTitle = $("#invoice input[name='invoice_title']"),
                $companyName = $("#invoice input[name='company_name']");
            $invoiceTitle.val($.trim($invoiceTitle.val()) || invoiceTitle);
            $companyName.val($.trim($companyName.val()) || invoiceTitle);
            if (_this.canInsert == 'no') {
                $invoiceTitle.attr("readonly", "readonly");
                $companyName.attr("readonly", "readonly");
            } else {
                $("#invoice").addClass("white-drop-down");
            }
            if (_this.invoiceTitleList.length > 0 && !pass) {
                $("#invoice").removeClass("hide-drop-down");
            } else {
                $("#invoice").addClass("hide-drop-down");
            }
        },
        getInvForm: function (contentType) {
            var htmls = ['<span class="field">发票内容：</span><span class="inv-contents">'];
            contentType = contentType == 37 ? '' : contentType;debugger
            var parts = String(contentType || '').split(',');
            T.each(INV_CONTENTS_SORT, function (i, key) {
                var checked = T.Array.indexOf(parts, key) >= 0;
				if(INV_CONTENTS[key]){
					htmls.push('<span class="inv-content"><span class="checkbox ' + (checked ? 'sel' : '') + '">' + INV_CONTENTS[key] + '<input type="checkbox" name="content_type" value="' + key + '" ' + (checked ? 'checked="checked"' : '') + '/></span></span>');
				}
			});
            htmls.push('</span>');
            $(".contents", invoice.invform).html(htmls.join(''));
            return invoice.invform;
        },
        events: function () {
            var _this = this;
            invoice.invform = T.DOM.byId('invoice_form');
            invoice.$invlist.delegate(".addbtn", "click", function (e) {//添加发票
                e.stopPropagation();
                _this.queryEffectiveTitle(function (data) {
                    invoice.invdom = T.dailog(invoice.getInvForm(), '使用新发票');
                    $("#form_item_content_type").removeClass("hide");
                    $("#form_item_invoice_type").removeClass("hide");
                    $(".form_btm", invoice.invform).removeClass("hide");
                    $("#invoice input[type='text']").removeAttr("readonly", "readonly");
                    $(".radios:eq(1) input:checked", invoice.invform).click();
                    $("input[name='title_type'][value='2']", invoice.invform).click();
                    $("#hid_invoice_id", invoice.invform).val("");
                    _this.showFileUri("#file_uploaduri", {fileUrl: "", fileName: ""});//清空上传数据
                    _this.setInvoiceTitleReadonly();
                    T.TIP({
                        dom: $(invoice.invform).closest(".popup_panel")[0],
                        container: '#invoice_form',
                        trigger: '.invoice_preview',
                        content: function (trigger) {
                            return $("#invoice_preview_img").html();
                        },
                        style: 'tips_cont',
                        width: 240,
                        left: true,
                        offsetX: -50,
                        offsetY: -363
                    });
                    invoice.invdom && invoice.invdom.setPosition();
                });
            }).delegate(".radio", "click", function (e) {//选择发票
                var $radio = $(this);
                $(".radio.sel", invoice.$invlist).removeClass("sel");
                $radio.addClass("sel");
                $("input[type='radio']", $radio).attr("checked", "checked");
                invoice.invid = $("input", $(this)).val();
                var invoiceType = $radio.data("type");
                if (invoiceType == 2) {
                    $(".tax-invoice", _this.$applyinvoice).removeClass("hide");
                } else {
                    $(".tax-invoice", _this.$applyinvoice).addClass("hide");
                }
            }).delegate("a.upd", "click", function (e) {//修改发票
                var $li = $(this).closest("li")
                    , invoice_id = $("input", $li).val();
                _this.queryEffectiveTitle(function (data) {
                    if (invoice_id && invoice.invdb) {
                        var item = T.Array.get(invoice.invdb, invoice_id, "invoiceId");
                        invoice.invid = invoice_id;
                        _this.showForm(item);
                    }
                });
                return false;
            }).delegate("a.del", "click", function (e) {//删除发票
                var $li = $(this).closest("li");
                var invoiceId = $("input", $li).val();
                if (!invoiceId) return;
                T.POST({
                    action: CFG_DS.invoice.inv_del
                    , params: {invoice_id: invoiceId}   //参数invoice_id是下划线格式
                    , success: function (data) {
                        invoice.del($li, data);
                    }
                });
                return false;
            });

            //弹窗内
            //保存发票
            T.FORM('invoice', CFG_FORM['invoice'], {
                before: function () {
                    var _this = this;
                    if (isUploading) {
                        T.msg("正在上传证明资料，请稍等");
                        _this.action = ""
                    } else {
                        var params = {};
                        _this.params.invoice_id && (params.invoice_id = _this.params.invoice_id);
                        params.invoice_type = _this.params.invoice_type;
                        params.invoice_title = '';
                        params.id_code = '';
                        if (_this.params.content_type == 37) {
                            _this.action = "";
                            T.alt("联系商务经理告知开票内容");
                            return
                        }
                        if (2 == params.invoice_type) {
                            params.title_type = 2;
                            params.invoice_title = _this.params.company_name;
                            params.id_code = _this.params.id_code;
                            params.register_address = _this.params.register_address;
                            params.register_phone = _this.params.register_phone;
                            params.bank = _this.params.bank;
                            params.bank_account = _this.params.bank_account;
                            if ("" === _this.params.data_path) {
                                _this.action = "";
                                T.msg("请上传证明资料");
                                return
                            }
                            params.data_path = _this.params.data_path
                        } else {
                            params.title_type = _this.params.title_type;
                            1 == _this.params.title_type && (_this.params.invoice_title = "");
                            if (2 == _this.params.title_type) {
                                if ("" === _this.params.invoice_title) {
                                    _this.action = "";
                                    T.msg("请填写单位名称");
                                    return
                                }
                                if ("" === _this.params.company_id_code) {
                                    _this.action = "";
                                    T.msg("请填写纳税人识别号");
                                    return
                                }
                                params.invoice_title = _this.params.invoice_title;
                                params.id_code = _this.params.company_id_code;
                            }
                        }
                        params.content_type = _this.params.content_type;
                        _this.action = params.invoice_id ? CFG_DS.invoice.inv_upd : CFG_DS.invoice.inv_add;
                        _this.params = params;
                    }
                },
                success: function (data, param) {
                    invoice.invdom && invoice.invdom.remove();
                    param.invoice_id ? invoice.upd(data) : invoice.add(data)
                }
            });
            $(invoice.invform).delegate(".form_item input[name='invoice_type']", "click", function (e) { //选择发票类型
                var $this = $(this);
                var invoiceType = $this.val() || 3;
                if (invoiceType == 3) {
                    $("#invoiceTypeOne").removeClass("hide");
                    $("#invoiceTypeTwo").addClass("hide");
                    $("#invoice input[type='text']").removeAttr("readonly", "readonly");
                    $("#invoice .form-warn-info").show();
                } else if (invoiceType == 2) {//增值税发票
                    $("#invoiceTypeOne").addClass("hide");
                    $("#invoiceTypeTwo").removeClass("hide");
                    $("#invoice input[type='text']").removeAttr("readonly", "readonly");
                    $("#invoice .form-warn-info").hide();
                }
                _this.setInvoiceTitleReadonly();
                setTimeout(function () {
                    $(".form_item", invoice.invform).removeClass("error");
                    if (invoice.invdom) invoice.invdom.setPosition();
                }, 10);
            }).on("click", ".form_item input[name='content_type']", function (e) { //选择发票内容
                var $this = $(this);
                var contentType = $this.val();
                var $checkbox = $this.closest(".checkbox")
                var $checkboxs = $(".checkbox", $checkbox.parent().prevAll(".inv-content"));
                if (this.checked) {
                    $checkbox.addClass("sel");
                    if (contentType == 37) {
                        $checkboxs.addClass("dis");
                        $("input", $checkboxs).attr("disabled", "disabled");
                    }
                } else {
                    $checkbox.removeClass("sel");
                    if (contentType == 37) {
                        $checkboxs.removeClass("dis");
                        $("input", $checkboxs).removeAttr("disabled", "disabled");
                    }
                }
            }).find(".form_item input[name='invoice_type'][value='3']").click();
            _this.bindUpload('file_upload', '上传证明资料', '重新上传证明资料');
        },
        showFileUri: function (el, params) {
            var _this = this;
            var name = params.fileName || '';//不用兼容params.sourceFile，该字段并未上传
            //$(".progressbar", _this.invform).html("");
            //$("#file_upload-info").html("");//展示上传进度
            $(el).html('<a href="' + params.fileUrl + '" title="' + name + '" target="_blank">' + name + '</a>');
            //$("#file_upload .uploadify-button-text").text(name?"重新上传证明资料":"上传证明资料");
        },
        /*getFileUri: function(fileName){//生成文件名
         var fileUri = 'invoice' + new Date().getTime() + '/' + T.Base64.URLSafeBase64Encode(encodeURIComponent(fileName));
         return T.Base64.URLSafeBase64Encode(fileUri);
         },
         getFileName: function(fileUri){//解析原文件名
         var fileUri = T.Base64.URLSafeBase64Decode(fileUri.replace(/^.*\// ,"").replace(/\.[A-Za-z]+$/ ,""));
         return decodeURIComponent(T.Base64.URLSafeBase64Decode(fileUri.replace(/^.*\// ,"")));
         },*/
        bindUpload: function (inputId, text, text2) {
            var _this = this;
            new Uploader({
                inputId: inputId,
                text: text,
                text2: text2,
                onSelect: function (params) {//选择文件后表示正在上传
                    isUploading = true;
                },
                onSuccess: function (params) {
                    isUploading = false;
                    $("#" + inputId + "_path").val(params.fileUri);//fileUri填入表单值
                    $("#" + inputId + "_name").val(params.fileName);//fileName填入表单
                    _this.showFileUri('#file_uploaduri', params);
                }
            });
        }
    };
    //地址列表
    var address = {
        adrid: '',
        adrdb: [],
        adrdom: null,
        adrform: null,
        $adrlist: $("#adrlist"),
        get: function (isAdd) {//获得地址列表
            T.GET({
                action: CFG_DS.address.get
                , success: function (data) {
                    myinvoice.status[2] = '1';
                    if (data.addressId) {
                        data.addressList = [data];
                    } else {
                        data.addressList = data.addressList || [];
                    }
                    var _addressList = [];
                    T.Each(data.addressList, function (i, address) {
                        if (address && address.address !== '' && address.receiver !== '' && (address.phone !== '' || address.tel !== '')) {
                            _addressList.push(address);
                        }
                    });
                    data.addressList = _addressList;
                    address.adrdb = data.addressList;
                    T.Template('address_list', data, true);
                    address.checked(isAdd);
                    myinvoice.loaded();
                }
            });
        },
        add: function (data) {
            T.msg("添加成功");
            address.get(true);
        },
        upd: function (data) {
            T.msg("修改成功");
            address.get();
        },
        del: function ($li, data) {
            T.msg("删除成功");
            $li.animate({opacity: 0}, 500, function () {
                address.get();
            });
        },
        def: function ($li, data) {
            T.msg("设置成功");
            $li.addClass("def").siblings("li").removeClass("def");
            address.get();
        },
        checked: function (isAdd) {
            var $item = $("#address_item_" + address.adrid + " .radio");
            if (isAdd) {
                $item = $("li.adritem:last .radio", address.$adrlist);
            }
            if ($item.length < 1) {
                $item = $("li.adritem.def .radio", address.$adrlist);
            }
            if ($item.length < 1) {
                $item = $("li.adritem:eq(0) .radio", address.$adrlist);
            }
            $item.click();
        },
        events: function () {
            address.adrform = T.DOM.byId('address_form');
            address.$adrlist.delegate(".addbtn", "click", function (e) {//添加地址
                e.stopPropagation();
                address.adrdom = T.dailog(address.adrform, '使用新地址');
                $("#hid_address_id", address.adrform).val("");
                $(".form_item .submit", address.adrform).html('添加这个地址<input type="submit" value="">');
                return false;
            }).delegate(".radio", "click", function (e) {//选择地址
                var $radio = $(this);
                $(".radio.sel", address.$adrlist).removeClass("sel");
                $radio.addClass("sel");
                $("input[type='radio']", $radio).attr("checked", "checked");
                address.adrid = $("input", $radio).val();
                return false;
            }).delegate("a.def", "click", function (e) {//设置默认地址
                var $this = $(this).closest("li");
                var address_id = $this.attr("id").replace(/^address_item_/, "");
                if (!address_id) return;
                T.POST({
                    action: CFG_DS.address.adr_def
                    , params: {address_id: address_id}
                    , success: function (data) {
                        address.def($this, data);
                    }
                });
                return false;
            }).delegate("a.upd", "click", function (e) {//修改地址
                var $this = $(this).closest("li");
                var addressId = $this.attr("id").replace(/^address_item_/, "");
                if (!addressId || !address.adrdb) return;
                var item = T.Array.get(address.adrdb, addressId, 'addressId');
                if (!item) return;
                address.adrid = addressId;
                address.adrdom = T.dailog(address.adrform, '修改收货地址');
                var pca = item.address;
                if (!pca) return;
                var arr = [];
                if (pca) arr = pca.split('^');
                PCD.initSelect('address', arr[0] || '', arr[1] || '', arr[2] || '');
                $("input[name='address']", address.adrform).val(arr[3] || '').focus();
                $("input[name='phone']", address.adrform).val(item.phone).focus();
                $("input[name='tel']", address.adrform).val(item.tel).focus();
                $("input[name='email']", address.adrform).val(item.email).focus();
                $("input[name='receiver']", address.adrform).val(item.receiver).focus();
                $(".form_item .submit", address.adrform).html('保存这个地址<input type="submit" value="">');
                $("#hid_address_id", address.adrform).val(item.addressId);
                return false;
            }).delegate("a.del", "click", function (e) {//删除地址
                var $this = $(this).closest("li");
                var address_id = $this.attr("id").replace(/^address_item_/, "");
                if (!address_id) return;
                T.POST({
                    action: CFG_DS.address.adr_del
                    , params: {address_id: address_id}
                    , success: function (data) {
                        address.del($this, data);
                    }
                });
                return false;
            });
            //保存地址
            T.FORM('address', CFG_FORM['address'], {
                before: function () {
                    debugger;
                    var _this = this;
                    var params = {
                        receiver: _this.params.receiver
                        ,
                        address: _this.params.province + '^' + _this.params.city + '^' + _this.params.area + '^' + _this.params.address
                    };
                    if (_this.params.address_id) params.address_id = _this.params.address_id;
                    if (_this.params.phone) params.phone = _this.params.phone;
                    if (_this.params.tel) params.tel = _this.params.tel;
                    if (_this.params.email) params.email = _this.params.email;
                    _this.action = _this.params.address_id ? CFG_DS.address.adr_upd : CFG_DS.address.adr_add;
                    _this.params = params;
                    if (_this.params.address_id) {
                        _this.data = T.Array.get(address.adrdb, _this.params.address_id, 'addressId');
                    } else {
                        _this.data = {};
                    }
                }
                , success: function (data, param) {
                    if (address.adrdom) address.adrdom.remove();
                    param.address_id ? address.upd(data) : address.add(data);
                }
            });
        }
    };
    T.Loader(function () {
        myinvoice.init();
    });
});