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
        .iframe .ul { width: 200px; background:#fafafa; border-right:1px solid #e1e1e1; float: left;}
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
        <!--li><a class="btn" href="/index_tpl.html?w=<?php echo WWW ?>&v=<?php echo $ver ?>" target="forwin">一键发布所有页面</a></li-->
        <li><a class="btn" href="/portal/index_tpl.html?w=<?php echo WWW ?>&v=<?php echo $ver ?>" target="forwin">网站首页</a></li>
        <li><a class="btn" href="/portal/all_tpl.html?w=<?php echo WWW ?>&v=<?php echo $ver ?>" target="forwin">全部分类页</a></li>
        <li><a class="btn" href="/portal/plist_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">印刷产品=>列表页</a></li>
        <li><a class="btn" href="/portal/pdetail_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">印刷普通产品=>详情页</a></li>
        <li><a class="btn" href="custom.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">印刷定制产品=>详情页</a></li>
        <li><a class="btn" href="/package/index_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">优惠套餐</a></li>
        <li><a class="btn" href="/design/index_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">设计服务=>首页</a></li>
        <li><a class="btn" href="/design/list_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">设计服务=>列表页</a></li>
        <li><a class="btn" href="/design/detail_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">设计服务=>详情页</a></li>
        <li><a class="btn" href="/activity/index_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">活动列表页</a></li>
        <li><a class="btn" href="/portal/100000_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">画册</a></li>
        <!--li><a class="btn" href="/portal/200000_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">按需定制产品</a></li>
        <li><a class="btn" href="/portal/200001_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">白钢字</a></li>
        <li><a class="btn" href="/portal/200002_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">电镀字</a></li>
        <li><a class="btn" href="/portal/200003_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">烤漆字</a></li>
        <li><a class="btn" href="/portal/200004_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">5mm标牌</a></li>
        <li><a class="btn" href="/portal/200005_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">8mm标牌</a></li>
        <li><a class="btn" href="/portal/200006_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">喷绘条幅</a></li>
        <li><a class="btn" href="/portal/200007_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">丝印条幅</a></li>
        <li><a class="btn" href="/portal/200030_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">“新”展架</a></li>
        <li><a class="btn" href="/portal/200031_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">“新”展架Pro</a></li>
        <li><a class="btn" href="/portal/200032_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">“新”单页</a></li>
        <li><a class="btn" href="/portal/200033_tpl.html?w=<?php echo WWW; ?>&v=<?php echo $ver ?>" target="forwin">“新”单页Pro</a></li-->
    </ul>
    <dd class="div"><iframe id="target_iframe" name="forwin" src="" frameborder="0" scrolling="auto"></iframe></dd>
</div>
</body>
</html>