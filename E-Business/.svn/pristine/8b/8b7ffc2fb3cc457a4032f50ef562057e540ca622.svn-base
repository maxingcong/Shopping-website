require(["base", "tools", "oauth/qrcode", "location"], function($, T, OAuthQRCode, PCD){
    T.Loader(function() {//加载完成后
        window.T = T||{};
        OAuthQRCode(); //APP扫码登陆
        var $ulinks = $("#ulinks");
        var $olinks = $("#olinks");
        var $ulink = $ulinks.closest("li");
        var $olink = $olinks.closest("li");
        $ulinks.length && $ulinks.css("right",1220-($ulink.position().left+$ulink.outerWidth()));
        $olinks.length && $olinks.css("left",$olink.position().left+10);
        //获取用户当前地址
        T.initAddress = function(){
            if(!$("#delivery_region").geoLocation)return;
            T.Template("delivery_region", {
                _address: T.cookie("_address")||CFG_DB.DEF_PCD
            });

            var isFirst = T.cookie("_address");
            $("#delivery_region").geoLocation({
                eventType: 'mouseover',
                callback: function (value, province, city, district) {
                    console.log('delivery_region==>callback: ' + value + '');
                    $("#delivery_address").geoLocation("setValue", value);
                }
            });

            if(!isFirst){
                T.POST({
                    action: "in_common/ip_info/default_address_query"
                    ,params: { }
                    ,success:  function (data) {
                        if(data&&data.useraddress){
                            data.useraddress = T.JSON.parse(data.useraddress)||{};
                            if(data.useraddress.region&&data.useraddress.city){
                                $("#delivery_region").geoLocation("setValue", data.useraddress.region+"^"+data.useraddress.city+"^");
                            }
                        }
                    }
                });
            }
        };
        T.initAddress();
        //获取搜索关键词
        T.SetSearchKeywords = function(){
            var $searchbar = $('#head_searchbar');
            var  $keywordInput = $('input[name=keyword]', $searchbar);
            function pushCZC(keyword){
                var localhref = location.href.replace(location.search, '').replace(location.hash, '');
                _czc.push(['_trackEvent', localhref, '搜索', keyword]);
            }
            if($searchbar&&$searchbar.length){
                T.GET({ //获取输入框下推荐的搜索关键词
                    action: "in_product_new/search/find_key_word"
                    ,success: function(data){
                        console.log(data);
                        if(data.restultList&&data.restultList.length){
                            var str = '';
                            T.Each(data.restultList, function(index, v){
                                if(index==0){
                                    T.FORM().placeholder($keywordInput[0], v.srKeyWord);
                                }
                                if(index<15){
                                    str += '<a data-url="' + T.DOMAIN.WWW + 'search.html#keyword='+v.srKeyWord+'&type=2" href="javascript:;">'+ v.srKeyWord +'</a>';
                                }
                            });
                            $searchbar.find('.commend-keys').html(str);
                        }
                    }
                    ,failure: function(data, params){}
                    ,error: function(data, params){}
                },function(data){},function(data){});
                var keywords = []; //智能提示列表
                var value = ''; //上一次输入的值
                $searchbar.on('click', '.submit', function(){ //搜索
                    var keyword = $.trim($keywordInput.val()),
                        flag = false;
                    T.Each(keywords, function(index, v){ //匹配智能提示
                       if(v.keyword.toUpperCase() == keyword.toUpperCase()){
                           var a = $('#shelper a')[index];
                           $(a).trigger('click');
                           flag = true;
                       }
                    });
                    if(!flag){ //未匹配到智能提示
                        if(keyword){
                            pushCZC(keyword);
                            //var type = (T.REQUEST.keyword==keyword?T.REQUEST.type:1)||1;
                            window.location = T.DOMAIN.WWW + 'search.html#keyword=' + keyword + '&type=1';
                            $(document).trigger("dosearch");
                        }else{ //未填值搜索第一个推荐搜索词
                            var a = $('.commend-keys a', $searchbar)[0];
                            if(a){
                                pushCZC($(a).text());
                                window.location = a.href;
                                $(a).click();
                            }
                        }
                    }
                }).on('keyup', 'input[name=keyword]', function(e){ //智能提示
                    var keycode = e.keyCode || e.which;
                    //console.log(keycode);
                    if(keycode == 13){ //回车
                        $('.submit', $searchbar).trigger('click');
                    }else if(keycode == 38 || keycode == 40){ //上下键
                        var l = $('#shelper a').length;
                        //选中下拉选框
                        if(l==1){
                            $('#shelper a').addClass('sel');
                            $keywordInput.val($('#shelper a')[0].innerText);
                        }else if(l>1){
                            var $a = $('#shelper a.sel');
                            if($a.length){
                                $a.removeClass('sel');
                                if(keycode == 40){
                                    var $aNext = $a.closest('li').next('li').find('a');
                                    var $a1 = $aNext.length?$aNext:$('#shelper a').first();
                                    $a1.addClass('sel');
                                    $keywordInput.val($a1[0].innerText);
                                }
                                if(keycode == 38){
                                    var $aPrev = $a.closest('li').prev('li').find('a');
                                    var $a2 = $aPrev.length?$aPrev:$('#shelper a').last();
                                    $a2.addClass('sel');
                                    $keywordInput.val($a2[0].innerText);
                                }
                            }else{
                                if(keycode == 40){
                                    $('#shelper a').first().addClass('sel');
                                    $keywordInput.val($('#shelper a').first()[0].innerText);
                                }
                                if(keycode == 38){
                                    $('#shelper a').last().addClass('sel');
                                    $keywordInput.val($('#shelper a').last()[0].innerText);
                                }
                            }
                        }
                    }else {
                        var keyVal = $.trim($keywordInput.val());
                        if(keyVal){
                            if(keyVal.toUpperCase() != value.toUpperCase()){
                                T.GET({ //获取智能匹配
                                    action: 'in_search/product/smart_search',
                                    params: {
                                        keyword: keyVal
                                    },
                                    success: function(data){
                                        console.log(data);
                                        value = keyVal;
                                        var str = '',
                                            url = '';
                                        keywords = data.data || [];
                                        T.Each(data.data, function(index,v){
                                            if(v.productId){
                                                url = T.DOMAIN.WWW + 'product/' + v.productId + '.html'; //产品详情页
                                            }else{
                                                url = T.DOMAIN.WWW+'search.html#keyword='+ v.keyword + '&type=3'; //搜索页
                                            }
                                            str += '<li><a data-url="'+url+'" href="javascript:;">'+ v.keyword +'</a></li>';
                                        });
                                        if(str){
                                            $('#shelper').html(str).show();
                                        }else{
                                            $('#shelper').html(str).hide();
                                        }
                                    }
                                });
                            }
                        }else{
                            //清空匹配信息
                            keywords = [];
                            value = '';
                            $('#shelper').html('');
                            $('#shelper').hide();
                        }
                    }
                });
                $('body').on('click', function(){
                    $('#shelper').hide();
                });
                $('#shelper').on('click', 'li>a', function(e){
                    var $this = $(this);
                    pushCZC($this.text());
                    window.location = $this.data('url');
                    $(document).trigger("dosearch");
                });
                $('.commend-keys', $searchbar).on('click', 'a', function(){
                    var $this = $(this);
                    pushCZC($this.text()); //执行自定义搜索事件
                    window.location = $this.data('url');
                    $(document).trigger("dosearch"); //执行自定义搜索事件
                });
            }
        };
        T.SetSearchKeywords();
        //设置数量
        T.SetNumber = function(id,num,bool){
            var dom = T.DOM.byId(id);
            num = parseInt(num,10)||0;
            if(dom&&typeof num=='number'){
                if(num>0){
                    if(/^car_/.test(id)){
                        dom.innerHTML = '购物车（'+num+'）';
                    }else{
                        dom.style.display = 'inline-block';
                        if(!bool)dom.innerHTML = num;
                    }
                }else if(/^car_/.test(id)){
                    dom.innerHTML = '购物车';
                }else{
                    dom.style.display = 'none';
                }
            }
        };
        //获取未读消息数量
        T.SetMessageStatus = function(){
            T.GET({
                action: CFG_DS.message.get
                ,params: {offmsg: 1, detail:0}
                ,success: function (data) {
                    T.SetNumber('sysmsg_number',data.count, true);
                    T.SetNumber('message_count_number',data.count>99?(data.count+'+'):data.count);
                    $ulinks.css("right",1220-($ulink.position().left+$ulink.outerWidth()));
                    $olinks.css("left",$olink.position().left+10);
                }
                ,failure: function(data, params){}
                ,error: function(data, params){}
            },function(data){},function(data){});
        };
        //获取待处理订单数量
        T.SetOrderStatus = function(){
            T.GET({
                action: COM_API.order_mun
                ,success: function(data){
                    var _status = {
                        common_count: data.common ? data.common.audit + data.common.pay + data.common.notpay : 0,
                        design_count: data.design ? data.design.audit + data.design.pay + data.design.notpay : 0,
                        plan_count: data.plan ? data.plan.audit + data.plan.pay + data.plan.notpay : 0/*,
                        dist_count: data.dist ? data.dist.notpay: 0*/
                    };
                    var toUrl = '';
                    if(data.common.notpay>0){
                        toUrl = T.DOMAIN.ORDER + 'index.html';
                    }else if(data.design.notpay>0){
                        toUrl = T.DOMAIN.ORDER + 'design.html';
                    }else if(data.plan.notpay>0){
                        toUrl = T.DOMAIN.ORDER + 'package.html';
                    }else if(data.dist.notpay>0){
                        toUrl = T.DOMAIN.ORDER + 'distribute.html';
                    }
                    if(T.cookie("ORDER_NOTPAY")!=1&&toUrl){
                        T.cookie("ORDER_NOTPAY", "1");
                        T.cfm('<span class="red order_notpay">亲，您有订单未支付，是否现在去处理？</span>', function(_o){
                            window.location = toUrl;
                            _o.remove();
                        }, function(_o){
                            _o.remove();
                        }, '温馨提示', '立即处理', '暂不处理');
                    }
                    T.BindData('data', _status);
                }
                ,failure: function(data, params){}
                ,error: function(data, params){}
            },function(data){},function(data){});
            T.GET({
                action: "in_quotation/query_not_read_quotation"
                ,success: function(data){
                    T.BindData('data', {
                        new_count: data.num||0
                    });
                }
                ,failure: function(data, params){}
                ,error: function(data, params){}
            },function(data){},function(data){});
        };
        //购物车商品预览
        var Cart = T.Module({
            data: {
                cartList: []
            },
            events: {
                "click a.del": "remove"
            },
            $cont: $("#template_cart_snap_view"),
            reload: function(params, isFirst){
                var _this = this;
                if(isFirst && $("#template_cart_list_view").length)return;
                if(T.CartReload){
                    T.CartReload();
                }else{
                    if(T._LOGED){
                        params = params||{type: "0"};
                        params.to_index = 3;
                        params.address = (T.cookie("_address")||CFG_DB.DEF_PCD).replace(/\^+$/g, "");
                        T.GET({
                                action: CFG_DS.mycart.get,
                                params: params,
                                success: function(data, params){
                                    _this.data.cartList = data.cartList||[];
                                    _this.data.cartNum = data.cartNum||0;
                                    _this.data.totalProductPrice = T.RMB(data.totalProductPrice);
                                    _this.render();
                                },
                                failure: function(data, params){},
                                error: function(data, params){}
                            },
                            function(data){},
                            function(data){});
                    }else{
                        _this.render();
                    }
                }
            },
            render: function(data){
                var _this = this;
                T.Template("cart_snap", data);
                T.Template("cart_list", data);
                T.BindData('data', data);
                T.SetNumber('car_number', data.cartNum||0);
            },
            /**
             * 删除购物车记录
             * @param $this
             * @param e
             */
            remove: function($this, e){
                var _this = this;
                var $item = $this.closest("li");
                var cid = $item.data("cart_id");
                if (!cid) return;
                T.POST({
                    action: CFG_DS.mycart.del,
                    params: {
                        cart_ids: cid
                    },
                    success:  function (data) {
                        T.msg("删除成功");
                        _this.reload();
                    },
                    failure: function(data, params){},
                    error: function(data, params){}
                });
            }
        });
        T.Cart = new Cart();
        //设置状态
        T.SetStatus = function(){
            T.Cart.reload(null, true);
            T.SetMessageStatus();
            T.SetOrderStatus();
        };

        //导航中的分类菜单
        var $nav_category = $("#nav_category");
        if($nav_category&&$nav_category.length){
            T.GET({
                action: CFG_DS.product.get_category_multi,
                params: {
                    position: 'home',
                    category_ids: CFG_DB.PCFG.VNAV
                },
                success: function(data){
                    console.log(data);
                    T.Template("nav_category_list", data, true);
                    /*var htmls = '';
                    if(data.categoryList&&data.categoryList.length){
                        T.Each(data.categoryList, function(index,v){
                            htmls += '<li class="nav_category_item">';
                            if(v.categorys&& v.categorys.length){
                                htmls += '<div class="children_list"><div class="subitems">';
                                T.Each(v.categorys, function(index,v){
                                    htmls += '<dl class="fore1"><dt><a href="'+T.DOMAIN.WWW+'search.html#keyword='+v.categoryName+'&type=6">'+v.categoryName+'</a></dt><dd>';
                                    if(v.products && v.products.length){
                                        T.Each(v.products, function(index,v){
                                            var _link = T.DOMAIN.WWW+'product/'+(v.targetId>0?v.targetId:v.productId)+'.html';
                                            if(v.targetId>0&&v.productId!=v.targetId)_link += '?pid='+v.productId;
                                            htmls += '<a href='+_link+' target="_blank">'+ v.productName+'</a>';
                                        });
                                    }else if(v.categorys && v.categorys.length){
                                        T.Each(v.categorys, function(index,v){
                                            var _link = T.DOMAIN.WWW+'search.html#keyword=' + v.categoryName + '&type=8';
                                            htmls += '<a href='+_link+' target="_blank">'+ v.categoryName+'</a>';
                                        });
                                    }
                                    htmls += '</dd></dl>';
                                });
                                htmls += '</div>';
                                if(v.pics&& v.pics.length>0){
                                    var picArr = v.pics;
                                    for(var i= 0,l=picArr.length;i<l;i+=2){
                                        var str = picArr[i].picPath?'<li><a href="'+picArr[i].picHref+'" title="" target="_blank"><img src="'+picArr[i].picPath+'" class="img-loaded" alt="" /></a></li>':'';
                                        if(picArr[i+1]){
                                            str += picArr[i+1].picPath?'<li><a href="'+picArr[i+1].picHref+'" title="" target="_blank"><img src="'+picArr[i+1].picPath+'" class="img-loaded" alt="" /></a></li>':'';
                                        }
                                        htmls += '<ul class="imgs">' + str + '</ul>';
                                    }
                                }
                                htmls += '</div>';
                            }
                            htmls += '<a href="javascript:;" class="nav_category_content">'+ v.categoryName+'</a>';
                            htmls += '</li>';
                        });
                    }
                    $nav_category.find('.nav_category_list').html(htmls);*/
                }
                ,failure: function(data, params){}
                ,error: function(data, params){}
            },function(data){},function(data){});
        }

        //设计频道分类菜单
        var $design_category = $("#template-design_category_list-view");
        if($design_category&&$design_category.length){
            T.GET({
                action: 'in_product_new/web_design/web_design_category_query',
                params: {},
                success: function(data){
                    console.log(data);
                    data.categoryList = data.categoryList||[];
                    T.Each(data.categoryList, function(i, item){
                        T.Each(item.designCategoryList, function(k, design){
                            design.categoryNameEllipsis = T.GetEllipsis(design.categoryName, 20);
                        });
                    });
                    T.Template("design_category_list", data, true);
                }
                ,failure: function(data, params){}
                ,error: function(data, params){}
            },function(data){},function(data){});
        }

        //滑动
        $(".slide-panel").each(function(i, el){
            var $el = $(el);
            T.Slider({
                cont: el,
                duration: $el.data("duration"),
                interval: $el.data("interval"),
                direction: "lr",
                autoplay: true
            });
        });

        if(T._LOGED){
            T.SetStatus();
        }
    });
});