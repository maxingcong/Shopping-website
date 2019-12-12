define(["base", "tools", "modules/my_datum_file", "modules/my_design_file", "uploader", "widgets/previewer"], function($, T, MyDatumFile, MyDesignFile, Uploader, Previewer){
    /**
     * 上传设计素材
     */
    function MyUploader(){}
    MyUploader.prototype = {
        fileList: [],
        myDatumFile: MyDatumFile(),
        myDesignFile: MyDesignFile(),
        init: function (options) {
            var _this = this,
                opts = options || {};
            _this.popup = new T.Popup({
                width: 960,
                title: "我的云盘文件",
                type: "html",
                content: T.Compiler.template("template-choice_yunfile", opts),
                ok: "",
                no: "",
                callback: function (_o, cont) {
                    _this.events($(cont));
                }
            });
            _this.myDatumFile.chks = _this.getFiles();
            _this.myDatumFile.load();
        },
        getFiles: function () {
            var _this = this,
                files = [];
            T.Each(_this.fileList, function (i, file) {
                files.push(file.fileUrl);
            });
            return files;
        },
        upload: function(param){
            var _this = this;
            _this.uploader = Uploader({
                spaceLimit: true,
                inputId: "material_upload",
                text: "本地上传",
                text2: "重新上传",
                params: param||{},
                uiCfg: {
                    name: true, //是否显示文件名
                    size: true, //是否显示文件大小
                    progress: true, //是否显示上传进度
                    loaded: true, //是否显示已上传
                    speed: true, //是否显示上传速度
                    remove: true //是否显示删除上传完成的文件
                },
                onSelect: function () {
                    $('#choice_yunfile').addClass("dis");
                },
                onRemove: function(params){//删除已上传的文件
                    T.Array.remove(_this.fileList, params.fileUri, "fileUrl");//列表中文件删除
                    _this.render();
                    $('#choice_yunfile').removeClass("dis");
                    $("#material_upload-cont").removeClass("up-dis");
                },
                onSuccess: function(params){
                    _this.fileList = [{
                        fileUrl: params.fileUri,
                        fileName: params.fileName,
                        uploaded: "1"
                    }];
                    _this.render();
                    $('#choice_yunfile').addClass("dis");
                }
            });
            _this.render();
            if(_this.fileList.length){
                $("#material_upload-cont").addClass("up-dis");
            }
        },
        render: function(){
            var _this = this;
            var htmls = [];
            T.Each(_this.fileList, function (i, file) {
                htmls.push('<li class="file-name ellipsis" title="'+file.fileName+'"><a href="'+(file.fileUrl||file.fileUri)+'" target="_blank" title="'+file.fileName+'">'+file.fileName+'</a><a class="file-remove" data-uri="'+(file.fileUrl||file.fileUri)+'" href="javascript:;" title="删除">删除</a></li>');
            });
            $("#material_upload-info").html('<ul class="clearfix row-multi file-uploaded">' + htmls.join("") + '</ul>')
                .off("click.del", ".row-multi .file-remove").on("click.del", ".row-multi .file-remove", function (e) { //删除已选择的文件
                var $this = $(this),
                    uri = $this.data("uri");
                $this.closest(".file-name").remove();
                if(uri){
                    T.Array.remove(_this.fileList, uri, "fileUrl");
                }
                if(!_this.fileList.length){
                    $('#choice_yunfile').removeClass("dis");
                    $("#material_upload-cont").removeClass("up-dis");
                }
            });
            if(!_this.fileList.length){
                $('#choice_yunfile').removeClass("dis");
                $("#material_upload-cont").removeClass("up-dis");
            }
        },
        events: function($cont) {
            var _this = this,
                type = 0;
            $cont.on("click.tab", ".ofilter li a", function(e){
                var $this = $(this),
                    idx = $this.data("idx");
                if(idx==type)return false;
                type = idx;
                if(idx==30){
                    _this.myDesignFile.chks = _this.getFiles();
                    _this.myDesignFile.load();
                }else{
                    _this.myDatumFile.chks = _this.getFiles();
                    _this.myDatumFile.load();
                }
                $(".choice-content", $cont).addClass("hide");
                $(".choice-content[data-idx='"+idx+"']", $cont).removeClass("hide");
                $(".ofilter li a", $cont).removeClass("sel");
                $this.addClass("sel");
                return false;
            }).on("click.checkbox", ".checkbox", function (e) {
                var $this = $(this),
                    $tr = $this.closest("tr"),
                    fileUrl = $tr.data("file_uri"),
                    fileName = $tr.data("file_name");
                if(fileUrl && fileName){
                    if($this.hasClass("sel")){
                        T.Array.remove(_this.fileList, fileUrl, "fileUrl");
                        $this.removeClass("sel");
                    }else if(_this.fileList.length>=5){
                        T.msg("已选中5个文件，最多不超过5个");
                    }else{
                        T.Array.add(_this.fileList, {
                            fileUrl: fileUrl,
                            fileName: fileName,
                            uploaded: "0"
                        });
                        $this.addClass("sel");
                    }
                }
                return false;
            }).on("click.previewer", ".previewer", function(){
                var $this = $(this);
                Previewer({
                    uris: $this.data("urls").split(","),
                    type: type||10
                });
            }).on("click.save", ".btn-primary", function (e) {
                _this.trigger("save", _this.fileList);
                _this.render();
                if(_this.fileList.length){
                    $("#material_upload-cont").addClass("up-dis");
                }
                if(_this.popup && _this.popup.remove){
                    _this.popup.remove();
                }
            }).on("click.close", ".btn-default", function (e) {
                if(_this.popup && _this.popup.remove){
                    _this.popup.remove();
                }
            });
        }
    };
    //让具备事件功能
    T.Mediator.installTo(MyUploader.prototype);
    return function(options){
        return new MyUploader(options);
    };
});
