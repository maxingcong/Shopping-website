require(["base", "tools"], function($, T){
    /* 配置项名称	        值类型           格式和取值         描述
     bdText           string          自定义             分享的内容
     bdDesc           string          自定义             分享的摘要
     bdUrl            string          自定义             分享的Url地址
     bdPic            string          自定义             分享的图片
     bdSign           string          on｜off｜normal    是否进行回流统计。
     'on': 默认值，使用正常方式挂载回流签名（#[数字签名]）
     'off': 关闭数字签名，不统计回流量
     'normal': 使用&符号连接数字签名，不破坏原始url中的#锚点
     bdMini             int             1｜2｜3            下拉浮层中分享按钮的列数
     bdMiniList         array           ['qzone','tsina',...]	自定义下拉浮层中的分享按钮类型和排列顺序。详见分享媒体id对应表
     onBeforeClick      function        function(cmd,config){}	在用户点击分享按钮时执行代码，更改配置。
     cmd为分享目标id，config为当前设置，返回值为更新后的设置。
     onAfterClick       function        function(cmd){}	在用户点击分享按钮后执行代码，cmd为分享目标id。可用于统计等。
     bdPopupOffsetLeft	int             正｜负数	下拉浮层的X偏移量
     bdPopupOffsetTop	int             正｜负数	下拉浮层的Y偏移量
     */
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
            ,"bdDesc":"云印官网—中国最大的互联网印刷和设计服务平台。为您提供最优质的名片、会员卡、宣传单、折页、易拉宝、X展架、封套、画册、宣传册、手提袋等产品印刷和设计服务！云印技术(深圳)有限公司"//分享的摘要
            ,"bdUrl":"http://www.ininin.com/"//分享的Url地址
            ,"bdPic":"http://www.ininin.com/resources/logo.png"//分享的图片
            /*,"onBeforeClick": function(cmd,config){//在用户点击分享按钮时执行代码，更改配置

             }
             ,onAfterClick: function(e){//在用户点击分享按钮后执行代码，cmd为分享目标id。可用于统计等

             }*/
        }
        //此处放置分享按钮设置
        ,"share": {}
    };
    var detail = {
        id: '',
        interval: null,
        init: function(data){
            detail.reload(true);
            detail.browse(detail.id);
            /*$("#template_activity_list_view").delegate(".see", "click", function (e) {
             var $this = $(this);
             var id = $this.data("id");
             if(id){
             detail.browse($this, id);
             }
             return false;
             }).delegate(".good", "click", function (e) {
             var $this = $(this);
             var id = $this.data("id");
             if(id){
             detail.like($this, id);
             }
             return false;
             });*/
            T.PageLoaded();
        },
        reload: function(isFirst){
            T.GET({
                action:'in_feedback/query_activity'
                ,params: {id: detail.id}
                ,success: function(data){
                    var _data = T.FormatData(data||{});
                    _data.activity = _data.activity||{};
                    _data.activity.act_detail_url = _data.activity.act_detail_url||T.DOMAIN.WWW+'activity/a'+ v.id+'.html';
                    //配置数据
                    //分享按钮设置
                    window._bd_share_config.share = {
                        "bdText": _data.activity.act_name//分享的内容
                        , "bdDesc": _data.activity.act_info//分享的摘要
                        , "bdUrl": _data.activity.act_detail_url//分享的Url地址
                        , "bdPic": _data.activity.act_img_url//分享的图片
                    };
                    //绑定数据
                    T.BindData('data', _data);
                    detail.CountZero();
                    //清除定时器
                    if(detail.interval){
                        window.clearInterval(detail.interval);
                        detail.interval = null;
                    }
                    //设置定时器
                    window.setTimeout(function(){
                        detail.interval = window.setInterval(detail.CountZero, 1000);
                    }, new Date().getTime()%1000);
                    //分享控件
                    detail.share(_data);
                    if(!isFirst&&window._bd_share_main){//初始化百度分享
                        window._bd_share_main.init();
                    }
                }
                ,failure: function(data){}
                ,error: function(data){}
            },function(data){},function(data){});
        },
        browse: function(id){
            T.POST({
                action:'in_feedback/browse_activity'
                ,params: {id: id}
                ,success: function(data){}
                ,failure: function(data){}
                ,error: function(data){}
            },function(data){},function(data){});
        },
        like: function($this, id){
            T.POST({
                action:'in_feedback/like_activity'
                ,params: {id: id}
                ,success: function(data){}
            });
        },
        GetTime: function(time){
            var arr = time.split(' ');
            var date = new Date();
            if(arr&&arr[0]&&arr[1]){
                var arr0 = arr[0].split('-');
                var arr1 = arr[1].split(':');
                var YYYY = parseInt(arr0[0],10)||0
                    ,MM = parseInt(arr0[1],10)||0
                    ,DD = parseInt(arr0[2],10)||0
                    ,hh = parseInt(arr1[0],10)||0
                    ,mm = parseInt(arr1[1],10)||0
                    ,ss = parseInt(arr1[2],10)||0;
                date.setFullYear(YYYY);
                date.setMonth(MM-1);
                date.setDate(DD);
                date.setHours(hh);
                date.setMinutes(mm);
                date.setSeconds(ss);
                date.setMilliseconds(0);
            }
            return date;
        },
        CountZero: function(){//倒计时
            $("#template_activity_list_view .date").each(function(i, el){
                detail.SetTime($(el), $(el).data("start"), $(el).data("end"));
            });
        },
        SetTime: function($this, startTime, endTime){//得到剩余时间
            if(!startTime||!endTime)return;
            var millisecond = detail.GetTime(endTime) - new Date();
            if(isNaN(millisecond))return;
            millisecond = Math.floor(millisecond/1000);
            var dd = Math.floor(millisecond/(60*60*24));
            var hh = Math.floor(millisecond%(60*60*24)/(60*60));
            var mm = Math.floor(millisecond%(60*60)/60);
            var ss = Math.floor(millisecond%60);
            var str = '';
            if(dd)str += dd+'天';
            if(str||(hh&&!str))str += hh+'时';
            if(str||(mm&&!str))str += mm+'分';
            if(str||(ss&&!str))str += ss+'秒';
            if(str){
                if(index.GetTime(startTime)>new Date()){
                    str = '距离开始时间：<span class="time">'+str+'</span>';
                }
                if(index.GetTime(startTime)<new Date()){
                    str = '距离结束时间：<span class="time">'+str+'</span>';
                }
            }
            if($this&&str)$this.html(str);
            if(!str||millisecond<=0){
                str = '活动时间：<span class="time">'+startTime+'-'+endTime+'（已结束）</span>';
                if($this)$this.html(str);
            }
            return str;
        },
        share: function(data){//加载分享js
            with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];
        }
    };
    T.Loader(function(){
        var local = location.href.substring(0,location.href.indexOf('.html'));
        detail.id = local.substring(local.lastIndexOf('/')+2)||'';
        if(detail.id){
            detail.init();
        }
    });
});