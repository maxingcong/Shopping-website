define("modules/address", ["base", "tools", "location"], function($, T, PCD){
    return T.Module({
        template: "address_list",
        data: {
            adrdom: null, //地址弹出框对象
            adrform: null, //表单对象
            addressId: "", //选中的地址ID
            addressList: [] //地址列表
        },
        events: {
            "click .additem, .addbtn": "insert",
            "click .adritem": "checked",
            "click .adritem .def": "setDefault",
            "click .adritem .upd": "update",
            "click .adritem .del": "remove",
            "click .shwmore .showmore, .shwmore .hidemore": "showHide"
        },
        isCheckedEvent: false, //是否有选中事件
        init: function(options){
            var _this = this;

            options = options||{};
            _this.isCheckedEvent = options.isCheckedEvent;

            _this.adrform = document.getElementById("address_form");
            _this.bindForm();

            _this.load(null);
        },
        /**
         * 加载地址
         * @param {Object} [params=null] 查询参数
         * @param {Function} [callback] 回掉函数
         */
        load: function(param, callback){
            var _this = this;
            T.GET({
                action: CFG_DS.address.get,
                success: function(data, params) {
                    data = data||{};
                    if (data.addressId) {
                        data.addressList = [data];
                    } else {
                        data.addressList = data.addressList || [];
                    }
                    var _addressList = [];
                    T.Each(data.addressList, function(i, address){
                        if(address&&address.address!==''&&address.receiver!==''&&(address.phone!==''||address.tel!=='')){
                            _addressList.push(address);
                        }
                    });
                    //_addressList = _addressList.slice(0, 10);
                    _this.data.addressList = _addressList;
                    if(param&&param.address_id){
                        _this.data.addressId = param.address_id;
                    }
                    if(param&&param.isAdd&&_addressList.length>1&&_addressList[0].isDefault){
                        _this.data.addressId = _addressList[1].addressId;
                    }
                    _this.data.addressId = T.Array.check(_addressList, _this.data.addressId, "addressId", true).join(";");
                    _this.data._collapsed = _this.$cont.hasClass("collapsed");
                    _this.render();
                    var num = $(".additem", _this.$cont).length?2:3;
                    if(_this.data._collapsed){
                        $(".adritem:gt("+num+")", _this.$cont).hide();
                    }else{

                        $(".adritem:gt("+num+")", _this.$cont).show();
                    }
                    if(_this.isCheckedEvent){
                        _this.setChecked(_this.data.addressId);
                    }else{
                        $("#address_count").text(Math.min(10, data.addressList.length));
                        $(".adritem", _this.$cont).addClass("sel");
                    }
                    if(typeof(callback)=="function"){
                        callback(data, params);
                    }else if(_this.callbacks.loaded){
                        _this.callbacks.loaded(data, params);
                    }else{
                        _this.loaded(data, params, callback||0);
                    }
                }
            });
        },
        /**
         * 加载完成
         complete: function(){
            var _this = this;
        },
         */
        /**
         * 得到指定ID的地址对象
         * @param {String} addressId 地址ID
         */
        get: function(addressId){
            return T.Array.get(this.data.addressList, addressId, "addressId");
        },
        /**
         * 设置选中
         * @param {String} addressId 地址ID
         */
        setChecked: function(addressId){
            var _this = this;
            if(_this.isCheckedEvent){
                var data = _this.get(addressId);
                $(".adritem.sel", _this.$cont).removeClass("sel");
                var $item = $("#address_item-" + addressId);
                if(data&&$item&&$item.length){
                    $item.addClass("sel");
                }else{
                    $item = $(".adritem:first-child", _this.$cont);
                    data = _this.get($item.data("address_id"));
                    if(data&&$item&&$item.length){
                        $item.addClass("sel");
                    }
                }
                if(data&&data.addressId){
                    _this.data.addressId = data.addressId;
                }
                if(_this.callbacks.checked)_this.callbacks.checked(data);
            }
        },
        /**
         * 选中地址
         * @param $this
         * @param e
         */
        checked: function($this, e){
            var _this = this;
            if(_this.isCheckedEvent){
                e.stopPropagation();
                var $item = $this.closest(".adritem", _this.$cont);
                var addressId = $item.data("address_id");
                if (!addressId) return;
                _this.setChecked(addressId);
            }
        },
        /**
         * 设置默认地址
         * @param $this
         * @param e
         */
        setDefault: function($this, e){
            e.stopPropagation();
            var _this = this;
            var $item = $this.closest(".adritem", _this.$cont);
            var addressId = $item.data("address_id");
            if (!addressId) return;
            T.POST({
                action: CFG_DS.address.adr_def,
                params: {
                    address_id: addressId
                },
                success: function(data) {
                    T.msg("设置成功");
                    $item.addClass("def").siblings(".adritem").removeClass("def");
                }
            });
            return false;
        },
        /**
         * 展开全部
         * @param $this
         * @param e
         */
        showHide: function($this, e){
            e.stopPropagation();
            var _this = this;
            var $adrList = $("ul.radios", _this.$cont);
            var num = $(".additem", _this.$cont).length?2:3;
            if ($this.hasClass("showmore")) {
                $(".adritem:gt("+num+")", $adrList).show();
                $this.removeClass("showmore").addClass("hidemore").text("收起全部");
                $adrList.stop(true, true).animate({
                    height: Math.ceil(($(".adritem", $adrList).length + 1) / 4) * $(".adritem:eq(0)", $adrList).outerHeight(true)
                }, 300, function(e){
                    $adrList.height("");
                });
                $adrList.parent().removeClass("collapsed");
            } else {
                $this.removeClass("hidemore").addClass("showmore").text("展开全部");
                $adrList.stop(true, true).animate({
                    height: 270
                }, 300, function(e){
                    $(".adritem:gt("+num+")", $adrList).hide();
                    $adrList.parent().addClass("collapsed");
                });
            }
        },
        /**
         * 新增地址
         * @param $this
         * @param e
         */
        insert: function($this, e){
            e.stopPropagation();
            var _this = this;
            _this.adrdom = T.dailog(_this.adrform, "使用新地址");
            $("[name='address']", _this.adrform).val("").focus();
            $("#hid_address_id", _this.adrform).val("");
            $(".form_item .submit", _this.adrform).html('添加这个地址<input type="submit" value="">');
            return false;
        },
        /**
         * 修改地址
         * @param $this
         * @param e
         */
        update: function($this, e){
            e.stopPropagation();
            var _this = this;
            var $item = $this.closest(".adritem", _this.$cont);
            var addressId = $item.data("address_id");
            var address = _this.get(addressId);
            if (!address||!addressId) return;
            _this.adrdom = T.dailog(_this.adrform, "修改收货地址");
            PCD.initSelect("address", address.address);
            $("input[name='address']", _this.adrform).val((address.address||"").split("^")[3]||"").focus();
            $("input[name='phone']", _this.adrform).val(address.phone).focus();
            $("input[name='tel']", _this.adrform).val(address.tel).focus();
            $("input[name='email']", _this.adrform).val(address.email).focus();
            $("input[name='receiver']", _this.adrform).val(address.receiver).focus();
            $(".form_item .submit", _this.adrform).html('保存这个地址<input type="submit" value="">');
            $("#hid_address_id", _this.adrform).val(address.addressId);
            return false;
        },
        /**
         * 删除地址
         * @param $this
         * @param e
         */
        remove: function($this, e){
            e.stopPropagation();
            var _this = this;
            var $item = $this.closest(".adritem", _this.$cont);
            var addressId = $item.data("address_id");
            if (!addressId) return;
            T.POST({
                action: CFG_DS.address.adr_del,
                params: {
                    address_id: addressId
                },
                success: function(data) {
                    T.msg("删除成功");
                    $item.animate({
                        opacity: 0
                    }, 500, function() {
                        $item.remove();
                        _this.load(null, function(){});
                    });
                }
            });
            return false;
        },
        formatValue: function(value){
            if(value==null)value = "";
            return String(value).replace(/\^+/g, "");
        },
        /**
         * 绑定表单
         */
        bindForm: function(){
            var _this = this;
            //保存地址
            T.FORM("address", CFG_FORM["address"], {
                before: function() {
                    var _form = this;
                    _form.params.address = _this.formatValue(_form.params.address); //替换用户输入的特殊字符
                    var params = {
                        receiver: _form.params.receiver,
                        address: _this.formatValue(_form.params.province) + '^' + _this.formatValue(_form.params.city) + '^' + _this.formatValue(_form.params.area) + '^' + _this.formatValue(_form.params.address)
                    };
                    if (_form.params.address_id) params.address_id = _form.params.address_id;
                    if (_form.params.phone) params.phone = _form.params.phone;
                    if (_form.params.tel) params.tel = _form.params.tel;
                    if (_form.params.email) params.email = _form.params.email;
                    _form.action = _form.params.address_id ? CFG_DS.address.adr_upd : CFG_DS.address.adr_add;
                    _form.params = params;
                    if (_form.params.address_id) {
                        _form.data = _this.get(_form.params.address_id);
                    } else {
                        _form.data = {};
                    }
                },
                success: function(data, params) {
                    if (_this.adrdom){
                        _this.adrdom.remove();
                    }
                    if(params.address_id){
                        T.msg("修改成功");
                        _this.load(params, function(){});
                    }else{
                        T.msg("添加成功");
                        _this.load({
                            isAdd: true
                        }, function(){});
                    }
                },
                failure: function(data, params){
                    if(data.result==1&&params.address_id){
                        if (_this.adrdom){
                            _this.adrdom.remove();
                        }
                        T.msg("修改成功");
                        _this.data.addressId = params.address_id;
                        _this.setChecked(_this.data.addressId);
                    }else{
                        T.msg(data.msg|| T.TIPS.DEF);
                    }
                }
            });
        }
    });
});
