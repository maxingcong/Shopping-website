ҵ��jsͳһ��ҳ����ײ����룬���������js��˳�����£�
<script type="text/javascript" src="./scripts/libs/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="./scripts/libs/bootstrap.min.js"></script>
<script type="text/javascript" src="./scripts/libs/bootstrap-datetimepicker.js"></script>
<script type="text/javascript" src="./scripts/libs/utils.js"></script>
<script type="text/javascript" src="./scripts/common.js"></script>
ע�⣺
1��bootstrap-datetimepicker.js������ã����Բ����룬��������js�������룬��˳���ܱ�
2��ͷ����css��js�ڿ���ʱ��ֱ�Ӹ������ã����Ķ�·���⣬�벻Ҫ�������Ķ�
3����Ҫ��������������j����jQuery�Ĳ�������÷���utils.js֮ǰ
4��ҵ���߼�js����common.js֮��


MD5���ܣ�
Utils.md5('xxx');

base64���ܣ�
Utils.base64.encode('xxx');

base64���ܣ�
Utils.base64.decode('eHh4');


ģ���������template.js���ϵ���utils.js������������룬�����������ռ�Utils
�Զ�����ã�Utils.template.xxx

common.js�ṩ��template.js�Ŀ�ݵ���
T.Template("ģ����", "����"); //ģ������������template-��ǰ׺
ע�⣺
1������ģ�������id�����ԡ�template-����ͷ
2��չʾģ��������������id�����ԡ�template-����ͷ���ԡ�-view����β
3��T.Template("ģ����", "����");���ú󷵻ص���DOM������Ҫʹ��jQuery�����Ƚ���ת��ΪjQuery�����磺
var view = T.Template("ģ����", "����");
var $view = $(view);
$view.on("xxx.xxx", "xxx", xxxx);
ģ��ʹ��ʵ����
<div id="template-orderList-view"></div>
<script id="template-orderList" type="text/template"></script>
T.Template("orderList", {orderList:[...]});


��ַ������
DOM�ṹ
<select id="pid-delivery" class="form-control" name="province" data-mode="1"></select>
<select id="cid-delivery" class="form-control" name="city" data-mode="1"></select>
<select id="did-delivery" class="form-control" name="district" data-mode="1"></select>
<input id="pcd-delivery" name="" type="hidden" value="">
data-mode="1"����һ��Ϊ����ѡ��
data-mode="0"��Ĭ��ѡ�е�һ��
��ʼ����ʽ��PCD.initSelect("delivery");


��ѡ��ťȫѡ��
$("#id").checkboxs("checkbox", "checkbox_all", function(input, value){//����ص�

});
//��ȡѡ��
var arr = $("#id").getChecked("checkbox");


����jQuery1.8�����¼�����ʹ�����·�ʽ��
��ͨ�¼��󶨣�
$("#id").on("�¼�����.�����ռ�", ["ѡ����",] function(e){});
��ȫ�¼��󶨣�
$("#id").off("�¼�����.�����ռ�" [,"ѡ����"]).on("�¼�����.�����ռ�", ["ѡ����",] function(e){});
���ָ����ѡ��������Ϊί���¼��������¼ӽ�����HTML����Ҳ����и��¼����������°󶨣�
Ϊ�¼�����˿ռ������������Ƴ��¼����㣬����js��������¼�Ҳ�ܷ��㣬��
$(".class").off("�¼�����.�����ռ�", "ѡ����"); //ֱ���Ƴ�������Ӱ��Ǳ������ռ�����¼�
$(".class").trigger("�¼�����.�����ռ�"); //ֱ�Ӵ���ָ�������ռ�����¼�������Ӱ��Ǳ������ռ�����¼�
ע�⣺���û���������js������ĳһ�¼�ʱ�����������ռ������û��ָ�������ռ䣩�ĸ������¼�����ִ�У����Բ���Ӱ���û�����
