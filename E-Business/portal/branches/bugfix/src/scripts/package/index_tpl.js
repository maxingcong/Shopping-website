require(["base", "tools"], function ($, T) {
    var dpackage = {
        params: T.getRequest(),
        data: null,
        status: false,
        timeobj: null,
        interval: 1000,
        step: 50,
        curr: 0,
        form: {
            action: 'in_order/plan_create', //加入购物车
            prevent: true,
            items: {
                inviter: {
                    tips: {
                        empty: '请填写推荐人',
                        error: '请填写推荐人'
                    },
                    rule: 'nonempty'
                }
            }
        },
        dom: null,
        cfg: {
            50: 100,
            200: 100,
            500: 100,
            800: 100,
            1000: 50,
            2000: 50,
            5000: 50
        },
        init: function(data) {
            dpackage.data = data || null;
            T.SelectedNav(T.DOMAIN.PACKAGE + 'index.html'); //设置导航选中
            T.Template('package', data);

            this.bindEvents();
            $("#explain").delegate(".desctab li", "click.desctab", function(e) {
                var $this = $(this),
                    idx = $this.index();
                $this.addClass("sel").siblings("li").removeClass("sel");
                var $content = $this.closest(".desctab").siblings(".explain_content");
                $content.addClass("hide");
                $content.eq(idx).removeClass("hide");
                return false;
            });
        },
        GetValue: function() {
            var attrs = [],
                inputs = dpackage.dom.getElementsByTagName('input');
            if (inputs || inputs.length) {
                var i = 0,
                    input = null;
                for (i = 0; input = inputs[i]; i++) {
                    if (input && input.name && input.value.Trim() && input.value.Trim() > 0 && /^package_/.test(input.name)) {
                        attrs.push(input.name.replace(/^package_/, '') + ',' + input.value.Trim());
                    }
                }
            }
            return attrs;
        },
        GetPrice: function(params) {
            params = params || {};
            if (!params.data) {
                params.data = dpackage.GetValue().join(';');
            }
            if (!params.data) {
                dpackage._totalPrice = 0;
                dpackage._totalPresent = 0;
                dpackage._totalIntegral = 0;
                dpackage._totalServiceTimes = 0;
                dpackage.curr = 0;
                dpackage.SetPrice();
                return;
            }
            $("#package .submit").append('<span class="doing"><span>计算中...</span></span>');
            dpackage.status = true;
            T.POST({
                action: 'in_product/check_recharge_price',
                params: params,
                success: function(data) {
                    $("#package .submit .doing").remove();
                    dpackage.status = false;
                    if (data) {
                        dpackage._totalPrice = data.totalPrice || 0;
                        dpackage._totalPresent = data.totalPresent || 0;
                        dpackage._totalIntegral = parseInt(data.totalIntegral, 10) || 0;
                        dpackage._totalServiceTimes = parseInt(data.totalServiceTimes, 10) ? 1 : 0;
                        dpackage.curr = 0;
                        dpackage.SetPrice();
                    }
                }
            });
        },
        SetPrice: function() {
            $("#total_price").text(T.RMB(dpackage._totalPrice));
            dpackage.stopwatch(parseInt($("#total_amount .number").data("value"), 10) || 0, parseInt($("#total_present .number").data("value"), 10) || 0, parseInt($("#total_integral .number").data("value"), 10) || 0, parseInt($("#total_service_times .number").data("value"), 10) || 0);
        },
        stopwatch: function(total_amount, total_present, total_integral, total_service_times) {
            if (dpackage.timeobj) {
                clearTimeout(dpackage.timeobj);
            }
            dpackage.curr++;
            var count = dpackage.interval / dpackage.step;
            var scale = (count - dpackage.curr) / count;
            if (dpackage.curr > count) return;
            if (dpackage.curr == count) {
                scale = 0;
                $("#total_amount .number").data("value", dpackage._totalPrice);
                $("#total_present .number").data("value", dpackage._totalPresent);
                $("#total_integral .number").data("value", dpackage._totalIntegral);
                $("#total_service_times .number").data("value", dpackage._totalServiceTimes);
            }

            var v0 = Math.round(dpackage._totalPrice - (dpackage._totalPrice - total_amount) * scale);
            $("#total_amount .number").text(v0);

            var v1 = Math.round(dpackage._totalPresent - (dpackage._totalPresent - total_present) * scale);
            /*if(v1>=10000){
             v1 = v1/10000;
             v1 = Math.round(v1*10000)/10000;
             $("#total_present .unit").text("万");
             }else{
             v1 = Math.round(v1);
             $("#total_present .unit").html("");
             }*/
            $("#total_present .number").text(v1);

            var v2 = Math.round(dpackage._totalIntegral - (dpackage._totalIntegral - total_integral) * scale);
            /*if(v2>=10000){
             v2 = v2/10000;
             v2 = Math.round(v2*10000)/10000;
             $("#total_integral .unit").text("万");
             }else{
             v2 = Math.round(v2);
             $("#total_integral .unit").html("");
             }*/
            $("#total_integral .number").text(v2);

            $("#total_service_times .number").text(Math.round(dpackage._totalServiceTimes - (dpackage._totalServiceTimes - total_service_times) * scale));

            if (total_amount != dpackage._totalPrice || total_present != dpackage._totalPresent || total_integral != dpackage._totalIntegral || total_service_times != dpackage._totalServiceTimes) {
                dpackage.timeobj = setTimeout(function() {
                    dpackage.stopwatch(total_amount, total_present, total_integral, total_service_times);
                }, dpackage.step);
            }
        },
        bindEvents: function(){
            var _this = this;
            $('.agreement_link').bind('click', function (e) {
                T.DOM.preventDefault(e);
                T.DOM.stopPropagation(e);
                var $this = $(this);
                var href = $this.attr('href');
                var popup = new T.Popup({
                    title: $this.text().replace(/《|》/g,'')||'云印服务协议',
                    type: 'iframe',
                    content: href,
                    ok: '我已阅读并接受',
                    no: ''
                });
                popup.on("ok", function(){
                    $("input[name='agreement']").not(":checked").click();
                });
                return false;
            });
            $(dpackage.dom).delegate(".counter a, .counter b", "selectstart", function () {
                return false;
            }).delegate(".counter a, .counter b", "selectstart", function () {
                return false;
            }).delegate(".counter a", "click", function (e) {//减数量
                var $minus = $(this);
                var $input = $minus.siblings("input");
                var val = parseInt($input.val(), 10);
                if (val > 0) {
                    val--;
                    $input.val(val);
                }
                dpackage.GetPrice();
                return false;
            }).delegate(".counter b", "click", function (e) {//加数量
                var $plus = $(this);
                var $input = $plus.siblings("input");
                var val = parseInt($input.val(), 10);
                var _val = dpackage.cfg[$input.data("value")]||1000;
                if (val < _val) {
                    val++;
                    $input.val(val);
                }
                dpackage.GetPrice();
                return false;
            }).delegate(".counter input", "blur", function (e) {//输入数字
                var $input = $(this);
                var val = $input.val();
                var _val = dpackage.cfg[$input.data("value")]||1000;
                if (isNaN(val)) {
                    val = 0;
                }
                val = parseInt(val, 10) || 0;
                if (val > _val) {
                    val = _val;
                }
                if (val < 0) {
                    val = 0;
                }
                $input.val(val);
                dpackage.GetPrice();
                return false;
            }).delegate(".counter input", "keydown.counter", function (e) {
                if(e.keyCode==13){
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).blur();
                }
            });
            $("#explain").delegate(".desctab li", "click.desctab", function (e) {
                var $this = $(this) ,idx = $this.index();
                $this.addClass("sel").siblings("li").removeClass("sel");
                var $content = $this.closest(".desctab").siblings(".explain_content");
                $content.addClass("hide");
                $content.eq(idx).removeClass("hide");
                return false;
            });
            //滚动条滚动时
            $(window).bind("scroll.pdesc resize.pdesc", function (e) {
                var $product_desc = $("#product_desc");
                if (!$product_desc.length)return;
                var _top = $(window).scrollTop();
                var _top2 = $product_desc.offset().top;
                var _top3 = $("#header_fixed").outerHeight();
                if ((_top + _top3) > _top2) {
                    $("#product_desc").addClass("pfixed");
                    $("#product_desc .ptabs").css({top: _top3 - 1});
                } else {
                    $("#product_desc").removeClass("pfixed");
                }
                /*var _top4 = $("#product_fixed_pos").offset().top;
                 if((_top+_top3)>_top4){
                 $("#product_fixed").addClass("fixed").css({top:_top3});
                 }else{
                 $("#product_fixed").removeClass("fixed");
                 }*/
                var winTop = _top + $(window).height();
                var _top4 = $("#product_hotlist").offset().top + $("#product_hotlist").outerHeight();
                var _top5 = $("#footer").offset().top;
                if (_top5 < winTop) {
                    //$("#product_hotlist_fixed").addClass("fixed").css({bottom: winTop - _top5 + 30});
                } else if (_top4 < winTop) {
                    //$("#product_hotlist_fixed").addClass("fixed").css({bottom: 20});
                } else {
                    //$("#product_hotlist_fixed").removeClass("fixed");
                }
            });
            //产品信息切换
            $("#product_desc").delegate(".ptabs li", "click", function (e) {
                _this.goContent($(this), e);
            });
        }
    };

    T.Loader(function() {
        T.GET({
            action: 'in_product/query_recharge_all',
            params: {
                state: '1'
            },
            success: function(data) {
                var _data = T.FormatData(data || {});
                _data.recharge_list = _data.recharge_list || [];
                if (_data.recharge_list && _data.recharge_list.length) {
                    dpackage.init(_data);
                    //dpackage.GetPrice();

                    //生成静态页
                    T.GenerateStaticPage({
                        domain: dpackage.params.w, //域名
                        dirname: 'package', //目录名
                        pageid: 'index', //文件名（页面名）
                        keywords:  {
                            "title": "账户充值",
                            "keywords": "云印,ininin.com,云印技术,云印官网,深圳云印,云印公司,印刷,设计,名片,会员卡,宣传用品,办公用品",
                            "description": "云印官网—中国最大的互联网印刷和设计服务平台。为您提供最优质的名片、会员卡、宣传单、折页、易拉宝、X展架、封套、画册、宣传册、手提袋等产品印刷和设计服务！云印技术(深圳)有限公司"
                        },
                        callback: function(domain, path, pageid, keywords) { //生成成功回调函数
                            T.ShowLinks();
                        }
                    });

                } else {
                    T.alt(data.msg || '账户充值服务已下架。', function(_o) {
                        _o.remove();
                        window.location = T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : '');
                    }, function(_o) {
                        _o.remove();
                        window.location = T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : '');
                    }, '返回首页');
                }
                T.PageLoaded();
            },
            failure: function(data) {
                T.alt(data.msg || '账户充值服务已下架。', function(_o) {
                    _o.remove();
                    window.location = T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : '');
                }, function(_o) {
                    _o.remove();
                    window.location = T.DOMAIN.WWW + (T.INININ ? '?' + T.INININ : '');
                }, '返回首页');
            }
        });
    });
});