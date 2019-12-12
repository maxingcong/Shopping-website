"use strict";
/**
 * @fileOverview 事件处理器
 */
define("utils/mediator", ["utils/base"], function(Base){
    var slice = [].slice,
        separator = /\s+/;
    /**
     * 根据条件过滤出事件
     * @param events
     * @param name
     * @param [callback]
     * @param [context]
     * @returns {Array}
     */
    function findHandlers(events, name, callback, context){
        var ret = [];
        Base.each(events, function(i, evt){
            if(evt && (!name || evt.name===name) && (!callback || evt.callback===callback) && (!context || evt.context===context)){
                ret.push(evt);
            }
        });
        return ret;
    }
    /**
     * 触发事件
     * @param events
     * @param args
     * @returns {boolean}
     */
    function triggerHandlers(events, args){
        var stoped = false,
            i = -1,
            len = events.length,
            handler;
        while(++i < len) {
            handler = events[i];
            if (handler.callback.apply(handler.context, args) === false) {
                stoped = true;
                break;
            }
        }
        return !stoped;
    }
    var protos = {
        /**
         * 绑定事件
         * @param {String} name 事件名，多个以空格分开
         * @param {Function} callback 方法在执行时，“arguments”将会来源于“trigger”的时候携带的参数
         * @param {Object} [context]
         * @returns {Object} 返回自身，方便链式调用
         *
         * // 使得obj有事件行为
         * Mediator.installTo(obj);
         *
         * 如果“callback”中，某一个方法“return false”了，则后续的其他“callback”都不会被执行到。
         * 切会影响到`trigger`方法的返回值，为`false`。
         *
         * “on”还可以用来添加一个特殊事件“all”, 这样所有的事件触发都会响应到。同时此类“callback”中的“arguments”有一个不同处，
         * 就是第一个参数为“type”，记录当前是什么事件在触发。此类“callback”的优先级比较低，会再正常“callback”执行完后触发。
         * obj.on("all", function(type, arg1, arg2){
         *     console.log(type, arg1, arg2); // => 'testa', 'arg1', 'arg2'
         * });
         */
        on: function(name, callback, context){
            var events = this._events || (this._events = []);
            if(typeof(name)==="string" && typeof(callback)==="function"){
                var names = name.split(separator),
                    len = names.length;
                Base.each(names, function(i, evt){
                    if(evt){
                        events.push({
                            id: events.length,
                            name: evt,
                            callback: callback,
                            context: context||this
                        });
                    }
                });
            }
            return this;
        },
        /**
         * 解除事件绑定
         * @method off
         * @param {String} [name] 事件名
         * @param {Function} [callback] 事件处理器
         * @param {Object} [context] 事件处理器的上下文
         * @returns {Object} 返回自身，方便链式调用
         */
        off: function(name, callback, context){
            var events = this._events;
            if(!events){
                return this;
            }
            if (!name && !callback && !context){
                this._events = [];
                return this;
            }
            Base.each(name.split(separator), function(i, name){
                Base.each(findHandlers(events, name, callback, context), function(i, evt){
                    delete events[evt.id];
                });
            });
            return this;
        },
        /**
         * 触发事件
         * @method trigger
         * @param {String} name 事件名
         * @returns {Boolean} 如果handler中return false了，则返回false, 否则返回true
         */
        trigger: function(name){
            if(!name)return;
            var args = slice.call(arguments, 1),
                events = findHandlers(this._events, name),
                allEvents = findHandlers(this._events, "all");
            return triggerHandlers(events, args) && triggerHandlers(allEvents, arguments);
        }
    };
    /**
     * 中介者，它本身是个单例，但可以通过[installTo]方法，使任何对象具备事件行为。
     * 主要目的是负责模块与模块之间的合作，降低耦合度。
     * @class Mediator
     */
    return Base.extend({
        /**
         * 可以通过这个接口，使任何对象具备事件功能
         * @method installTo
         * @param {Object} obj 需要具备事件行为的对象
         * @return {Object} 返回obj
         */
        installTo: function(obj) {
            return Base.extend(obj, protos);
        }
    }, protos);
});