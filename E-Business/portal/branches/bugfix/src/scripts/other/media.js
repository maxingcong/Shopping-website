require(["base", "tools", "modules/point"], function($, T, TakeAddress){
    var media = {
        init: function(){
            T.GET({
                action: T.DOMAIN.SCRIPTS+'config/media.js'
                ,params: {jsoncallback: 'INININ_MEDIA_CALLBACK'}
                ,success: function(data){
                    var _data = T.FormatData(data||{});
                    T.Template('media', _data);
                }
                ,failure: function(data, params){}
                ,error: function(data, params){}
            },function(data){},function(data){});
        }
    };
    T.Loader(function(){
        media.init();
    });
});