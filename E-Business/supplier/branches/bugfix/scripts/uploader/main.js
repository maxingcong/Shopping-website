!(function(window, document, undefined) {
    "use strict";
    // Chinese (China) (zh_CN)
    /*plupload.addI18n({
        "Stop Upload":"停止上传",
        "Upload URL might be wrong or doesn't exist.":"上传的URL可能是错误的或不存在。",
        "tb":"tb",
        "Size":"大小",
        "Close":"关闭",
        "Init error.":"初始化错误。",
        "Add files to the upload queue and click the start button.":"将文件添加到上传队列，然后点击”开始上传“按钮。",
        "Filename":"文件名","Image format either wrong or not supported.":"图片格式错误或者不支持。",
        "Status":"状态",
        "HTTP Error.":"HTTP 错误。",
        "Start Upload":"开始上传",
        "mb":"mb",
        "kb":"kb",
        "Duplicate file error.":"重复文件错误。",
        "File size error.":"文件大小错误。",
        "N/A":"N/A",
        "gb":"gb",
        "Error: Invalid file extension:":"错误：无效的文件扩展名:",
        "Select files":"选择文件",
        "%s already present in the queue.":"%s 已经在当前队列里。",
        "File: %s":"文件: %s",
        "b":"b",
        "Uploaded %d/%d files":"已上传 %d/%d 个文件",
        "Upload element accepts only %d file(s) at a time. Extra files were stripped.":"每次只接受同时上传 %d 个文件，多余的文件将会被删除。",
        "%d files queued":"%d 个文件加入到队列",
        "File: %s, size: %d, max file size: %d":"文件: %s, 大小: %d, 最大文件大小: %d",
        "Drag files here.":"把文件拖到这里。",
        "Runtime ran out of available memory.":"运行时已消耗所有可用内存。",
        "File count error.":"文件数量错误。","File extension error.":"文件扩展名错误。",
        "Error: File too large:":"错误: 文件太大:",
        "Add Files":"增加文件"
    });*/
    var fileRemoveObj = {};
    function FileProgress(file, opts) {
        var _this = this;
        opts = opts||{};
        _this.opts = opts;
        _this.file = file||{};
        var className = "single";
        var $cont = $("#" + opts.inputId + "-info");

        if(opts.multi){
            className = "multi";
        }
        $cont.addClass("upload-"+ className);

        _this.$wrapper = $("#" + file.id);
        if(fileRemoveObj[file.id])return;

        if (file.id && !_this.$wrapper.length) {
            if(!opts.multi){
                $cont.html("");
            }
            if(opts.multi && !$("ol:first-child", $cont).length){
                var $head = $('<ol class="clearfix row-'+ className +'"/>');

                if(opts.name){
                    $head.append('<li class="file-name ellipsis">文件名</li>');
                }
                if(opts.size){
                    $head.append('<li class="file-size">文件大小</li>');
                }
                if(opts.progress) {
                    $head.append('<li class="file-progress">上传进度</li>');
                }
                if(opts.loaded) {
                    $head.append('<li class="file-loaded">已上传</li>');
                }
                if(opts.speed) {
                    $head.append('<li class="file-speed">上传速度</li>');
                }

                $cont.append($head);
            }

            _this.$wrapper = $('<ul class="clearfix row-'+ className +'"/>');
            _this.$wrapper.attr("id", file.id);

            if(opts.name){
                var $fileName = $('<li class="file-name ellipsis"/>');
                $fileName.text(file.name);
                $fileName.attr("title", file.name);
                _this.$wrapper.append($fileName);
            }

            if(opts.size){
                var $fileSize = $('<li class="file-size"/>'),
                    fileSize = plupload.formatSize(file.size).toUpperCase();
                if(opts.multi){
                    $fileSize.text(fileSize);
                }else{
                    $fileSize.text("文件大小：" + fileSize);
                }
                _this.$wrapper.append($fileSize);
            }

            if(opts.progress) {
                var $fileProgress = $('<li class="file-progress"/>').hide();
                // <span class="progress">
                //   <span class="progress-bar" style="width: 20%">
                //     20%
                //   </span>
                // </span>
                var $progress = $('<span class="progress"/>'),
                    $progressBar = $('<span class="progress-bar"/>');
                $progressBar.width(0);
                $progress.append($progressBar);

                var $fileCancel = $('<a class="file-cancel" href="javascript:;" title="取消上传"/>').text("×");

                $fileProgress.append($progress);
                $fileProgress.append($fileCancel);
                _this.$wrapper.append($fileProgress);
            }

            if(opts.loaded) {
                var $fileLoaded = $('<li class="file-loaded"/>').hide();
                _this.$wrapper.append($fileLoaded);
            }
            if(opts.speed) {
                var $fileSpeed = $('<li class="file-speed"/>').hide();
                _this.$wrapper.append($fileSpeed);
            }

            $cont.append(_this.$wrapper);
        } else {
            _this.reset();
        }
    }
    FileProgress.prototype = {
        reset: function(){
            var _this = this;
            $(".file-name", _this.$wrapper).text(_this.file.name);
            $(".file-size", _this.$wrapper).text(plupload.formatSize(_this.file.size).toUpperCase());
            $(".progress-bar", _this.$wrapper).width(0);
        },
        /**
         * 设置上传进度
         * @param percentage
         * @param speed
         * @param chunk_size
         * @returns {boolean}
         */
        setProgress: function(percentage, speed, chunk_size){
            var _this = this,
                opts = _this.opts;

            var file = _this.file;
            var uploaded = file.loaded;

            var size = plupload.formatSize(uploaded).toUpperCase();
            var formatSpeed = plupload.formatSize(speed).toUpperCase();

            $(".file-loaded", _this.$wrapper).show().text((opts.multi?"":"已 上 传：") + size);
            $(".file-speed", _this.$wrapper).show().text((opts.multi?" ":"上传速度：") + formatSpeed + "/s");
            percentage = parseInt(percentage, 10);
            if (file.status !== plupload.DONE && percentage === 100) {
                percentage = 99;
            }
            $(".file-progress", _this.$wrapper).show();
            $(".progress-bar", _this.$wrapper).css("width", percentage + "%");
        },
        setFileUri: function(fileUri, fileName){
            var _this = this,
                opts = _this.opts;
            if(fileUri && fileName){
                var $fileRemove;
                if(opts.remove){
                    $fileRemove = '<a class="file-remove" href="javascript:;" title="删除">删除</a>';
                }

                var str = '<a href="' + fileUri + '" target="_blank" title="' + fileName + '">' + fileName + '</a>';

                $(".file-name", _this.$wrapper).html(str).append($fileRemove);
                $(".file-cancel", _this.$wrapper).remove();
                $("#" + opts.inputId + "-uri").html(str).append($fileRemove);
            }
        },
        /**
         * 上传完成
         * @param up
         * @param info
         */
        setComplete: function(up, file, info){
            var _this = this,
                opts = _this.opts;
            $(".file-progress", _this.$wrapper).text("上传成功");
            $(".file-cancel", _this.$wrapper).hide();
            if(!opts.multi){
                $(".file-progress", _this.$wrapper).hide();
                $(".file-loaded", _this.$wrapper).hide();
                $(".file-speed", _this.$wrapper).hide();
            }

            var res = $.parseJSON(info);
            var fileUri, fileName = _this.file.name;
            if (res.url) {
                fileUri = res.url;
            } else {
                var domain = up.getOption("domain");
                fileUri = domain + encodeURI(res.key);
                //var link = domain + res.key;
            }
            file.uri = fileUri;

            _this.setFileUri(fileUri, fileName);

            if(file.startTime){
                //上传耗时
                var time = Math.ceil((new Date().getTime() - file.startTime) / 1000);
                var text = '文件 "' + fileName + '" 上传成功，耗时';
                if (time >= 3600) {
                    text += Math.floor(time / 3600) + ' 小时 ';
                    time = time % 3600;
                }
                if (time >= 60) {
                    text += Math.floor(time / 60) + ' 分 ';
                    time = time % 60;
                }
                text += time + ' 秒';
                T.msg && T.msg(text);
            }

            _this.$wrapper.addClass("file-uploaded");
        },
        /**
         * 上传出错
         */
        setError: function(msg){
            var _this = this;
            T.msg && T.msg(msg);
            $(".file-progress", _this.$wrapper).hide();
            $(".file-cancel", _this.$wrapper).hide();
            $(".file-loaded", _this.$wrapper).hide();
            $(".file-speed", _this.$wrapper).hide();
        },
        /**
         * 已取消
         * @param manual
         */
        setCancelled: function(manual){
            var _this = this;
            $(".file-progress", _this.$wrapper).hide();
            $(".file-cancel", _this.$wrapper).hide();
            $(".file-loaded", _this.$wrapper).hide();
            $(".file-speed", _this.$wrapper).hide();
        },
        /**
         * 绑定取消上传事件
         * @param up
         */
        bindUploadCancel: function(up){
            var _this = this;
            if (up) {
                $(".file-cancel", _this.$wrapper).on("click", function () {
                    _this.setCancelled(false);
                    _this.$wrapper.remove();
                    fileRemoveObj[_this.file.id] = true;
                    up.removeFile(_this.file);
                });
            }
        },
        bindFileRemove: function(up){
            var _this = this,
                opts = _this.opts;
            if (up) {
                $(".file-remove", _this.$wrapper).on("click", function () {
                    _this.setCancelled(false);
                    _this.$wrapper.remove();
                    fileRemoveObj[_this.file.id] = true;
                    up.removeFile(_this.file);
                    opts.onRemove && opts.onRemove(_this.file);
                });
            }
        }
    };
    /**
     * 文件上传
     * @param {Object} settings
     * @param {String} [settings.params] 默认配置，上传成功后会回传
     * @param {String} [settings.type=txt,jpg,jpeg,png,gif,pdf,tiff,psd,ai,cdr,eps,indd,doc,docx,xls,xlsx,ppt,pptx,rar,zip,7z] 限定可上传文件类型
     * @param {String} [settings.inputId=file_upload] 上传按钮ID
     * @param {Boolean} [settings.auto=true] 是否支持自动上传
     * @param {Boolean} [settings.multi=false] 是否支持多个上传
     * @param {String} [settings.prefix] 文件名前缀
     * @param {Object} [settings.uiCfg] UI配置
     * @param {Boolean} [settings.uiCfg.name] 是否显示文件名
     * @param {Boolean} [settings.uiCfg.size] 是否显示文件大小
     * @param {Boolean} [settings.uiCfg.progress] 是否显示上传进度
     * @param {Boolean} [settings.uiCfg.loaded] 是否显示已上传
     * @param {Boolean} [settings.uiCfg.speed] 是否显示上传速度
     * @param {Boolean} [settings.uiCfg.remove] 是否显示删除上传完成的文件
     * @param {String|Function} [settings.fileName=new Date().getTime()] 上传至服务器保存的文件名
     * @param {String} [settings.text=上传文件] 上传按钮文字
     * @param {String} [settings.text2=重新上传] 重新上传文字
     * @param {String} [settings.swfUri=/scripts/uploader/Moxie.swf] 文件路径
     * @param {String} [settings.sizeLimit=100MB] 最大文件大小
     * @param {String} [settings.queueSizeLimit=5] 队列最多文件数，超过默认取前5个，为0则不限制
     * @param {onSelect} [settings.onSelect] 选则文件时调用
     * @param {onSuccess} [settings.onSuccess] 单个文件上传成功调用
     * @param {onComplete} [settings.onComplete] 队列所有文件上传完成
     * @param {onCancel} [settings.onCancel] 取消单个文件调用
     * @returns {*}
     */
    function FileUploader(options) {
        var _this = this;
        _this.isUploading = false; //是否正在上传
        return _this.init(options);
    }

    FileUploader.prototype = {
        init: function (options) {
            var _this = this;
            options = options||{};
            _this.params = options.params || {};
            _this.uiCfg = options.uiCfg || {};
            if(typeof(_this.uiCfg.name)==="undefined"){
                _this.uiCfg.name = true;
            }
            _this.type = options.type || "txt,jpg,jpeg,png,gif,pdf,tiff,psd,ai,cdr,eps,indd,doc,docx,xls,xlsx,ppt,pptx,rar,zip,7z";
            _this.auto = typeof(options.auto) === "undefined" ? true : options.auto;
            _this.multi = options.multi || false;
            _this.inputId = options.inputId || "file_upload";
            _this.prefix = options.prefix || "";
            _this.fileName = options.fileName;
            _this.hasFileName = options.hasFileName;
            _this.queueSizeLimit = options.queueSizeLimit>=0? options.queueSizeLimit : 1;
            if(_this.multi){
                _this.queueSizeLimit = 5;
            }
            _this.text = options.text || "上传文件";
            _this.text2 = options.text2 || "重新上传";
            _this.swfUri = options.swfUri || "/scripts/uploader/Moxie.swf";
            _this.sizeLimit = options.sizeLimit || "5gb";
            _this.onSelect = options.onSelect;
            _this.onSuccess = options.onSuccess;
            _this.onComplete = options.onComplete;
            _this.onCancel = options.onCancel;
            _this.onRemove = options.onRemove;
            if(_this.inputId && document.getElementById(_this.inputId)){
                _this.getUpToken(_this.load);
            }
        },
        getUpToken: function(callback){
            var _this = this;
            var upToken = T.Cookie.get("upload_token");
            if(upToken){
                if(callback)callback.call(_this, upToken);
            }else{
                $.getJSON("http://action.ininin.com/in_token/get_token?jsoncallback=?", null, function(data){
                    if(data&&Number(data.result)===0){
                        if(data.data && data.data.Token && Number(data.data.result)===0){
                            T.Cookie.set("upload_token", data.data.Token, {expires: 0.05, path: "/"});
                            if(callback)callback.call(_this, data.data.Token);
                        }else{
                            alert("获取上传凭证失败，请尝试刷新页面。");
                        }
                    }else{
                        alert("获取上传凭证失败，请尝试刷新页面。");
                    }
                });
            }
        },
        getFileInfo: function(files){
            var _this = this;
            var fileList = [];
            plupload.each(files, function (file) {
                fileList.push({
                    id: file.id||"",
                    fileUri: file.uri||"",
                    fileName: file.name||"",
                    fileSize: Math.round(file.size / 1024) || 0, //文件大小KB
                    uploaded: "0"
                });
            });
            var params;
            if(fileList.length>1){
                params = $.extend(true, {}, _this.params, {files: fileList});
            }else{
                params = $.extend(true, {}, _this.params, fileList[0]);
            }
            return params;
        },
        load: function(upToken){
            var _this = this,
                qiniu = new QiniuJsSDK(),
                uploader,
                containerId = _this.inputId + "-cont",
                $cont = $("#" + containerId);
            _this.uiCfg.inputId = _this.inputId;
            _this.uiCfg.multi = _this.multi;
            _this.uiCfg.onRemove = function(file){
                if(!_this.multi){
                    $(".up-text, .up-forbid", $cont).text(_this.text);
                }
                $cont.removeClass("up-ing");
                uploader && uploader.disableBrowse(false);
                _this.onRemove(file);
            };
            $(".up-text, .up-forbid", $cont).text(_this.params.fileUri?_this.text2:_this.text);

            var progress = new FileProgress({}, _this.uiCfg);
            progress.setFileUri(_this.params.fileUri, _this.params.fileName);

            uploader = qiniu.uploader({
                runtimes: "html5,flash,html4", //上传模式,依次退化
                container: containerId,  //上传区域DOM ID，默认是browser_button的父元素
                drop_element: containerId, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                browse_button: _this.inputId, //上传选择的点选按钮，**必需**
                max_file_size: _this.sizeLimit, //最大文件体积限制
                flash_swf_url: _this.swfUri, //引入flash,相对路径
                dragdrop: false,  //开启可拖曳上传
                chunk_size: window.FileReader?"4mb":0,  //分块上传时，每片的体积
                //uptoken_url: "http://action.ininin.com/in_token/get_token",
                uptoken_func: function (file) {
                    return upToken;
                },
                domain: "http://cloud.ininin.com/",
                get_new_uptoken: false,
                // downtoken_url: "http://cloud.ininin.com/",
                // unique_names: true,
                file_data_name: "file", //文件表单名
                filters: {
                    mime_types: [
                        {title : "Files", extensions : _this.type}
                    ],
                    max_file_size: _this.sizeLimit, //最大文件体积限制
                    prevent_duplicates: false //不允许重复选取文件
                },
                multi_selection: _this.multi, //多选
                max_retries: 5, //上传失败最大重试次数
                // save_key: true,
                // x_vars: {
                //     'id': '1234',
                //     'time': function(up, file) {
                //         var time = (new Date()).getTime();
                //         // do something with 'time'
                //         return time;
                //     },
                // },
                auto_start: _this.auto,  //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                log_level: 5,
                init: {
                    /**
                     * 每一个文件被添加到上传队列前触发
                     * @param up
                     */
                    "QueueChanged": function (up) {
                        plupload.each(up.files, function (file) {
                            if(_this.hasFileName && !_this.hasFileName(file)){
                                up.removeFile(file);
                            }
                        });
                        if(_this.multi && up.files.length > _this.queueSizeLimit){
                            up.files.splice(_this.queueSizeLimit, up.files.length - _this.queueSizeLimit);
                        }
                    },
                    /**
                     * 当文件添加到上传队列后触发
                     * @param up
                     * @param files
                     */
                    "FilesAdded": function (up, files) {
                        _this.onSelect && _this.onSelect(_this.getFileInfo(files));
                        plupload.each(up.files, function (file) {
                            var idx = file.name.lastIndexOf(".");
                            if (idx > 0){
                                file.suffix = file.name.substring(idx).toLowerCase();
                            }
                            var progress = new FileProgress(file, _this.uiCfg);
                            progress.bindUploadCancel(up);
                        });
                        $cont.removeClass("up-ing");
                        up.disableBrowse(false);
                    },
                    /**
                     * 每个文件上传前触发
                     * @param up
                     * @param file
                     */
                    "BeforeUpload": function (up, file) {
                        _this.isUploading = true;
                        file.startTime = file.startTime || new Date().getTime();
                        var progress = new FileProgress(file, _this.uiCfg);
                        $cont.addClass("up-ing");
                        up.disableBrowse(true);
                    },
                    /**
                     * 每个文件上传时触发
                     * @param up
                     * @param file
                     */
                    "UploadProgress": function (up, file) {
                        _this.isUploading = true;
                        var progress = new FileProgress(file, _this.uiCfg);
                        var chunkSize = plupload.parseSize(this.getOption("chunk_size"));
                        progress.setProgress(file.percent + "%", file.speed, chunkSize);
                    },
                    /**
                     * 每个文件上传成功后触发
                     * 其中 info 是文件上传成功后，服务端返回的json，形式如
                     * {
                        "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        "key": "gogopher.jpg"
                      }
                     参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                     * @param up
                     * @param file
                     * @param info
                     */
                    "FileUploaded": function (up, file, info) {
                        _this.isUploading = false;
                        var progress = new FileProgress(file, _this.uiCfg);
                        progress.setComplete(up, file, info);
                        var params = _this.getFileInfo([file]);
                        progress.bindFileRemove(up, params);
                        _this.onSuccess && _this.onSuccess(params);
                    },
                    /**
                     * 队列文件处理完毕后触发
                     */
                    "UploadComplete": function (up, files) {debugger
                        _this.isUploading = false;
                        _this.onComplete && _this.onComplete(_this.getFileInfo(files));
                        up.files.splice(0, up.files.length);
                        $(".up-text, .up-forbid", $cont).text(_this.text2);
                        $cont.removeClass("up-ing");
                        up.disableBrowse(false);
                    },
                    /**
                     * 当文件从上传队列移除后触发
                     * @param up
                     * @param files
                     */
                    "FilesRemoved": function(up, files){
                        _this.onCancel && _this.onCancel(up, files);
                        $cont.removeClass("up-ing");
                        up.disableBrowse(false);
                    },
                    /**
                     * 上传出错时,处理相关的事情
                     * @param up
                     * @param err
                     * @param errTip
                     */
                    "Error": function (up, err, errTip) {
                        _this.isUploading = false;
                        var progress = new FileProgress(err.file, _this.uiCfg);
                        progress.setError(errTip);
                        $cont.removeClass("up-ing");
                        up.disableBrowse(false);
                    },
                    /**
                     * 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                     * 该配置必须要在 unique_names: false , save_key: false 时才生效
                     * @param up
                     * @param file
                     * @returns {string}
                     */
                    "Key": function (up, file) {
                        return _this.getFileName(file);
                    }
                }
            });
            _this.uploader = uploader;
            document.body.onbeforeunload = function () {
                if (_this.isUploading) return '正在上传文件，如果离开数据将丢失，您确认要离开吗？';
            };
        },
        upload: function(){
            this.uploader && this.uploader.start();
        },
        refresh: function(){
            this.uploader && this.uploader.refresh();
        },
        destroy: function(){
            this.uploader && this.uploader.destroy();
        },
        getFileName: function (file) {
            var _this = this;
            var fileName = new Date().getTime();
            if (T.GetFileUrl) {
                fileName = T.GetFileUrl() || fileName;
            }
            if (typeof(_this.fileName) == "function") {
                fileName = _this.fileName(file.suffix) || fileName;
            } else {
                fileName = _this.fileName || fileName;
            }
            return _this.prefix + fileName + file.suffix;
        }
    };
    window.Uploader = function(settings) {
        return new FileUploader(settings);
    };
}(window, document));