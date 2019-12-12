"use strict";
/**
 * @fileOverview 数组操作类
 */
define("utils/array", ["utils/base"], function(Base){
    /**
     * 数组操作类
     * @summary 数组操作类
     * @namespace Utils.Array
     * @author Woo
     * @version 1.1
     * @since 2015/7/31
     * @version 1.2
     * @since 2016/2/16
     */
    return {
        /**
         * 向数组中添加不重复的元素
         * @param {Array} arr 数组
         * @param {String} value 值
         * @param {Boolean} redo 是否重复，默认false
         * @param {String} key 对象属性名
         * @returns {Array} 添加后的数组
         */
        add: function(arr, value, redo, key){
            if(redo){
                arr.push(value);
                return arr;
            }
            var bool = false, isKey = typeof(key)=='undefined'||key==='';
            Utils.each(arr, function(k, v){
                if((isKey&&v==value)||(!isKey&&v[key]==value[key]))bool = true;
            });
            if(!bool)arr.push(value);
            return arr;
        },
        /**
         * 根据对象key/value从对象数组中获得对象
         * @param {Array} arr 对象数组
         * @param {String} value 对象属性值
         * @param {String} key 对象属性名
         * @param {Boolean} isAll 是否返回所有符合条件的项，默认false，即只返回第一个
         * @returns {Object} 对应的对象
         */
        get: function(arr, value, key, isAll){
            var ret = null;
            if(typeof value==='undefined'||typeof key==='undefined'||key==='')return ret;
            Utils.each(arr,function(k,v){
                if(v[key]==value){
                    ret = v;
                    if(!isAll){
                        return false;
                    }
                }
            });
            return ret;
        },
        /**
         * 根据对象key/value修改对象数组中的对象
         * @param {Array} arr 对象数组
         * @param {Object} value 新对象
         * @param {String} key 对象属性名
         * @returns {Array} 修改后的对象数组
         */
        set: function(arr, value, key){
            if(!arr||typeof value==='undefined'||typeof key==='undefined'||key==='')return arr;
            Utils.each(arr,function(k,v){
                if(v[key]==value[key]){
                    arr[k] = value;
                }
            });
            return arr;
        },
        /**
         * 根据key/value获得数组下标
         * @param {Array} arr 数组
         * @param {String} value 属性值
         * @param {String} key 属性名
         * @returns 对应的下标
         */
        indexOf: function(arr, value, key){
            var ret = -1, bool = typeof key==='undefined'||key==='';
            Utils.each(arr,function(k,v){
                if(bool?v==value:v[key]==value){
                    ret = k;
                    return false;
                }
            });
            return ret;
        },
        /**
         * 根据key/value去除指定项，并返回新的数组
         * @param {Array} arr 数组
         * @param {String} value 属性值
         * @param {String} key 属性名
         * @returns {*}
         */
        remove: function(arr, value, key){
            var bool = typeof key==='undefined'||key==='';
            var ret = [];
            Utils.each(arr,function(k,v){
                if(bool?v!=value:v[key]!=value){
                    ret.push(v);
                }
            });
            return ret;
        },
        /**
         * 根据key/values设置对象数组选中状态
         * @param {Array} arr 对象数组
         * @param {String|Array} values 属性值，以“;”分开
         * @param {String} key 属性名
         * @param {Boolean} def 如果没有被选中的，是否默认选中第一个
         * @returns 对象数组
         */
        check: function(arr, values, key, def){
            if(!Utils.type(arr, 'Array')||typeof(values)=='undefined'||typeof(key)=='undefined'||key==='')return values||[];
            if(Utils.type(values, 'Array')){
                values = values.join(";");
            }
            var count = 0, _values = '';
            Utils.each(arr,function(i,v){
                if((';'+values+';').indexOf(';'+v[key]+';')>=0){
                    arr[i].CHECKED = 1;
                    _values += ';'+v[key];
                    count++;
                }else{
                    arr[i].CHECKED = 0;
                }
            });
            if(count===0&&def&&arr[0]){
                arr[0].CHECKED = 1;
                _values += ';'+arr[0][key];
            }
            return (_values?_values.substring(1):'').split(";");
        }
    };
});