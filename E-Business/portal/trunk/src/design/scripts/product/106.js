require(["base", "tools", "design/product/main", "uploader"], function ($, T, DemandMain, Uploader) {
    var demandMain,
        Demand = {
            data: {
                language: "zh-cn",//名片语言
                quantity: 1,
                cardList: [], //名片信息
                widths: {
                    "公司名称": 200,
                    "公司名称（英文）": 200,
                    "公司地址": 300,
                    "公司地址（英文）": 300,
                    "公司网站": 200
                },
                fields: {}, //名片字段
                fieldOrder: ["姓名","姓名（英文）","职位","职位（英文）","公司名称","公司名称（英文）","公司地址","公司地址（英文）","邮箱","手机","座机","传真","公司网站","微信","QQ","添加信息1","添加信息2","添加信息3"], //字段排序
                fieldList: ["姓名","职位","公司名称","公司地址","姓名（英文）","职位（英文）","公司名称（英文）","公司地址（英文）","邮箱","手机","座机","传真","公司网站"],
                relationPrintOrderSerialNumber: [] //印刷订单商品序号
            },
            cardInfos: {}, //名片信息，按字段名及索引存取
            $cont: $("#demand"),
            init: function(){
                var _this = this;
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){debugger
                    param['中/英文'] = {'zh-cn': '中文', 'en-us': '英文'}[_this.data.language]||'中/英文';
                    if(_this.data.quantity<=1){
                        //设置名片字段信息
                        var _setFieldValue = function(field, isEmpty, hasLanguage){
                            var _value = forms[field]===''&&!isEmpty?"":forms[field];
                            if(hasLanguage){
                                if(_this.data.language=='zh-cn'&&/（英文）$/.test(field)){
                                    _value = '';
                                }else if(_this.data.language==='en-us'&&!/（英文）$/.test(field)){
                                    _value = '';
                                }
                            }
                            if($('input[name='+field.replace(/（英文）$/,'')+']', _this.$cont).siblings(".checkbox").hasClass("sel")){
                                param[field] = _value;
                            }
                        };
                        _setFieldValue('姓名', false, true);
                        _setFieldValue('姓名（英文）', false, true);
                        _setFieldValue('职位', false, true);
                        _setFieldValue('职位（英文）', false, true);
                        _setFieldValue('邮箱');
                        _setFieldValue('手机');
                        _setFieldValue('座机');
                        _setFieldValue('微信');
                        _setFieldValue('QQ');
                        _setFieldValue('公司名称', false, true);
                        _setFieldValue('公司名称（英文）', false, true);
                        _setFieldValue('公司网站');
                        _setFieldValue('传真');
                        _setFieldValue('公司地址', false, true);
                        _setFieldValue('公司地址（英文）', false, true);
                        _setFieldValue('添加信息1');
                        _setFieldValue('添加信息2');
                        _setFieldValue('添加信息3');
                        if(forms['补充信息']!==''){
                            param['补充信息'] = forms['补充信息'];
                        }
                    }else{
                        var cont = 0;
                        T.Each(_this.data.cardList, function(i, rowData){
                            if(i>0){
                                if(rowData.join("")==""){
                                    cont++;
                                }
                            }
                        });
                        if(cont>0){
                            T.msg("您还有 "+ cont +" 款名片信息未填写，请填写完成再提交！");
                            return false;
                        }else{
                            param['名片信息'] = _this.data.cardList||[];
                        }
                    }
                });
                demandMain.on("render.before", function(){debugger
                    var demand = demandMain.data.demand||{},
                        paramsInfo = demand.paramsInfo||{};
                    _this.data.quantity = demandMain.data.printProductList.length||1;
                    _this.setFields();
                    if(paramsInfo['中/英文']=='中文'){
                        _this.data.language = "zh-cn";
                    }else if(paramsInfo['中/英文']=='英文'){
                        _this.data.language = "en-us";
                    }else if(paramsInfo['中/英文']=='中/英文'){
                        _this.data.language = "";
                    }
                    if(paramsInfo["名片信息"] && paramsInfo["名片信息"][0] && paramsInfo['名片信息'][0].length>0){
                        _this.data.quantity = paramsInfo["名片信息"].length-1;
                        _this.data.fieldList = paramsInfo["名片信息"][0];
                        _this.data.cardList = _this.getEmptyTemplate();
                        T.Each(paramsInfo["名片信息"], function(i, rowData){
                            if(i>0){
                                T.Each(rowData, function(k, value){
                                    _this.setFieldValue(k, i, value);
                                });
                            }
                        });
                    }else if(_this.data.quantity>1){ //构造名片表格数据
                        _this.getExcelTemplate();
                    }
                    _this.data.paramsInfo = demandMain.data.paramsInfo;
                }).on("render.after", function(){
                    T.Template("field_info", _this.data, true);
                    T.Template("field_list", _this.data, true);
                }).on("render.completed", function(){
                    Uploader({
                        type: "xls,xlsx",
                        inputId: "import_excel",
                        text: "批量导入",
                        text2: "批量导入",
                        errorMsg: "只能导入Excel文件",
                        onSuccess: function(params){
                            $('#import_excel_uris').html('<a href="'+params.fileUri+'" title="'+params.fileName+'" target="_blank">'+params.fileName+'</a>');
                            _this.importExcel(params);
                        }
                    });
                    //Excel模板下载
                    $("#excel_tmpl").click(function(e){
                        _this.getExcelTemplate(true);
                    });
                });
                demandMain.init({
                    isMulti: true,
                    required: true,
                    isContactTime: true, //联系时段
                    custom: [{
                        attrName: "行业"
                    }, {
                        attrName: "风格"
                    },{
                        attrName: "色系"
                    }],
                    namesOrder: ["行业", "风格", "色系"],
                    placeholders: {
                        '姓名':'云小印',
                        '姓名（英文）':'Small Cool',
                        '职位':'设计师',
                        '职位（英文）':'Designer',
                        '邮箱':'xiao@ininin.com',
                        '手机':'18600000000',
                        '座机':'400-6809111',
                        '微信':'18600000000',
                        'QQ':'4008601846',
                        '公司名称':'云印',
                        '公司名称（英文）':'INININ',
                        '公司网站':'www.ininin.com',
                        '传真':'0755-12345678',
                        '公司地址':'深圳市南山区科技园源兴科技大厦南座1403',
                        '公司地址（英文）':'Yuanxing 1403,Nanshan Disctict,SHenzhen',
                        '添加信息1':' ',
                        '添加信息2':' ',
                        '添加信息3':' ',
                        '补充信息':'请您在此处补充说明还需要展示的信息，或者您对信息的排版建议，如：\n补充信息：公司口号，经营范围，\n排版说明：中英文名片需要在同一面上下排版'
                    }
                });
                _this.events();
            },
            /**
             * 设置字段
             */
            setFields: function () {
                var _this = this;
                _this.data.fields = {};
                T.Each(_this.data.fieldList, function(i, field){
                    _this.data.fields[field] = true;
                });
            },
            /**
             * 设置字段值
             * @param colIndex 列索引
             * @param rowIndex 行索引
             * @param value 字段值
             */
            setFieldValue: function(colIndex, rowIndex, value){
                var _this = this,
                    field = _this.data.cardList[0][colIndex], //获取字段名
                    rowData = _this.data.cardList[rowIndex]||[]; //获取指定行数据
                if(field && rowData && rowData.length){
                    if(value==null){
                        value = _this.cardInfos[field + "-" + rowIndex];
                    }
                    if(value==null){
                        value = "";
                    }
                    _this.cardInfos[field + "-" + rowIndex] = value; //缓存字段值
                    _this.data.cardList[rowIndex][colIndex] = value; //为字段赋值
                }
            },
            /**
             * 获取空白模板数据
             * @param isFill 是否填充数据
             * @returns {*[]}
             */
            getEmptyTemplate: function(isFill){
                var _this = this,
                    fieldList = [];
                if(_this.data.language=="zh-cn"){
                    T.Each(_this.data.fieldList, function(i, field){
                        if(field.indexOf("（英文）")<0){
                            fieldList.push(field);
                        }
                    });
                }else if(_this.data.language=="en-us"){
                    T.Each(_this.data.fieldList, function(i, field){
                        if(field!="姓名" && field!="职位" && field!="公司名称" && field!="公司地址"){
                            fieldList.push(field);
                        }
                    });
                }else{
                    T.Each(_this.data.fieldList, function(i, field){
                        fieldList.push(field);
                    });
                }
                var fieldOrder = [];debugger
                T.Each(_this.data.fieldOrder, function(i, field){
                    T.Each(fieldList, function(k, value){
                        if(field==value){
                            fieldOrder.push(field);
                        }
                    });
                });
                var temp = [fieldOrder],
                    colNum = fieldOrder.length;
                for(var i=1; i<=_this.data.quantity; i++){
                    var rowData = [];
                    for(var k=0; k<colNum; k++){
                        var key = fieldOrder[k] + "-" + i
                        if(_this.cardInfos[key]==null || !isFill){
                            rowData.push("");
                        }else{
                            rowData.push(_this.cardInfos[key]);
                        }
                    }
                    temp.push(rowData);
                }
                return temp;
            },
            getExcelTemplate: function(isDown){
                var _this = this;
                _this.setFields();
                _this.data.cardList = _this.getEmptyTemplate(true);
                T.Template("field_list", _this.data, true);
                //生成模板
                if(isDown){
                    if(_this.data.cardList.length){
                        T.POST({
                            action: "in_order/download_requirement_template",
                            params: {param: _this.getEmptyTemplate()},
                            success: function(data){
                                if(data.excelUrl){
                                    _this.downloadFile(data.excelUrl);
                                }
                            },
                            failure: function(data){
                                T.msg("下载模板失败，请重新下载");
                            }
                        });
                    }else{
                        T.msg("请先勾选名片上需要展示的信息");
                    }
                }
            },
            downloadFile: function(url){
                if(!url)return;
                var iframe = null;
                try { // for I.E.
                    iframe = document.createElement('<iframe>');
                } catch (ex) { //for other browsers, an exception will be thrown
                    iframe = T.DOM.create("iframe",{
                        src: "about:blank"//'about:blank'
                    });
                }
                if(!iframe)return;
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                setTimeout(function(){
                    iframe.src = url;
                    setTimeout(function(){
                        document.body.removeChild(iframe);
                    },1000);
                },100);
            },
            /**
             * 导入Excel fileName：原文件名，fileUri：文件路径
             * @param params
             */
            importExcel: function(params){
                var _this = this;
                if(params.fileUri){
                    T.POST({
                        action: "in_order/resolve_requirement_template",
                        params: {url: params.fileUri},
                        success: function(data){debugger
                            if(data.data && data.data.length){
                                _this.data.quantity = data.data.length-1;
                                _this.data.cardList = _this.getEmptyTemplate();
                                T.Each(data.data, function(i, rowData){
                                    if(i>0){
                                        T.Each(rowData, function(k, value){
                                            _this.setFieldValue(k, i, value);
                                        });
                                    }
                                });
                                T.Template("field_list", _this.data, true);
                                $(".design-infos .counter input", _this.$cont).val(_this.data.quantity);
                            }else{
                                T.alt('导入失败，您导入的表格样式与模板样式不一致<p class="red">温馨提示：下载模板excel填写信息时，请不要修改第一行的信息，不要新增/删除字段</p>');
                            }
                        },
                        failure: function(data){
                            T.msg("导入Excel失败，请重新导入！");
                        }
                    });
                }
            },
            textareaAutoHeight: function($this, _height){debugger
                var _this = this;
                _height = _height||0;
                var styles = ['<style type="text/css">','','</style>'];
                var lineHeight = parseInt($this.css("line-height"), 10)||20; //文本域行高
                var height = Math.max(_height, $this[0].scrollHeight, $this.closest("td").height())-parseInt($this.css("padding-top"), 10)-parseInt($this.css("padding-bottom"), 10); //文本域实际高度
                height = Math.max(height, $this.height()); //计算文本域高度
                var rows = Math.floor(height/lineHeight); //计算文本域行数
                var value = $this.val().Trim().substring(0, 200); //文本域最多输入200字符
                if(rows>8){ //文本域可视高度不超过8行
                    height = 8*lineHeight;
                }
                var rowIndex = $this.data("row_index"); //获取当前行索引
                var colIndex = $this.data("col_index"); //获取当前列索引
                styles[1] = ".excel-result .row"+rowIndex+" .textbox { min-height: "+height+"px}"; //生成当前行textarea样式
                $("#import_excel_style"+rowIndex).html(styles.join(""));
                if(_height)return;
                //缓存数据
                _this.setFieldValue(colIndex, rowIndex, value);
            },
            events: function(){
                var _this = this;
                _this.$cont.on("click.language", ".design-infos .radio", function(e){ //选择设计语言
                    var $this = $(this),
                        type = $.trim($this.data("type")||""),
                        $fields = $("#template-fields-view");
                    _this.data.language = type;
                    _this.getExcelTemplate();
                    $this.addClass("sel").siblings(".radio").removeClass("sel");
                    $(".checkboxs", $fields).removeClass("zh-cn en-us").addClass(type);
                }).on("click.fields", ".design-infos .checkboxs .checkbox", function(e){ //选择字段
                    var $this = $(this),
                        name = $.trim($this.text());
                    if($this.hasClass("sel")){
                        $this.removeClass("sel");
                        T.Array.remove(_this.data.fieldList, name);
                    }else{
                        $this.addClass("sel");
                        T.Array.add(_this.data.fieldList, name);
                    }
                    _this.getExcelTemplate();
                }).on("mouseenter.field-excel", ".field-excel td", function(e){//鼠标进入var _this = this;
                    var $this = $(this),
                        $pre = $("pre.textbox", $this);
                    if(!$pre.length)return;
                    var value = $pre.data("value"); //获取当前列索引
                    var rowIndex = $pre.data("row_index"); //获取当前行索引
                    var colIndex = $pre.data("col_index"); //获取当前列索引
                    var height = $pre.closest("td").height();
                    $pre.replaceWith('<textarea class="textbox" data-row_index="'+rowIndex+'" data-col_index="'+colIndex+'" placeholder="请输入">'+value+'</textarea>');
                    var $textarea = $("textarea.textbox", $this);
                    $textarea.bind(T.EVENTS.input + ".textarea", function(e) { //文字输入框内容改变
                        _this.textareaAutoHeight($textarea);
                    });
                    _this.textareaAutoHeight($textarea, height);
                });
                //自定义数量
                _this.$cont.counter({
                    min: 1,
                    max: 10,
                    step: 1,
                    change: function($input, val, flag){
                        var that = this;
                        if(_this.data.quantity!=val){
                            val = Math.min(val, that.max);
                            val = Math.max(val, that.min);
                            $input.val(val);
                            if(val>1){
                                $(".design-infos .fields", _this.$cont).addClass("hide");
                                $(".design-infos .field-list", _this.$cont).show();
                            }else{
                                $(".design-infos .fields", _this.$cont).removeClass("hide");
                                $(".design-infos .field-list", _this.$cont).hide();
                            }
                            _this.data.quantity = val;
                            _this.getExcelTemplate();
                        }
                    }
                });
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});