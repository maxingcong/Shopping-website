require(["base", "tools", "modules/card", "modules/card_template", "modules/design_editor", "modules/order_history"], function ($, T, Card, CardTemplate, DesignEditor, OrderHistory) {
    if (!T._LOGED) T.NotLogin();
    var card = Card(),
        cardTemplate = CardTemplate(),
        MyCard = {
            $cont: $("#card"),
            init: function () {
                var _this = this;
                card.on("loaded", function(){
                    T.PageLoaded();
                });
                cardTemplate.on("loaded", function(){
                    T.PageLoaded();
                });

                T.TIP({
                    container: '#card',
                    trigger: '.empty .icon_help',
                    content: function(trigger) {
                        return '<p>如果您已有名片印刷文件，可以选择设计服务后，<p/><p>联系客服享福利，免费为您制作专属名片模板。<p/>';
                    },
                    width: 'auto',
                    offsetX: 0,
                    offsetY: 0
                });

                $(".searchbar .textbox", _this.$cont).each(function(i, el){
                    T.FORM().placeholder(el, i?"文件名/产品名":"姓名/职位/手机号");
                });

                _this.events();

                if(location.hash=='#2'){
                    $(".u-tab[data-idx='2']", _this.$cont).click();
                }else{
                    cardTemplate.load();
                }
            },
            events: function () {
                var _this = this;
                _this.$cont.on("click.tab", ".u-tab", function (e) {
                    var $this = $(this),
                        idx = $this.data("idx");
                    $this.addClass("sel").siblings(".u-tab").removeClass("sel");
                    if(idx==1){
                        cardTemplate.load();
                        $(".searchbar", _this.$cont).addClass("hide");
                    }else if(idx==2){
                        card.load();
                        $(".searchbar", _this.$cont).removeClass("hide").find("[name]").focus();
                    }
                    $(".tab-content[data-idx='"+idx+"']", _this.$cont).removeClass("hide").siblings(".tab-content").addClass("hide");
                }).on("click.search", ".searchbar .search_btn", function(e){ //关键字搜索
                    card.params.keyword = $.trim(T.toDBC($(this).prev(".textbox").val()));
                    card.params.index = 0;
                    card.load();
                    return false;
                }).on("blur.keyword", ".searchbar [name='keyword']", function(e){
                    card.params.keyword = $.trim(T.toDBC($(this).prev(".textbox").val()));
                    card.params.index = 0;
                    card.load();
                }).on("click.look", ".card-list .look", function(e){
                    var $this = $(this);
                    var cardId = $this.data("card_id")||"";
                    if(OrderHistory.popup && OrderHistory.popup.remove){
                        OrderHistory.popup.remove();
                        OrderHistory.popup = null;
                    }
                    if(cardId){
                        OrderHistory.reload({card_id: cardId, offset: 0, count: 10}, true);
                    }
                }).on("click.edit", ".card-list .edit", function(e){
                    var $this = $(this);
                    DesignEditor({
                        cardId: $this.data("card_id")||""
                    });
                    return false;
                }).on("click.add_card", ".card-list .add-card", function(e){
                    $(".u-tab[data-idx='1']", _this.$cont).click();
                    return false;
                });
            }
        };
    T.Loader(function(){
        MyCard.init();
    });
});