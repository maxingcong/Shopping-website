<?php
date_default_timezone_set('PRC');//设置时区
header("Content-type:application/json;charset=utf-8");
require_once($_SERVER['DOCUMENT_ROOT'].'/global.php');
require_once(INCLUDES.'helper.php');
function WriteFile($domain,$content,$path,$file){
    if(!empty($domain)){
		$content = str_replace(WEBROOT, $domain, $content);
	}
	if($domain=='http://alpha.ininin.com/'){
        $content = str_replace('<meta name="robots" content="all"','<meta name="robots" content="nofollow"',$content);
    }
	$content = str_replace('\"','"',$content);
	$content = str_replace("\'","'",$content);

	$version = VERSION;
	//为js/css添加版本号
    $content = preg_replace('/(href="[\S]+?\.css)"/i',"\${1}?v=".$version.'"',$content);
    $content = preg_replace('/(src="[\S]+?\.js)"/i',"\${1}?v=".$version.'"',$content);
	$content = str_replace('ininin=ininin',"v=".$version,$content);

    $msg = HWriteFile($content,ROOT.$path,$file.'.html');
	$msg = str_replace(ROOT.$path."/","",$msg);
	$result = jsonDecode('{"result":0, "msg":"'.$msg.'"}');
	echo jsonEncode($result);
}
//目标域名（如果目标域名存在则将当前域名替换为目标域名）
$domain = isset($_REQUEST["domain"])?$_REQUEST["domain"]:WEBROOT;
//生成文件的存储目录
$path = isset($_REQUEST["path"])?$_REQUEST["path"]:$domain;
//生成文件的文件名
$file = isset($_REQUEST["file"])?$_REQUEST["file"]:"";
//生成文件的内容
$content = isset($_REQUEST["content"])?$_REQUEST["content"]:"";
if(empty($domain)||empty($path)||empty($file)||empty($content)){
	$result = jsonDecode('{"result":0, "msg":"缺少必要参数"}');
    die(jsonEncode($result));
}else{
    WriteFile($domain,$content,$path,$file);
}
?>