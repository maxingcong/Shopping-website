define("widgets/previewer", ["base", "tools"], function($, T){
    /**
     * 文件预览
     * @param {Object} options
     * @param {String} options.uris 文件路径
     * @returns {*}
     */
    function Previewer(options){
        return this.init(options);
    }
    Previewer.prototype = {
        init: function(options){
            var _this = this;
            options = options||{};
            if(options.type==10 && /.+\.(jpg|jpeg)$/i.test(options.uris)){
                options.tips = options.tips || "小in提示：如果您上传了CMYK印刷颜色模式的图片，显示屏显示的色泽可能会存在偏差，属正常现象。"
            }
            if(T.Typeof(options.uris)==="String"){
                options.uris = options.uris.split(",");
            }
            if(!options.uris || !options.uris.length)return;
            _this.popup = T.Popup({
                fixed: true,
                style: 'popup-previewer',
                id: 'popup_previewer',
                zIndex: 1200,
                title: '',
                type: 'html',
                width: "100%",
                height: "100%",
                content: T.Compiler.template("template-images_previewer", {
                    uris: options.uris,
                    tips: options.tips
                }),
                isPosition: false,
                otherClose: true,
                callback: function(_o, view){
                    var $view = $(view).addClass("images-previewer");
                    if(options.uris.length>1){
                        T.Slider({
                            cont: $view,
                            percent: true,
                            duration: 300,
                            interval: 3500,
                            direction: "lr",
                            autoplay: false
                        });
                    }else{
                        $(".slide-prev, .slide-next", $view).remove();
                    }
                    function _preventDefault(e){
                        if((e.target||e.srcElement)==view){
                            T.DOM.preventDefault(e);
                        }
                    }
                    if(document.addEventListener){
                        view.addEventListener('DOMMouseScroll', function(e){
                            e = e||event;
                            console.log('filter.DOMMouseScroll=>',e.target||e.srcElement);
                            _preventDefault(e);
                            return false;
                        },false);
                    }//W3C
                    view.onmousewheel = function(e){
                        e = e||event;
                        console.log('onmousewheel=>',e.target||e.srcElement);
                        _preventDefault(e);
                        return false;
                    };//IE/Opera/Chrome/Safari
                }
            });
            return _this;
        }
    };
    return function(options){
        return new Previewer(options);
    };
});
