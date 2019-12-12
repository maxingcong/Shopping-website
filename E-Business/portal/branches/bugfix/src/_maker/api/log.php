<?php
header("Content-type:text/html;charset=utf-8");
require_once($_SERVER['DOCUMENT_ROOT'].'/global.php');
require_once(INCLUDES.'helper.php');
$action = isset($_GET["action"])?$_GET["action"]:"";
$jsoncallback = isset($_GET["jsoncallback"])?$_GET["jsoncallback"]:"";
$msg = "写日志失败";
if(!empty($action)){
	writeLog($action);
	$msg = "写日志成功";
}
die($jsoncallback.'({"result":0,"msg":"","data":{"msg":"'.$msg.'","result":0} })');
?>