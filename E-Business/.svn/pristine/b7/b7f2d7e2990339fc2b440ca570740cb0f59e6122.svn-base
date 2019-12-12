/**<?php require_once($_SERVER['DOCUMENT_ROOT'].'/global.php');?>
 * Created by Woo on 2015/7/29.*/

window.onerror = function (e) { return true; };
if(typeof(console) === 'undefined'){
    console = {};
    console.log = function(){};
}
!(function(o){
    o.log("我们是一群互联网信徒，\n我们是一群科技痴狂人，\n我们是一群生活热爱者，\n我们相信，互联网将改变世界，\n我们相信，科技让生活更美好，\n我们相信，天道酬勤使命必达。\n");
    o.log("请将简历发送至：%cjoin@ininin.com（ 邮件标题请以“姓名-应聘XX职位-来自console”命名）", "color:#f00");
    o.log("职位介绍：http://www.ininin.com/about/job.html");
}(console));
console.log = function(){return true;};
//var tool = location.href.indexOf("_tpl.")>0?"tool_tpl":"tool";
window.getQueryString = function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    return (r != null) ? decodeURI(r[2]) : '';
};
var _czc = _czc || [];
_czc.push(["_setAccount", "1253317095"]);
requirejs.config({
    // 调试模式
    debug: false,
    // 文件版本
    urlArgs: "ininin=<?=VERSION?>",//"v=1.0.0",//+config.VERSION,
    // Sea.js 的基础路径
    baseUrl: "<?=DOMAIN?>scripts/",//config.DOMAIN.SCRIPTS,
    // 模块配置
    paths: {
        //"tools": "tools",
        "jquery": "libs/jquery-1.7.2",
        "jquery/qrcode": "libs/jquery.qrcode.min",
        "qrcode": "libs/qrcode.min",
        "jcrop": "libs/jcrop.min",
        "plupload": "uploader/plupload.full.min",
        "qiniu/sdk": "uploader/qiniu-sdk",
        "datetimepicker": "libs/jquery.datetimepicker.full",
        "plugins": "libs/plugins",
        //"location": "location",
        "uploader": "uploader/main",
        "design/params": "<?=DOMAIN_DESIGN?>scripts/category/params",
        "design/price": "<?=DOMAIN_DESIGN?>scripts/category/price",
        "package/price": "<?=DOMAIN_DESIGN?>scripts/category/package_price",
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
        "qrcode": {
            exports: "QRCode"
        },
        "jquery/qrcode": {
            deps: ["base", "qrcode"]
        },
        "jcrop": {
            deps: ["base"]
        },
        "plupload": {
            deps: ["base"]
        },
        "qiniu/sdk": {
            deps: ["base", "plupload"]
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
define("tools", ["base", "utils", "widgets/slider", "zh_cn"], function ($, Utils, Slider) {
    var T = Utils || {};
    Utils._HOSTNAME = "<?=DOMAIN?>";
    T.Slider = Slider;
    T.VIP_LEVEL = {
        1: "设计基础会员",
        2: "设计尊贵会员"/*,
        3: "设计修改会员"*/
    };
    // JavaScript Document
    //window.onerror = function (e) { return true; }
    if (typeof console === 'undefined') {
        console = {};
        console.log = function () {
        }
    }
    //console.log = function(){return true;}
    /*if(typeof JSON==='undefined')JSON = {};
     if(typeof JSON.parse==='undefined'){
     JSON.parse = function(str){
     return (new Function('return '+str))();
     }
     }*/
    String.prototype.Trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, '');
    };
    Date.prototype.Format = function (fmt) {
        return Utils.Date.format(this, fmt);
    };

    //通用接口
    window.COM_API = {
        advert: 'in_product_new/advertisement/all_ad_content'//广告信息
        , cart_num: 'in_order/cart_num_query'//获取购物车商品数量
        , order_mun: 'in_order/order_num_query'//获取订单数量
        , get_token: 'in_token/get_token'//获取七牛上传凭证
        , sendcode: 'in_user/create_code'//发送手机验证码
        , loginout: 'in_user/loginout'//退出登录
    };
    window.CFG_DS = {//数据源配置
        sendcode: {action: 'in_user/create_code', source: 3},
        bind: {action: 'in_user/link_insert'},
        index: {//首页
            get: {act: "getProductCategoryList", mod: "ProductPortal", categoryCode: "01"} //初始化数据
        },
        product: {
            /*get_category: 'in_product_new/query_category',*/
            get_price: "in_quotation/get_price",
            get_category_multi: 'in_product_new/query_category_multi'/*,
             get_product: 'in_product/query_design_service_all'*/
        },
        design: {
            get_category: 'in_product/query_design_category_all',
            get_service: 'in_product/query_design_service_all'
        },
        address: {//收货地址
            get: 'in_user/address_query',
            adr_add: 'in_user/address_insert', //添加地址
            adr_def: 'in_user/set_default_address', //设为默认
            adr_upd: 'in_user/address_update', //添加、修改地址
            adr_del: 'in_user/address_delete' //删除地址
        },
        invoice: {//发票
            get: 'in_invoice/invoice_query',
            inv_add: 'in_invoice/invoice_insert',
            inv_upd: 'in_invoice/invoice_update',
            inv_del: 'in_invoice/invoice_delete'
        },
        ucenter: {//账户中心
            get: {act: "getRecentOrderList", mod: "MemberFGInfo", page: 1, size: 5} //初始化数据
        },
        udetail: {//账户信息
            get: 'in_user/user_query',
            come_address: 'in_user/come_address_query',//门店地址
            credit: 'in_order/used_amount_query'//月结已使用额度
        },
        order: {//确认订单
            delivery: 'in_product/query_delivery_by_state_all',//配送方式//'in_product/query_delivery_all'
            //freight: 'in_product/query_delivery_all',//获取运费
            smt: 'in_order/order_create'//提交订单
        },
        mycart: {//购物车
            get: 'in_order/cart_query', //type(0:默认,1:获取购物车数量,2:结算时候查询)
            del: 'in_order/cart_delete', //删除当前商品
            chk: 'in_order/cart_status' //删除当前商品
        },
        myorder: {//我的订单
            get: 'in_order/order_query', //获取订单列表
            det: 'in_order/order_query',//订单详情
            cel: 'in_order/order_update', //取消订单
            upload: 'in_order/order_product_update',//上传印刷文件
            get_draft: 'in_order/query_manuscript',//设计稿件查询
            upd_draft: 'in_order/update_manuscript'//修改设计稿件
        },
        distorder: {
            get: 'in_order/dist_order_query',//分发记录查询
            cel: 'in_order/dist_order_cancel'//分发记录取消
        },
        myintegral: {//账户积分
            get: 'in_order/in_coin_query'
        },
        mywallet: {//账户余额
            get: 'in_order/user_wallet_query'
        },
        myfile: {//我的文件
            get: 'in_user/file_query',
            del: 'in_order/check_file_by_fileurl',//删除文件
            upload: 'in_user/file_upload',//上传文件
            checkFileSize: 'in_user/check_design_file'//检查云盘空间大小
        },
        mydesignfile: {//我的设计文件
            get: 'in_user/find_file_design'
        },
        template: {
            get: 'in_order/query_design_template'
        },
        card: {
            get: 'in_user/card_query'//查询名片
        },
        mycoupon: {//我的优惠券
            get: 'in_order/coupon_query',
            get_new: 'in_order/coupon_query_for_web'
        },
        message: {//消息中心(系统消息)
            get: 'in_message/get_message'
        },
        search: {
            find_key_word: 'in_product_new/search/find_key_word', //查询搜索栏推荐关键字
            product_search: 'in_search_center/product/search' //产品搜索
        }
    };
    //数据源配置
    window.CFG_DB = window.CFG_DB || {};
    CFG_DB.FCFID = 2; //配送方式=>上门自提ID（Fixed come from id）
    CFG_DB.FNDID = 17;//配送方式=>普通快递ID（Fixed Normal delivery id）
    CFG_DB.FESID = 18;//配送方式=>加急服务ID（Fixed expedited service id）
    CFG_DB.FDDID = 20;//配送方式=>多地分发ID（Fixed different distribute id）
    CFG_DB.FHDID = 16;//22;//配送方式=>专车配送ID（Fixed home delivery id）
    //CFG_DB.PMPID = 30;//印刷产品=>名片分类ID
    CFG_DB.PMPID = '|30|39|40|41|42|141|142|';//印刷产品=>名片分类ID
    CFG_DB.PMYID = 35;//印刷产品=>按需定制ID（Made for You）
    CFG_DB.DEF_PCD = "广东省^深圳市^南山区"; //默认配送区域
    CFG_DB.WCMDSID = 74; //工牌修改设计服务ID（Work card modify design service id）
    CFG_DB.NEWDSID = "|9|14|15|23|25|26|27|29|31|32|34|36|38|41|";// 新设计服务ID
    //只支持专车配送的产品
    CFG_DB.HD_PRO = {
        200036: 1
    };
    //安装服务 Install Service Product
    CFG_DB.ISP = {
        1001: 1,
        1002: 1,
        1003: 1
    };
    //左侧菜单及首页分类
    CFG_DB.PCFG = {
        //HOME: '1,2,28,29,33,36'
        //VNAV: '1,2,28,29,33,36'
        HOME: '30,28,29,33,36,37,35'//'30,29,36,31,33,28,34,35'
        , VNAV: '30,28,29,33,36,37,35'//'30,29,36,31,33,28,34,35'
        , TYPE: '30,28,29,33,36,37,35'//'30,29,36,31,33,28,34'
        , NOT_WEIGHT: '_98_101_102_103_104_'
        , NOT_DELIVERY_DAY: '_98_'
    };
    //左侧导航推荐产品
    CFG_DB.CYBER = {//1:新,2:省,3:荐,4:优
        '124': 1,
        '125': 1,
        '126': 1,
        '127': 1,
        '128': 1,
        '130': 1,
        '131': 1,
        '50': 2,
        '54': 2,
        '101': 2,
        '102': 2,
        '103': 2,
        '104': 2,
        '61': 3,
        '64': 3,
        '65': 3,
        '66': 3,
        '98': 3,
        '111': 3,
        '121': 3,
        '113': 3,
        '200021': 3,
        '200022': 3,
        '200030': 3,
        '200031': 3,
        '200032': 3,
        '200033': 3,
        '200053': 3,
        '200054': 3,
        '200061': 3,
        '200062': 3,
        '200063': 3,
        '60': 4
    };
    //全部商品页推荐产品
    CFG_DB.MARKS = {//1:热销,2:出货快,3:推荐,4:实惠,5:新品
        '61': [1],
        '54': [1],
        '57': [1],
        '200021': [1],
        '200022': [1],
        '200030': [1],
        '200031': [1],
        '200032': [1],
        '200033': [1],
        '200053': [1],
        '200054': [1],
        '50': [2],
        '55': [2],
        '60': [3],
        '64': [3],
        '66': [3],
        '200061': [3],
        '200062': [3],
        '200063': [3],
        '108': [4],
        '109': [4],
        '113': [4],
        '104': [5],
        '111': [5],
        '122': [5],
        '124': [5],
        '125': [5],
        '126': [5],
        '127': [5],
        '128': [5],
        '130': [5],
        '131': [5]
    };
    //账户充值
    CFG_DB.PACKAGE = {
        MARKS: {//1:热销,2:出货快,3:推荐,4:实惠,5:新品
            '2': [1],
            '6': [4]
        }
    };
    //设计服务
    CFG_DB.DESIGN = {
        ATTACH: '11'
        , MODIFY: '12'
        , LOGO: '11'
        , ZHEYE: '25'
        , MINGPIAN: '9'
    };
    //广告区域配置
    CFG_DB.ADVERT = {
        bhp1: {},//顶部通知
        bhp2: {width: 740, height: 408}, //首页banner
        bhp3: {width: 240, height: 124}, //首页banner右侧
        bhp4: {width: 240, height: 130}, //首页云印推荐
        bhp5: {width: 1220, height: 80}, //首页中部广告
        print: {width: 1920, height: 408}, //印刷产品页大banner
        print1: {width: 1920, height: 408}, //喷绘专区页大banner
        print2: {width: 1920, height: 408}, //数码快印页大banner
        superior: {width: 1920, height: 408}, //云印优品页大banner
        scene: {width: 1920, height: 408}, //场景解决方案页大banner
        login: {width: 1920, height: 600}, //登录页面banner
        design: {width: 1920, height: 408}, //设计频道banner
        designer: {width: 1920, height: 408}, //设计师首页banner
        art1: {width: 1920, height: 408}, //设计说大banner
        art2: {width: 290, height: 168} //设计说右侧广告
    };
    window.CFG_FORM = window.CFG_FORM || {};//表单验证配置
    CFG_FORM.login = {
        action: 'in_user/login',
        items: {
            username: {
                rule: 'mobile_email',
                tips: {
                    empty: '请填写手机/邮箱',
                    minlength: '请填写有效的账户名',
                    maxlength: '请填写有效的账户名',
                    mismatch: '账户名格式错误',
                    error: '账户名格式错误'
                },
                minlength: 5,
                maxlength: 100,
                required: true
            },
            password: {
                rule: 'pwd',
                tips: {
                    empty: '请填写密码',
                    mismatch: '密码不能包含空格',
                    minlength: '请填写不少于6位密码',
                    maxlength: '请填写不超过20位密码',
                    error: '密码格式有误'
                },
                required: true,
                minlength: 6,
                maxlength: 16
            },
            code: {
                rule: 'code',
                tips: {
                    empty: '请填写验证码',
                    mismatch: '请填写有效的验证码',
                    error: '验证码格式错误'
                },
                from: 'username',
                required: true
            },
            remember: {
                rule: 'nonempty',
                tips: {
                    empty: '',
                    error: ''
                },
                pattern: /\S/
            }
        }
    };

    var FIXS = ["@qq.com", "@163.com", "@126.com", "@sina.com", "@gmail.com", "@sina.cn", "@139.com", "@189.cn", "@wo.com.cn", "@2008.sina.com", "@51uc.com", "@vip.sina.com", "@3g.sina.cn", "@foxmail.com", "@vip.qq.com", "@yeah.net", "@vip.163.com", "@yahoo.com", "@sohu.com", "@56.com", "@yahoo.com.cn", "@msn.com", "@hotmail.com", "@live.com", "@aol.com", "@ask.com", "@163.net", "@263.net", "@came.net.cn", "@8ycn.net", "@tuziba.net", "@googlemail.com", "@mail.com", "@aim.com", "@inbox.com", "@21cn.com", "@tom.com", "@eyou.com", "@x.cn", "asiainfo.com", "mplus-info.com", "exinfozone.com.cn", "@chinaren.com", "@sogou.com"];
    T.FlashPlayerURL = "http://get.adobe.com/cn/flashplayer/";
    T.DOMAIN = {
        //API: 'http://' +Utils._HOSTNAME + '/api/'
        //ACTION: '<?=DOMAIN_ACTION?>',
        //ACTION: "//alpha.action.ininin.com/", //'<?=DOMAIN_ACTION?>',
        ACTION: "//action.ininin.com/",
        CLOUD: '//cloud.' + Utils._DOMAIN + '/',
        WWW: Utils._HOSTNAME,
        CART: Utils._HOSTNAME + 'cart/',
        FAQ: Utils._HOSTNAME + 'faq/',
        HOT: Utils._HOSTNAME + 'hot/',
        NEW: Utils._HOSTNAME + 'new/',
        HELP: Utils._HOSTNAME + 'help/',
        ABOUT: Utils._HOSTNAME + 'about/',
        ORDER: Utils._HOSTNAME + 'order/',
        MEMBER: Utils._HOSTNAME + 'member/',
        DESIGN: '<?=DOMAIN_DESIGN?>',
        PACKAGE: Utils._HOSTNAME + 'package/',
        PRODUCT: Utils._HOSTNAME + 'product/',
        INKJET: Utils._HOSTNAME + 'inkjet/',
        DIGITAL: Utils._HOSTNAME + 'digital/',
        CATEGORY: Utils._HOSTNAME + 'category/',
        PASSPORT: Utils._HOSTNAME + 'passport/',
        CARD: Utils._HOSTNAME + 'card/',
        YUNFILE: Utils._HOSTNAME + 'yunfile/',
        SOLUTION: Utils._HOSTNAME + 'solution/',
        DESIGN_CATEGORY: '<?=DOMAIN_DESIGN?>category/',
        DESIGN_PRODUCT: '<?=DOMAIN_DESIGN?>product/',
        RESOURCES: Utils._HOSTNAME + 'resources/',
        DESIGN_RESOURCES: '<?=DOMAIN_DESIGN?>resources/',
        SCRIPTS: Utils._HOSTNAME + 'scripts/',
        ICONS: Utils._HOSTNAME + 'resources/icons/',
        DOMAIN: Utils._DOMAIN
    };
    document.domain = T.DOMAIN.DOMAIN;
    T.VERSION = new Date().getTime();
    //计算中
    T.DOING = '&nbsp;<img class="doing_gif" src="' + T.DOMAIN.RESOURCES + 'loading.gif" width="16"/>&nbsp;';
    T._serviceQQ = T._serviceQQLink = "http://crm2.qq.com/page/portalpage/wpa.php?uin=4008601846&aty=1&a=1003&curl=&ty=1";
    //推荐标记
    T.MARKS = {
        m1: {IMG: T.DOMAIN.ICONS + 'm1.png', ALT: '热销'},
        m2: {IMG: T.DOMAIN.ICONS + 'm3.png', ALT: '推荐'},
        m3: {IMG: T.DOMAIN.ICONS + 'm5.png', ALT: '新品'},
        m4: {IMG: T.DOMAIN.ICONS + 'm2.png', ALT: '出货快'},
        m5: {IMG: T.DOMAIN.ICONS + 'm4.png', ALT: '实惠'}
    };
    T.hasPMPID = function (categoryId) {
        return CFG_DB.PMPID.indexOf('|' + categoryId + '|') >= 0;
    };

    T.loadScript = function (uri, callback) {
        if (typeof BMap !== "undefined" && T.Typeof(BMap) === "Object") {
            callback && callback();
        } else {
            var jsoncallback = "_" + T.UUID().toUpperCase(); //产生随机函数名
            var script = document.createElement('script');
            script.defer = 'defer';
            script.async = 'async';
            window[jsoncallback] = function () {//定义被脚本执行的回调函数
                try {
                    callback && callback();
                } catch (e) {
                } finally {//最后删除该函数与script元素
                    if (script && script.parentNode && script.parentNode.removeChild) {
                        script.parentNode.removeChild(script);
                    }
                    setTimeout(function () {
                        window[jsoncallback] = "ininin";
                    }, 100);//加入堆栈
                }
            };
            document.documentElement.appendChild(script);
            script.src = uri + jsoncallback;
        }
    };
    T.loadBMapSDK = function (callback) {
        T.loadScript("http://api.map.baidu.com/api?v=2.0&&ak=VybvSG3RqpGQzp6GwlzNOmiq&callback=", callback);
    };

    /* 提示 */
    T.TIPS = {
        DEF: '系统繁忙，请稍后再试',
        NETWORK: '网络异常，请稍后再试',
        empty: 'Value missing.'//valueMissing
        , type: 'Type mismatch.'//typeMismatch
        , mismatch: 'Pattern mismatch.'//patternMismatch
        , minlength: 'Too short.'//tooShort
        , maxlength: 'Too long.'//tooLong
        , min: 'Too small.'//rangeUnderflow
        , max: 'Too big.'//rangeOverflow
        , step: 'Step mismatch.'//stepMismatch
        , error: 'Custom error.'//customError
        , unique: 'This account is not available.',
        placeholder: ''
    };
    /* 正则表达式 */
    T.RE = {//Regular Expression
        number: /^\d+$/,
        mobile: /^1[3|4|5|6|7|8|9]\d{9}$/,
        tel: /^(\d{3,4}-)\d{7,8}$/,
        email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        mobile_email: /^1[3|4|5|6|7|8|9]\d{9}$|^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        mobile_email_uname: /^1[3|4|5|6|7|8|9]\d{9}$|^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$|^[_a-zA-Z0-9\-]{4,16}$/,
        code: /^[0-9]{6}$/,
        qq: /^[0-9]{5,13}$/,
        pwd: /^\S{6,16}$/,
        uri: /^[a-zA-z]+:\/\/[^\s]*$/,
        url: /^[a-zA-z]+:\/\/[\w-]+\.[\w-]+\.[\w-]+\S*$/,
        date: /^((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31))|(([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)$/,
        time: /sdf/,
        datetime: /asd/,
        uname: /^[a-zA-Z]\w{5,15}$/,
        nonempty: /\S/,
        expedited_zone: /^广东省\^深圳市\^南山区|^广东省\^深圳市\^福田区/, //加急区域
        quantity: /^数量|数量$/, //截取数量
        inviter: /^(\s*|DB\d{4}|B\d{3})$/i,
        //（210×140）A5
        size: /\d+[\d.]*[A-za-z]*\*+\d+[\d.]*[A-za-z]*|\d+[*×]\d+/i //截取尺寸，如：/[\d.]+mm\*[\d.]+mm/i.exec('157g铜版纸_1000_A5(140.6mm*210Mm）-双面四色')
    };
    /* 浏览器内核 */
    T.BC = {//Browser Core(Rendering Engine)
        Trident: ''//IE内核
        , Gecko: ''//Firefox内核
        , Presto: ''//Opera前内核(已废弃)
        , Webkit: ''//Safari内核,Chrome内核原型,开源
        , Blink: ''//Google的最新内核
    };
    T.UA = navigator.userAgent.toLowerCase();
    /* 浏览器类型 */
    //http://msdn.microsoft.com/en-us/library/ie/dn423948%28v=vs.85%29.aspx
    T.WB = {//Web Browser
        IE: !T.IS.EL//Internet Explorer
        , IE6: !T.IS.fixed//Internet Explorer 6
        , IE7: T.IS.fixed && !T.IS.DM//Internet Explorer 7
        , IE8: T.IS.DM && !T.IS.CVS//Internet Explorer 8
        , IE9: T.IS.CVS && !T.IS.FR//Internet Explorer 9
        , GC: /.*(chrome)\/([\w.]+).*/.test(T.UA)//Google Chrome
        , SF: /.*version\/([\w.]+).*(safari).*/.test(T.UA)//Safari
        , FF: /.*(firefox)\/([\w.]+).*/.test(T.UA)//Mozilla Firefox
        , OP: /(opera).+version\/([\w.]+)/.test(T.UA)//Opera
        , UC: /.*version\/([\w.]+).*(safari).*/.test(T.UA)//UC Browser
    };
    /* 事件 */
    T.EVENTS = {
        input: typeof document.body.oninput == 'undefined' ? 'propertychange' : 'input'
    };
    T.setHash = function (value) {
        location.hash = T.WB.SF ? encodeURIComponent(value) : value;
    };
    /* 基于时间戳生成20位全局唯一标识（每一毫秒只对应一个唯一的标识，适用于生成DOM节点ID） */
    T.UUID = Utils.uuid;
    T.GetFileUrl = function () {
        var str = T.UUID() + new Date().getTime() + '' + Math.random();
        return T.MD5(Math.random() + T.MD5(str) + Math.random());
    };
    T.Typeof = Utils.type;
    T.Each = Utils.each;
    T.Inherit = Utils.extend;
    /**
     * @将参数对象转换为URL参数字符串
     * @method ConvertToQueryString
     * @param {Object} [options] 必选，参数对象
     * Return {String} URL参数字符串
     */
    T.ConvertToQueryString = function (options) {
        var params = [];
        for (var o in options)
            if (options.hasOwnProperty(o))
                params.push(o + '=' + encodeURIComponent(typeof options[o] === 'object' ? T.JSON.stringify(options[o]) : options[o]));
        return params.join('&');
    };
    /**
     * @生成随机字符串
     * @param {Number} [len] 可选，默认6，生成字符串的长度
     * @param {Boolean} [readable] 可选，默认False，是否去掉容易混淆的字符
     * Return {String} 指定长度的随机字符串
     */
    T.RandomString = function (len, readable) {
        len = len || 6;
        //'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';//去掉容易混淆的字符oO,Ll,9gq,Vv,Uu,I1
        var chars = readable ? 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            count = chars.length,
            str = '';
        for (i = len; i > 0; i--) str += chars.charAt(Math.floor(Math.random() * count));
        return str;
    };
    /**
     * @字符串字符长度（中文、中文标点符号、全角字符为2）
     * @param {String} [str] 必选，字符串
     * Return {String} 字符长度
     */
    T.GetStrLength = function (str) {
        str = str || '';
        var cArr = str.match(/[^\x00-\xff]/ig);
        return str.length + (cArr == null ? 0 : cArr.length);
    };
    /**
     * @字符串超长添加省略号
     * @param {String} [str1] 必选，需要判断超长的字符串
     * @param {String} [str2] 可选，默认空字符，若有则计算在总字符长度内
     * @param {Number} [length] 可选，默认56，限制字符串的总字符长度
     * Return {String} 处理后的字符串
     */
    T.GetEllipsis = function (str1, str2, length) {
        if (!str1) {
            return '';
        }
        if (T.Typeof(str2) == 'Number') {
            length = str2;
            str2 = '';
        }
        str2 = str2 || '';
        length = length || 56;
        var str1Length = T.GetStrLength(str1),
            str2Length = T.GetStrLength(str2);
        if (str1Length > length - str2Length) {
            var arr = str1.split(''),
                strLength = 0;
            for (var i = 0, l = arr.length; i < l; i++) {
                strLength += T.GetStrLength(arr[i]);
                if (strLength > length - str2Length) {
                    arr = arr.slice(0, i);
                    break;
                }
            }
            //中文标点符号，。、；“”（）
            var reg = /[\uff0c|\u3002|\u3001|\uff1b|\u201d|\u201c|\uff08|\uff09]/;
            if (reg.test(arr[arr.length - 1])) {
                arr.pop();
            }
            return arr.join('') + '...';
        } else {
            return str1;
        }
    };
    /**
     * @动态创建一个闭包函数并执行
     * @param {String} [str] 必选，字符串
     * Return {Object} 执行结果
     */
    T.Eval = function (str) {
        return (new Function('return ' + str))();
    };
    /* 数组处理类 */
    T.Array = {
        /**
         * @向数组中添加不重复的元素
         * @param {Array} arr 数组
         * @param {String} value 值
         * @param {Boolean} redo 是否重复，默认false
         * @param {String} key 对象属性名
         * Return {Array} 添加后的数组
         */
        add: function (arr, value, redo, key) {
            if (redo) {
                arr.push(value);
                return arr;
            }
            var bool = false, isKey = typeof(key) == 'undefined' || key === '';
            T.Each(arr, function (k, v) {
                if ((isKey && v == value) || (!isKey && v[key] == value[key])) bool = true;
            });
            if (!bool) arr.push(value);
            return arr;
        }
        /**
         * @根据对象key/value从对象数组中获得对象
         * @param {Array} arr 对象数组
         * @param {String} value 对象属性值
         * @param {String} key 对象属性名
         * Return {Object} 对应的对象
         */, get: function (arr, value, key) {
            var ret = null;
            if (typeof value === 'undefined' || typeof key === 'undefined' || key === '') return ret;
            T.Each(arr, function (k, v) {
                if (v[key] == value) {
                    ret = v;
                    return false;
                }
            });
            return ret;
        }
        /**
         * 根据对象key/value从对象数组中删除对象
         * @param {Array} arr 对象数组
         * @param {String} value 对象属性值
         * @param {String} key 对象属性名
         * @returns {Object} 对应的对象
         */, remove: function (arr, value, key) {
            var ret = null;
            if (typeof value === 'undefined' /*|| typeof key === 'undefined' || key === ''*/) return ret;
            T.Each(arr, function (k, v) {
                if (v == value) {
                    arr.splice(k, 1);
                } else if (v && v[key] == value) {
                    arr.splice(k, 1);
                }
            });
            return ret;
        }
        /**
         * @根据对象key/value修改对象数组中的对象
         * @param {Array} arr 对象数组
         * @param {Object} value 新对象
         * @param {String} key 对象属性名
         * Return {Array} 修改后的对象数组
         */, set: function (arr, value, key) {
            if (!arr || typeof value === 'undefined' || typeof key === 'undefined' || key === '') return arr;
            T.Each(arr, function (k, v) {
                if (v[key] == value[key]) {
                    arr[k] = value;
                }
            });
            return arr;
        }
        /**
         * @根据key/value获得数组下标
         * @param {Array} arr 数组
         * @param {String} value 属性值
         * @param {String} key 属性名
         * Return 对应的下标
         */, indexOf: function (arr, value, key) {
            var ret = -1, bool = typeof key === 'undefined' || key === '';
            T.Each(arr, function (k, v) {
                if (bool ? v == value : v[key] == value) {
                    ret = k;
                    return false;
                }
            });
            return ret;
        },
        /**
         * @根据key/values设置对象数组选中状态
         * @param {Array} arr 对象数组
         * @param {String} values 属性值，以“;”分开
         * @param {String} key 属性名
         * @param {Boolean} def 如果没有被选中的，是否默认选中第一个
         * Return 对象数组
         */
        check: function (arr, values, key, def) {
            if (!T.Typeof(arr, /Array/) || typeof(values) == 'undefined' || typeof(key) == 'undefined' || key === '') return values || [];
            if (T.Typeof(values, /Array/)) {
                values = values.join(";");
            }
            var count = 0, _values = '';
            T.Each(arr, function (i, v) {
                if ((';' + values + ';').indexOf(';' + v[key] + ';') >= 0) {
                    arr[i].CHECKED = 1;
                    _values += ';' + v[key];
                    count++;
                } else {
                    arr[i].CHECKED = 0;
                }
            });
            if (count === 0 && def && arr[0]) {
                arr[0].CHECKED = 1;
                _values += ';' + arr[0][key];
            }
            return (_values ? _values.substring(1) : '').split(";");
        }
    };
    T.FormatData = function (s, bool) {
        if (T.Typeof(s, /Object/)) {
            var o = {};
            T.Each(s, function (k, v) {
                k = '' + k;
                var key = k.replace(/[A-Z]/g, function (ch) {
                    return (bool ? '' : '_') + String.fromCharCode(ch.charCodeAt(0) | 32);
                });
                o[key] = T.Typeof(v, /Object|Array/) ? T.FormatData(v) : v;
            });
            return o;
        } else if (T.Typeof(s, /Array/)) {
            var o = [];
            T.Each(s, function (k, v) {
                o.push(T.FormatData(v));
            });
            return o;
        } else {
            s = '' + s;
            return s.replace(/[A-Z]/g, function (ch) {
                return '_' + String.fromCharCode(ch.charCodeAt(0) | 32);
            });
        }
    };
    /**
     * 功能模块基础类，其他功能模块继承此类
     * @summary 模块基类
     * @author Woo
     * @version 1.1
     * @since 2015/7/31
     * @param {Object} settings
     * @alias T.Module
     * @constructor
     */
    T.Module = function (baseClass) {
        T.Module.mid = (T.Module.mid || 0) + 100;

        function superClass() {
            var _this = this;
            var _render = _this.render, _events = _this.events;
            /** @lends T.Module.prototype */
            /**
             * 初始化
             * @method initialize
             * @memberof T.Module#
             * @since 2015/7/31
             * @param {Object} options
             */
            _this.initialize = function (options) {
                options = options || {};
                _render = options.render || _render, _events = options.events || _events;
                //数据
                _this.data = T.Inherit(_this.data || {}, options.data || {});
                //接口
                _this.action = options.action || _this.action || "";
                //参数
                _this.params = options.params || _this.params || {};
                //加载状态
                _this.status = options.status || _this.status || [];
                //模板
                _this.template = options.template || _this.template || "";
                //回调函数
                _this.callbacks = options.callbacks || _this.callbacks || {};
                //容器
                if (!_this.$cont || !_this.$cont[0]) {
                    _this.$cont = $("#template-" + _this.template + "-view");
                }
                //绑定事件
                _this.events(_events);
                if (_this.init) _this.init.apply(_this, arguments);
                console.log("T.Module.initialize=>", _this);
                return _this;
            };
            /**
             * @根据ID绑定数据
             * @method compiler
             * @memberof T.Module#
             * @since 2015/12/3
             * @param {String} [tmplId] 模板ID
             * @param {Object} [data] 数据源（对象）
             * @param {String} [viewId] 视图ID
             * @return {Object} 视图对象
             */
            _this.compiler = function (tmplId, data, viewId) {
                data = data || {};
                data.RMB = T.RMB;
                data.Number = Number;
                data.CFG = T.CFG || {};
                data.DOING = T.DOING;
                data.DOMAIN = T.DOMAIN || {};
                data.DeliveryDate = T.DeliveryDate;
                viewId = viewId || tmplId;
                var temp = document.getElementById("template-" + tmplId);
                var view = document.getElementById("template-" + viewId + "-view");
                if (temp && view) {
                    view.innerHTML = Utils.Compiler.templateNative("template-" + tmplId, data);
                }
                return view;
            };
            /**
             * @根据ID绑定数据
             * @method BindData
             * @param {Object} [data] 数据源（对象）
             */
            _this.bindData = function (k, data) {
                k = k ? k + '-' : '';
                T.Each(data, function (key, value) {
                    if (T.Typeof(value, /array|Object/)) {
                        T.BindData(k + key, value);
                    } else {
                        var obj = document.getElementById(k + key);
                        if (obj) {
                            var tn = ('' + obj.tagName).toLowerCase();
                            value = typeof value == 'undefined' ? '' : value;
                            value = /price/i.test(key) ? T.RMB(value) : value;
                            if (/input|textarea/.test(tn)) {
                                obj.value = value;
                            } else if (/img/.test(tn)) {
                                obj.src = value;
                            } else if (/select/.test(tn)) {
                                obj.src = value;
                                var options = obj.options;
                                for (var o = 0; o < options.length; o++) {
                                    if (options[o].value.Trim() == value)
                                        options[o].selected = true;
                                }
                            } else {
                                obj.innerHTML = value;
                            }
                        }
                    }
                });
            };
            /**
             * 渲染页面（绑定数据）
             * @method render
             * @memberof T.Module#
             * @since 2015/12/3
             * @param {Object} data
             */
            _this.render = function (data) {
                data = data || _this.data;
                if (_render) {
                    _render.call(_this, data);
                } else if (_this.template) {
                    _this.compiler(_this.template, data);
                }
                console.log("render==>", _this.template, "==>", data);
                T.Loaded(_this.$cont);
            };
            /**
             * 事件委托处理
             * @method events
             * @memberof T.Module#
             * @since 2015/12/3
             * @param {Object} events 事件
             */
            _this.events = function (events) {
                T.Each(events, function (selector, handler) {
                    //事件分配正则表达式：/^(\S+)\s*(.*)$/
                    var match = selector.match(/^(\S+)\s*(.*)$/);
                    var eventName = match[1];
                    selector = match[2];
                    eventName += "." + _this.mid;
                    if (typeof(handler) == "string") { //如果为字符串，则表示为当前对象的方法
                        handler = _this[handler];
                    }
                    if (typeof(handler) == "function") {
                        var _handler = function (e, data) { //定义事件处理函数
                            handler.call(_this, $(this), e, data);
                        };
                        if (selector) { //如果选择器不为空，委托到指定选择器
                            _this.$cont.undelegate(selector, eventName).delegate(selector, eventName, _handler);
                        } else { //否则，委托到当前容器
                            _this.$cont.off(eventName).on(eventName, _handler);
                        }
                    }
                });
            };
            /**
             * 加载完毕
             * @method loaded
             * @memberof T.Module#
             * @since 2015/12/3
             * @param {Object} data 返回的数据
             * @param {Object} params 查询的参数
             * @param {Number|Function} callback 第几个查询/回掉函数
             */
            _this.loaded = function (data, params, callback) {
                if (typeof(callback) === "function") {
                    callback.apply(_this, arguments);
                } else if (typeof(callback) === "number") {
                    _this.status[callback] = 1;
                    if (_this.status.length === _this.status.join("").length) {
                        _this.render(_this.data);
                        if (_this.complete) _this.complete.apply(_this, arguments);
                    }
                } else {
                    _this.render(_this.data);
                    if (_this.complete) _this.complete.apply(_this, arguments);
                }
            };
            return _this;
        }

        function _module(subClass) {
            superClass.call(baseClass); //继承
            return baseClass.initialize.apply(baseClass, arguments);
        }

        return _module;
    };
    /**
     * 加载图片
     * @param {String} imgsrc 图片地址
     * @param {Function} success 加载完成回调函数
     * @param {Function} failure 加载失败回调函数
     * @param {Boolean} retry 加载失败重试次数，默认为不重试，负数：一直重试，整数：重试指定次数
     */
    T.LoadImage = function (imgsrc, success, failure, retry) {
        var _this = this;
        if (!imgsrc) return;
        retry = parseInt(retry || 0) || 0;
        var img = new Image();
        img.onload = function () {
            var nw = img.naturalWidth || img.width, nh = img.naturalHeight || img.height;
            if (nw == 400 && nh == 300) {//为失败的默认图片时
                img.onerror();
            } else {
                if (typeof(success) == 'function') success.call(_this, imgsrc, nw, nh);
            }
        };
        img.onabort = img.onerror = function () {
            if (retry) {
                retry--;
                _this.LoadImage(imgsrc, success, failure, retry);
            } else {
                if (typeof(failure) == 'function') failure.call(_this, imgsrc);
            }
        };
        img.src = imgsrc;
    };

    function Counter($dom, options) {
        options = options || {min: 1, max: 1000};
        options.step = options.step || 1;
        options.cont = options.cont || ".counter";
        if (options.min == null) {
            options.min = 1;
        }
        if (options.max == null) {
            options.max = 1000;
        }
        $dom.off("selectstart" + options.cont).on("selectstart" + options.cont, options.cont + " a:not(.dis), " + options.cont + " b:not(.dis)", function () {
            return false;
        }).off("click" + options.cont + "-a").on("click" + options.cont + "-a", options.cont + " a:not(.dis)", function (e) { //减数量
            var $minus = $(this);
            var $input = $minus.siblings("input");
            var val = parseInt($input.val(), 10);
            var dval = val;
            if (val > options.min) {
                val -= options.step;
                val = Math.max(val, options.min);
                val = Math.min(val, options.max);
                $input.val(val);
            }
            if (dval != val && options.change) options.change.call(options, $input, val);
            return false;
        }).off("click" + options.cont + "-b").on("click" + options.cont + "-b", options.cont + " b:not(.dis)", function (e) { //加数量
            var $plus = $(this);
            var $input = $plus.siblings("input");
            var val = parseInt($input.val(), 10);
            var dval = val;
            if (val < options.max) {
                val += options.step;
                val = Math.min(val, options.max);
                val = Math.max(val, options.min);
                $input.val(val);
            }
            if (dval != val && options.change) options.change.call(options, $input, val, 1);
            return false;
        }).off("blur" + options.cont).on("blur" + options.cont, options.cont + " input", function (e) { //输入数字
            var $input = $(this);
            var val = $input.val();
            if (isNaN(val)) {
                val = 1;
            }
            val = parseInt(val, 10) || 0;
            val = Math.max(val, options.min);
            val = Math.min(val, options.max);
            $input.val(val);
            if (options.change) options.change.call(options, $input, val, 0);
            return false;
        }).off("keydown" + options.cont).on("keydown" + options.cont, options.cont + " input", function (e) {
            var $input = $(this);
            if ($.trim($input.val()) && e.keyCode == 13) {
                e.preventDefault();
                e.stopPropagation();
                $input.blur();
            }
        }).off("keyup" + options.cont + " afterpaste" + options.cont).on("keyup" + options.cont + " afterpaste" + options.cont, options.cont + " input", function (e) {
            var $input = $(this);
            $input.val($input.val().replace(/\D\./g, ''));
        }).off("focus" + options.cont).on("focus" + options.cont, options.cont + " input", function (e) {
            var $input = $(this);
            $input.trigger("blur" + options.cont);
        });
    }

    T.SetCounter = function ($dom, options) {
        return new Counter($($dom), options);
    };
    $.fn.counter = function (params) {
        return this.each(function () {
            $(this).data("counter", new Counter($(this), params));
        });
    };
    T.Loaded = function ($cont) {
        if (!$cont) $cont = $("body");
        $cont.removeClass("load");
    };
    T.REQUEST = T.getRequest();
    /**
     * 拖拽
     */
    T.DragDrop = function (options) {
        return new Utils.DragDrop(options);
    };
    T.CheckAOuth = function () {
        if (T._STORE && T._SNICKNAME) {
            var usid = T._USID, account = T._ACCOUNT;
            T.LoginAfter();
            if (account && usid != T._USID) {
                T.alt("账号：" + account + " 登录超时，被退出，请重新登录", function (_o) {
                    location.reload();
                }, function (_o) {
                    location.reload();
                });
                return true;
            }
        }
    };
    /*T.ACTION_INDEX = 0;
    T.ACTION_OBJECT = {};
    T.DOMAIN_ACTIONS = [];
    $("link[rel='dns-prefetch']").each(function (i, el) {
        var action = $(el).attr("href");
        if (action.indexOf('//a') === 0) {
            T.DOMAIN_ACTIONS.push(action.replace(/\/+$/, '') + '/')
        }
    })
    T.DOMAIN_ACTIONS = T.DOMAIN_ACTIONS.length ? T.DOMAIN_ACTIONS : [T.DOMAIN.ACTION];
    T.getAction = function (action) {
        var obj = T.ACTION_OBJECT;
        var actionIndex = obj[action];
        if (isNaN(actionIndex)) {
            actionIndex = (T.ACTION_INDEX > -1 ? T.ACTION_INDEX : -1) + 1;
            actionIndex = actionIndex % T.DOMAIN_ACTIONS.length;
            T.ACTION_INDEX = actionIndex;
            obj[action] = actionIndex;
        }
        //actionIndex = action.indexOf('in_quotation')>-1 ? 1 : 0
        return T.DOMAIN_ACTIONS[actionIndex] || T.DOMAIN_ACTIONS[0];
    }*/
    T.getAction = function () {
        return T.DOMAIN.ACTION
    }
    $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
    /**
     * GET 方法
     * @param {Object} options 请求数据
     * @param {String} options.action 请求API
     * @param {Object} options.params 请求参数
     * @param {Function} options.success 请求成功后回调
     * @param {Function} options.failure 请求失败后回调（逻辑错误）
     * @param {Function} options.error 请求出错后回调（系统错误）
     * @param {Function} _failure 失败后回调函数
     * @param {Function} _error 出错后回调函数
     */
    T.GET = function (options, _failure, _error) {
        if (!options || !options.action) return;
        var params = options.params || {};
        if (!/^http/.test(options.action)) options.action = T.getAction(options.action) + options.action;
        if (T._STORE && T._USID && !options.issid) params.sid = T._USID;
        if (T._STORE && typeof(params.source) == 'undefined' && T._SNICKNAME && !params.issource) params.source = T._SNICKNAME;
        if (T.CheckAOuth()) return;

        $.ajax({
            type: 'get',
            dataType: 'json',
            url: options.action,
            data: params,
            headers: {'x-Requested-With': 'XMLHttpRequest'},
            success: function (data) {
                options.data = data
                T.callback(options, _failure, _error);
            },
            error: function (res) {
                options.action.indexOf('config/media.js') === -1 && T.alt(T.TIPS.NETWORK, function (_this) {
                    _this.remove();
                    location.reload();
                }, function () {
                    location.reload();
                });
            }
        });
    }
    if (T.Browser.ie > 1 && T.Browser.ie < 10) {
        T.GET = function (options, _failure, _error) {
            if (!options || !options.action) return;
            var params = options.params || {};
            var jsoncallback = params.jsoncallback || T.UUID().toUpperCase();//产生随机函数名
            if (window[jsoncallback]) {
                jsoncallback = T.UUID().toUpperCase();
            }
            if (!/^http/.test(options.action)) options.action = T.getAction(options.action) + options.action;
            params.jsoncallback = jsoncallback;
            if (T._STORE && T._USID && !options.issid) params.sid = T._USID;
            if (T._STORE && typeof(params.source) == 'undefined' && T._SNICKNAME && !params.issource) params.source = T._SNICKNAME;
            if (T.CheckAOuth()) return;
            var _params = params;
            if (!_params.ininin) _params.ininin = T.UUID().toUpperCase();
            options.action += (options.action.indexOf('?') < 0 ? '?' : '&') + T.ConvertToQueryString(_params);
            var script = document.createElement('script');
            script.defer = 'defer';
            script.async = 'async';
            window[jsoncallback] = function (response) {//定义被脚本执行的回调函数
                try {
                    options.data = response;
                    T.callback(options, _failure, _error);
                } catch (e) {
                }
                finally {//最后删除该函数与script元素
                    if (script && script.parentNode && script.parentNode.removeChild) {
                        script.parentNode.removeChild(script);
                    }
                    setTimeout(function () {
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
    }
    /**
     * POST 方法
     * @param {Object} options 请求数据
     * @param {String} options.action 请求API
     * @param {Object} options.params 请求参数
     * @param {Function} options.success 请求成功后回调
     * @param {Function} options.failure 请求失败后回调（逻辑错误）
     * @param {Function} options.error 请求出错后回调（系统错误）
     * @param {Function} _failure 失败后回调函数
     * @param {Function} _error 出错后回调函数
     */

    T.POST = function (options, _failure, _error) {
        if (!options || !options.action) return;
        T.POST.zIndex = (T.POST.zIndex || 0) + 1;
        options.params = options.params || {};
        if (T._STORE && T._USID && !options.issid) options.params.sid = T._USID;
        if (T._STORE && typeof(options.params.source) == 'undefined' && T._SNICKNAME && !options.issource) options.params.source = T._SNICKNAME;
        if (T.CheckAOuth()) return;
        //if(!options.params['localurl'])options.params['localurl'] = location.href;
        if (!/^http/.test(options.action)) options.action = T.getAction(options.action) + options.action;
        options.action += (options.action.indexOf('?') > 0 ? '&' : '?') + 'ininin=' + T.UUID().toUpperCase();//Math.random();

        var formdata = {};
        T.Each(options.params, function (k, v) {
            if (/password$|pwd$/i.test(k)) {
                if (k == 'amoeba_password') {//阿米巴支付密码，1次MD5
                    v = T.MD5(v);
                }else if (k == 'agent_pwd') {//加盟商支付密码，1次MD5
                    v = T.MD5(v);
                } else {
                    v = T.MD5(T.MD5(v));
                }
            }
            formdata[k] = typeof v === 'object' ? T.JSON.stringify(v) : v
        });

        $.ajax({
            type: "post",
            dataType: "json",
            url: options.action,
            data: formdata,
            headers: {'x-Requested-With': 'XMLHttpRequest'},
            success: function (data) {
                options.data = data
                T.callback(options, _failure, _error);
            },
            error: function () {
                T.alt(T.TIPS.NETWORK, function (_this) {
                    _this.remove();
                    location.reload();
                }, function () {
                    location.reload();
                });
            }
        });
    }
    if (T.Browser.ie > 1 && T.Browser.ie < 10) {
        T.POST = function (options, _failure, _error) {
            if (!options || !options.action) return;
            T.POST.zIndex = (T.POST.zIndex || 0) + 1;
            options.params = options.params || {};
            if (T._STORE && T._USID && !options.issid) options.params.sid = T._USID;
            if (T._STORE && typeof(options.params.source) == 'undefined' && T._SNICKNAME && !options.issource) options.params.source = T._SNICKNAME;
            if (T.CheckAOuth()) return;
            //if(!options.params['localurl'])options.params['localurl'] = location.href;
            if (!/^http/.test(options.action)) options.action = T.getAction(options.action) + options.action;
            options.action += (options.action.indexOf('?') > 0 ? '&' : '?') + 'ininin=' + T.UUID().toUpperCase();//Math.random();
            var form = T.DOM.create('form', {
                target: 'piframe_' + T.POST.zIndex, action: options.action, method: 'post', style: 'display:none'
            });
            var iframe;
            try { // for I.E.
                iframe = document.createElement('<iframe name="piframe_' + T.POST.zIndex + '">');
            } catch (ex) { //for other browsers, an exception will be thrown
                iframe = T.DOM.create('iframe', {
                    name: 'piframe_' + T.POST.zIndex, src: '#'//#'about:blank'
                    , style: 'display:none'
                });
            }
            if (!iframe) return;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            document.body.appendChild(form);
            var formdata = options.params;
            T.Each(formdata, function (k, v) {
                if (/password$|pwd$/i.test(k)) {
                    if (k == 'agent_pwd') {//加盟商支付密码，1次MD5
                        v = T.MD5(v);
                    } else {
                        v = T.MD5(T.MD5(v));
                    }
                }
                form.appendChild(T.DOM.create('input', {
                    type: 'hidden', name: k, value: (typeof v === 'object' ? T.JSON.stringify(v) : v)
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
            if (options.before) options.before(form, iframe);
            form.submit();
        };
    }
    /**
     * callback 方法
     * @param {Object} options 请求数据
     * @param {String} options.action 请求API
     * @param {Object} options.params 请求参数
     * @param {Function} options.success 请求成功后回调
     * @param {Function} options.failure 请求失败后回调（逻辑错误）
     * @param {Function} options.error 请求出错后回调（系统错误）
     * @param {Function} _failure 失败后回调函数
     * @param {Function} _error 出错后回调函数
     */
    T.callback = function (options, _failure, _error) {
        if (options && T.Typeof(options.data, /Object/)) {
            console.log('==========>', options.action.replace(/\?.*/, ''), '    ', options.data.result, '    ', '路由');
            if (options.data.result == 0 && T.Typeof(options.data.data, /Object/)) {
                console.log('==========>', options.action.replace(/\?.*/, ''), '    ', options.data.data.result);
                if (options.data.data.result == 0) {
                    if (options.success) options.success(options.data.data, options.params);
                    //T.SetPassport(T._USERKEY);
                } else if (options.data.data.result > 0) {
                    if (options.failure) {
                        options.failure(options.data.data, options.params);
                    } else {
                        T.alt(options.data.data.msg || T.TIPS.DEF, function (_this) {
                            _this.remove();
                            //location.reload();
                        }, function () {
                            //location.reload();
                        });
                    }
                } else {
                    if (options.error) {
                        options.error(options.data.data, options.params);
                    } else {
                        T.alt(T.TIPS.DEF, function (_this) {
                            _this.remove();
                            //location.reload();
                        }, function () {
                            //location.reload();
                        });
                    }
                }
            } else if (options.data.result == 3) {//未登录
                if (_failure) {
                    _failure(options.data, options.params);
                } else {
                    debugger
                    //T.UnCookie();
                    T.NotLogin();
                    //T.LoginForm();
                    /*T.alt(options.data.msg||T.TIPS.DEF, function(_this){
                     _this.remove();
                     location.reload();
                     }, function(){
                     location.reload();
                     });*/
                }
            } else if (options.data.result > 0) {//逻辑错误
                if (_failure) {
                    _failure(options.data, options.params);
                } else {
                    T.alt(options.data.msg || T.TIPS.DEF, function (_this) {
                        _this.remove();
                        //location.reload();
                    }, function () {
                        //location.reload();
                    });
                }
            } else {//系统错误
                if (_error) {
                    _error(options.data, options.params);
                } else {
                    T.alt(T.TIPS.DEF, function (_this) {
                        _this.remove();
                        //location.reload();
                    }, function () {
                        //location.reload();
                    });
                }
            }
        } else {
            if (_error) {
                _error(options.data, options.params);
            } else {
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
    T.Popup = Utils.Popover;
    /**
     * 消息提示框
     */
    T.msg = function (text, isDone) {
        var dom = document.getElementById('msg_tip');
        if (dom) dom.parentNode.removeChild(dom);
        if (isDone) return;
        dom = document.body.appendChild(document.createElement('div'));
        dom.id = 'msg_tip';
        dom.className = 'msg_tip';
        dom.innerHTML = '<dl><dt></dt><dd>' + text + '</dd></dl>';
        var w = $(window).width();
        var h = $(window).height();
        dom.style.top = (h - dom.offsetHeight) / 2 + 'px';
        dom.style.left = (w - dom.offsetWidth) / 2 + 'px';
        setTimeout(function () {
            //dom.parentNode.removeChild(dom);
            $(dom).animate({opacity: 0}, 300, function () {
                $(dom).remove();
            });
        }, 1200);
    };
    T.loading = function (isDone, duration, text) {
        function _setProgress(step) {
            var node = document.getElementById('loading_shading_progress');
            if (node && step) {
                step--;
                node.style.width = (100 - step) + '%';
                if (step > 2) {
                    setTimeout(function () {
                        _setProgress(step);
                    }, duration / 100);
                }
            }
        }

        var dom = document.getElementById('loading_shading');
        if (dom) {
            if (typeof(duration) == 'number') {
                _setProgress(1);
                setTimeout(function () {
                    dom.parentNode.removeChild(dom);
                }, 300);
            } else {
                dom.parentNode.removeChild(dom);
            }
        }
        if (isDone) return;
        dom = document.body.appendChild(document.createElement('dl'));
        dom.id = 'loading_shading';
        dom.className = 'loading_shading';
        //进度条
        if (typeof(duration) == 'number') {
            dom.innerHTML = '<dt></dt><dd class="load_progress"><table cellpadding="0" cellspacing="0"><tr><td><div class="progress_box"><p class="text">' + (text || '') + '</p><div class="progress"><div id="loading_shading_progress"></div></div></div></td></tr></table></dd>';
            _setProgress(100);
        } else {
            dom.innerHTML = '<dt></dt><dd></dd>';
        }
    };
    /*T.Tip= new function(){
     var self = this;
     self.show = function(e, html){
     e = e||event, target = e.target||e.srcElement;
     self.container = document.body || document.documentElement;//容器
     self.layer = document.createElement('dl');
     self.layer.className = 'tips';
     self.layer.style.top = target.offsetTop - 42 + 'px';
     self.layer.style.left = target.offsetLeft - 3 + 'px';
     self.layer.innerHTML = '<dd>'+html+'</dd><dt></dt>';
     self.container.appendChild(self.layer);
     };
     self.hide = function(){
     if(self.layer){
     self.container.removeChild(self.layer);
     self.layer = null;
     }
     };
     };*/
    T.contains = function (root, el) {//如果A元素包含B元素，则返回true，否则false
        if (!root || !el || root.nodeType !== 1 || el.nodeType !== 1) {
            return false;
        } else if (root.compareDocumentPosition) {
            return root === el || !!(root.compareDocumentPosition(el) & 16);
        } else if (root.contains) {
            return root.contains(el);//&&root!==el;
        } else {
            while (el = el.parentNode) {
                if (el === root) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
    /**
     * @鼠标飘过提示框
     * @method TIP
     * @param {Object} [options] 必选，数据
     * @param {Boolean} [isRemove] 可选，默认为false；false：移除，true：隐藏
     * Return {Object} 鼠标飘过提示框
     */
    T.TIP = function (options, isRemove) {
        function TIP() {
            var _this = this;
            /*
             * options.container：容器
             * options.content：内容
             * options.trigger：触发DOM对象
             * options.offsetX：X轴偏移
             * options.offsetY：Y轴偏移
             */
            if (!options.container || !options.content || !options.trigger) return;
            options['max-width'] = options['max-width'] || '';
            options.width = options.width || '';
            if (/^\d+$/.test(options['max-width'])) {
                options['max-width'] += 'px';
            }
            if (/^\d+$/.test(options.width)) {
                options.width += 'px';
            }
            options.offsetX = parseInt(options.offsetX, 10) || 0;
            options.offsetY = parseInt(options.offsetY, 10) || 0;
            _this.options = options || {};
            _this.container = options.dom || document.body || document.documentElement;//容器
            _this.trigger = null;
            _this.load = function () {
                var dom = document.getElementById(options.id);
                if (dom) {
                    dom.parentNode.removeChild(dom);
                }
                var text = typeof(_this.options.content) == 'function' ? _this.options.content(_this.trigger) || "" : _this.options.content;
                if (!text) return;
                _this.dom = document.createElement('div');
                if (options.id) _this.dom.id = options.id;
                _this.dom.className = 'tips ' + (_this.options.style || '');
                if (options['max-width'] !== '') {
                    _this.dom.style['max-width'] = _this.options['max-width'];
                }
                if (options.width !== '') {
                    _this.dom.style.width = _this.options.width;
                }
                _this.container.appendChild(_this.dom);
                _this.dom.innerHTML = text;
                if (_this.options.callback) {
                    _this.options.callback.call(_this, _this);
                }
                _this.setPosition();
            };
            _this.setPosition = function () {
                if (_this.dom && _this.trigger) {
                    var offset = T.DOM.offset(_this.trigger);
                    var domWH = T.DOM.getSize(_this.dom);
                    var tgrWH = T.DOM.getSize(_this.trigger);
                    var _offset = $(_this.container).offset() || {top: 0, left: 0};
                    //_this.dom.style.top = (offset.top+(tgrWH.h-domWH.h)/2)+'px';
                    //_this.dom.style.left = (offset.left+(tgrWH.w-domWH.w)/2)+'px';
                    var _left = 0, _top = 0;
                    if ($(options.dom).length) {
                        _left = $(document).scrollLeft();
                        _top = $(document).scrollTop();
                    }
                    _this.dom.style.top = (offset.top + tgrWH.h + _this.options.offsetY - _offset.top + _top) + 'px';
                    var _x = parseInt(T.DOM.attr(_this.trigger, "x"), 10) || 0 - _offset.left + _left;
                    if (_this.options.left) {
                        _this.dom.style.left = (offset.left + _x + _this.options.offsetX) + 'px';
                    } else {
                        _this.dom.style.left = (offset.left + _x + tgrWH.w - domWH.w + _this.options.offsetX) + 'px';
                    }
                    $(_this.dom).bind("mouseenter", _this.mouseenter).bind("mouseleave", _this.mouseleave);
                }
            };
            _this.show = function () {
                if (_this.dom) {
                    _this.dom.style.display = 'block';
                }
            };
            _this.hide = function () {
                if (_this.dom) {
                    _this.dom.style.display = 'none';
                }
            };
            _this.remove = function () {
                if (_this.dom && _this.dom.parentNode) {
                    _this.dom.parentNode.removeChild(_this.dom);
                    _this.dom = null;
                }
            };
            _this.mouseenter = function (e) {
                if (!_this.contains(e.fromElement || e.currentTarget)) {
                    _this.load();
                }
            };
            _this.mouseleave = function (e) {
                if (!_this.contains(e.toElement || e.relatedTarget)) {
                    _this.remove();
                    _this.trigger = null;
                }
            };
            _this.contains = function (toElement) {
                if (T.contains(_this.dom, toElement) || T.contains(_this.trigger, toElement)) {
                    return true;
                }
                return false;
            };
            $(options.container).delegate(options.trigger, "mouseenter", function (e) {
                _this.trigger = $(this).get(0);
                _this.mouseenter(e);
            }).delegate(options.trigger, "mouseleave", function (e) {
                _this.trigger = $(this).get(0);
                _this.mouseleave(e);
            });
        };
        return new TIP();
    }
    T.FORM = function (f, cfg, fns) {
        function Form(form, options, funs) {
            var _this = this;
            if (!form || !options) return;
            _this.form = typeof(form) == 'string' ? document.getElementById(form) : form;
            _this.options = options;
            _this.funs = funs;
            if (!_this.form || !options.action) return;
            _this.action = options.action;
            _this.items = {};
            _this.indexs = [];
            _this.caches = {};
            _this.cacheForm = document.createElement('form');
            _this.cacheForm.style.display = 'none';
            _this.init();
        }

        Form.prototype = {
            init: function () {
                var _this = this;
                _this.form['novalidate'] = 'novalidate';//Cancel the default browser validation
                _this.submitting = false;
                if (_this.funs.before) _this.before = _this.funs.before;
                if (_this.funs.submit) _this.submit = _this.funs.submit;
                if (_this.funs.after) _this.after = _this.funs.after;
                if (_this.funs.success) _this.success = _this.funs.success;
                if (_this.funs.failure) _this.failure = _this.funs.failure;
                if (_this.funs.error) _this.error = _this.funs.error;
                for (var g in _this.options.items) {
                    if (_this.options.items.hasOwnProperty(g)) {
                        var _item = _this.options.items[g] || {};
                        var _tips = _item.tips || {};
                        var _evts = _item.evts || {};
                        var item = {};
                        item.tips = {};//Settings message form item
                        item.evts = {};
                        for (var t in T.TIPS) {
                            if (T.TIPS.hasOwnProperty(t)) {
                                item.tips[t] = _tips[t] || T.TIPS[t];
                            }
                        }
                        item.rule = _item.rule || '';
                        item.unique = _item.unique || false;
                        item.required = _item.required || false;
                        item.minlength = _item.minlength || '';
                        item.maxlength = _item.maxlength || '';
                        item.min = _item.min || '';
                        item.max = _item.max || '';
                        item.noplaceholder = _item.noplaceholder || false;
                        item.inherit = _item.inherit || '';//任意一个
                        item.depend = _item.depend || '';//相互依赖，缺一不可
                        item.target = _item.target || '';
                        item.from = _item.from || '';
                        item.show = _item.show || '';
                        item.show_rule = _item.show_rule || '';
                        item.pattern = _item.pattern || T.RE[item.rule] || /\S/;
                        item.show_pattern = _item.show_pattern || T.RE[item.show_rule] || /\S/;
                        item.tips.placeholder = item.tips.placeholder || item.tips.empty || '';
                        //add
                        if (!_evts.valid) item.evts.valid = _this.valid;//Validation method
                        if (!_evts.value) item.evts.value = _this.value;//Value method
                        if (!_evts.output) item.evts.output = _this.output;//Output message method
                        _this.items[g] = item;
                        var input = _this.input(g);
                        if (input) {
                            if (input.tagName) {
                                _this.bind(input);
                            } else {
                                for (var f = 0; f < input.length; f++) {
                                    _this.bind(input[f]);
                                }
                            }
                        }
                        if (item.from) {
                            _this.showInput(g, item.from);
                        }
                    }
                }
                /*var inputs = _this.form.getElementsByTagName('input');
                 var selects = _this.form.getElementsByTagName('select');
                 var textareas = _this.form.getElementsByTagName('textarea');
                 for(var i=0; i < inputs.length; i++){
                 _this.bind(inputs[i]);
                 }
                 for(var j=0; j < textareas.length; j++){
                 _this.bind(textareas[j]);
                 }
                 for(var k=0; k < selects.length; k++){
                 _this.bind(selects[k]);
                 }
                 for(var o in _this.items){
                 if(_this.items.hasOwnProperty(o)){
                 var item = _this.items[o];
                 if(item.from)_this.showInput(item.from);
                 }
                 }*/
                _this.form.submit = _this.form.onsubmit = function (e) {
                    //T.DOM.preventDefault(e);
                    if (_this.submitting) return false;
                    var data = _this.validator(true);
                    if (!data) return false;
                    _this.params = data;
                    _this.submit.call(_this);
                    return false;
                };
            }, input: function (input) {
                var _this = this;
                if (!input) return;
                if (typeof(input) === 'string') {
                    return _this.form[input];
                } else {
                    return _this.form[input.name];
                }
            }
            /**
             * @给表单元素绑定对应的验证事件
             * @method bind
             * @param {Object/String} [o] 必选，表单元素DOM对象或name
             */, bind: function (input) {
                var _this = this;
                if (!input) return;
                var type = input.type;
                if (/^textarea$/i.test(input.tagName)) type = 'textarea';
                if (!type) return;
                var name = input.name;
                if (/^submit$|^button$|^image$/.test(type)) {
                    T.DOM.bind(input, 'click', function (e) {
                        //T.DOM.stopPropagation(e);
                        //T.DOM.preventDefault(e);
                        //if(_this.isEnd)
                        _this.form.submit();
                    });
                } else if (/^reset$/.test(type)) {

                } else if (name) {
                    var item = _this.items[name] || {};
                    item.type = type;
                    item.name = name;
                    item.tips = item.tips || {};
                    T.DOM.bind(input, 'invalid', function (e) {//Prevent the default behavior
                        T.DOM.stopPropagation(e);
                        T.DOM.preventDefault(e);
                    });
                    if (/^text$|^textarea$|^password$/.test(type)) {
                        if (/email/.test(item.rule)) T.Mailfix({inputs: [input]});
                        if (!item.noplaceholder) _this.placeholder(input, item.tips.placeholder);
                        T.DOM.bind(input, 'focus', function (e) {
                            //T.DOM.stopPropagation(e);
                            //T.DOM.preventDefault(e);
                            T.DOM.addClass(T.DOM.closest(input, 'label'), 'focus');
                            _this.isEnd = T.Array.indexOf(_this.indexs, item.name) >= _this.indexs.length;
                        });
                        T.DOM.bind(input, 'blur', function (e) {
                            //T.DOM.stopPropagation(e);
                            //T.DOM.preventDefault(e);
                            T.DOM.removeClass(T.DOM.closest(input, 'label'), 'focus');
                            _this.showInput(item.show, item.name);
                            if (!item.rule) return;
                            item.value = item.evts.value.call(_this, input);
                            var data = item.evts.valid.call(_this, input);
                            item.evts.output.call(_this, input, data);
                            _this.validator();
                            var params = {};
                            params[name] = item.value;
                            if (data && data.ret && item.unique && item.unique_value != item.value) {
                                T.POST({
                                    action: item.unique, params: params, success: function (data) {
                                        item.unique_value = item.value;
                                        item.uniqued = true;
                                        item.evts.output.call(_this, input, {ret: true, msg: ''});
                                        _this.validator();
                                    }, failure: function (data) {
                                        item.uniqued = false;
                                        item.unique_value = item.value;
                                        item.evts.output.call(_this, input, {
                                            ret: false,
                                            msg: (typeof(item.tips.unique) == "function" ? item.tips.unique.call(_this, item) : item.tips.unique) || ''
                                        });
                                    }, error: function () {
                                        item.uniqued = false;
                                        T.alt(data.msg || T.TIPS.DEF, function (_o) {
                                            _o.remove();
                                        });
                                    }
                                });
                            }
                        });
                        var isKeyup = true;
                        T.DOM.bind(input, 'keyup', function (e) {
                            e = e || event;
                            isKeyup = true;
                        });
                        //_this.options.prevent:是否阻止回车事件
                        if (!_this.options.prevent) T.DOM.bind(input, 'keydown', function (e) {
                            e = e || event;
                            if (/^textarea$/.test(type)) return;
                            if (!isKeyup) return;
                            isKeyup = false;
                            var keycode = e.keyCode || e.which;
                            var currIndex = T.Array.indexOf(_this.indexs, item.name);
                            if (keycode === 13) {
                                //T.DOM.stopPropagation(e);
                                //T.DOM.preventDefault(e);
                                if (item.show) _this.showInput(item.show, item.name);
                                //console.log(item.name,_this.indexs);
                                var nextName = _this.indexs[currIndex + 1];
                                var data = item.evts.valid.call(_this, input);
                                if (data && data.ret) {
                                    var nextInput = _this.input(nextName);
                                    if (nextInput) {
                                        _this.isEnd = false;
                                        if (typeof(nextInput.focus) === 'function') nextInput.focus();
                                    } else {
                                        _this.isEnd = true;
                                        _this.form.submit();
                                    }
                                }
                            }
                        });
                        if (input.removeAttribute) input.removeAttribute('placeholder');
                    } else if (/^radio$|^checkbox$|^select/.test(type)) {
                        _this.checked.call(_this, input, false);
                        _this.checkall.call(_this, input, item);
                        T.DOM.bind(input, (/^select/.test(item.type) ? 'change' : 'click'), function (e) {
                            _this.checked.call(_this, input, false);
                            _this.showInput(item.show, item.name);
                            if (/all$/.test(name)) _this.checkall.call(_this, input, item);
                            if (!item.rule) return;
                            item.value = item.evts.value.call(_this, input, item);
                            item.evts.output.call(_this, input, item.evts.valid.call(_this, input, item));
                            _this.validator();
                        });
                    }
                    if (_this.items[name]) {
                        _this.items[name] = item;
                        _this.indexs.push(name);
                    }
                }
            }, showInput: function (name, targetName, on) {
                var _this = this;
                if (name == null) return;
                var names = String(name).split("|");
                if (names && names.length > 1) {
                    for (var i = names.length - 1; i >= 0; i--) {
                        _this.showInput(names[i], targetName, on);
                    }
                }
                var input = _this.input(name);
                var item = _this.items[name];
                if (typeof(on) === 'undefined') {
                    targetName = targetName || item.from;
                    if (!item || !targetName) return;
                    var targetInput = _this.input(targetName);
                    var targetItem = _this.items[targetName];
                    if (!targetInput || !targetItem || !targetItem.show_pattern) return;
                    on = targetItem.show_pattern.test(_this.value(targetName));
                }
                var idx = T.Array.indexOf(_this.indexs, name);
                var targetIdx = T.Array.indexOf(_this.indexs, targetName);
                if (on) {
                    if (idx < 0 && targetIdx >= 0 && _this.caches[name]) {
                        _this.indexs.splice(targetIdx + 1, 0, name);
                        var targetInput = _this.input(targetName);
                        if (!targetInput.tagName) targetInput = targetInput[0];
                        T.DOM.insertAfter(_this.caches[name], T.DOM.closest(targetInput, '.form_item'));
                        if (typeof(_this.form[name].focus) === 'function') _this.form[name].focus();
                        _this.items[name].disabled = false;
                    }
                } else if (input) {
                    var node = T.DOM.closest(input, '.form_item');
                    T.DOM.removeClass(node, 'hide');
                    if (idx > 0 && targetIdx >= 0 && node) {
                        _this.indexs.splice(idx, 1);
                        _this.caches[name] = node;
                        _this.cacheForm.appendChild(_this.caches[name]);
                        _this.items[name].disabled = true;
                    }
                }
            }, checked: function (input, item) {
                var _this = this;
                var checked = input.checked;
                if (/^checkbox/.test(input.type)) {
                    checked ? T.DOM.addClass(input.parentNode, 'sel') : T.DOM.removeClass(input.parentNode, 'sel');
                    var bool = true;
                    var boxs = _this.input(input.name);
                    if (!boxs || !boxs.length) return;
                    for (var len = boxs.length, j = 0; j < len; j++) {
                        if (!boxs[j].checked) {
                            bool = false;
                            j = len;
                        }
                    }
                    var alls = _this.input(input.name + 'all');
                    if (!alls || !alls.length) return;
                    for (var len = alls.length, k = 0; k < len; k++) {
                        alls[k].checked = bool;
                        bool ? T.DOM.addClass(alls[k].parentNode, 'sel') : T.DOM.removeClass(alls[k].parentNode, 'sel');
                    }
                }
                if (/^radio/.test(input.type) && checked) {
                    checked ? T.DOM.addClass(input.parentNode, 'sel') : T.DOM.removeClass(input.parentNode, 'sel');
                    var boxs = _this.input(input.name);
                    if (!boxs || !boxs.length) return;
                    for (var len = boxs.length, h = 0; h < len; h++) {
                        T.DOM.removeClass(boxs[h].parentNode, 'sel');
                        boxs[h].checked = false;
                    }
                    input.checked = true;
                    T.DOM.addClass(input.parentNode, 'sel');
                }
            }, checkall: function (input, item, options) {
                var _this = this;
                if (/^checkbox/.test(input.type)) {
                    var checked = input.checked;
                    var boxs = _this.input(input.name.replace(/all$/, ''));
                    if (!boxs || !boxs.length) return;
                    for (var len = boxs.length, j = 0; j < len; j++) {
                        boxs[j].checked = checked;
                        checked ? T.DOM.addClass(boxs[j].parentNode, 'sel') : T.DOM.removeClass(boxs[j].parentNode, 'sel');
                    }
                    var alls = _this.input(input.name.replace(/all$/, '') + 'all');
                    if (!alls || !alls.length) return;
                    for (var len = alls.length, k = 0; k < len; k++) {
                        alls[k].checked = checked;
                        checked ? T.DOM.addClass(alls[k].parentNode, 'sel') : T.DOM.removeClass(alls[k].parentNode, 'sel');
                    }
                }
            }, valid: function (input, item, isDepend) {
                var _this = this;
                var name = input.name ? input.name : input;
                input = _this.input(name);
                item = item || _this.items[name] || {};
                var data = {ret: false, msg: item.tips.error || ''};
                item.tips = item.tips || {};
                if (!input) return data;
                if (!name) return data;
                var value = _this.value(name);
                if (!item) return data;
                if (typeof(item.uniqued) !== 'undefined' && item.unique_value == item.value) {
                    if (!item.uniqued) {
                        return {
                            ret: false,
                            msg: (typeof(item.tips.unique) == "function" ? item.tips.unique.call(_this, item) : item.tips.unique) || ''
                        };
                    }
                }
                if (item.inherit && value === '') {
                    value = _this.value(item.inherit);
                    return value === '' ? {ret: false, msg: item.tips.error || ''} : {ret: true, msg: ''};
                } else if (item.depend && !isDepend) {
                    var depend_input = _this.input(item.depend);
                    if (depend_input) {
                        var _vd = _this.valid(depend_input, null, true) || {};
                        var depend_value = _this.value(item.depend);
                        if (!_vd || !_vd.ret || (depend_value !== '' && value === '') || (depend_value === '' && value !== '')) {
                            return {ret: false, msg: _vd.msg || item.tips.empty || ''};
                        }
                    }
                }
                if (value === '') {
                    return {ret: !item.required || false, msg: (!item.required) ? '' : (item.tips.empty || '')};
                } else if (item.rule === 'same') {
                    var _value = _this.value(item.target);
                    return _value === value ? {ret: true, msg: ''} : {ret: false, msg: item.tips.same || ''};
                } else if (item.rule === 'number') {
                    if (!(/^[1-9]\d*\.?\d*$/.test(value) || /^0\.?\d*$/.test(value))) {
                        return {ret: false, msg: item.tips.type || ''};
                    } else if (item.min && value < item.min) {
                        return {ret: false, msg: item.tips.min || ''};
                    } else if (item.max && value > item.max) {
                        return {ret: false, msg: item.tips.max || ''};
                    } else {
                        return {ret: true, msg: ''};
                    }
                } else if (item.minlength && value.length < item.minlength) {
                    return {ret: false, msg: item.tips.minlength || ''};
                } else if (item.maxlength && value.length > item.maxlength) {
                    return {ret: false, msg: item.tips.maxlength || ''};
                } else if (item.pattern) {
                    return item.pattern.test(value) ? {ret: true, msg: item.tips.ok || ''} : {
                        ret: false,
                        msg: item.tips.mismatch || ''
                    };
                } else {
                    return {ret: false, msg: item.tips.error || ''};
                }
            }, validator: function (isSubmit) {
                var _this = this;
                var params = {};
                for (var o in _this.items) {
                    if (_this.items.hasOwnProperty(o)) {
                        var item = _this.items[o] || {};
                        var input = _this.input(o);
                        if (!item.disabled) {
                            if (item.from) {
                                var from = _this.items[item.from];
                                var bool = from.show_pattern.test(_this.value(item.from));
                                if (!bool) continue;
                            }
                            if (isSubmit && !input && item.required) {
                                T.msg(item.tips.empty);
                                params = null;
                                break;
                            }
                            var value = _this.value(o);
                            params[o] = value;
                            if (item.rule) {
                                var _vd = _this.valid(o) || {};
                                if (!_vd.ret) {
                                    if (isSubmit && _vd.msg) {
                                        input && input.focus && input.focus();
                                        T.msg(_vd.msg);
                                    }
                                    params = null;
                                    break;
                                }
                            } else {
                                params = null;
                                break;
                            }
                        }
                    }
                }
                params ? T.DOM.removeClass(_this.form, 'dis') : T.DOM.addClass(_this.form, 'dis');
                return params;
            }, output: function (input, data) {
                var _this = this;
                input = _this.input(input.name);
                if (!input || !data) return;
                if (input.length >= 0) input = input[0];
                if (!input) return;
                var formItem = T.DOM.closest(input, '.form_item');
                if (!formItem) return;
                var msg = T.DOM.find(formItem, 'i.msg')[0];
                if (msg)
                    msg.innerHTML = data.msg;
                if (data.ret) {
                    T.DOM.removeClass(formItem, 'error');
                } else {
                    T.DOM.addClass(formItem, 'error');
                }
            },
            value: function (input, item) {
                var _this = this;
                input = _this.input(input);
                if (!input) return;
                var name = input.name || input[0].name;
                if (!name) return;
                item = item || _this.items[name];
                if (!item) return;
                var value = '';
                if (/^select/.test(item.type)) {
                    if (!input.disabled) {
                        if (input.options) {
                            var options = input.options;
                            for (var o = 0; o < options.length; o++) {
                                if (options[o].selected) {
                                    value += ',' + options[o].value.Trim();
                                }
                            }
                        }
                        value = value ? value.substring(1) : value;
                    }
                } else if (/^checkbox$|^radio$/.test(item.type)) {
                    if (input.length) {
                        for (var i = 0; i < input.length; i++) {
                            if (input[i].checked && !input[i].disabled) {
                                value += ',' + input[i].value.Trim();
                            }
                        }
                        value = value ? value.substring(1) : value;
                    } else {
                        if (input.checked && !input.disabled) {
                            value = input.value.Trim();
                        }
                    }
                } else {
                    if (!input.disabled && typeof(input.value) !== 'undefined') {
                        value = input.value.Trim();
                    }
                }
                return value;
            }, setData: function (data) {
                var _this = this;
                for (var o in data) {
                    if (data.inputs.hasOwnProperty(o)) {
                        _this[o] = data[o];
                    }
                }
            }, submit: function (params) {
                var _this = this;
                _this.params = _this.params || params;
                if (!_this.params || _this.submiting) return;
                if (_this.before) _this.before.call(_this);
                var _params = {};
                if (_this.data) {
                    var len = 0;
                    T.Each(_this.params, function (k, v) {
                        if (_this.params[k] !== _this.data[k]) {
                            _params[k] = v;
                            len++;
                        }
                    });
                    if (len < 1) return false;
                } else {
                    _params = _this.params;
                }
                _this.params = _params;
                if (!_this.action) return;
                T.loading();
                _this.submiting = true;
                T.POST({
                        action: _this.action,
                        params: _this.params,
                        issid: _this.issid,
                        issource: _this.issource,
                        success: function (data) {
                            T.loading(true);
                            _this.submiting = false;
                            if (_this.success) _this.success.call(_this, data, _this.params);
                        },
                        failure: function (data) {
                            T.loading(true);
                            _this.submiting = false;
                            if (_this.failure) _this.failure.call(_this, data, _this.params);
                        },
                        error: function (data) {
                            T.loading(true);
                            _this.submiting = false;
                            if (_this.error) _this.error.call(_this, data, _this.params);
                        }
                    }
                    , function (data) {
                        _this.submiting = false;
                        T.loading(true);
                        if (data.result == 3) {
                            T.LoginForm();
                        } else {
                            T.alt(T.TIPS.DEF);
                        }
                    }, function (data) {
                        _this.submiting = false;
                        T.loading(true);
                        T.alt(T.TIPS.DEF);
                    });
                if (_this.after) _this.after(_this);
            }, success: function (data) {
                var _this = this;
                _this.submiting = false;
                T.loading(true);
                if (data.msg && data.msg.length > 15) {
                    T.alt(data.msg)
                } else {
                    T.msg(data.msg || '操作成功。');
                }
            }, failure: function (data) {
                var _this = this;
                _this.submiting = false;
                T.loading(true);
                if (data.msg && data.msg.length > 15) {
                    T.alt(data.msg)
                } else {
                    T.msg(data.msg || '操作失败！');
                }
            }, error: function (data) {
                var _this = this;
                _this.submiting = false;
                T.loading(true);
                T.alt(data && data.msg || 'Unknown error!', function (_o) {
                    _o.remove();
                    window.location.reload();
                }, function (_o) {
                    _o.remove();
                    window.location.reload();
                });
            }, keydownEnter: function (e, obj) {
                T.DOM.stopPropagation(e);
                e = e || event;
                var keycode = e.keyCode || e.which;
                if (keycode === 13) {
                    obj.form.submit();
                }
            }, placeholder: function (o, t) {
                var _this = this;
                return (function (obj, text) {
                    if (!obj) return;
                    var _obj = document.createElement(obj.tagName.toLowerCase());
                    _obj.className = obj.className;
                    _obj.setAttribute('autocomplete', 'off');
                    if (obj.tagName.toLowerCase() === 'input') _obj.type = 'text';
                    obj.parentNode.appendChild(_obj);
                    if (obj.getAttribute('disabled'))
                        _obj.setAttribute('disabled', 'disabled');

                    function _focus(e) {
                        //if (T.DOM.hasClass(obj, 'placeholder')) {
                        //obj.value = '';
                        var val = obj.value.Trim();
                        T.DOM.removeClass(obj, 'placeholder');
                        _obj.style.display = 'none';
                        obj.focus();
                        if (val == '') obj.value = '';
                        //}
                    }

                    function _blur() {
                        var val = obj.value.Trim();
                        if (val === '') {
                            T.DOM.addClass(obj, 'placeholder');
                            T.DOM.addClass(_obj, 'placeholder');
                            _obj.style.cssText = 'position:absolute;left:' + obj.offsetLeft + 'px;top:' + obj.offsetTop + 'px;display:none;_zoom:1;';
                            _obj.style.display = '';
                            _obj.value = text;
                        } else {
                            T.DOM.removeClass(obj, 'placeholder');
                            _obj.style.display = 'none';
                        }
                    }

                    T.DOM.bind(_obj, 'focus', _focus);
                    T.DOM.bind(obj, 'focus', _focus);
                    T.DOM.bind(obj, 'blur', _blur);
                    _blur();
                })(o, t);
            }
        };
        return new Form(f, cfg, fns);
    };
    T.Mailfix = function (options) {
        options = options || {};
        var self = this, UI = {};
        if (!FIXS || !FIXS.length || typeof FIXS !== 'object') return;
        UI.container = document.body || document.documentElement;
        if (!UI.container) return;
        UI.inputs = document.getElementsByName(options.name || 'mail') || [];
        if (options.inputs && UI.inputs.length) UI.inputs = options.inputs || [];
        if (!UI.inputs || !UI.inputs.length) return;
        UI.maxlength = 5;
        UI.trim = function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        };
        UI.addEvent = function (target, name, handler) {
            window.addEventListener ? target.addEventListener(name, handler, false) : target.attachEvent('on' + name, handler);
        };
        UI.stopPropagation = function (e) {
            if (e && e.stopPropagation) e.stopPropagation();
            else window.event.cancelable = false;
        };
        UI.preventDefault = function (e) {
            if (e && e.preventDefault) e.preventDefault();
            else window.event.returnValue = false;
        };
        UI.offset = function (obj) {
            var pos = {top: 0, left: 0};
            var getPos = function (obj) {
                if (obj) pos.top += obj.offsetTop, pos.left += obj.offsetLeft, getPos(obj.offsetParent);
            }
            getPos(obj);
            return pos;
        };
        UI.closest = function (obj, className) {
            var _parent = function (o) {
                var tn = o.tagName.toUpperCase();
                return tn === 'HTML' ? null : (o.className.indexOf(className) >= 0 ? o : _parent(o.parentNode));
            }
            return _parent(obj);
        };
        UI.fixs = FIXS;
        UI.size = FIXS.length;
        UI.index = 0;
        UI.items = null;
        UI.item = null;
        UI.length = 0;
        UI.search = function (e) {
            e = e || window.event;
            var keycode = e.keyCode || e.which;
            if (keycode == 13 || keycode == 38 || keycode == 40) return;
            UI.hide();
            if (this && this.nodeType) UI.input = this;
            var value = UI.trim(UI.input.value || '');
            UI.value = value;
            if (UI.value === '') return;
            UI.fixs = FIXS;
            UI.fix = '';
            var idx = UI.value.lastIndexOf('@');
            if (idx > 0) UI.fix = UI.value.substring(idx);
            if (UI.fix != '' && typeof UI.fix != 'undefined') {
                UI.fixs = [];
                var size = UI.fix.length;
                for (var o = null, l = 0, i = 0; i < UI.size; i++) {
                    o = FIXS[i];
                    l = o.length;
                    if (size <= l && UI.fix === o.substring(0, size)) UI.fixs.push(o.substring(size));
                }
                ;
            }
            if (UI.fixs.length) UI.show();
        };
        UI.position = function () {
            var offset = UI.offset(UI.input);
            var pos = UI.offset(UI.container);
            UI.dom.style.top = offset.top + UI.input.offsetHeight - pos.top + 'px';
            UI.dom.style.left = offset.left - pos.left + 'px';
        };
        UI.hover = function () {
            UI.index = UI.index < 0 ? UI.length - 1 : UI.index;
            UI.index = UI.index >= UI.length ? 0 : UI.index;
            for (var i = UI.length - 1; i >= 0; i--) {
                UI.items[i].className = UI.index == i ? 'selected' : '';
            }
            UI.item = UI.items[UI.index];
            if (UI.item) UI._value = UI.item.innerHTML;
        };
        UI.keydown = function (e) {
            if (UI.dom) {
                e = e || event;
                var keycode = e.keyCode || e.which;
                if (keycode == 13) {
                    //UI.preventDefault(e);
                    if (UI.item) UI.input.value = UI.item.innerHTML;//UI.item.click();
                    UI.hide();
                    //UI.input.blur(); //woo 2014-07-02
                } else if (keycode == 38) {//上
                    UI.preventDefault(e);
                    UI.index--;
                    UI.hover();
                } else if (keycode == 40) {//下
                    UI.preventDefault(e);
                    UI.index++;
                    UI.hover();
                }
            }
        };
        UI.click = function (e) {
            var li = this;
            UI.input.value = li.innerHTML;
            UI.hide();
            UI.input.blur();
        };
        UI.show = function () {
            if (this && this.nodeType) UI.input = this;
            UI.selectedIndex = 0;
            if (UI.dom) {
                UI.dom.parentNode.removeChild(UI.dom);
                UI.dom = null;
            }
            UI.dom = document.createElement('div');
            UI.dom.className = 'association';
            var cont = UI.closest(UI.input, 'popup_layer');
            if (cont) UI.container = cont;
            UI.container.appendChild(UI.dom);
            if (!T.IS.fixed) UI.dom.innerHTML = '<div class="popup_opacity"><iframe frameborder="0" scrolling="no"></iframe></div>';
            UI.list = document.createElement('ul');
            UI.dom.appendChild(UI.list);
            UI.dom.style.width = UI.input.offsetWidth - 2 + 'px';

            UI.count = Math.min(UI.fixs.length, UI.maxlength);
            var html = (T.RE.mobile.test(UI.value)) ? '<li class="selected">' + UI.value + '</li>' : '';
            for (var fix = '', i = 0; i < UI.count; i++) {
                html += '<li' + (html ? '' : ' class="selected"') + '>' + UI.value + UI.fixs[i] + '</li>';
            }
            UI.list.innerHTML = html;
            UI.position();
            UI.items = UI.list.getElementsByTagName("li");
            UI.length = UI.items.length;
            UI.index = 0;
            UI.hover();
            for (var item = null, i = 0; i < UI.length; i++) {
                item = UI.items[i];
                item.onclick = function () {
                    return function (e) {
                        UI.click.call(this, e);
                    }
                }();
            }
            ;
            UI.dom.onmousedown = function (e) {
                UI.stopPropagation(e);
                UI.preventDefault(e);
            };
            UI.dom.onmouseenter = function (e) {
                UI.input.onblur = null;
            }
            UI.dom.onmouseleave = function (e) {
                UI.input.onblur = UI.hide;
            }
            UI.input.onblur = UI.hide;
        };
        UI.hide = function (isChange) {
            if (UI.dom) {
                UI.dom.parentNode.removeChild(UI.dom);
                UI.dom = null;
            }
        };
        for (var len = UI.inputs.length, i = 0; i < len; i++) {
            UI.inputs[i].onfocus = UI.search;
            UI.inputs[i].onkeyup = UI.search;
            UI.inputs[i].onblur = UI.hide;
            UI.inputs[i].setAttribute('autocomplete', 'off');
        }
        if (window.addEventListener) {
            document.addEventListener('keydown', UI.keydown, true);
        } else if (window.attachEvent) {
            document.attachEvent('onkeydown', UI.keydown);
        } else {
            document['onkeydown'] = UI.keydown;
        }
    };
    T.GetEmilLoginURL = function (email) {//根据邮箱帐号得到邮箱登录地址
        var urls = {
            '139.com': 'mail.10086.cn',
            'wo.com.cn': 'mail.wo.cn',
            'sina.cn': 'mail.sina.com.cn',
            'sina.com': 'mail.sina.com.cn',
            '2008.sina.com': 'mail.sina.com.cn',
            'vip.sina.com': 'vip.sina.com.cn',
            '3g.sina.com': '3g.sina.com.cn',
            'foxmail.com': 'mail.qq.com',
            'yahoo.com': 'login.yahoo.com',
            'yahoo.com.cn': 'login.yahoo.com',
            '56.com': 'www.56.com/home.html',
            'msn.com': 'login.live.com',
            'hotmail.com': 'login.live.com',
            'live.com': 'login.live.com',
            'aol.com': 'my.screenname.aol.com',
            'ask.com': 'www.ask.com',
            'aim.com': 'my.screenname.aol.com',
            'inbox.com': 'www.inbox.com/login.aspx',
            'tom.com': 'web.mail.tom.com',
            'eyou.com': 'www.eyou.com',
            'googlemail.com': 'mail.google.com',
            'ininin.com': 'exmail.qq.com/login/'
        };
        var idx = email.indexOf('@');
        if (idx < 0) return '';
        email = email.substring(idx + 1);
        var url = urls[email];
        if (url) return 'http://' + url;
        else {
            if (/\w+\.\w+\.\w+/.test(email)) return 'http://' + email;
            else return 'http://mail.' + email;
        }
    };
    T.Paginbar = function (pagin) {//分页条
        pagin = pagin || {};
        pagin.index = parseInt(pagin.index, 10) || 1;//当前页
        pagin.total = parseInt(pagin.total, 10) || 1;//总页数
        pagin.size = parseInt(pagin.size, 10) || 15;//每页记录数
        pagin.num = parseInt(pagin.num, 10) || 3;
        if (pagin.index > pagin.total) pagin.index = 1;
        if (!pagin.paginbar) return;
        pagin.paginbar = document.getElementById(pagin.paginbar);
        if (!pagin.paginbar) return;
        T.DOM.addClass(pagin.paginbar, 'hide');
        pagin.paginbar.innerHTML = '';
        if (pagin.total < 2) return;
        T.DOM.removeClass(pagin.paginbar, 'hide');

        function createPageLabel(tag, cla, tit, txt, callback) {
            var obj = document.createElement(tag);
            obj.className = cla;
            obj.title = tit;
            if (tag === 'input') {
                obj.value = txt;
            } else {
                obj.innerHTML = txt;
            }
            if (tag === 'a') obj.href = 'javascript:;';
            pagin.paginbar.appendChild(obj);
            if (callback) {
                obj.onclick = function (o, i, s, t) {
                    return function (e) {
                        callback(o, i, s, t);
                    };
                }(obj, tit, pagin.size, pagin.total);
            }
            return obj;
        }

        var pages = [];
        if (pagin.index > 1) {
            createPageLabel('a', 'start', 1, '首页', pagin.callback);
            createPageLabel('a', 'prev', pagin.index - 1, '上一页', pagin.callback);
        }
        if (pagin.total <= 2 * pagin.num + 4) {//小于2*pagin.num页
            for (var index = 1; index <= pagin.total; index++) {
                if (index == pagin.index) createPageLabel('b', 'dis', index, index);
                else createPageLabel('a', '', index, index, pagin.callback);
            }
        } else {//大于2*pagin.num页
            var total = Math.min(pagin.index + pagin.num, pagin.total);
            var index = Math.max(pagin.index - pagin.num, 1);
            /*
             * 如果当前页靠近首页，则省略中间页码
             * 如果当前页靠近尾页，则省略中间页码
             * 如果当前页在中间，则省略两端页码
             */
            var _left = pagin.index < index + pagin.num;
            var _right = pagin.index > total - pagin.num;
            var center = (pagin.index >= index + pagin.num) && (pagin.index <= total - pagin.num);
            console.log('center', center, pagin.num, pagin.index, index, total)
            if (center) {
                if (index > 1) createPageLabel('a', 'ellipsis', index, '...', pagin.callback);
                for (index; index <= total; index++) {
                    if (index == pagin.index) createPageLabel('b', 'dis', index, index);
                    else createPageLabel('a', '', index, index, pagin.callback);
                }
                ;
                if (total < pagin.total) createPageLabel('a', 'ellipsis', index, '...', pagin.callback);
            } else {
                if (_left) total = Math.min(index + 2 * pagin.num, pagin.total);
                if (_right) index = Math.max(total - 2 * pagin.num, 1);
                var num = index;
                console.log(index, total);
                if (_right && total > 2 * pagin.num) createPageLabel('a', 'ellipsis', index, '...', pagin.callback);
                for (index; index <= total; index++) {
                    if (index == pagin.index) createPageLabel('b', 'dis', index, index);
                    else createPageLabel('a', '', index, index, pagin.callback);
                }
                if (_left) createPageLabel('a', 'ellipsis', index, '...', pagin.callback);
            }
        }
        if (pagin.index < pagin.total) {
            createPageLabel('a', 'next', pagin.index + 1, '下一页', pagin.callback);
            createPageLabel('a', 'end', pagin.total, '尾页', pagin.callback);
        }
        if (pagin.total > 2 * pagin.num + 4) {//小于2*pagin.num页
            createPageLabel('span', 'txt', '', '到第');
            var input = createPageLabel('input', 'input', '', '1');
            input.onblur = function () {
                var val = parseInt(input.value.Trim(), 10) || 1;
                if (val < 1) val = 1;
                if (val > pagin.total) val = pagin.total;
                input.value = val;
            };
            createPageLabel('span', 'txt', '', '页');
            createPageLabel('a', 'go', '确定', '确定', function () {
                if (pagin.callback) pagin.callback(input, input.value, pagin.size, pagin.total)
            });
        }
    };
    /**
     * @根据ID绑定数据
     * @method Template
     * @param {String} [uuid] DOM节点ID标识
     * @param {Object} [data] 数据源（对象）
     */
    /*if (typeof(template) == "undefined" && typeof(Utils) == "object") {
        template = require(["template"]);
    }*/
    T.Template = function (uuid, viewId, data, type) {
        if (typeof(viewId) == "object") {
            type = data;
            data = viewId;
            viewId = uuid;
        }
        data = data || {};
        data.RMB = T.RMB;
        data.Number = Number;
        data.CFG = T.CFG || {};
        data.DOING = T.DOING;
        data.DOMAIN = T.DOMAIN || {};
        data.DeliveryDate = T.DeliveryDate;
        if (type) {
            var temp = document.getElementById('template-' + uuid);
            var view = document.getElementById('template-' + viewId + '-view');
            if (temp && view) {
                view.innerHTML = Utils.Compiler.template("template-" + uuid, data);
                return view;
            }
        } else {
            var temp = document.getElementById('template_' + uuid);
            var view = document.getElementById('template_' + viewId + '_view');
            if (temp && view) {
                view.innerHTML = Utils.Compiler.templateNative('template_' + uuid, data);
                return view;
            }
        }
    };
    /**
     * @根据ID绑定数据
     * @method BindData
     * @param {Object} [data] 数据源（对象）
     */
    T.BindData = function (k, data, flag) {
        k = k ? k + (flag ? '-' : '_') : '';
        T.Each(data, function (key, value) {
            if (T.Typeof(value, /array|Object/)) {
                T.BindData(k + key, value, flag);
            } else {
                var obj = document.getElementById(k + key);
                if (obj) {
                    var tn = ('' + obj.tagName).toLowerCase();
                    value = typeof value == 'undefined' ? '' : value;
                    value = /price/i.test(key) ? T.RMB(value) : value;
                    if (/input|textarea/.test(tn)) {
                        obj.value = value;
                    } else if (/img/.test(tn)) {
                        obj.src = value;
                    } else if (/select/.test(tn)) {
                        obj.src = value;
                        var options = obj.options;
                        for (var o = 0; o < options.length; o++) {
                            if (options[o].value.Trim() == value)
                                options[o].selected = true;
                        }
                    } else {
                        obj.innerHTML = value;
                    }
                }
            }
        });
    };
    T.RMB = function (num, isSign) {
        num = parseFloat(num, 10) || 0;
        if (typeof num !== 'number') return '0.00';
        num = Math.round(num * 100) / 100;
        num = num.toString();
        var res = '';
        var idx = num.indexOf('.');
        if (idx < 0) {
            res = num + '.00';
        } else {
            idx++;
            res = num.substring(0, idx);
            var len = num.length;
            for (var i = idx; i < idx + 2; i++) {
                res += i < len ? num.charAt(i) : '0';
            }
            ;
        }
        ;
        return res < 0 ? '0.00' : res;
    };
    T.GetChecked = function (dom, name, isRadio, enabled) {
        if (!name) return null;
        var chks = [];
        var type = isRadio ? 'radio' : 'checkbox';
        var inputs = T.DOM.byTagName(dom, 'input');
        for (var input = null, i = 0; input = inputs[i]; i++) {
            if (input && input.type == type && input.name == name) {
                if (enabled) {
                    if (input.checked && !input.disabled) chks.push(input.value);
                } else {
                    if (input.checked) chks.push(input.value);
                }
            }
        }
        return chks;
    };
    T.Checkboxs = function (dom, name, nameall, callback) {
        if (!name) return;
        if (nameall !== null) nameall = nameall || name + 'all';
        var inputs = T.DOM.byTagName(dom, 'input');
        for (var input = null, i = 0; input = inputs[i]; i++) {
            if (input && input.type == 'checkbox' && (input.name === name || input.name === nameall)) {
                input.onclick = function (o) {
                    return function (e) {
                        checked(o, o.checked);
                        if (o.name === nameall) chkeckall(o, o.checked);
                        else chkeckall(o, check(), true);
                    };
                }(input);
            }
        }

        function chkeckall(o, chk, chkall) {
            var inputs = T.DOM.byTagName(dom, 'input');
            for (var input = null, i = 0; input = inputs[i]; i++) {
                if (chkall) {
                    if (input && input.type == 'checkbox' && input.name === nameall) checked(input, chk);
                } else {
                    if (input && input.type == 'checkbox' && (input.name === name || input.name === nameall)) checked(input, chk);
                }
            }
        }

        function check() {
            var checked = true;
            var inputs = T.DOM.byTagName(dom, 'input');
            for (var input = null, i = 0; input = inputs[i]; i++) {
                if (input && input.type == 'checkbox' && input.name === name) {
                    if (!input.checked) return false;
                }
            }
            return true;
        }

        function checked(o, chk) {
            chk ? o.checked = true : o.checked = false;
            chk ? T.DOM.addClass(T.DOM.closest(o, '.checkbox'), 'sel') : T.DOM.removeClass(T.DOM.closest(o, '.checkbox'), 'sel');
            if (callback) callback.call(o, o, o.checked);
        }
    };
    ;(function (T) {
        /**
         * 图片验证码
         * @param options
         * @returns {{getValue: getValue, verify: verify, refresh: refresh}}
         * @constructor
         */
        function Captcha(options, callbacks) {
            var _this = this,
                opts = options || {};
            opts.img = opts.img || "img"; //图片
            opts.input = opts.input || "input[name='captcha']"; //输入框
            opts.account = opts.account || "input[name='account']"; //账号输入框
            opts.refresh = opts.refresh || ".refresh"; //刷新按钮
            _this.options = opts;
            _this.callbacks = callbacks || {};
            _this.init();
        }

        Captcha.prototype = {
            data: {
                token: "" //图片验证码的唯一码
            },
            init: function () {
                var _this = this,
                    opts = _this.options;
                _this.$cont = $(opts.cont); //验证码容器
                _this.$img = $(opts.img, _this.$cont); //验证码图片
                _this.$input = $(opts.input, _this.$cont); //验证码输入框
                _this.$account = $(opts.account); //账号输入框
                _this.$img.off("click.captcha").on("click.captcha", function (e) {
                    _this.refresh();
                });
                $(opts.refresh, _this.$cont).off("click.captcha").on("click.captcha", function (e) {
                    _this.refresh();
                });
                _this.refresh();
            },
            /**
             * 获取输入的验证码
             * @returns {*}
             */
            getValue: function () {
                var _this = this;
                return $.trim(T.toDBC(_this.$input.val()));
            },
            /**
             * 校验验证码
             */
            verify: function () {
                var _this = this,
                    opts = _this.options,
                    callbacks = _this.callbacks;
                var code = _this.getValue();
                if (_this.verifying && !_this.data.token) return;
                _this.verifying = false;
                if (_this.data.token && code) {
                    _this.verifying = true;
                    T.GET({
                        action: "in_common/captcha/captcha_verify",
                        params: {
                            token: _this.data.token,
                            capt_val: code
                        },
                        success: function (data, params) {
                            _this.verifying = false;
                            //验证码校验通过，继续业务处理
                            callbacks.success && callbacks.success.call(_this, data.verify_code);
                        },
                        failure: function (data, params) {
                            _this.verifying = false;
                            //验证码校验通过，刷新验证码，提示用户重新输入
                            T.msg(data.msg || "输入验证码有误，请重新输入");
                            _this.refresh();
                        }
                    }, function (data, params) {
                        _this.verifying = false;
                        T.msg(data.msg || "输入验证码有误，请重新输入");
                        _this.refresh();
                    }, function (data, params) {
                        _this.verifying = false;
                        T.msg(data.msg || "输入验证码有误，请重新输入");
                        _this.refresh();
                    });
                    _this.data.token = "";
                } else if (!code) {
                    T.msg("请输入验证码");
                    _this.refresh();
                } else {
                    T.msg("验证码已失效，请重新输入");
                    _this.refresh();
                }
            },
            /**
             * 加载验证码
             */
            refresh: function () {
                var _this = this,
                    opts = _this.options,
                    callbacks = _this.callbacks;
                //获取唯一码
                T.GET({
                    action: "in_common/captcha/get_token",
                    success: function (data, params) {
                        _this.data.token = data.token || "";
                        //加载验证码
                        _this.$img.attr("src", T.DOMAIN.ACTION + "in_common/captcha/get_captcha?" + T.ConvertToQueryString({token: _this.data.token}));
                        //刷新时回掉函数
                        callbacks.refresh && callbacks.refresh.call(_this, _this.data.token);
                    },
                    failure: function (data, params) {
                        _this.refresh();
                    }
                });
            }
        };
        T.Captcha = function (options, callbacks) {
            return new Captcha(options, callbacks);
        };
    }(T));
    ;(function (T) {
        /**
         * 发送验证码到手机
         * @param options
         * @returns {{getValue: getValue, verify: verify, refresh: refresh}}
         * @constructor
         */
        function CaptchaToPhone(options, callbacks) {
            this.options = options || {};
            this.callbacks = callbacks || {};
            this.init();
        }

        CaptchaToPhone.prototype = {
            init: function () {
                var _this = this,
                    opts = _this.options,
                    callbacks = _this.callbacks;
                opts.popupId = opts.popupId || "captcha-popup";
                opts.trigger = opts.trigger || "#captcha_to_phone"; //触发按钮
                opts.text = opts.text || "发送验证码"; //按钮默认文字
                opts.sendText = opts.sendText || "发送成功"; //按钮发送成功文字
                opts.account = opts.account || "#account"; //账号输入框
                opts.username = opts.username || ""; //账号，可直接传入
                opts.interval = opts.interval || 60; //间隔时间内不能重复发送，单位：秒
                opts.successTip = opts.successTip == null ? "发送验证码成功" : opts.successTip; //成功提示信息，不传会使用默认提示语，传空字符则不显示

                _this.$account = $(opts.account); //账号输入框
                _this.$trigger = $(opts.trigger); //触发按钮
                _this.data = {};
                _this.$trigger.off("click.captcha").on("click.captcha", function (e) {
                    if (_this.$trigger.hasClass("dis")) return;
                    var captcha;
                    //显示验证码弹出框
                    $("#" + opts.popupId).remove();
                    _this.popup = T.cfm('<div id="' + opts.popupId + '" class="forms form_vcode"><input type="text" class="vcode" value="" name="captcha"/><img class="img" src=""/><a class="refresh" href="javascript:;">看不清楚<br/>换一张</a></div>', function () {
                        captcha && captcha.verify();
                        return false;
                    }, function (_o) {
                        _o.remove();
                    }, "请输入图片验证码", "发 送");
                    captcha = T.Captcha({
                        cont: "#" + opts.popupId
                    }, {
                        success: function (verify_code) {
                            _this.sendCode(verify_code);
                        }
                    });
                });
            },
            /**
             * 发送手机验证码
             */
            sendCode: function (verify_code) {
                var _this = this,
                    opts = _this.options,
                    callbacks = _this.callbacks,
                    account = $.trim(T.toDBC(opts.username || _this.$account.val()));
                if (verify_code && account) {
                    var step = opts.interval;
                    _this.$trigger.addClass("dis").text(opts.sendText + "（" + step + "）");
                    _this.timer = setInterval(function () {
                        if (step > 1) {
                            step--;
                            _this.$trigger.text(opts.sendText + "（" + step + "）");
                        } else {
                            _this.reset();
                        }
                    }, 1000);
                    if (_this.popup && _this.popup.remove) {
                        _this.popup.remove();
                        _this.popup = null;
                    }
                    setTimeout(function () {
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
                            T.msg(data.msg || "发送失败，请重新发送！");
                        }
                    });
                } else if (!account) {
                    T.msg("请先填写手机号")
                } else if (!verify_code) {
                    T.msg("请先填写图片验证码")
                }
            },
            /**
             * 重置按钮
             */
            reset: function () {
                var _this = this,
                    opts = _this.options;
                if (_this.timer) {
                    clearInterval(_this.timer);
                    _this.timer = null;
                }
                _this.$trigger.removeClass("dis").text(opts.text);
            }
        };
        T.CaptchaToPhone = function (options, callbacks) {
            return new CaptchaToPhone(options, callbacks);
        };
    }(T));
    T.KeydownEnter = function (e, obj) {
        var form;// = T.GetForm();
        if (form) {
            T.DOM.stopPropagation(e);
            e = e || event;
            var keycode = e.keyCode || e.which;
            if (keycode === 13) {
                form.submit();
            }
        }
    };
    //计算出货日期
    T.DeliveryDate = function (dateStr, delivery, type) {
        dateStr = dateStr || '';
        delivery = parseInt(delivery, 10) || 0;
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        today = today.getTime();
        var date = dateStr ? new Date(dateStr.replace(/-/g, '/')) : new Date();//当前日期
        var dayTime = 24 * 60 * 60 * 1000;//一天的毫秒数
        var isToday = date.getHours() <= 24;//出货日期是否从当天算起
        if (!isToday) {//如果当天24点之后下单，货期多加一天
            delivery += 1;
        }
        /*2015
         一、元旦：1月1日至3日放假调休，共3天。1月4日（星期日）上班。
         　　二、春节：2月18日至24日放假调休，共7天。2月15日（星期日）、2月28日（星期六）上班。
         　　三、清明节：4月5日放假，4月6日（星期一）补休。
         　　四、劳动节：5月1日放假，与周末连休。
         　　五、端午节：6月20日放假，6月22日（星期一）补休。
         　　六、中秋节：9月27日放假。
         　　七、国庆节：10月1日至7日放假调休，共7天。10月10日（星期六）上班。
         */
        //var DATE_HOLIDAY = ',1-1,1-2,1-3,2-18,2-19,2-20,2-21,2-23,2-24,4-5,4-6,5-1,6-20,6-22,9-27,10-1,10-2,10-3,10-4,10-5,10-6,10-7,';//节日
        //var DATE_ADJUST_DUTY = ',1-4,2-15,2-28,10-10,';//调班
        /*2016
         一、元旦：1月1日放假，与周末连休。
         二、春节：2月7日至13日放假调休，共7天。2月6日（星期六）、2月14日（星期日）上班。
         三、清明节：4月4日放假，与周末连休。
         四、劳动节：5月1日放假，5月2日（星期一）补休。
         五、端午节：6月9日至11日放假调休，共3天。6月12日（星期日）上班。
         六、中秋节：9月15日至17日放假调休，共3天。9月18日（星期日）上班。
         七、国庆节：10月1日至7日放假调休，共7天。10月8日（星期六）、10月9日（星期日）上班。
         */
        //var DATE_HOLIDAY = ',1-1,1-2,1-3,2-5,2-6,2-7,2-8,2-9,2-10,2-11,2-12,2-13,4-2,4-3,4-4,4-30,5-1,5-2,6-9,6-10,6-11,9-15,9-16,9-17,10-1,10-2,10-3,10-4,10-5,10-6,10-7,';//节日
        //var DATE_ADJUST_DUTY = ',2-14,6-12,9-18,10-8,10-9,';//调班

        /* 一、元旦：1月1日放假，1月2日（星期一）补休。
     　　二、春节：1月27日至2月2日放假调休，共7天。1月22日（星期日）、2月4日（星期六）上班。
     　　三、清明节：4月2日至4日放假调休，共3天。4月1日（星期六）上班。
     　　四、劳动节：5月1日放假，与周末连休。
     　　五、端午节：5月28日至30日放假调休，共3天。5月27日（星期六）上班。
     　　六、中秋节、国庆节：10月1日至8日放假调休，共8天。9月30日（星期六）上班。*/
        //var DATE_HOLIDAY = ',1-1,1-2,1-27,1-28,1-29,1-30,1-31,2-1,2-2,4-2,4-3,4-4,4-29,4-30,5-1,5-28,5-29,5-30,10-1,10-2,10-3,10-4,10-5,10-6,10-7,10-8,';//节日
        //var DATE_ADJUST_DUTY = ',1-2,1-22,2-4,4-1,5-27,9-30,';//调班

        /* 一、元旦:1月1日放假，与周末连休。
        二、春节:2月15日至21日放假调休，共7天。2月11日(星期日)、2月24日(星期六)上班。
        三、清明节:4月5日至7日放假调休，共3天。4月8日(星期日)上班。
        四、劳动节:4月29日至5月1日放假调休，共3天。4月28日(星期六)上班。
        五、端午节:6月18日放假，与周末连休。
        六、中秋节:9月24日放假，与周末连休。
        七、国庆节:10月1日至7日放假调休，共7天。9月29日(星期六)、9月30日(星期日)上班。*/
        var DATE_HOLIDAY = ',1-1,1-2,2-15,2-16,2-17,2-18,2-19,2-20,2-21,4-5,4-6,4-7,4-29,4-30,5-1,6-18,6-19,9-24,9-25,10-1,10-2,10-3,10-4,10-5,10-6,10-7,';//节日
        var DATE_ADJUST_DUTY = ',2-11,2-24,4-8,4-28,9-29,9-30,';//调班

        var startTime = date.getTime();//当前时间毫秒数
        //var sunday = 0;//找出所有的周天，从下单当天开始计算
        for (var i = 0; i <= delivery; i++) {
            var d = new Date(startTime + i * dayTime);
            if (d.getDay() == 0 || (d.getFullYear() == 2018 && DATE_HOLIDAY.indexOf(',' + (d.getMonth() + 1) + '-' + d.getDate() + ',') >= 0)) {//每遇一个周天向后顺延一天
                delivery++;
            } else if (d.getDay() == 0 && (d.getFullYear() == 2018 && DATE_ADJUST_DUTY.indexOf(',' + (d.getMonth() + 1) + '-' + d.getDate() + ',') >= 0)) {
                delivery--;
            }
        }
        var endTime = startTime + delivery * dayTime;//发货时间毫秒数

        if (endTime < today) {//如果出货日期小于今天，则不提示
            return '';
        }
        var day = '', days = (endTime - today) / dayTime;
        if (days < 1) {
            day = '今天';
        } else if (days < 2) {
            day = '明天';
        } else if (days < 3) {
            day = '后天';
        }
        //var str = new Date(endTime).Format('yyyy年mm月dd日').replace('年0','年').replace('月0','月');
        var str = new Date(endTime).Format('mm月dd日').replace(/^0/, '').replace('月0', '月');
        str = day ? day + '（' + str + '）' : str;
        if (type == 1) {
            if (isToday) {//<span class="alt">（指从投入生产到生产完成的时间，不包含配送）</span>
                //17:00前下单并支付，
                str = '<span>预计</span><b>' + str + '</b><span>从工厂发出货物</span><a class="lnk" href="' + T.DOMAIN.FAQ + 'distribution.html#1" target="_blank">生产周期说明</a>';
            } else {
                //现在下单并支付，
                str = '<span>预计</span><b>' + str + '</b><span>从工厂发出货物</span><a class="lnk" href="' + T.DOMAIN.FAQ + 'distribution.html#1" target="_blank">生产周期说明</a>';
            }
        } else if (type == 2) {
            //str = '<span>预计</span><b>'+str+'</b><span>出货</span>';
            str = str;
        }
        return str;
    };
    /**
     * 判断商品是否为安装服务
     * @param {String} productId
     * @returns {number}
     * @constructor
     */
    T.IsInstallService = function (productId) {
        var result = 0;
        if (CFG_DB.ISP[productId]) {
            result = 1;
        }
        return result;
    };
    T.PageLoaded = function () {
        $(".main").removeClass("load").addClass("mained");
        //T.SetPassport(T._USERKEY);
    };
    T.Loader = function (func) {
        if (window.addEventListener) {
            func();//调用当前事件函数
        } else {
            $(function () {
                func();//调用当前事件函数
            });
            /*var oldonload = window.onload;//得到旧的onload函数
            if (typeof oldonload != 'function') {//判断是否为'function'类型
                window.onload = func;
            } else {
                window.onload = function () {
                    oldonload();//调用旧的onload函数
                    func();//调用当前事件函数
                }
            }*/
        }
    };
    /**
     * @设置URL参数
     * @method OAuthURL
     * @param {String} [returl] URL（字符串）
     * @param {Object} [params] 参数（对象）
     */
    T.OAuthURL = function (returl, params) {
        if (!returl || !params) return returl;
        var idx = returl.indexOf('?');
        var _params = {};
        if (idx > 0) {
            _params = T.getRequest(returl.substring(idx));
            returl = returl.substring(0, idx);
        }
        _params = T.Inherit(_params, params);
        return returl + (returl.indexOf('?') > 0 ? '&' : '?') + T.ConvertToQueryString(_params);
    };
    T.cookie = function (key, value, options) {
        if (value == null) {
            return Utils.Cookie.get(key);
        } else {
            Utils.Cookie.set(key, "", {expires: -1, path: "/"});
            return Utils.Cookie.set(key, value, options || {path: '/', domain: T.DOMAIN.DOMAIN});
        }
    };
    //T.cookie("guid", T.UUID(32).toUpperCase(), { path: '/', domain: T.DOMAIN.DOMAIN});
    T._STORENAME = '_haidedian@ininin.com_kexingdian@ininin.com_test-store@ininin.com_hq@ininin.com_';//门店账号
    T.SetCookie = function (data, params) {
        data = data || {}, params = params || {};
        if (T._TYPE == 2 && params._action == "check_user") {//超级账号搜索用户
            var _data = T.JSON.parse(T.cookie("_agent_token") || "{}") || {};
            if (_data.sid) {
                _data.user = data;
                data = _data;
            } else {
                return;
            }
        }
        T.cookie("_type", "", {expires: -1, path: '/'});
        T.cookie("_type", "", {expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
        T.cookie("_agent_token", "", {expires: -1, path: '/'});
        T.cookie("_agent_token", "", {expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
        T.cookie("_need_audit", "", {expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
        T.cookie("_user_post", "", {expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
        //设置sid
        if (params.remember == 1) {//记住密码
            T.cookie("sid", data.sid || "", {expires: 1, path: '/', domain: T.DOMAIN.DOMAIN});
            T.cookie("_user_type", 1, {expires: 1, path: '/', domain: T.DOMAIN.DOMAIN});
        } else {
            T.cookie("sid", data.sid || "");
            T.cookie("_user_type", 1);
        }
        if (data.sid && data.type && data.type > 1) { //type=>2:云印门店,3:加盟商
            T.cookie("_agent_token", T.JSON.stringify(data));
            T.cookie("_type", data.type);
        } else {
            //设置新cookie
            T.cookie("_account", data.userName || params.username || "", {
                expires: 100 * 365,
                path: '/',
                domain: T.DOMAIN.DOMAIN
            });
            T.cookie("_nickname", data.nickName || "", {expires: 100 * 365, path: '/', domain: T.DOMAIN.DOMAIN});
            if (data.needAudit == 1) {
                T.cookie("_need_audit", 1, {expires: 100 * 365, path: '/', domain: T.DOMAIN.DOMAIN});
            }
            if (data.post == 1) {
                T.cookie("_user_post", 1, {expires: 100 * 365, path: '/', domain: T.DOMAIN.DOMAIN});
            }
            T.INININ = '';//'ininin='+T.VERSION;
        }
        //data.userSupportQQ = $.trim(data.userSupportQQ);
        //var userSupportQQ = T.getUserSupportQQ(data.userSupportQQ);
        /*if (/^\d+$/.test(data.userSupportQQ)) {
            if (data.userSupportQQ == '938062247') { //小三QQ
                data.userSupportQQ = '4008601846';
            }
            _userSupportQQ = "http://wpa.qq.com/msgrd?v=3&uin=" + data.userSupportQQ + "&site=http://www.ininin.com&menu=yes";
        }*/
        T.cookie("_userSupportQQ", data.userSupportQQ || "");
    };
    //T.cookie("sid", "d5fbf3ed53ef55df15c5297bcf72bb1a", { path: '/', domain: 'ininin.com'});
    //T.cookie("sid","00efeb67017d81d29d7fbd3b7bf26a2f", {path: '/', domain: T.DOMAIN.DOMAIN});
    //T.cookie("_account","zhangyuyi@conwin.cn", {expires: 100*365, path: '/'});
    T.UnCookie = function (isStore, backuri) {
        if (T._TYPE == 2 && !isStore) { //超级账号登陆时=>用户退出
            var _data = T.JSON.parse(T.cookie("_agent_token") || "{}") || {};
            _data.user = {};
            T.cookie("_agent_token", T.JSON.stringify(_data));
        } else {
            T.cookie("_type", "", {expires: -1, path: '/'});
            T.cookie("_type", "", {expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
            T.cookie("_agent_token", "", {expires: -1, path: '/'});
            T.cookie("_agent_token", "", {expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
            T.cookie("sid", "", {expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
            T.cookie("_security_user", "", {expires: -1, path: '/'});
            T.cookie("_security_user", "", {expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
            T.cookie("_user_type", "", {expires: -1, path: '/'});
            T.cookie("_user_type", "", {expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
            T.cookie("_need_audit", "", {expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
            T.cookie("_user_post", "", {expires: -1, path: '/', domain: T.DOMAIN.DOMAIN});
        }
        if (backuri) {
            window.location = backuri;
        } else if (backuri !== 0) {
            setTimeout(function () {
                location.reload();
            }, 10);
        }
        //window.location = T.DOMAIN.WWW + '?ininin='+T.VERSION;
    };
    /*T.SetPassport = function (userkey) {
        return true;
        if (!userkey)return;
        //T.INININ = T.INININ + '&' + 'userkey=' + userkey;
        T.INININ = 'userkey=' + userkey;
        var links = document.getElementsByTagName('a');
        if (links && links.length) {
            for (var i = links.length; i >= 0; i--) {
                var node = links[i];
                if (node && node.getAttribute) {
                    var href = node.getAttribute('href');
                    if (href && href != 'javascript:;' && href.indexOf(T.INININ) < 0 && href.indexOf(T.DOMAIN.CLOUD) < 0) {
                        var idx = href.indexOf('?');
                        var _params = {};
                        if (idx > 0) {
                            _params = T.getRequest(href.substring(idx));
                            href = href.substring(0, idx);
                        }
                        var idx2 = href.indexOf('#'), _hash = '';
                        if (idx2 > 0) {
                            _hash = href.substring(idx2);
                            href = href.substring(0, idx2);
                        }
                        //_params.ininin = T.VERSION;
                        _params.userkey = userkey;
                        node.setAttribute('href', href + (href.indexOf('?') > 0 ? '&' : '?') + T.ConvertToQueryString(_params) + _hash);
                    }
                }
            }
        }
    };*/
    T.Redirect = function (url) {
        if (url) {
            return url;//+(url.indexOf('?')>0?'&':'?')+ T.INININ;
        }
        return '';
    };
    T.NotLogin = function () {
        T.UnCookie(false, T.DOMAIN.PASSPORT + 'index.html#backurl=' + encodeURIComponent(location.href));
        //T.LoginForm();
    };
    T.Advert = function (options) {
        options = options || {};
        options.areaCode = options.areaCode || "";

        function render(item) {
            var size = CFG_DB.ADVERT[item.adAreaCode];
            var cont = "#slider_list_" + item.adAreaCode;
            item.width = item.width || size.width;
            item.height = item.height || size.height;
            $(cont).html(Utils.Compiler.template("slider_list", item));
            Slider({
                cont: cont,
                number: options.number,
                duration: item.carouselTime,
                interval: item.pauseTime,
                direction: "lr",
                autoplay: true
            });
        }

        // options.areaCode //区域编号
        // options.callback //回调函数
        function _failure(data, params) {
            if (options.failure) options.failure();
        }

        if (T.adList) {
            T.Each(options.areaCode.split(","), function (i, areaCode) {
                var item = T.adList[areaCode];
                if (item) {
                    render(item);
                }
            });
        } else {
            T.adList = {};
            var params = {};
            var local = location.href;
            if (options.areaCode) {
                params.areaCode = options.areaCode;
            } else if ($("#slider_list_bhp2").length) {//首页banner
                params.areaCode = "bhp";
            } else if (local.indexOf(T.DOMAIN.NEW + "index.html") === 0) {//云印优品页大banner
                params.areaCode = "superior";
            } else if (local.indexOf(T.DOMAIN.PRODUCT + "index.html") === 0) {//印刷产品页大banner
                params.areaCode = "print";
            } else if (local.indexOf(T.DOMAIN.INKJET + "index.html") === 0) {//喷绘专区页大banner
                params.areaCode = "print1";
            } else if (local.indexOf(T.DOMAIN.DIGITAL + "index.html") === 0) {//数码快印页大banner
                params.areaCode = "print2";
            } else if (local.indexOf(T.DOMAIN.SOLUTION + "index.html") === 0) {//场景解决方案页大banner
                params.areaCode = "scene";
            } else if ($("#slider_list_login").length) {//登录页面banner
                params.areaCode = "login";
            } else if ($("#slider_list_design").length) {//设计频道banner
                params.areaCode = "design";
            } else if ($("#slider_list_designer").length) {//设计师首页banner
                params.areaCode = "designer";
            } else if ($("#slider_list_art1").length) {//设计说大banner
                params.areaCode = "art";
            }
            T.GET({
                action: COM_API.advert,
                params: params,
                success: function (data, params) {
                    data.resultList = data.resultList || [];
                    T.Each(data.resultList, function (i, item) {
                        if (item.adAreaCode == "bhp1") {
                            T.adList[item.adAreaCode] = item;
                            if (item.adContent && item.adContent[0]) {
                                T.Notice(item.adContent[0]);
                            }
                        } else if (item.adAreaCode) {
                            T.adList[item.adAreaCode] = item;
                            render(item);
                        }
                    });
                    if (options.callback) options.callback(data, params);
                }, failure: _failure,
                error: _failure
            }, _failure, _failure);
        }
    };
    //顶部通知栏
    T.Notice = function (notice) {
        if (notice && notice.content) {
            var htmls = [], height = 34, $noticebar;
            htmls.push('<div id="noticebar" class="noticebar">');
            htmls.push('<div class="notice"><div class="text">');
            htmls.push(notice.content);
            htmls.push('</div><a class="close" href="javascript:;"></a></div>');
            htmls.push('</div>');
            $("#header_fixed").prepend(htmls.join(''));
            $noticebar = $("#noticebar");
            htmls = [], height = $noticebar.outerHeight();
            htmls.push('<style type="text/css">');
            htmls.push('body { background-position: center ' + (height + 36) + 'px;}');
            htmls.push('.body_store { background-position: center ' + (height + 72) + 'px;}');
            htmls.push('.header { padding-top: ' + (height + 36) + 'px;}');
            htmls.push('.hfixed { padding-top: ' + (height + 36) + 'px;}');
            htmls.push('.body_store .hfixed { padding-top: ' + (height + 72) + 'px;}');
            htmls.push('</style>');
            $noticebar.prepend(htmls.join(''));
            $("#noticebar .close").click(function (e) {
                $("#noticebar").remove();
            });
        }
    };
    //热销产品
    T.HotSell = function (params, callback) {
        T.GET({
            action: "in_search/product/search",
            params: params || {
                args: "",
                sortField: "sales_volume",
                sortDirection: "desc",
                from: 0,
                size: 12
            },
            success: function (data, params) {
                data.data = data.data || {};
                var hotSell = data.data.data || {}; //热销产品
                data.productList = (hotSell.product || []).slice(0, 5); //标签信息
                data.designList = hotSell.design_product || [];
                T.Each(data.productList, function (index, v) {
                    v.simpleDesc = v.simpleDesc || '';
                    v.productName = v.productName || '';
                    v.simpleDescEllipsis = T.GetEllipsis(v.simpleDesc, v.productName, 46);
                });
                T.Template("hot_sell", data, true);
                callback && callback(data, params);
            },
            failure: function (data) {
            },
            error: function (data) {
            }
        }, function (data) {
        }, function (data) {
        });
    };
    //用户条
    T.TopUserbar = function () {
        var htmls = [location.href.indexOf(T.DOMAIN.DESIGN) == 0 ? '<li><a href="' + T.DOMAIN.WWW + 'index.html" rel="nofollow">返回主页</a></li><li class="vline v1"></li>' : ''];
        htmls.push('<li class="user_logreg"><a name="registerurl" onclick="_czc.push([\'_trackEvent\', \'顶部\', \'去登录\', \'登录\',\'\',\'login_btn\']);" href="' + T.DOMAIN.PASSPORT + 'index.html">登录</a><span class="vline"></span><a id="topregisterurl" name="registerurl" onclick="_czc.push([\'_trackEvent\', \'顶部\', \'去注册\', \'注册\',\'\',\'topregisterurl\']);" href="' + T.DOMAIN.PASSPORT + 'index.html#type=1" rel="nofollow">注册</a></li>');
        htmls.push('<li class="user_name my_about ellipsis"><a id="user_name" class="user_tar" href="' + T.DOMAIN.WWW + 'member/index.html" rel="nofollow"></a>');
        htmls.push('<dl id="ulinks" class="ulinks link_about">');
        htmls.push('<dd><a href="' + T.DOMAIN.WWW + 'member/index.html" rel="nofollow">我的余额</a></dd>');
        //htmls.push('<dd><a href="' + T.DOMAIN.WWW + 'member/myintegral.html" rel="nofollow">我的积分</a></dd>');
        htmls.push('<dd><a href="' + T.DOMAIN.WWW + 'member/mycoupon.html" rel="nofollow">我的优惠券</a></dd>');
        htmls.push('<dd><a href="' + T.DOMAIN.WWW + 'card/index.html#1" rel="nofollow">我的专属模板</a></dd>');
        htmls.push('<dd><a href="<?=DOMAIN_DESIGN?>case/mycollection.html#1" rel="nofollow">我的收藏</a></dd>');
        //htmls.push('<dd><a href="'+ T.DOMAIN.WWW+'member/udetail.html" rel="nofollow">我的基本信息</a></dd>');
        //htmls.push('<dd><a href="'+ T.DOMAIN.WWW+'member/myfile.html" rel="nofollow">我的文件</a></dd>');
        //htmls.push('<dd><a href="'+ T.DOMAIN.WWW+'member/designservice.html" rel="nofollow">赠送设计</a></dd>');
        htmls.push('<dt class="arrows"></dt></dl>');
        htmls.push('</li>');
        htmls.push('<li class="user_logout"><a id="logout_btn" href="javascript:;">退出</a></li>');
        htmls.push('<li class="vline v1"></li>');
        htmls.push('<li class="my_about"><a class="order_tar" href="' + T.DOMAIN.WWW + 'order/index.html" rel="nofollow">待处理订单</a>');
        htmls.push('<dl id="olinks" class="ulinks link_order">');
        htmls.push('<dd><a href="' + T.DOMAIN.WWW + 'order/index.html" rel="nofollow">印刷产品订单（<span id="data_common_count">0</span>）</a></dd>');
        htmls.push('<dd><a href="' + T.DOMAIN.WWW + 'order/design.html" rel="nofollow">设计服务订单（<span id="data_design_count">0</span>）</a></dd>');
        htmls.push('<dd><a href="' + T.DOMAIN.WWW + 'order/package.html" rel="nofollow">账户充值订单（<span id="data_plan_count">0</span>）</a></dd>');
        htmls.push('<dd><a href="' + T.DOMAIN.WWW + 'order/quotation.html" rel="nofollow">商品询价订单（<span id="data_new_count">0</span>）</a></dd>');
        //htmls.push('<dd><a href="' + T.DOMAIN.WWW + 'order/distribute.html" rel="nofollow">多地分发订单（<span id="data_dist_count">0</span>）</a></dd>');
        htmls.push('<dt class="arrows"></dt></dl>');
        htmls.push('</li>');
        htmls.push('<li class="vline v2"></li>');
        htmls.push('<li class="user_sysmsg"><a id="sysmsg" class="sysmsg" href="' + T.DOMAIN.WWW + 'member/message.html" rel="nofollow"><b id="sysmsg_number"></b></a></li>');
        htmls.push('<li class="vline v2"></li>');
        $("#userbar").prepend(htmls.join(''));
        //T.Couponbar();
    };
    //优惠券兑换
    T.Couponbar = function ($couponbar, callback) {
        var isSuperCoupon = false;
        if ($("#menu").length && !$couponbar) {
            $couponbar = $('<div class="couponbar"><span class="offline_coupon"><label><input class="textbox" type="text" name="record_code" autocomplete="off" /></label><a class="submit btnshort" href="javascript:;">立即兑换</a></span><a class="lnk" href="' + T.DOMAIN.FAQ + 'payment.html#2" target="_blank">了解优惠券获取途径>></a></div>').insertAfter("#header .head_shop");
            T.FORM().placeholder($("input[name='record_code']", $couponbar)[0], "请输入优惠券兑换码");
            isSuperCoupon = true;
        }
        if (!$couponbar || !$couponbar.length) return;
        $couponbar.on("click.coupon", ".submit", function (e) {
            debugger
            if (!T._LOGED) {
                T.LoginForm(0);
                return;
            }
            var $this = $(this);
            var $input = $("input[name='record_code']", $couponbar);
            var record_code = $.trim($input.val());
            if (record_code) {
                T.RedeemedCoupon(record_code, callback);
                /*if (/^[0-9]{8,32}$/.test(record_code)) {
                    T.RedeemedCoupon(record_code, callback);
                } else {
                    //T.msg('您输入的兑换码格式有误，请您确认后重新输入！');
                    T.CouponAltPopup({msg: '亲，您输入的兑换码或口令格式有误！'});
                }*/
            } else {
                if (isSuperCoupon) {
                    window.location = T.DOMAIN.MEMBER + 'mycoupon.html';
                } else {
                    //T.msg('请输入优惠券兑换码！');
                    T.CouponAltPopup({msg: '请输入优惠券兑换码或口令！'});
                }
            }
        });
    };
    //优惠券兑换提示框
    T.CouponAltPopup = function (data, callback) {
        if (data.result == 0) {
            data.msg = data.msg || '恭喜您！优惠券兑换成功。';
        } else {
            data.msg = data.msg || T.TIPS.DEF
        }
        T.Popup({
            id: 'redeemedcoupon',
            zIndex: 860,
            title: '温馨提示',
            //width: 660,//亲，您已经兑换过同类型的优惠券了哟！
            content: '<div class="couponbox"><h3 class="red">' + data.msg + '</h3><dl><dt>更多优惠券可通过如下方式获得：</dt><dd><span>①</span> 选购云印指定产品； <a href="' + T.DOMAIN.WWW + 'all.html" target="_blank">点击进入>></a></dd><dd><span>②</span> 参与云印优惠活动； <a href="' + T.DOMAIN.WWW + 'activity/index.html" target="_blank">点击进入>></a></dd></dl></div>',
            noFn: function (_self) {
                _self.remove();
            }
        });
        //T.msg('优惠券兑换码兑换成功');
        if (callback) callback(data);
    };
    //兑换线下优惠券
    T.RedeemedCoupon = function (record_code, callback) {
        if (record_code) {
            T.POST({
                action: 'in_order/exchange_offline_coupon',
                params: {record_code: record_code},
                success: function (data) {
                    T.CouponAltPopup(data, callback);
                },
                failure: function (data) {
                    T.CouponAltPopup(data, callback);
                }
            });
        }
    };
    //获得QQ业务咨询链接
    T.GetServiceQQ = function () {
        //if(T._LOGED&&(T._TYPE<2||(T._TYPE>1&&T._USID))){
        if (!T.cookie("_serviceQQ")) {
            T.GET({
                action: 'in_user/get_online_bd_qq', success: function (data) {
                    T._serviceQQ = data.OnlineBdQq || T._serviceQQ;
                    T.cookie("_serviceQQ", T._serviceQQ || "");
                    T.BindQQService();
                }, failure: function (data, params) {
                }, error: function (data, params) {
                }
            }, function (data) {
            }, function (data) {
            });
        } else {
            T.BindQQService();
        }
    };
    //绑定QQ客服
    T.BindQQService = function (isRefurbish) {
        if (isRefurbish) {
            return T.GetServiceQQ();
        }
        if (T._userSupportQQ && T._userSupportQQ.indexOf("=938062247&") > 0) { //小三QQ
            T._userSupportQQ = T._serviceQQLink || "";
        }
        if (T._serviceQQ && T._serviceQQ.indexOf("=938062247&") > 0) { //小三QQ
            T._serviceQQ = T._serviceQQLink || "";
        }
        $("#tservice,#qqconsultation,#online_service").attr("href", T._userSupportQQ || T._serviceQQ);
        $("#tmember,#qqservice").unbind("click.tmember");
        if (T._LOGED) {
            /*if(!T._userSupportQQ){
             T._userSupportQQ = T._serviceQQ;
             }*/
            $("#tmember,#qqservice").attr("target", "_blank").attr("href", T._userSupportQQ || T._serviceQQ)
        } else {
            $("#tmember,#qqservice").attr("href", "javascript:;").bind("click.tmember", function () {
                T.LoginForm(0);
            }).removeAttr("target");
        }
    };
    T.getUserSupportQQ = function (userSupportQQ) {
        userSupportQQ = $.trim(userSupportQQ);
        if (/^\d+$/.test(userSupportQQ)) {
            if (userSupportQQ == '938062247') { //小三QQ
                userSupportQQ = '4008601846';
            }
            return "http://wpa.qq.com/msgrd?v=3&uin=" + userSupportQQ + "&site=http://www.ininin.com&menu=yes";
        }
        return userSupportQQ || ""
    };
    //登录后
    T.LoginAfter = function () {
        //登录判断 T.cookie("__pac","_LOGED")
        T._SID = T.cookie("sid") || ""; //登录标识
        T._TYPE = T.cookie("_type") || 0; //账户类型
        T._USER_TYPE = T.cookie("_user_type") || 0; //账户类型
        if (!T._USER_TYPE) T._USER_TYPE = location.href.indexOf("www.ininin.com") > 0 ? 1 : 0;
        T._ACCOUNT = T.cookie("_account") || ""; //账号
        T._NICKNAME = T.cookie("_nickname") || T._ACCOUNT || "我的云印"; //昵称
        T._NEED_AUDIT = Number(T.cookie("_need_audit")) === 1; //待审核订单
        T._userSupportQQ = T.getUserSupportQQ(T.cookie("_userSupportQQ") || T._userSupportQQ) || ""; //QQ客服会员服务链接
        T._serviceQQ = T.cookie("_serviceQQ") || T._serviceQQ || ""; //QQ客服业务咨询链接
        T._LOGED = T._SID && typeof(T._SID) === 'string' && T._USER_TYPE == 1; //用户登陆态
        if (T._LOGED) { //如果已登陆
            if (T._TYPE > 1) { //如果是代理账号
                T._LOGED = 0;
                T._STORE = T._TYPE; //代理账号登录态
                var _data = T.JSON.parse(T.cookie("_agent_token") || "{}") || {};
                var _user = _data.user || {};
                //用户信息
                T._USID = _user.sid || "";
                T._ACCOUNT = _user.userName || T._ACCOUNT; //账号
                T._NICKNAME = _user.nickName || T._ACCOUNT || ""; //昵称
                T._NEED_AUDIT = Number(_user.needAudit) === 1; //待审核订单
                T._userSupportQQ = T.getUserSupportQQ(_user.userSupportQQ) || ""; //QQ客服会员服务链接
                T._serviceQQ = _user.serviceQQ || T._serviceQQ || ""; //QQ客服业务咨询链接
                //代理账号信息
                T._SACCOUNT = _data.userName || ""; //账号
                T._SNICKNAME = _data.userName || ""; //昵称
                T._SREALNAME = _data.nickName || ""; //真实名称
                T._SYSTEMINFO = _data.systemInfo || ""; //账号标识
                T._OPERATOR = _data.operator || ""; //操作人
                T._OPERATOR_CODE = _data.operatorCode || ""; //操作人编号
                if (T._TYPE == 3) {
                    if (T._USID && !T.IS_AUTH_PAHE) { //代理账号
                        T._LOGED = 1;
                    } else {
                        T.UnCookie(0, T.DOMAIN.WWW);
                    }
                } else if (T._TYPE == 2) {
                    if (T._USID && T._STORENAME.indexOf('_' + T._SACCOUNT + '_') >= 0) { //超级账号
                        T._LOGED = 1;
                    }
                }
            }
        }
    };
    //登录状态
    T.LoginStatus = function () {
        if (T._LOGED) {
            $(document.body).addClass("logged");
            $("#userbar").removeClass("login_before");
            $("#user_name").text(T._NICKNAME).attr('title', T._NICKNAME);
        }
        //绑定QQ客服
        T.BindQQService(1);
        if (T._STORE && !T.IS_AUTH_PAHE) {//如果是门店登录
            //T.SetPassport(T._USERKEY);
            //截取门店名称及编号，格式如：云印-科兴店-M002
            if (T._SNICKNAME) {
                var _idx = T._SNICKNAME.lastIndexOf('-');
                if (_idx > 0) {
                    T._SREALNAME = T._SNICKNAME.substring(0, _idx);//云印-科兴店
                    T._SNICKNAME = T._SNICKNAME.substring(_idx + 1);//M002
                }
                T._SNICKNAME = $.trim(T._SNICKNAME || T._SREALNAME);
            }
            //生成门店条
            $("#header").addClass("hfixed");
            $("body").addClass("body_store");
            //<marquee direction="right" behavior="alternate"></marquee>
            var html = '<div id="storebar" class="storebar"><div class="layout clearfix"><dl class="sinfo"><dd class="search suser ellipsis tr">' + T._OPERATOR + '</dd><dt class="sname">' + T._SYSTEMINFO + '</dt></dl></div></div>';
            if (T._TYPE == 2) {
                html = '<div id="storebar" class="storebar"><div class="layout clearfix"><dl class="sinfo"><dd class="search nosearch"><div class="searchbar"><input id="ininin_super_search_input" class="textbox" type="text"/><a id="ininin_super_search_button" class="search_btn" href="javascript:;"><i></i></a></div></dd><dt class="sname"><span class="sloginout"><a href="javascript:;">退出</a></span>>>欢迎光临' + T._SREALNAME + '<<</dt></dl></div></div>';
            }
            $("#header_fixed").prepend(html);
            if (T._TYPE != 2) return;//如果是门店账户
            $("#storebar .search").bind("click.search", function () {
                $(this).removeClass("nosearch");
                $("#ininin_super_search_input").focus();
            });
            $("#ininin_super_search_button").bind("click.store", function () {
                STORE.superSearch();
            });
            $("#ininin_super_search_input").bind("focus.store", function () {
                STORE.KeydownEnter();
            }).bind("blur.store", function () {
                STORE.UnKeydownEnter();
            }).val(T._USERNAME || '');
            $("#header .sloginout").bind("click.store", function () {
                T.UnCookie(true);
                T.POST({action: COM_API.loginout}, {issid: true, issource: true}, function (data) {
                    T.UnCookie(true);
                }, function () {
                    T.UnCookie(true);
                });
            });
            T.Mailfix({inputs: [T.DOM.byId('ininin_super_search_input')]});
            T.FORM().placeholder(T.DOM.byId('ininin_super_search_input'), "超级搜索");
        }
    };
    T.VER = 'v=' + T.VERSION;
    T.INININ = '';//'ininin='+ T.VERSION;
    T.IS_AUTH_PAHE = location.href.indexOf(T.DOMAIN.WWW + 'auth.html') == 0; //是否为授权页面
    if (!T.IS_AUTH_PAHE) {//如果不是加盟商授权页面
        T.LoginAfter();
    }
    //门店操作
    var STORE = {
        superSearch: function (uname) {
            var uname = uname || $.trim($("#ininin_super_search_input").val());
            if (uname) {
                if (T.RE.mobile_email.test(uname)) {
                    T.GET({
                        action: 'in_user/check_user',
                        params: {username: uname},
                        issid: true,
                        issource: true,
                        success: function (data) {
                            //var params = {username: uname, userkey: T.UUID(32).toUpperCase()};
                            T.SetCookie(data, {_action: "check_user"});
                            window.location.reload();
                            /*T.GET({
                             action: 'in_user/user_query?sid='+data.sid
                             ,params: {source: 1}
                             ,success: function (data) {
                             T._ADDRESS = (data.epAddress||'').replace(/\^/g,'');
                             T._TELEPHONE = data.phone||data.tel;
                             }
                             });*/
                            //T.cookie("_username",uname||"", {path: '/'});
                            //var _params = T.getRequest();
                            //_params.userkey = params.userkey;
                            //window.location.search = '?'+T.ConvertToQueryString(_params);
                        },
                        failure: function (data) {
                            T.cookie("_username", uname || "", {path: '/'});
                            T.cfm('帐号' + uname + ' 不存在，是否立即创建该账号？', function (_this) {
                                _this.remove();
                                window.location = T.DOMAIN.PASSPORT + "index.html";
                            }, null, null, '立即注册', '以后再说', 720);
                        }
                    });
                } else {
                    T.msg('用户名只能是手机号或邮箱！');
                }
            }
        }, KeydownEnter: function () {
            $(window).bind("keydown.store", function (e) {
                e.stopPropagation();
                e = e || event;
                var keycode = e.keyCode || e.which;
                if (keycode === 13) {
                    STORE.superSearch();
                }
            });
        }, UnKeydownEnter: function () {
            $(window).unbind("keydown.store");
        }
    };
    T.Loader(function () {
        T.TopUserbar();
        T.LoginStatus();
        T.Advert();

        $("a[name='registerurl']").each(function (i, el) {
            var $el = $(el),
                href = $el.attr("href"),
                registerurl = T.DOMAIN.PASSPORT + "index.html",
                params = T.getRequest(href.replace(/^.*\#/, ""));
            params.backurl = encodeURIComponent(location.href);
            if (href != "javascript:;" && location.href.indexOf(registerurl) < 0) {
                $el.attr("href", href.replace(/[#?]+.*$/, "") + "#" + T.Transfer.encodeHashString(params));
            } else {
                $el.attr("href", "javascript:;");
            }
        });
        T.SetCurrNav = function (pid) {
            pid = pid || T.getQueryString('pid') || '';
            var localhref = location.href.replace(location.search, '').replace(location.hash, '');
            if (/pdetail\.html$/.test(localhref)) {
                localhref = T.DOMAIN.WWW + 'pdetail.html?pid=' + pid;
            }
            localhref = localhref.replace(/\/$/, '');
            localhref = localhref.replace(/chromatism\.html$/, 'upload.html');
            var isHelp = /\/help\//i.test(localhref) && !/\/help\/upload\.html/i.test(localhref);
            var isAbout = /\/about\//i.test(localhref);
            var isNew = /\/new\//i.test(localhref);
            var isProduct = /\/product\//i.test(localhref);
            localhref = localhref.replace(T.DOMAIN.WWW, "");
            $("#nav li > a").each(function (i, a) {
                var href = $(a).attr("href").replace(T.DOMAIN.WWW, "").replace(/^\//, "");
                if (/pdetail\.html/.test(localhref)) {
                    var idx = href.indexOf('&');
                    if (idx > 0) {
                        href = href.substring(0, idx);
                    }
                } else {
                    href = href.replace(/[?#].*/, '').replace(/\/$/, '');
                }
                if (href == localhref) {
                    $(a).closest("li").addClass("sel");
                }
                if (isHelp && /^help/i.test(href) && localhref.indexOf(href) == 0) {
                    $(a).closest("li").addClass("sel");
                }
                if (isAbout && /^about/i.test(href) && localhref.indexOf(href) == 0) {
                    $(a).closest("li").addClass("sel");
                }
                if (isNew && /^new/i.test(href)) {
                    $(a).closest("li").addClass("sel");
                }
                if (isProduct && href.indexOf('all.html') == 0) {
                    $(a).closest("li").addClass("sel");
                }
            });
        };
        T.SetCurrNav();
        T.SelectedNav = function (localhref) {
            localhref = localhref.replace(T.DOMAIN.WWW, "");
            $("#nav li > a").each(function (i, a) {
                var href = $(a).attr("href").replace(T.DOMAIN.WWW, "").replace(/^\//, "");
                if (href && href.indexOf(localhref) >= 0) {
                    $(a).closest("li").addClass("sel").siblings("li").removeClass("sel");
                }
            });
        };
        var $toolbar = $("#toolbar");
        var $backTop = $("#tbacktop");
        $backTop.hide();
        $backTop.bind("click", function (e) {
            $("html, body").stop(true, true).animate({scrollTop: 0}, 120);
        });
        //右侧工具条
        T.Toolbar = function (e) {
            var isMini = $(window).width() < 1400;
            var isBackTop = $(document).scrollTop() > 0;
            if (isBackTop) {
                $backTop.show();
            } else {
                $backTop.hide();
            }
            if (isMini) {
                $toolbar.addClass("mintoolbar");
                //$toolbar.css("margin-left","618px");
            } else {
                $toolbar.removeClass("mintoolbar");
                //$toolbar.css("margin-left","630px");
            }
            $toolbar.css("margin-top", -$toolbar.height() / 2);
        };
        $(window).bind("scroll.toolbar resize.toolbar", T.Toolbar);
        T.Toolbar();
        //返回顶部
        T.Back = function (e) {
            $(window).bind("scroll.toolbar", function () {
                var top = $(document).scrollTop();
                if (top > 10) {
                    $backTop.show();
                } else {
                    $backTop.hide();
                }
            });
        };
        T.Back();
    });
    $(document).delegate(".droplist .dropbtn, .droplist .dropval", "click.droplist", function (e) {
        var $target = $(e.target);
        var $droplist = $target.closest(".droplist");
        var $dropoptions = $target.closest(".dropoptions");
        if (!$dropoptions.length) {
            var ClearDroplist = function () {//清除所有droplist
                $("body>.dropoptions").remove();
                $(window).unbind("scroll.droplist resize.droplist");
                $(document).bind("click.droplist");
            };
            ClearDroplist();
            $droplist.addClass("show");
            var $dropoptions = $(".dropoptions", $droplist).clone();
            var width = Math.max($dropoptions.width(), $droplist.width());
            $droplist.width(width);
            var SetPosition = function () {//设置位置
                var offset = $droplist.offset();
                $dropoptions.css({
                    width: width,
                    top: offset.top + $droplist.outerHeight(),
                    left: offset.left
                });
            };
            SetPosition();
            var $obj = $dropoptions.appendTo(document.body);
            $dropoptions.undelegate(".dropitem", "click.droplist").delegate(".dropitem", "click.droplist", function (e) {
                var $target = $(this).addClass("sel");
                $target.siblings(".dropitem").removeClass("sel");
                var $dropoptions = $target.closest(".dropoptions");
                var $droplist = $(".droplist[uuid='" + $dropoptions.attr("uuid") + "']");
                var value = $target.data("value");
                var title = $target.html();
                $(".dropval", $droplist).html(title);
                $droplist.removeClass("show");
                $("input", $droplist).val(value).trigger("valchange.droplist", value);
                if (T.IS.CVS) {
                    setTimeout(ClearDroplist, 0);
                } else {
                    ClearDroplist();
                }
            });
            $(document).unbind("click.droplist2").bind("click.droplist2", function (e) {
                var $target = $(e.target);
                var $droplist = $target.closest(".droplist");
                var $dropoptions = $target.closest(".dropoptions");
                if (!$droplist.length && !$dropoptions.length) {
                    ClearDroplist();
                }
            });
            $(window).unbind("scroll.droplist resize.droplist").bind("scroll.droplist resize.droplist", SetPosition);
        }
    }).off("focus.com").on("focus.com", "input.form-text, textarea.form-text", function (e) { //输入框获得焦点
        $(this).closest(".form-group").addClass("form-focus");
    }).off("blur.com").on("blur.com", "input.form-text, textarea.form-text", function (e) { //输入框失去焦点
        $(this).closest(".form-group").removeClass("form-focus");
    }).off(T.EVENTS.input + ".com").on(T.EVENTS.input + ".com", "input.form-text, textarea.form-text", function (e) { //输入框值改变
        var $this = $(this),
            $placeholder = $this.siblings(".form-placeholder"),
            val = $this.val();
        if (val == '') {
            $placeholder.show();
        } else {
            $placeholder.hide();
        }
    }).off("click.ph.com").on("click.ph.com", ".form-placeholder", function (e) { //点击输入框值占位符
        var $this = $(this),
            $input = $this.siblings(".form-text");
        $input.focus();
    });
    T.Loader(function () {
        (function (btn, btn2, usercart) {
            var login_backurl = '', loginFormObj = null, login_callback = null;
            var loginForm = T.DOM.byId('login_form');
            if (loginForm) $("input[name='username']", loginForm).val(T._ACCOUNT);
            T.LoginForm = function (backurl, callback) {
                if (loginFormObj) {
                    loginFormObj.remove();
                    loginFormObj = null;
                }
                login_callback = callback;
                login_backurl = typeof(backurl) != 'undefined' ? backurl : '';
                loginFormObj = T.dailog(loginForm, '登录', null, null, 'login_form_popup');
            };
            if (usercart) {
                T.DOM.bind(usercart, 'click', function (e) {
                    if (!T._LOGED) {
                        T.DOM.preventDefault(e);
                        T.DOM.stopPropagation(e);
                        T.LoginForm(T.DOMAIN.CART + 'index.html' + (T.INININ ? '?' + T.INININ : ''));
                    }
                });
            }
            $(document).bind('keyup', function (e) {
                T.KeydownEnter(e);
            });
            //T.SendCode('#sendCodeLogin','#accountLogin',2);
            if (loginForm) {
                var pwdErrorCount = 0; //密码错误次数
                //用户登录
                T.DOM.bind(btn, 'click', function (e) {
                    T.DOM.preventDefault(e);
                    T.DOM.stopPropagation(e);
                    T.LoginForm();
                });
                var captcha,
                    hasVerifyCode = false,
                    verifyCodeValue, //校验码
                    verifyCallback; ///验证成功回调
                T.CaptchaToPhone({
                    trigger: "#sendCodeLogin",
                    account: "#accountLogin",
                    source: 2
                });
                var LOGINFORM = T.FORM('login', CFG_FORM['login'], {
                    before: function () {
                        var _form = this;
                        _form.action = "in_user/login";
                        if ((hasVerifyCode && verifyCodeValue) || !hasVerifyCode || _form.params.code) {
                            _form.issid = true;
                            _form.issource = true;
                            var params = {
                                username: _form.params.username,
                                remember: _form.params.remember || "0"
                            };
                            if (hasVerifyCode && verifyCodeValue) params.checkcode = verifyCodeValue;
                            if (_form.params.code) params.code = _form.params.code;
                            if (_form.params.password) params.password = _form.params.password;
                            _form.params = params;
                            if (T._STORENAME.indexOf('_' + params.username + '_') >= 0) {
                                params.source = '1';
                                params.remember = '1';
                            }
                        } else {
                            if (captcha && captcha.verify) {
                                _form.action = "";
                                verifyCallback = function (verifyCode) { //验证成功缓存校验码，并重新提交
                                    verifyCallback = null;
                                    _form.submit();
                                };
                                captcha.verify();
                            }
                        }
                    }
                    , success: function (data, param) {
                        var curr_url = T.DOMAIN.PASSPORT + 'index.html' + (T.INININ ? '?' + T.INININ : '');//?ininin='+ T.INININ;
                        if (T._STORENAME.indexOf('_' + param.username + '_') >= 0) {
                            data.type = 2;
                        } else if (T._TYPE == 2) {
                            param._action = "check_user";
                        }
                        //param.userkey = T.UUID(32).toUpperCase();
                        T.SetCookie(data, param);
                        if (login_backurl === 0) {
                            T.cookie("ORDER_NOTPAY", "1");
                            if (loginFormObj) {
                                loginFormObj.remove();
                                loginFormObj = null;
                            }
                            T.LoginAfter();
                            T.LoginStatus();
                            T.SetStatus();
                        } else {
                            if (window.location.href.indexOf(curr_url) == 0) {
                                login_backurl = T.DOMAIN.MEMBER + "index.html";
                            }
                            if (login_backurl) {
                                window.location = login_backurl;
                            } else if (T._TYPE > 1 && T._STORENAME.indexOf('_' + param.username + '_') < 0) {
                                window.location.reload();
                            } else {
                                T.cookie("ORDER_NOTPAY", "0");
                                window.location.reload();
                            }
                        }
                        if (login_callback) login_callback();
                    }
                    , failure: function (data, params) {
                        pwdErrorCount = data.errorCount;
                        if (pwdErrorCount >= 2) {
                            hasVerifyCode = true;
                            captcha = T.Captcha({
                                cont: "#captcha-pop"
                            }, {
                                refresh: function (token) { //刷新时清空校验码
                                    verifyCodeValue = "";
                                },
                                success: function (verifyCode) { //验证成功缓存校验码
                                    verifyCodeValue = verifyCode;
                                    verifyCallback && verifyCallback(verifyCode);
                                }
                            });
                            $("#captcha-pop").removeClass("hide");
                            if (pwdErrorCount >= 5) {
                                T.alt('该账户输入错误密码次数过多，已被冻结3小时，您可自助<a class="forget" href="/passport/forget.html">找回密码</a>。如有疑问，请拨打云印客服电话：400-680-9111', function (_o) {
                                    _o.remove();
                                }, function (_o) {
                                    _o.remove();
                                });
                            } else if (data.codeResult == 1 || (params && params.code)) {
                                T.msg(data.msg || '输入验证码有误，请重新输入');
                            } else {
                                T.msg(data.msg || '用户名不存在或密码不正确');
                            }
                        } else {
                            $("#captcha-pop").addClass("hide");
                            if (params && params.code) {
                                T.msg(data.msg || '输入验证码有误，请重新输入');
                            } else {
                                T.msg(data.msg || '用户名不存在或密码不正确');
                            }
                        }
                    }
                });

                function showCodeLogin() {
                    var account = $("#accountLogin").val();
                    if (T.RE.mobile.test(account)) {
                        $("#loginChange").show().text("使用验证码登录");
                    }
                }

                showCodeLogin();
                LOGINFORM.showInput('code', 'username', false);
                LOGINFORM.showInput('password', 'username', true);
                $("#accountLogin").bind("blur", showCodeLogin);
                $("#loginChange").bind("click", function (e) {
                    if ($("#loginChange").text() == '使用验证码登录') {
                        $("#loginChange").text("使用密码登录");
                        LOGINFORM.showInput('code', 'username', true);
                        LOGINFORM.showInput('password', 'username', false);
                        hasVerifyCode = false;
                        $("#captcha-pop").addClass("hide");
                    } else {
                        $("#loginChange").text("使用验证码登录");
                        LOGINFORM.showInput('code', 'username', false);
                        LOGINFORM.showInput('password', 'username', true);
                        if (pwdErrorCount >= 2) {
                            hasVerifyCode = true;
                            $("#captcha-pop").removeClass("hide");
                        } else {
                            hasVerifyCode = false;
                            $("#captcha-pop").addClass("hide");
                        }
                    }
                });
            }
            if (btn2) {
                //退出登录状态
                T.DOM.bind(btn2, 'click', function (e) {
                    T.POST({action: COM_API.loginout}, function (data) {
                        T.NotLogin();
                        //T.UnCookie();
                    }, function () {
                        T.NotLogin();
                        //T.UnCookie();
                    });
                    T.NotLogin();
                    //T.UnCookie();
                    //if(WB2&&WB2.logout)WB2.logout();
                    //if(QC&&QC.logout)QC.logout();
                });
            }
        })(T.DOM.byId('login_btn'), T.DOM.byId('logout_btn'), T.DOM.byId('user_cart'));
        ;(function (sidebar) {
            //用户中心左侧栏选中状态
            if (!sidebar) return;
            var items = T.DOM.byTagName(sidebar, 'a');
            if (!items || !items.length) return;
            var local = window.location.href.replace(/\?.*|#.*/ig, '');
            for (var l = items.length, i = 0; i < l; i++) {
                var href = items[i].href.replace(/\?.*|#.*/ig, '');
                if (local == href) {
                    T.DOM.addClass(items[i], 'sel');
                    return;
                }
                ;
            }
        })(T.DOM.byId('sidebar'));
        /*(function($sina,$qq,$douban){
            var CB = {
                authqq: encodeURIComponent(T.DOMAIN.WWW+'oauth/qqauth.html?backurl='+encodeURIComponent(T.REQUEST.backurl||location.href))
                //,authsina: encodeURIComponent('http://'+T.DOMAIN.WWW_WDBUY_COM+'/oauth/sinaauth.html?backurl='+location.href)
            };
            //var qqurl = "https://graph.qq.com/oauth2.0/authorize?client_id=100554417&response_type=token&scope=get_user_info&redirect_uri=http://" + T.DOMAIN.PASSPORT_WDBUY_COM + "/openuser.html?passed=100554417";
            //$sina.attr("href", 'https://api.weibo.com/oauth2/authorize?client_id=2422438855&response_type=code&redirect_uri='+CB.authsina);
            $qq.attr("href", "https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=100554417&state="+T.UUID()+"&redirect_uri="+CB.authqq);
            $qq.bind('click', function(){
                window.location = "https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=100554417&state="+T.UUID()+"&redirect_uri="+CB.authqq;
            });
            //$douban.attr("href", "http://"+T.DOMAIN.WWW_WDBUY_COM+"/openlogin.html?action=douban&forward=" + window.location.href);
        })($("#sina_login_btn"),$("#qq_login_btn"));*/
    });
    T.OAuth = {
        getRedirectUri: function (type, redirectUri) {
            return encodeURIComponent(T.DOMAIN.WWW + "oauth/" + type + ".html?redirect_uri=" + encodeURIComponent(redirectUri || T.REQUEST.backurl || location.href));
        },
        qq: function (btnId, redirectUri) {
            redirectUri = this.getRedirectUri("qqauth", redirectUri);
            var oauthUri = "https://graph.qq.com/oauth2.0/authorize?response_type=token&t=tt&client_id=100554417&state=" + T.MD5(T.UUID()) + "&redirect_uri=" + redirectUri;
            $("#" + btnId).attr("href", oauthUri).on("click.oauth", function (e) {
                window.location = oauthUri;
            });
        },
        wechat: function (btnId, redirectUri) {
            redirectUri = this.getRedirectUri("wechat", redirectUri);
            var oauthUri = "https://open.weixin.qq.com/connect/qrconnect?appid=wx913310ec0211980f&response_type=code&redirect_uri=" + redirectUri + "&scope=snsapi_login&state=" + T.MD5(T.UUID()) + "#wechat_redirect";
            $("#" + btnId).attr("href", oauthUri).on("click.oauth", function (e) {
                window.location = oauthUri;
            });
        }
    };
    T.OAuth.qq("qq_login_btn");
    T.OAuth.wechat("wechat_login_btn");
    //Firefix srcElement、fromElement、toElement属性补丁
    !(function (window, document, undefined) {
        if (window.mozIndexedDB !== undefined || window.mozInnerScreenY !== undefined) {
            FixPrototypeForGecko();
        }

        function FixPrototypeForGecko() {
            HTMLElement.prototype.__defineGetter__("runtimeStyle", element_prototype_get_runtimeStyle);
            window.constructor.prototype.__defineGetter__("event", window_prototype_get_event);
            Event.prototype.__defineGetter__("srcElement", event_prototype_get_srcElement);
            Event.prototype.__defineGetter__("fromElement", element_prototype_get_fromElement);
            Event.prototype.__defineGetter__("toElement", element_prototype_get_toElement);
        }

        function element_prototype_get_runtimeStyle() {
            return this.style;
        }

        function window_prototype_get_event() {
            return SearchEvent();
        }

        function event_prototype_get_srcElement() {
            return this.target;
        }

        function element_prototype_get_fromElement() {
            var node;
            if (this.type == "mouseover") node = this.relatedTarget;
            else if (this.type == "mouseout") node = this.target;
            if (!node) return;
            while (node.nodeType != 1)
                node = node.parentNode;
            return node;
        }

        function element_prototype_get_toElement() {
            var node;
            if (this.type == "mouseout") node = this.relatedTarget;
            else if (this.type == "mouseover") node = this.target;
            if (!node) return;
            while (node.nodeType != 1)
                node = node.parentNode;
            return node;
        }

        function SearchEvent() {
            if (document.all) return window.event;
            func = SearchEvent.caller;
            while (func != null) {
                var arg0 = func.arguments[0];
                if (arg0 instanceof Event) {
                    return arg0;
                }
                func = func.caller;
            }
            return null;
        }
    }(window, document));
    return T;
});