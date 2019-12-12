import DOM from './dom'

/**
 * 拖拽基础类
 * @summary 拖拽基础类
 * @namespace Utils.Drag
 * @author Woo
 * @version 1.1
 * @since 2016/2/22
 * @param {Object} options 配置参数
 * @param {Object|String} options.trigger 触发对象
 * @param {Object|String} options.target 目标对象
 * @param {Number} [options.opacity] 透明度
 * @param {Boolean} [options.keepOrigin] 保持起源，默认false，即不保持
 * @constructor
 */
export default {
    install(options) {
        const that = this;
        options = options || {};
        if (typeof options.trigger === 'string') {
            options.trigger = DOM.byId(options.trigger);
        }
        if (!options.trigger) {
            return;
        }
        if (typeof options.target === 'string') {
            options.target = DOM.byId(options.target);
        }
        if (!options.target) {
            return;
        }
        //设置默认透明度
        options.opacity = parseInt(options.opacity, 10) || 100;
        if (options.keepOrigin) { //保持起源时默认透明度
            options.opacity = 50;
        }
        let originDragDiv = null; //源对象
        let tmpX = 0, tmpY = 0; //原始位置
        let moveable = false; //是否可以动
        options.trigger.onmousedown = function (e) {
            e = e || DOM.getEvent();
            //只允许通过鼠标左键进行拖拽,IE鼠标左键为1 FireFox为0
            if (!e || (typeof options.target.setCapture == 'object' && e.button != 1) || (typeof options.target.setCapture != 'object' && e.button != 0)) {
                return false;
            }
            //that.trigger("mousedown.before", options.target, options.trigger);
            let wh = DOM.getSize();
            if (options.keepOrigin) { //保持起源
                options.minLeft = parseInt(options.left, 10) || 0;
                options.maxLeft = parseInt(wh.w - options.right, 10) || wh.w - options.target.offsetWidth;
                options.minTop = parseInt(options.top, 10) || 0;
                options.maxTop = parseInt(wh.h - options.bottom, 10) || wh.h - options.target.offsetHeight;
            } else {
                let posDiv = options.target.offsetParent || options.target.parentNode;
                let posW = posDiv.clientWidth || posDiv.offsetWidth;
                let posH = posDiv.clientHeight || posDiv.offsetHeight;
                options.minLeft = parseInt(options.left - options.target.offsetWidth, 10) || 0;
                options.maxLeft = parseInt(posW - options.right, 10) || parseInt(posW - options.target.offsetWidth);
                options.minTop = parseInt(options.top - options.target.offsetHeight, 10) || 0;
                options.maxTop = parseInt(posH - options.bottom, 10) || parseInt(posH - options.target.offsetHeight);
            }
            if (options.keepOrigin) { //保持起源
                originDragDiv = document.createElement('div');
                originDragDiv.style.cssText = options.target.style.cssText;
                originDragDiv.style.width = options.target.offsetWidth;
                originDragDiv.style.height = options.target.offsetHeight;
                originDragDiv.innerHTML = options.target.innerHTML;
                //options.target.parentNode.appendChild(originDragDiv);
                if (options.target.parentNode) {
                    options.target.parentNode.insertBefore(originDragDiv, options.target);
                }
                options.target.style.zIndex = DOM.getZIndex() + 1;
            }
            moveable = true;
            let downPos = DOM.getMousePos(e);
            tmpX = downPos.x - options.target.offsetLeft;
            tmpY = downPos.y - options.target.offsetTop;
            options.trigger.style.cursor = 'move';
            if (options.target.setCapture) {
                options.target.setCapture();
            } else {
                window.captureEvents(Event.MOUSEMOVE);
            }
            //T.DOM.setOpacity(options.target, options.opacity);
            DOM.stopPropagation(e);
            DOM.preventDefault(e);
            //that.trigger("mousedown.after", options.target, options.trigger);
            document.onmousemove = function (e) {
                if (moveable) {
                    let e = e || DOM.getEvent();
                    //IE 去除容器内拖拽图片问题
                    if (document.all) {//IE
                        e.returnValue = false;
                    }
                    let movePos = DOM.getMousePos(e);
                    let _left = Math.max(Math.min(movePos.x - tmpX, options.maxLeft), options.minLeft);
                    let _top = Math.max(Math.min(movePos.y - tmpY, options.maxTop), options.minTop);
                    if (options.percent) {
                        let posDiv = options.target.offsetParent || options.target.parentNode;
                        let posW = posDiv.clientWidth || posDiv.offsetWidth;
                        let posH = posDiv.clientHeight || posDiv.offsetHeight;
                        _left = (_left / posW * 100) + '%';
                        _top = (_top / posH * 100) + '%';
                    } else {
                        _left = _left + 'px';
                        _top = _top + 'px';
                    }
                    options.target.style.margin = 0;
                    options.target.style.left = _left;
                    options.target.style.top = _top;
                }
                //that.trigger("moving", options.target, options.trigger);
            }
            document.onmouseup = function () {
                //that.trigger("mouseup.before", options.target, options.trigger);
                document.onmousemove = null;
                document.onmouseup = null;
                if (options.keepOrigin) {
                    if (options.target.setCapture) {
                        originDragDiv.outerHTML = '';
                    } else {
                        //setOuterHtml(originDragDiv, "");
                    }
                }
                if (moveable) {
                    if (options.target.setCapture) {
                        options.target.releaseCapture();
                    } else {
                        window.releaseEvents(Event.MOUSEMOVE);
                    }
                    //T.DOM.setOpacity(options.target, 100);
                    options.trigger.style.cursor = 'default';
                    moveable = false;
                    tmpX = 0;
                    tmpY = 0;
                }
                //that.trigger("mouseup.after", options.target, options.trigger);
                //that.trigger("moved", options.target, options.trigger);
            }
        }
    }
}