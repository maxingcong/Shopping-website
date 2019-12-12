define("widgets/zoomer", ["base", "tools"], function ($, T) {
    function ImageZoom(options){
        var _this = this;
        options = options||{};
        if(!options.trigger)return;
        options.scale = options.scale||2;
        options.uuid = options.uuid||('uuid'+new Date().getTime());
        _this.options = options;
        _this.init();
    }
    ImageZoom.prototype = {
        init: function(){//初始化程序
            var _this = this;
            //创建放大镜框
            _this.zoombox = document.createElement('span');
            _this.zoombox.className = 'zoom_box';
            _this.options.trigger.appendChild(_this.zoombox);
            var domId = 'image_zoom_'+_this.options.uuid,
                dom = document.getElementById(domId);
            if(dom){
                dom.parentNode.removeChild(dom);
            }
            //创建放大图DOM
            _this.dom = document.createElement('div');
            _this.dom.className = 'image_zoom';
            _this.dom.id = domId;
            _this.target = document.createElement('div');
            _this.target.className = 'img';
            _this.dom.appendChild(_this.target);
            document.body.appendChild(_this.dom);
            _this.mousemove();
            _this.load(_this.options.imguri);
        },
        mousemove: function(){//鼠标移动
            var _this = this;
            _this.width = _this.options.trigger.offsetWidth||_this.options.trigger.clientWidth||0;
            _this.height = _this.options.trigger.offsetHeight||_this.options.trigger.clientHeight||0;
            _this._width = _this.zoombox.offsetWidth||_this.zoombox.clientWidth||0;
            _this._height = _this.zoombox.offsetHeight||_this.zoombox.clientHeight||0;
            _this.minTop = 0;
            _this.maxTop = _this.width - _this._width;
            _this.minLeft = 0;
            _this.maxLeft = _this.height - _this._height;
            $(_this.options.trigger).bind("mouseenter.proimg", function(e){
                _this.zoombox.style.left = '110%';
                _this.zoombox.style.top = '110%';
                _this.target.innerHTML = '';
                _this.load($("img",_this.options.trigger).data("imguri"));
            }).bind("mousemove.proimg", function(e){
                var mosPos = T.DOM.getMousePos(e);
                var offset = $(_this.options.trigger).offset();
                var tmpX = Math.round(mosPos.x - offset.left - _this._width/2);
                var tmpY = Math.round(mosPos.y - offset.top - _this._height/2);
                tmpX = Math.max(_this.minLeft, Math.min(_this.maxLeft, tmpX));
                tmpY = Math.max(_this.minTop, Math.min(_this.maxTop, tmpY));
                _this.zoombox.style.left = tmpX+'px';
                _this.zoombox.style.top = tmpY+'px';
                //放大框定位
                _this.dom.style.display = 'block';
                _this.dom.style.left = offset.left+_this.width+10+'px';
                _this.dom.style.top = offset.top-2+'px';
                //放大图片定位
                _this.target.style.left = -tmpX*_this.options.scale+'px';
                _this.target.style.top = -tmpY*_this.options.scale+'px';
            }).bind("mouseleave.proimg", function(e){
                _this.zoombox.style.left = '110%';
                _this.zoombox.style.top = '110%';
                _this.dom.style.display = 'none';
            });
        },
        load: function(imguri){//加载图片
            var _this = this;
            if(!imguri)return;
            _this.options.imguri = imguri||'';
            var image = new Image();
            image.onload = function(){
                _this.target.innerHTML = '<img src="'+imguri+'" alt="'+(_this.options.pname||'云印技术')+'"/>';
            };
            image.src = imguri;
        }
    };
    return ImageZoom;
});