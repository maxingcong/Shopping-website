<?php
date_default_timezone_set('prc');//设置时区
//得到参数
function http_params(){
	$http_params = array();
	foreach($_REQUEST as $key=>$value){
		if(preg_match("/^[a-z_]+$/",$key)>0){
			//echo $key."=>".urlencode($value);
			$http_params[$key] = $value;
		}else{
			//echo $key."=>".urlencode($value);
		}
	}
	return $http_params;
}
//发送GET请求
function http_get($url){
	$ch=curl_init();
	curl_setopt($ch,CURLOPT_URL,$url);
	curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);
	curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,false);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
	return curl_exec($ch);
}
//发送POST请求
function http_post($url,$params){ // 模拟提交数据函数
    $curl = curl_init(); // 启动一个CURL会话
    curl_setopt($curl, CURLOPT_URL, $url); // 要访问的地址
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE); // 对认证证书来源的检查
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE); // 从证书中检查SSL加密算法是否存在
    curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36'); // 模拟用户使用的浏览器
    // curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1); // 使用自动跳转
    // curl_setopt($curl, CURLOPT_AUTOREFERER, 1); // 自动设置Referer
    curl_setopt($curl, CURLOPT_POST, 1); // 发送一个常规的Post请求
    curl_setopt($curl, CURLOPT_POSTFIELDS, $params); // Post提交的数据包
    curl_setopt($curl, CURLOPT_TIMEOUT, 30); // 设置超时限制防止死循环
    curl_setopt($curl, CURLOPT_HEADER, 0); // 显示返回的Header区域内容
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1); // 获取的信息以文件流的形式返回
    $tmpInfo = curl_exec($curl); // 执行操作
    if (curl_errno($curl)) {
       echo 'Errno'.curl_error($curl);//捕抓异常
    }
    curl_close($curl); // 关闭CURL会话
    return $tmpInfo; // 返回数据
}
//格式化PHP对象为字符串
function jsonURLDecode($jsonArray,$data=NULL){
	foreach($jsonArray as $key=>$value){
		if(is_array($value)){
			$data[$key] = jsonURLDecode($value);
		}else{
			$data[$key] = $value;
		}
	}
	return $data;
}
//格式化json字符串为PHP对象
function jsonDecode($josnStr){
    if(ini_get("magic_quotes_gpc")=="1"){
		$josnStr = stripslashes($josnStr);
	};
	//$jsonArray = json_decode(preg_replace('/\\\/i',"",urldecode($josnStr)),true);
	$jsonArray = json_decode(urldecode($josnStr),true);
	return is_array($jsonArray)?jsonURLDecode($jsonArray):$jsonArray;
}
function jsonURLEncode($jsonArray){
	foreach($jsonArray as $key=>$value){
		if(is_array($value)){
			$jsonArray[$key] = jsonURLEncode($value);
		}else{
			$jsonArray[$key] = urlencode($value);
		}
	}
	return $jsonArray;
}
//格式化PHP对象为json字符串
function jsonEncode($jsonArray){
	return urldecode(json_encode(jsonURLEncode($jsonArray)));
}
//创建目录（可多级）
function mkdirs($dir,$mode=0777){
	if (is_dir($dir)){//判断目录存在否，存在不创建
		return true;
	}else{ //不存在创建
		if(mkdir($dir,$mode,true)){//第三个参数为true即可以创建多极目录
			return true;
		}else{
			return false;
		}
	}
}
//读取文件内容
function HReadFile($file){
	$content = "";
	if(file_exists($file)){//读取文件
		$content = file_get_contents($file);
	}
	return $content;
}
//写文件
function HWriteFile($content,$path,$file){
	$filename = $path."/".$file;
	$msg = "内容为空，未生成 ".$filename." 文件";
	if(!empty($content)){
		mkdirs($path);//如果目录不存在，则创建目录
		$handle = fopen($filename,"w");//打开文件指针，创建文件
		if(is_writable($filename)){//检查文件是否被创建且可写
			if(fwrite($handle,$content)){  //将信息写入文件
				fclose($handle); //关闭指针
				$msg = "生成文件 ".$filename." 成功！";
			}else{
				$msg = "生成文件 ".$filename." 失败！";
			}
		}else{
			$msg = "文件 ".$filename." 不可写，请检查其属性后重试！";
		}
	}
	return $msg;
}
//获取IP
function getIP(){
	$ip = "";
	if (getenv("HTTP_CLIENT_IP"))
	$ip = getenv("HTTP_CLIENT_IP");
	else if(getenv("HTTP_X_FORWARDED_FOR"))
	$ip = getenv("HTTP_X_FORWARDED_FOR");
	else if(getenv("REMOTE_ADDR"))
	$ip = getenv("REMOTE_ADDR");
	else $ip = "127.0.0.1";
	return $ip;
}
//写日志
function writeLog($action){
	$xml = simplexml_load_file('log.xml');
	$log = $xml->addChild('log');
	$log->addChild('ip', getIP());
	$log->addChild('date', date('Y-m-d H:i:s',time()));
	$log->addChild('action', $action);
	$xml->asXML();
	$xml->saveXML('log.xml');
}
?>