define("widgets/navpos", ["base", "tools"], function($, T){
    /**
     * 楼层导航
     * @param {Object} options
     * @param {String} options.$cont 容器
     * @param {String} options.$nav 导航
     * @param {String} [options.namespace=navpos] 命名空间
     * @param {String} [options.navItem=.nav-item] 导航项
     * @param {String} [options.floorItem=.floor-item] 楼层项
     * @param {String} [options.headerFixed=#header_fixed] 固定头部
     * @example
     * NavPos({
         *     $cont: $("#cont),
         *     $nav: $("#nav),
         *     namespace: "navpos",
         *     navItem: ".nav-item",
         *     floorItem: ".floor-item",
         *     headerFixed: "#header_fixed"
         * });
     * @returns {*}
     */
    function NavPos(options) {
        var _this = this;
        var opts = options||{};
        _this.opts = opts;
        opts.$nav.addClass("hide");
        opts.headerFixed = opts.headerFixed||"#header_fixed";
        opts.$nav.off("click."+ opts.namespace).on("click."+ opts.namespace, opts.navItem, function(e){
            var $this = $(this),
                navIdx = $this.data("nav_idx"),
                topHeight = $(opts.headerFixed).outerHeight(),
                $item = $(opts.floorItem + "[data-nav_idx='"+navIdx+"']", opts.$cont);
            $("html, body").stop(true, true).animate({
                scrollTop: $item.offset().top - topHeight
            }, 300);
        });
        $(window).off("scroll."+ opts.namespace +" resize."+ opts.namespace).on("scroll."+ opts.namespace +" resize."+ opts.namespace, function(e) {
            _this.setPosition(opts);
        });
        setTimeout(function(){
            _this.setPosition(opts);
        }, 100);
        _this.setPosition(opts);
    }
    NavPos.prototype = {
        setPosition: function(opts){
            opts = opts||this.opts;
            var $win = $(window),
                winTop = $win.scrollTop(),
                winHeight = $win.height(),
                height = opts.$nav.outerHeight(), //楼层导航高度
                contHeight = opts.$cont.outerHeight(), //楼层导航高度
                navTop = opts.$cont.offset().top,
                contTop = opts.$cont.offset().top;
            if((winTop + winHeight)>contTop){
                var minTop = Math.min(winTop, contTop),
                    maxTop = Math.min(contTop + contHeight, winTop + winHeight);
                var curTop = Math.max(contTop, winTop + (winHeight - height)/2);
                curTop = Math.min(contTop + contHeight - height, curTop);
                opts.$nav.css("top", curTop - winTop);
                opts.$nav.removeClass("hide");
            }else{
                opts.$nav.addClass("hide");
            }

            var $item = null, //屏幕可视区域，显示的高度最大的楼层
                maxHeight = 0; //屏幕可视区域，显示的高度最大的楼层高度
            $(opts.floorItem, opts.$cont).each(function(i, el){
                var $el = $(el),
                    minTop = winTop, //屏幕最上方TOP值
                    maxTop = winTop + winHeight, //屏幕最下方TOP值
                    startTop = $el.offset().top, //楼层项最上方TOP值
                    endTop = startTop + $el.outerHeight(); //楼层项最上方TOP值
                if(startTop <= minTop && endTop >= minTop){
                    if((endTop - minTop) >= winHeight/2){
                        $item = $el;
                        return false;
                    }
                }else if(startTop <= maxTop && endTop >= maxTop){
                    if((startTop - minTop) <= winHeight/2){
                        $item = $el;
                        return false;
                    }
                }else if(startTop >= minTop && endTop <= maxTop){
                    $item = $el;
                    return false;
                }
            });
            var navIdx = $($item).data("nav_idx");
            if(navIdx){
                $(opts.navItem + "[data-nav_idx='"+navIdx+"']", opts.$nav).addClass("sel").siblings(opts.navItem).removeClass("sel");
            }
        }
    };
    return function(options){
        return new NavPos(options);
    };
});