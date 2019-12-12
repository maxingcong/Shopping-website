require(["base", "tools"], function ($, T) {
    if (!T._LOGED) T.NotLogin();//window.location = T.DOMAIN.WWW + '?'+T.INININ;

    var Cart = T.Module({
        data: {
            cartList: []
        },
        events: {
            "click a.del": "remove",
            "click a.delall": "removeAll",
            "click .cart_to_payment": "toPayment",
            "click input[name='chk']": "checked",
            "click input[name='chkall']": "checkedAll"
        },
        $cont: $("#template_cart_list_view"),
        init: function(){
            var _this = this;
            _this.reload();
            _this.dom = T.DOM.byId("mycart");
            T.TIP({
                container: '#template_cart_list_view',
                trigger: '.up_help',
                content: function(trigger) {
                    return '预计出货时间是指商品生产完成的时间，不包含<a class="lnk" href="'+T.DOMAIN.FAQ+'distribution.html" target="_blank">配送时间</a>。';
                },
                width: 'auto',
                offsetX: 0,
                offsetY: 0
            });
            T.CartReload = function(){
                _this.reload();
            };
        },
        reload: function(params){
            var _this = this;
            params = params||{type: "0"};
            params.address = (T.cookie("_address")||CFG_DB.DEF_PCD).replace(/\^+$/g, "");
            T.GET({
                action: CFG_DS.mycart.get,
                params: params,
                success: function(data, params){
                    _this.data.cartList = data.cartList||[];
                    _this.data.cartNum = data.cartNum||0;
                    _this.data.totalProductPrice = T.RMB(data.totalProductPrice);
                    _this.render();
                }
            });
        },
        render: function(data){
            var _this = this;
            T.Template("cart_snap", data);
            T.Template("cart_list", data);
            T.BindData("data", data);
            if(data.cartList.length){
                $("#menu").hide();
                $("#head_searchbar").hide();
                $("#order_step").show();
                var chkall = true;
                T.Each(data.cartList, function(k, v){
                    if(!v.status){
                        chkall = false;
                        return false;
                    }
                });
                if(chkall){
                    $("input[name='chkall']", _this.dom).each(function (i, el) {
                        $(el).attr("checked", "checked");
                        $(el).closest(".checkbox").addClass("sel");
                    });
                }else{
                    $("input[name='chkall']", _this.dom).each(function (i, el) {
                        $(el).removeAttr("checked");
                        $(el).closest(".checkbox").removeClass("sel");
                    });
                }
            }else{
                T.HotSell();
                $("#order_step").hide();
                $("#menu").show();
                $("#head_searchbar").show();
            }
            T.SetNumber('car_number', data.cartNum||0);
            T.PageLoaded();
        },
        /**
         * 删除购物车记录
         * @param $this
         * @param e
         */
        remove: function($this, e){
            var _this = this;
            var $ul = $this.closest("ul");
            var cid = $('.col1 input', $ul).val();
            if (!cid) return;
            T.cfm('确定要删除选中商品吗？', function (_o) {
                _o.remove();
                T.POST({
                    action: CFG_DS.mycart.del,
                    params: {
                        cart_ids: cid
                    },
                    success:  function (data) {
                        T.msg("删除成功");
                        _this.reload();
                    }
                });
            });
        },
        removeAll: function($this, e){
            var _this = this;
            var chks = T.GetChecked(_this.dom, "chk");
            if (!chks || !chks.length) {
                T.msg('请至少选择一项您要删除的商品！');
                return;
            }
            T.cfm('确定要删除选中商品吗？', function (_o) {
                _o.remove();
                T.POST({
                    action: CFG_DS.mycart.del,
                    params: {
                        cart_ids: chks.join(',')
                    },
                    success:  function (data) {
                        T.msg("删除成功");
                        _this.reload();
                    }
                });
            });
        },
        toPayment: function($this, e){
            var _this = this;
            var chks = T.GetChecked(_this.dom, "chk");
            if (!chks || !chks.length) {
                T.msg('请至少选择一项您要购买的商品！');
            } else {
                window.location = T.DOMAIN.CART + 'ordering.html?a=' + T.Params.encode(T.Base64.encode(T.Params.encode(","+ T.RMB(_this.data.totalProductPrice))));
            }
            return false;
        },
        checked: function($this, e){
            var _this = this;
            var cid = $this.val();
            if (cid) {
                T.POST({
                    action: CFG_DS.mycart.chk,
                    params: {
                        cart_ids: cid,
                        status: $this.attr("checked")?'1':'0'
                    },
                    success:  function (data) {
                        _this.reload();
                    }
                });
            }
        },
        checkedAll: function($this, e){
            var _this = this;
            var chks = [];
            $("input[name='chk']", _this.dom).each(function (i, el) {
                chks.push(el.value);
            });
            if(chks.length){
                T.POST({
                    action: CFG_DS.mycart.chk,
                    params: {
                        cart_ids: chks.join(','),
                        status: $this.attr("checked")?'1':'0'
                    },
                    success:  function (data) {
                        _this.reload();
                    }
                });
            }
        }
    });
    T.Loader(function() {
        new Cart();
    });
});