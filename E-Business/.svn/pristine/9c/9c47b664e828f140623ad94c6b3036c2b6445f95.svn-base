/*
 <div id="designer" class="designer">
 <div class="dhead"></div>
 <div class="dbody">
 <div class="dview">
 <div class="dpage">
 <dl class="dcanvas">
 <dd class="dtags"></dd>
 <dt class="circles circle_lt"></dt>
 <dt class="circles circle_lb"></dt>
 <dt class="circles circle_rt"></dt>
 <dt class="circles circle_rb"></dt>
 </dl>
 </div>
 <div class="tag_focus">
 <p class="obj">asdasdas</p>
 <i class="dot lt"></i>
 <i class="dot lb"></i>
 <i class="dot rt"></i>
 <i class="dot rb"></i>
 </div>
 </div>
 <div class="dedit"></div>
 </div>
 <div class="dfoot"></div>
 </div>
 */
define(["base", "tools"], function($, T){
    function DragDrop(options) {
        var _this = this;
        options = options || {};
        //获得拖动触发对象
        if (typeof(options.trigger) === 'string') {
            _this.trigger = document.getElementById(options.trigger);
        } else {
            _this.trigger = options.trigger;
        }
        if (!_this.trigger) return;
        //拖动对象
        if (typeof(options.target) === 'string') {
            _this.target = document.getElementById(options.target);
        } else {
            _this.target = options.target;
        }
        //if (!_this.target) return;
        _this.percent = options.percent;
        //透明度
        _this.opacity = parseInt(options.opacity || 100, 10) || 100;
        _this.mousedown = options.mousedown || {};
        _this.mousemove = options.mousemove || {};
        _this.mouseup = options.mouseup || {};
        var originDragDiv = null;
        var tmpX = 0;
        var tmpY = 0;
        var moveable = false;
        _this.trigger.onmousedown = function(e) {
            e = e || _this.GetEvent();
            var downPos = _this.GetMousePos(e);
            _this.downPos = downPos;
            //只允许通过鼠标左键进行拖拽,IE鼠标左键为1 FireFox为0
            if (typeof(_this.mousedown.before) == 'function') {
                _this.mousedown.before.call(_this, _this.target, _this.trigger);
                if (!_this.target) _this.target = _this.trigger.parentNode;
            }
            if (!e || (typeof(_this.target.setCapture) == 'object' && e.button != 1) || (typeof(_this.target.setCapture) != 'object' && e.button != 0)) return false;

            var wh = _this.GetSize(_this.target.offsetParent);
            _this.minLeft = parseInt(options.left, 10) || 0;
            _this.maxLeft = wh.w - _this.target.offsetWidth - (parseInt(options.right, 10) || 0);
            _this.minTop = parseInt(options.top, 10) || 0;
            _this.maxTop = wh.h - _this.target.offsetHeight - (parseInt(options.bottom, 10) || 0);
            if(!_this.target.offsetParent){
                _this.maxLeft = _this.target.offsetWidth - (parseInt(options.right, 10) || 0);
                _this.maxTop = _this.target.offsetHeight - (parseInt(options.bottom, 10) || 0);
            }

            moveable = true;
            tmpX = downPos.x - _this.target.offsetLeft;
            tmpY = downPos.y - _this.target.offsetTop;
            _this.trigger.style.cursor = 'pointer';
            if (_this.target.setCapture) {
                _this.target.setCapture();
            } else {
                window.captureEvents(Event.MOUSEMOVE);
            }
            //T.DOM.setOpacity(options.target, options.opacity);
            _this.StopPropagation(e);
            _this.PreventDefault(e);
            if (typeof(_this.mousedown.after) == 'function') _this.mousedown.after.call(_this, _this.target, _this.trigger);
            document.onmousemove = function(e) {
                if (moveable) {
                    var e = e || _this.GetEvent(); //IE 去除容器内拖拽图片问题
                    if (document.all) { //IE
                        e.returnValue = false;
                    }
                    var movePos = _this.GetMousePos(e);
                    _this.movePos = movePos;
                    var _left = Math.max(Math.min(movePos.x - tmpX, _this.maxLeft), _this.minLeft);
                    var _top = Math.max(Math.min(movePos.y - tmpY, _this.maxTop), _this.minTop);
                    var offsetX = _left - _this.target.offsetLeft;
                    var offsetY = _top - _this.target.offsetTop;
                    if (_this.percent) {
                        var posDiv = _this.target.offsetParent || _this.target.parentNode;
                        var posW = posDiv.clientWidth || posDiv.offsetWidth;
                        var posH = posDiv.clientHeight || posDiv.offsetHeight;
                        _left = (_left / posW * 100) + '%';
                        _top = (_top / posH * 100) + '%';
                    } else {
                        _left = _left + 'px';
                        _top = _top + 'px';
                    }
                    //_this.target.style.left = _left;
                    //_this.target.style.top = _top;
                    if (typeof(_this.mousemove.after) == 'function') _this.mousemove.after.call(_this, _this.target, _this.trigger, offsetX, offsetY);
                }
            };
            document.onmouseup = function() {
                if (typeof(_this.mouseup.before) == 'function') _this.mouseup.before.call(_this, _this.target, _this.trigger);
                document.onmousemove = null;
                document.onmouseup = null;
                if (options.keepOrigin) {
                    if (_this.target.setCapture) {
                        originDragDiv.outerHTML = '';
                    } else {
                        //setOuterHtml(originDragDiv, "");
                    }
                }
                if (moveable) {
                    if (_this.target.setCapture) {
                        _this.target.releaseCapture();
                    } else {
                        window.releaseEvents(Event.MOUSEMOVE);
                    }
                    //T.DOM.setOpacity(options.target, 100);
                    _this.trigger.style.cursor = '';
                    moveable = false;
                    tmpX = 0;
                    tmpY = 0;
                }
                if (typeof(_this.mouseup.after) == 'function') _this.mouseup.after.call(_this, _this.target, _this.trigger);
                if (typeof(_this.callback) == 'function') _this.callback.call(_this, _this.target, _this.trigger);
            };
        }
    }
    DragDrop.prototype = {
        PreventDefault: function(e) {
            (e && e.preventDefault) ? e.preventDefault(): window.event.returnValue = false;
        },
        StopPropagation: function(e) {
            (e && e.stopPropagation) ? e.stopPropagation(): window.event.cancelBubble = true;
        },
        Offset: function(obj) {
            var pos = {
                top: 0,
                left: 0
            };
            var getPos = function(obj) {
                if (obj) pos.top += obj.offsetTop, pos.left += obj.offsetLeft, getPos(obj.offsetParent);
            }
            getPos(obj);
            return pos;
        },
        GetEvent: function() {
            if (window.event) return window.event;
            var func = arguments.caller;
            while (func != null) {
                var e = func.arguments[0];
                if (e) {
                    if ((e.constructor == Event || e.constructor == MouseEvent || e.constructor == KeyboardEvent) || (typeof e === 'object' && e.preventDefault && e.stopPropagation)) {
                        return e;
                    }
                }
                func = func.caller;
            }
            return null;
        },
        GetSize: function(o) {
            if (o) return {
                w: o.clientWidth || o.offsetWidth,
                h: o.clientHeight || o.offsetHeight
            };
            return {
                w: window.innerWidth || document.documentElement.clientWidth || document.body.offsetWidth,
                h: window.innerHeight || document.documentElement.clientHeight || document.body.offsetHeight
            };
        },
        GetMousePos: function(e) {
            var ret = {};
            e = e || T.DOM.getEvent();
            if (!isNaN(e.pageX) && !isNaN(e.pageY)) {
                ret.x = e.pageX;
                ret.y = e.pageY;
            } else if (document.documentElement && !isNaN(e.clientX) && !isNaN(document.documentElement.scrollTop)) {
                ret.x = e.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft;
                ret.y = e.clientY + document.documentElement.scrollTop - document.documentElement.clientTop;
            } else if (document.body && !isNaN(e.clientX) && !isNaN(document.body.scrollLeft)) {
                ret.x = e.clientX + document.body.scrollLeft - document.body.clientLeft;
                ret.y = e.clientY + document.body.scrollTop - document.body.clientTop;
            }
            return ret;
        },
        GetScrollPos: function() { //2015-01-26
            var ret = {
                x: document.body.scrollLeft - document.body.clientLeft,
                y: document.body.scrollTop - document.body.clientTop
            };
            if (document.documentElement) {
                ret.x = Math.max(document.documentElement.scrollLeft - document.documentElement.clientLeft, ret.x);
                ret.y = Math.max(document.documentElement.scrollTop - document.documentElement.clientTop, ret.y);
            }
            return ret;
        },
        SetOpacity: function(target, n) {
            if (target.setCapture) {
                target.style.filter = 'alpha(opacity=' + n + ')';
            } else {
                target.style.opacity = n / 100;
            }
        }
    };

    function DropPanel(options){
        var _this = this;
        _this.$trigger = $(options.trigger);
        if(!_this.$trigger.length)return;
        _this.options = options;
        _this.container = options.container||document.body;
        if(!$("#"+options.id).length){
            _this.Init();
        }
    }
    DropPanel.prototype = {
        Init: function(){
            var _this = this;
            $(document).trigger("click.drop_panel");
            _this.$dom = $('<div id="'+_this.options.id+'" class="drop_panel"></div>').appendTo(_this.container);
            _this.$dom.append(_this.options.content);
            var offset = _this.$trigger.offset();
            if(offset){
                _this.$dom.css({
                    top: offset.top+_this.$trigger.outerHeight(true),
                    left: offset.left - _this.$dom.outerWidth() + _this.$trigger.outerWidth(true)
                });
            }
            if(_this.options.callback){
                _this.options.callback.call(_this, _this);
            }
            setTimeout(function(){
                _this.Events();
            }, 0);
        },
        Events: function(){
            var _this = this;
            _this.$dom.bind("click.drop_panel", function(e) { //点击自己阻止事件冒泡
                e.stopPropagation();
            });
            _this.$trigger.bind("click.drop_panel", function(e) { //点击自己阻止事件冒泡
                e.stopPropagation();
            });
            $(window).bind("resize.drop_panel", function(e) { //点击其他区域则关闭
                _this.Remove();
            });
            $(document).bind("click.drop_panel", function(e) { //点击其他区域则关闭
                if(!$(e.target).closest(".drop_panel").length){
                    _this.Remove();
                }
            });
        },
        Remove: function(){
            var _this = this;
            _this.$trigger.unbind("click.drop_panel");
            $(window).unbind("resize.drop_panel");
            $(document).unbind("click.drop_panel");
            _this.$dom.remove();
        }
    }

    function ColorPicker(options) {
        var _this = this;
        _this.baseColorHex = ['00', '33', '66', '99', 'CC', 'FF']; //256色的颜色是用00,33,66,99,cc,ff组成
        options = options || {};
        options.color = options.color||"#000000";
        _this.options = options;
        _this.$trigger = $(options.trigger);/* 事件 */
        _this.events = {
            input: typeof(document.body.oninput) == 'undefined' ? 'propertychange' : 'input'
        };
        _this.Init();
    }
    ColorPicker.prototype = {
        Init: function() {
            var _this = this;
            _this.CMYK();
            _this.Events();
        },
        Events: function(){
            var _this = this;
            if(_this.$dom&&_this.$dom.length){
                var hex = '', rgb = '', cmyk = '';
                var _setSelectedValue = function(a, b, c, d){
                    if(arguments.length==3){
                        rgb = a+','+b+','+c;
                        hex = _this.RGBToHex(a, b, c);
                        cmyk = _this.RGBToCMYK(a, b, c);
                    }else if(arguments.length==4){
                        cmyk = a+','+b+','+c+','+d;
                        rgb = _this.CMYKToRGB(a/100, b/100, c/100, d/100)
                        hex = _this.RGBToHex(rgb.split(',')[0], rgb.split(',')[1], rgb.split(',')[2]);
                    }else{
                        hex = $(a).data("hex")||"";
                        rgb = $(a).data("rgb")||"";
                        cmyk = $(a).data("cmyk")||"";
                    }
                    $(".value", _this.$dom).css("background", hex);
                    var arr = rgb.split(",");
                    $("input[name='r']", _this.$dom).val(arr[0]);
                    $("input[name='g']", _this.$dom).val(arr[1]);
                    $("input[name='b']", _this.$dom).val(arr[2]);
                    var arr = cmyk.split(",");
                    $("input[name='c']", _this.$dom).val(arr[0]);
                    $("input[name='m']", _this.$dom).val(arr[1]);
                    $("input[name='y']", _this.$dom).val(arr[2]);
                    $("input[name='k']", _this.$dom).val(arr[3]);
                }
                var defRGB = _this.HexToRGB(_this.options.color);
                _setSelectedValue(defRGB.split(',')[0]||0, defRGB.split(',')[1]||0, defRGB.split(',')[2]||0);
                _this.$dom.delegate(".color", "mouseenter.colorpicker", function(e){//鼠标色块
                    var $this = $(this);
                    _setSelectedValue($this);
                }).delegate(".color, .file_btn", "click.colorpicker", function(e){//选中色块
                    if(_this.options.callback){
                        _this.options.callback(hex, rgb, cmyk);
                    }
                    _this.Remove();
                }).delegate("input[name]", _this.events.input+".colorpicker", function(e){//文本域值改变
                    var $input = $(this);
                    var name = $input.attr("name");
                    var val = parseInt($input.val().replace(/\D/g, ''), 10)||0;
                    var min_val = $input.data("min");
                    var max_val = $input.data("max");
                    if(val<min_val){
                        $input.val(min_val);
                    }else if(val>max_val){
                        $input.val(max_val);
                    }
                    if(name=='r'||name=='g'||name=='b'){
                        _setSelectedValue($("input[name='r']", _this.$dom).val(), $("input[name='g']", _this.$dom).val(), $("input[name='b']", _this.$dom).val());
                    }else{
                        _setSelectedValue($("input[name='c']", _this.$dom).val(), $("input[name='m']", _this.$dom).val(), $("input[name='y']", _this.$dom).val(), $("input[name='k']", _this.$dom).val());
                    }
                });
            }
        },
        Remove: function(){
            var _this = this;
            if(_this.dropPanel){
                _this.dropPanel.Remove();
            }
        },
        CMYK: function() {
            var _this = this;
            //var colors = ["#251E1C", "#403D3C", "#595858", "#717071", "#878788", "#9E9E9F", "#B4B4B4", "#C8C8C9", "#DCDCDC", "#EEEFEF", "#FFFFFF", "#FFFCD5", "#FFF9AE", "#FFF684", "#FFF200", "#FFCB03", "#F2D9C7", "#FED09E", "#F6ADCD", "#F8ABAD", "#FAA74A", "#F9AA8F", "#F9A870", "#F48480", "#F58465", "#F58345", "#F5821F", "#F05A72", "#EC008C", "#ED1551", "#ED1B23", "#DBD374", "#D0BDC9", "#CFB66A", "#C4999A", "#C49AB2", "#C4955F", "#C7C4E2", "#C7A0CA", "#C77DB5", "#D2E288", "#B97385", "#B9726D", "#B97136", "#C656A0", "#CCE7D3", "#A98FAF", "#9AA15F", "#A06C97", "#BDC799", "#BCCABB", "#B3B19C", "#B2AF7F", "#984481", "#BCCCD8", "#AA9BA5", "#A99774", "#A17D7F", "#9E76B4", "#985E7F", "#A2228E", "#985C43", "#9B95C9", "#A6CE38", "#8B7690", "#9BD3AE", "#9AA599", "#9AA37E", "#7F4081", "#9AA7B1", "#8B84AC", "#8DD8F8", "#878575", "#81736B", "#807157", "#7A5F6E", "#704894", "#746BAB", "#6C8CC7", "#6D527C", "#78859F", "#69586D", "#623D81", "#747E86", "#7E9897", "#57516C", "#59574B", "#5F7372", "#56638D", "#74A694", "#75A374", "#72A7B3", "#4C5257", "#5E897B", "#55C5D0", "#2E3092", "#009FE6", "#00A650", "#0095DA"]
            var colors = ["0,0,0,100", "0,0,0,90", "0,0,0,80", "0,0,0,70", "0,0,0,60", "0,0,0,50", "0,0,0,40", "0,0,0,30", "0,0,0,20", "0,0,0,10", "0,0,0,0", "0,0,20,0", "0,0,40,0", "0,0,60,0", "0,0,100,0", "0,20,100,0", "0,20,20,0", "0,20,40,0", "0,40,0,0", "0,40,20,0", "0,40,80,0", "0,40,40,0", "0,40,60,0", "0,60,40,0", "0,60,60,0", "0,60,80,0", "0,60,100,0", "0,80,40,0", "0,100,0,0", "0,100,60,0", "0,100,100,0", "0,0,60,20", "0,20,0,20", "0,20,60,20", "0,40,20,20", "0,40,0,20", "0,40,60,20", "20,20,0,0", "20,40,0,0", "20,60,0,0", "20,0,60,0", "0,60,20,20", "0,60,40,20", "0,60,80,20", "20,80,0,0", "20,0,20,0", "20,40,0,20", "20,0,60,20", "20,60,0,20", "20,0,40,20", "20,0,20,20", "0,0,20,40", "0,0,40,40", "20,80,0,20", "20,0,0,20", "0,20,0,40", "0,20,40,40", "0,40,20,40", "40,60,0,0", "0,60,0,40", "40,100,0,0", "0,60,60,40", "40,40,0,0", "40,0,100,0", "20,40,0,40", "40,0,40,0", "20,0,20,40", "20,0,40,40", "40,80,0,20", "20,0,0,40", "40,40,0,20", "40,0,0,0", "0,0,20,60", "0,20,20,60", "0,20,40,60", "0,40,0,60", "60,80,0,0", "60,60,0,0", "60,40,0,0", "40,60,0,40", "40,20,0,40", "20,40,0,60", "60,80,0,20", "20,0,0,60", "40,0,20,40", "40,40,0,60", "0,0,20,80", "40,0,20,60", "60,40,0,40", "60,0,40,20", "60,0,60,20", "60,0,20,20", "20,0,0,80", "60,0,40,40", "60,0,20,0", "100,100,0,0", "100,0,0,0", "100,0,100,0", "100,20,0,0"];
            var htmls = [],
                hex = '',
                rgb = '',
                cmyk = '',
                count = 0;
            htmls.push('<div class="color_picker">');
            htmls.push('<dl class="forms colorbar clearfix">');
            htmls.push('<dd>');
            htmls.push('<span class="value" style="background:'+_this.options.color+'"></span>');
            htmls.push('<div class="cell">R<input class="textbox" type="text" name="r" data-min="0" data-max="255" /></div>');
            htmls.push('<div class="cell">G<input class="textbox" type="text" name="g" data-min="0" data-max="255" /></div>');
            htmls.push('<div class="cell">B<input class="textbox" type="text" name="b" data-min="0" data-max="255" /></div>');
            htmls.push('</dd>');
            htmls.push('<dd>');
            htmls.push('<div class="cell">C<input class="textbox" type="text" name="c" data-min="0" data-max="100" />%</div>');
            htmls.push('<div class="cell">M<input class="textbox" type="text" name="m" data-min="0" data-max="100" />%</div>');
            htmls.push('<div class="cell">Y<input class="textbox" type="text" name="y" data-min="0" data-max="100" />%</div>');
            htmls.push('<div class="cell">K<input class="textbox" type="text" name="k" data-min="0" data-max="100" />%</div>');
            htmls.push('</dd>');
            htmls.push('<dt class="clear"><a class="file_btn" href="javascript:;">确 定</a></dt>');
            htmls.push('</dl><div class="colors" style="display:none">');
            for (var i = 0; cmyk = colors[i]; i++) {
                rgb = _this.CMYKToRGB(cmyk.split(',')[0]/100, cmyk.split(',')[1]/100, cmyk.split(',')[2]/100, cmyk.split(',')[3]/100);
                hex = _this.RGBToHex(rgb.split(',')[0], rgb.split(',')[1], rgb.split(',')[2]);
                htmls.push('<span class="color" data-hex="' + hex + '" data-rgb="' + rgb + '" data-cmyk="' + cmyk + '" style="background:' + hex + '"></span>');
                count++;
            }
            htmls.push('</div></div>');
            _this.dropPanel = new DropPanel({
                id: _this.options.id,
                trigger: _this.$trigger,
                content: htmls.join(''),
                callback: function(_self){
                    _this.$dom = _self.$dom;
                }
            });
            //_this.$dom = $(htmls.join('')).appendTo(document.body);
        },
        /**
         * Converts a RGB color format to an hexadecimal color.
         * @param {Number} r Red value color must be in [0, 255].
         * @param {Number} g Green value color must be in [0, 255].
         * @param {Number} b Blue value color must be in [0, 255].
         * Return {String} Hexadecimal color.
         */
        RGBToHex: function(r, g, b) {
            return ('#' + (r < 16 ? '0' : '') + (parseInt(r, 10)).toString(16) + (g < 16 ? '0' : '') + (parseInt(g, 10)).toString(16) + (b < 16 ? '0' : '') + (parseInt(b, 10)).toString(16)).toUpperCase();
            //return String.Format("#{0:x2}{1:x2}{2:x2}", r, g, b).ToUpper();
        },
        /**
         * Converts an Hexadecimal color format to a RGB color.
         * @param {String} hex Hexadecimal color.
         * Return {String} RGB color.
         */
        HexToRGB: function(hex) {
            hex = hex.replace(/^#/, '');
            var s1 = '',
                s2 = '',
                s3 = '';
            if (hex.length < 6) {
                s1 = hex.substring(0, 1) + hex.substring(0, 1);
                s2 = hex.substring(1, 2) + hex.substring(1, 2);
                s3 = hex.substring(2, 3) + hex.substring(2, 3);
            } else {
                s1 = hex.substring(0, 2);
                s2 = hex.substring(2, 4);
                s3 = hex.substring(4, 6);
            }
            var r = parseInt(s1, 16);
            var g = parseInt(s2, 16);
            var b = parseInt(s3, 16);
            return r + ',' + g + ',' + b;
        },
        /**
         * Converts RGB to CMYK.
         * @param {Number} [r] Red color must be in [0, 255].
         * @param {Number} [g] Green color must be in [0, 255].
         * @param {Number} [b] Blue color must be in [0, 255].
         * Return {String} CMYK color.
         */
        RGBToCMYK: function(r, g, b) {
            var c = parseFloat((255 - r) / 255);
            var m = parseFloat((255 - g) / 255);
            var y = parseFloat((255 - b) / 255);

            var k = parseFloat(Math.min(c, m, y));
            if (k == 1.0) {
                c = m = y = 0;
            } else {
                c = (c - k) / (1 - k);
                m = (m - k) / (1 - k);
                y = (y - k) / (1 - k);
            }
            return Math.round(c*100) + ',' + Math.round(m*100) + ',' + Math.round(y*100) + ',' + Math.round(k*100);
        },
        /**
         * Converts CMYK to RGB.
         * @param {Number} c Cyan value color must be in [0, 100%].
         * @param {Number} m Magenta value color must be in [0, 100%].
         * @param {Number} y Yellow value color must be in [0, 100%].
         * @param {Number} k blacK value color must be in [0, 100%].
         * @param {String} RGB color.
         */
        CMYKToRGB: function(c, m, y, k) {
            var r = Math.round((1 - c) * (1 - k) * 255);
            var g = Math.round((1 - m) * (1 - k) * 255);
            var b = Math.round((1 - y) * (1 - k) * 255);
            //console.log(c + ',' + m + ',' + y + ',' + k, '==>', r + ',' + g + ',' + b)
            return r + ',' + g + ',' + b;
        }
    };
    //在线设计器
    function Designer(options) {
        var _this = this;
        options = options || {};
        _this.$container = $(options.container);
        if (_this.$container.length != 1) return;
        _this.level = options.level==1;//编辑器级别，true后台使用
        _this.editable = options.editable==1;//是否可编辑，1：可编辑
        _this.options = options;
        _this.gap = options.gap || 4;
        _this.uuid = options.uuid || options.container.replace(/#/, '');
        _this.data = options.data || {};
        _this.data.pages = _this.data.pages || [];
        _this.pageCount = _this.data.pages.length; //总页数
        _this.nodes = {};
        _this.index = 1;
        _this.pageIndex = 0;
        _this.currTextId = ''; //当前选中的文本框ID
        //_this.getTextApi = 'http://www.mingpian.sh/BusinessCard/AjaxPage/GetText.ashx';
        //http://182.254.218.140:8080/in_user/image_generate?text=%E4%BA%91%E5%8D%B0%E6%B7%B1%E5%9C%B3%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&font_size=32&font_color=00FF00&font_name=%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91&font_style=1
        //_this.getTextApi = 'http://192.168.1.40:8080/in_user/text_image'
        _this.getTextApi = 'http://action.ininin.com/in_user/text_image'
        /* 事件 */
        _this.events = {
            input: typeof(document.body.oninput) == 'undefined' ? 'propertychange' : 'input'
        };
        _this.isUploading = false;
        /*_this.fields = [
         {atr: '姓名', val: '云小印', sel: true},
         {atr: '姓名（英文）', val: 'Small Cool', sel: false},
         {atr: '职位', val: '设计师', sel: true},
         {atr: '职位（英文）', val: 'Designer', sel: false},
         {atr: '邮箱', val: 'xiao@ininin.com', sel: true},
         {atr: '手机', val: '18600000000', sel: true},
         {atr: '座机', val: '400-6809111', sel: true},
         {atr: '微信', val: '18600000000', sel: false},
         {atr: 'QQ', val: '4008601846', sel: false},
         {atr: '公司名称', val: '云印', sel: true},
         {atr: '公司名称（英文）', val: 'INININ', sel: false},
         {atr: '公司网站', val: 'www.ininin.com', sel: true},
         {atr: '传真', val: '0755-12345678', sel: false},
         {atr: '公司地址', val: '深圳市南山区科技园源兴科技大厦南座1403', sel: true},
         {atr: '公司地址（英文）', val: 'Yuanxing 1403,Nanshan Disctict,SHenzhen', sel: false},
         {atr: '添加信息1', val: '', sel: false},
         {atr: '添加信息2', val: '', sel: false},
         {atr: '添加信息3', val: '', sel: false}
         ];*/
        _this.fields = {
            '姓名':'云小印',
            '姓名（英文）':'Small Cool',
            '职位':'设计师',
            '职位（英文）':'Designer',
            '邮箱':'xiao@ininin.com',
            '手机':'18600000000',
            '座机':'400-6809111',
            '微信':'18600000000',
            'QQ':'4008601846',
            '公司名称':'云印',
            '公司名称（英文）':'INININ',
            '公司网站':'www.ininin.com',
            '传真':'0755-12345678',
            '公司地址':'深圳市南山区科技园源兴科技大厦南座1403',
            '公司地址（英文）':'Yuanxing 1403,Nanshan Disctict,SHenzhen',
            '添加信息1':'',
            '添加信息2':'',
            '添加信息3':''
        };
        /*
         (function(URLS){
         URLS = URLS||'';
         URLS = URLS.split('\n')||[];
         var LENGTH = URLS.length, INDEX = 0;
         var temp = [];
         for(var i=0; i<LENGTH; i++){
         if(URLS[i]&&/\.ttf|\.fon/i.test(URLS[i])){
         var url = URLS[i].replace(/\..*$/,'').replace('│','').trim();
         if(url)temp.push(url);
         }
         }
         URLS = temp;
         LENGTH = URLS.length;console.log(JSON.stringify(URLS))
         })($(".urls-input.js-urls-input").val());
         */
        //_this.font_list = ["字体","4086_方正仿宋_GBK","cusongjianti","FZCYSK","fzdbs_GBK","FZZYSK","姚体","宋黑","方正书宋_GBK","方正刻本仿宋简体_1","方正姚体_GBK","方正宋一_GBK","方正宋三_GBK","方正宋黑_GBK","方正小标宋_GBK","方正报宋_GBK","方正新报宋_GBK","方正清刻本悦宋简体","美黑","msyh","msyhbd","4091_方正楷体_GBK","FZQDJW","FZSXSLKJW","fzzj-ljdxkfont","MissYuan_方正汉简简体","xjlFont","方正中倩_GBK","方正剪纸简体","方正华隶_GBK","方正启体简体","方正少儿_GBK","方正康体_GBK","方正新舒体_GBK","方正水柱_GBK","方正稚艺_GBK","方正粗倩_GBK","方正细倩_GBK","方正胖娃_GBK","方正舒体__GBK","方正行楷简体","方正隶书简体","方正隶二简体","方正隶变_GBK","方正魏碑_GBK","方正黄草_GBK","汉仪程行简_1","FZLTCXHJW","FZLTH_GB18030","FZLTKHK","FZLTXHK","FZLTZHK","FZZCHJW","FZZDHJW","FZZDXJW","FZZHJW","FZZXHJW","FZZZHUNHJW","兰亭特黑简 GBK_0","兰亭粗黑 GBK_0","兰亭细黑 GBK Mobil_0","兰亭细黑 GBK_0","兰亭黑 GBK_0","兰亭黑简_1","方正中等线_GBK","方正兰亭中粗黑","方正兰亭准黑_GBK","方正兰亭粗黑简体","方正兰亭纤黑简体","方正正中黑简体","方正细圆简体","方正细等线_GBK","方正细黑一_GBK","方正综艺_GBK","方正黑体_GBK","方正黑体简体"];
        _this.font_list = ["arial","arial-粗圆","arial-加粗","arial-加粗斜体","arial-细长","arial-细长加粗","arial-细长加粗斜体","arial-细长斜体","arial-斜体","aribl-超粗黑","Times New Roman Bold Italic","Times New Roman Bold","Times New Roman Italic","Times New Roman","方正榜书行简体","方正报宋繁体","方正报宋简体","方正北魏楷书繁体","方正北魏楷书简体","方正博雅方刊宋","方正博雅宋","方正彩云","方正超粗黑","方正粗黑繁体","方正粗黑宋简体","方正粗活意繁体","方正粗活意简体","方正粗倩繁体","方正粗倩简体","方正粗宋简体","方正粗谭黑简体","方正粗雅宋","方正粗圆简体","方正大标宋繁体","方正大标宋简体","方正大黑繁体","方正大黑简体","方正仿宋","方正仿宋繁体","方正风雅宋简体","方正古隶简体","方正汉真广标简体","方正行楷繁体","方正行楷简体","方正豪体简体","方正黑体繁体","方正黑体简体","方正琥珀简体","方正华隶","方正黄草","方正剪纸繁体","方正剪纸简体","方正剑体简体","方正静蕾简体","方正卡通繁体","方正卡通简体","方正楷体繁体","方正楷体简体","方正康体繁体","方正康体简体","方正兰亭超细黑简体","方正兰亭粗黑简","方正兰亭大黑_GBK","方正兰亭黑","方正兰亭黑简","方正兰亭刊黑","方正兰亭刊宋","方正兰亭特黑扁简","方正兰亭特黑简","方正兰亭特黑长简","方正兰亭细黑 GBK","方正兰亭纤黑","方正兰亭中粗黑","方正兰亭中黑","方正兰亭准黑","方正隶变繁体","方正隶变简体","方正隶二繁体","方正隶二简体","方正隶书繁体","方正隶书简体","方正流行体繁体","方正流行体简体","方正美黑简体","方正品尚黑简体","方正品尚中黑","方正品尚准黑","方正平和繁体","方正平和简体","方正平黑繁体","方正启迪简体","方正启体繁体","方正启体简体","方正清刻本悦宋简体","方正少儿繁体","方正少儿简体","方正瘦金书繁体","方正瘦金书简体","方正书宋繁体","方正书宋简体","方正舒体繁体","方正舒体简体","方正水黑繁体","方正水黑简体","方正宋黑繁体","方正宋黑简体","方正宋三简体","方正宋一繁体","方正宋一简体","方正特雅宋简体","方正铁筋隶书繁体","方正铁筋隶书简体","方正魏碑繁体","方正魏碑简体","方正细等线简体","方正细黑繁体","方正细黑简体","方正细倩繁体","方正细倩简体","方正细珊瑚繁体","方正细珊瑚简体","方正细谭黑简体","方正细圆繁体","方正细圆简体","方正小标宋繁体","方正小标宋简体","方正新报宋简体","方正新书宋繁体","方正新舒体繁体","方正新舒体简体","方正新秀丽繁体","方正颜宋简体-粗","方正颜宋简体-大","方正颜宋简体-纤","方正颜宋简体-中","方正颜宋简体-准","方正姚体繁体","方正姚体简体","方正艺黑繁体","方正艺黑简体","方正硬笔行书繁体","方正硬笔行书简体","方正硬笔楷书繁体","方正硬笔楷书简体","方正幼线繁体","方正幼线简体","方正毡笔黑繁体","方正毡笔黑简体","方正正粗黑简体","方正正大黑简体","方正正黑简体","方正正楷繁体","方正正纤黑简体","方正正中黑简体","方正正准黑简体","方正稚艺繁体","方正稚艺简体","方正中等线繁体","方正中等线简体","方正中倩繁体","方正中倩简体","方正中雅宋_GBK","方正准雅宋","方正准圆繁体","方正准圆简体","方正综艺繁体","方正综艺简体","微软繁标宋","微软繁仿宋","微软繁黑体","微软繁宋体","微软繁线体","微软简标宋","微软简粗黑","微软简仿宋","微软简楷体","微软简老宋","微软简中圆","微软雅黑","微软雅黑-加粗","微软雅黑-细"];
        //_this.font_list = _this.font_list.concat(["4086_方正仿宋_GBK","cusongjianti","FZCYSK","fzdbs_GBK","FZZYSK","姚体","宋黑","方正书宋_GBK","方正刻本仿宋简体_1","方正姚体_GBK","方正宋一_GBK","方正宋三_GBK","方正宋黑_GBK","方正小标宋_GBK","方正报宋_GBK","方正新报宋_GBK","方正清刻本悦宋简体","美黑","msyh","msyhbd","4091_方正楷体_GBK","FZQDJW","FZSXSLKJW","fzzj-ljdxkfont","MissYuan_方正汉简简体","xjlFont","方正中倩_GBK","方正剪纸简体","方正华隶_GBK","方正启体简体","方正少儿_GBK","方正康体_GBK","方正新舒体_GBK","方正水柱_GBK","方正稚艺_GBK","方正粗倩_GBK","方正细倩_GBK","方正胖娃_GBK","方正舒体__GBK","方正行楷简体","方正隶书简体","方正隶二简体","方正隶变_GBK","方正魏碑_GBK","方正黄草_GBK","汉仪程行简_1","FZLTCXHJW","FZLTH_GB18030","FZLTKHK","FZLTXHK","FZLTZHK","FZZCHJW","FZZDHJW","FZZDXJW","FZZHJW","FZZXHJW","FZZZHUNHJW","兰亭特黑简 GBK_0","兰亭粗黑 GBK_0","兰亭细黑 GBK Mobil_0","兰亭细黑 GBK_0","兰亭黑 GBK_0","兰亭黑简_1","方正中等线_GBK","方正兰亭中粗黑","方正兰亭准黑_GBK","方正兰亭粗黑简体","方正兰亭纤黑简体","方正正中黑简体","方正细圆简体","方正细等线_GBK","方正细黑一_GBK","方正综艺_GBK","方正黑体_GBK","方正黑体简体"]);
        _this.font_size_list = [];
        for(var a=5; a<96; a++){
            _this.font_size_list.push(a+'px');
        }
        _this.tools = {
            font: "select[name='dfont_list']",//字体
            font_size: "select[name='dfont_size_list']",//字体大小
            font_input: "input[name='dfont_list']",//字体
            font_size_input: "input[name='dfont_size_list']",//字体大小
            font_box: "span[name='dfont_list']",//字体
            font_size_box: "span[name='dfont_size_list']",//字体大小
            font_weight: ".font_weight",//加粗
            font_style: ".font_style",//斜体
            font_color: ".font_color",//颜色
            dtext_halign: ".dtext_halign",//水平布局
            dtext_left: ".dtext_left",//左对齐
            dtext_center: ".dtext_center",//水平居中
            dtext_right: ".dtext_right",//右对齐
            dtext_valign: ".dtext_valign",//垂直布局
            dtext_top: ".dtext_top",//顶对齐
            dtext_middle: ".dtext_middle",//垂直居中
            dtext_bottom: ".dtext_bottom",//底对齐
            dtext_add: ".dtext_add",//添加文字
            text_halign: "select[name='text_halign']",//文字水平布局
            text_valign: "select[name='text_valign']"//文字垂直布局
        };
        _this.default_font_name = "宋黑";
        _this.default_font_size = 14;
        _this.default_font_color = "000000";
        _this.$tagFocus = $('<div class="dtag_focus"><i class="dot lt"></i><i class="dot lb"></i><i class="dot rt"></i><i class="dot rb"></i></div>');
        _this.Init();
    }
    Designer.prototype = {
        Init: function() {
            var _this = this;
            _this.$dhead = $('.dhead', _this.$container);
            _this.$dview = $('.dview', _this.$container);
            _this.$dedit = $('.dedit', _this.$container);
            _this.$dtexts = $('.dtexts', _this.$container);
            if(!_this.pageCount){
                _this.data.pages = {};
                var texts1 = [], texts2 = [];
                var page1 = ['姓名','职位','邮箱','手机','座机','公司名称','公司网站','公司地址'];
                var page2 = ['公司名称','公司网站','公司地址'];
                //for(var field, k=0; field=_this.fields[k]; k++){
                for(var field in _this.fields){
                    if(_this.fields.hasOwnProperty&&_this.fields.hasOwnProperty(field)){
                        for(var atr, m=0; atr=page1[m]; m++){
                            if(atr==field){
                                texts1.push({
                                    "name": field,
                                    "text": _this.fields[field],
                                    "font_name": _this.default_font_name,
                                    "font_size": _this.default_font_size,
                                    "font_color": _this.default_font_color,
                                    "font_style": 0,
                                    "left": 0,
                                    "top": 0,
                                    "text_halign": "left",
                                    "text_valign": "top"
                                });
                            }
                        }
                        for(var atr, m=0; atr=page2[m]; m++){
                            if(atr==field){
                                texts2.push({
                                    "name": field,
                                    "text": _this.fields[field],
                                    "font_name": _this.default_font_name,
                                    "font_size": _this.default_font_size,
                                    "font_color": _this.default_font_color,
                                    "font_style": 0,
                                    "left": 0,
                                    "top": 0,
                                    "text_halign": "left",
                                    "text_valign": "top"
                                });
                            }
                        }
                    }
                }
                _this.data.pages = [{
                    texts: texts1
                },{
                    texts: texts2
                }];
                _this.pageCount = _this.data.pages.length; //总页数
            }
            _this.Loader();
            _this.$dtoolbar = $('.dtoolbar', _this.$container);
            _this.BindEvents();
            if(_this.pageCount){
                _this.Reload();
            }
            if(_this.level){
                /*$(_this.tools.font).each(function(i, el){
                 _this.SetOptions(el, _this.GetFontList(0));
                 });
                 $(_this.tools.font_size).each(function(i, el){
                 _this.SetOptions(el, _this.GetFontList(1));
                 });*/
                _this.SetFontList(0);//设置字体
                _this.SetFontList(1);//设置字体大小
                _this.bindUpload(1, 'upload_image1', '上传正面底图', '重新上传正面底图');
                _this.bindUpload(2, 'upload_image2', '上传反面底图', '重新上传反面底图');
            }
        },
        Reload: function(){
            var _this = this;
            $(".dtags", _this.$dview).html("");
            if (_this.pageCount) {
                var page = null;
                var loaded = 0;
                //加载底图
                for (var i = 0; i < _this.pageCount; i++) {
                    page = _this.data.pages[i];
                    if (!page) continue;
                    (function(idx) {
                        _this.LoadImage(page.background, function(imgsrc, nw, nh) {
                            loaded++;
                            $(".dpage[index='" + idx + "'] .dtags", _this.$container).prepend('<img src="' + imgsrc + '" />');
                            $(".dpage[index='" + idx + "']", _this.$container).removeClass("hid");
                            if(loaded==_this.pageCount){
                                _this.$container.removeClass("designer_load");
                                $(".dtab_content", _this.$dedit).height(_this.$dview.height()-_this.$dtoolbar.height()-60);
                                _this.LoadText();
                                $(".dtab[index='" + _this.pageIndex + "']", _this.$container).click();
                                if(_this.options.callback){
                                    _this.options.callback.call(_this);
                                }
                            }
                            //console.log(imgsrc, nw, nh);
                        }, function(imgsrc) {
                            //console.log(imgsrc);
                        }, 5);
                    })(i);
                }
            }
        },
        Uploaded: function(type, inputId, params){
            var _this = this;
            if(type==1){//上传正面底图
                _this.data.pages[0].background = params.file_url;
            }else if(type==2){//上传反面底图
                _this.data.pages[1].background = params.file_url;
            }
            _this.Reload();
        },
        SetFontList: function(index, value){
            var _this = this;
            var obj = [_this.tools.font,_this.tools.font_size][index];
            $(obj).each(function(i, el){
                _this.SetOptions(el, _this.GetFontList(index, value));
            });
        },
        GetFontList: function(index,value){
            var _this = this;
            value = value||'';
            var data = [_this.font_list,_this.font_size_list][index];
            if(!value||!data)return data||[];
            var arr = [];
            if(index==1){
                arr = [_this.default_font_size+'px'];
            }else{
                arr = [_this.default_font_name];
            }
            for(var o='', i=0; o=data[i]; i++){
                if(value==o||o.indexOf(value)>=0){
                    if(arr[0]!=o){
                        arr.push(o);
                    }
                }
            }
            return arr;
        },
        SetOptions: function(obj, data, value){//设置select选项
            var option = null;
            if(obj)obj.length = 0;
            for(var o='', i=0; o=data[i]; i++){
                option = new Option(o, o);
                if(o===value)option.selected = 'selected';
                obj.options.add(option);
            }
        },
        /**
         * 设置文字位置
         * @param {Object} obj 文字对象
         * @param {Object} offsetX X轴偏移量/文字json对象
         * @param {Object} offsetY Y轴偏移量
         */
        SetPosition: function(obj, offsetX, offsetY) {
            var _this = this;
            //console.log("SetPosition=>",obj);
            offsetX = offsetX||0;
            offsetY = offsetY||0;
            var $obj = $(obj);
            var $dtags = $(obj).closest(".dtags");
            var $dtag = $(obj).closest(".dtag_focus");
            var cw = $dtags.outerWidth();
            var ch = $dtags.outerHeight();
            var w = $obj.outerWidth();
            var h = $obj.outerHeight();
            var text = null;
            if(typeof(offsetX)=='object'){
                text = offsetX;
            }else{
                text = _this.GetText($obj.attr("id"));
            }
            if(!text)return;
            if(!_this.level){
                $obj.css({
                    "top": text.top,
                    "left": text.left
                });
                return;
            }
            if(arguments.length==3){//拖动时定位
                text.top += offsetY;
                text.left += offsetX;
                //text.text_halign = 'left';
                //text.text_valign = 'top';
            }/*else{//非拖动时定位
                var pos = null;
                if(isFocus){
                 pos = $dtag.position();
                 }else{
                 pos = $obj.position();
                 }
                 text.top = pos.top;
                 text.left = pos.left;*/
                //水平对齐方式
                /*if (text.text_halign == 'left') {//左对齐
                 text.left = _this.gap;
                 } else if (text.text_halign == 'center') {//水平居中对齐
                 text.left = Math.round((cw - w) / 2) - _this.gap;
                 } else if (text.text_halign == 'right') {//右对齐
                 text.left = cw - w - _this.gap;
                 }*/
                //垂直对齐方式
                /*if (text.text_valign == 'top') {//顶对齐
                 text.top = _this.gap;
                 } else if (text.text_valign == 'middle') {//垂直居中对齐
                 text.top = Math.round((ch - h) / 2) - _this.gap;
                 } else if (text.text_valign == 'bottom') {//底对齐
                 text.top = ch - h - _this.gap;
                 }
            }*/
            var minTop = _this.gap, minLeft = _this.gap;
            var maxTop = Math.max(ch - h - _this.gap, minLeft);
            var maxLeft = Math.max(cw - w - _this.gap, minLeft);
            text.top = Math.min(Math.max(text.top, minTop), maxTop);
            text.left = Math.min(Math.max(text.left, minLeft), maxLeft);
            $dtag.css({
                "top": text.top - _this.gap,
                "left": text.left - _this.gap
            });
            $obj.css({
                "top": text.top,
                "left": text.left
            });
            //console.log(JSON.stringify(_this.data));
        },
        Region: function(ev){
            var _this = this;
            var $region = null;
            //标签拖拽
            $(".dtags", _this.$container).each(function(i, el) {
                new DragDrop({
                    trigger: el,
                    target: document.body,
                    keepOrigin: false,
                    percent: false,
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    mousedown: {
                        after: function(target, trigger) {
                            var _self = this;
                            $(".dtag.sel", target.parentNode).removeClass("sel");
                            $region = $('<div class="region"/>').appendTo(document.body);
                            //var offset = $(trigger).offset();
                            $region.css({
                                "top": _self.downPos.y,
                                "left": _self.downPos.x
                            });
                            _this.SetSelectedPage($(trigger).closest(".dpage").attr("index"));
                        }
                    },
                    mousemove: {
                        after: function(target, trigger, offsetX, offsetY) {
                            var _self = this;
                            offsetX = _self.movePos.x - _self.downPos.x;
                            offsetY = _self.movePos.y - _self.downPos.y;
                            var cw = Math.abs(offsetX);
                            var ch = Math.abs(offsetY);
                            if(offsetX>0){
                                cw = Math.min(document.body.offsetWidth-_self.downPos.x-2, cw);
                            }
                            if(offsetY>0){
                                ch = Math.min(document.body.offsetHeight-_self.downPos.y-2, ch);
                            }
                            $region.css({
                                "width": cw,
                                "height": ch
                            });
                            var _top = _self.downPos.y + (offsetY<0?offsetY:0);
                            var _left = _self.downPos.x + (offsetX<0?offsetX:0);
                            $region.css({
                                "top": _top,
                                "left": _left
                            });
                            var minTop = Math.min(_self.downPos.y, _self.movePos.y);
                            var minLeft = Math.min(_self.downPos.x, _self.movePos.x);
                            var maxTop = Math.max(_self.downPos.y, _self.movePos.y);
                            var maxLeft = Math.max(_self.downPos.x, _self.movePos.x);
                            var offset = $(trigger).offset();
                            $(".dtag", trigger).each(function(k, tag){
                                var $tag = $(tag);
                                var y = (parseInt(tag.style.top, 10)||0)+offset.top;
                                var x = (parseInt(tag.style.left, 10)||0)+offset.left;
                                //var y2 = y+$tag.outerHeight();
                                //var x2 = x+$tag.outerWidth();
                                if(y>minTop&&y<maxTop&&x>minLeft&&x<maxLeft){
                                    $tag.addClass("sel");
                                }else{
                                    $tag.removeClass("sel");
                                }
                            });
                        }
                    },
                    mouseup: {
                        after: function(target, trigger){
                            $region.remove();
                            //$(".dtag", target.parentNode).removeClass("sel");
                        }
                    }
                });
            });
        },
        DragDropText: function(obj){
            var _this = this;
            new DragDrop({
                trigger: obj,
                target: null,
                keepOrigin: false,
                percent: false,
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                mousedown: {
                    before: function(target, trigger) {
                        $(trigger).closest(".dpage").trigger("mousedown.designer");
                        if (!$(trigger).parent().hasClass("dtag_focus")) {
                            _this.SetSelectedText(trigger, true);
                        }
                    }
                },
                mousemove: {
                    after: function(target, trigger, offsetX, offsetY) {
                        $(target).siblings(".dtag.sel").each(function(i, el){
                            _this.SetPosition(el, offsetX, offsetY);
                        });
                        _this.SetPosition(trigger, offsetX, offsetY);
                    }
                },
                mouseup: {
                    after: function(target, trigger){
                        $(".dtag", target.parentNode).removeClass("sel");
                    }
                }
            });
        },
        /**
         * 选中某一面
         * @param {Number} index 面索引
         */
        SetSelectedPage: function(index) {
            var _this = this;
            _this.pageIndex = index;
            _this.currPage = _this.data.pages[index];
            $(".dpage[index='" + index + "']", _this.$container).addClass("dpage_focus").siblings(".dpage").removeClass("dpage_focus");
            $(".dtab[index='" + index + "']", _this.$container).addClass("sel").siblings(".dtab").removeClass("sel");
            $(".dtab_content[index='" + index + "']", _this.$container).addClass("show").siblings(".dtab_content").removeClass("show");
        },
        /**
         * 设置/取消选中文字效果
         * @param {Object} target 选中对象
         * @param {Boolean} isSelected 是否选中
         */
        SetSelectedText: function(target, isSelected) {
            var _this = this;
            //console.log('_this.SetSelectedText=>', target, isSelected)
            var $this = $(target);
            if(!$this.length)return;
            var textId = $this.attr("id").replace('_dtag_', '_dtext_');
            //var $input = $("#" + textId);
            if($this.parent().hasClass("dtag_focus")){//如果已经选中
                //console.log('_this.SetSelectedText=>', 'dtag_focus')
                if(!isSelected){//如果是取消选中效果
                    //console.log('_this.SetSelectedText=>', '!isSelected')
                    var pos = _this.$tagFocus.position();
                    $this.insertBefore(_this.$tagFocus);
                    _this.$tagFocus.css({
                        top: '120%',
                        left: '120%'
                    });
                    $("#" + textId + ":focus").blur();
                }
            }else{
                //console.log('_this.SetSelectedText=>', '!dtag_focus')
                if(isSelected){//如果是设置选中效果
                    //console.log('_this.SetSelectedText=>', 'isSelected')
                    var pos = $this.position();
                    $this.removeClass("sel");
                    $(".dtag", _this.$tagFocus).insertBefore(_this.$tagFocus);
                    _this.$tagFocus.insertBefore($this).prepend($this);
                    _this.$tagFocus.css({
                        top: pos.top - _this.gap,
                        left: pos.left - _this.gap
                    });
                    $("#" + textId + ":not(:focus)").focus();
                    //$("#" + textId + ":not(:focus)").trigger("myfocus.designer");
                    _this.SetStyle();
                }
            }
        },
        BindEvents: function() {
            var _this = this;
            //事件
            _this.$container.delegate(".save", "click.designer", function(e) { //点击模板区正面或反面
                //console.log("save==>", JSON.stringify(_this.data));
                if(_this.options.save){
                    _this.options.save.call(_this, _this.data);
                }
            }).delegate(".dpage", "mousedown.designer", function(e) { //点击模板区正面或反面
                _this.SetSelectedPage($(this).attr("index") || 0);
            }).delegate(".dtab", "click.designer", function(e) { //点击文字编辑区正面或反面
                _this.SetSelectedPage($(this).attr("index") || 0);
                //return false;
            }).delegate(".dtag", "click.designer", function(e) { //点击文字
                _this.SetSelectedText(e.target, true);
                //return false;
            }).delegate(".dtext textarea", "focus.designer myfocus.designer", function(e) { //文字输入框获得焦点
                var $this = $(this);
                $(".dfocus", $this.closest(".dtexts")).removeClass("dfocus");
                $this.closest(".dtext").addClass("dfocus");
                var textId = $this.attr("id");
                _this.currTextId = textId;
                var tagId = textId.replace('_dtext_', '_dtag_');
                _this.SetSelectedText("#" + tagId, true);
            }).delegate(".dtext textarea", "keyup.designer", function(e) { //文字输入框内容改变_this.events.input
                var $this = $(this);
                $this.height(20).height($this[0].scrollHeight-8);
                var textId = $this.attr("id");
                _this.currTextId = textId;
                _this.SetText({
                    text: $this.val()
                }, textId);
            }).delegate(".ddel", "click.designer", function(e) { //删除字段
                var $this = $(this);
                var $ditem = $this.closest(".ditem");
                var textId = $("textarea", $ditem).blur().attr("id");
                _this.DelText(textId);
            }).delegate(_this.tools.font, "change.designer", function(e) { //字体改变
                var $this = $(this);
                _this.default_font_name = $this.val();
                _this.SetText({
                    font_name: $this.val()
                });
                $this.blur();
            }).delegate(_this.tools.font_input, _this.events.input + ".designer", function(e) { //字体改变
                var $this = $(this);
                var value = $.trim($this.val());
                _this.SetFontList(0, value);
            })/*.delegate(_this.tools.font_input, "keydown.designer", function(e) { //字体改变
             var $this = $(this);
             if(e.keyCode==13){
             $this.siblings("select").focus();
             }
             })*/.delegate(_this.tools.font_size, "change.designer", function(e) { //字号改变
                    var $this = $(this);
                    _this.default_font_size = parseInt($this.val(), 10);
                    _this.SetText({
                        font_size: parseInt($this.val(), 10)
                    });
                    $this.blur();
                }).delegate(_this.tools.font_size_input, _this.events.input + ".designer", function(e) { //字体改变
                    var $this = $(this);
                    var value = $.trim($this.val());
                    _this.SetFontList(1, value);
                })/*.delegate(_this.tools.font_size_input, "keydown.designer", function(e) { //字体改变
             var $this = $(this);
             if(e.keyCode==13){
             $this.siblings("select").focus();
             }
             })*/.delegate(_this.tools.font_color, "click.designer", function(e) { //字号改变
                    var $this = $(this);
                    _this.colorPicker = new ColorPicker({
                        id: "color_picker",
                        color: $this.data("color")||"#000000",
                        trigger: $this,
                        callback: function(hex, rgb, cmyk){
                            _this.SetText({
                                font_color: hex.replace(/#/g, '')
                            });
                            _this.default_font_color = hex;
                            $this.data("color", hex);
                        }
                    });
                    return false;
                }).delegate(_this.tools.font_weight, "click.designer", function(e) { //是否加粗
                    var $this = $(this);
                    var text = _this.GetText(_this.currTextId)||{};
                    var fontStyle = 0;
                    if ($this.hasClass("sel")) {
                        if(text.font_style>1){
                            fontStyle = 2;
                        }else{
                            fontStyle = 0;
                        }
                        $this.removeClass("sel");
                    } else {
                        if(text.font_style==2){
                            fontStyle = 3;
                        }else{
                            fontStyle = 1;
                        }
                        $this.addClass("sel");
                    }
                    _this.SetText({
                        font_style: fontStyle
                    });
                }).delegate(_this.tools.font_style, "click.designer", function(e) { //是否斜体
                    var $this = $(this);
                    var text = _this.GetText(_this.currTextId)||{};
                    var fontStyle = 0;
                    if ($this.hasClass("sel")) {
                        if(text.font_style==1||text.font_style==3){
                            fontStyle = 1;
                        }
                        $this.removeClass("sel");
                    } else {
                        if(text.font_style==1){
                            fontStyle = 3;
                        }else{
                            fontStyle = 2;
                        }
                        $this.addClass("sel");
                    }
                    _this.SetText({
                        font_style: fontStyle
                    });
                }).delegate(_this.tools.dtext_halign, "click.designer", function(e) { //文字水平对齐方式
                    var $this = $(this);
                    var textHAlign = '';//无，默认
                    //$this.addClass("sel").siblings(".dtext_halign").removeClass("sel");
                    if ($this.hasClass("dtext_left")) {//左对齐
                        textHAlign = 'left';
                    } else if ($this.hasClass("dtext_center")) {//水平居中对齐
                        textHAlign = 'center';
                    } else if ($this.hasClass("dtext_right")) {//右对齐
                        textHAlign = 'right';
                    }
                    _this.Typeset({
                        text_halign: textHAlign
                    });
                }).delegate(_this.tools.dtext_valign, "click.designer", function(e) { //文字垂直对齐方式
                    var $this = $(this);
                    var textVAlign = '';//无，默认
                    //$this.addClass("sel").siblings(".dtext_valign").removeClass("sel");
                    if ($this.hasClass("dtext_top")) {//顶对齐
                        textVAlign = 'top';
                    } else if ($this.hasClass("dtext_middle")) {//垂直居中对齐
                        textVAlign = 'middle';
                    } else if ($this.hasClass("dtext_bottom")) {//底对齐
                        textVAlign = 'bottom';
                    }
                    _this.Typeset({
                        text_valign: textVAlign
                    });
                }).delegate(_this.tools.text_halign, "change.designer", function(e) { //对齐方式改变
                    var $this = $(this);
                    var $ditem = $this.closest(".ditem");
                    var textId = $("textarea", $ditem).attr("id")||"";
                    if(textId){
                        _this.SetText({
                            text_halign: $this.val()
                        }, textId);
                    }
                    $this.blur();
                }).delegate(_this.tools.text_valign, "change.designer", function(e) { //对齐方式改变
                    var $this = $(this);
                    var $ditem = $this.closest(".ditem");
                    var textId = $("textarea", $ditem).attr("id")||"";
                    if(textId){
                        _this.SetText({
                            text_valign: $this.val()
                        }, textId);
                    }
                    $this.blur();
                })/*.delegate(".dtag", "click.designer", function(e) { //文字垂直对齐方式
             var $this = $(this);
             })*/;/*.delegate(_this.tools.dtext_add, "click.designer", function(e) { //文字垂直对齐方式
             var $this = $(this);
             _this.SetField($(this));
             var text = {
             "name": "字段",
             "text": "这里输入文字",
             "font_name": "",
             "font_size": 14,
             "font_style": 0,
             "left": 0,
             "top": 0,
             "text_halign": "",
             "text_valign": ""
             };
             if(_this.data.pages[_this.pageIndex]){
             _this.data.pages[_this.pageIndex].texts.push(text);
             _this.AddText(_this.pageIndex, text, true);
             }
             });*/
            _this.$dtexts.delegate(_this.tools.dtext_add, "click.designer", function(e) { //文字垂直对齐方式
                _this.SetField($(this));
                return false;
            });
            if(_this.level){
                var isMove = 0;
                _this.$dview.delegate(".dcanvas", "mouseenter.designer", function(e) {
                    isMove = 1;
                }).delegate(".dcanvas", "mouseleave.designer", function(e) {
                    isMove = 0;
                });
                $(document).bind("keydown.designer", function(e) {
                    if(isMove==1){
                        var keyCode = e.keyCode;
                        var offsetX = 0, offsetY = 0;
                        if(keyCode==37){//左
                            offsetX = -1;
                            e.preventDefault();
                        }else if(keyCode==38){//上
                            offsetY = -1;
                            e.preventDefault();
                        }else if(keyCode==39){//右
                            offsetX = 1;
                            e.preventDefault();
                        }else if(keyCode==40){//下
                            offsetY = 1;
                            e.preventDefault();
                        }
                        if(offsetX!=0||offsetY!=0){
                            $(".dtag.sel, .dtag_focus .dtag", _this.$dview).each(function(i, el){
                                _this.SetPosition(el, offsetX, offsetY);
                            });
                        }
                    }
                });
            }
            $(document).bind("click.designer", function(e) { //点击非编辑区域时去除选中效果
                var $this = $(e.target);
                //console.log('document=>click.designer=>',$this.attr("id"),'--',_this.currTextId);
                if($this.hasClass("dusable") || $this.closest(".dusable").length)return;
                $(".dtag.sel", _this.$dview).removeClass("sel");
                if (_this.currTextId == '' || $this.attr("id") == _this.currTextId || $this.hasClass("dtag")) return;
                $("#" + _this.currTextId).closest(".dtext").removeClass("dfocus");
                var tagId = _this.currTextId.replace('_dtext_', '_dtag_');
                if (tagId) _this.SetSelectedText("#" + tagId);
                _this.currTextId = '';
            }).bind("keydown.designer", function(e) { //点击非编辑区域时去除选中效果
                if(e.target.tagName.toLowerCase()=='body'&&e.keyCode==8){
                    e.preventDefault();
                }
            });
            _this.SetSelectedPage(0); //默认选中正面（第一页）
            if(_this.level){
                _this.Region();//框选处理
            }
        },
        SetField: function(trigger){
            var _this = this;
            var $dom = null;
            var $trigger = $(trigger);
            var htmls = ['<ul class="check_fields">'];
            htmls.push('');
            var chkCount = 0, fieldCount = 0;
            //for(var field, i=0; field=_this.fields[i]; i++){
            for(var field in _this.fields){
                if(_this.fields.hasOwnProperty(field)){
                    //设置已勾中的
                    var isChecked = false;
                    for (var text, n = 0; text = _this.data.pages[_this.pageIndex].texts[n]; n++) {
                        if(text.name==field){
                            isChecked = true;
                            chkCount++;
                        }
                    }
                    fieldCount++;
                    htmls.push('<li><label><input type="checkbox" name="field" value="'+field+'" '+(isChecked?'checked="checked"':'')+' />'+field+'</label></li>');
                }
            }
            htmls.push('<li><a class="file_btn" href="javascript:;">确 认</a><li>');
            htmls.push('</ul>');
            htmls[1] = '<li><label><input type="checkbox" name="fieldall" value="" '+(chkCount==fieldCount?'checked="checked"':'')+' />全选</label></li>';
            //绑定下拉面板
            _this.checkFields = new DropPanel({
                id: 'check_fields',
                trigger: $trigger,
                content: htmls.join(''),
                callback: function(_self){
                    $dom = _self.$dom;
                    T.Checkboxs($dom[0], 'field', 'fieldall');
                    //绑定确认选中事件
                    $dom.delegate(".file_btn", "click.designer", function(e) { //确认选择
                        var attrs = T.GetChecked($dom[0], 'field');
                        if(_this.checkFields){
                            _this.checkFields.Remove();
                        }
                        //删除多余旧字段
                        for (var text, n = 0; text = _this.data.pages[_this.pageIndex].texts[n]; n++) {
                            var isExist = false;
                            for(var attr='', k=0; attr=attrs[k]; k++){
                                if(attr==text.name){
                                    isExist = true;
                                }
                            }
                            if(isExist)continue;
                            n--;
                            _this.DelText(_this.uuid+"_dtext_"+_this.pageIndex+"_"+text.index);
                        }
                        //添加新字段并排序
                        var texts = [];
                        for(var attr='', k=0; attr=attrs[k]; k++){
                            var isExist = false;
                            for (var text, n = 0; text = _this.data.pages[_this.pageIndex].texts[n]; n++) {
                                if(attr==text.name){
                                    texts.push(text);
                                    isExist = true;
                                }
                            }
                            if(isExist)continue;
                            var _text = {};
                            for(var field in _this.fields){
                                if(_this.fields.hasOwnProperty(field)){
                                    if(attr==field){
                                        _text = {
                                            atr: field,
                                            val: _this.fields[field]
                                        };
                                    }
                                }
                            }
                            /*for(var field, i=0; field=_this.fields[i]; i++){
                             if(attr==field.atr){
                             _text = field;
                             }
                             }*/
                            if(_text.atr){
                                var text = {
                                    "name": _text.atr,
                                    "text": _text.val,
                                    "font_name": _this.default_font_name,
                                    "font_size": _this.default_font_size,
                                    "font_style": _this.default_font_color,
                                    "left": 0,
                                    "top": 0,
                                    "text_halign": "left",
                                    "text_valign": "top"
                                };
                                texts.push(text);
                                /*if(_this.data.pages[_this.pageIndex]){
                                 _this.data.pages[_this.pageIndex].texts.push(text);
                                 _this.AddText(_this.pageIndex, text, true);
                                 }*/
                            }
                        }
                        _this.data.pages[_this.pageIndex].texts = texts;
                        _this.LoadText();
                    });
                }
            });
        },
        Loader: function() { //加载设计器
            var _this = this;
            var htmls = [];
            htmls.push('<div class="dtoolbar">');
            htmls.push('<div class="file_btns clearfix">');
            htmls.push('<a class="file_btn" href="javascript:;"><input  id="upload_image1" type="file"/><span class="doing">正在上传...</span></a>');
            htmls.push('<a class="file_btn" href="javascript:;"><input  id="upload_image2" type="file"/><span class="doing">正在上传...</span></a>');
            htmls.push('</div><div class="cfgs clearfix">');
            htmls.push('<span class="selectbar" style="width:150px"><input class="dusable" type="text" name="dfont_list" placeholder="字体" /><select name="dfont_list" class="dusable"></select></span>');
            htmls.push('<span class="selectbar" style="width:60px"><input class="dusable" type="text" name="dfont_size_list" placeholder="字体大小" /><select name="dfont_size_list" class="dusable"></select></span>');
            htmls.push('<a class="font_color dusable" href="javascript:;">颜色</a>');
            htmls.push('<a class="font_weight dusable" title="加粗" href="javascript:;">加粗</a>');
            htmls.push('<a class="font_style dusable" title="斜体" href="javascript:;">斜体</a>');
            htmls.push('<a class="dtext_halign dtext_left dusable" href="javascript:;">居左</a>');
            htmls.push('<a class="dtext_halign dtext_center dusable" href="javascript:;">居中</a>');
            htmls.push('<a class="dtext_halign dtext_right dusable" href="javascript:;">居右</a>');
            htmls.push('<a class="dtext_valign dtext_top dusable" href="javascript:;">居顶</a>');
            htmls.push('<a class="dtext_valign dtext_middle dusable" href="javascript:;">垂直居中</a>');
            htmls.push('<a class="dtext_valign dtext_bottom dusable" href="javascript:;">居下</a>');
            htmls.push('<!--a class="dtext_add dusable" href="javascript:;">添加</a-->');
            htmls.push('</div></div>');
            if(_this.level){
                _this.$dtexts.before(htmls.join(''));
            }

            htmls = [];
            if(_this.level){
                htmls.push('<dt class="fr"><a class="file_btn dtext_add dusable" href="javascript:;">+选择字段</a></dt>');
            }
            //htmls.push('<dt class="fr"><a class="file_btn" href="javascript:;"><input  id="upload_image2" type="file"/><span class="doing">正在上传...</span></a></dt>');
            //htmls.push('<dt class="fr"><a class="file_btn" href="javascript:;"><input  id="upload_image1" type="file"/><span class="doing">正在上传...</span></a></dt>');
            _this.index = 0;
            for (var i = 0; i < _this.pageCount; i++) {
                htmls.push('<dt index="' + i + '" class="dtab">' + ['正面', '反面'][i] + '</dt>');
            }
            //DIY信息区域
            for (var i = 0; i < _this.pageCount; i++) {
                htmls.push('<dd index="' + i + '" class="dtab_content"></dd>');
            }
            _this.$dtexts.html(htmls.join(''));

            htmls = [];
            _this.index = 0;
            for (var i = 0; i < _this.pageCount; i++) {
                htmls.push('<div index="' + i + '" class="dpage hid">');
                htmls.push('<div class="dcont">');
                htmls.push('<dl class="dcanvas">');
                //DIY标签区域
                htmls.push('<dd class="dtags"></dd>');
                //圆角效果
                htmls.push('<dt class="circles circle_lt"></dt>');
                htmls.push('<dt class="circles circle_lb"></dt>');
                htmls.push('<dt class="circles circle_rt"></dt>');
                htmls.push('<dt class="circles circle_rb"></dt>');
                htmls.push('</dl>');
                htmls.push('</div>');
                htmls.push('<h3 class="dname">名片'+['正面', '反面'][i]+'</h3>');
                htmls.push('</div>');
            }
            _this.$dview.html(htmls.join(''));
            _this.$dhead.html("模板编号："+(_this.data.templateId||""));
        },
        LoadText: function(){
            var _this = this;
            $(".dtags .dtag", _this.$dview).remove();
            $(".dtab_content", _this.$dtexts).html("");
            //初始化字段
            for (var i = 0; i < _this.pageCount; i++) {
                for (var text, k = 0; text = _this.data.pages[i].texts[k]; k++) {
                    _this.AddText(i, text);
                }
            }
        },
        DelText: function(textId){
            var _this = this;
            var $this = $("#"+textId);
            var $ditem = $this.closest(".ditem");
            _this.GetText(textId, true);
            $ditem.remove();
            setTimeout(function(){
                $("#"+textId.replace('_dtext_', '_dtag_')).remove();
            }, 0);
        },
        /**
         * 添加文本
         * @param {Number} pageIndex //面编号，第几面
         * @param {Object} text //文本对象
         * @param {Boolean} isFocus 是否默认选中
         */
        AddText: function(pageIndex, text, isFocus) {
            var _this = this;
            _this.index++;
            text.index = _this.index;
            var htmls = [];
            var textId = _this.uuid+'_dtext_' + pageIndex + '_' + _this.index;
            var tagId = _this.uuid+'_dtag_' + pageIndex + '_' + _this.index;
            htmls.push('<div class="ditem clearfix">');
            if(_this.level){
                htmls.push('<div class="fr">');
                var haligns = {left: '左',center: '中',right: '右'};
                htmls.push('<select class="dusable" name="text_halign">');
                for (var o in haligns) {
                    if (haligns.hasOwnProperty(o)) {
                        if(text.text_halign==o){
                            htmls.push('<option value="'+o+'" selected="selected">'+haligns[o]+'</option>');
                        }else{
                            htmls.push('<option value="'+o+'">'+haligns[o]+'</option>');
                        }
                    }
                }
                htmls.push('</select>');
                var valigns = {top: '上',middle: '中',bottom: '下'};
                htmls.push('<select class="dusable" name="text_valign">');
                for (var o in valigns) {
                    if (valigns.hasOwnProperty(o)) {
                        if(text.text_valign==o){
                            htmls.push('<option value="'+o+'" selected="selected">'+valigns[o]+'</option>');
                        }else{
                            htmls.push('<option value="'+o+'">'+valigns[o]+'</option>');
                        }
                    }
                }
                htmls.push('</select>');
                htmls.push('<a class="ddel" href="javascript:;">删</a>');
                htmls.push('</div>');
            }
            htmls.push('<label class="dtext clearfix">');
            htmls.push('<span class="dfield">'+text.name+'</span><div class="dinput"><textarea id="'+textId+'"'+(_this.editable?'':' disabled="disabled"')+'>' + (text.text||'') + '</textarea></div>');
            htmls.push('</label>');
            htmls.push('</div>');
            $(".dpage[index='" + pageIndex + "'] .dtags", _this.$container).append('<img id="'+tagId+'" class="dtag" style="left:0px;top:0px;"/>');
            $(".dtab_content[index='" + pageIndex + "']", _this.$container).append(htmls.join(''));
            if(_this.level){
                //标签拖拽
                _this.DragDropText($("#"+tagId)[0]);
            }
            if(isFocus){
                _this.currTextId = textId;
                $("#" + textId).focus();
            }
            $(".dtag.sel", _this.$dview).removeClass("sel");
            _this.SetText(text, textId);
            setTimeout(function(){
                $("#" + textId).trigger("keyup.designer");
            }, 10);
        },
        GetText: function(textId, isRemove){
            if(!textId)return null;
            var _this = this;
            var arr = textId.split('_');
            var text = null;
            if(_this.data.pages[arr[2]]){
                var texts = _this.data.pages[arr[2]].texts;
                if(texts){
                    for(var temp=null, i=0; temp=texts[i]; i++){
                        if(temp.index==arr[3]){
                            if(isRemove){
                                texts.splice(i,1);
                            }else{
                                text = temp;
                            }
                        }
                    }
                }
            }
            return text;
        },
        Typeset: function(params){
            var _this = this;
            /*$(".dtag.sel, .dtag_focus .dtag", _this.$dview).each(function(i, el){
             var text = _this.GetText(el.id);
             if(text){
             for (var o in params) {
             if (params.hasOwnProperty(o)) {
             text[o] = params[o];
             }
             }
             _this.SetPosition(el, text);
             }
             });*/
            var texts = [], isRefer = false;//是否有参考字段
            var $dtags = $(".dtags:first-child", _this.$dview);
            var minTop = _this.gap, minLeft = _this.gap, maxTop = _this.gap, maxLeft = _this.gap;
            $(".dtag.sel, .dtag_focus .dtag", _this.$dview).each(function(i, el){
                var text = _this.GetText(el.id);
                if(text){
                    $dtags = $(el).closest(".dtags");
                    if($(el).closest(".dtag_focus").length>0){
                        isRefer = true;
                        minTop = text.top;
                        maxTop = text.top+text.height;
                        minLeft = text.left;
                        maxLeft = text.left+text.width;
                    }
                    if(!isRefer){
                        if(!texts.length){
                            minTop = text.top;
                            maxTop = text.top+text.height;
                            minLeft = text.left;
                            maxLeft = text.left+text.width;
                        }else{
                            minTop = Math.min(minTop, text.top);
                            maxTop = Math.max(maxTop, text.top+text.height);
                            minLeft = Math.min(minLeft, text.left);
                            maxLeft = Math.max(maxLeft, text.left+text.width);
                        }
                    }
                    texts.push({el: el, text:text});
                }
            });
            var cw = $dtags.outerWidth();
            var ch = $dtags.outerHeight();
            if(texts.length==1){
                minTop = _this.gap;
                minLeft = _this.gap;
                maxTop = ch-_this.gap;
                maxLeft = cw-_this.gap;
            }
            for(var obj=null, i=0; obj=texts[i]; i++){
                if(params.text_halign=='left'){
                    obj.text.left = minLeft;
                }
                if(params.text_halign=='right'){
                    obj.text.left = maxLeft-obj.text.width;
                }
                if(params.text_halign=='center'){
                    obj.text.left = Math.round(minLeft+((maxLeft-minLeft-obj.text.width)/2));
                }
                if(params.text_valign=='top'){
                    obj.text.top = minTop;
                }
                if(params.text_valign=='bottom'){
                    obj.text.top = maxTop-obj.text.height;
                }
                if(params.text_valign=='middle'){
                    obj.text.top = Math.round(minTop+((maxTop-minTop-obj.text.height)/2));
                }
                for (var o in params) {
                    if (params.hasOwnProperty(o)&&o!='text_halign'&&o!='text_valign') {
                        obj.text[o] = params[o];
                    }
                }
                _this.SetPosition(obj.el, obj.text);
            }
        },
        SetText: function(params, currTextId){
            var _this = this;
            if(currTextId){
                _this.UpdateText(params, currTextId);
            }else{
                $(".dtag.sel, .dtag_focus .dtag", _this.$dview).each(function(i, el){
                    _this.UpdateText(params, el.id);
                });
            }
        },
        UpdateText: function(params, currTextId) {debugger
            var _this = this;
            var currTextId = currTextId||_this.currTextId;
            var text = _this.GetText(currTextId);
            if(!text)return;
            var $textarea = $("#" + currTextId);
            if (!$textarea.length) return;
            /*try{
                $textarea.focus();
            }catch(e){}*/
            $textarea.height(20).height($textarea[0].scrollHeight-8);
            var tagId = currTextId.replace('_dtext_', '_dtag_');
            for (var o in params) {
                if (params.hasOwnProperty(o)) {
                    text[o] = params[o];
                }
            }
            if(/^\s*$/.test(text.text)){
                text.text = ' ';
            }
            //console.log('OK==>', JSON.stringify(params));
            var src = _this.getTextApi + '?' + T.ConvertToQueryString(text);
            _this.LoadImage(src, function(imgsrc, nw, nh){
                $("#" + tagId).attr("src", src);
                if(text.text_halign=='center'&&text.width&&text.height){
                    text.left = Math.round(text.left+(text.width-nw)/2);
                }
                if(text.text_halign=='right'&&text.width&&text.height){
                    text.left = Math.round(text.left+(text.width-nw));
                }
                if(text.text_valign=='middle'&&text.width&&text.height){
                    text.top = Math.round(text.top+(text.height-nh)/2);
                }
                if(text.text_valign=='bottom'&&text.width&&text.height){
                    text.top = Math.round(text.top+(text.height-nh));
                }
                text.width = nw;
                text.height = nh;
                _this.SetPosition($("#" + tagId), text);
            }, function(imgsrc){
                alert(T.TIPS.DEF);
            }, 5);

        },
        SetStyle: function(text){
            var _this = this;
            text = text||_this.GetText(_this.currTextId);
            if(!text)return;
            _this.default_font_name = text.font_name||'宋黑';
            _this.default_font_size = text.font_size||14;
            _this.SetFontList(0, $(_this.tools.font_input, _this.$container).val()||"");
            _this.SetFontList(1, $(_this.tools.font_size_input, _this.$container).val()||"");
            //字体
            $(_this.tools.font, _this.$dtoolbar).val(_this.default_font_name);
            //字体大小
            $(_this.tools.font_size, _this.$dtoolbar).val(_this.default_font_size+'px');
            //字体颜色
            $(_this.tools.font_color, _this.$dtoolbar).data("color", '#'+(text.font_color||'000000'));
            //加粗、斜体
            $(_this.tools.font_weight, _this.$dtoolbar).removeClass("sel");
            $(_this.tools.font_style, _this.$dtoolbar).removeClass("sel");
            if(text.font_style==1||text.font_style==3){
                $(_this.tools.font_weight, _this.$dtoolbar).addClass("sel");
            }
            if(text.font_style==2||text.font_style==3){
                $(_this.tools.font_style, _this.$dtoolbar).addClass("sel");
            }
            /*//文字水平布局
             $(_this.tools.dtext_halign, _this.$dtoolbar).removeClass("sel");
             $(".dtext_"+text.text_halign, _this.$dtoolbar).addClass("sel");
             //文字垂直布局
             $(_this.tools.dtext_valign, _this.$dtoolbar).removeClass("sel");
             $(".dtext_"+text.text_valign, _this.$dtoolbar).addClass("sel");*/
        },
        /**
         * 加载图片
         * @param {String} imgsrc 图片地址
         * @param {Function} success 加载完成回调函数
         * @param {Function} failure 加载失败回调函数
         * @param {Boolean} retry 加载失败重试次数，默认为不重试，负数：一直重试，整数：重试指定次数
         */
        LoadImage: function(imgsrc, success, failure, retry) {
            var _this = this;
            if (!imgsrc) return;
            retry = parseInt(retry || 0) || 0;
            var img = new Image();
            img.onload = function() {
                if (typeof(success) == 'function') success.call(_this, imgsrc, img.naturalWidth || img.width, img.naturalHeight || img.height);
            }
            img.onabort = img.onerror = function() {
                if (retry) {
                    retry--;
                    _this.LoadImage(imgsrc, success, failure, retry);
                } else {
                    if (typeof(failure) == 'function') failure.call(_this, imgsrc);
                }
            }
            img.src = imgsrc;
        },
        bindUpload: function(type, inputId, text, text2){
            var _this = this;
            T.GET({
                action: COM_API.get_token
                ,params: { key: '{"APPKEY":"","userid":"","expiration":"1200000","fileType":"jpg","parameter":"0"}' }
                ,success: function(data){
                    if(data&&data.Token){
                        _this.Token = data.Token;
                        _this.Loadswf(type, inputId, text, text2);
                    }
                }
                ,failure: function(data){
                    T.msg('获取上传凭证失败，请尝试刷新页面。');
                }
                ,error: function(data){
                    T.msg('获取上传凭证失败，请尝试刷新页面。');
                }
            });
        },
        Loadswf: function(type, inputId, text, text2){
            var _this = this;
            var inputId = inputId||'file_upload'
            var params = {
                source_file: '',
                file_url: ''
            }, tempFile = {}, startTime = 0;
            if(!document.getElementById(inputId))return;
            var $inputfile = $("#"+inputId), $network = $("#"+inputId+"_network");
            var $upload_button = $inputfile.closest(".file_btn");
            $inputfile.uploadify({
                method: 'post',
                fileObjName: 'file',
                swf: _this.options.swfurl||'uploadify.swf',
                uploader: 'http://up.qiniu.com/?' + T.VER,
                buttonText: text,
                width: 128,
                height: 32,
                fileSizeLimit: '100MB',
                multi: false,
                fileTypeExts: '*.jpg; *.png;',
                queueID: inputId+'_progressbar',
                errorMsg: '只能上传pdf、psd、ai、jpg、cdr、rar、zip格式的文件',
                onUploadStart: function (file) {
                    $("#popup_upload_excel_foot a").hide();
                    _this.isUploading = true;
                    params.source_file = '';
                    params.file_url = '';
                    startTime = new Date().getTime();
                    var name = file.name;
                    tempFile.name = name;
                    var idx = name.lastIndexOf('.');
                    tempFile.fix = '';
                    if (idx > 0) tempFile.fix = name.substring(idx).toLowerCase();
                    if (tempFile.fix) tempFile._fix = tempFile.fix.substring(1);
                    $inputfile.uploadify('settings', 'formData', { key: 'tpl'+T.GetFileUrl() + tempFile.fix, token: _this.Token });
                    $upload_button.closest(".file_btn").addClass("uping");
                },
                onUploadProgress: function (file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
                    var time = (new Date().getTime() - startTime) / 1000;
                    bytesTotal = (bytesTotal / 1024).toFixed(3);
                    bytesUploaded = (bytesUploaded / 1024).toFixed(3);
                    $network.html('<span>文件大小： ' + (bytesTotal / 1024).toFixed(3) + 'MB</span><span>已 上 传 ： ' + (bytesUploaded / 1024).toFixed(3) + 'MB</span><span>上传速率： ' + (bytesUploaded / time).toFixed(3) + 'KB/S</span>');
                },
                onCancel: function (file) {
                    _this.isUploading = false;
                    $network.html('');
                    params.source_file = '';
                    params.file_url = '';
                    $upload_button.closest(".file_btn").removeClass("uping");
                },
                onUploadSuccess: function (file, data, response) {
                    _this.isUploading = false;
                    $network.html('');
                    var time = Math.ceil((new Date().getTime() - startTime) / 1000);
                    var text = '文件 "' + file.name + '" 上传成功，耗时';
                    var isAlt = false;
                    if (time >= 3600) {
                        isAlt = true;
                        text += Math.floor(time / 3600) + ' 小时 ';
                        time = time % 3600;
                    }
                    if (time >= 60) {
                        isAlt = true;
                        text += Math.floor(time / 60) + ' 分 ';
                        time = time % 60;
                    }
                    text += time + ' 秒';
                    if (isAlt) {
                        T.alt(text);
                    } else {
                        T.msg(text);
                    }
                    var data = T.JSON.parse(data);
                    tempFile.key = data.key;
                    params.source_file = tempFile.name;
                    params.file_url = T.DOMAIN.CLOUD + data.key;
                    _this.Uploaded(type, inputId, params);
                    $('.uploadify-button-text', $upload_button).text(text2);
                    $upload_button.closest(".file_btn").removeClass("uping");
                },
                onFallback: function () {
                    $upload_button.attr("href", T.FlashPlayerURL).attr("target", '_blank').text('安装Flash插件');
                },
                itemTemplate: '<span id="${fileID}" class="uploadify-queue-item">\
						        <span class="uploadify-progress">\
							        <span class="uploadify-progress-bar"></span>\
						        </span>\
                                <span class="cancel">\
							        <a href="javascript:$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\')">取消</a>\
						        </span>\
					        </span>'
            });
            document.body.onbeforeunload = function () {
                if (_this.isUploading) return '正在上传文件，如果离开数据将丢失，您确认要离开吗？';
            };
        }
    };
    return function(options) {
        return new Designer(options);
    };
});