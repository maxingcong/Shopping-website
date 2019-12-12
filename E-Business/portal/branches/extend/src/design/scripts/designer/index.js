require(["base", "tools"], function($, T){
    var designers = {
        init: function() {
            this.reload();
        },
        reload: function(){
            var _this = this;
            T.GET({
                action: 'in_product_new/designer_list'
                ,params: {}
                ,success: function (data) {
                    T.PageLoaded();
                    data._bk = _this.breakword;
                    T.Template('designer_list', data, true);
                    T.Slider({
                        cont: "#designers",
                        direction: "lr",
                        autoplay: true
                    });
                }
            });
        },
        breakword: function(str){
            return str?str.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '<br/>'):'';
        }
    }
    designers.init();
});