<?php
date_default_timezone_set('prc');//设置时区
header('Content-Type:text/html;charset=utf-8');
if(!defined('ROOT'))define('ROOT', $_SERVER['DOCUMENT_ROOT'].'/');//获取根目录
if(!defined('MODULES'))define('MODULES', ROOT.'_modules/');
if(!defined('MODULES_DESIGN'))define('MODULES_DESIGN', ROOT.'design/_modules/');
if(!defined('TEMPLATES'))define('TEMPLATES', ROOT.'_templates/');
if(!defined('TEMPLATES_DESIGN'))define('TEMPLATES_DESIGN', ROOT.'design/_templates/');
if(!defined('WEBROOT'))define('WEBROOT', 'http://'.$_SERVER["SERVER_NAME"]);
if(!defined('WEBDIRNAME'))define('WEBDIRNAME', preg_replace("/^.+\//i", "", $_SERVER["DOCUMENT_ROOT"]));//站点根目录名

//生成特定名称
function inininProducingSpecificName($name) {
    return md5($name.'20180208');
}

//页面配置
if(!defined('DOMAIN'))define('DOMAIN', str_replace('design.', '', WEBROOT.'/'));//主站域名
if(!defined('DOMAIN_ACTION'))define('DOMAIN_ACTION', 'http://alpha.action.ininin.com/');//路由域名
if(!defined('DOMAIN_DESIGN'))define('DOMAIN_DESIGN', str_replace('.design.design.', '.design.', str_replace('.ininin.com', '.design.ininin.com', DOMAIN)));//设计子站域名

/*if(!defined('DOMAIN'))define('DOMAIN', 'http://alpha.ininin.com/');//主站域名
if(!defined('DOMAIN_ACTION'))define('DOMAIN_ACTION', 'http://alpha.action.ininin.com/');//路由域名
if(!defined('DOMAIN_DESIGN'))define('DOMAIN_DESIGN', 'http://alpha.design.ininin.com/');//设计子站域名*/

if(!defined('STYLES'))define('STYLES', DOMAIN.'themes/css/');
if(!defined('STYLES_DESIGN'))define('STYLES_DESIGN', DOMAIN_DESIGN.'themes/css/');
if(!defined('IMAGES'))define('IMAGES', DOMAIN.'resources/');
if(!defined('IMAGES_DESIGN'))define('IMAGES_DESIGN', DOMAIN_DESIGN.'resources/');
if(!defined('SCRIPTS'))define('SCRIPTS', DOMAIN.'scripts/');
if(!defined('SCRIPTS_DESIGN'))define('SCRIPTS_DESIGN', DOMAIN_DESIGN.'scripts/');

//生成静态页配置
if(!defined("ACTION"))define("ACTION", "http://action.ininin.com/");
if(!defined("INCLUDES"))define("INCLUDES", ROOT."_maker/includes/");
if(!defined("DATA_SEO"))define("DATA_SEO", ROOT."_maker/data/seo.json");
if(!defined("VER"))define("VER", "37");//CSS图片版本（11/f）
if(!defined("VERSION"))define("VERSION", date('YmdHis')-20140101000000);//获取上级目录

$www = isset($_REQUEST["w"])?$_REQUEST["w"]:"www";
if($www=="www"){
    if(!defined('TARGET_DOMAIN'))define('TARGET_DOMAIN', 'http://www.ininin.com/');//主站域名
    if(!defined('TARGET_DOMAIN_ACTION'))define('TARGET_DOMAIN_ACTION', 'http://action.ininin.com/');//路由域名
    if(!defined('TARGET_DOMAIN_DESIGN'))define('TARGET_DOMAIN_DESIGN', 'http://design.ininin.com/');//设计子站域名
}else if($www=="alpha"){
    if(!defined('TARGET_DOMAIN'))define('TARGET_DOMAIN', 'http://alpha.ininin.com/');//主站域名
    if(!defined('TARGET_DOMAIN_ACTION'))define('TARGET_DOMAIN_ACTION', 'http://alpha.action.ininin.com/');//路由域名
    if(!defined('TARGET_DOMAIN_DESIGN'))define('TARGET_DOMAIN_DESIGN', 'http://alpha.design.ininin.com/');//设计子站域名
}else{
    if(!defined('TARGET_DOMAIN'))define('TARGET_DOMAIN', DOMAIN);//主站域名
    if(!defined('TARGET_DOMAIN_ACTION'))define('TARGET_DOMAIN_ACTION', DOMAIN_ACTION);//路由域名
    if(!defined('TARGET_DOMAIN_DESIGN'))define('TARGET_DOMAIN_DESIGN', DOMAIN_DESIGN);//设计子站域名
}
?>