"use strict";
/**
 * @fileOverview JSON操作类
 */
define("utils/json", ["utils/base"], function(Base){
    /**
     * JSON操作类
     * @summary JSON操作类
     * @namespace Utils.JSON
     * @author Woo
     * @version 1.1
     * @since 2015/7/31
     * @version 1.2
     * @since 2016/2/17
     */
    return {
        /**
         * 转义字符串
         * @param value
         * @returns {string}
         */
        format: function(value){
            return (value+"").replace(/(['"\\])/g, "\\$1");
        },
        /**
         * JSON字符串转为JSON对象
         * @memberof Utils.JSON
         * @method parse
         * @example
         * Utils.JSON.parse('{"name":"woo", "data": [1, 2, 3]}');
         * @param {String} str JSON字符串
         * @returns {Object} JSON对象
         */
        parse: function(str){
            return (new Function('return '+str))();
        },
        /**
         * 对象转为字符串
         * @memberof Utils.JSON
         * @method objectToString
         * @example
         * Utils.JSON.objectToString({"name":"woo", "age": 18});
         * @param {Object} obj 对象
         * @returns {String} 字符串
         */
        objectToString: function(obj){
            var _this = this;
            var jsonString = [];
            for(var o in obj){
                if(o!=='' && obj.hasOwnProperty && obj.hasOwnProperty(o)){
                    var item = obj[o];
                    var type = Base.type(item);
                    if(type==='Array'){
                        jsonString.push('"'+o+'":'+ _this.arrayToString(item));
                    }else if (type==='Object'){
                        jsonString.push('"'+o+'":'+_this.objectToString(item));
                    /*}else if (type==='Number'){
                        jsonString.push('"'+o+'":'+item);*/
                    }else{
                        jsonString.push('"'+o+'":"'+_this.format(item)+'"');
                    }
                }
            }
            return '{'+jsonString.join(',')+'}';
        },
        /**
         * 数组转为字符串
         * @memberof Utils.JSON
         * @method arrayToString
         * @example
         * Utils.JSON.arrayToString([1, 2, 3]);
         * @param {Array} arr 数组
         * @returns {String} 字符串
         */
        arrayToString: function(arr) {
            var _this = this;
            var jsonString = [];
            for(var i=0; i<arr.length; i++){
                var item = arr[i];
                var type = Base.type(item);
                if(type==='Array'){
                    jsonString.push(_this.arrayToString(item));
                }else if (type==='Object'){
                    jsonString.push(_this.objectToString(item));
                /*}else if (type==='Number'){
                    jsonString.push(item);*/
                }else{
                    jsonString.push('"'+_this.format(item)+'"');
                }
            }
            return '['+jsonString.join(',')+']';
        },
        /**
         * JSON对象转为JSON字符串
         * @memberof Utils.JSON
         * @method stringify
         * @example
         * Utils.JSON.stringify({"name":"woo", "data": [1, 2, 3]});
         * @param {Object} json JSON对象
         * @returns {String} JSON字符串
         */
        stringify: function(json) {
            var _this = this;
            var jsonString = "";
            var type = Base.type(json);
            if(type==='Array'){
                jsonString = _this.arrayToString(json);
            }else if(type==='Object') {
                jsonString = _this.objectToString(json);
            }else{
                jsonString = json;
            }
            return jsonString;
        }
    };
});