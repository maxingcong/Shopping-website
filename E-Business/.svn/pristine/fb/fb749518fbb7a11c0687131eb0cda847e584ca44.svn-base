require(["base", "tools"], function ($, T) {
    var emailActivate = {
		data: {
			time: 5,
			result: 1
		},
        params: T.getRequest(),
        init: function () {
            var that = this;
			T.GET({
				action: 'in_user/activation_email',
				params: T.getRequest(),
				success: function (data, params) {
					that.render(data, params, true);
				},
				failure: function(data, params) {
					that.render(data, params, true);
				}
			}, function(data, params) {
				that.render(data, params, true);
			}, function(data, params) {
				that.render(data, params, true);
			});
        },
		render: function (data, params, bool){
            var that = this;
			that.data.result = data.result;
			T.Template("activate", that.data, true);
			var obj = null,
				step = function(){
				if(that.data.time>1){
					that.data.time--;debugger
					T.BindData("data", that.data, true);
				}else{
					obj && clearInterval(obj);
					location.replace(T.DOMAIN.PASSPORT+'index.html');
				}
			};
			if(data.result==0){
				obj = setInterval(step, 1000);
			}
			$("#upanel").removeClass("load");
        }
    };
    T.Loader(function() {
        emailActivate.init();
        T.PageLoaded();
    });
});