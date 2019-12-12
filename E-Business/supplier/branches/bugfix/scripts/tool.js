window.onerror = function (e) { return true; }
if(typeof console==="undefined"){
    console = {}, console.log = function(){};
}
//console.log = function(){ return true; }
String.prototype.Trim = function(){
    return this.replace(/(^\s*)|(\s*$)/g, '');
};
Date.prototype.Format = function(fmt){
    fmt = fmt||"yyyy-mm-dd";
    var o = {
        "m+" : this.getMonth()+1,//月份
        "d+" : this.getDate(),//日
        "h+" : this.getHours(),//小时
        "i+" : this.getMinutes(),//分
        "s+" : this.getSeconds()//秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};

!(function(window, document, undefined) {
    "use strict";
    //通用方法及常量
    var T = T||{},
        _TOSTRING = Object.prototype.toString,
        _SLICE = Array.prototype.slice,
        _HOSTNAME = location.hostname,
        _DOMAIN = _HOSTNAME.slice(parseInt(_HOSTNAME.lastIndexOf(".") - 6)),
        _NODE = document.createElement('div');
    _NODE.style.cssText = 'position:fixed;';
    T.BASE_HOST_NAME = 'http://' +_HOSTNAME;
    _HOSTNAME += "/";//HOST_NAME_PATH
    T.DayMillisecond = 864e+5; //一天的毫秒数
    T.FlashPlayerURL = "http://get.adobe.com/cn/flashplayer/";
    T.DOMAIN = {
        ACTION: "http://action.ininin.com/",
        CLOUD: "http://cloud.ininin.com/",
        WWW: 'http://' +_HOSTNAME,
        DOMAIN: _DOMAIN
    };
    document.domain = "ininin.com";
    T.getDays = function(){
        return Math.ceil(new Date().getTime()/T.DayMillisecond);
    };
    /**
     * 平台页面重定向
     * @param targetUrl 目标URL
     * @param jump 是否立即跳转
     * @returns {XML|string|void}
     * @constructor
     */
    T.PlatformRedirect = function(targetUrl, jump){
        targetUrl = targetUrl.replace(T.BASE_HOST_NAME, "");
        if(jump){
            if(location.href.indexOf(T.DOMAIN.WWW+"platform.html")==0){
                location.hash = targetUrl;
            }else{
                location.href = T.DOMAIN.WWW+"platform.html#"+targetUrl;
            }
        }
        return targetUrl;
    };
    /**
     * 获取日期段
     * @param {Number} [num=0] 数字，负数表示上月/周/num天内
     * @param {Number} [mode=day] year：年，month：月，week：周，day：日
     * @param {Boolean} [oneDay=false] 指定为某一天
     * @example:
     * 上月：T.getDateRange(-1, 'month')
     * 本月：T.getDateRange(0, 'month')
     * 上周：T.getDateRange(-1, 'week')
     * 本周：T.getDateRange(0, 'week')
     * 今天：T.getDateRange(0, 'day')
     * 昨天：T.getDateRange(-2, 'day', true)
     * 最近7天：T.getDateRange(-7, 'day')
     * 最近30天：T.getDateRange(-30, 'day')
     * @constructor
     * @returns {Object}
     */
    T.getDateRange = function(num, mode, oneDay){
        num = parseFloat(num)||0, mode = mode||"day";
        var date = new Date();
        var dateTime = date.getTime();
        var startDate = dateTime; //起始时间
        var endDate = dateTime; //结束时间
        if(mode=="week"){ //上周/本周
            num = 7 * num;
            var weekTime = dateTime + num * T.DayMillisecond;
            var week = date.getDay()||7; //星期几
            startDate = weekTime - (week - 1) * T.DayMillisecond;
            endDate = startDate + 6 * T.DayMillisecond;
        }else if(mode=="month"){ //上月/本月
            var monthDate = new Date(date.getFullYear(), date.getMonth() + num , 1);
            startDate = monthDate.getTime();
            monthDate.setDate(T.getMonthDays(monthDate.getMonth()+1, monthDate.getFullYear()));
            endDate = monthDate.getTime();
        }else { //num天内
            if(num<0){ //向前
                num++; //去掉今天
                startDate = dateTime + num * T.DayMillisecond;
                endDate = oneDay?startDate:dateTime;
            }else if(num>0){ //向后
                num--; //去掉今天
                endDate = dateTime + num * T.DayMillisecond;
                startDate = oneDay?endDate:dateTime;
            }
        }
        return {
            startDate: new Date(startDate).Format(),
            endDate: new Date(endDate).Format(),
            today: new Date(dateTime).Format()
        }
    };
    /**
     * 获得某月的天数
     * @param {number} month
     * @param {number} [year]
     * @returns {number}
     */
    T.getMonthDays = function(month, year){
        year = year||new Date().getFullYear();
        var monthStartDate = new Date(year, month - 1, 1);
        var monthEndDate = new Date(year, month, 1);
        var days = Math.floor((monthEndDate - monthStartDate)/T.DayMillisecond);
        return days;
    };
    /**
     * @根据ID绑定数据
     * @method Template
     * @param {String} [uuid] DOM节点ID标识
     * @param {Object} [data] 数据源（对象）
     * @return {Object} 展示模板解析结果的容器对象
     */
    T.Template = function(uuid, viewId, data){
        if(typeof(viewId)=="object"){
            data = viewId;
            viewId = uuid;
        }
        var temp = document.getElementById("template-"+uuid);
        var view = document.getElementById("template-"+viewId+"-view");

        if(temp&&view)view.innerHTML =Utils.template("template-"+uuid, data);
        return $(view).children();
    };
    /**
     * @根据ID绑定数据
     * @method BindData
     * @param {Object} [data] 数据源（对象）
     */
    T.BindData = function(k,data){
        k = k?k+'-':'';
        T.Each(data, function(key, value){
            if(T.Typeof(value,/array|Object/)){
                T.BindData(k+key,value);
            }else{
                var obj = document.getElementById(k+key);
                if(obj){
                    var tn = (''+obj.tagName).toLowerCase();
                    value = typeof value=='undefined'?'':value;
                    value = /price/i.test(key)?T.RMB(value):value;
                    if(/input|textarea/.test(tn)){
                        obj.value = value;
                    }else if(/img/.test(tn)){
                        obj.src = value;
                    }else if(/select/.test(tn)){
                        obj.src = value;
                        var options = obj.options;
                        for (var o = 0; o < options.length; o++) {
                            if (options[o].value.Trim()==value)
                                options[o].selected = true;
                        }
                    }else{
                        obj.innerHTML = value;
                    }
                }
            }
        });
    };
    /**
     * 人民币格式化显示
     * @param num
     * @returns {string}
     * @constructor
     */
    T.RMB = function(num){
        num = parseFloat(num, 10)||0;
        if(typeof num!=='number')return '0.00';
        num = Math.round(num*100)/100;
        num = num.toString();
        var res = '';
        var idx = num.indexOf('.');
        if(idx<0){
            res = num + '.00';
        }else{
            idx++;
            res = num.substring(0,idx);
            var len = num.length;
            for(var i=idx; i<idx+2; i++){
                res += i<len?num.charAt(i):'0';
            };
        };
        return res<0?'0.00':res;
    };
    /* 基于时间戳生成20位全局唯一标识（每一毫秒只对应一个唯一的标识，适用于生成DOM节点ID） */
    T.UUID = function(len){
        var timestamp = new Date().getTime()||0, chars = 'abcdefghijklmnopqrstuvwxyz', uuid = '';
        this.timestamp = this.timestamp==timestamp?timestamp+1:timestamp;
        timestamp = ''+this.timestamp;
        len = len||20;
        for(var i=0; i<len; i++){
            var k = timestamp.charAt(i);
            if(k==''){
                k = Math.floor(Math.random()*26);
            }
            uuid += chars.charAt(k)||'x';
        }
        return uuid;
    };
    /**
     * 得到数据类型
     * @memberof T
     * @method Typeof
     * @param {Object} obj 必选，数据
     * @param {RegExp} [type] 可选，数据类型正则表达式
     * @returns {Boolean|String} 传入数据类型正则，则返回Boolean，否则返回数据类型String
     */
    T.Typeof = function(obj,type){
        var oType = {
            '[object Boolean]': 'Boolean',
            '[object Number]': 'Number',
            '[object String]': 'String',
            '[object Function]': 'Function',
            '[object Array]': 'Array',
            '[object Date]': 'Date',
            '[object RegExp]': 'RegExp',
            '[object Object]': 'Object'
        }, ret = obj==null?String(obj):oType[_TOSTRING.call(obj)]||'Unknown';
        return type?type.test(ret):ret;
    };
    /**
     * 对象遍历
     * @memberof T
     * @method Each
     * @param {Object} obj 必选，对象
     * @param {Function(String|Number, *)} callback 必选，回调函数
     * @param {String|Number} callback.key 必选，索引/键
     * @param {*} callback.value 必选，值
     * @returns {Object} 对象
     */
    T.Each = function(obj,callback){
        if(!obj)return obj;
        if(!T.Typeof(callback,/Function/))return obj;
        if(T.Typeof(obj,/Array/)){
            for(var l=obj.length,i=0; i<l; i++)
                if(callback(i,obj[i])===false)break;
        }else if(T.Typeof(obj,/Object/)){
            for(var o in obj)
                if(obj.hasOwnProperty&&obj.hasOwnProperty(o))
                    if(callback(o,obj[o])===false)break;
        }
        return obj;
    };
    /**
     * 对象继承
     * @memberof T
     * @method Inherit
     * @param {Object} source 必选，源对象
     * @param {Object} target 必选，目标对象
     * @param {Boolean} [depth=false] 可选，是否深度继承
     * @returns {Object} 继承后的对象
     */
    T.Inherit = function(source,target,depth){
        source = source||{};
        if(T.Typeof(target,/Object/)&&!T.Typeof(source,/Object/))source = {};
        if(T.Typeof(target,/Array/)&&!T.Typeof(source,/Array/))source = [];
        T.Each(target,function(k,v){
            if(depth){
                T.Inherit(source[k],v);
            }else{
                source[k] = v;
            }
        });
        return source;
    };
    T.addClass = function(obj, className) {
        if(!obj||!obj.nodeType)return;
        var classNames = (obj.className + '').split(' ');
        var newClassNames = '';
        for (var i = 0; i < classNames.length; i++)
            if (classNames[i] && classNames[i] !== className)newClassNames += ' ' + classNames[i];
        newClassNames += ' ' + className;
        obj.className = newClassNames.substring(1);
        return obj;
    };
    T.removeClass = function(obj, className) {
        if(!obj||!obj.nodeType)return;
        var classNames = (obj.className + '').split(' ');
        var newClassNames = '';
        for (var i = 0; i < classNames.length; i++)
            if (classNames[i] && classNames[i] !== className)newClassNames += ' ' + classNames[i];
        obj.className = newClassNames.substring(1);
        return obj;
    };
    T.bind = function(obj, type, handler) {
        if (!obj||!((obj.nodeType||obj.nodeType==1||obj.nodeType==9)||obj.top===window.top))return;
        obj.addEventListener?obj.addEventListener(type, handler, false):obj.attachEvent?obj.attachEvent('on' + type, handler):obj['on' + type]=handler;
    };
    T.unbind = function(obj, type, handler) {
        if (!obj||!((obj.nodeType||obj.nodeType==1||obj.nodeType==9)||obj.top===window))return;
        obj.removeEventListener?obj.removeEventListener(type, handler, false):obj.detachEvent?obj.detachEvent('on' + type, handler):obj['on' + type]=null;
    };
    T.preventDefault = function(e) {
        (e&&e.preventDefault)?e.preventDefault():window.event.returnValue=false;
    };
    T.stopPropagation = function(e) {
        (e&&e.stopPropagation)?e.stopPropagation():window.event.cancelBubble=true;
    };
    /* 提示 */
    T.TIPS = {
        DEF: '系统繁忙，请稍后再试'
        ,empty:'Value missing.'//valueMissing
        ,type:'Type mismatch.'//typeMismatch
        ,mismatch:'Pattern mismatch.'//patternMismatch
        ,minlength:'Too short.'//tooShort
        ,maxlength:'Too long.'//tooLong
        ,min:'Too small.'//rangeUnderflow
        ,max:'Too big.'//rangeOverflow
        ,step:'Step mismatch.'//stepMismatch
        ,error:'Custom error.'//customError
        ,unique: 'This account is not available.'
        ,placeholder: ''
    };
    /* 正则表达式 */
    T.RE = {//Regular Expression
        number : /^\d+$/
        ,mobile : /^1[3|4|5|6|7|8|9]\d{9}$/
        ,tel : /^(\d{3,4}-)\d{7,8}$/
        ,email : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        ,mobile_email: /^1[3|4|5|6|7|8|9]\d{9}$|^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        ,mobile_email_uname: /^1[3|4|5|6|7|8|9]\d{9}$|^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$|^[_a-zA-Z0-9\-]{4,16}$/
        ,code : /^[0-9]{6}$/
        ,qq : /^[0-9]{5,12}$/
        ,pwd : /^\S{6,16}$/
        ,uri : /^[a-zA-z]+:\/\/[^\s]*$/
        ,url : /^[a-zA-z]+:\/\/[\w-]+\.[\w-]+\.[\w-]+\S*$/
        ,date : /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31))|(([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/
        ,time : /sdf/
        ,datetime : /asd/
        ,uname : /^[a-zA-Z]\w{5,15}$/
        ,nonempty: /\S/
        ,expedited_zone: /^广东省\^深圳市\^南山区|^广东省\^深圳市\^福田区///加急区域
        ,quantity: /^数量|数量$/ //截取数量
        //（210×140）A5
        ,size: /\d+[\d.]*[A-za-z]*\*+\d+[\d.]*[A-za-z]*|\d+[*×]\d+/i //截取尺寸，如：/[\d.]+mm\*[\d.]+mm/i.exec('157g铜版纸_1000_A5(140.6mm*210Mm）-双面四色')
    };
    /**
     * 解析键值对字符串为Hash对象
     * @memberof T
     * @method DecodeHashString
     * @param {String} str 必选，键值对字符串
     * @param {String} [sign=&] 可选，默认“&”，键值对分隔符
     * @param {String} [flag==] 可选，默认“=”，键值分隔符
     * @returns {Object} Hash对象
     */
    T.DecodeHashString = function (str, sign, flag) {
        var arr = str ? str.split(sign==null ? '&' : sign) : [];
        var hashs = {};
        var reg = new RegExp('(^|'+(flag||'&')+')([^'+(sign||'=')+']*)'+(sign||'=')+'([^'+(flag||'&')+']*)('+(flag||'&')+'|$)', 'i');
        for (var i = 0, l = arr.length; i < l; i++) {
            var parts = arr[i].match(reg)||[];
            if(parts[2]!==''){
                hashs[parts[2]]=decodeURI(parts[3]==null?'':parts[3]);
            }
        }
        return hashs;
    };
    /**
     * 编码Hash对象为键值对字符串
     * @memberof T
     * @method EncodeHashString
     * @param {String} hashs 必选，Hash对象
     * @param {String} [sign=&] 可选，默认“&”，键值对分隔符
     * @param {String} [flag==] 可选，默认“=”，键值分隔符
     * @returns {String} 键值对字符串
     */
    T.EncodeHashString = function (hashs, sign, flag) {
        var arr = [];
        for (var key in hashs) {
            if (hashs.hasOwnProperty && hashs.hasOwnProperty(key)) {
                arr.push(key + (flag==null ? '=' : flag) + encodeURIComponent(decodeURIComponent(hashs[key]==null?'':hashs[key])));
            }
        }
        return arr.join(sign==null ? '&' : sign);
    };
    /**
     * 获取URL中“?/#”之后的所有参数
     * @memberof T
     * @method GetRequest
     * @param {Boolean} isHash 必选，是否为location.hash
     * @param {String} sign 必选，键值对分隔符
     * @returns {Object} 所有参数
     */
    T.GetRequest = function (isHash, sign) {
        var hashs = isHash ? location.hash : location.search;//获取url中'?/#'符后的字符串
        return T.DecodeHashString(hashs.replace(/^[?#]/, ''), sign);
    };
    /**
     * 字符串化URI
     * @memberof T
     * @method StringifyURI
     * @param {String} [uri=location.href] 可选，默认当前URI，URI字符串
     * @param {Object} [params] 可选，需要附加在“?”之后的参数
     * @param {Object} [hashs] 可选，需要附加在“#”之后的参数
     * @returns {String} URI字符串
     */
    T.StringifyURI = function(uri, params, hashs){
        var parts = (uri||location.href).split(/([?#])/, 5);
        parts[1] = parts[1]||'?';
        parts[2] = T.EncodeHashString(T.Inherit(T.DecodeHashString(parts[2]), params))||'';
        parts[3] = parts[3]||'#';
        parts[4] = T.EncodeHashString(T.Inherit(T.DecodeHashString(parts[4]), hashs))||'';
        console.log(parts.join('').replace(/[?#]+$/,''));
        return parts.join('').replace(/[?#]+$/,'');
    };
    /**
     * 重定向URI
     * @memberof T
     * @method RedirectURI
     * @param {String} goaluri 必选，目标URI字符串
     * @param {String} [backuri] 可选，默认当前URI，回调URI字符串
     */
    T.RedirectURI = function(goaluri, backuri){
        if(!goaluri)return;
        location.replace(T.StringifyURI(goaluri, {backuri: backuri||location.href}));
    };
    /**
     * 重新加载URI
     * @memberof T
     * @method ReloadURI
     * @param {Object} [params] 可选，需要附加在“?”之后的参数
     * @param {Object} [hashs] 可选，需要附加在“#”之后的参数
     */
    T.ReloadURI = function(params, hashs){
        location.replace(T.StringifyURI(location.href, params, hashs));
    };
    /**
     * 动态创建一个闭包函数并执行
     * @memberof T
     * @param {String} str 必选，字符串
     * @returns {Object} 执行结果
     */
    T.Eval = function(str){
        return (new Function('return '+str)());
    };
    /**
     * 操作cookie对象
     * @memberof T
     * @summary Cookie操作类
     * @namespace T.Cookie
     * @author Woo
     * @version 1.1
     * @since 2015/7/31
     */
    T.Cookie = {
        /**
         * 获取cookie
         * @memberof T.Cookie
         * @method get
         * @example
         * T.Cookie.get();
         * T.Cookie.get("sid");
         * @param {String} [key] 可选，cookie键值
         * @returns {Object|String} 如果key不为空，返回指定key的值，则返回所有
         */
        get: function (key) {
            var result = {}, _cookies = document.cookie.split('; ');
            for(var i=0; i<_cookies.length; i++)
                result[_cookies[i].split('=')[0]]=decodeURIComponent(_cookies[i].split('=')[1]);
            return key ? result[key] : result;
        },
        /**
         * 设置cookie，如果value为null/undefined，则删除cookie
         * @memberof T.Cookie
         * @method set
         * @example
         * T.Cookie.set("sid", "1234567890");
         * T.Cookie.set("sid", "1234567890", {expires: 1, path: "/", domain: "ininin.com"});
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
    /**
     * 数组处理类
     * @memberof T
     * @summary 数组处理类
     * @namespace T.Array
     * @author Woo
     * @version 1.1
     * @since 2015/7/31
     */
    T.Array = {
        /**
         * @向数组中添加不重复的元素
         * @param {Array} arr 数组
         * @param {String} value 值
         * @param {Boolean} redo 是否重复，默认false
         * @param {String} key 对象属性名
         * Return {Array} 添加后的数组
         */
        add: function(arr, value, redo, key){
            if(redo){
                arr.push(value);
                return arr;
            }
            var bool = false, isKey = typeof(key)=='undefined'||key==='';
            T.Each(arr, function(k, v){
                if((isKey&&v==value)||(!isKey&&v[key]==value[key]))bool = true;
            });
            if(!bool)arr.push(value);
            return arr;
        },
        /**
         * 根据对象key/value从对象数组中获得对象
         * @memberof T.Array
         * @method get
         * @param {Array} arr 对象数组
         * @param {String} value 对象属性值
         * @param {String} key 对象属性名
         * @returns {Object} 对应的对象
         */
        get: function(arr,value,key){
            var ret = null;
            if(typeof(value)=='undefined'||typeof(key)=='undefined'||key==='')return ret;
            T.Each(arr,function(k,v){
                if(v[key]==value){
                    ret = v;
                    return false;
                }
            });
            return ret;
        },
        /**
         * 根据对象key/value修改对象数组中的对象
         * @memberof T.Array
         * @method set
         * @param {Array} arr 对象数组
         * @param {Object} value 新对象
         * @param {String} key 对象属性名
         * @returns {Array} 修改后的对象数组
         */
        set: function(arr,value,key){
            if(!arr||typeof(value)=='undefined'||typeof(key)=='undefined'||key==='')return arr;
            T.Each(arr,function(k,v){
                if(v[key]==value[key]){
                    arr[k] = value;
                }
            });
            return arr;
        },
        /**
         * 根据key/value获得数组下标
         * @memberof T.Array
         * @method indexOf
         * @param {Array} arr 数组
         * @param {String} value 属性值
         * @param {String} [key] 属性名
         * @returns 对应的下标
         */
        indexOf: function(arr,value,key){
            var ret = -1, bool = typeof key==='undefined'||key==='';
            T.Each(arr,function(k,v){
                if(bool?v==value:v[key]==value){
                    ret = k;
                    return false;
                }
            });
            return ret;
        },
        /**
         * 根据key/values设置对象数组选中状态
         * @memberof T.Array
         * @method check
         * @param {Array} arr 对象数组
         * @param {Array|String} values 属性值，以“;”分开
         * @param {String} key 属性名
         * @param {Boolean} [def=false] 如果没有被选中的，是否默认选中第一个
         * @returns 对象数组
         */
        check: function(arr,values,key,def){
            if(!T.Typeof(arr,/Array/)||typeof(values)=='undefined'||typeof(key)=='undefined'||key==='')return values||[];
            if(T.Typeof(values,/Array/)){
                values = values.join(";");
            }
            var count = 0, _values = '';
            T.Each(arr,function(i,v){
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
        },
        /**
         * 数组合并
         * @param {Array} source 源数组
         * @param {Array} [inject] 要加入的数组
         * @param {Array} [exclude] 要排除的数组
         * @param {Boolean} [isUnique=false] 是否去重
         * @returns {Array}
         */
        merge: function(source, inject, exclude, isUnique){
            source = source||[];
            inject = inject||[];
            exclude = exclude||[];
            var excludeMap = {};
            T.Each(exclude, function(k, v){
                excludeMap[v] = 1;
            });
            var result = [];
            T.Each(source.concat(inject), function(k, v){
                if(excludeMap[v]!=1){
                    result.push(v);
                }
            });
            if(isUnique)result = this.unique(result);
            return result;
        },
        /**
         * 数组去重复
         * @param {Array} source 源数组
         * @returns {Array}
         */
        unique: function(source){
            source = source||[];
            var result = [], sourceMap = {};
            T.Each(source, function(i, v){
                if(sourceMap[v]!=1){
                    sourceMap[v] = 1;
                    result.push(v);
                }
            });
            return result;
        }
    };
    /**
     * @将参数对象转换为URL参数字符串
     * @method ConvertToQueryString
     * @param {Object} [options] 必选，参数对象
     * Return {String} URL参数字符串
     */
    T.ConvertToQueryString = function(options){
        var params = [];
        for(var o in options)
            if(options.hasOwnProperty(o))
                params.push(o+'='+encodeURIComponent(typeof options[o]==='object'?T.JSON.stringify(options[o]):options[o]));
        return params.join('&');
    };
    /**
     * GET 方法
     * @param {Object} options 请求数据
     * @param {String} options.action 请求API
     * @param {Object} [options.params] 请求参数
     * @param {Function} [options.success] 请求成功后回调
     * @param {Function} [options.failure] 请求失败后回调（逻辑错误）
     * @param {Function} [options.error] 请求出错后回调（系统错误）
     * @param {Function} [_failure] 失败后回调函数
     * @param {Function} [_error] 出错后回调函数
     */
    T.GET = function(options, _failure, _error){
        if (!options||!options.action)return;
        var params = options.params||{};
        var jsoncallback = params.jsoncallback||T.UUID().toUpperCase();//产生随机函数名
        if(window[jsoncallback]){
            jsoncallback = T.UUID().toUpperCase();
        }
        if(!/^http/.test(options.action))options.action = T.DOMAIN.ACTION + options.action;
        params.jsoncallback = jsoncallback;
        var _params = params;
        if(!_params.ininin)_params.ininin = T.UUID().toUpperCase();
        options.action += (options.action.indexOf('?')<0?'?':'&')+T.ConvertToQueryString(_params);
        var script = document.createElement('script');
        script.defer = 'defer';
        script.async = 'async';
        window[jsoncallback] = function(response){//定义被脚本执行的回调函数
            try{
                options.data = response;
                T.callback(options, _failure, _error);
            }catch(e){}
            finally{//最后删除该函数与script元素
                if(script&&script.parentNode&&script.parentNode.removeChild){
                    script.parentNode.removeChild(script);
                }
                setTimeout(function(){
                    window[jsoncallback] = 'ininin';
                }, 100);//加入堆栈
            }
        };
        /*script.onerror = function(){
         if(!script)return;
         script.parentNode.removeChild(script);
         window[jsoncallback] = 'ininin';
         if(typeof options.error==='function'){
         options.error();
         }
         T.alt('系统繁忙，请稍后再试', function(_this){
         _this.remove();
         //location.reload();
         }, function(){
         //location.reload();
         });
         };*/
        document.documentElement.appendChild(script);
        script.src = options.action;
    };
    /**
     * POST 方法
     * @param {Object} options 请求数据
     * @param {String} options.action 请求API
     * @param {Object} [options.params] 请求参数
     * @param {Function} [options.success] 请求成功后回调
     * @param {Function} [options.failure] 请求失败后回调（逻辑错误）
     * @param {Function} [options.error] 请求出错后回调（系统错误）
     * @param {Function} [_failure] 失败后回调函数
     * @param {Function} [_error] 出错后回调函数
     */
    T.POST =function(options, _failure, _error){
        if(!options||!options.action)return;
        T.POST.zIndex = (T.POST.zIndex||0)+1;
        options.params = options.params||{};
        if(!/^http/.test(options.action))options.action = T.DOMAIN.ACTION + options.action;
        options.action += (options.action.indexOf('?')>0?'&':'?')+'ininin='+T.UUID().toUpperCase();//Math.random();
        var form = T.element('form',{
            target: 'piframe_'+T.POST.zIndex
            ,action: options.action
            ,method: 'post'
            ,style: 'display:none'
        });
        var iframe;
        try { // for I.E.
            iframe = document.createElement('<iframe name="piframe_'+T.POST.zIndex+'">');
        } catch (ex) { //for other browsers, an exception will be thrown
            iframe = T.element('iframe',{
                name: 'piframe_'+T.POST.zIndex
                ,src: '#'//'about:blank'
                ,style: 'display:none'
            });
        }
        if(!iframe)return;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        document.body.appendChild(form);
        var formdata = options.params;
        T.Each(formdata,function(k,v){
            if(/password$|pwd$/i.test(k)){
                v = Utils.md5(Utils.md5(v));
            }
            form.appendChild(T.element('input',{
                type: 'hidden'
                ,name: k
                ,value: (typeof v==='object'? T.JSON.stringify(v):v)
            }));
        });
        iframe.callback = function (o) {
            iframe.parentNode.removeChild(iframe), form.parentNode.removeChild(form), iframe = form = null;
            options.data = o;
            T.callback(options, _failure, _error);
        };
        /*iframe.onload = function(){
         if(!iframe)return;
         iframe.parentNode.removeChild(iframe), form.parentNode.removeChild(form), iframe = form = null;
         _error&&_error();
         T.alt(T.TIPS.DEF, function(_this){
         _this.remove();
         //location.reload();
         }, function(){
         //location.reload();
         });
         };*/
        if(options.before)options.before(form, iframe);
        form.submit();
    };
    /**
     * callback 方法
     * @param {Object} options 请求数据
     * @param {String} options.action 请求API
     * @param {Object} options.params 请求参数
     * @param {Function} options.success 请求成功后回调
     * @param {Function} options.failure 请求失败后回调（逻辑错误）
     * @param {Function} options.error 请求出错后回调（系统错误）
     * @param {Function} [_failure] 失败后回调函数
     * @param {Function} [_error] 出错后回调函数
     */
    T.callback = function(options, _failure, _error){
        if(options&& T.Typeof(options.data, /Object/)){
            console.log('==========>', options.action.replace(/\?.*/,''), '    ', options.data.result, '    ', '路由');
            if(options.data.result==0 && T.Typeof(options.data.data, /Object/)){
                console.log('==========>', options.action.replace(/\?.*/,''), '    ', options.data.data.result, '    ', options.data);
                if(options.data.data.result==0){
                    if(options.success)options.success(options.data.data, options.params);
                }else if(options.data.data.result>0){
                    if(options.failure){
                        options.failure(options.data.data, options.params);
                    }else{
                        T.alt(options.data.data.msg||T.TIPS.DEF, function(_this){
                            _this.remove();
                            //location.reload();
                        }, function(){
                            //location.reload();
                        });
                    }
                }else{
                    if(options.error){
                        options.error(options.data.data, options.params);
                    }else{
                        T.alt(T.TIPS.DEF, function(_this){
                            _this.remove();
                            //location.reload();
                        }, function(){
                            //location.reload();
                        });
                    }
                }
            }else if(options.data.result==3){//未登录
                if(_failure){
                    _failure(options.data, options.params);
                }else{
                    T.noLogin();
                    /*T.alt(options.data.msg||T.TIPS.DEF, function(_this){
                     _this.remove();
                     location.reload();
                     }, function(){
                     location.reload();
                     });*/
                }
            }else if(options.data.result>0){//逻辑错误
                if(_failure){
                    _failure(options.data, options.params);
                }else{
                    T.alt(options.data.msg||T.TIPS.DEF, function(_this){
                        _this.remove();
                        //location.reload();
                    }, function(){
                        //location.reload();
                    });
                }
            }else{//系统错误
                if(_error){
                    _error(options.data, options.params);
                }else{
                    T.alt(T.TIPS.DEF, function(_this){
                        _this.remove();
                        //location.reload();
                    }, function(){
                        //location.reload();
                    });
                }
            }
        }else{
            if(_error){
                _error(options.data, options.params);
            }else{
                /*T.alt(options.data.msg||T.TIPS.DEF, function(_this){
                 _this.remove();
                 //location.reload();
                 }, function(){
                 //location.reload();
                 });*/
            }
        }
    };
    /**
     * 弹出框
     */
    T.Popup = function(params){
        function Popup(params){
            var _this = this;
            params = params||{};
            var options =  {
                target: ''
                ,id: ''
                ,type: 'html'//html||object||iframe||url
                ,modal: true//true：则为模态
                ,fixed: false
                ,style: ''
                ,zIndex: 1010
                ,width: 'auto'
                ,height: 'auto'
                ,title: ''
                ,content: ''
                ,close: true
                ,ok: ''
                ,no: ''
                ,okFn: null
                ,noFn: null
                ,closeFn:null
                ,data: null//参数，url加载时传递
                ,success: null//加载成功回调，url加载时传递
                ,failure: null//加载失败回调，url加载时传递
                ,callback: null
                ,otherClose: false //图片查看器
            };
            options = T.Inherit(options,params);
            T.Popup.uuid = T.Popup.uuid||[];
            var container = document.body||document.documentElement;//容器
            if(!container)return;
            if(typeof options.trigger==='string')options.trigger = T.byId(options.trigger);
            if(options.trigger&&options.trigger.nodeType==1){
                var clicked = T.attr('clicked');
                if(clicked=='clicked'){
                    return;
                }else{
                    T.attr('clicked','clicked');
                }
            }

            function getUUID(){
                var str = T.RandomString(32)+new Date().getTime();
                return T.Popup.uuid[str]?getUUID():str;
            }
            if(options.id&&T.Popup.uuid[options.id])return;
            var UUID = options.id||getUUID();
            T.Popup.uuid.push(UUID);
            T.Popup.uuid[UUID] = _this;
            var cw = options.width+(isNaN(options.width)?'':'px');
            var ch = options.height+(isNaN(options.height)?'':'px');
            var sTop = options.modal?0:Math.max(document.documentElement.scrollTop,document.body.scrollTop);
            var filter = null,layer = null, content = null, panel = null, iframe = null, headline = null;

            if(options.modal){
                filter = T.element('div',{
                    'id': UUID + '_filter'
                    ,'class': 'popup_filter popup_loading'
                    ,'style': 'z-index:'+options.zIndex
                });
                if(!T.IS.fixed)filter.innerHTML = '<div class="popup_opacity"><iframe frameborder="0" scrolling="no"></iframe></div>';
                container.appendChild(filter);
            }
            layer = T.element('div',{
                'id': UUID + '_layer'
                ,'class': 'popup_layer popup_hide'+(options.fixed?' fixed':'')+(options.style?' '+options.style:'')
                ,'style': 'z-index:'+(options.zIndex+10)+';width:'+cw+';height:'+ch+';top:'+sTop+'px;'
            });
            if(!T.IS.fixed)layer.innerHTML = '<div class="popup_opacity"><iframe frameborder="0" scrolling="no"></iframe></div>';
            panel = T.element('div',{
                'id': UUID + '_panel'
                ,'class': 'popup_panel'
            });
            layer.appendChild(panel);
            var btns = options.ok==''?'':'<a id="'+UUID+'_ok" class="btn btn-primary md-btn" href="javascript:;">'+options.ok+'</a>';
            btns += options.no==''?'':'<a id="'+UUID+'_no" class="btn btn-default md-btn ml30" href="javascript:;">'+options.no+'</a>';
            var btn = options.close?'<a id="'+UUID+'_close" class="close" href="javascript:;" title="关闭">&times;</a>':'';
            var html = options.title==''?btn:'<div id="'+UUID+'_head" class="popup_head">'+btn+'<h3 id="'+UUID+'_headline">'+options.title+'</h3></div>';
            var ctt = options.type=='iframe'?'<iframe id="'+UUID+'_iframe" src="" frameborder="0" allowtransparency="true" scrolling="auto"></iframe>':'';
            ctt = options.type=='html'?options.content:ctt;
            html += '<div id="'+UUID+'_main" class="popup_main">'+ctt+'</div>';
            html += btns==''?'':'<div id="'+UUID+'_foot" class="popup_foot">'+btns+'</div>';
            panel.innerHTML = html;

            container.appendChild(layer);
            content = document.getElementById(UUID+'_main');
            iframe = document.getElementById(UUID+'_iframe');
            headline = document.getElementById(UUID+'_headline');
            var closeBtn = document.getElementById(UUID+'_close');
            var noBtn = document.getElementById(UUID+'_no');
            var okBtn = document.getElementById(UUID+'_ok');
            if(options.close&&closeBtn){
                T.bind(closeBtn, 'click', function(e){
                    _this.remove();
                    if(typeof options.closeFn==='function'){
                        options.closeFn.call(_this,_this);
                    }else{
                        typeof options.noFn==='function'&&options.noFn.call(_this,_this);
                    }
                });
            }
            if(options.no!=''&&noBtn){
                T.bind(noBtn, 'click', function(e){
                    _this.remove();
                    typeof options.noFn==='function'&&options.noFn.call(_this,_this);
                });
            }
            if(options.ok!=''&&okBtn){
                T.bind(okBtn, 'click', function(e){
                    typeof options.okFn==='function'&&options.okFn.call(_this,_this);
                });
            }
            if(options.otherClose) { //图片查看器
                T.bind(filter, 'click', function(e){
                    e = e||event;
                    var target = e.target|| e.srcElement;
                    if(T.hasClass(target, 'popup_filter')){
                        _this.remove();
                        typeof options.noFn==='function'&&options.noFn.call(_this,_this);
                    }
                });
            }
            _this.remove = function(){
                T.unbind(document,'keydown',_this.keydown);
                if(filter){
                    container.removeChild(filter);
                    filter = null;
                }
                if(layer){
                    container.removeChild(layer);
                    layer = null;
                }
                if(T.Popup.uuid[UUID]){
                    delete T.Popup.uuid[UUID];
                }
                options.trigger&&T.removeAttr(options.trigger,'clicked');
            };
            _this.show = function(){
                if(filter){
                    T.removeClass(filter, 'popup_loading');
                }
                if(layer){
                    T.removeClass(layer, 'popup_hide');
                }
            };
            _this.setPosition = function(){
                if(layer){
                    var wh = T.GetSize();
                    var sp = T.GetScrollPos();
                    if(typeof(options.setSize)==='function'){
                        options.setSize.call(_this, layer, panel, wh);
                    }
                    var top = (wh.h-panel.offsetHeight)/2;
                    var left = (wh.w-panel.offsetWidth)/2;
                    top = Math.max(0,top);
                    top = Math.min(wh.h,top);
                    var sTop = options.fixed?0:sp.y;
                    var sLeft = options.fixed?0:sp.x;
                    layer.style.height = 'auto';
                    layer.style.top = sTop+top+'px';
                    layer.style.left = sLeft+left+'px';
                    if(typeof _this.show==='function')_this.show();
                }
            };
            _this.keydown = function(e){
                e = e||window.event;
                var keycode = e.keyCode||e.which;
                if(keycode==27){
                    _this.remove();
                    typeof options.noFn==='function'&&options.noFn.call(_this,_this);
                }
            };
            _this.setFocus = function(){
                if(closeBtn){
                    closeBtn.focus();
                    closeBtn.blur();
                }
                if(noBtn){
                    noBtn.focus();
                }
                if(okBtn){
                    okBtn.focus();
                }
            };
            _this.loaded = function(){
                typeof options.callback==='function'&&options.callback.call(_this,_this);
                _this.setPosition();
                _this.setFocus();//2015-01-26
                T.bind(window, 'resize', _this.setPosition);
            };
            var _top = sTop-panel.offsetHeight;
            layer.style.top = _top+'px';
            if(options.type=='iframe'){
                if(iframe){
                    var isFirst = true;
                    var autoIframe = function (){
                        var _height = document.documentElement.clientHeight*0.8;
                        var height = _height - (layer.offsetHeight-content.clientHeight);
                        var pageWidth = iframe.contentWindow.document.body.offsetWidth;
                        var pageHeight = iframe.contentWindow.document.body.offsetHeight;
                        var width = pageWidth+(pageHeight>height?17:0)+'px';
                        iframe.style.width = width;
                        iframe.style.height = height+'px';
                        pageWidth = _height<pageHeight?pageWidth+15:pageWidth;
                        layer.style.width = width;
                        options.callback!=null&&typeof options.callback=='function'&&options.callback.call(_this,_this);
                        if(isFirst)_this.loaded();
                        isFirst = false;
                    };
                    iframe.callback = autoIframe;
                    iframe.src = options.content;
                }
            }
            else if(options.type=='object'){
                if(options.content&&options.content.nodeType==1){
                    content.appendChild(options.content);
                    _this.loaded();
                    if(options.content.offsetWidth){
                        layer.style.width = options.content.offsetWidth;
                        _this.setPosition();
                    }
                }
            }else{
                content.innerHTML = options.content;
                _this.loaded();
            }
            _this.dom = layer;
            T.DragDrop({
                trigger: headline
                ,target: layer
                ,keepOrigin: false
            });
            T.bind(document,'keydown',_this.keydown);
            /*if(options.fixed){
             function _preventDefault(e){
             if((e.target||e.srcElement)==filter){
             T.preventDefault(e);
             }
             }
             if(document.addEventListener){
             filter.addEventListener('DOMMouseScroll', function(e){
             e = e||event;
             console.log('filter.DOMMouseScroll=>',e.target||e.srcElement);
             _preventDefault(e);
             return false;
             },false);
             layer.addEventListener('DOMMouseScroll', function(e){
             e = e||event;
             console.log('layer.DOMMouseScroll=>',e.target||e.srcElement);
             _preventDefault(e);
             return false;
             },false);
             }//W3C
             filter.onmousewheel = layer.onmousewheel = function(e){
             e = e||event;
             console.log('onmousewheel=>',e.target||e.srcElement);
             _preventDefault(e);
             return false;
             };//IE/Opera/Chrome/Safari
             }*/
        }
        return new Popup(params);
    };
    /**
     * 拖拽
     */
    T.DragDrop = function(options){
        function DragDrop(options){
            var self = this;
            if(typeof options.trigger==='string')options.trigger = T.byId(options.trigger);
            if(!options.trigger)return;
            if(typeof options.target==='string')options.target = T.byId(options.target);
            if(!options.target)return;
            options.opacity = parseInt(options.opacity,10)||100;
            if(options.keepOrigin)options.opacity = 50;
            options.mousedown = options.mousedown||{};
            options.mousemove = options.mousemove||{};
            options.mouseup = options.mouseup||{};
            var originDragDiv = null;
            var tmpX = 0;
            var tmpY = 0;
            var moveable = false;
            var dragObj = this;
            options.trigger.onmousedown = function(e){
                e = e||T.GetEvent();//只允许通过鼠标左键进行拖拽,IE鼠标左键为1 FireFox为0
                if(!e||(typeof options.target.setCapture=='object'&&e.button!=1)||(typeof options.target.setCapture!='object'&&e.button!=0))return false;
                if(typeof options.mousedown.before=='function')options.mousedown.before.call(this,options.target,options.trigger);
                var wh = T.GetSize();
                if(options.keepOrigin){
                    options.minLeft = parseInt(options.left,10)||0;
                    options.maxLeft = parseInt(wh.w-options.right,10)||wh.w-options.target.offsetWidth;
                    options.minTop = parseInt(options.top,10)||0;
                    options.maxTop = parseInt(wh.h-options.bottom,10)||wh.h-options.target.offsetHeight;
                }else{
                    var posDiv = options.target.offsetParent||options.target.parentNode;
                    var posW = posDiv.clientWidth||posDiv.offsetWidth;
                    var posH = posDiv.clientHeight||posDiv.offsetHeight;
                    options.minLeft = parseInt(options.left-options.target.offsetWidth,10)||0;
                    options.maxLeft = parseInt(posW-options.right,10)||posW-options.target.offsetWidth;
                    options.minTop = parseInt(options.top-options.target.offsetHeight,10)||0;
                    options.maxTop = parseInt(posH-options.bottom,10)||posH-options.target.offsetHeight;
                }
                if(options.keepOrigin){
                    originDragDiv = document.createElement('div');
                    originDragDiv.style.cssText = options.target.style.cssText;
                    originDragDiv.style.width = options.target.offsetWidth;
                    originDragDiv.style.height = options.target.offsetHeight;
                    originDragDiv.innerHTML = options.target.innerHTML;
                    //options.target.parentNode.appendChild(originDragDiv);
                    if(options.target.parentNode)options.target.parentNode.insertBefore(originDragDiv,options.target);
                    options.target.style.zIndex = T.getZIndex() + 1;
                }
                moveable = true;
                var downPos = T.GetMousePos(e);
                tmpX = downPos.x - options.target.offsetLeft;
                tmpY = downPos.y - options.target.offsetTop;
                options.trigger.style.cursor = 'move';
                if(options.target.setCapture){
                    options.target.setCapture();
                }else{
                    window.captureEvents(Event.MOUSEMOVE);
                }
                //T.SetOpacity(options.target, options.opacity);
                T.stopPropagation(e);
                T.preventDefault(e);
                if(typeof options.mousedown.after=='function')options.mousedown.after.call(this,options.target,options.trigger);
                document.onmousemove = function(e){
                    if(moveable){
                        var e = e||T.GetEvent();//IE 去除容器内拖拽图片问题
                        if (document.all){//IE
                            e.returnValue = false;
                        }
                        var movePos = T.GetMousePos(e);
                        var _left = Math.max(Math.min(movePos.x - tmpX, options.maxLeft), options.minLeft);
                        var _top = Math.max(Math.min(movePos.y - tmpY, options.maxTop), options.minTop);
                        if(options.percent){
                            var posDiv = options.target.offsetParent||options.target.parentNode;
                            var posW = posDiv.clientWidth||posDiv.offsetWidth;
                            var posH = posDiv.clientHeight||posDiv.offsetHeight;
                            _left = (_left/posW*100) + '%';
                            _top = (_top/posH*100) + '%';
                        }else{
                            _left = _left + 'px';
                            _top = _top + 'px';
                        }
                        options.target.style.left = _left;
                        options.target.style.top = _top;
                    }
                    if(typeof options.mousemove=='function')options.mousemove.call(this,options.target,options.trigger);
                };
                document.onmouseup = function(){
                    if(typeof options.mouseup.before=='function')options.mouseup.before.call(this,options.target,options.trigger);
                    document.onmousemove = null;
                    document.onmouseup = null;
                    if (options.keepOrigin){
                        if(options.target.setCapture){
                            originDragDiv.outerHTML = '';
                        }else{
                            //setOuterHtml(originDragDiv, "");
                        }
                    }
                    if(moveable){
                        if(options.target.setCapture){
                            options.target.releaseCapture();
                        }else{
                            window.releaseEvents(Event.MOUSEMOVE);
                        }
                        //T.SetOpacity(options.target, 100);
                        options.trigger.style.cursor = 'default';
                        moveable = false;
                        tmpX = 0;
                        tmpY = 0;
                    }
                    if(typeof options.mouseup.after=='function')options.mouseup.after.call(this,options.target,options.trigger);
                    if(typeof options.callback=='function')options.callback.call(this,options.target,options.trigger);
                };
            }
        }
        return new DragDrop(options);
    };
    /**
     * @生成随机字符串
     * @param {Number} [len] 可选，默认6，生成字符串的长度
     * @param {Boolean} [readable] 可选，默认False，是否去掉容易混淆的字符
     * Return {String} 指定长度的随机字符串
     */
    T.RandomString = function(len,readable){
        len = len||6;
        //'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';//去掉容易混淆的字符oO,Ll,9gq,Vv,Uu,I1
        var chars = readable?'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz':'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            count = chars.length,
            str = '';
        for(var i=len; i>0; i--)str += chars.charAt(Math.floor(Math.random()*count));
        return str;
    };
    /**
     * 提示框
     */
    T.alt = window.alert = function(text, okFn, noFn, ok){
        if(!noFn)noFn = okFn;
        return T.Popup({
            fixed: true
            ,id: 'popup_alert'
            ,zIndex : 2000
            ,width: 480
            ,modal: true
            ,title : '温馨提示'
            ,content : '<dl class="popbox vertical_middle"><dt class="vm_left"></dt><dd class="vm_right">'+text+'</dd></dl>'
            ,ok : ok||(ok===''?'':'确  定')
            ,okFn : okFn||function(_o){
                _o.remove();
            }
            ,noFn : noFn
        });
    };
    T.byId = function(id){
        var els = document.getElementById(id);
        return els?els:null;
    };
    /* 判断浏览器是否支持或存在某些属性/方法/对象 */
    T.IS = {
        fixed: _NODE.style.position=='fixed'//position:fixed
        ,AXO: 'ActiveXObject' in window//ActiveXObject
        ,CVS: !!document.createElement('canvas').getContext
        ,XHR: typeof XMLHttpRequest!='undefined'//XMLHttpRequest
        ,FD: typeof FormData!='undefined'//FormData
        ,FR: typeof FileReader!='undefined'//FileReader
        ,EL: typeof addEventListener!='undefined'//addEventListener/removeEventListener||attachEvent/detachEvent
        ,DM: document.documentMode//只有IE8+才支持开始是支持文档模式
    };
    T.GetSize = function(o){
        if(o)return {
            w: o.clientWidth||o.offsetWidth,
            h: o.clientHeight||o.offsetHeight
        };
        return {
            w: window.innerWidth||document.documentElement.clientWidth||document.body.offsetWidth,
            h: window.innerHeight||document.documentElement.clientHeight||document.body.offsetHeight
        };
    };
    T.GetMousePos = function(e){
        var ret = {};
        e = e||T.GetEvent();
        if(!isNaN(e.pageX)&&!isNaN(e.pageY)){
            ret.x = e.pageX;
            ret.y = e.pageY;
        }else if(document.documentElement&&!isNaN(e.clientX)&&!isNaN(document.documentElement.scrollTop)){
            ret.x = e.clientX+document.documentElement.scrollLeft-document.documentElement.clientLeft;
            ret.y = e.clientY+document.documentElement.scrollTop-document.documentElement.clientTop;
        }else if(document.body&&!isNaN(e.clientX)&&!isNaN(document.body.scrollLeft)){
            ret.x = e.clientX+document.body.scrollLeft-document.body.clientLeft;
            ret.y = e.clientY+document.body.scrollTop-document.body.clientTop;
        }
        return ret;
    };
    T.GetEvent = function(){
        if(window.event)return window.event;
        var func = arguments.caller;
        while(func!=null) {
            var e = func.arguments;
            e = e[0];
            if(e){
                if((e.constructor==Event||e.constructor==MouseEvent||e.constructor==KeyboardEvent)||(typeof e==='object'&&e.preventDefault&&e.stopPropagation)){
                    return e;
                }
            }
            func = func.caller;
        }
        return null;
    };
    T.GetScrollPos = function(){//2015-01-26
        var ret = {
            x: document.body.scrollLeft-document.body.clientLeft,
            y: document.body.scrollTop-document.body.clientTop
        };
        if(document.documentElement){
            ret.x = Math.max(document.documentElement.scrollLeft-document.documentElement.clientLeft, ret.x);
            ret.y = Math.max(document.documentElement.scrollTop-document.documentElement.clientTop, ret.y);
        }
        return ret;
    };
    /**
     * create 方法
     * @param {String} tag 标签类型
     * @param {Object} attrs 属性集合
     */
    T.element = function(tag,attrs){
        tag = tag||'div';
        attrs = attrs||{};
        var node = document.createElement(tag);
        T.Each(attrs,function(k,v){
            if(k=='class')node.className = v;
            else if(k=='id')node.id = v;
            else if(k=='name')node.name = v;
            else if(k=='style')node.style.cssText = v;
            else T.attr(node,k,v);
        });
        return node;
    };
    T.attr = function(o,n,v){
        if(o&&n&&v&&o.setAttribute)o.setAttribute(n,v);
        return (o&&n&&o.getAttribute)?o.getAttribute(n):'';
    };
    /**
     * JSON处理类
     * @memberof T
     * @summary JSON处理类
     * @namespace T.JSON
     * @author Woo
     * @version 1.1
     * @since 2015/7/31
     */
    T.JSON = {
        /**
         * JSON字符串转为JSON对象
         * @memberof T.JSON
         * @method parse
         * @example
         * T.JSON.parse('{"name":"woo", "data": [1, 2, 3]}');
         * @param {String} str JSON字符串
         * @returns {Object} JSON对象
         */
        parse: function(str){
            return (new Function('return '+str))();
        },
        /**
         * 对象转为字符串
         * @memberof T.JSON
         * @method ObjectToString
         * @example
         * T.JSON.ObjectToString({"name":"woo", "age": 18});
         * @param {Object} obj 对象
         * @returns {String} 字符串
         */
        ObjectToString: function(obj){
            var _this = this;
            var jsonString = [];
            for(var o in obj){
                if(obj.hasOwnProperty(o)){
                    var item = obj[o];
                    var type = T.Typeof(item);
                    if(type==='Array'){
                        jsonString.push('"'+o+'":'+ _this.ArrayToString(item));
                    }else if (type==='Object'){
                        jsonString.push('"'+o+'":'+_this.ObjectToString(item));
                    }else{
                        jsonString.push('"'+o+'":"'+item+'"');
                    }
                }
            }
            return '{'+jsonString.join(',')+'}';
        },
        /**
         * 数组转为字符串
         * @memberof T.JSON
         * @method ArrayToString
         * @example
         * T.JSON.ArrayToString([1, 2, 3]);
         * @param {Array} arr 数组
         * @returns {String} 字符串
         */
        ArrayToString: function(arr) {
            var _this = this;
            var jsonString = [];
            for(var item=null,i=0; item=arr[i]; i++){
                var type = T.Typeof(item);
                if(type==='Array'){
                    jsonString.push(_this.ArrayToString(item));
                }else if (type==='Object'){
                    jsonString.push(_this.ObjectToString(item));
                }else{
                    jsonString.push('"'+item+'"');
                }
            }
            return '['+jsonString.join(',')+']';
        },
        /**
         * JSON对象转为JSON字符串
         * @memberof T.JSON
         * @method stringify
         * @example
         * T.JSON.stringify({"name":"woo", "data": [1, 2, 3]});
         * @param {Object} json JSON对象
         * @returns {String} JSON字符串
         */
        stringify: function(json) {
            var _this = this;
            var jsonString = '';
            var type = T.Typeof(json);
            if(type==='Array'){
                jsonString = _this.ArrayToString(json);
            }else if(type==='Object') {
                jsonString = _this.ObjectToString(json);
            }else{
                jsonString = json;
            }
            return jsonString;
        }
    };
    T.byTagName = function(o,n){
        o = o?o:document;
        var els = o.getElementsByTagName(n);
        return els?els:[];
    };
    /**
     * 设置下拉框选项
     * @param {DOM} obj DOM对象
     * @param {Object} options 配置
     * @param {String} options.data 数据
     * @param {String} [options.key] 键
     * @param {String} [options.val] 值
     * @param {String} [options.value] 默认值
     * @param {Number} [options.len] 保留个数
     */
    T.SetSelectOptions = function(obj, options){
        var option = null;
        if(!obj||!options||!options.data)return;
        obj.length = options.len||0;
        T.Each(options.data, function(o, item){
            if(options.key&&options.val){
                option = new Option(item[options.val], item[options.key]);
                if(item[options.key]===options.value)option.selected = 'selected';
            }else{
                option = new Option(item||o, o);
                if((item||o)===options.value)option.selected = 'selected';
            }
            obj.options.add(option);
        });
    };
    T.GetChecked = function(dom,name,isRadio, hasDisabled){
        if(!name)return null;
        var chks = [];
        var type = isRadio?'radio':'checkbox';
        var inputs = T.byTagName(dom,'input');
        for(var input=null, i=0; input=inputs[i]; i++){
            if(input&&input.type==type&&input.name==name){
                if(hasDisabled){
                    if(input.checked)chks.push(input.value);
                }else{
                    if(input.checked&&!input.disabled)chks.push(input.value);
                }
            }
        }
        return chks;
    };
    T.Checkboxs = function(dom,name,nameall,callback){
        if(!name)return;
        if(nameall!==null)nameall = nameall||name+'all';
        var inputs = T.byTagName(dom,'input');
        for(var input=null, i=0; input=inputs[i]; i++){
            if(input&&input.type=='checkbox'&&(input.name===name||input.name===nameall)){
                input.onclick = function(o){
                    return function(e){
                        checked(o,o.checked);
                        if(o.name===nameall)chkeckall(o,o.checked);
                        else chkeckall(o,check(),true);
                    };
                }(input);
            }
        }
        function chkeckall(o,chk,chkall){
            var inputs = T.byTagName(dom,'input');
            for(var input=null, i=0; input=inputs[i]; i++){
                if(chkall){
                    if(input&&input.type=='checkbox'&&input.name===nameall)checked(input,chk);
                }else{
                    if(input&&input.type=='checkbox'&&(input.name===name||input.name===nameall))checked(input,chk);
                }
            }
        }
        function check(){
            var checked = true;
            var inputs = T.byTagName(dom,'input');
            for(var input=null, i=0; input=inputs[i]; i++){
                if(input&&input.type=='checkbox'&&input.name===name){
                    if(!input.checked)return false;
                }
            }
            return true;
        }
        function checked(o,chk){
            chk?o.checked = true:o.checked = false;
            //chk?T.addClass(T.closest(o,'.checkbox'),'sel'):T.removeClass(T.closest(o,'.checkbox'),'sel');
            if(callback)callback.call(o,o,o.checked);
        }
    };
    /**
     * 字符串或数字转半角
     * @param str
     */
    T.toDBC = function(str){
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
    };
    ;(function(T){
        /**
         * 图片验证码
         * @param options
         * @returns {{getValue: getValue, verify: verify, refresh: refresh}}
         * @constructor
         */
        function Captcha(options, callbacks){
            var _this = this,
                opts = options||{};
            opts.img = opts.img||"img"; //图片
            opts.input = opts.input||"input[name='captcha']"; //输入框
            opts.account = opts.account||"input[name='account']"; //账号输入框
            opts.refresh = opts.refresh||".refresh"; //刷新按钮
            _this.options = opts;
            _this.callbacks = callbacks||{};
            _this.init();
        }
        Captcha.prototype = {
            data: {
                token: "" //图片验证码的唯一码
            },
            init: function(){
                var _this = this,
                    opts = _this.options;
                _this.$cont = $(opts.cont); //验证码容器
                _this.$img = $(opts.img, _this.$cont); //验证码图片
                _this.$input = $(opts.input, _this.$cont); //验证码输入框
                _this.$account = $(opts.account); //账号输入框
                _this.$img.off("click.captcha").on("click.captcha", function(e){debugger
                    _this.refresh();
                });
                $(opts.refresh, _this.$cont).off("click.captcha").on("click.captcha", function(e){debugger
                    _this.refresh();
                });
                _this.refresh();
            },
            /**
             * 获取输入的验证码
             * @returns {*}
             */
            getValue: function(){
                var _this = this;
                return $.trim(T.toDBC(_this.$input.val()));
            },
            /**
             * 校验验证码
             */
            verify: function(){
                var _this = this,
                    opts = _this.options,
                    callbacks = _this.callbacks;
                var code = _this.getValue();
                if(_this.verifying && !_this.data.token) return;
                _this.verifying = false;
                if(_this.data.token && code){
                    _this.verifying = true;
                    T.GET({
                        action: "in_common/captcha/captcha_verify",
                        params: {
                            token: _this.data.token,
                            capt_val: code
                        },
                        success: function(data, params){debugger
                            _this.verifying = false;
                            //验证码校验通过，继续业务处理
                            callbacks.success && callbacks.success.call(_this, data.verify_code);
                        },
                        failure: function(data, params){
                            _this.verifying = false;
                            //验证码校验通过，刷新验证码，提示用户重新输入
                            T.msg(data.msg||"输入验证码有误，请重新输入");
                            _this.refresh();
                        }
                    }, function(data, params){
                        _this.verifying = false;
                        T.msg(data.msg||"输入验证码有误，请重新输入");
                        _this.refresh();
                    }, function(data, params){
                        _this.verifying = false;
                        T.msg(data.msg||"输入验证码有误，请重新输入");
                        _this.refresh();
                    });
                    _this.data.token = "";
                }else if(!code){
                    T.msg("请输入验证码");
                    _this.refresh();
                }else{
                    T.msg("验证码已失效，请重新输入");
                    _this.refresh();
                }
            },
            /**
             * 加载验证码
             */
            refresh: function(){
                var _this = this,
                    opts = _this.options,
                    callbacks = _this.callbacks;
                //获取唯一码
                T.GET({
                    action: "in_common/captcha/get_token",
                    success: function(data, params){
                        _this.data.token = data.token||"";
                        //加载验证码
                        _this.$img.attr("src", T.DOMAIN.ACTION + "in_common/captcha/get_captcha?" + T.ConvertToQueryString({token: _this.data.token}));
                        //刷新时回掉函数
                        callbacks.refresh && callbacks.refresh.call(_this, _this.data.token);
                    },
                    failure: function(data, params){
                        _this.refresh();
                    }
                });
            }
        };
        T.Captcha = function(options, callbacks){
            return new Captcha(options, callbacks);
        };
    }(T));
    ;(function(T){
        /**
         * 发送验证码到手机
         * @param options
         * @returns {{getValue: getValue, verify: verify, refresh: refresh}}
         * @constructor
         */
        function CaptchaToPhone(options, callbacks){
            this.options = options||{};
            this.callbacks = callbacks||{};
            this.init();
        }
        CaptchaToPhone.prototype = {
            init: function(){
                var _this = this,
                    opts = _this.options,
                    callbacks = _this.callbacks;
                opts.popupId = opts.popupId||"captcha-popup";
                opts.trigger = opts.trigger||"#captcha_to_phone"; //触发按钮
                opts.text = opts.text||"发送验证码"; //按钮默认文字
                opts.sendText = opts.sendText||"发送成功"; //按钮发送成功文字
                opts.account = opts.account||"#account"; //账号输入框
                opts.username = opts.username||""; //账号，可直接传入
                opts.interval = opts.interval||60; //间隔时间内不能重复发送，单位：秒
                opts.successTip = opts.successTip==null?"发送验证码成功":opts.successTip; //成功提示信息，不传会使用默认提示语，传空字符则不显示

                _this.$account = $(opts.account); //账号输入框
                _this.$trigger = $(opts.trigger); //触发按钮
                _this.data = {};
                _this.$trigger.off("click.captcha").on("click.captcha", function(e){
                    if(_this.$trigger.hasClass("dis"))return;
                    var captcha;
                    //显示验证码弹出框
                    $("#" + opts.popupId).remove();
                    _this.popup = T.cfm('<div id="' + opts.popupId + '" class="forms form_vcode"><input type="text" class="vcode" value="" name="captcha"/><img class="img" src=""/><a class="refresh" href="javascript:;">看不清楚<br/>换一张</a></div>', function(){
                        captcha && captcha.verify();
                        return false;
                    }, function (_o) {
                        _o.remove();
                    }, "请输入图片验证码", "发 送");
                    captcha = T.Captcha({
                        cont: "#" + opts.popupId
                    }, {
                        success: function(verify_code){
                            _this.sendCode(verify_code);
                        }
                    });
                });
            },
            /**
             * 发送手机验证码
             */
            sendCode: function(verify_code){
                var _this = this,
                    opts = _this.options,
                    callbacks = _this.callbacks,
                    account = $.trim(T.toDBC(opts.username||_this.$account.val()));
                if(verify_code && account){
                    var step = opts.interval;
                    _this.$trigger.addClass("dis").text(opts.sendText + "（" + step + "）");
                    _this.timer = setInterval(function () {
                        if(step > 1){
                            step--;
                            _this.$trigger.text(opts.sendText + "（" + step + "）");
                        }else{
                            _this.reset();
                        }
                    }, 1000);
                    if(_this.popup && _this.popup.remove){
                        _this.popup.remove();
                        _this.popup = null;
                    }
                    setTimeout(function(){
                        _this.reset();
                    }, opts.interval * 1000);
                    T.POST({
                        action: "in_user/create_code",
                        params: {
                            username: account,
                            source: String(opts.source),
                            ticket: verify_code
                        },
                        success: function (data, params) {
                            opts.successTip && T.msg(opts.successTip);
                            //发送验证码成功，继续业务处理
                            callbacks.success && callbacks.success.call(_this, verify_code);
                        },
                        failure: function (data, params) {
                            _this.reset();
                            T.msg(data.msg||"发送失败，请重新发送！");
                        }
                    });
                }else if(!account){
                    T.msg("请先填写手机号")
                }else if(!verify_code){
                    T.msg("请先填写图片验证码")
                }
            },
            /**
             * 重置按钮
             */
            reset: function(){
                var _this = this,
                    opts = _this.options;
                if(_this.timer){
                    clearInterval(_this.timer);
                    _this.timer = null;
                }
                _this.$trigger.removeClass("dis").text(opts.text);
            }
        };
        T.CaptchaToPhone = function(options, callbacks){
            return new CaptchaToPhone(options, callbacks);
        };
    }(T));
    //扩展到jQuery上
    $.fn.setOptions = function(options) {
        return T.SetSelectOptions($(this)[0], options);
    };
    $.fn.getChecked = function(name,isRadio, hasDisabled) {
        return T.GetChecked($(this)[0], name, isRadio, hasDisabled);
    };
    $.fn.checkboxs = function(name,nameall,callback) {
        return this.each(function() {
            $(this).data("checkboxs", T.Checkboxs($(this)[0], name,nameall,callback));
        });
    };
    /**
     * 确认框
     */
    T.cfm = window.confirm = function (obj, okFn, noFn, title, ok, no) {
        var text = obj, title = title || '确 认', ok = ok || '确 定', no = no || '取 消';
        if (T.Typeof(obj, /Object/)) {
            text = obj.text || '';
            title = obj.title || title;
            ok = obj.ok || ok;
            no = obj.no || no;
        }
        return T.Popup({
            fixed: true, id: 'popup_confirm', zIndex: 1800, title: title, width: 480, content: '<dl class="popbox vertical_middle"><dt class="vm_left"></dt><dd class="vm_right">' + text + '</dd></dl>', ok: ok, no: no, okFn: okFn || function (_o) {
                _o.remove();
            }, noFn: noFn
        });
    };
    /**
     * 消息提示框
     */
    T.msg = function(text,isDone){
        var dom = document.getElementById('msg_tip');
        if(dom)dom.parentNode.removeChild(dom);
        if(isDone)return;
        dom = document.body.appendChild(document.createElement('div'));
        dom.id = 'msg_tip';
        dom.className = 'msg_tip';
        dom.innerHTML = '<dl><dt></dt><dd>'+text+'</dd></dl>';
        var w = $(window).width();
        var h = $(window).height();
        dom.style.top = (h-dom.offsetHeight)/2+'px';
        dom.style.left = (w-dom.offsetWidth)/2+'px';
        setTimeout(function(){
            //dom.parentNode.removeChild(dom);
            $(dom).animate({opacity:0},300,function(){
                $(dom).remove();
            });
        },1200);
    };
    T.loading = function(isDone, duration, text){
        function _setProgress(step){
            var node = document.getElementById('loading_shading_progress');
            if(node&&step){
                step--;
                node.style.width = (100-step)+'%';
                if(step>2){
                    setTimeout(function(){
                        _setProgress(step);
                    }, duration/100);
                }
            }
        }
        var dom = document.getElementById('loading_shading');
        if(dom){
            if(typeof(duration)=='number'){
                _setProgress(1);
                setTimeout(function(){
                    dom.parentNode.removeChild(dom);
                }, 300);
            }else{
                dom.parentNode.removeChild(dom);
            }
        }
        if(isDone)return;
        dom = document.body.appendChild(document.createElement('dl'));
        dom.id = 'loading_shading';
        dom.className = 'loading_shading';
        //进度条
        if(typeof(duration)=='number'){
            dom.innerHTML = '<dt></dt><dd class="load_progress"><table cellpadding="0" cellspacing="0"><tr><td><div class="progress_box"><p class="text">'+(text||'')+'</p><div class="progress"><div id="loading_shading_progress"></div></div></div></td></tr></table></dd>';
            _setProgress(100);
        }else{
            dom.innerHTML = '<dt></dt><dd></dd>';
        }
    };
    T.contains = function(root, el){//如果A元素包含B元素，则返回true，否则false
        if(!root||!el||root.nodeType!==1||el.nodeType!==1){
            return false;
        }else if(root.compareDocumentPosition){
            return root===el||!!(root.compareDocumentPosition(el)&16);
        }else if(root.contains){
            return root.contains(el);//&&root!==el;
        }else{
            while(el=el.parentNode){
                if(el===root){
                    return true;
                }else{
                    return false;
                }
            }
        }
    };
    /**
     * @鼠标飘过提示框
     * @method TIP
     * @param {Object} [options] 必选，数据
     * @param {Boolean} [isRemove] 可选，默认为false；false：移除，true：隐藏
     * Return {Object} 鼠标飘过提示框
     */
    T.TIP = function(options, isRemove){
        function TIP(){
            var _this = this;
            /*
             * options.container：容器
             * options.content：内容
             * options.trigger：触发DOM对象
             * options.offsetX：X轴偏移
             * options.offsetY：Y轴偏移
             */
            if(!options.container||!options.content||!options.trigger)return;
            options['max-width'] = options['max-width']||'';
            options.width = options.width||'';
            if(/^\d+$/.test(options['max-width'])){
                options['max-width']+='px';
            }
            if(/^\d+$/.test(options.width)){
                options.width+='px';
            }
            options.offsetX = parseInt(options.offsetX,10)||0;
            options.offsetY = parseInt(options.offsetY,10)||0;
            _this.options = options||{};
            _this.container = options.dom||document.body||document.documentElement;//容器
            _this.trigger = null;
            _this.load = function(){
                var dom = document.getElementById(options.id);
                if(dom){
                    dom.parentNode.removeChild(dom);
                }
                var text = typeof(_this.options.content)=='function'?_this.options.content(_this.trigger)||"":_this.options.content;
                if(!text)return;
                _this.dom = document.createElement('div');
                if(options.id)_this.dom.id = options.id;
                _this.dom.className = 'tips '+(_this.options.style||'');
                if(options['max-width']!==''){
                    _this.dom.style['max-width'] = _this.options['max-width'];
                }
                if(options.width!==''){
                    _this.dom.style.width = _this.options.width;
                }
                _this.container.appendChild(_this.dom);
                _this.dom.innerHTML = text;
                if(_this.options.callback){
                    _this.options.callback.call(_this, _this);
                }
                _this.setPosition();
            };
            _this.setPosition = function(){
                if(_this.dom&&_this.trigger){
                    var offset = T.offset(_this.trigger);
                    var domWH = T.GetSize(_this.dom);
                    var tgrWH = T.GetSize(_this.trigger);
                    var _offset = $(_this.container).offset()||{top:0, left:0};
                    //_this.dom.style.top = (offset.top+(tgrWH.h-domWH.h)/2)+'px';
                    //_this.dom.style.left = (offset.left+(tgrWH.w-domWH.w)/2)+'px';
                    var _left = 0, _top = 0;
                    if($(options.dom).length){
                        _left = $(document).scrollLeft();
                        _top = $(document).scrollTop();
                    }
                    _this.dom.style.top = (offset.top+tgrWH.h+_this.options.offsetY-_offset.top+_top)+'px';
                    var _x = parseInt(T.attr(_this.trigger, "x"), 10)||0 - _offset.left+_left;
                    if(_this.options.left){
                        _this.dom.style.left = (offset.left+_x+_this.options.offsetX)+'px';
                    }else{
                        _this.dom.style.left = (offset.left+_x+tgrWH.w-domWH.w+_this.options.offsetX)+'px';
                    }
                    $(_this.dom).bind("mouseenter", _this.mouseenter).bind("mouseleave", _this.mouseleave);
                }
            };
            _this.show = function(){
                if(_this.dom){
                    _this.dom.style.display = 'block';
                }
            };
            _this.hide = function(){
                if(_this.dom){
                    _this.dom.style.display = 'none';
                }
            };
            _this.remove = function(){
                if(_this.dom&&_this.dom.parentNode){
                    _this.dom.parentNode.removeChild(_this.dom);
                    _this.dom = null;
                }
            };
            _this.mouseenter = function(e){
                if(!_this.contains(e.fromElement||e.currentTarget)){
                    _this.load();
                }
            };
            _this.mouseleave = function(e){
                if(!_this.contains(e.toElement||e.relatedTarget)){
                    _this.remove();
                    _this.trigger = null;
                }
            };
            _this.contains = function(toElement){
                if(T.contains(_this.dom, toElement)||T.contains(_this.trigger, toElement)){
                    return true;
                }
                return false;
            };
            $(options.container).delegate(options.trigger, "mouseenter", function(e){
                _this.trigger = $(this).get(0);
                _this.mouseenter(e);
            }).delegate(options.trigger, "mouseleave", function(e){
                _this.trigger = $(this).get(0);
                _this.mouseleave(e);
            });
        }
        return new TIP();
    };

    /**
     * 设置计数器
     * @param $dom 父容器
     * @param options 配置项
     * @param callback 值改变回调
     */
    T.setCounter = function($dom, options, callback){
        options = options||{min:1, max:1000};
        options.step = options.step||1;
        $dom.delegate(".counter a, .counter b", "selectstart.counter", function() {
            return false;
        }).delegate(".counter a", "click.counter", function(e) { //减数量
            var $minus = $(this);
            var $input = $minus.siblings("input");
            var val = parseInt($input.val(), 10);
            if (val > options.min) {
                val-=options.step;
                val = Math.max(val, options.min);
                $input.val(val);
            }
            if(callback)callback($input, val);
            return false;
        }).delegate(".counter b", "click.counter", function(e) { //加数量
            var $plus = $(this);
            var $input = $plus.siblings("input");
            var val = parseInt($input.val(), 10);
            if (val < options.max) {
                val+=options.step;
                val = Math.min(val, options.max);
                $input.val(val);
            }
            if(callback)callback($input, val);
            return false;
        }).delegate(".counter input", "blur.counter", function(e) { //输入数字
            var $input = $(this);
            var val = $input.val();
            if (isNaN(val)) {
                val = 1;
            }
            val = parseInt(val, 10) || 1;
            if (val > options.max) {
                val = options.max;
            }
            if (val < 1) {
                val = 1;
            }
            val = Math.max(val, options.min);
            val = Math.min(val, options.max);
            $input.val(val);
            if(callback)callback($input, val);
            return false;
        }).delegate(".counter input", "keydown.counter", function(e) {
            var $input = $(this);
            if ($.trim($input.val()) && e.keyCode == 13) {
                e.preventDefault();
                e.stopPropagation();
                $input.blur();
            }
        }).delegate(".counter input", "keyup.counter afterpaste.counter", function (e) {
            var $input = $(this);
            $input.val($input.val().replace(/\D\./g, ''));
        }).delegate(".counter input", "focus.counter", function (e) {
            $(this).trigger("blur.counter");
        });
    };
    T.Paginbar = function(pagin){//分页条
        pagin = pagin||{};
        pagin.index = parseInt(pagin.index,10)||1;//当前页
        pagin.total = parseInt(pagin.total,10)||1;//总页数
        pagin.size = parseInt(pagin.size,10)||15;//每页记录数
        pagin.num = parseInt(pagin.num,10)||3;
        if(pagin.index>pagin.total)pagin.index = 1;
        if(!pagin.paginbar)return;
        pagin.paginbar = document.getElementById(pagin.paginbar);
        if(!pagin.paginbar)return;
        $(pagin.paginbar).addClass('hide');
        pagin.paginbar.innerHTML = '';
        if(pagin.total<2)return;
        $(pagin.paginbar).removeClass('hide');
        function createPageLabel(tag,cla,tit,txt,callback){
            var obj = document.createElement(tag);
            obj.className = cla;
            obj.title = tit;
            if(tag==='input'){
                obj.value = txt;
            }else{
                obj.innerHTML = txt;
            }
            if(tag==='a')obj.href = '#';
            pagin.paginbar.appendChild(obj);
            if(callback){
                obj.onclick = function(o,i,s,t){
                    return function(e){
                        callback(o,i,s,t);
                    };
                }(obj,tit,pagin.size,pagin.total);
            }
            return obj;
        }
        var pages = [];
        if(pagin.index>1){
            createPageLabel('a','start',1,'<i class="fa fa-angle-double-left"></i>',pagin.callback);
            createPageLabel('a','prev',pagin.index-1,'<i class="fa fa-angle-left"></i>',pagin.callback);
        }
        if(pagin.total<=2*pagin.num+4){//小于2*pagin.num页
            for(var index = 1; index<=pagin.total; index++){
                if(index==pagin.index)createPageLabel('b','dis',index,index);
                else createPageLabel('a','',index,index,pagin.callback);
            }
        }else{//大于2*pagin.num页
            var total = Math.min(pagin.index+pagin.num,pagin.total);
            var index = Math.max(pagin.index-pagin.num,1);
            /*
             * 如果当前页靠近首页，则省略中间页码
             * 如果当前页靠近尾页，则省略中间页码
             * 如果当前页在中间，则省略两端页码
             */
            var _left = pagin.index<index+pagin.num;
            var _right = pagin.index>total-pagin.num;
            var center = (pagin.index>=index+pagin.num)&&(pagin.index<=total-pagin.num);
            console.log('center',center,pagin.num,pagin.index,index,total)
            if(center){
                if(index>1)createPageLabel('a','ellipsis',index,'...',pagin.callback);
                for(index; index<=total; index++){
                    if(index==pagin.index)createPageLabel('b','dis',index,index);
                    else createPageLabel('a','',index,index,pagin.callback);
                };
                if(total<pagin.total)createPageLabel('a','ellipsis',index,'...',pagin.callback);
            }else{
                if(_left)total = Math.min(index+2*pagin.num,pagin.total);
                if(_right)index = Math.max(total-2*pagin.num,1);
                var num = index;
                console.log(index,total);
                if(_right&&total>2*pagin.num)createPageLabel('a','ellipsis',index,'...',pagin.callback);
                for(index; index<=total; index++){
                    if(index==pagin.index)createPageLabel('b','dis',index,index);
                    else createPageLabel('a','',index,index,pagin.callback);
                }
                if(_left)createPageLabel('a','ellipsis',index,'...',pagin.callback);
            }
        }
        if(pagin.index<pagin.total){
            createPageLabel('a','next',pagin.index+1,'<i class="fa fa-angle-right"></i>',pagin.callback);
            createPageLabel('a','end',pagin.total,'<i class="fa fa-angle-double-right"></i>',pagin.callback);
        }
        if(pagin.total>2*pagin.num+4){//小于2*pagin.num页
            //createPageLabel('span','txt','','到第');
            var input = createPageLabel('input','form-control go','','1');
            input.onblur = function(){
                var val = parseInt(input.value.Trim(),10)||1;
                if(val<1)val = 1;
                if(val>pagin.total)val = pagin.total;
                input.value = val;
            };
            //createPageLabel('span','txt','','页');
            createPageLabel('a','btn','确定','<i class="fa fa-arrow-circle-o-right"></i>',function(){
                if(pagin.callback)pagin.callback(input,input.value,pagin.size,pagin.total)
            });
        }
    };
    //获取用户登录信息
    T.hasLogin = function(){
        T._SID = T.Cookie.get("sid")||""; //登录标识
        T._TYPE = T.Cookie.get("_user_type")||''; //账户类型
        T._ACCOUNT = T.Cookie.get("_d_account")||""; //账号
        T._NICKNAME = T.Cookie.get("_d_nickname")||T._ACCOUNT; //昵称
        T._LOGED = T._SID && T._TYPE == 3; //用户是否登录
        return T._LOGED;
    };
    T.hasLogin();
    /*
     * 未登录跳转到登录页
     */
    T.noLogin = function(){
        T.Cookie.set('sid', "", { expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
        T.Cookie.set('_user_type', "", { expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
        location.replace(T.DOMAIN.WWW+"?redirect_uri="+encodeURIComponent(location.href));
    };
    T.REQUESTS = T.GetRequest();
    window.T = T;
}(window, document));