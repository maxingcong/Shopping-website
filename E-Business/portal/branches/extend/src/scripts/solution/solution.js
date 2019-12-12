require(["base", "tools"], function ($, T) {
    T.Loader(function () {
        var solution = {
            init: function(){
                this.events();
            },
            events: function(){
                $('.slide .square').hover(
                    function(){
                        $(this).find('.buybtn').stop(true).animate({height: '34px'});
                    },
                    function(){
                        $(this).find('.buybtn').stop(true).animate({height: '0'});
                    }
                );
            }
        }
        solution.init();
    });
});