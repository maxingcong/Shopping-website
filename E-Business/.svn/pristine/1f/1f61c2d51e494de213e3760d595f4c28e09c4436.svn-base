!(function(window, document, undefined) {
    "use strict";
    if(!T.hasLogin() || T.Cookie.get('_a_status') != 'Pass'){
        T.noLogin();
    }
    var generalSet = {
        //$cont: '',
        curTabId: 'paper_price',//当前tab页面id
        setPrint: 'add', //'add' or 'edit'
        setPaper: 'add', //'add' or 'edit'
        data: {
            index: 1, //当前页
            offset: 10, //每页条数
            recordCount: 0
        },
        paperParams:{//纸张参数
            name: [],
            weight: []
        },
        /**
         * 初始化
         */
        init: function(){
            var _this = this;
            _this.getData(_this.curTabId);
            _this.bindEvents();
        },
        getData: function(id){
            var _this = this, params = {};
            _this.curTabId = id;
            $('#'+id).addClass("load");
            id =='paper_price' && _this.getPaperParams();//查询纸张参数
            T.GET({
                action: CFG.API.product[id+'_query'],//查询接口带 _query 后缀
                success: function(data){
                    //渲染数据
                    $('#'+id).removeClass("load");
                    _this.render(id, data);
                }
            });
        },
        /**
         * 渲染页面
         */
        render: function(id, data){
            var _this = this;
            switch(id){
                case 'print_price':
                    try {
                        data.id = data.resultList[0].id;//id
                        data.printBaseName = data.resultList[0].printBaseName||'';//属性字符串
                        data.resultList = T.JSON.parse(data.resultList[0].price);
                        for(var k in data.resultList){
                            _this.data.count++;
                        }
                    }catch(e){
                        data.resultList = [];
                    }
                    break;
                case 'general_paper':
                    var useItem = {};
                    data.supplierList = data.supplierList||[];
                    for (var i = 0, item; item=data.supplierList[i]; i++) {
                        useItem[item.boardPageId] = true;//标记为 true
                    }
                    data.useItem = useItem;
                    break;
                default:
                data.resultList = data.resultList||[];
            }
            _this.data.recordCount = _this.data.recordCount||data.resultList.length||0;
            T.Template(id, data);
            //分页
            /*T.Paginbar({
                num: 3,
                size: _this.data.offset, //每页条数
                total: Math.ceil(_this.data.recordCount/_this.data.offset), //总页数
                index: 1, //当前页码
                paginbar: "paginbar", //容器ID
                callback: function(obj, index, size, total){ //点击页码回调
                    _this.getData(_this.curTabId);
                }
            });*/
        },
        /**
         * 获取纸张的名称、克重等参数
         */
        getPaperParams: function(){debugger
            var _this = this;
            T.GET({
                action: CFG.API.product.paper_price_query,
                params: {belongObject: 'In'},
                success: function(data){
                    data.resultList = data.resultList||[];
                    T.Each(data.resultList, function(i, v){
                        T.Array.add(_this.paperParams.name, v.pageName);//添加不重复的值
                        T.Array.add(_this.paperParams.weight, v.pageGramWeight);//添加不重复的值
                    });
                }
            });
        },
        /**
         * 验证添加的打印机数据是否合法
         * @param  {Object} printer 打印机参数
         * @param  {Boolean} isAdd 是否是新增打印机
         * @return {Object} 打印机参数
         */
        updatePrinter:function(printer, isAdd){debugger
            var _this = this;
            T.POST({
                action: isAdd?CFG.API.product.printer_add : CFG.API.product.printer_update,//新增 or 更新
                params: printer,
                success: function(data){
                    _this.getData('print_machine');//加载一遍
                    T.msg(isAdd?'添加成功':'更新成功');
                    $('#addPrintModl').modal('hide');
                },  
                failure: function(data){
                    T.msg(data.msg || '操作失败，请稍后再试');
                }
            })
        },
        /**
         * 增加纸张
         * @param {Object} paper 纸张参数
         */
        updatePaper: function(paper, isAdd){
            var _this = this;
            T.POST({
                action: isAdd? CFG.API.product.paper_price_add: CFG.API.product.paper_price_update,//新增 or 更新
                params: paper,
                success: function(data){
                    _this.getData('paper_price');//加载一遍
                    T.msg(isAdd?'添加成功':'更新成功');
                    $('#setPriceModl').modal('hide');
                },  
                failure: function(data){
                    T.msg(data.msg || '操作失败，请稍后再试');
                }
            })
        },
        /**
         * 保存印刷费设置
         * @param  {Object} data 费用
         */
        savePrintFee: function(id, data){
            var _this = this;
            var price;
            try {
                price = T.JSON.stringify(data||{});
            }catch(e){
                return false;
            }
            T.POST({
                action: CFG.API.product.print_price_update,
                params: {
                    id: id,
                    price: price,
                    belongObject: 'Supplier'
                },
                success: function(data){
                    _this.getData('print_price');//加载一遍
                    T.msg('保存成功');
                },  
                failure: function(data){
                    T.msg(data.msg || '操作失败，请稍后再试');
                }
            })
        },
        /**
         * 验证输入值是否是正数：没有输入，输入非数字，数字以0开头——都是非正数
         */
        isPosiNum: function(value){
            return /^([1-9]\d*(\.)?\d*)$|^(0\.\d*[1-9]\d*)$/.test(value);
        },
        /**
         * 绑定事件
         */
        bindEvents: function(){
            var _this = this;
            $('#generalset-tabs a[data-toggle="tab"]').on('show.bs.tab', function (e) {//切换tab，加载不同tab的内容
                var id = $(e.target).attr('href').replace('#','');
                _this.getData(id);
            });
            /*$('#general_set').on("change.pageCount", "select[name='pageCount']", function(e){//翻页
                _this.data.index = 0;
                _this.data.offset = $(this).val()||10;
                _this.getData(_this.curTabId);
            })*/
            //增加 or 编辑纸张价格
            $('#setPriceModl').on('show.bs.modal', function (e) {
                var data = {},
                    btn = $(e.relatedTarget),
                    act = btn.data('act');//按钮行为['add', 'edit']
                if (act == 'add') {//新增
                    _this.setPaper = 'add';
                    data.title = '新增纸张';
                    data.index = Number($('#template-paper_price-view tbody').data('num')||0) + 1;
                }else{//编辑
                    var tr = btn.closest('tr');
                    _this.setPaper = 'edit';
                    $('#setPriceModl').data('id', tr.data('id'));//打印机id
                    data.index = tr.find('.index').text();
                    data.name = tr.find('.name').text();
                    data.weight = tr.find('.weight').text();
                    data.price = tr.find('.price').text();
                }
                debugger;
                data.nameList = _this.paperParams.name;
                data.weightList = _this.paperParams.weight;
                T.Template('set_price', data);
            })
            .on('blur', 'input:not([name="name"])', function(){//失焦判断
                var val = parseFloat($.trim($(this).val()));
                _this.isPosiNum(val)? $(this).val(val) : $(this).val(1);
            })
            .on('click', '.save', function(){//新增 or 更新纸张
                var modl = $('#setPriceModl');
                var paper = {belongObject: 'Supplier'};
                _this.setPaper == 'edit' && (paper.id = modl.data('id'));//编辑时带上纸张id
                paper.pageName = $('[name="name"]', modl).val();
                paper.pageGramWeight = $('[name="weight"]', modl).val();
                paper.tonsPrice = $('[name="price"]', modl).val();
                if(!paper.pageName || !paper.pageGramWeight){
                    return;
                }
                _this.updatePaper(paper, _this.setPaper == 'add');
            })
            $('#paper_price').on('click', '.btn-danger', function(){//删除纸张
                var id = $(this).closest('tr').data('id');
                if (typeof id == 'undefined') {return;}
                T.GET({
                    action: CFG.API.product.paper_price_delete,
                    params: {id: id},
                    success: function(data){
                        T.msg('删除成功');
                        _this.getData('paper_price');//删除后重新加载一遍
                    },  
                    failure: function(data){
                        T.msg(data.msg || '删除失败，请稍后再试');
                    }
                })
            });
            
            $('#addPrintModl').on('show.bs.modal', function (e) {//印刷机增加 or 编辑纸张价格
                var data = {},
                    btn = $(e.relatedTarget),
                    act = btn.data('act');//按钮行为['add', 'edit']
                if (act == 'add') {
                    _this.setPrint = 'add';
                    data.title = '新增打印机';
                    data.index = Number($('#template-print_machine-view tbody').data('num')||0) + 1;
                }else{
                    var tr = btn.closest('tr');
                    _this.setPrint = 'edit';
                    $('#addPrintModl').data('id', tr.data('id'));//打印机id
                    data.index = tr.find('.index').text();
                    data.name = tr.find('.name').text();
                    data.maxx = tr.find('.maxx').text();
                    data.maxy = tr.find('.maxy').text();
                    data.minx = tr.find('.minx').text();
                    data.miny = tr.find('.miny').text();
                }
                T.Template('set_printer', data);
            })
            .on('blur', 'input:not([name="name"])', function(){//失焦判断
                var val = parseFloat($.trim($(this).val()));
                _this.isPosiNum(val)? $(this).val(val) : $(this).val(1);
            })
            .on('click', '.save', function(){//提交添加 or 编辑
                var modl = $('#addPrintModl');
                var printer = {};
                _this.setPrint == 'edit' && (printer.id = modl.data('id'));//打印机id  //编辑打印机
                printer.printerName = $.trim($('[name="name"]', modl).val());
                printer.maxPrintPageX = $.trim($('[name="maxx"]', modl).val());
                printer.maxPrintPageY = $.trim($('[name="maxy"]', modl).val());
                printer.minPrintPageX = $.trim($('[name="minx"]', modl).val());
                printer.minPrintPageY = $.trim($('[name="miny"]', modl).val());
                //名称--去除空格后
                if (!printer.printerName) {
                    return T.msg('请填写印刷机名称');
                }
                if (printer.maxPrintPageX*1 <= printer.minPrintPageX*1 || printer.maxPrintPageY*1 <= printer.minPrintPageY*1) {//类型转换
                    return T.msg('最大进纸尺寸须大于最小进纸尺寸');
                }
                _this.updatePrinter(printer, _this.setPrint == 'add');
            });

            $('#print_machine').on('click', '.btnlist .use', function(){//印刷机 启用 or 停用
                var action = CFG.API.product.printer_update;//_this.actions.printer.update;
                var btn = $(this),
                    id = btn.closest('tr').data('id');
                if (typeof id == 'undefined') {return;}
                if (btn.hasClass('btn-success')) {//需启用
                    T.POST({
                        action: action,//启用
                        params: { id: id, status: '1'},
                        success: function(data){
                            T.msg('已启用');
                            btn.text('停用').toggleClass('btn-primary btn-success')
                            .parent().siblings('.status').text('已启用');
                        },  
                        failure: function(data){
                            T.msg(data.msg || '操作失败，请稍后再试');
                        }
                    })
                }else{//btn-success
                    T.POST({
                        action: action,//停用
                        params: { id: id, status:'0'},
                        success: function(data){
                            T.msg('已停用');
                            btn.text('启用').toggleClass('btn-primary btn-success')
                            .parent().siblings('.status').text('已停用');
                        },  
                        failure: function(data){
                            T.msg(data.msg || '操作失败，请稍后再试');
                        }
                    })
                }
            })
            .on('click', '.btnlist .del', function(){//印刷机 删除
                var id = $(this).closest('tr').data('id');
                if (!id) {return;}
                T.GET({
                    action: CFG.API.product.printer_del, //_this.actions.printer.del,
                    params: {id: id},
                    success: function(data){
                        _this.getData('print_machine');//加载一遍
                        T.msg('删除成功');
                    }
                });
            });
            
            $('#general_paper').on('click', '.btnbox .btn', function(){//常用上机纸 启用 or 停用切换
                var btn = $(this),
                    id = btn.closest('tr').data('id');
                if (typeof id == 'undefined') {return;}
                if (btn.hasClass('btn-primary')) {//需启用
                    T.GET({
                        action: CFG.API.product.general_paper_add,//启用
                        params: {boardPageId: id},
                        success: function(data){
                            T.msg('已启用');
                            btn.text('停用').toggleClass('btn-danger btn-primary')
                            .parent().siblings('.status').text('已启用');
                        },  
                        failure: function(data){
                            T.msg(data.msg || '操作失败，请稍后再试');
                        }
                    })
                }else{//btn-primary
                    T.GET({
                        action: CFG.API.product.general_paper_delete, //停用
                        params: {boardPageId: id},
                        success: function(data){
                            T.msg('已停用');
                            btn.text('启用').toggleClass('btn-danger btn-primary')
                            .parent().siblings('.status').text('已停用');
                        },  
                        failure: function(data){
                            T.msg(data.msg || '操作失败，请稍后再试');
                        }
                    })
                }
            });
            var startPos = {x: '', y: '', val: ''};
            $('#print_price').on('blur', 'td input', function(){//失焦判断
                var val = parseFloat($.trim($(this).val()));
                _this.isPosiNum(val)? $(this).val(val) : $(this).val(0);
            }).on('mousedown', 'td input', function(e){//table表格的快速输入
                $(this).parents('tbody').css('cursor', 'crosshair');
                startPos.val = $(this).val();
                startPos.x = $(this).closest('td').index();
                startPos.y = $(this).closest('tr').index();
            }).on('mouseup', 'td input', function(e){//table表格的快速输入
                debugger;
                $(this).parents('tbody').css('cursor', 'default');
                var end = $(this), 
                    endx = $(this).closest('td').index(),
                    endy = $(this).closest('tr').index();
                if ((endx == startPos.x && endy == startPos.y) || (endx != startPos.x && endy != startPos.y)) {//啥也不做
                    return;
                }else if (endx == startPos.x) {//填充纵向表格
                    var td = end.closest('tbody').find('tr').slice(Math.min(endy, startPos.y), Math.max(endy, startPos.y)+1).find('td');
                    td.each(function(){
                        if($(this).index() == endx){
                            $(this).find('input').val(startPos.val);//.css('border-color','red');
                        }
                    });
                }else if (endy == startPos.y) {//填充横向表格
                    end.closest('tr').find('td').slice(Math.min(endx, startPos.x), Math.max(endx, startPos.x)+1)
                    .find('input').val(startPos.val);
                }
            })
            //印刷费设置
            $('#savePrintFee').on('click', function(){
                var price = {},
                    id = $('#print_price tbody').data('id');
                if (typeof id == 'undefined') {return;}
                $('#print_price tbody tr').each(function(){
                    var data_key = $(this).data("key");
                    price[data_key] = {};
                        //'基础值': 0,
                        //'基础属性':{'颜色':0,'数量':0},
                        //'工艺属性':{
                            //"最低单价": $(this).children("td:eq(2)").children("input").val(),
                            //"最低总价": $(this).children("td:eq(3)").children("input").val(),
                            //"调试价": $(this).children("td:eq(4)").children("input").val(),
                            //"运行单价": $(this).children("td:eq(5)").children("input").val()
                        //}
                    //}
                    $('input', $(this)).each(function(){
                        //price[data_key]['工艺属性'][$(this).attr('name')] = $(this).val();
                        price[data_key][$(this).attr('name')] = $(this).val();
                    })
                });
                
                _this.savePrintFee(id, price);
            });
        }
    };
    generalSet.init();
}(window, document));
