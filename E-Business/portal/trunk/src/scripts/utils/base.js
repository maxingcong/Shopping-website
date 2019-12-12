"use strict";
/**
 * @fileOverview 基础类方法
 */
define("utils/base", [], function(require, exports, module){
    var _TOSTRING = {}.toString,
        _SLICE = [].slice,
        _HOSTNAME = location.hostname,
        _DOMAIN = _HOSTNAME.slice(parseInt(_HOSTNAME.lastIndexOf('.') - 6)),
        _NODE = document.createElement('div');
    _NODE.style.cssText = 'position:fixed;';
    //用来保存js数据类型
    var classToType = {//将可能出现的类型都映射在了classToType对象中，从而减少isXXX函数
        "[object HTMLDocument]": "Document",
        "[object HTMLCollection]": "NodeList",
        "[object StaticNodeList]": "NodeList",
        "[object DOMWindow]": "Window",
        "[object global]": "Window",
        "null": "Null",
        "NaN": "NaN",
        "undefined": "Undefined"
    };
    //构造classToType存储常用类型的映射关系，遍历基本类型并赋值，键值为 [object 类型]
    "Boolean,Number,String,Function,Array,Date,RegExp,Window,Document,Arguments,NodeList".replace(/[a-z]+/ig, function(name){
        return classToType["[object " + name + "]"] = name;
    });
    return {
        _NODE: _NODE,
        _SLICE: _SLICE,
        _DOMAIN: _DOMAIN,
        _HOSTNAME: _HOSTNAME,
        _TOSTRING: _TOSTRING,
        /**
         * 简单的浏览器检查结果
         * * `webkit`  webkit版本号，如果浏览器为非webkit内核，此属性为`undefined`。
         * * `chrome`  chrome浏览器版本号，如果浏览器为chrome，此属性为`undefined`。
         * * `ie`  ie浏览器版本号，如果浏览器为非ie，此属性为`undefined`。**暂不支持ie10+**
         * * `firefox`  firefox浏览器版本号，如果浏览器为非firefox，此属性为`undefined`。
         * * `safari`  safari浏览器版本号，如果浏览器为非safari，此属性为`undefined`。
         * * `opera`  opera浏览器版本号，如果浏览器为非opera，此属性为`undefined`。
         *
         * @property {Object} [browser]
         */
        Browser: (function(ua){
            var ret = {},
                webkit = ua.match(/WebKit\/([\d.]+)/),
                chrome = ua.match(/Chrome\/([\d.]+)/) ||
                    ua.match(/CriOS\/([\d.]+)/),
                ie = ua.match(/MSIE\s([\d\.]+)/) ||
                    ua.match(/(?:trident)(?:.*rv:([\w.]+))?/i),
                firefox = ua.match(/Firefox\/([\d.]+)/),
                safari = ua.match(/Safari\/([\d.]+)/),
                opera = ua.match(/OPR\/([\d.]+)/);
            webkit && (ret.webkit = parseFloat(webkit[1]));
            chrome && (ret.chrome = parseFloat(chrome[1]));
            ie && (ret.ie = parseFloat(ie[1]));
            firefox && (ret.firefox = parseFloat(firefox[1]));
            safari && (ret.safari = parseFloat(safari[1]));
            opera && (ret.opera = parseFloat(opera[1]));
            return ret;
        }(navigator.userAgent)),
        /**
         * 操作系统检查结果
         * * `android`  如果在android浏览器环境下，此值为对应的android版本号，否则为`undefined`。
         * * `ios` 如果在ios浏览器环境下，此值为对应的ios版本号，否则为`undefined`。
         * * `weChat` 如果在weChat环境下，此值为对应的weChat版本号，否则为`undefined`
         * Mozilla/5.0 (iPhone; CPU iPhone OS 8_4 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12H143 MicroMessenger/6.2.4 NetType/WIFI Language/zh_CN
         * @property {Object} [os]
         */
        OS: (function(ua) {
            var ret = {},
            // osx = !!ua.match( /\(Macintosh\; Intel / ),
                android = ua.match(/(?:Android);?[\s\/]+([\d.]+)?/i),
                ios = ua.match(/(?:iPad|iPod|iPhone).*OS\s([\d_]+)/i),
                weChat = ua.match(/MicroMessenger\/([\d.]+)/i);
            // osx && (ret.osx = true);
            android && (ret.android = parseFloat(android[1]));
            ios && (ret.ios = parseFloat(ios[1].replace(/_/g, ".")))
            weChat && (ret.weChat = parseFloat(weChat[1].replace(/_/g, ".")));
            return ret;
        }(navigator.userAgent)),
        /**
         * 判断浏览器是否支持或存在某些属性/方法/对象
         */
        IS: {
            fixed: _NODE.style.position==='fixed', //position:fixed
            AXO: 'ActiveXObject' in window, //ActiveXObject
            CVS: !!document.createElement('canvas').getContext,
            XHR: typeof XMLHttpRequest!=='undefined', //XMLHttpRequest
            FD: typeof FormData!=='undefined', //FormData
            FR: typeof FileReader!=='undefined', //FileReader
            EL: typeof addEventListener!=='undefined', //addEventListener/removeEventListener||attachEvent/detachEvent
            DM: document.documentMode//只有IE8+才支持开始是支持文档模式
        },
        /**
         * 基于时间戳生成16位全局唯一标识（每一毫秒只对应一个唯一的标识，适用于生成DOM节点ID）
         * @method uuid
         * @param {Number} [len] 生成字符串的位数
         * @returns {String}
         */
        uuid: (function(){
            var _timestamp = 0;
            return function(len){
                var timestamp = new Date().getTime()||0, chars = 'abcdefghijklmnopqrstuvwxyz', uuid = '';
                _timestamp = _timestamp==timestamp ? timestamp+1 : timestamp;
                timestamp = ''+_timestamp;
                len = len||16;
                for(var i=0; i<len; i++){
                    var k = timestamp.charAt(i);
                    if(k===''){
                        k = Math.floor(Math.random()*26);
                    }
                    uuid += chars.charAt(k)||'x';
                }
                return uuid;
            };
        }()),
        /**
         * 生成唯一的ID
         * @method guid
         * @param {String} [prefix] 前缀
         * @returns {String}
         */
        guid: (function(){
            var counter = 0;
            return function(prefix) {
                var guid = (+new Date()).toString(32),
                    i = 0;
                for (; i < 5; i++) {
                    guid += Math.floor(Math.random() * 65535).toString(32);
                }
                return (prefix || 'guid_') + guid + (counter++).toString(32);
            };
        }()),
        /**
         * 生成随机字符串
         * @method randomString
         * @param {Number} [len] 可选，默认6，生成字符串的长度
         * @param {Boolean} [readable] 可选，默认False，是否去掉容易混淆的字符
         * @returns {String} 指定长度的随机字符串
         */
        randomString: function(len, readable){
            len = len||6;
            //'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';//去掉容易混淆的字符oO,Ll,9gq,Vv,Uu,I1
            var chars = readable?'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
                count = chars.length,
                str = '';
            for(var i=len; i>0; i--)str += chars.charAt(Math.floor(Math.random()*count));
            return str;
        },
        /**
         * 得到数据类型
         * @method type
         * @param {Object} obj 数据
         * @param {RegExp|String} [str] 数据类型或正则表达式
         * @example
         * Base.type([1,2]);
         * Base.type([1,2], "Array");
         * Base.type([1,2], /Array/);
         * @returns {Boolean|String} 传入数据类型或正则表达式，则返回Boolean，否则返回数据类型String
         */
        type: function(obj, str) {
            var result = classToType[(obj == null || obj !== obj) ? obj : classToType.toString.call(obj)] || obj.nodeName || "#";
            if (result.charAt(0) === "#") { //兼容旧式浏览器与处理个别情况,如window.opera
                //利用IE678 window == document为true,document == window竟然为false的神奇特性
                if (obj == obj.document && obj.document != obj) {//对DOM，BOM对象采用nodeType（单一）和item（节点集合）进行判断
                    result = "Window"; //返回构造器名字
                } else if (obj.nodeType === 9) {
                    result = "Document"; //返回构造器名字
                } else if (obj.callee) {
                    result = "Arguments"; //返回构造器名字
                } else if (isFinite(obj.length) && obj.item) {
                    result = "NodeList"; //处理节点集合
                } else {
                    result = classToType.toString.call(obj).slice(8, -1);
                }
            }
            if (str) {
                return typeof str==="string" ? str===result : str.test(result);
            }
            return result;
        },
        /**
         * 对象遍历
         * @method each
         * @param {Object} obj 要迭代的对象
         * @param {Function(String|Number, *)} callback 迭代对象到每一项时执行，参数1：索引，2：值
         * @returns {*} 对象
         */
        each: function(obj, callback){
            if(!obj)return obj;
            if(!this.type(callback, "Function"))return obj;
            var type = this.type(obj);
            if(/^Array|NodeList$/.test(type)){
                for(var l=obj.length,i=0; i<l; i++){
                    if(callback(i, obj[i])===false)break;
                }
            }else if(type==="Object"){
                for(var o in obj){
                    if(o!=="" && obj.hasOwnProperty && obj.hasOwnProperty(o)){
                        if(callback(o, obj[o])===false)break;
                    }
                }
            }
            return obj;
        },
        /**
         * 对象继承
         * @method extend
         * @param {Object} source 源对象
         * @param {Object} [target] 目标对象
         * @param {Boolean} [depth] 是否深度继承，默认false
         * Return {Object} 继承后的对象
         */
        extend: function(source, target, depth){
            var _this = this;
            if(!source){
                source = {};
            }
            var sourceType = this.type(source),
                targetType = this.type(target);
            if(sourceType!=="Object" && targetType==="Object"){
                source = {};
            }else if(sourceType!=="Array" && targetType==="Array"){
                source = [];
            }
            _this.each(target, function(k, v){
                depth ? _this.extend(source[k], v) : source[k] = v;
            });
            return source;
        },
        empty: function(value){
            return value==null || value==="";
        }
    };
});