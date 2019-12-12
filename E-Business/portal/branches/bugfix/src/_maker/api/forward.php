<?php
header("Content-type:text/html;charset=utf-8");
require_once($_SERVER['DOCUMENT_ROOT'].'/global.php');
require_once(INCLUDES.'helper.php');
$method = isset($_SERVER["REQUEST_METHOD"])?$_SERVER["REQUEST_METHOD"]:"";
$pathifo = isset($_SERVER['PATH_INFO'])?$_SERVER['PATH_INFO']:"";
$sid = isset($_REQUEST["sid"])?$_REQUEST["sid"]:"";
if(empty($sid)){
	$sid = isset($_COOKIE["sid"])?$_COOKIE["sid"]:"";
}
$action = ACTION.$pathifo."?sid=".$sid;
if(strstr($pathifo, "http://")){
	$action = $pathifo."?sid=".$sid;
}
/*if(strstr($pathifo, "in_invoice/invoice_query")){
	$action  = 'http://192.168.1.102:8080/'.$pathifo."?sid=".$sid;
}
if(strstr($pathifo, "in_invoice/invoice_create")){
	$action  = 'http://192.168.1.102:8080/'.$pathifo."?sid=".$sid;
}*/
/*
通过pathinfo的方式，所谓的pathinfo，就是形如这样的url（xxx.com/index.php/c/index/aa/cc），apache在处理这个url的时候会把index.php后面的部分输入到环境变量$_SERVER['PATH_INFO']，它等于/c/index/aa/cc。
*/
//echo $method."<br/>";
//echo $pathifo."<br/>";
//print_r($http_params)."<br/>";
if(empty($method)||empty($pathifo)){
    $jsoncallback = isset($_GET["jsoncallback"])?$_GET["jsoncallback"]:"";
    die($jsoncallback.'({"result":0,"msg":"","data":{"msg":"缺少必要参数","result":0} })');
}else{
    if($method=="POST"){
        echo str_replace('document.domain = "ininin.com";',"",http_post($action, http_build_query(http_params(), '', '&')));
    }else{
        echo http_get($action."&".http_build_query(http_params(), '', '&'));
    }
}
?>