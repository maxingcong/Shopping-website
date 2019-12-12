require(["base", "tools"], function ($, T, Slider) {
    T.Loader(function () {
        var solution = {
            init: function(){
                this.events();
            },
            events: function(){
                $('#card_list').on('mouseenter', '.card', function(){
                    $(this).stop(true).animate({left: '-600px'}, 600);
                }).on('mouseleave', '.card', function(){
                    $(this).stop(true).animate({left: '0'});
                });
            }
        }
        solution.init();
    });
});