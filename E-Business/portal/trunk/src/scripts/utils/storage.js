"use strict";
/**
 * @fileOverview 数据存储
 */
define("utils/storage", ["utils/base", "utils/cookie"], function(Base, Cookie){
    /**
     * 数据存储操作
     * @summary 数据存储操作
     * @namespace Utils.Storage
     * @author Woo
     * @version 1.1
     * @since 2016/5/26
     */
    function Storage(opts) {
        opts = opts||{};
        opts.key = opts.key||"ininin_storage";
        var hasLocalStorage = window.localStorage && window.localStorage.setItem;
        return {
            /**
             * 存储数据
             * @param {String} value 值
             * @returns {String} 存储的数据
             */
            add: function(value){
                var _this = this,
                    ret = _this.get();
                if(!_this.has(value)){
                    ret += (ret ? "|" : "") + value;
                    _this.set(ret);
                }
                return ret;
            },
            /**
             * 获取存储的数据
             * @returns {String} 存储的数据
             */
            get: function(){
                var ret = "";
                if(hasLocalStorage){
                    ret = localStorage.getItem(opts.key)||"";
                }else{
                    ret = Cookie.get(opts.key)||"";
                }
                return ret;
            },
            /**
             * 存储数据
             * @param {String} values 值字符串
             * @returns {String} 存储的数据
             */
            set: function(values){
                if(hasLocalStorage){
                    localStorage.setItem(opts.key, values);
                }else{
                    Cookie.set(opts.key, values, {expires: 100 * 365, path: "/", domain: Base._DOMAIN});
                }
                return values;
            },
            /**
             * 删除指定项
             * @param {String} value 值
             * @returns {String} 存储的数据
             */
            remove: function(value){
                var _this = this,
                    ret = _this.get(),
                    parts = ret.split("|"),
                    data = [];
                for(var i=0; i<parts.length; i++){
                    if(parts[i]!=value){
                        data.push(parts[i]);
                    }
                }
                ret = data.join("|");
                _this.set(ret);
                return ret;
            },
            /**
             * 判断指定的值是否存在
             * @param {String} value 值
             * @returns {Boolean} 是否存在
             */
            has: function(value){
                var _this = this,
                    ret = _this.get(),
                    parts = ret.split("|"),
                    bool = false;
                for(var i=0; i<parts.length; i++){
                    if(parts[i]==value){
                        bool = true;
                    }
                }
                return bool;
            }
        };
    }
    return function(options) {
        return new Storage(options);
    };
});