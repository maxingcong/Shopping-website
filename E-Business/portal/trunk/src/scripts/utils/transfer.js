"use strict";
/**
 * @fileOverview 转换处理类
 */
define("utils/transfer", [], function(require, exports, module){
    return {
        /**
         * 字符串或数字转半角
         * @param str
         */
        toDBC: function(str){
            str = String(str==null?"":str);
            var result = "";
            for(var i=0; i<str.length; i++){
                if(str.charCodeAt(i)==12288){
                    result += String.fromCharCode(str.charCodeAt(i)-12256);
                }else if(str.charCodeAt(i)>65280 && str.charCodeAt(i)<65375){
                    result += String.fromCharCode(str.charCodeAt(i)-65248);
                }else{
                    result += String.fromCharCode(str.charCodeAt(i));
                }
            }
            return result;
        },
        /**
         * 字符串或数字转全角
         * @param str
         */
        toSBC: function(str){
            str = String(str==null?"":str);
            var result = "";
            for(var i=0; i<str.length; i++){
                if(str.charCodeAt(i)==32){
                    result += String.fromCharCode(12288);
                }else if(str.charCodeAt(i)<127){
                    result += String.fromCharCode(str.charCodeAt(i)+65248);
                }else{
                    result += String.fromCharCode(str.charCodeAt(i));
                }
            }
            return result;
        },
        /**
         * 解析键值对字符串为Hash对象
         * @method decodeHashString
         * @param {String} str 必选，键值对字符串
         * @param {String} [sign=&] 可选，默认“&”，键值对分隔符
         * @param {String} [flag==] 可选，默认“=”，键值分隔符
         * @returns {Object} Hash对象
         */
        decodeHashString: function (str, sign, flag) {
            var arr = str ? str.split(sign == null ? '&' : sign) : [];
            var hashs = {};
            var reg = new RegExp('(^|' + (sign || '&') + ')([^' + (flag || '=') + ']*)' + (flag || '=') + '([^' + (sign || '&') + ']*)(' + (sign || '&') + '|$)', 'i');
            for (var i = 0, l = arr.length; i < l; i++) {
                var parts = arr[i].match(reg) || [];
                if (parts[2] != null && parts[2] !== '') {
                    hashs[parts[2]] = decodeURIComponent(parts[3] == null ? '' : parts[3]);
                }
            }
            return hashs;
        },
        /**
         * 编码Hash对象为键值对字符串
         * @memberof
         * @method encodeHashString
         * @param {Object} hashs 必选，Hash对象
         * @param {String} [sign=&] 可选，默认“&”，键值对分隔符
         * @param {String} [flag==] 可选，默认“=”，键值分隔符
         * @returns {String} 键值对字符串
         */
        encodeHashString: function (hashs, sign, flag) {
            var arr = [];
            for (var key in hashs) {
                if (hashs.hasOwnProperty && hashs.hasOwnProperty(key)) {
                    arr.push(key + (flag == null ? '=' : flag) + encodeURIComponent(decodeURIComponent(hashs[key] == null ? '' : hashs[key])));
                }
            }
            return arr.join(sign == null ? '&' : sign);
        }
    };
});