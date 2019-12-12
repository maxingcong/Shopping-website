<?php
	header("Content-type:application/json;charset=utf-8");
	require_once($_SERVER['DOCUMENT_ROOT'].'/global.php');
	require_once(INCLUDES.'helper.php');
	$http_params = http_params();
	$result = HWriteFile($http_params["data"], ROOT."/data", "seo.json");
	echo jsonEncode($result);
?>