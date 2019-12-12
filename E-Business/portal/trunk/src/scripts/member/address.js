require(["base", "tools", "modules/address"], function ($, T, ReceiverAddress) {
    if(!T._LOGED) T.NotLogin();
    T.Loader(function(){
        var receiverAddress = new ReceiverAddress({
            isCheckedEvent: false,
            callbacks: {
                loaded: function(data, params){
                    T.PageLoaded();
                }
            }
        });
    });
});