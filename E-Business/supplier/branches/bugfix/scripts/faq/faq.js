!(function(window, document, undefined) {
    "use strict";
    var faq = {
        $header: $("#bs-header"), //头部条
        $sidebar: $("#bs-sidebar"), //侧边栏
        $container: $("#container"), //内容容器
        init: function(){
            var _this = this;
            $.getJSON(T.DOMAIN.WWW+'scripts/data/product.json',function(data){
                T.Template("faq_products", data);
            });
            //_this.auto();
            _this.slide(location.hash.replace("#","")||0);
            _this.bindEvents();
        },
        bindEvents: function(){
            var _this = this;
            /*$(window).on("scroll.sidebar resize.sidebar", function(e) {
                _this.auto();
            });*/
            $('#bs-sidebar li').on("click", function(){
                _this.slide($(this).index());
            })
        },
        auto: function(){
            var _this = this;
            var h1 = _this.$header.outerHeight();
            var top0 = $(window).scrollTop();
            $(".faqs .faq", _this.$container).each(function(index, el){
                var $this = $(el);
                var y = $this.offset().top||0;
                if((top0 + h1) > y){

                    $("a", _this.$sidebar).removeClass("active").eq(index).addClass("active");
                }
            });
        },
        slide: function(index){
            var _this = this;
            var $target = $(".faqs .faq:eq("+index+")", _this.$container);
            if ($target.length) {
                $("a", _this.$sidebar).removeClass("active").eq(index).addClass("active");
                var h1 = _this.$header.outerHeight();
                $("html, body").stop(true, true).animate({
                    scrollTop: $target.offset().top - h1 + 5
                }, 300);
            }
        }
    };
    faq.init();
}(window, document));