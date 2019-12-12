define(["base", "tools"], function ($, T) {
    if (T._NEED_AUDIT) {
        var htmls = ['<li class="vline"></li>']
        htmls.push('<li><a href="javascript:;" data-status="6">待审核 <span id="data_audit" class="yellow"></span></a></li>')
        $("#ofilter ul>li:first-child").after(htmls.join(''))
    }
    //确认收货
    var receive = {
        data: null,
        popup: null,
        callback: null,
        reload: function (data, callback) {
            var _this = this;
            if (!data) {
                return;
            }
            _this.data = data;
            console.log(_this.data);
            _this.callback = callback;
            _this.show();
            T.Template('apply_for_order', _this.data);
            _this.bindEvents();
        },
        bindEvents: function () {
            var _this = this;
            _this.popup.setPosition()
            T.FORM().placeholder(T.DOM.byId('applyOperateDesc'), "请填写申请原因");
            var $text = $("#applyOperateDesc")
            _this.popup.on("ok", function () {
                if (!$text.val().length) {
                    T.msg('请填写申请原因！');
                    return false;
                }
                T.POST({
                    action: 'in_order/update_vip_order',
                    params: {
                        orderCode: _this.data.order_code,
                        operateType: 5,
                        operateDesc: $text.val()
                    },
                    success: function (data) {
                        T.msg('提交成功！');
                        if (_this.callback) {
                            _this.callback();
                        }
                    }
                });
            });
        },
        show: function () {
            var _this = this;
            _this.popup = new T.Popup({
                id: 'apply_for_order',
                zIndex: 1030,
                width: 600,
                title: '提交申请',
                type: 'html',
                content: '<div id="template_apply_for_order_view" class="pop-apply-for-order checkboxs"></div>',
                ok: '提交申请',
                no: '暂不提交'
            });
        }
    };
    return receive;
});