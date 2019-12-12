define("utils", ["utils/base", "libs/md5", "libs/base64", "utils/mediator", "utils/transfer", "utils/format", "utils/date", "utils/array", "utils/number", "utils/json", "utils/cookie", "utils/dom", "utils/drag", "utils/popover", "utils/compiler", "utils/storage", "utils/params", "jquery/qrcode"], function(Base){
   var args = Base._SLICE.call(arguments, 1),
        Utils = Base.extend(Base, {
            MD5: args.shift(),
            Base64: args.shift(),
            Mediator: args.shift(),
            Transfer: args.shift(),
            Format: args.shift(),
            Date: args.shift(),
            Array: args.shift(),
            Number: args.shift(),
            JSON: args.shift(),
            Cookie: args.shift(),
            DOM: args.shift(),
            Drag: args.shift(),
            Popover:  args.shift(),
            Compiler: args.shift(),
            Storage: args.shift(),
            Params: args.shift()
        });
    Utils.Base64.raw = false;
    Utils.Base64.utf8decode = true;
    Utils.toDBC = Utils.Transfer.toDBC;
    Utils.toSBC = Utils.Transfer.toSBC;
    /**
     * 获取URL中“?”之后的指定参数
     * @method getQueryString
     * @param {String} [name] 必选，指定参数的KEY
     * @returns {String} 指定的参数值
     */
    Utils.getQueryString = function(name){
        return Utils.Transfer.decodeHashString(location.search.replace(/^\?+/, ""))[name];
    };
    /**
     * 获取URL中“?”之后的所有参数
     * @method getRequest
     * @param {String} [str] 可选，Hash对象，location.search 或 location.hash
     * @param {String} [sign=&] 可选，默认“&”，键值对分隔符
     * @param {String} [flag==] 可选，默认“=”，键值分隔符
     * @returns {Object} 所有参数
     */
    Utils.getRequest = function(str, sign, flag){
        str = (str||location.search).replace(/^\?|\#+/, ""); //获取url中'?'符后的字符串
        return Utils.Transfer.decodeHashString(str, sign, flag);
    };
    /**
     * 提示框
     */
    Utils.alt = window.alert = function(text, okFn, noFn, ok){
        if(!noFn)noFn = okFn;
        var popover = new Utils.Popover({
            fixed: true,
            id: 'popup_alert',
            zIndex : 2000,
            width: 480,
            modal: true,
            title : '温馨提示',
            content : '<dl class="popbox vertical_middle"><dt class="vm_left"></dt><dd class="vm_right">'+text+'</dd></dl>',
            ok : ok||(ok===''?'':'确  定')
        });
        popover.on("ok", okFn||function(_this){
            _this.remove();
        });
        popover.on("no", noFn);
        return popover;
    };
    /**
     * 成功框
     */
    Utils.suc = function(obj, okFn, noFn,closeFn){
        var text = obj, title = '确 认', ok = '确 定', no = '取 消';
        if(Utils.type(obj)==='Object'){
            text = obj.text||'';
            title = obj.title||title;
            ok = obj.ok||ok;
            no = obj.no||no;
        }
        var popover = new Utils.Popover({
            fixed: true,
            id: 'popup_success',
            zIndex : 1800,
            title : title,
            width: 480,
            content : '<dl class="popbox vertical_middle suc"><dt class="vm_left "></dt><dd class="vm_right">'+text+'</dd></dl>',
            ok : ok,
            no : no
        });
        popover.on("ok", okFn);
        popover.on("no", noFn);
        popover.on("close", closeFn||noFn);
        return popover;
    };
    /**
     * 确认框
     */
    Utils.cfm = window.confirm = function(obj, okFn, noFn,title,ok,no){
        var text = obj, title = title||'确 认', ok = ok||'确 定', no = no||'取 消';
        if(Utils.type(obj)==='Object'){
            text = obj.text||'';
            title = obj.title||title;
            ok = obj.ok||ok;
            no = obj.no||no;
        }
        var popover = new Utils.Popover({
            fixed: true,
            id: 'popup_confirm',
            zIndex : 1800,
            title : title,
            width: 480,
            content : '<dl class="popbox vertical_middle"><dt class="vm_left"></dt><dd class="vm_right">'+text+'</dd></dl>',
            ok : ok,
            no : no
        });
        popover.on("ok", okFn||function(_this){
            _this.remove();
        });
        popover.on("no", noFn);
        return popover;
    };
    /**
     * 对话框
     */
    Utils.dailog = function(obj,title,okFn,noFn,id){
        var popover = new Utils.Popover({
            fixed: true,
            id: id,
            zIndex : 1000,
            title : title,
            type: 'object',
            content : obj
        });
        popover.on("ok", okFn||function(_this){
            _this.remove();
        });
        popover.on("no", noFn);
        return popover;
    };
    /**
     * 对话框
     */
    Utils.LookImages = function(obj, id, width, setSize){
        var popover = new Utils.Popover({
            fixed: true,
            style: 'popup_images',
            id: id,
            zIndex : 1200,
            title : '',
            type: typeof(obj)=='string'?'html':'object',
            width: width||750,
            content : obj,
            otherClose: true,
            setSize: setSize||null
        });
        popover.on("setSize", setSize||null);
        return popover;
    };
    return Utils;
});