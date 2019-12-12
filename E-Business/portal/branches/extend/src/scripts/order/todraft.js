require(["base", "tools"], function ($, T) {
    //名片对稿
    function Todraft(){
        var _this = this;
        _this.uuid = T.UUID();
        _this.data = null;
        _this.popup = null;
        _this.html = '';
        var dom = T.DOM.byId("todraft_dom_mp");
        if(dom){
            _this.html = dom.innerHTML;
            dom.parentNode.removeChild(dom);
        }
    }
    Todraft.prototype = {
        data: null,//版本数据
        no: '',//当前版本号
        version: '',//当前版本
        Init: function(default_no){//初始化弹出框
            var _this = this;
            var dom = T.DOM.byId('todraft_panel');
            if(dom){
                dom.innerHTML = _this.html;
                _this.domid = 'todraft_panel';
                _this.Reload(default_no);
                _this.Events();
            }else{
                _this.popup = T.Popup({
                    //fixed: true,
                    id: _this.uuid + 'popup',
                    zIndex: 1500,
                    title: '在线对稿',
                    content: _this.html,
                    callback: function(){
                        _this.domid = _this.uuid + 'popup_layer';
                        _this.Reload(data);
                        _this.Events();
                    }
                });
            }
            if(!_this.enabled){
                document.title = document.title+'-查看稿件'
            }
        },
        Query: function($item, orderCode, orderProductId){//查询模板版本信息
            var _this = this;
            _this.$item = $item;
            _this.enabled = 0;
            if(_this.html){
                T.GET({
                    action: 'in_order/query_for_design_or_draft'
                    ,params: {order_code: orderCode, order_product_id:orderProductId}
                    ,success: function(data) {
                        var _data = T.FormatData(data||{});
                        _data.template_version_list = _data.template_version_list||[];
                        var _template_version_list = [];
                        T.Each(_data.template_version_list, function(k, v){
                            if(v.image_path){
                                _template_version_list.push(v);
                            }
                        });
                        _data.template_version_list = _template_version_list;
                        _this.data = _data;
                        _this.enabled = _data.order_product_status==107||_data.order_product_status==110;//是否提交修改需求
                        if(_this.data.template_version_list.length){
                            todraft.Init(_data.default_no);
                        }else{
                            T.alt("查看稿件出错，缺少稿件缩略图，请联系您的专属客服。", function(_o){
                                _o.remove()
                                _this.Back();
                            }, function(_o){
                                _o.remove()
                                _this.Back();
                            });
                        }
                    }
                });
            }
        },
        Reload: function(no, version){//加载模板版本
            var _this = this;
            _this.no = no;
            var data = _this.data.template_version_list[0];
            if(_this.no){
                T.Each(_this.data.template_version_list, function(k, v){
                    if(_this.no==v.no){
                        data = v;
                    }
                });
            }
            if(_this.version!=version){
                _this.no = data.no;
            }
            _this.version = data.version;
            data.enabled = _this.enabled;
            data.relation = _this.data.relation;
            if(data.relation){
                var arr = data.relation.split("-");
                data.relationOrderCode = arr[0];
                data.relationSerialNumber = arr[1];
            }
            var images = data.image_path.split(',');
            data._images = images||[];
            T.Template("todraft", data);
            T.FORM().placeholder(T.DOM.byId('change_request'), "请填写稿件修改需求");//请填写稿件修改需求
            T.BindQQService();
            var image0 = T.DOM.byId("todraft_mp_image_0");
            var image1 = T.DOM.byId("todraft_mp_image_1");
            $("#todraft_version").html("V"+_this.no);
            if(_this.enabled){
                $("#change_request").removeAttr("readonly");
            }else{
                $("#" + _this.domid + " .form_btm").remove();
            }
            if(!$("#change_request").val()){
                $("#change_request").val(data.change_request).focus();
            }
            //images = [];
            if(images&&images.length&&images[0]){
                image0.src = '/resources/loading.gif';
                _this.LoadImage(images[0], function(imgsrc, nw, nh) {
                    image0.src = imgsrc;
                    if(_this.popup){
                        _this.popup.setPosition();
                    }
                }, function(imgsrc) {}, 5);
                if(images[1]){
                    image1.src = '/resources/loading.gif';
                    $("#todraft_mp_image_1").closest(".image").removeClass("hide");
                    _this.LoadImage(images[1], function(imgsrc, nw, nh) {
                        image1.src = imgsrc;
                        if(_this.popup){
                            _this.popup.setPosition();
                        }
                    }, function(imgsrc) {}, 5);
                }else{
                    $("#todraft_mp_image_1").closest(".image").addClass("hide");
                }
            }else{
                $(".tbody", _this.dom).remove();
                if(_this.popup){
                    _this.popup.remove();
                }
            }
        },
        Commit: function(){//确认定稿
            var _this = this;
            if(!_this.enabled)return;
            T.cfm('确认稿件无误后将不可再修改稿件，是否确认稿件无误？', function(_o){
                _o.remove();
                T.POST({
                    action: CFG_DS.myorder.upd_draft
                    ,params: {type:'1', order_code: _this.data.order_code, order_product_id:_this.data.order_product_id}
                    ,success: function(data){
                        $(".col5 div",_this.$item).remove();
                        $(".col6 .status_str",_this.$item).text("定稿完成");
                        location.reload();
                        if(_this.popup){
                            _this.popup.remove();
                            _this.popup = null;
                        }
                        _this.Back();
                    }
                });
            }, function(_o){
                _o.remove();
            }, '温馨提示','确认稿件无误','看看再说');
        },
        Save: function(){//提交修改需求
            var _this = this;
            if(!_this.enabled)return;
            var change_request = $("#change_request").val();
            if(!change_request){
                T.msg('请填写稿件修改需求！');
                return;
            }
            T.POST({
                action: 'in_order/save_do_draft'
                ,params: {
                    template_id: _this.data.template_id,
                    version: _this.version,
                    order_code: _this.data.order_code,
                    order_product_id: _this.data.order_product_id,
                    change_request: change_request
                }
                ,success: function(data) {
                    if(_this.popup){
                        _this.popup.remove();
                        _this.popup = null;
                    }
                    $(".col6 .status_str",_this.$item).text("待修改");
                    T.msg('提交修改需求成功！我们会尽快为您修改。');
                    _this.Back();
                }
            });
        },
        Back: function(){
            var _this = this;
            var href = document.referrer||"";
            setTimeout(function(){
                if(href.indexOf(T.DOMAIN.MEMBER + "odetail.html")==0){
                    location.replace(T.DOMAIN.MEMBER + "odetail.html?o=" + _this.data.order_code + "&t=10");
                }else{
                    location.replace(T.DOMAIN.ORDER + "design.html");
                }
            }, 1500);
        },
        Events: function(){//绑定事件
            var _this = this;
            T.TIP({
                id: 'vers_tip',
                container: '#' + _this.domid,
                trigger: '.vers',
                content: function(trigger) {
                    return '<dl id="template_version_list_view" class="radios radios_mini ver_list"></dl>';
                },
                callback: function(){
                    var _tip = this;
                    T.Template('version_list', {
                        DFVER: _this.no,
                        version_list: _this.data.template_version_list||[]
                    });
                    $("#template_version_list_view").delegate(".radio", "click", function(e) {
                        var $this = $(this);
                        var no = $this.data("no");
                        var version = $this.data("version");
                        _this.Reload(no, version);
                        if(_this.data.template_version_list[0].no==no){
                            $("#todraft_panel .file_btn").removeClass("dis");
                        }else{
                            $("#todraft_panel .file_btn").addClass("dis");
                        }
                        _tip.remove();
                    });
                },
                width: 'auto',
                left: true,
                offsetX: 0,
                offsetY: 0
            });
            $('#' + _this.domid).delegate(".upddraft .radio", "click", function(){//确认对稿
                var $this = $(this), $radios = $this.closest(".upddraft");
                $(".radio", $radios).removeClass("sel");
                $this.addClass("sel");
                _this.dodraftType = $this.data("type")||"";
                if(_this.dodraftType=="good"){
                    $("li::gt(1)", $radios).show();
                    $("#change_request").focus();
                }else if(_this.dodraftType=="smt"){
                    $("li:gt(1)", $radios).hide();
                }
            }).delegate(".file_btn", "click", function(){//提交修改需求
                if($(this).hasClass("dis"))return;
                if(_this.dodraftType=="good"){
                    _this.Save();
                }else if(_this.dodraftType=="smt"){
                    _this.Commit();
                }else{
                    T.msg("请您仔细核对稿件内容，并勾选对稿结果再点击“确认”");
                }
            });
        },
        /**
         * 加载图片
         * @param {String} imgsrc 图片地址
         * @param {Function} success 加载完成回调函数
         * @param {Function} failure 加载失败回调函数
         * @param {Boolean} retry 加载失败重试次数，默认为不重试，负数：一直重试，整数：重试指定次数
         */
        LoadImage: function(imgsrc, success, failure, retry) {//加载图片
            var _this = this;
            if (!imgsrc) return;
            retry = parseInt(retry || 0) || 0;
            var img = new Image();
            img.onload = function() {
                if (typeof(success) == 'function') success.call(_this, imgsrc, img.naturalWidth || img.width, img.naturalHeight || img.height);
            }
            img.onabort = img.onerror = function() {
                if (retry) {
                    retry--;
                    _this.LoadImage(imgsrc, success, failure, retry);
                } else {
                    if (typeof(failure) == 'function') failure.call(_this, imgsrc);
                }
            }
            img.src = imgsrc;
        }
    }
    var todraft = new Todraft();
    var params = T.getRequest();
    T.Loader(function(){
        var dom = T.DOM.byId('todraft_panel');
        params.o = decodeURIComponent(params.o||'');
        var arr = params.o.split(',')||[];
        if(dom&&/\d+/.test(arr[0])&&/\d+/.test(arr[1])){
            todraft.Query(dom, arr[0], arr[1]);
        }else{
            window.location.replace(T.DOMAIN.ORDER+'design.html');
        }
    });
});