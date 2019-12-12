require(["base", "tools", "modules/point"], function ($, T, TakeAddress) {
    $(".upanel").delegate("dt.faq_tit, .open .faq_close a", "click", function(e){
        var $this = $(this).closest(".faq_item");
        if($this.hasClass("open")) {
            $this.removeClass("open").siblings("dl.faq_item").removeClass("open");
        } else {
            $this.addClass("open").siblings("dl.faq_item").removeClass("open");
        }
    });
    var _hash = location.hash||'#0';
    var _index = parseInt(_hash.substring(1))||0;
    $(".upanel dl.faq_item:eq("+_index+") dt.faq_tit").click();
    if(_index>0){
        var offset = $(".upanel dl.faq_item:eq("+_index+") dt.faq_tit").offset();
        if(offset&&offset.top){
            $("html, body").stop(true,true).animate({ scrollTop: offset.top-40 }, 300);
        }
    }
    T.Loader(function(){
        //自提点地址
        new TakeAddress({
            callbacks: {
                loaded: function(){}
            }
        });
    });
});
























