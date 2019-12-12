<?php
	header("Access-Control-Allow-Origin:*");
	header("Content-type:application/json;charset=utf-8");
	require_once($_SERVER['DOCUMENT_ROOT'].'/global.php');
	require_once(INCLUDES.'helper.php');
	$result = Array("result"=>0, "msg"=>"");
	//$jsonStr = file_get_contents("../data/seo.json");
	$result["data"] = jsonDecode(HReadFile(DATA_SEO));
	echo jsonEncode($result);//$jsonStr;
?>