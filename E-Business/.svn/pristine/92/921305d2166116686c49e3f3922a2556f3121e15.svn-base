<?php
date_default_timezone_set('prc');//设置时区
header('Content-Type:text/html;charset=utf-8');
if(!defined('ROOT'))define('ROOT', $_SERVER['DOCUMENT_ROOT'].'/');//获取根目录
if(!defined('MODULES'))define('MODULES', ROOT.'_modules/');
if(!defined('TEMPLATES'))define('TEMPLATES', ROOT.'templates/');
if(!defined('WEBROOT'))define('WEBROOT', 'http://'.$_SERVER["SERVER_NAME"]);
if(!defined('WEBDIRNAME'))define('WEBDIRNAME', preg_replace("/^.+\//i", "", $_SERVER["DOCUMENT_ROOT"]));//站点根目录名

//页面配置
if(!defined('DOMAIN'))define('DOMAIN', '/');
if(!defined('STYLES'))define('STYLES', DOMAIN.'themes/css/');
if(!defined('IMAGES'))define('IMAGES', DOMAIN.'resources/');
if(!defined('SCRIPTS'))define('SCRIPTS', DOMAIN.'scripts/');

//生成静态页配置
if(!defined("ACTION"))define("ACTION", "http://action.ininin.com/");
if(!defined("INCLUDES"))define("INCLUDES", ROOT."_maker/includes/");
if(!defined("DATA_SEO"))define("DATA_SEO", ROOT."_maker/data/seo.json");
if(!defined("VER"))define("VER", "25");//CSS图片版本（11/f）
if(!defined("VERSION"))define("VERSION", date('YmdHis')-20140101000000);//获取上级目录
?>