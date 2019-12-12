define(["base", "tools"], function($, T){
    function MyDesignFile(options){
        this.init(options||{});
    }
    MyDesignFile.prototype = {
        data: {},
        params: {
            index: 0,
            offset: 10
        },
        init: function (options) {
            var _this = this;
            _this.events();
        },
        /**
         * 获取名片列表
         * @param params
         */
        load: function (params) {
            var _this = this;
            _this.params = params||_this.params;
            T.GET({
                action: "in_user/find_file_design",
                params: _this.params,
                success: function (data) {
                    data.fileList = data.userDesignFileList||[];
                    var fileList = [];
                    T.Each(data.fileList, function(i, file){
                        if(file.orderCode && file.pdfPath){
                            if(/^.*\.(jpeg|jpg|png|gif)$/i.test(file.pdfPreviewPath)){
                                file.hasPreviewer = true;
                            }
                            file.fileName = (file.pdfPath || "").replace(/^.*\//, "");
                            fileList.push(file);
                        }
                    });
                    _this.chks = T.Array.check(fileList, _this.chks, "pdfPath");
                    data.fileList = fileList;
                    var view = T.Template("design_file_list", data, true);
                    $(view).removeClass("load");
                    if(_this.params.offset){
                        T.Paginbar({
                            num: 3,
                            size: _this.params.offset,
                            total: Math.ceil(data.totalCount / _this.params.offset),
                            index: _this.params.index,
                            paginbar: "paginbar_datum_file_list",
                            callback: function(obj, index, size, total){
                                _this.params.index = index;
                                _this.load();
                            }
                        });
                    }
                    _this.trigger("loaded", data);
                }
            });
        },
        events: function(){
            var _this = this;
        }
    };
    //让具备事件功能
    T.Mediator.installTo(MyDesignFile.prototype);
    return function(options){
        return new MyDesignFile(options);
    };
});