INININ_NOTICE_CALLBACK({
    result: '0'
    ,data: {
        result:'0'
        ,callback: function(){
            function GetTime(YYYY, MM, DD, hh, mm, ss){
                var date = new Date();
                date.setFullYear(YYYY);
                date.setMonth(MM-1);
                date.setDate(DD);
                date.setHours(hh);
                date.setMinutes(mm);
                date.setSeconds(ss);
                date.setMilliseconds(0);
                return date.getTime();
            }
            var time_curr = new Date().getTime();
            var time_start = GetTime(2015,1,8,20,0,0);//2015-01-08 20:00:00
            var time_end = GetTime(2015,1,10,0,0,0);//2015-01-10 00:00:00
            if(time_curr>time_start&&time_curr<time_end){
                var htmls = [], height = 34;
                htmls.push('<div id="noticebar" class="noticebar">');
                htmls.push('<style type="text/css">');
                htmls.push('body { background-position: center '+(height+36)+'px;}');
                htmls.push('.body_store { background-position: center '+(height+72)+'px;}');
                htmls.push('.header { padding-top: '+(height+36)+'px;}');
                htmls.push('.hfixed { padding-top: '+(height+36)+'px;}');
                htmls.push('.body_store .hfixed { padding-top: '+(height+72)+'px;}');
                htmls.push('</style>');
                htmls.push('<div class="notice"><div class="text">');
                htmls.push('您好，云印公司1月9日举行年会，期间您可正常下单，9号订单将于1月10号(周六)上班处理，给您带来不便，敬请谅解！');
                htmls.push('</div></div>');
                htmls.push('</div>');
                $("#header_fixed").prepend(htmls.join(''));
            }
        }
    }
});