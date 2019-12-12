<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>生成项目</title>
<link  rel="shortcut icon" type="image/x-icon" href="/favicon.ico"  />
</head>

<body>
<?php
set_time_limit(0);//设置为0，执行永不过期
date_default_timezone_set('PRC');//设置时区
require_once($_SERVER['DOCUMENT_ROOT'].'/global.php');
require_once(INCLUDES.'helper.php');
echo "服务器名：".WEBROOT."<br/>";
echo "根目录名：".WEBDIRNAME."<br/>";
echo "目录路径：".ROOT."<br/>";
if(!defined("DEV_ROOT"))define("DEV_ROOT", preg_replace("/\/$/","",ROOT));
if(!defined("WEB_ROOT"))define("WEB_ROOT", preg_replace("/\/".WEBDIRNAME."\/$/","",ROOT));
//生成文件的存储目录
if(!defined("FOLDER"))define("FOLDER", isset($_REQUEST["f"])?$_REQUEST["f"]:date('YmdHis'));
//目标域名（如果目标域名存在则将当前域名替换为目标域名）
if(!defined("TARGET"))define("TARGET", isset($_REQUEST["o"])?$_REQUEST["o"]:"");
echo '目标域名：'.TARGET."<br/>";
function GetConfig(){
	return array(
		"dirname"=>"/web/".FOLDER,
		"version"=>VERSION,
		"webroot"=>"/",
		"title"=>"云印官网—让印刷更省心，让设计更简单！",
		"content"=>"中国最大的互联网印刷和设计服务平台",
		"keywords"=>"云印,ininin.com,云印技术,云印官网,深圳印刷,云印公司,印刷,设计,名片,会员卡,宣传用品,喷绘用品",
		"description"=>"云印官网—中国最大的互联网印刷和设计服务平台。为您提供最优质的名片、会员卡、宣传单、折页、易拉宝、X展架、封套、画册、宣传册、手提袋等产品印刷和设计服务！云印技术(深圳)有限公司",
		"author"=>"ininin.com",
		"copyright"=>"Copyright © 2015 ininin.com. All rights reserved.",
		"owner"=>"Designed & Powered by ininin.com"
	);
}
function GetTypeof($file){
	$res = pathinfo($file);
	return isset($res["extension"])?strtolower($res["extension"]):"";
}
function ForeachFiles($dir=""){
    if(empty($dir)){
        $dir = "../".WEBDIRNAME;
    }
	$dir = str_replace("\\","/",$dir);
	$cur_dir = opendir($dir);//opendir()返回一个目录句柄,失败返回false
	while(($file = readdir($cur_dir))!==false){//readdir()返回打开目录句柄中的一个条目
		$sub_dir = $dir."/".$file;//构建子目录路径
		if($file=="."||$file==".."){
			continue;
		}else if(is_dir($sub_dir)&&!preg_match("/(_bak|temp|tpl)$/", $sub_dir)){//如果是目录,进行递归
			//echo "Directory ".$file.":<br/>";
			ForeachFiles($sub_dir);
		//}else if(preg_match("/_tpl\./", $file)){//电商静态页模板生成
		}else if(!preg_match("/(_tpl|_bak)\./", $file)){//生成发布页面
			//echo "File in Directory ".$dir.": ".$file."<br/>";
			switch(GetTypeof($sub_dir)){
				case "html": echo CompileHTML($dir, $file)."<br/>";break;
				case "css": echo CompileCSS($dir, $file)."<br/>";break;
				case "js": echo CompileJS($dir, $file)."<br/>";break;
				case "png": echo CompilePNG($dir, $file)."<br/>";break;
				case "gif": echo CompileGIF($dir, $file)."<br/>";break;
				case "ico": echo CompileGIF($dir, $file)."<br/>";break;
				case "jpg": echo CompileJPG($dir, $file)."<br/>";break;
				case "swf": echo CompileSWF($dir, $file)."<br/>";break;
				default: "";break;
			}
		}
	}
}

