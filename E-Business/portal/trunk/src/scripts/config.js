/**
 * Created by Woo on 2015/7/29.
 */
//window.onerror = function (e) { return true; };
if(typeof(console) === 'undefined'){
    console = {};
    console.log = function(){};
}
var tool = location.href.indexOf("_tpl.")>0?"tool_tpl":"tool";
window.getQueryString = function(name){
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    return (r!= null)?decodeURI(r[2]):'';
};
//console.log = function(){return true;};
requirejs.config({
    // 调试模式
    debug: true,
    // 文件版本
    urlArgs: "ininin=<?=VERSION?>",//"v=1.0.0",//+config.VERSION,
    // Sea.js 的基础路径
    baseUrl: "/scripts/",//config.DOMAIN.SCRIPTS,
    // 模块配置
    paths: {
        "tools": tool,
        "jquery": "libs/jquery-1.7.2",
        "jquery/qrcode": "libs/jquery.qrcode.min",
        "qrcode": "libs/qrcode.min",
        "uploadify": "libs/jquery.uploadify.min",
        "autocomplete": "libs/jquery.autocomplete",
        "datetimepicker": "libs/jquery.datetimepicker.full",
        "plugins": "libs/plugins",
        "location": "location",
        "sinajs": "http://tjs.sjs.sinajs.cn/open/api/js/wb.js?appkey=2422438855"
    },
    //配置别名
    map: {
        "*": {
            "base": "jquery"
        }
    },
    /*//注入配置信息
     config: {
     "tool": {
     config: config
     }
     },*/
    //配置非AMD模块
    shim: {
        /*"uploadify": {
         exports: "wx"
         },*/
        "autocomplete": {
            deps: ["base"]
        },
        "qrcode": {
            exports: "QRCode"
        },
        "jquery/qrcode": {
            deps: ["base", "qrcode"]
        },
        "location": {
            deps: ["base"]
        },
        "uploadify": {
            deps: ["base"]
        },
        "bmap": {
            exports: "BMap"
        },
        "sinajs": {
            exports: "WB2"
        }
    },
    // 文件类型
    scriptType: "text/javascript",
    // 超时时间，默认7秒。
    waitSeconds: 30
});