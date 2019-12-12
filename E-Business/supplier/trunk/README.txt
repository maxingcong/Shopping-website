业务js统一在页面最底部引入，必须引入的js及顺序如下：
<script type="text/javascript" src="./scripts/libs/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="./scripts/libs/bootstrap.min.js"></script>
<script type="text/javascript" src="./scripts/libs/bootstrap-datetimepicker.js"></script>
<script type="text/javascript" src="./scripts/libs/utils.js"></script>
<script type="text/javascript" src="./scripts/common.js"></script>
注意：
1、bootstrap-datetimepicker.js如果不用，可以不引入，但其他的js必须引入，切顺序不能变
2、头部的css及js在开发时请直接复制套用，除改动路径外，请不要做其他改动
3、如要引入其他第三方j基于jQuery的插件，引用放在utils.js之前
4、业务逻辑js放在common.js之后


MD5加密：
Utils.md5('xxx');

base64加密：
Utils.base64.encode('xxx');

base64解密：
Utils.base64.decode('eHh4');


模板解析引擎template.js整合到了utils.js，无需额外引入，加入了命名空间Utils
自定义调用：Utils.template.xxx

common.js提供了template.js的快捷调用
T.Template("模板名", "数据"); //模板名不包含“template-”前缀
注意：
1、定义模板的容器id必须以“template-”开头
2、展示模板解析结果的容器id必须以“template-”开头切以“-view”结尾
3、T.Template("模板名", "数据");调用后返回的是DOM对象，若要使用jQuery，请先将其转换为jQuery对象，如：
var view = T.Template("模板名", "数据");
var $view = $(view);
$view.on("xxx.xxx", "xxx", xxxx);
模板使用实例：
<div id="template-orderList-view"></div>
<script id="template-orderList" type="text/template"></script>
T.Template("orderList", {orderList:[...]});


地址级联：
DOM结构
<select id="pid-delivery" class="form-control" name="province" data-mode="1"></select>
<select id="cid-delivery" class="form-control" name="city" data-mode="1"></select>
<select id="did-delivery" class="form-control" name="district" data-mode="1"></select>
<input id="pcd-delivery" name="" type="hidden" value="">
data-mode="1"：第一项为“请选择”
data-mode="0"：默认选中第一个
初始化方式：PCD.initSelect("delivery");


多选按钮全选：
$("#id").checkboxs("checkbox", "checkbox_all", function(input, value){//点击回调

});
//获取选中
var arr = $("#id").getChecked("checkbox");


关于jQuery1.8以上事件绑定请使用以下方式：
普通事件绑定：
$("#id").on("事件类型.命名空间", ["选择器",] function(e){});
安全事件绑定：
$("#id").off("事件类型.命名空间" [,"选择器"]).on("事件类型.命名空间", ["选择器",] function(e){});
如果指定了选择器，则为委托事件，后来新加进来的HTML对象也会具有该事件（无需重新绑定）
为事件添加了空间命名，不仅移除事件方便，若用js触发这个事件也很方便，如
$(".class").off("事件类型.命名空间", "选择器"); //直接移除，不会影响非本命名空间里的事件
$(".class").trigger("事件类型.命名空间"); //直接触发指定命名空间里的事件，不会影响非本命名空间里的事件
注意：当用户触发（非js触发）某一事件时，所有命名空间里（包括没有指定命名空间）的该类型事件都会执行，所以不会影响用户操作
