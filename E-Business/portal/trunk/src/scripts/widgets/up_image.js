define("widgets/up_image", ["base", "tools", "uploader", "jcrop"], function($, T, Uploader){
    /**
     * 上传图片并编辑
     * @param {Object} options
     * @returns {*}
     */
    function UpImage(options){
        return this.init(options);
    }
    UpImage.prototype = {
        init: function(options){
            var _this = this;
            return _this;
        },
        show: function(data){
            var _this = this;
            _this.popup = T.Popup({
                style: 'popup-up-image',
                id: 'popup_up_image',
                zIndex: 1200,
                title: '编辑头像',
                type: 'html',
                width: 900,
                content: '<div id="template-up_image-view" class="up-image"></div>',
                callback: function(){
                    var d = {
                        figureurl: data.figureurl||"",
                        originalUri: ""
                    };
                    var idx = d.figureurl.indexOf("?");
                    var originalUri = "";
                    if(idx>0){
                        originalUri = d.figureurl.substring(0, idx);
                        d.originalUri = originalUri + "?imageMogr2/thumbnail/680x400";
                    }
                    var view = T.Template("up_image", d, true);
                    var $view = $(view),
                        $box = $(".up-edit-box", $view),
                        $img = $(".img-box img", $view);
                    if(originalUri){
                        _this.loadImage($view, $box, $img, {
                            figureurl: data.figureurl||"",
                            fileUri: originalUri
                        });
                    }else{
                        $(".btns-center .up-cont", $view).addClass("hide");
                    }
                    _this.bindUpload({
                        inputId: "up_image",
                        text: "+选择图片",
                        $cont: $view,
                        $box: $box,
                        $img: $img
                    });
                    _this.bindUpload({
                        inputId: "up_image2",
                        text: "重新上传",
                        $cont: $view,
                        $box: $box,
                        $img: $img
                    });
                    _this.events($view);
                }
            });
        },
        bindUpload: function(opts){
            var _this = this;
            opts = opts||{};
            opts.text2 = opts.text2||opts.text;
            Uploader({
                inputId: opts.inputId,
                type: "jpg,jpeg,png,gif",
                sizeLimit: "5M",
                text: opts.text,
                text2: opts.text2,
                uiCfg: {
                    name: false, //是否显示文件名
                    size: false, //是否显示文件大小
                    progress: true, //是否显示上传进度
                    loaded: false, //是否显示已上传
                    speed: true, //是否显示上传速度
                    remove: false //是否显示删除上传完成的文件
                },
                onSuccess: function(params){
                    _this.loadImage(opts.$cont, opts.$box, opts.$img, params);
                    $(".btns-center .up-cont", opts.$cont).removeClass("hide");
                }
            });
        },
        loadImage: function($cont, $box, $img, params){
            var _this = this;
            //?imageMogr2/thumbnail/!200x200r/auto-orient/gravity/Center/crop/200x200
            params.fileUri += "?imageMogr2/thumbnail/680x400";
            var img = new Image();
            img.onload = function(){
                var w = img.width,
                    h = img.height,
                    w1 = 80,
                    h1 = 80,
                    x = (w - w1)/2,
                    y = (h - h1)/2;debugger
                $box.html('<img src="'+params.fileUri+'"/>').addClass("page-interface");
                //默认剪切位置
                if(params.figureurl){
                    var ret = params.figureurl.match(/(\d+)x(\d+)a(\d+)a(\d+)$/);
                    w1 = parseInt(ret[1], 10)||w1;
                    h1 = parseInt(ret[2], 10)||h1;
                    x = parseInt(ret[3], 10)||0;
                    y = parseInt(ret[4], 10)||0;
                }
                var showCoords = function(o){
                    var src = params.fileUri + "/crop/!" + o.w + "x" + o.h + "a" + o.x + "a" + o.y;
                    $img.attr("src", src);
                    $cont.data("src", src);
                };
                $("img", $box).Jcrop({
                    aspectRatio: 1,
                    onChange: showCoords,
                    onSelect: showCoords,
                    setSelect: [x, y, w1, h1]
                });
                /*//剪切时触发
                $box.on("cropmove cropend",function(e, s, c){
                    var src = params.fileUri + "/crop/!" + c.w + "x" + c.h + "a" + c.x + "a" + c.y;
                    $img.attr("src", src);
                    $cont.data("src", src);
                });*/
                //加载默认图片
                var src = params.fileUri + "/crop/!" + w1 + "x" + h1 + "a" + x + "a" + y;
                $img.attr("src", src);
                $cont.data("src", src);
            };
            img.src = params.fileUri;
        },
        save: function(opts){
            var _this = this;
            if(opts && opts.figureurl){
                _this.trigger("save", opts);
            }
        },
        destroy: function(){
            var _this = this;
            if(_this.popup && _this.popup.remove){
                _this.popup.remove();
            }
        },
        events: function($cont){
            var _this = this;
            $cont.on("click", ".save", function(e){
                _this.save({
                    figureurl: $cont.data("src")||""
                });
            }).on("click", ".cannel", function(e){
                _this.destroy();
            });
        }
    };
    //让具备事件功能
    T.Mediator.installTo(UpImage.prototype);
    return function(options){
        return new UpImage(options);
    };
});
