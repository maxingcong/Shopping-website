require(["base", "tools"], function ($, T) {
    var wrapper = {
        init: function(){
            T.Slider({
                cont: "#card_banner",
                duration: 300,
                interval: 3500,
                direction: "lr",
                autoplay: true
            });

            var $layout = $("#layout");
            var $header = $("#header_fixed");
            $layout.delegate("#tabs_desc .tab", "click.pdesc", function(e) {
                var target = $(this).data("target");
                $(this).addClass("focus").siblings(".tab").removeClass("focus");
                var $target = $(".pro_items .pro_item:eq("+target+")", $layout);
                if ($target.length) {
                    var _top = $header.outerHeight();
                    var _top2 = $(".pro_head", $layout).outerHeight();
                    $("html, body").stop(true, true).animate({
                        scrollTop: $target.offset().top - _top - _top2 + 1
                    }, 300);
                }
            });
            $(window).bind("scroll.pdesc resize.pdesc", function(e) {
                var _top = $(window).scrollTop();
                var _top2 = $(".pro_items", $layout).offset().top;
                var _top3 = $header.outerHeight();
                var _top4 = $(".pro_head", $layout).outerHeight();
                if ((_top + _top3 + _top4) > _top2) {
                    $(".pro_head", $layout).addClass("fixed").css({
                        top: _top3
                    });
                    $layout.css({
                        "padding-top": _top4
                    });
                } else {
                    $(".pro_head", $layout).removeClass("fixed");
                    $layout.css({
                        "padding-top": 0
                    });
                }
                $(".pro_item", $layout).each(function(i, el){
                    var y = $(el).offset().top;
                    if((_top + _top3 + _top4) > y){
                        $("#tabs_desc .tab[data-target='"+i+"']", $layout).addClass("focus").siblings(".tab").removeClass("focus");
                    }
                });
            });
            /*var slider = new Slider({
                banner: $("#banner"),
                slider: $("#banner ul"),
                status: $("#banner ol"),
                autoplay: true,
                callback: function(index){
                    $("#tabs_type .tab[data-target='"+index+"']", $layout).addClass("focus").siblings(".tab").removeClass("focus");
                }
            });
            $layout.delegate("#tabs_type .tab", "click.pdesc mouseenter.pdesc", function(e) {
                var target = $(this).data("target");
                $(this).addClass("focus").siblings(".tab").removeClass("focus");
                slider.slider(target);
            });*/
        }
    };
    T.Loader(function(){
        wrapper.init();
    });
});