require(["base", "tools"], function ($, T) {
    var search = {
        params: T.getRequest(location.hash),
        data: {
            args: '',
            sortField: '',
            sortDirection: 'desc',
            from: 0,
            size: 48,
            type: '0'
        },
        pagin: {
            totalAccount: 0,
            curPage: 1,
            totalPage: 1
        },
        init: function(){
            var _this = this;
            _this.data.type = _this.params.type || "0";
            _this.firstSearch();
            _this.bindEvents();
        },
        firstSearch: function(){
            var _this = this;
            _this.params = T.getRequest(location.hash);
            _this.pagin = {
                totalAccount: 0,
                curPage: 1,
                totalPage: 1
            };
            if(_this.params.keyword){
                $("#head_searchbar input[name='keyword']").val(_this.params.keyword);
                _this.data.args = _this.params.keyword;
                _this.doSearch(true);
            }
        },
        bindEvents: function(){
            var _this = this;
            $(document).on("dosearch", function(e){
                _this.firstSearch();
            });
            $('#template_result_lists_view').on('click', '.sort-a a', function(){
                var type =  $(this).data('type');
                if(type == _this.data.sortField && type != 'product_price'){
                    return;
                }
                if(_this.data.sortField == 'product_price'){
                    $(this).nextAll('a').last().removeClass('price-down price-up');
                }
                _this.data.sortField = type;
                _this.data.sortDirection = 'desc';
                $(this).addClass('sel').siblings().removeClass('sel');
                if(type == 'product_price'){
                    if($(this).hasClass('price-up')){
                        $(this).addClass('price-down').removeClass('price-up');
                        _this.data.sortDirection = 'desc';
                    }else{
                        _this.data.sortDirection = 'asc';
                        $(this).addClass('price-up').removeClass('price-down');
                    }
                }
                _this.data.from = 0;
                _this.pagin.curPage = 1;
                _this.doSearch();
            }).on('click', '.before', function(){
                if(_this.pagin.curPage == 1){
                    return;
                }
                _this.pagin.curPage -=1;
                _this.data.from = (_this.pagin.curPage-1)*_this.data.size;
                _this.doSearch();
            }).on('click', '.after', function(){
                if(_this.pagin.curPage == _this.pagin.totalPage){
                    return;
                }
                _this.pagin.curPage +=1;
                _this.data.from = (_this.pagin.curPage-1)*_this.data.size;
                _this.doSearch();
            });
        },
        doSearch: function(isFirst){
            var _this = this,
                ref = '';
            if(T._LOGED){
                _this.data.username = T._ACCOUNT;
            }
            ref = document.referrer != null?document.referrer|| T.DOMAIN.WWW+'search.html' : navigator.userAgent;

            ref = ref.indexOf('?')>0?ref.split('?')[0]:ref;
            _this.data.referer = ref;
            _this.params = T.getRequest(location.hash);
            _this.data.type = _this.params.type || "0";
            T.GET({
                action: 'in_search/product/search',
                params: _this.data,
                success: function(data){
                    console.log(data);
                    var _data = data.data.data || {};
                    _data.total = data.data.total || 0;
                    if(_data.product&&_data.product.length){
                        var num = Math.ceil(_data.product.length/4);
                        var reg = new RegExp('\['+_this.params.keyword + '\]+', 'gi');
                        T.Each(_data.product, function(index, v){
                            var simpleDesc = v.simpleDesc || '',
                                productName = v.productName || '',
                            simpleDesc = T.GetEllipsis(simpleDesc, productName, 56);
                            //标红
                            var str1 = simpleDesc.replace(reg, function(word){
                                return '<span class="red">'+word+'</span>';
                            });
                            var str2 = productName.replace(reg, function(word){
                                return '<span class="red">'+word+'</span>';
                            });
                            v.repSimpleDesc = '<span class="name">'+str2+ '</span>' + str1;
                        });
                        if(_data.design_product&&_data.design_product.length>(num)){
                            _data.design_product = _data.design_product.slice(0, num);
                        }
                        T.Each(_data.design_product, function(index, v){
                            //标红
                            var str3 = v.designName?v.designName.replace(reg, function(word){
                                return '<span class="red">'+word+'</span>';
                            }):'';
                            v.repDesignName = str3;
                        });
                    }
                    _data.logoStr = 'LOGO设计'.replace(reg, function(word){
                        return '<span class="red">'+word+'</span>';
                    });
                    _data.keyword = _this.params.keyword;
                    if(_data.total==0){
                        T.Template('result_lists', _data);
                        var params = _this.data;
                        params.args = '';
                        params.sortField= 'sales_volume';
                        params.sortDirection= 'desc';
                        T.GET({
                            action: 'in_search/product/search',
                            params: params,
                            success: function(data){
                                var _data = data.data.data || {};
                                _data.total = data.data.total || 0;
                                if(_data.product&&_data.product.length){
                                    _data.product = _data.product.slice(0, 5);
                                }
                                T.Each(_data.product, function(index, v){
                                    v.simpleDesc = v.simpleDesc || '';
                                    v.productName = v.productName || '';
                                    v.simpleDescEllipsis = T.GetEllipsis(v.simpleDesc, v.productName, 46);
                                });
                                T.Template('recommend_list', _data);
                            }
                        });
                    }else{
                        if(isFirst){
                            T.Template('result_lists', _data);
                            T.Template('product_list', _data);
                            T.Template('design_list', _data);
                        }else{
                            T.Template('product_list', _data);
                            T.Template('design_list', _data);
                        }
                        $('#template_product_list_view').css('min-height', $('#template_design_list_view').css('height'));
                        _this.pagin.totalAccount = _data.total;
                        _this.pagin.totalPage = Math.ceil(_data.total/_this.data.size);
                        T.BindData('data', _this.pagin);
                        T.Paginbar({
                            num: 3,
                            size: _this.data.size,
                            total: Math.ceil(_data.total / _this.data.size),
                            index: Math.ceil(_this.data.from/_this.data.size)+1,
                            paginbar: 'paginbar',
                            callback: _this.paging
                        });
                    }
                }
            });
        },
        paging: function (obj, index, size, total) {
            search.data.from = (index-1)*search.data.size;
            search.pagin.curPage = index;
            search.doSearch();
        }
    };
    search.init();
});