require(["base", "tools", "widgets/previewer", "datetimepicker"], function ($, T, Previewer) {
    var deferModules = ["uploader", "modules/order_history"];
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;
    //我的资料
    var myFile = {
        PAGIN: {type: '10', index: 0, offset: 20, start_time: '', end_time: '', file_name: '', orderByFlag: 2},
        popup: null,
        init: function(params){
            var range = T.Date.getDateRange(-30, 'day'),
                startTime = range.startDate,
                endTime = range.endDate,
                _this = this;
            _this.PAGIN = params||_this.PAGIN;
            _this.PAGIN.start_time = startTime;
            _this.PAGIN.end_time = endTime;
            _this.initUI();
            T.PageLoaded();
            _this.reload(params, true, function(){
                require(deferModules);
            });
            _this.bindEvents();
        },
        initUI: function(){
            var range = T.Date.getDateRange(-30, 'day'),
                startTime = range.startDate,
                endTime = range.endDate;
            var fileName = document.getElementById('fileName');
            T.FORM().placeholder(fileName, '输入文件名关键词');
            $('#startTime').val(startTime);
            $('#endTime').val(endTime);
            $('#startTime').datetimepicker({
                lang:"ch",           //语言选择中文
                format:"Y-m-d",      //格式化日期
                timepicker:false,    //关闭时间选项
                todayButton:false,    //关闭选择今天按钮
                maxDate: endTime,
                onSelectDate: function(){
                    $('#endTime').datetimepicker({minDate: $('#startTime').val()});
                }
            });
            $('#endTime').datetimepicker({
                lang:"ch",           //语言选择中文
                format:"Y-m-d",      //格式化日期
                timepicker:false,    //关闭时间选项
                todayButton:false,    //关闭选择今天按钮
                maxDate: endTime,
                minDate: startTime,
                onSelectDate: function(){
                    $('#startTime').datetimepicker({maxDate: $('#endTime').val()});
                }
            });
        },
        bindEvents: function(){
            var _this = this;
            $('#yfilter').delegate('.submit', 'click', function(){ //筛选
                _this.PAGIN.file_name = $.trim($('#fileName').val());
                _this.PAGIN.start_time = $('#startTime').val();
                _this.PAGIN.end_time = $('#endTime').val();
                _this.PAGIN.index = 0;
                _this.PAGIN.offset = 20;
                _this.PAGIN.orderByFlag = 2;
                _this.reload(_this.PAGIN, true);
            }).delegate('.file_btn', 'click', function(){ //上传文件
                var cfm = T.Popup({
                    content: T.Compiler.template("uploader", {}),
                    title: '上传文件',
                    no: '关闭'
                });
                cfm.on("ok", function(){
                    _this.uploader && _this.uploader.destroy();
                });
                cfm.on("close", function(){
                    _this.uploader && _this.uploader.destroy();
                });
                cfm.on("no", function(){
                    _this.uploader && _this.uploader.destroy();
                });
                _this.bindUpload(function(){
                    $('#up_success_tips').addClass('hide');
                },function(){
                    $('#up_success_tips').removeClass('hide');
                    //T.msg('您的资料已上传至云盘！您在云印购买印刷产品或设计服务时可选择相关资料');
                });
            });
            $("#template_file_list_view").delegate(".look", "click", function(e){ //查看下单记录
                var $this = $(this);
                var fileSrc = $this.data("file_src")||"",
                    fileName = $this.data("file_name")||"";
                require(deferModules, function(Uploader, HistoryOrder){
                    if(HistoryOrder.popup){
                        HistoryOrder.popup.remove && HistoryOrder.popup.remove();
                        HistoryOrder.popup = null;
                    }
                    if(fileSrc){
                        HistoryOrder.reload({file_url: fileSrc, file_name: fileName, index: 0, count: 10}, true);
                    }
                })
            }).delegate(".delete", "click", function(e){ //删除文件
                var $this = $(this);
                var fileId = $this.data("file_id")||"";
                var fileName = $this.data('file_name')||'';
                var fileSrc = $this.data('file_src')||'';
                T.cfm({
                    text: '<p>确定删除文件 <b>'+fileName+'</b> 吗？</p><p class="red hide">该文件关联订单未完成 无法删除！</p>',
                    title: '删除文件',
                    ok: '确定删除'
                }, function (_self) {
                    T.POST({
                        action: CFG_DS.myfile.del
                        ,params: {
                            fileId: fileId,
                            fileUrl: fileSrc
                        }
                        ,success: function (data) {
                            _self.remove();
                            _this.reload();
                        }
                        ,failure: function(data) {
                            var $dom = $(_self.dom);
                            $dom.find('#popup_confirm_ok').remove();
                            $dom.find('#popup_confirm_no').text('关闭');
                            $dom.find('.red').removeClass('hide');
                        }
                    });
                    return false;
                });
            }).delegate("#orderByTime", "click", function(){
                if(_this.PAGIN.orderByFlag==1){
                    _this.PAGIN.orderByFlag = 2;
                    _this.PAGIN.index = 0;
                    _this.PAGIN.offset = 20;
                }else{
                    _this.PAGIN.orderByFlag = 1;
                    _this.PAGIN.index = 0;
                    _this.PAGIN.offset = 20;
                }
                _this.reload();
            }).delegate("#orderByProduct", "click", function(){
                if(_this.PAGIN.orderByFlag==3){
                    _this.PAGIN.orderByFlag = 4;
                    _this.PAGIN.index = 0;
                    _this.PAGIN.offset = 20;
                }else{
                    _this.PAGIN.orderByFlag = 3;
                    _this.PAGIN.index = 0;
                    _this.PAGIN.offset = 20;
                }
                _this.reload();
            }).delegate(".previewer", "click", function(){
                var urls = $(this).data('urls');
                if(urls){
                    new Previewer({
                        uris: urls,
                        type: 10
                    });
                }
            })
        },
        bindUpload: function(selCb, queCb){
            var _this = this;
            require(deferModules, function(Uploader, HistoryOrder){
                _this.uploader = Uploader({
					spaceLimit: true,
                    inputId: "file_upload",
                    multi: true,
                    queueSizeLimit: 5,
                    text: "选择文件",
                    text2: "选择文件",
                    uiCfg: {
                        name: true, //是否显示文件名
                        size: true, //是否显示文件大小
                        progress: true, //是否显示上传进度
                        loaded: true, //是否显示已上传
                        speed: true, //是否显示上传速度
                        remove: false //是否显示删除上传完成的文件
                    },
                    onSelect: function(){
                        $("#file_upload-info ol").nextAll().remove();
                        if(selCb){
                            selCb();
                        }
                    },
                    onComplete: function(params){
                        if(queCb){
                            queCb();
                        }
                        //_this.reload();
                    },
                    onSuccess: function(params){
                        T.POST({ //文件上传保存至云盘
                            action: CFG_DS.myfile.upload,
                            params: {
                                file_name: params.fileName,
                                file_src: params.fileUri,
                                file_size: params.fileSize,
                                type: '10'
                            },
                            success: function(){
                                _this.reload();
                            },
                            failure: function(data) {
                                T.alt(data.msg, function(_o) {
                                    _o.remove();
                                });
                            }
                        });
                    }
                });
            });
        },
        reload: function(params, isFirst, callback){
            var _this = this;
            $('#template_file_list_view').addClass('load');
            T.GET({ //获取文件列表
                action: CFG_DS.myfile.get
                ,params: _this.PAGIN
                ,success: function (data) {
                    console.log(data);
                    $('#template_file_list_view').removeClass('load');
                    var _fileList = [];
                    T.Each(data.fileList, function(i, file){
                        if(file.fileSrc){
                            file.fileName = file.fileName || file.fileSrc.replace(/^.*\//, '');
                            _fileList.push(file);
                        }
                    });
                    data.fileList = _fileList;
                    var _data = T.FormatData(data||{});
                    _data.file_list = _data.file_list||[];
                    _this.data = _data.file_list;
                    if(_data.file_list.length>0&&$('#fileName').val()){ //清空输入框
                        $('#fileName').val('').focus().blur();
                    }
                    if(isFirst){
                        _data.orderByFlag = 0;
                    }else{
                        _data.orderByFlag = _this.PAGIN.orderByFlag;
                    }
                    T.Template('file_list', _data);
                    if(_this.PAGIN.offset){
                        T.Paginbar({
                            num: 3,
                            size: _this.PAGIN.offset,
                            total: Math.ceil(_data.total_count / _this.PAGIN.offset),
                            index: Math.ceil(_this.PAGIN.index/_this.PAGIN.offset)+1,
                            paginbar: 'paginbar',
                            callback: _this.pagin
                        });
                    }
                    if(callback){
                        callback();
                    }
                }
            });
        },
        pagin: function (obj, index, size, total) {
            myFile.PAGIN.index = (index-1)*myFile.PAGIN.offset;
            myFile.reload(myFile.PAGIN);
        }
    };
    T.Loader(function(){
        myFile.init();
    });
});