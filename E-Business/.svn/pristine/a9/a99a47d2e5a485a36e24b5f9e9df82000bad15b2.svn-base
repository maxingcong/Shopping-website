require(["base", "tools", "modules/floor"], function($, T, Floor){
    var Home = T.Module({
        init: function(){
            var _this = this;
            //合作企业
            T.Slider({
                cont: "#partner",
                direction: "lr",
                autoplay: true
            });
            //楼层
            Floor(null, true).loadFloorList(function(){
                if(!$("#slider_list_bhp5").length){
                    $(".floor-item:eq(2)", this.$cont).after('<div id="slider_list_bhp5" class="floor-item banner-md"></div>');
                }
                T.Advert({
                    areaCode: "bhp5"
                });
            });
            if (T._LOGED){
                _this.getOrderNum();
            }
        },
        //获取待处理订单数量
        getOrderNum: function(){
            T.GET({
                action: COM_API.order_mun
                ,success: function(data){
                    if(data.common.notpay>0){
                        $('#nopay_order').removeClass('hide').html(data.common.notpay);
                    }
                }
                ,failure: function(data, params){}
                ,error: function(data, params){}
            },function(data){},function(data){});
        }
    });
    T.Loader(function () {
        /*if (T.REQUEST.backurl) {
            T.REQUEST.backurl = /http\:\/\//.test(T.REQUEST.backurl) ? T.REQUEST.backurl : decodeURIComponent(T.REQUEST.backurl);
            if (T.REQUEST.backurl.indexOf(T.DOMAIN.WWW.replace(/\/$/, '')) == 0) {
                if (T._LOGED && !T._STORE) {
                    window.location = T.REQUEST.backurl;
                } else if (!T._STORE) {
                    T.LoginForm(T.REQUEST.backurl);
                }
            }
        }else{
            new Home();
        }*/
        if (T.REQUEST.backurl) {
            var backurl = /http\:\/\//.test(T.REQUEST.backurl) ? T.REQUEST.backurl : decodeURIComponent(T.REQUEST.backurl);
            if (backurl.indexOf(T.DOMAIN.WWW.replace(/\/$/, "")) != 0 && backurl.indexOf(T.DOMAIN.WWW + "index.html") != 0) {
                if (T._LOGED && !T._STORE) {
                    window.location = backurl;
                } else if (!T._STORE) {
                    window.location = T.DOMAIN.PASSPORT + "index.html#backurl=" + encodeURIComponent(T.REQUEST.backurl);
                }
            }
        }
        new Home();
    });

    var slideMenu=function(){
        var sp,st,t,m,sa,l,w,gw,ot;
        return{
            destruct:function(){
                if(m){
                    clearInterval(m.htimer);
                    clearInterval(m.timer);
                }
            },
            /**
             * @param {String} sm 外层ul的id
             * @param {Number} sw li:hover时预设的最大宽度
             * @param {Number} mt setInterval的间隔
             * @param {Number} s 宽度值改变到指定大小的时间，越小改变的越快
             * @param {Number} sl 指定默认展开的li的位置信息
             */
            build:function(sm,sw,mt,s,sl,h){
                sp=s;
                st=sw;
                t=mt;
                m=document.getElementById(sm);
                sa=m.getElementsByTagName('li');
                l=sa.length;
                w=m.offsetWidth;
                gw=w/l;
                ot=Math.floor((w-st)/(l-1));
                var i=0;
                for(i;i<l;i++){
                    s=sa[i];
                    s.style.width=gw+'px';
                    this.timer(s)
                }
                if(sl!=null){
                    m.timer=setInterval(function(){
                        slideMenu.slide(sa[sl-1])
                    },t)
                }
            },
            timer:function(s){
                s.onmouseover=function(){
                    clearInterval(m.htimer);
                    clearInterval(m.timer);
                    m.timer = setInterval(function(){
                        slideMenu.slide(s)
                    },t);
                    //console.log($(this).find('.mask_b').html());
                    $(this).find('.title_wrap').hide();
                    $(this).find('.mask_b').hide();
                    //console.log($(this).find('.mask_b').attr("style"));
                }
                s.onmouseout=function(){
                    clearInterval(m.timer);
                    clearInterval(m.htimer);
                    m.htimer=setInterval(function(){
                        slideMenu.slide(s,true)
                    },t);
                    //console.log($(this).find('.mask_b').html());
                    $(this).find('.title_wrap').show();
                    $(this).find('.mask_b').show();
                    //console.log($(this).find('.mask_b').attr("style"));
                }
            },
            slide:function(s,c){
                var cw=parseInt(s.style.width);
                if((cw<st && !c) || (cw>gw && c)){
                    var owt=0; var i=0;
                    for(i;i<l;i++){
                        if(sa[i]!=s){
                            var o,ow; var oi=0; o=sa[i]; ow=parseInt(o.style.width);
                            if(ow<gw && c){
                                oi=Math.floor((gw-ow)/sp);
                                oi=(oi>0)?oi:1;
                                o.style.width=(ow+oi)+'px';
                                //console.log(o);
                                //console.log(o.style.width);
                            }else if(ow>ot && !c){
                                oi=Math.floor((ow-ot)/sp);
                                oi=(oi>0)?oi:1;
                                o.style.width=(ow-oi)+'px';
                                //console.log(o);
                                //console.log(o.style.width);
                            }
                            if(c){
                                owt=owt+(ow+oi)
                            }else{
                                owt=owt+(ow-oi)
                            }
                        }
                    }
                    s.style.width=(w-owt)+'px';
                }else{
                    if(m.htimer)
                        clearInterval(m.htimer)
                    if(m.timer)
                        clearInterval(m.timer);
                }
            }
        };
    }();
    slideMenu.build('solutions',400,10,10,1);
});