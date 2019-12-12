"use strict";
/**
 * @fileOverview DOM操作类
 */
define("utils/dom", ["utils/base"], function(Base){
    /**
     * DOM操作类
     * @summary DOM操作类
     * @namespace Utils.DOM
     * @author Woo
     * @version 1.1
     * @since 2016/2/17
     */
    return {
        byId: function(name){
            return name ? document.getElementById(name) : null;
        },
        byName: function(name){
            return document.getElementsByName(name);
        },
        byTagName: function(o, name){
            o = o?o:document;
            var els = o.getElementsByTagName(name);
            return els?els:[];
        },
        closest: function(o, str){
            var _this = this;
            var idx = str.indexOf('.'), n = str, cn = '';
            if(idx>=0){
                cn = str.substring(idx+1);
                n = str.substring(0,idx);
            }
            n = n.toUpperCase();
            function _parent(o) {
                var tn = o.tagName.toUpperCase();
                return tn==='HTML'?null:(n?n===tn:true)&&(cn?_this.hasClass(o,cn):true)?o:_parent(o.parentNode);
            }
            return o&&o.tagName?_parent(o):null;
        },
        find: function(o, str){
            var _this = this;
            var idx = str.indexOf('.'), n = str, cn = '';
            if(idx>=0){
                cn = str.substring(idx+1);
                n = str.substring(0,idx);
            }
            n = n.toUpperCase();
            var tags = o.getElementsByTagName('*');
            var nodes = [];
            for (var i = 0; i < tags.length; i++) {
                var tag = tags[i];
                var tn = tag.tagName.toUpperCase();
                if((n?n===tn:true)&&(cn?_this.hasClass(tag,cn):true))nodes.push(tag);
            }
            return nodes;
        },
        attr: function(o, n, v){
            if(o&&n&&v&&o.setAttribute)o.setAttribute(n,v);
            return (o&&n&&o.getAttribute)?o.getAttribute(n):'';
        },
        removeAttr: function(o, n){
            return (o&&n&&o.removeAttribute)?o.removeAttribute(n):'';
        },
        hasClass: function(node, className) {
            if(!node||!node.nodeType)return;
            var classNames = (node.className + '').split(/\s+/);
            for (var i = 0; i < classNames.length; i++)
                if (classNames[i] == className)return true;
            return false;
        },
        addClass: function(obj, className) {
            if(!obj||!obj.nodeType)return;
            var classNames = (obj.className + '').split(' ');
            var newClassNames = '';
            for (var i = 0; i < classNames.length; i++)
                if (classNames[i] && classNames[i] !== className)newClassNames += ' ' + classNames[i];
            newClassNames += ' ' + className;
            obj.className = newClassNames.substring(1);
            return obj;
        },
        removeClass: function(obj, className) {
            if(!obj||!obj.nodeType)return;
            var classNames = (obj.className + '').split(' ');
            var newClassNames = '';
            for (var i = 0; i < classNames.length; i++)
                if (classNames[i] && classNames[i] !== className)newClassNames += ' ' + classNames[i];
            obj.className = newClassNames.substring(1);
            return obj;
        },
        bind: function(obj, type, handler) {
            if (!obj||!((obj.nodeType||obj.nodeType==1||obj.nodeType==9)||obj.top===window.top))return;
            obj.addEventListener?obj.addEventListener(type, handler, false):obj.attachEvent?obj.attachEvent('on' + type, handler):obj['on' + type]=handler;
        },
        unbind: function(obj, type, handler) {
            if (!obj||!((obj.nodeType||obj.nodeType==1||obj.nodeType==9)||obj.top===window))return;
            obj.removeEventListener?obj.removeEventListener(type, handler, false):obj.detachEvent?obj.detachEvent('on' + type, handler):obj['on' + type]=null;
        },
        preventDefault: function(e) {
            (e&&e.preventDefault)?e.preventDefault():window.event.returnValue=false;
        },
        stopPropagation: function(e) {
            (e&&e.stopPropagation)?e.stopPropagation():window.event.cancelBubble=true;
        },
        getEvent: function(){
            if(window.event){
                return window.event;
            }
            var func = arguments.caller;
            while(func!=null) {
                var e = func.arguments[0];
                if(e){
                    if((e.constructor==Event||e.constructor==MouseEvent||e.constructor==KeyboardEvent)||(typeof e==='object'&&e.preventDefault&&e.stopPropagation)){
                        return e;
                    }
                }
                func = func.caller;
            }
            return null;
        },
        offset: function(obj){
            var pos = {
                top:0,
                left:0
            };
            function getPos(obj){
                if(obj){
                    pos.top += obj.offsetTop;
                    pos.left += obj.offsetLeft;
                    getPos(obj.offsetParent);
                }
            }
            getPos(obj);
            return pos;
        },
        getSize: function(o){
            return o ? {
                w: o.clientWidth||o.offsetWidth,
                h: o.clientHeight||o.offsetHeight
            } : {
                w: /*window.innerWidth||*/document.documentElement.clientWidth||document.body.offsetWidth,
                h: /*window.innerHeight||*/document.documentElement.clientHeight||document.body.offsetHeight
            };
        },
        getZIndex: function(){
            var tags = document.getElementsByTagName('*');
            var zIndex = 0;
            Base.each(tags, function(i, tag){
                zIndex = Math.max(tag.style.zIndex||0, zIndex);
            });
        },
        getMousePos: function(e){
            var ret = {};
            e = e||this.getEvent();
            if(!isNaN(e.pageX)&&!isNaN(e.pageY)){
                ret.x = e.pageX;
                ret.y = e.pageY;
            }else if(document.documentElement&&!isNaN(e.clientX)&&!isNaN(document.documentElement.scrollTop)){
                ret.x = e.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft;
                ret.y = e.clientY + document.documentElement.scrollTop - document.documentElement.clientTop;
            }else if(document.body&&!isNaN(e.clientX)&&!isNaN(document.body.scrollLeft)){
                ret.x = e.clientX + document.body.scrollLeft - document.body.clientLeft;
                ret.y = e.clientY + document.body.scrollTop - document.body.clientTop;
            }
            return ret;
        },
        getScrollPos: function(){
            var ret = {
                x: document.body.scrollLeft - document.body.clientLeft,
                y: document.body.scrollTop - document.body.clientTop
            };
            if(document.documentElement){
                ret.x = Math.max(document.documentElement.scrollLeft - document.documentElement.clientLeft, ret.x);
                ret.y = Math.max(document.documentElement.scrollTop - document.documentElement.clientTop, ret.y);
            }
            return ret;
        },
        setOpacity: function(node, value){
            if(node.setCapture){
                node.style.filter = 'alpha(opacity=' + value + ')';
            }else{
                node.style.opacity = value/100;
            }
        },
        /**
         * 创建元素
         * @method create
         * @param {String} tag 元素类型
         * @param {Object} [attrs] 属性集合
         * @returns {Object} 创建的元素对象
         */
        create: function(tag, attrs){
            var _this = this;
            tag = tag||'div';
            attrs = attrs||{};
            var node = document.createElement(tag);
            Base.each(attrs, function(k, v){
                if(k=='class'){
                    node.className = v;
                }else if(k=='id'){
                    node.id = v;
                }else if(k=='name'){
                    node.name = v;
                }else if(k=='style'){
                    node.style.cssText = v;
                }else{
                    _this.attr(node,k,v);
                }
            });
            return node;
        },
        /**
         * 追加元素
         * @method insertAfter
         * @param {Object} [newElement] 要追加的元素
         * @param {Object} [targetElement] 指定元素的位置
         * @returns {Object} 创建的元素对象
         */
        insertAfter: function(newElement, targetElement){
            var parent = targetElement.parentNode; //找到指定元素的父节点
            if(parent.lastChild==targetElement ){ //判断指定元素的是否是节点中的最后一个位置 如果是的话就直接使用appendChild方法
                parent.appendChild(newElement, targetElement);
            }else{
                parent.insertBefore(newElement, targetElement.nextSibling);
            }
        },
        /**
         * 设置下拉框选项
         * @param {DOM} obj DOM对象
         * @param {Object} options 配置
         * @param {Object||Array} options.data 数据
         * @param {String} [options.key] 键
         * @param {String} [options.val] 值
         * @param {String} [options.value] 默认值
         * @param {Number} [options.len] 保留个数
         */
        setSelectOptions: function(obj, options){
            var option = null;
            if(!obj||!options||!options.data)return;
            obj.length = options.len||0;
            Base.each(options.data, function(o, item){
                if(options.key&&options.val){
                    option = new Option(item[options.val], item[options.key]);
                    if(item[options.key]===options.value)option.selected = 'selected';
                }else{
                    option = new Option(item||o, o);
                    if((item||o)===options.value)option.selected = 'selected';
                }
                obj.options.add(option);
            });
        }
    };
});