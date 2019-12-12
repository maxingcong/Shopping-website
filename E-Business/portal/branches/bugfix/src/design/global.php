<?php
if(!defined("DESIGN"))define("DESIGN", $_SERVER['DOCUMENT_ROOT'].'/');
if(!defined("ROOT"))define("ROOT", preg_replace("/\/design$/", "" , $_SERVER['DOCUMENT_ROOT']).'/');
require_once(ROOT.'global.php');
?>