function CompileHTML($path, $file){
	//$content = HReadFile($path."/".$file);
	$content = file_get_contents(WEBROOT.str_replace(DEV_ROOT,"",$path."/".$file));//."?o=".TARGET
	$msg = "文件 ".$file." 不存在".$content;
	$config = GetConfig();
	if(!empty($content)&&!empty($config)){
		if(TARGET!=""){
			$content = str_replace(WEBROOT,TARGET,$content);
		}
		if(!preg_match("/_tpl\./", $file)){
			foreach($config as $key=>$value){
				$value = str_replace('"','&quot;',$value);
				$content = str_replace("\${".$key."}",$value,$content);
			}
		}
		$version = $config["version"];
		
		//为js/css添加版本号
		$content = preg_replace('/(href="[\S]+?\.css)"/i',"\${1}?v=".$version.'"',$content);
		$content = preg_replace('/(src="[\S]+?\.js)"/i',"\${1}?v=".$version.'"',$content);


        if(FOLDER=='http://alpha.ininin.com/'){
            $content = str_replace('<meta name="robots" content="all"','<meta name="robots" content="nofollow"',$content);
        }
		
        if(!preg_match("/_tpl\./", $file)){
            $content = str_replace('<script type="script_cnzz"></script>', '<script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id=\'cnzz_stat_icon_1253317095\'%3E%3C/span%3E%3Cscript src=\'" + cnzz_protocol + "s4.cnzz.com/z_stat.php%3Fid%3D1253317095%26show%3Dpic\' type=\'text/javascript\'%3E%3C/script%3E")); var _czc = _czc || []; _czc.push(["_setAccount", "1253317095"]);</script>', $content);
		}else{
            $content = str_replace('?ininin=ininin','?v='.$version,$content);
		}
		$content = preg_replace('/<!--[^[]+?-->/i', '', $content);
		
		$msg = HWriteFile($content,str_replace(DEV_ROOT,WEB_ROOT.$config["dirname"],$path),$file);
	}
	return $msg;
}
function CompileCSS($path, $file){
	$config = GetConfig();
	$content = file_get_contents(WEBROOT.str_replace(DEV_ROOT,"",$path."/".$file)."?o=".TARGET);
	$msg = "文件 ".$file." 不存在".$content;
	if(!empty($content)){
	    $content = str_replace('v=1', 'v='.VER, $content);
		$msg = HWriteFile($content,str_replace(DEV_ROOT,WEB_ROOT.$config["dirname"]."/",$path),$file);
	}
	return $msg;
}
function CompileJS($path, $file){
	$config = GetConfig();
	$newpath = str_replace(DEV_ROOT,WEB_ROOT.$config["dirname"]."/",$path);
	//$newpath = str_replace("/default","/".$config["version"]."/",$newpath);
	mkdirs($newpath);//如果目录不存在，则创建目录
	$filename = $path."/".$file;
	$msg = "";
	if(!preg_match("/_bak\.js|_json\.js$/", $file)){
		$content = file_get_contents(WEBROOT.str_replace(DEV_ROOT,"",$filename));
		$content = str_replace('"/";//HOST_NAME_PATH','"'.DOMAIN.'";',$content);
		$msg = HWriteFile($content,$newpath,$file);
		/*$msg = "复制文件 ".$filename." 成功！";
		if(!copy($filename, $newpath."/".$file)) {
			$msg = "复制文件 ".$filename." 失败！";
		}*/
	}
	return $msg;
}
function CompilePNG($path, $file){
	$config = GetConfig();
	$newpath = str_replace(DEV_ROOT,WEB_ROOT.$config["dirname"]."/",$path);
	//$newpath = str_replace("/default/","/".$config["version"]."/",$newpath);
	mkdirs($newpath);//如果目录不存在，则创建目录
	$filename = $path."/".$file;
	$msg = "";
	if(!preg_match("/_bak\.png$/", $file)){
		$msg = "复制文件 ".$filename." 成功！";
		if(!copy($filename, $newpath."/".$file)) {
			$msg = "复制文件 ".$filename." 失败！";
		}
	}
	return $msg;
}
function CompileGIF($path, $file){
	$config = GetConfig();
	$newpath = str_replace(DEV_ROOT,WEB_ROOT.$config["dirname"]."/",$path);
	//$newpath = str_replace("/default/","/".$config["version"]."/",$newpath);
	mkdirs($newpath);//如果目录不存在，则创建目录
	$filename = $path."/".$file;
	$msg = "";
	if(!preg_match("/_bak\.gif$/", $file)){
		$msg = "复制文件 ".$filename." 成功！";
		if(!copy($filename, $newpath."/".$file)) {
			$msg = "复制文件 ".$filename." 失败！";
		}
	}
	return $msg;
}
function CompileJPG($path, $file){
	$config = GetConfig();
	$newpath = str_replace(DEV_ROOT,WEB_ROOT.$config["dirname"]."/",$path);
	//$newpath = str_replace("/default/","/".$config["version"]."/",$newpath);
	mkdirs($newpath);//如果目录不存在，则创建目录
	$filename = $path."/".$file;
	$msg = "";
	if(!preg_match("/_bak\.jpg$/", $file)){
		$msg = "复制文件 ".$filename." 成功！";
		if(!copy($filename, $newpath."/".$file)) {
			$msg = "复制文件 ".$filename." 失败！";
		}
	}
	return $msg;
}
function CompileSWF($path, $file){
	$config = GetConfig();
	$newpath = str_replace(DEV_ROOT,WEB_ROOT.$config["dirname"]."/",$path);
	//$newpath = str_replace("/default/","/".$config["version"]."/",$newpath);
	mkdirs($newpath);//如果目录不存在，则创建目录
	$filename = $path."/".$file;
	$msg = "";
	if(!preg_match("/_bak\.swf$/", $file)){
		$msg = "复制文件 ".$filename." 成功！";
		if(!copy($filename, $newpath."/".$file)) {
			$msg = "复制文件 ".$filename." 失败！";
		}
	}
	return $msg;
}
ForeachFiles(DEV_ROOT);
?>
</body>
</html>