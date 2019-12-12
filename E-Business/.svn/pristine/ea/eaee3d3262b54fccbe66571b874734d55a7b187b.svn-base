define("widgets/slider", ["base", "tools"], function($, T){
    /**
     * 轮播
     * @param {Object} options
     * @param {String} options.cont 容器
     * @param {String} [options.number=1] 每次滑动的个数
     * @param {String} [options.duration=300] 动画持续时间
     * @param {String} [options.interval=3500] 动画间隔时间
     * @example
     * Slider({
         *     cont: "#slide-panel",
         *     duration: 300,
         *     interval: 1500,
         *     direction: "lr",
         *     autoplay: false
         * });
     * @returns {*}
     */
    function Slider(options) {
        var _this = this,
            opts = options||{};
        opts.percent = opts.percent||false; //是否按百分比滑动
        opts.duration = opts.duration>=0?opts.duration:300;
        opts.interval = opts.interval>=0?opts.interval:3500;
        opts.direction = opts.direction||"lr"; //lr:从左到右，rl:从右到左
        opts.autoplay = opts.autoplay==null?true:opts.autoplay;
        _this.options = opts;
        _this.$cont = $(options.cont);
        _this.$list = $(".slide-layer", _this.$cont);
        _this.$panel = _this.$list.closest(".slide-panel");
        _this.$dots = $(".slide-dots", _this.$cont);

        var $firstItem = $(".slide-item:first-child", _this.$list);

        _this.index = 0;
        opts.number = opts.number||_this.$panel.data("number")||_this.$cont.data("number")||1;
        _this.len = $(".slide-item", _this.$list).length;

        _this.width = _this.$cont.width();
        _this.itemWidth = $firstItem.outerWidth(true);

        var num = Math.ceil(_this.width/_this.itemWidth); //每页个数

        _this.count = Math.ceil(_this.len / opts.number);

        if (!_this.$cont.length || !_this.$panel.length || !_this.$list.length || !_this.count || _this.$list.data("status") || _this.count<=1){
            return;
        }else{
            _this.$list.data("status", "installed");
        }

        _this.setDotClass();

        if(num > 1){
            var remainder = _this.len % num,
                maxConDiv = _this.maxComDiv(_this.len, num), //最大公约数
                minComMul = Math.max(_this.minComMul(_this.len / maxConDiv, num / maxConDiv), _this.len), //最小公倍数
                cloneNum = minComMul / _this.len, //克隆次数
                htmls = _this.$list.html();
                _this.count = minComMul / opts.number; //轮播页数
            for(var i=0; i<=cloneNum; i++){
                _this.$list.append(htmls);
            }
        }else{
            _this.$list.append($firstItem.clone());
        }

        if(!opts.percent){
            _this.$list.width(_this.itemWidth * $(".slide-item", _this.$list).length);
        }

        _this.autoplay();

        _this.$cont.off("click.prev", ".slide-prev").on("click.prev", ".slide-prev", function (e) {
            _this.direction = "lr";
            _this.slider(_this.index - 1);
        }).off("click.next", ".slide-next").on("click.next", ".slide-next", function (e) {
            _this.direction = "rl";
            _this.slider(_this.index + 1);
        }).off("mouseenter.slider").on("mouseenter.slider", function (e) {
            if (_this.timer){
                clearInterval(_this.timer);
            }
        }).off("mouseleave.slider").on("mouseleave.slider", function (e) {
            _this.autoplay();
        });
        _this.$dots.off("mouseenter.slider", ".slide-dot").on("mouseenter.slider", ".slide-dot", function (e) {
            var index = $(this).index();
            _this.slider(index);
        });

        if(_this.count<=1){
            $(".slide-prev, .slide-next", _this.$cont).remove();
        }
        return _this;
    }
    Slider.prototype = {
        /**
         * 滑动
         * @param {Number} [index=0]
         */
        slider: function (index) {
            var _this = this,
                opts = _this.options;
            if (typeof(index) === "undefined") {
                _this.index += opts.direction=="lr" ? 1 : -1;
            } else {
                _this.index = index;
            }
            if (_this.index < 0) {
                _this.index = _this.count - 1;
            }
            if (_this.index > _this.count) {
                _this.$list.css("left", 0);
                _this.index = 1;
            }
            _this.$list.stop(true).animate({
                    left: opts.percent ? (-_this.index * opts.number * 100 + "%") : (-_this.index * opts.number * _this.itemWidth + "px")
                },
                {
                    speed: "easing",
                    duration: opts.duration
                });
            _this.setDotClass();
        },
        /**
         * 自动播放
         */
        autoplay: function(){
            var _this = this,
                opts = _this.options;
            if(opts.autoplay){
                if (_this.timer) clearInterval(_this.timer);
                _this.timer = setInterval(function(){
                    _this.slider();
                }, opts.interval);
            }
        },
        /**
         * 设置状态点样式
         * @param {Number} [index=0]
         */
        setDotClass: function(index){
            var _this = this;
            index = _this.index||0;
            $(".slide-dot", _this.$dots).removeClass("sel").eq(index<_this.count?index:0).addClass("sel");
        },
        /**
         * 求两数最大公约数
         * Max common divisor
         * 辗转相除法，求最大公约数
         * @param {Number} m
         * @param {Number} n
         */
        maxComDiv: function(m, n){
            var u = +m,
                v = +n,
                t = v;
            while(v!=0){
                t = u%v;
                u = v;
                v = t;
            }
            return u;
        },
        /**
         * 求两数最小公倍数
         * Max common multiple
         * @param {Number} a
         * @param {Number} b
         */
        minComMul: function(a, b){
            var minNum = Math.min(a, b),
                maxNum = Math.max(a,b),
                i = minNum,
                vPer = 0;
            if(a===0 || b===0){
                return maxNum;
            }
            for(; i<=maxNum; i++){
                vPer = minNum * i;
                if(vPer%maxNum === 0){
                    return vPer;
                }
            }
        }
    };
    return function(options){
        return new Slider(options);
    };
});