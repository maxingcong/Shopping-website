require(["base", "tools"], function ($, T) {
    var integral = {
        init: function(){
            T.GET({
                action: T.DOMAIN.SCRIPTS+'config/integral.js'
                ,params: {jsoncallback: 'INININ_INTEGRAL_CALLBACK'}
                ,success: function(data){
                    var _data = T.FormatData(data||{});
                    T.Template('integral', _data);
                }
                ,failure: function(data, params){}
                ,error: function(data, params){}
            },function(data){},function(data){});
        }
    };
    T.Loader(function(){
        integral.init();
    });
});