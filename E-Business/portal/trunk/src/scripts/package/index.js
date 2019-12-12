require(["base", "tools"], function ($, T) {
    var dpackage = {
        data: null,
        params: T.getRequest(location.hash.substring(1))||{},
        status: false,
        timeobj: null,
        interval: 1000,
        step: 50,
        curr: 0,
        form:  {
            action: 'in_order/plan_create',//加入购物车
            prevent: true,
            items: {
                /*inviter: {
                    tips: {
                        empty: '请填写推荐人',
                        error: '请填写推荐人'
                    },
                    rule: 'nonempty'
                },*/
                agreement: {
                    tips: {
                        empty: '请阅读并接受《云印账户充值协议》',
                        error: '请阅读并接受《云印账户充值协议》'
                    },
                    required: true,
                    rule: 'nonempty',
                    pattern: /\S+/
                }
            }
        },
        dom: null,
        cfg: {
            50: 100
            ,200: 100
            ,500: 100
            ,800: 100
            ,1000: 50
            ,2000: 50
            ,5000: 50
        },
        _attrs: '',//账户充值价格查询参数
        init: function(data){
            dpackage.data = data||null;
            data.DEF_PID = dpackage.params.pid||'';
            T.Template('package', data);
            dpackage.dom = T.DOM.byId('package');
            dpackage.GetPrice();
            T.Each(data.recharge_list, function(k, v){
                dpackage.form.items['package_'+ v.id] = {
                    tips: {
                        empty: '请输入数量',
                        type: '只能输入数字',
                        mismatch: '只能输入数字',
                        error: '请输入数量',
                        min: '数量不能小于0',
                        max: '数量不能大于'+(dpackage.cfg[v.recharge_amount]||1000)
                    },
                    rule: 'number',
                    required: true,
                    min: 0,
                    max: dpackage.cfg[v.recharge_amount]||1000
                };
            });
            
            T.FORM('package', dpackage.form, {
                before: function(){
                    var _this = this;
                    if (!T._LOGED) {
                        T.LoginForm(0, function(){
                            _this.submit();
                        });
                        _this.action = '';
                        return;
                    }
                    _this.action = _this.action||dpackage.action;
                    var attrs = [];
                    T.Each(_this.params, function(k, v){
                        if(/^package_/.test(k)&&v&&v>0){
                            attrs.push(k.replace(/^package_/,'')+','+v);
                        }
                    });
                    var params = {
                        data: attrs.join(';'),
                        total_price: T.RMB(dpackage._totalPrice)
                    };
                    //params.inviter = _this.params.inviter;
                    /*if(_this.params.inviter){
                     params.source = _this.params.inviter;
                     }else */
                    if(T._STORE&&T._SNICKNAME){
                        params.source = T._SNICKNAME;
                    }else{
                        params.source = '云印电商';
                    }

                    if(!params.data){
                        dpackage.action = _this.action;
                        _this.action = '';
                        T.msg('请至少选择一个充值金额！');
                        return;
                    }
					if(T._TYPE==3 && T._OPERATOR_CODE){ //代下单操作人编号
						params.operator_code = T._OPERATOR_CODE;
					}
                    _this.params = params;
                }
                ,success: function (data, params) {
                    window.location = T.DOMAIN.CART + "order.html?t="+data.type+"&o=" + data.orderCode+(T.INININ?'&'+T.INININ:'');
                }
            });
            //this.getContentOffset();
            this.bindEvents();
        },
        GetValue: function(){
            var attrs = [], inputs = dpackage.dom.getElementsByTagName('input');
            if(inputs||inputs.length){
                var i = 0, input = null;
                for(i=0; input=inputs[i]; i++){
                    if(input&&input.name&&input.value.Trim()&&input.value.Trim()>0&&/^package_/.test(input.name)){
                        attrs.push(input.name.replace(/^package_/,'')+','+input.value.Trim());
                    }
                }
            }
            return attrs;
        },
        GetPrice: function(params){
            params = params||{};
            if(!params.data){
                params.data = dpackage.GetValue().join(';');
            }
            //2015-04-30 update
            if(dpackage._attrs!=params.data){
                dpackage._attrs = params.data;
            }else if(params.data){
                return;
            }
            if(!params.data){
                dpackage._totalPrice = 0;
                dpackage._totalPresent = 0;
                dpackage._totalIntegral = 0;
                dpackage._totalServiceTimes = 0;
                dpackage.curr = 0;
                dpackage.SetPrice();
                return;
            }
            $("#package .submit").append('<span class="doing"><span>计算中...</span></span>');
            $("#total_amount .number").html(T.DOING);
            $("#total_present .number").html(T.DOING);
            $("#total_integral .number").html(T.DOING);
            $("#total_service_times .number").html(T.DOING);
            $("#total_price").html(T.DOING);

            dpackage.status = true;
            T.POST({
                action:'in_product/check_recharge_price'
                ,params: params
                ,success: function(data){
                    $("#package .submit .doing").remove();
                    dpackage.status = false;
                    if(data){
                        dpackage._totalPrice = data.totalPrice||0;
                        dpackage._totalPresent = data.totalPresent||0;
                        dpackage._totalIntegral = parseInt(data.totalIntegral,10)||0;
                        dpackage._totalServiceTimes = parseFloat(data.totalServiceTimes,10)||0;
                        dpackage.curr = 0;
                        dpackage.SetPrice();
                    }
                }
            });
        },
        SetPrice: function(){
            $("#total_price").text(T.RMB(dpackage._totalPrice));
            dpackage.stopwatch(parseInt($("#total_amount .number").data("value"),10)||0, parseInt($("#total_present .number").data("value"),10)||0, parseInt($("#total_integral .number").data("value"),10)||0, parseInt($("#total_service_times .number").data("value"),10)||0);
        },
        stopwatch: function(total_amount, total_present, total_integral, total_service_times){
            if(dpackage.timeobj){
                clearTimeout(dpackage.timeobj);
            }
            dpackage.curr++;
            var count = dpackage.interval/dpackage.step;
            var scale = (count-dpackage.curr)/count;
            if(dpackage.curr>count)return;
            if(dpackage.curr==count){
                scale = 0;
                $("#total_amount .number").data("value", dpackage._totalPrice);
                $("#total_present .number").data("value", dpackage._totalPresent);
                $("#total_integral .number").data("value", dpackage._totalIntegral);
                $("#total_service_times .number").data("value", dpackage._totalServiceTimes);
            }

            var v0 = Math.round(dpackage._totalPrice-(dpackage._totalPrice-total_amount)*scale);
            $("#total_amount .number").text(v0);

            var v1 = Math.round(dpackage._totalPresent-(dpackage._totalPresent-total_present)*scale);
            /*if(v1>=10000){
             v1 = v1/10000;
             v1 = Math.round(v1*10000)/10000;
             $("#total_present .unit").text("万");
             }else{
             v1 = Math.round(v1);
             $("#total_present .unit").html("");
             }*/
            $("#total_present .number").text(v1);

            var v2 = Math.round(dpackage._totalIntegral-(dpackage._totalIntegral-total_integral)*scale);
            /*if(v2>=10000){
             v2 = v2/10000;
             v2 = Math.round(v2*10000)/10000;
             $("#total_integral .unit").text("万");
             }else{
             v2 = Math.round(v2);
             $("#total_integral .unit").html("");
             }*/
            $("#total_integral .number").text(v2);

            $("#total_service_times .number").text(Math.round(dpackage._totalServiceTimes-(dpackage._totalServiceTimes-total_service_times)*scale));

            if(total_amount!=dpackage._totalPrice||total_present!=dpackage._totalPresent||total_integral!=dpackage._totalIntegral||total_service_times!=dpackage._totalServiceTimes){
                dpackage.timeobj = setTimeout(function(){
                    dpackage.stopwatch(total_amount, total_present, total_integral, total_service_times);
                },dpackage.step);
            }
        },
        
        /**
         * 获取内容各区块的offset.top值
         */
        getContentOffset : function(){
            var _this = this;
            var anchors = [], tops=[];
            var $productDesc = $("#product_desc");
            var li = $('.desctab li', $productDesc);
            li.each(function(i, el){
                var anchor = $(el).data("index");
                anchors.push(anchor);
                tops.push(Math.floor($('.p_contents [data-index="'+anchor+'"]', $productDesc).offset().top));
            })
            return _this.contentOffset = {anchors: anchors, tops: tops};
        },
        focusTabs: function(){
            var _this = this;
            var $productDesc = $("#product_desc");
            var li = $('.desctab li', $productDesc);
            if (!li.length) {return;}
            var offset = _this.contentOffset||_this.getContentOffset();
            var scroll_h = $(window).scrollTop() + $("#header_fixed").outerHeight() + li.closest('.desctab').outerHeight();
            var tops = offset.tops;
            //console.log(scroll_h);
            if (scroll_h < tops[0]) {
                li.eq(0).addClass("sel").siblings("li").removeClass("sel");
            }else if (scroll_h >= tops[tops.length-1]) {
                li.eq([tops.length-1]).addClass("sel").siblings("li").removeClass("sel");
            }else{
                for (var i = 0; i < tops.length -1; i++) {
                    if(tops[i] <= scroll_h && scroll_h < tops[i+1]){
                        li.eq([i]).addClass("sel").siblings("li").removeClass("sel");
                        break;
                    }
                }
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
            /*
            $("#explain").delegate(".desctab li", "click.desctab", function (e) {
                var $this = $(this) ,idx = $this.index();
                $this.addClass("sel").siblings("li").removeClass("sel");
                var $content = $this.closest(".desctab").siblings(".explain_content");
                $content.addClass("hide");
                $content.eq(idx).removeClass("hide");
                return false;
            });*/
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
                //页签被选中
                _this.focusTabs();
                /*var _top4 = $("#product_fixed_pos").offset().top;
                 if((_top+_top3)>_top4){
                 $("#product_fixed").addClass("fixed").css({top:_top3});
                 }else{
                 $("#product_fixed").removeClass("fixed");
                 }
                var winTop = _top + $(window).height();
                var _top4 = $("#product_hotlist").offset().top + $("#product_hotlist").outerHeight();
                var _top5 = $("#footer").offset().top;
                if (_top5 < winTop) {
                    $("#product_hotlist_fixed").addClass("fixed").css({bottom: winTop - _top5 + 30});
                } else if (_top4 < winTop) {
                    $("#product_hotlist_fixed").addClass("fixed").css({bottom: 20});
                } else {
                    $("#product_hotlist_fixed").removeClass("fixed");
                }*/
            });
            //产品信息切换
            $("#product_desc").on("click", ".ptabs li", function (e) {
                var key = $(this).data('index') || $(this).data("target");//新产品 or 老产品
                var index = $(this).index();
                var _top = $("#header_fixed").outerHeight() + $(this).closest(".ptabs").outerHeight();
                var offset = _this.contentOffset || _this.getContentOffset();
                $("html, body").stop(true, true).animate({
                    scrollTop: offset.tops[index] - _top
                }, 300);
            });
        }

    };
    T.Loader(function(){
        T.GET({
            action:'in_product/query_recharge_all'
            ,params: {state: '1'}
            ,success: function(data){
                var _data = T.FormatData(data||{});
                _data.recharge_list = _data.recharge_list||[];
                if(_data.recharge_list&&_data.recharge_list.length){
                    dpackage.init(_data);
                    dpackage.GetPrice();
                }else{
                    T.alt(data.msg||'账户充值服务已下架。', function(_o){
                        _o.remove();
                        window.location = T.DOMAIN.WWW+(T.INININ?'?'+T.INININ:'');
                    }, function(_o){
                        _o.remove();
                        window.location = T.DOMAIN.WWW+(T.INININ?'?'+T.INININ:'');
                    }, '返回首页');
                }
                T.PageLoaded();
            }
            ,failure: function(data){
                T.alt(data.msg||'账户充值服务已下架。', function(_o){
                    _o.remove();
                    window.location = T.DOMAIN.WWW+(T.INININ?'?'+T.INININ:'');
                }, function(_o){
                    _o.remove();
                    window.location = T.DOMAIN.WWW+(T.INININ?'?'+T.INININ:'');
                }, '返回首页');
            }
        });
    });
});