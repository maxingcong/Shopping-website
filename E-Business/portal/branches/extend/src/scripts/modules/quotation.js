define("modules/quotation", ["base", "tools", "modules/quotation-data", "uploader", "location"], function ($, T, QuotationData, Uploader, PCD) {
    function Quotation(options) {
        this.init(options);
    }

    Quotation.prototype = {
        data: {
            quotationId: "", //询价单ID
            productList: [], //可询价产品集合
            quoterList: [{quoterCode: '', quoterName: '系统自动分配'}], //报价员
            quotation: {}, //询价单信息
            uploadParams: {} //上传的附件信息
        },
        formAction: "in_quotation/insert_quotation",
        keys: ['material', 'roundCorner', 'hotStamping', 'foldingType', 'printingMode', 'surfaceTreatment', 'bindType', 'coverMaterial', 'pageMaterial', 'pageCount', 'ropeShape', 'stringType', 'uv'],
        status: ["", "", ""], //[可询价产品集合,询价单信息,报价员信息]
        init: function (options) {
            var that = this;
            options = options || {};
            that.data.productId = options.productId || "";
            that.data.quotationId = options.quotationId || "";
            if ((options.quotation && options.quotation.id) || !options.quotationId) {
                that.status[1] = 1;
                that.data.quotation = options.quotation || {};
                that.data.quotationId = that.data.quotation.id || "";
            }
        },
        load: function () {
            var that = this;
            that.getQuotationProduct();
            if (that.status[1]) {
                that.loaded(null, null, 1);
            } else {
                that.getQuotationDetail(that.data.quotationId);
            }
            if (T._TYPE > 1) {
                that.getQuoterList()
            } else {
                that.data.quoterList = [];
                that.loaded(null, null, 2);
            }
        },
        /**
         * 渲染
         * @param templateId 模板
         */
        render: function (cont, templateId, formId) {
            var that = this;
            var ret = that.data.quotation;
            that.$cont = $(cont);
            ret.productList = that.data.productList;
            ret.quoterList = that.data.quoterList;
            that.data.quotation.productId = that.data.quotation.productId || that.data.productId || 200044;
            if (!QuotationData[that.data.quotation.productId]) {
                that.data.quotation.productId = 200055;
            }
            if (T.RE.mobile.test(T._ACCOUNT) && !ret.phone) {
                ret.phone = T._ACCOUNT;
            }
            if (T.RE.email.test(T._ACCOUNT) && !ret.email) {
                ret.email = T._ACCOUNT;
            }
            that.events();

            console.log('quotation', ret);
            ret.icons = {
                200044: 'p-icon-1',
                200047: 'p-icon-2',
                200051: 'p-icon-3',
                200046: 'p-icon-4',
                200045: 'p-icon-5',
                200050: 'p-icon-6',
                200049: 'p-icon-7',
                200048: 'p-icon-8',
                200074: 'p-icon-9',
                200076: 'p-icon-10',
                200075: 'p-icon-11',
                200055: 'p-icon-12'
            };
            that.$cont.html(T.Compiler.template(templateId, ret));
            that.renderAttrItems();
            that.$cont.removeClass("load");

            //配送地址
            var address = that.data.quotation.address || T.cookie('_address') || CFG_DB.DEF_PCD,
                $address = $("#delivery_address");
            $address.data("value", address);
            $(".value", $address).text(address.replace(/\^/g, ''));
            if (!formId) return;
            $address.geoLocation({
                level: 3,
                defaultAddress: that.data.quotation.address || "",
                callback: function (value, province, city, district) {
                    $("#delivery_region").geoLocation("setValue", value);
                }
            });
            that.data.uploadParams = {
                fileUri: ret.attachmentPath || "",
                fileName: ret.attachmentName || (ret.attachmentPath || "").replace(/^.*\//, "")
            };
            that.uploader = Uploader({
                params: $.extend({
                    id: T.UUID()
                }, that.data.uploadParams),
                auto: true,
                type: "*",
                prefix: "200000-",
                inputId: "file_upload",
                sizeLimit: "20M",
                text: "点击上传",
                text2: "重新上传",
                uiCfg: {
                    name: true, //是否显示文件名
                    size: true, //是否显示文件大小
                    progress: true, //是否显示上传进度
                    loaded: false, //是否显示已上传
                    speed: true, //是否显示上传速度
                    remove: true //是否显示删除上传完成的文件
                },
                onSuccess: function (params) {//上传成功
                    that.data.uploadParams = params;
                },
                onCancel: function (file) {
                    that.data.uploadParams = {};
                },
                onRemove: function (file) {
                    that.data.uploadParams = {};
                }
            });
            T.TIP({
                container: '#' + formId,
                trigger: '.icon_help',
                content: function (trigger) {
                    return $(trigger).data("text") || "";
                },
                'max-width': '360px',
                width: 'auto',
                offsetX: 0,
                offsetY: 0
            });
        },
        /**
         * 是否为尺寸输入框
         * @param name
         * @param value
         */
        inputSize: function (name, value) {
            if (name == 'uv' && value == 'UV') {
                return true;
            } else if (name == 'hotStamping') {
                if (value == '单面烫金' || value == '双面烫金' || value == '单面烫银' || value == '双面烫银') {
                    return true;
                }
            }
        },
        /**
         * 渲染属性选项
         * @param productId
         */
        renderAttrItems: function (productId) {
            var that = this,
                data = that.data.quotation;
            data.productId = productId || data.productId || 200044;
            var $products = $("#products"),
                $quotationItems = $("#quotation-items"),
                attrData = QuotationData[data.productId] || QuotationData[200055];
            console.log(attrData);
            data.attrData = attrData;
            data.inputSize = that.inputSize;
            data.selected = function (name, value, values, idx) {
                console.log(name, data[name], value, values, idx);
                var defValue = data[name] == null ? '' : data[name];
                if (defValue == value) {
                    return 'p-sel';
                } else {
                    if (T.Array.indexOf(values, defValue) < 0) {
                        if (data[name] && value == '其它') {
                            return 'p-sel';
                        } else if (idx == 0 && !data[name]) {
                            return 'p-sel';
                        }
                    }
                }
            };
            var html = T.Compiler.template("quotation_form_items", data);
            if ($quotationItems.length) {
                $quotationItems.replaceWith(html);
            } else {
                $products.after(html);
            }
            $(".form-text", that.$cont).each(function (i, el) {
                if ($(el).val() != '') {
                    $(el).siblings(".form-placeholder").hide();
                }
            });
            $(".p-attr[data-name='install'] .p-value.p-sel", $products.parent()).click();
        },
        renderRelationItems: function (name, value) {
            var that = this,
                data = that.data.quotation,
                attrData = QuotationData[data.productId],
                $quotationItems = $("#quotation-items"),
                attr = T.Array.get(attrData, name, 'name');
            if (attr && attr.relation && attr.relation[value]) {
                T.each(attr.relation[value], function (key, val) {
                    $(".p-attr[data-name='" + key + "']", $quotationItems)[val ? 'show' : 'hide']();
                });
            }
        },
        /**
         * 加载完成
         */
        loaded: function (data, params, index) {
            var that = this;
            that.status[index] = 1;
            if (that.status.length === that.status.join("").length) {
                if (that.data.quotation.isBack == 1) { //询价单被退回，未通过审核
                    that.formAction = "in_quotation/update_quotation";
                }
                that.trigger("loaded");
            }
        },
        /**
         * 查询可询价产品集合
         */
        getQuotationProduct: function () {
            var that = this;
            T.GET({
                action: "in_product/query_quotation_product",
                params: {},
                success: function (data, params) {
                    data.allQuatation = data.allQuatation || [];
                    var productList = [];
                    for (var k = 0; k < data.allQuatation.length; k++) {
                        productList = productList.concat(data.allQuatation[k].products);
                    }
                    //排序，将其他定制放到最后一个
                    for (var i = 0, len = productList.length; i < len; i++) {
                        if (productList[i].productId == 200055) {
                            productList.push(productList.splice(i, 1)[0]);
                            i = len;
                        }
                    }
                    that.data.productList = productList;
                    that.loaded(data, params, 0);
                }
            });
        },
        /**
         * 询价单详情
         * @param id 询价单ID
         */
        getQuotationDetail: function (id) {
            var that = this;
            T.GET({
                action: "in_quotation/quotation_detail",
                params: {id: id, from: "User"},
                success: function (data, params) {
                    var quotation = data.quotation || {};
                    if (typeof(quotation.printingMode) == "undefined") {
                        quotation.printingMode = "";
                    }
                    if (typeof(quotation.surfaceTreatment) == "undefined") {
                        quotation.surfaceTreatment = "";
                    }
                    if (typeof(quotation.qualityRequirements) == "undefined") {
                        quotation.qualityRequirements = "";
                    }

                    //处理自定义默认值
                    /*quotation.pageMaterial = '水水水水水水水';
                     quotation.roundCorner = 'roundCorner';
                     quotation.hotStamping = '双面烫银（100mm*80mm）';
                     quotation.uv = 'UV（100mm*80mm）';*/
                    T.each(that.keys, function (i, key) {
                        var value = quotation[key];
                        if (value) {
                            var parts = value.match(/^(.*?)（(.*?)）$/);
                            if (parts && parts.length == 3) {
                                quotation[key + 'Original'] = value;
                                quotation[key] = parts[1];
                                var sizes = parts[2].match(/^(\d*)mm\*(\d*)mm$/i);
                                if (sizes && sizes.length > 2) {
                                    if (sizes.length == 3) {
                                        quotation[key + 'Width'] = sizes[1]; //宽
                                        quotation[key + 'Height'] = sizes[2]; //高
                                    } else if (sizes.length == 4) {
                                        quotation[key + 'Length'] = sizes[1]; //长
                                        quotation[key + 'Width'] = sizes[2]; //宽
                                        quotation[key + 'Height'] = sizes[3]; //高
                                    }
                                } else {
                                    quotation[key + 'Other'] = parts[2]; //其它
                                }
                            }
                        }
                    });

                    that.data.quotation = quotation;
                    that.loaded(data, params, 1);
                },
                failure: function (data, params) { //查询失败不影响产品加载
                    that.loaded(data, params, 1);
                }
            });
        },
        /**
         * 查询报价员列表
         */
        getQuoterList: function () {
            var that = this;
            T.GET({
                action: "in_quotation/query_quoter_list",
                success: function (data, params) {
                    that.data.quoterList = data.quoterList || [];
                    that.data.quoterList.unshift({quoterCode: '', quoterName: '系统自动分配'});
                    that.loaded(data, params, 2);
                }
            });
        },
        formatValue: function (value) {
            return (value + "").replace(/[:_'"]+/g, "");
        },
        getValue: function () {
            var that = this,
                data = that.data.quotation,
                attrData = data.attrData,
                params = {
                    productName: '',
                    number: '',
                    productSize: '',
                    foldingSize: '',
                    material: '',
                    foldingType: '',
                    printingMode: '',
                    surfaceTreatment: '',
                    qualityRequirements: '',
                    bindType: '',
                    coverMaterial: '',
                    pageMaterial: '',
                    pageCount: '',
                    laminating: '',
                    roundCorner: '',
                    hotStamping: '',
                    uv: '',
                    cutting: '',
                    dieCutting: '',
                    shape: '',
                    ropeShape: '',
                    stringType: '',
                    lamplight: '',
                    backMaterial: '',
                    install: '',
                    installTime: ''
                }, ret = true;
            T.each(attrData, function (i, attr) {
                params[attr.name] = '';
                var value, isInput = false, $value = $(".form-group .form-text[name='" + attr.name + "']", that.$cont);
                if ($value.length) {
                    isInput = true;
                    value = $.trim($value.val());
                } else {
                    $value = $(".p-attr[data-name='" + attr.name + "']:visible .p-value.p-sel", that.$cont);
                    if ($value.length) {
                        value = $.trim($value.data("value"));
                        if ($(".p-custom", $value).length) {
                            if (!$(".p-custom", $value).hasClass("done")) {
                                T.msg("您还有属性未经确认，请点击ok确认后再提交！");
                                ret = false;
                                return false;
                            }
                            var pUnit = $.trim($(".unit:first", $value).text()),
                                pSign = $.trim($(".sign:first", $value).text()),
                                w = $.trim($("input[name='w']", $value).val()),
                                h = $.trim($("input[name='h']", $value).val()),
                                parts = [w, pUnit];
                            if ($("input", $value).length > 1) {
                                parts = [w, pUnit, pSign, h, pUnit];
                            }
                            if (value == '其它') {
                                value = parts.join('');
                            } else {
                                value += '（' + parts.join('') + '）';
                            }
                        }
                    }
                }
                if (value) {
                    params[attr.name] = that.formatValue(value);
                    if (attr.name == 'number' && !/^[0-9]{1,10}[\u4e00-\u9fa5]{1}$/.test(params.number)) {
                        T.msg("数量必须带单位，如：10盒、100个，50张");
                        ret = false;
                        return false;
                    }
                    if (attr.name == 'product_size' && !/^[\u4e00-\u9fa5]?[1-9]+\d{0,7}(\.\d{1,2})?\*[\u4e00-\u9fa5]?[1-9]+\d{0,7}(\.\d{1,2})?(\*[\u4e00-\u9fa5]?[1-9]+\d{0,7}(\.\d{1,2})?)?$/.test(params.product_size)) {
                        T.msg("产品尺寸书写格式不正确");
                        ret = false;
                        return false;
                    }
                } else if (attr.name != 'otherRequirements' && attr.name != 'installTime') {
                    if (isInput) {
                        T.msg("请填写" + $value.closest(".form-group").data("attr"));
                    }
                    ret = false;
                    return false;
                }
            });
            return ret && T.FormatData(params);
        },
        getParams: function () {
            var that = this,
                quotation = that.data.quotation;
            if (that.uploader && that.uploader.isUploading) {
                T.msg("您的附件正在上传，请上传完毕后再提交！");
                return;
            }
            var params = that.getValue();
            if (params) {
                if ($(".p-value.p-sel .p-custom", that.$cont).length != $(".p-value.p-sel .p-custom.done", that.$cont).length) {
                    T.msg("您还有属性未经确认，请点击ok确认后再提交！");
                    return;
                }
                params.product_id = quotation.productId;
                params.target_id = 200000;
                params.address = $('#delivery_address').data('value') || CFG_DB.DEF_PCD;//收货地址
                params.quoterCodes = T.GetChecked(document.getElementById('quoterList'), 'quoterCodes', false, true).join(';')
                if (quotation.isBack == 1) { //询价单被退回，未通过审核
                    params.id = quotation.id;
                    params.update_point = 'User'; //修改人所在的节点
                    params.updator = T._SACCOUNT || T._ACCOUNT; //创建者
                } else {
                    params.source = 'User'; //用户
                    params.creator = T._SACCOUNT || T._ACCOUNT; //创建者
                }
                params.inquirer = T._ACCOUNT; //询价人
                //联系人手机
                params.phone = $.trim($("input[name='phone']", that.$cont).val());
                if (!T.RE.mobile.test(params.phone)) {
                    if (params.phone === '') {
                        T.msg("请填写联系人手机");
                    } else {
                        T.msg("手机号格式有误，请重新填写");
                    }
                    return;
                }
                //联系人邮箱
                params.email = $.trim($("input[name='email']", that.$cont).val());
                if (params.email !== '' && !T.RE.email.test(params.email)) {
                    T.msg("邮箱格式有误，请重新填写");
                    return;
                }
                //附件
                if (that.data.uploadParams && that.data.uploadParams.fileUri && that.data.uploadParams.fileName) {
                    params.attachment_path = that.data.uploadParams.fileUri;
                    params.attachment_name = that.data.uploadParams.fileName;
                }
                return params;
            }
        },
        submit: function () {
            var that = this;
            if ($(".submit", that.$cont).hasClass("dis")) return;
            var formData = that.getParams();
            if (formData) {
                $(".submit", that.$cont).addClass("dis");
                that.timeObj = setTimeout(function () {
                    $(".submit", that.$cont).removeClass("dis");
                }, 30000);
                T.POST({
                    action: that.formAction,
                    params: formData,
                    success: function (data, params) {
                        if (data.id) {
                            window.location = T.DOMAIN.MEMBER + "odetail.html?o=" + data.id + '&t=20';
                        } else {
                            location.reload();
                        }
                    },
                    failure: function (data, params) {
                        T.msg(data.msg || T.TIPS.DEF);
                        $(".submit", that.$cont).removeClass("dis");
                    }
                }, function (data, params) {
                    T.msg(data.msg || T.TIPS.DEF);
                    $(".submit", that.$cont).removeClass("dis");
                }, function (data, params) {
                    T.msg(data.msg || T.TIPS.DEF);
                    $(".submit", that.$cont).removeClass("dis");
                });
            }
        },
        /**
         * 验证自定义输入
         * @param $this
         */
        checkValue: function ($this) {
            var that = this,
                $attr = $this.closest(".p-attr"),
                $value = $this.closest(".p-value"),
                $custom = $this.closest(".p-custom"),
                $inputs = $("input", $custom),
                name = $.trim($attr.data("name")),
                attr = $.trim($attr.data("attr")),
                value = $.trim($value.data("value")),
                pUnit = $.trim($value.data("unit")),
                pSign = $.trim($value.data("sign")),
                pValue = $custom.data("value"),
                values = [];
            $inputs.each(function (i, el) {
                var val = $.trim($(el).val());
                if (that.inputSize(name, value)) {
                    if (/^\d+$/.test(val)) {
                        values.push(val + pUnit);
                    } else {
                        T.msg("请填写大于0的数字");
                    }
                } else {
                    if (val !== '') {
                        values.push(val + pUnit);
                    } else {
                        T.msg("请填写" + attr);
                    }
                }
            });
            if ($inputs.length > 0 && values.length == $inputs.length) {
                $custom.data("value", values.join(pSign));
                $custom.addClass("done");
            } else if (values.join(pSign) === pValue) {
                $custom.addClass("done");
            } else {
                $custom.removeClass("done");
            }
        },
        events: function () {
            var that = this;
            that.$cont.on("click.value", ".p-value", function (e) {
                var $this = $(this),
                    value = $this.data("value"),
                    name = $this.closest(".p-attr").data("name");
                $this.addClass("p-sel").siblings(".p-value").removeClass("p-sel");
                that.renderRelationItems(name, value);
                if (name == "productId") {
                    that.renderAttrItems(value);
                }
            }).on("valueChange.location", ".mod_selectbox", function (e, data) {//改变配送区域
                data = data || {};
                that.data.address = data.value || CFG_DB.DEF_PCD;
            }).on("click.ok", ".p-custom .handle", function (e) {
                that.checkValue($(this));
            }).on(T.EVENTS.input + ".ok", ".p-custom input", function (e) {
                var $this = $(this),
                    $custom = $this.closest(".p-custom");
                $custom.removeClass("done");
            }).on("change.quoter", "#quoterList input", function (e) {//报价员
                var $this = $(this);
                if (this.checked) {
                    $this.parent().addClass("sel")
                    if (!this.value) {
                        $this.parent().siblings(".checkbox").each(function (i, el) {
                            $(el).addClass("dis")
                            $("input", el).attr("disabled", "disabled")
                        })
                    }
                } else {
                    $this.parent().removeClass("sel")
                    if (!this.value) {
                        $this.parent().siblings(".checkbox").each(function (i, el) {
                            $(el).removeClass("dis")
                            $("input", el).removeAttr("disabled")
                        })
                    }
                }
            }).on("click.submit", ".submit.yellow-btn", function (e) {//立即询价
                that.submit();
            });
        }
    };
    //具备事件功能
    T.Mediator.installTo(Quotation.prototype);
    return function (options) {
        return new Quotation(options);
    };
});
