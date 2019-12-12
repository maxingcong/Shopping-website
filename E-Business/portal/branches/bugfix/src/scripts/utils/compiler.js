"use strict";
/**
 * @fileOverview 编译器
 */
define("utils/compiler", ["utils/base", "utils/dom", "libs/template", "libs/template-native"], function(Base, DOM, Template, TemplateNative){
    /**
     * 编译器
     * @summary 编译器
     * @namespace Utils.Compiler
     * @author Woo
     * @version 1.1
     * @since 2016/2/24
     */
    return {
        template: Template,
        templateNative: TemplateNative,
        /**
         * 根据ID绑定数据
         * @method template
         * @param {String} uuid DOM节点ID标识
         * @param {String} [viewId] 视图节点ID标识
         * @param {Object} data 数据源（对象）
         * @example
         * Utils.Compiler.template('order_list', {orderList: [{orderCode: '111',...}...]);
         * @returns {Object} 展示模板解析结果的容器对象
        template: function(uuid, viewId, data){
            if(typeof(viewId)=="object"){
                data = viewId;
                viewId = uuid;
            }
            var temp = DOM.byId("template-"+  uuid);
            var view = DOM.byId("template-" + viewId + "-view");
            var html = Template("template-"+uuid, data);
            if(temp&&view){
                view.innerHTML = html;
                return view;
            }else if(temp){
                return html
            }
        },
         */
        /**
         * 根据ID前缀绑定数据
         * @method bindData
         * @param {String} k ID前缀
         * Utils.Compiler.bindData('order', {orderCode: '111',...});
         * @param {Object} data 数据源（对象）
         */
        bindData: function(k, data){
            var _this = this;
            k = k?k+'-':'';
            Base.each(data, function(key, value){
                if(Base.type(value, /^array|Object$/)){
                    _this.bindData(k + key, value);
                }else{
                    var obj = DOM.byId(k + key);
                    if(obj){
                        var tn = ('' + obj.tagName).toLowerCase();
                        value = typeof value=='undefined' ? '' : value;
                        value = /price/i.test(key) ? T.RMB(value) : value;
                        if(/input|textarea/.test(tn)){
                            obj.value = value;
                        }else if(/img/.test(tn)){
                            obj.src = value;
                        }else if(/select/.test(tn)){
                            obj.src = value;
                            var options = obj.options;
                            for (var o = 0; o < options.length; o++) {
                                if (options[o].value.Trim()==value){
                                    options[o].selected = true;
                                }
                            }
                        }else{
                            obj.innerHTML = value;
                        }
                    }
                }
            });
        }
    };
});