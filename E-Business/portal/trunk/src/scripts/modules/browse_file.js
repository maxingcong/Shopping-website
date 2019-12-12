define(["base", "tools","widgets/previewer"], function($, T, Previewer){
    /**
     * 我的云盘文件--弹窗
     * @param {Object} option
     * @param {String} option.key 激发弹窗所的那个按钮的key值
     * @param {Object} option.callback 关闭弹窗的回调函数
     * @param {Array} option.checkedlist 前一次已经选取的文件的一个列表
     * @param {String} option.checkedlist[i].fileUri 文件路径
     * @param {String} option.checkedlist[i].fileName 文件名
     * @param {Bool} option.checkedlist[i].selected 文件是否被选中
     * @returns {Array} 返回已选中的文件列表
     */
    var BrowseFile = {
        data: [],
        fileId: '',
        fileChecked: [],//最终选取的文件
        datum_checked: {}, //{key1: [fileChecked array], key2: [fileChecked array]}
        ofilter: 'myfile',
        file_params: {type: 10, index: 0, offset: 10},
        design_params: {index: 0, offset: 10},
        init: function(option){
            var _this = this;
            _this.key = option.key||'';
            _this.fileChecked = option.checkedlist||[];
            _this.file_newcheck = _this.key? (option.datum_checked[_this.key] instanceof Array? option.datum_checked[_this.key].concat([]):[]) : _this.fileChecked.concat([]); //不能直接复制
            _this.datum_checked = option.datum_checked;
            _this.callback = option.callback;
            _this.popup = new T.Popup({
                width: 960,
                title: '我的云盘文件',
                type: 'html',
                content: '<div id="select_yunfile" class="change_files">\
                        <div id="ofilter" class="ofilter"><ul>\
                                <li><a class="sel" href="javascript:;" data-ofilter="myfile">我的资料</a></li>\
                                <li class="vline"></li>\
                                <li><a class="" href="javascript:;" data-ofilter="mydesignfile">我的设计文件</a></li>\
                            </ul>\
                        </div>\
                        <div id="file_list" class="file_list">\
                            <div id="template_yunfile_list_view" class="load"></div>\
                            <div id="template_designfile_list_view" class="load"></div>\
                            <div id="paginbar" class="paginbar hide"></div>\
                        </div>\
                        <div class="button_list text_center mt20">\
                            <button type="button" class="btn btn-primary comfirm" value="确定">确定</button>\
                            <button type="button" class="btn btn-default closebox" value="取消">关闭</button>\
                        </div>\
                    </div>',
                ok: '',
                no: ''
            });
            _this.reload(_this.file_params);//每次初始化默认加载 file_params
            _this.events();
        },
        reload: function(params){
            var _this = this;
            params = params||_this.file_params;
            $('#template_yunfile_list_view').show().addClass('load');
            $('#template_designfile_list_view').hide();
            T.GET({
                action: CFG_DS.myfile.get
                ,params: params
                ,success: function (data) {
                    var _fileList = [];
                    T.Each(data.fileList, function(i, file){
                        var src = file.fileSrc||file.fileUrl;//命名不统一
                        if(src&&file.fileName){
                            //如果该文件在已选列表中，则标记一下selected
                            if(T.Array.indexOf(_this.fileChecked, src, 'fileUrl') > -1  && file.type == 10){
                                file.selected = true;
                            }else{
                                file.selected = false;
                            }
                            if(/^.*\.(jpeg|jpg|png|gif)$/i.test(file.previewPath||file.fileSrc)){
                                file.hasPreviewer = true;
                            }
                            file.fileName = (file.fileName || file.fileSrc || "").replace(/^.*\//, '');
                            _fileList.push(file);
                        }
                    });
                    data.fileList = _fileList;
                    _this.fileList = _fileList;
                    data.ofilter = _this.ofilter;
                    T.Template('yunfile_list', data);
                    if(_this.file_params.offset){
                        T.Paginbar({
                            num: 3,
                            size: _this.file_params.offset,
                            total: Math.ceil(data.totalCount / _this.file_params.offset),
                            index: Math.ceil(_this.file_params.index/_this.file_params.offset)+1,
                            paginbar: 'paginbar',
                            callback: function(obj, index, size, total){
                                _this.pagin(obj, index, size, total)
                            }
                        });
                    }
                    $('#template_yunfile_list_view').removeClass('load');
                }
                ,failure: function(data){
                    T.msg('没有可用素材可用');
                }
            });
        },
        reloadDesign: function(params){
                var _this = this;
                $('#template_designfile_list_view').show().addClass('load');
                $('#template_yunfile_list_view').hide();
                T.GET({ //查询设计文件
                    action: CFG_DS.mydesignfile.get
                    ,params: _this.design_params
                    ,success: function (data) {
                        var _fileList = [];
                        T.Each(data.userDesignFileList, function(i, file){
                            var src = file.fileSrc||file.fileUrl;//纠结命名不统一
                            if(file.orderCode&&file.fileId){
                                if(T.Array.indexOf(_this.fileChecked, src, 'fileUrl') > -1 && file.type == 30){
                                    file.selected = true;
                                }else{
                                    file.selected = false;
                                }
                                if(/^.*\.(jpeg|jpg|png|gif)$/i.test(file.pdfPreviewPath)){
                                    file.hasPreviewer = true;
                                }
                                file.fileName = (file.fileName || file.pdfPath || "").replace(/^.*\//, '');
                                _fileList.push(file);
                            }
                        });
                        data.userDesignFileList = _fileList;
                        _this.fileList = _fileList;
                        //加载
                        T.Template('designfile_list', data);
                        if(_this.design_params.offset){
                            T.Paginbar({
                                num: 3,
                                size: _this.design_params.offset,
                                total: Math.ceil(data.totalCount / _this.design_params.offset),
                                index: Math.ceil(_this.design_params.index/_this.design_params.offset)+1,
                                paginbar: 'paginbar',
                                callback: function(obj, index, size, total){
                                    _this.pagin(obj, index, size, total)
                                }
                            });
                        }
                        $('#template_designfile_list_view').removeClass('load');
                    }
                });
            },
        pagin: function (obj, index, size, total) {
            var _this = this;
            if(_this.ofilter == 'myfile'){
                _this.file_params.index = (index-1) * _this.file_params.offset;
                _this.reload(_this.file_params);
            }else{
                _this.design_params.index = (index-1) * _this.design_params.offset;
                _this.reloadDesign(_this.design_params);
            }
        },
        onExhibitFiles: function(filelist){//展出已选文件
            var _this = this;
            var nextBtn = $('#file_upload-cont');
            var yf = [];
            //debugger
            T.Each(filelist, function(k, v){
                yf.push('<li><a href="'+(v.fileSrc||v.fileUrl||v.pdfPath)+'" title="'+v.fileName+'" target="_blank">'+v.fileName+'</a>');
                yf.push('<a class="del" data-fid="'+v.fileId+'" href="javascript:;">删除</a></li>');
            });
            $('#exhibit_file').html(yf.join(''));
            _this.fileChecked.length ? nextBtn.addClass('up-dis') : nextBtn.removeClass('up-dis');//展示后置灰上传按钮
        },
        events: function(){
            var _this = this;
            $("#select_yunfile").delegate("#ofilter li a", "click", function(){//切换头部ofilter
                var $this = $(this);
                var ofilter = $this.data('ofilter');
                _this.ofilter = ofilter;
                if( $this.hasClass('sel') ){ return false; };
                $this.addClass('sel').closest('li').siblings().find('a').removeClass('sel');
                //在我的资料和我的设计文件上切换
                _this.fileChecked = _this.file_newcheck;
                if(_this.ofilter == 'myfile'){
                    _this.reload(_this.file_params);
                }else{
                    _this.reloadDesign(_this.design_params);
                }

            })
            .delegate("#file_list .checkbox", "click", function(e){//可多选
                //点击事件导致已选文件被更新
                var $this = $(this),
                    fileId = $this.closest('tr').data('fid'), //当前在操作的这个文件的id
                    file = null,
                    f_index;
                if ($this.hasClass('sel')) {//移除
                    $this.removeClass("sel");
                    f_index = T.Array.indexOf(_this.file_newcheck, fileId, 'fileId');
                    (f_index>-1) && _this.file_newcheck.splice(f_index, 1);
                }else{//选取
                    if (_this.file_newcheck.length >= 5) {
                        alert('已选中5个文件，最多不超过5个');
                        return false;
                    }else{
                        $this.addClass("sel");
                        file = T.Array.get(_this.fileList, fileId, 'fileId');
                        if (file) {
                            file.fileUrl = file.fileUrl || file.fileSrc || file.pdfPath;
                            T.Array.add(_this.file_newcheck, file, "fileId");
                        }
                    }
                }
            }).delegate(".button_list button", "click", function(){//确定-取消
                var $this = $(this);
                var key = _this.key;
                if( $this.hasClass('comfirm') ){//确定--认可此次更新
                    _this.fileChecked = _this.file_newcheck;
                    if (key && typeof _this.callback == 'function') {//datum.html
                        _this.datum_checked[key] = _this.fileChecked;
                        _this.callback(_this.key, _this.datum_checked[key]);
                    }
                    else{//本模块默认：点击确定执行事件
                        _this.onExhibitFiles(_this.fileChecked);
                    }
                };//else 放弃本次更新
                _this.popup && _this.popup.remove();
            })
            .delegate(".previewer", "click", function(){
                new Previewer({
                    uris: $(this).data("urls").split(","),
                    type: _this.ofilter == 'myfile'?10:30
                });
            });
        }
    };
    return function(option){
        BrowseFile.init(option);
        return BrowseFile;
    }
});
