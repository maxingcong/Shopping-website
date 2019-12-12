define("modules/design_share", ["base", "tools"], function($, T){
    //此处添加分享具体设置
    window._bd_share_config = {
        "common":{//此处放置通用设置
            "tag" : "share_1"
            ,"bdSnsKey":{}
            ,"bdStyle":"0"
            ,"bdSize":"24"
            ,"bdMini":"2"
            ,"bdPopupOffsetLeft": -203
            ,"bdText":"云印官网—设计“省”心，印刷“简”单！"//分享的内容
            //,"bdDesc":"云印官网—中国最大的互联网印刷和设计服务平台。为您提供最优质的名片、会员卡、宣传单、折页、易拉宝、X展架、封套、画册、宣传册、手提袋等产品印刷和设计服务！云印技术(深圳)有限公司"//分享的摘要
            ,"bdUrl":""//分享的Url地址
            ,"bdPic":""//分享的图片
            /*,"onBeforeClick": function(cmd,config){//在用户点击分享按钮时执行代码，更改配置
             }
             ,onAfterClick: function(e){//在用户点击分享按钮后执行代码，cmd为分享目标id。可用于统计等

             }*/
        }
        ,share: []
        /*,slide : [//此处放置浮窗分享设置
         ]*/
        /*,"image":{//此处放置图片分享设置
            "tag" : "image_1"
            ,"viewList":["qzone","tsina","tqq","sqq","weixin"]
            ,"viewText":"分享到："
            ,"viewSize":"16"
        }*/
    };
    function parseData(data) {
        window._bd_share_config.share = [];
        window._bd_share_config.share.push({
            "tag" : "share_1"
            ,"bdText": data.shareTitle  //标题
            ,"bdDesc": data.digest //描述
            ,"bdUrl": data.href||location.href
            ,"bdPic": data.uris[0]
        });
    }
    //图片分享设置
    /*window._bd_share_config.image.push({
        "tag" : "image_1"
        ,"bdText": '分享的内容'
        ,"bdDesc": '分享的摘要'
        ,"bdUrl": '分享的Url地址'
        ,"bdPic": '分享的图片'
        ,"viewList":["qzone","tsina","weixin"]
        ,"viewText":"分享到："
        ,"viewSize":"16"
    });*/
    return function(data){//加载分享js
        parseData(data);
        with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion='+~(-new Date()/36e5)];
    }
});