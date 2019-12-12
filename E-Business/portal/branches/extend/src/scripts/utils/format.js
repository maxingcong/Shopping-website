"use strict";
/**
 * @fileOverview 格式化处理类
 */
define("utils/format", [], function(require, exports, module){
    /**
     * 格式化处理类
     * @summary 格式化处理类
     * @namespace Utils.Format
     * @author Woo
     * @version 1.1
     * @since 2016/2/15
     */
    return {
        /**
         * 格式化文件大小, 输出成带单位的字符串
         * @method formatSize
         * @param {Number} size 文件大小
         * @param {Number} [pointLength=2] 精确到的小数点数。
         * @param {Array} [units=[ 'B', 'K', 'M', 'G', 'TB' ]] 单位数组。从字节，到千字节，一直往上指定。如果单位数组里面只指定了到了K(千字节)，同时文件大小大于M, 此方法的输出将还是显示成多少K.
         * @example
         * console.log( Base.formatSize( 100 ) );    // => 100B
         * console.log( Base.formatSize( 1024 ) );    // => 1.00K
         * console.log( Base.formatSize( 1024, 0 ) );    // => 1K
         * console.log( Base.formatSize( 1024 * 1024 ) );    // => 1.00M
         * console.log( Base.formatSize( 1024 * 1024 * 1024 ) );    // => 1.00G
         * console.log( Base.formatSize( 1024 * 1024 * 1024, 0, ['B', 'KB', 'MB'] ) );    // => 1024MB
         */
        fileSize: function(size, pointLength, units){
            var unit;
            units = units || [ "B", "K", "M", "G", "TB" ];
            while ( (unit = units.shift()) && size > 1024 ) {
                size = size / 1024;
            }
            return (unit === "B" ? size : size.toFixed( pointLength || 2 )) + unit;
        },
        /**
         * 格式化日期时间
         * @param {Date} date 日期时间
         * @param {String} [fmt=yyyy-mm-dd] 格式
         * @returns {string}
         */
        dateTime: function(date, fmt){
            fmt = fmt||"yyyy-mm-dd";
            var o = {
                "m+" : date.getMonth()+1,//月份
                "d+" : date.getDate(),//日
                "h+" : date.getHours(),//小时
                "i+" : date.getMinutes(),//分
                "s+" : date.getSeconds(),//秒
                "l+" : date.getMilliseconds()//毫秒
            };
            if(/(y+)/.test(fmt))
                fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o)
                if(new RegExp("("+ k +")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            return fmt;
        }
    };
});