require(["base", "tools", "location"], function($, T, PCD){
    T.Loader(function() {//加载完成后
        //获取搜索关键词
        T.SetSearchKeywords = function(){
            var $searchbar = $('#head_searchbar');
            if($searchbar&&$searchbar.length){
                T.GET({ //获取输入框下推荐的搜索关键词
                    action: "in_product_new/search/find_key_word"
                    ,success: function(data){
                        console.log(data);
                        if(data.restultList&&data.restultList.length){
                            var str = '';
                            T.Each(data.restultList, function(index, v){
                                /*if(index==0){
                                    T.FORM().placeholder($keywordInput[0], v.srKeyWord);
                                }*/
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
            }
        };
        T.SetSearchKeywords();
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
                                    htmls += '<dl class="fore1"><dt><a href="'+T.DOMAIN.WWW+'search.html?keyword='+v.categoryName+'&type=6">'+v.categoryName+'</a></dt><dd>';
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
    });
});