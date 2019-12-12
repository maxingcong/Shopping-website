"use strict";
/**
 * @fileOverview Cookie操作类
 */
define("utils/cookie", ["utils/base", "utils/transfer"], function(Base, Transfer){
    /**
     * Cookie操作类
     * @summary Cookie操作类
     * @namespace Utils.Cookie
     * @author Woo
     * @version 1.1
     * @since 2015/7/31
     * @version 1.2
     * @since 2016/2/17
     */
    return {
        /**
         * 获取cookie
         * @memberof
         * @method get
         * @example
         * Utils.Cookie.get();
         * Utils.Cookie.get("sid");
         * @param {String} [key] 可选，cookie键值
         * @returns {Object|String} 如果key不为空，返回指定key的值，则返回所有
         */
        get: function (key) {
            var result = Transfer.decodeHashString(document.cookie, '; ');
            return key ? result[key] : result;
        },
        /**
         * 设置cookie，如果value为null/undefined，则删除cookie
         * @memberof
         * @method set
         * @example
         * Utils.Cookie.set("sid", "1234567890");
         * Utils.Cookie.set("sid", "1234567890", {expires: 1, path: "/", domain: "ininin.com"});
         * @param {String} key 必选，cookie键值
         * @param {String} value 必选，cookie值
         * @param {Object} [options] 可选，cookie配置项
         * @param {Number} [options.expires] 可选，cookie过期时间
         * @param {String} [options.path] 可选，cookie存放目录
         * @param {String} [options.domain] 可选，cookie所属域名
         * @param {String} [options.secure] 可选，是否安全传输
         */
        set: function (key, value, options) {
            if (!key)return;
            options = options || {};
            if (value === null || typeof(value) == 'undefined') {
                value = '';
                options.expires = options.expires || -1;
            }
            if (typeof(options.expires) == 'number') {
                var days = options.expires;
                options.expires = new Date();
                options.expires.setTime(options.expires.getTime() + days * 864e+5);
            }
            document.cookie = [
                key, '=', encodeURIComponent(decodeURIComponent(value)),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join('');
        }
    };
});