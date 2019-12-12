define(["base", "tools"], function($, T){
    function MyDatumFile(options){
        this.init(options||{});
    }
    MyDatumFile.prototype = {
        data: {},
        params: {
            type: 10,
            index: 0,
            offset: 10
        },
        chks: [],
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
                action: "in_user/file_query",
                params: _this.params,
                success: function (data) {
                    data.fileList = data.fileList||[];
                    var fileList = [];
                    T.Each(data.fileList, function(i, file){
                        if(file.fileSrc && file.fileName){
                            if(/^.*\.(jpeg|jpg|png|gif)$/i.test(file.fileSrc)){
                                file.hasPreviewer = true;
                            }
                            file.fileName = (file.fileName || file.fileSrc || "").replace(/^.*\//, "");
                            fileList.push(file);
                        }
                    });
                    _this.chks = T.Array.check(fileList, _this.chks, "fileSrc");
                    data.fileList = fileList;
                    var view = T.Template("datum_file_list", data, true);
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
    T.Mediator.installTo(MyDatumFile.prototype);
    return function(options){
        return new MyDatumFile(options);
    };
});