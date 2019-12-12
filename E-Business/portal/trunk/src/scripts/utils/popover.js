"use strict";
/**
 * @fileOverview 弹出框基础类
 */
define("utils/popover", ["utils/base", "utils/dom", "utils/drag", "utils/mediator"], function(Base, DOM, Drag, Mediator){
    /**
     * 弹出框基础类
     * @summary 弹出框基础类
     * @namespace Utils.Popover
     * @author Woo
     * @version 1.1
     * @since 2016/2/23
     * @param {Object} params 配置参数
     * @param {Object|String} params.trigger 触发对象
     * @param {Object|String} params.target 目标对象
     * @constructor
     */
    function Popover(params) {
        var _this = this;
        params = params || {};
        var options = {
            target: '',
            id: '',
            type: 'html',//html||object||iframe||url
            modal: true,//true：则为模态
            fixed: false,
            style: '',
            zIndex: 1010,
            width: 'auto',
            height: 'auto',
            title: '',
            content: '',
            close: true,
            ok: '',
            no: '',
            okFn: null,
            noFn: null,
            closeFn: null,
            data: null,//参数，url加载时传递
            success: null,//加载成功回调，url加载时传递
            failure: null,//加载失败回调，url加载时传递
            callback: null,
            isPosition: true,
            otherClose: false //图片查看器
        };
        options = Base.extend(options, params);
        Popover.uuid = Popover.uuid || [];
        var container = document.body || document.documentElement;//容器
        if (!container)return;
        if (typeof options.trigger === 'string')options.trigger = DOM.byId(options.trigger);
        if (options.trigger && options.trigger.nodeType == 1) {
            var clicked = DOM.attr('clicked');
            if (clicked == 'clicked') {
                return;
            } else {
                DOM.attr('clicked', 'clicked');
            }
        }

        function getUUID() {
            var str = Base.randomString(32) + new Date().getTime();
            return Popover.uuid[str] ? getUUID() : str;
        }

        if (options.id && Popover.uuid[options.id])return;
        var UUID = options.id || getUUID();
        Popover.uuid.push(UUID);
        Popover.uuid[UUID] = _this;
        var cw = options.width + (isNaN(options.width) ? '' : 'px');
        var ch = options.height + (isNaN(options.height) ? '' : 'px');
        var sTop = options.modal ? 0 : Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        var filter = null, layer = null, content = null, panel = null, iframe = null, headline = null;

        if (options.modal) {
            filter = DOM.create('div', {
                'id': UUID + '_filter', 'class': 'popup_filter popup_loading', 'style': 'z-index:' + options.zIndex
            });
            if (!Base.IS.fixed){
                filter.innerHTML = '<div class="popup_opacity"><iframe frameborder="0" scrolling="no"></iframe></div>';
            }
            container.appendChild(filter);
        }
        layer = DOM.create('div', {
            'id': UUID + '_layer', 'class': 'popup_layer popup_hide' + (options.fixed ? ' fixed' : '') + (options.style ? ' ' + options.style : ''), 'style': 'z-index:' + (options.zIndex + 10) + ';width:' + cw + ';height:' + ch + ';top:' + sTop + 'px;'
        });
        if (!Base.IS.fixed){
            layer.innerHTML = '<div class="popup_opacity"><iframe frameborder="0" scrolling="no"></iframe></div>';
        }
        panel = DOM.create('div', {
            'id': UUID + '_panel', 'class': 'popup_panel'
        });
        layer.appendChild(panel);
        var btns = options.ok == '' ? '' : '<a id="' + UUID + '_ok" class="ok btn-primary" href="javascript:;">' + options.ok + '</a>';
        btns += options.no == '' ? '' : '<a id="' + UUID + '_no" class="no btn-default" href="javascript:;">' + options.no + '</a>';
        var btn = options.close ? '<a id="' + UUID + '_close" class="close" href="javascript:;" title="关闭"></a>' : '';
        var html = options.title == '' ? btn : '<div id="' + UUID + '_head" class="popup_head">' + btn + '<h3 id="' + UUID + '_headline">' + options.title + '</h3></div>';
        var ctt = options.type == 'iframe' ? '<iframe id="' + UUID + '_iframe" src="" frameborder="0" allowtransparency="true" scrolling="auto"></iframe>' : '';
        ctt = options.type == 'html' ? options.content : ctt;
        html += '<div id="' + UUID + '_main" class="popup_main">' + ctt + '</div>';
        html += btns == '' ? '' : '<div id="' + UUID + '_foot" class="popup_foot">' + btns + '</div>';
        panel.innerHTML = html;

        container.appendChild(layer);
        content = document.getElementById(UUID + '_main');
        iframe = document.getElementById(UUID + '_iframe');
        headline = document.getElementById(UUID + '_headline');
        var closeBtn = document.getElementById(UUID + '_close');
        var noBtn = document.getElementById(UUID + '_no');
        var okBtn = document.getElementById(UUID + '_ok');
        if (options.close && closeBtn) {
            DOM.bind(closeBtn, 'click', function (e) {
                _this.trigger("close", _this) && _this.trigger("no", _this);
                _this.remove();
            });
        }
        if (options.no != '' && noBtn) {
            DOM.bind(noBtn, 'click', function (e) {
                _this.trigger("no", _this) && _this.remove();
            });
        }
        if (options.ok != '' && okBtn) {
            DOM.bind(okBtn, 'click', function (e) {
                _this.trigger("ok", _this) && _this.remove();
            });
        }
        if (options.otherClose) { //图片查看器
            DOM.bind(filter, 'click', function (e) {
                e = e || event;
                var target = e.target || e.srcElement;
                if (DOM.hasClass(target, 'popup_filter')) {
                    _this.remove();
                    _this.trigger("no", _this);
                }
            });
        }
        _this.remove = function () {
            if(options.parentPopup && options.parentPopup.setPosition){
                options.parentPopup.setPosition();
            }
            DOM.unbind(document, 'keydown', _this.keydown);
            if (filter) {
                container.removeChild(filter);
                filter = null;
            }
            if (layer) {
                container.removeChild(layer);
                layer = null;
            }
            if (Popover.uuid[UUID]) {
                delete Popover.uuid[UUID];
            }
            options.trigger && DOM.removeAttr(options.trigger, 'clicked');
        };
        _this.hide = function () {
            if (filter) {
                DOM.addClass(filter, 'popup_hide');
            }
            if (layer) {
                DOM.addClass(layer, 'popup_hide');
            }
        };
        _this.show = function () {
            if(options.parentPopup && options.parentPopup.hide){
                options.parentPopup.hide();
            }
            if (filter) {
                DOM.removeClass(filter, 'popup_hide');
                DOM.removeClass(filter, 'popup_loading');
            }
            if (layer) {
                DOM.removeClass(layer, 'popup_hide');
            }
        };
        _this.setPosition = function () {
            if (layer) {
                var wh = DOM.getSize();
				var fixed = options.fixed
				if(panel.offsetHeight > wh.h){
					fixed = false
					DOM.removeClass(layer, 'fixed');
				}else if(options.fixed){
					DOM.addClass(layer, 'fixed');
				}
                if(options.isPosition){
                    var sp = DOM.getScrollPos();
                    if (typeof(options.setSize) === 'function') {
                        options.setSize.call(_this, layer, panel, wh);
                    }
                    var top = (wh.h - panel.offsetHeight) / 2;
                    var left = (wh.w - panel.offsetWidth) / 2;
                    top = Math.max(0, top);
                    top = Math.min(wh.h, top);
                    var sTop = fixed ? 0 : sp.y;
                    var sLeft = fixed ? 0 : sp.x;
                    layer.style.height = 'auto';
                    layer.style.top = sTop + top + 'px';
                    layer.style.left = sLeft + left + 'px';
                }else{
                    layer.style.top = 0;
                    layer.style.left = 0;
                }
                if (typeof _this.show === 'function')_this.show();
            }
        };
        _this.keydown = function (e) {
            e = e || window.event;
            var keycode = e.keyCode || e.which;
            if (keycode == 27) {
                _this.remove();
                _this.trigger("close", _this) && _this.trigger("no", _this);
            }
        };
        _this.setFocus = function () {
            if (closeBtn) {
                closeBtn.focus();
                closeBtn.blur();
            }
            if (noBtn) {
                noBtn.focus();
            }
            if (okBtn) {
                okBtn.focus();
            }
        };
        _this.loaded = function () {
            typeof options.callback === 'function' && options.callback.call(_this, _this, layer);
            _this.setPosition();
            _this.setFocus();//2015-01-26
            DOM.bind(window, 'resize', _this.setPosition);
        };
        var _top = sTop - panel.offsetHeight;
        layer.style.top = _top + 'px';
        if (options.type == 'iframe') {
            if (iframe) {
                var isFirst = true;
                var autoIframe = function() {
                    var _height = document.documentElement.clientHeight * 0.8;
                    var height = _height - (layer.offsetHeight - content.clientHeight);
                    var pageWidth = iframe.contentWindow.document.body.offsetWidth;
                    var pageHeight = iframe.contentWindow.document.body.offsetHeight;
                    var width = pageWidth + (pageHeight > height ? 17 : 0) + 'px';
                    iframe.style.width = width;
                    iframe.style.height = height + 'px';
                    pageWidth = _height < pageHeight ? pageWidth + 15 : pageWidth;
                    layer.style.width = width;
                    options.callback != null && typeof options.callback == 'function' && options.callback.call(_this, _this);
                    if (isFirst)_this.loaded();
                    isFirst = false;
                }
                iframe.callback = autoIframe;
                iframe.src = options.content;
            }
        }
        else if (options.type == 'object') {
            if (options.content && options.content.nodeType == 1) {
                content.appendChild(options.content);
                _this.loaded();
                if (options.content.offsetWidth) {
                    layer.style.width = options.content.offsetWidth;
                    _this.setPosition();
                }
            }
        } else {
            content.innerHTML = options.content;
            _this.loaded();
        }
        _this.dom = layer;
        new Drag({
            trigger: headline,
            target: layer,
            keepOrigin: false
        });
        DOM.bind(document, 'keydown', _this.keydown);
    }
    //让Popover具备事件功能
    Mediator.installTo(Popover.prototype);
    return function(options){
        return new Popover(options);
    };
});