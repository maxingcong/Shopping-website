<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>生成静态页</title>
    <link  rel="shortcut icon" type="image/x-icon" href="/favicon.ico"  />
    <link rel="stylesheet" type="text/css" href="/themes/css/base.css" />
    <style type="text/css">
        html, body { width: 100%; height: 100%; background:#fff;}
        .iframe, .iframe .ul, .iframe .div, .iframe iframe { height: 100%}
        .iframe .ul { width: 240px; background:#fafafa; border-right:1px solid #e1e1e1; float: left;}
        .iframe .div { overflow: hidden;}
        .iframe iframe { width: 100%;}
        .iframe li { padding:15px 15px 0;}
        .iframe li .btn { width:auto; display:block;}
    </style>
</head>
<body>
<?php
if(!defined("WWW"))define("WWW", isset($_REQUEST["o"])?$_REQUEST["o"]:"www");
$ver = time();
?>
<div class="iframe">
    <ul class="ul">
        <!--li><a class="btn" href="/index_tpl.html?w=<?php echo WWW ?>&v=<?php echo $ver ?>" target="_blank">一键发布所有页面</a></li-->
        <!--li><a class="btn" href="/portal/index_tpl.html?w=<?php echo WWW ?>&v=<?php echo $ver ?>" target="_blank">网站首页</a></li-->
        <!--li><a class="btn" href="/portal/plist_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">印刷产品=>列表页</a></li-->
        <!--li><a class="btn" href="/activity/index_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">活动列表页</a></li-->
        <!--li><a class="btn" href="/portal/pdetail_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">印刷普通产品=>详情页</a></li-->
        <!--li><a class="btn" href="/portal/plist_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">印刷产品=>列表页</a></li-->


        <li><a class="btn" href="/portal/index_new_tpl.html?w=<?php echo WWW ?>&v=<?php echo $ver ?>" target="_blank">网站首页</a></li>
        <li><a class="btn" href="/portal/all_tpl.html?w=<?php echo WWW ?>&v=<?php echo $ver ?>" target="_blank">全部商品分类</a></li>
        <li><a class="btn" href="/portal/index_tpl.html?w=<?php echo WWW ?>&v=<?php echo $ver ?>" target="_blank">印刷产品首页</a></li>
        <li><a class="btn" href="/inkjet/index_tpl.html?w=<?php echo WWW ?>&v=<?php echo $ver ?>" target="_blank">喷绘专区首页</a></li>
        <li><a class="btn" href="/digital/index_tpl.html?w=<?php echo WWW ?>&v=<?php echo $ver ?>" target="_blank">数码专区首页</a></li>
        <li><a class="btn" href="/fliggy/index_tpl.html?w=<?php echo WWW ?>&v=<?php echo $ver ?>" target="_blank">飞猪专区首页</a></li>
        <li><a class="btn" href="/portal/pdetail_new_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">名片类产品=>详情页</a></li>
        <li><a class="btn" href="/portal/pdetail_new_tpl.html?id=200071&w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">工牌套装</a></li>
        <li><a class="btn" href="/package/index_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">账户充值</a></li>
    </ul>
    <ul class="ul">
        <li><a class="btn" href="/portal/product_com_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">普通产品=>详情页</a></li>
        <li><a class="btn" href="/portal/product_install_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">安装类产品=>详情页</a></li>
        <li><a class="btn" href="/portal/product_stationery_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">文具类产品=>详情页</a></li>
        <li><a class="btn" href="custom.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">印刷定制产品=>详情页</a></li>
        <li><a class="btn" href="/portal/product_qty_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">自定义数量产品=>详情页</a></li>
        <li><a class="btn" href="/portal/product_sqm_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">自定义尺寸产品=>详情页</a></li>
        <li><a class="btn" href="/portal/product_100_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">折页/单页自动化报价=>详情页</a></li>
        <li><a class="btn" href="/portal/product_201_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">画册自动化报价=>详情页</a></li>
        <li><a class="btn" href="/portal/product_200450_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">手提袋自动化报价=>详情页</a></li>
        <li><a class="btn" href="/portal/product_word_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">迷你字/灯箱字=>详情页</a></li>
    </ul>
    <ul class="ul">
        <li><a class="btn" href="/design/index_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">设计服务=>首页</a></li>
        <li><a class="btn" href="/design/case/index_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">设计案例=>列表页</a></li>
        <li><a class="btn" href="/design/category/detail_com_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">设计服务=>分类页</a></li>
        <!--li><a class="btn" href="/design/category/detail_131_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">设计服务=>印刷套餐</a></li-->
        <li><a class="btn" href="/design/category/detail_130_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">设计服务=>定制设计产品</a></li>
        <li><a class="btn" href="/design/designer/index_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">设计服务=>设计师主页</a></li>
        <li><a class="btn" href="/design/designer/designer_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">设计服务=>设计师个人主页</a></li>
        <li><a class="btn" href="/design/article/index_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="_blank">设计服务=>设计说首页</a></li>
    </ul>
    <dd class="div"><iframe id="target_iframe" name="_blank" src="" frameborder="0" scrolling="auto"></iframe></dd>
</div>
</body>
</html>