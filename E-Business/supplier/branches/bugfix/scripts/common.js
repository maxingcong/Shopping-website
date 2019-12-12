!(function(window, document, undefined) {
    "use strict";
    //日期中文
    $.fn.datetimepicker&&$.fn.datetimepicker.dates&&($.fn.datetimepicker.dates["zh-CN"] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今天",
        suffix: [],
        meridiem: ["上午", "下午"]
    });
    var $window = $(window);
    var $body = $(document.body);
    var $bsHeader = $("#bs-header"); //头部
    var $bsSidebar = $("#bs-sidebar"); //左侧栏菜单
    var $bsWrapper = $("#bs-wrapper"); //内容容器
    var $bsFooter = $("#bs-footer"); //底部
    var $bsContent = $("#bs-content"); //内容区
    var HOST_NAME_PATH = "/";//HOST_NAME_PATH
    //可load的目录
    var loadPathList = [
            HOST_NAME_PATH+"cash",
            HOST_NAME_PATH+"delivery",
            HOST_NAME_PATH+"home",
            HOST_NAME_PATH+"info",
            HOST_NAME_PATH+"invoice",
            HOST_NAME_PATH+"msg",
            HOST_NAME_PATH+"order",
            HOST_NAME_PATH+"product",
            HOST_NAME_PATH+"total",
            HOST_NAME_PATH+"autoquote",
            HOST_NAME_PATH+"distribution"];
    //设置URL
    function setPageUrl(targetUrl, e){
        var e = e||event,
            type = $(e.target || e.srcElement).attr("target")||"";
        if(type!=="_blank"&&targetUrl&&!/^http|#/.test(targetUrl)&&targetUrl.length>3){
            targetUrl = targetUrl.replace(/\.+\//, "/");
            if(targetUrl.indexOf(T.BASE_HOST_NAME)==0){
                targetUrl = targetUrl.replace(T.BASE_HOST_NAME, "");
            }
            var canVisit = getCanVisit(targetUrl);
            if(canVisit){
                e.preventDefault();
                location.hash = targetUrl;
            }
        }
    }
    //获取是否支持load访问
    function getCanVisit(targetUrl){
        var canVisit = false;
        T.Each(loadPathList, function(i, path){
            if(targetUrl.indexOf(path)==0){
                canVisit = true;
            }
        });
        return canVisit;
    }
    //获取load的URL
    function getLoadTargetURL(targetUrl){
        targetUrl = targetUrl||location.hash;
        targetUrl = String(targetUrl).replace(T.BASE_HOST_NAME, "");
        if(/^#\/.*/.test(targetUrl)){
            targetUrl = targetUrl.replace(/^#/, "");
            if(getCanVisit(targetUrl)){
                return targetUrl;
            }
        }
        return "";
    }
    //加载页面
    function loadPageContent(targetUrl){
        targetUrl = getLoadTargetURL()||getLoadTargetURL("#"+String(targetUrl||"").replace(/\.+\//, "/"));
        if(targetUrl){
            var $link = $("a[href$='"+targetUrl+"']:eq(0)");
            var tit = $link.text()||$link.attr("title")||"";
            console.log("loadPageContent==>", targetUrl);
            document.title =  tit+"-供应商平台";
            T.REQUESTS = T.DecodeHashString(targetUrl.replace(/^.+\?/, ""));
            $bsContent.load(targetUrl, {}, function(response,status,xhr){
                setQuickNavBarFixedTop();
                PCD.initSelect("address");//设置地址级联
                var $target = $("a[href$='"+targetUrl+"']", $bsSidebar);
                if($target&&$target.length){
                    var $parent = $target.closest("ul", $bsSidebar).closest("li", $bsSidebar);
                    if(!$parent.hasClass("open")){
                        $(">a", $parent).click();
                    }
                    setTimeout(function(){
                        $target.click();
                    }, 10);
                }
            });
        }
    }
    //设置导航树折叠或展开
    function setNavTreeCollapseOrExpand($this, e, $cont){
        if(!$this||!$this.length)return;
        var $li = $this.closest("li", $cont);
        var $ul = $this.siblings("ul");
        var ulHeight = 0;
        $ul.each(function(i, el){
            ulHeight += $(el).outerHeight();
        });
        if($ul.length){
            if($li.hasClass("open")){
                $li.removeClass("open");
                $li.stop(true, true).stop(true, true).animate({
                    height: $li.outerHeight() - ulHeight
                }, 300);
            }else{
                $li.addClass("open");
                $li.stop(true, true).animate({
                    height: $li.outerHeight() + ulHeight
                }, 300, function(){
                    $li.height("auto");
                });
            }
        }
        if($cont&&$cont.length)$("a.active", $cont).removeClass("active");
        if($this.is("a"))$this.addClass("active");
        setPageUrl($this.attr("href")||"", e);
    }
    //设置导航树复选框
    function setNavTreeCheckbox($this, e, dom){
        var checked = $this.is(":checked");
        var $li = $this.closest("li"); //当前节点容器
        console.log(dom, $li, checked);
        //选中/取消选中子级
        $("ul>li", $li).each(function(i, el){
            var $el = $(el);
            if($el.is("li")){
                $(">a input[type='checkbox']", $el).prop("checked", checked);
            }
        });
        //查找父级
        var $parents = $this.parentsUntil(dom);
        if(checked){ //选中父级
            $parents.each(function(i, el){
                var $el = $(el);
                if($el.is("li")){
                    $(">a input[type='checkbox']", $el).prop("checked", checked);
                }
            });
        }else{ //如果没有子节点被选中，则取消父节点的选中状态
            var parentCheckedState = function($node){
                var $cont = $node.parent().closest("li", dom); //当前节点容器
                var $checkboxs = $("input[type='checkbox']:checked", $cont);
                if($checkboxs.length<=1){
                    $(">a input[type='checkbox']", $cont).prop("checked", checked);
                    parentCheckedState($cont);
                }
            };
            parentCheckedState($li);
        }
    }
    function setQuickNavBarFixedTop(){
        function getTop(){
            var y = $bsHeader.outerHeight(true);
            if($window.width()<=768){
                y += $bsSidebar.outerHeight(true)
            }
            return y;
        }
        //顶部锚点定位快速导航条吸附
        $(".quick-nav").length && $(".quick-nav > .nav").affix({
            offset: {
                target: $bsWrapper,
                top: function () {
                    this.top = getTop();
                }
            }
        }) && $body.scrollspy({
            target: ".quick-nav"
        }) && $window.on("load", function(){
            $body.scrollspy("refresh");
        });
    }
    //左侧栏菜单点选
    $bsSidebar.on("click.bs-sidebar", ".nav a", function(e){
        e.preventDefault();
        var $this = $(this);
        setNavTreeCollapseOrExpand($this, e, $bsSidebar);
    });
    $bsHeader.on("click.bs-header", ".dropdown-menu a", function(e){
        e.preventDefault();
        var $this = $(this);
        setPageUrl($this.attr("href")||"", e);
    });
    $bsWrapper.on("click.bs-wrapper", "a[href]", function(e){
        var $this = $(this);
        setPageUrl($this.attr("href")||"", e);
    });
    //点击日期输入框，激活日期控件
    $bsWrapper.on("click.datetimepicker", ".date", function(e){
        $(this).datetimepicker("show");
    });
    $body.on("click.body", "[href=#]", function(e){
        e.preventDefault();
    }).on("click.bs-tree", ".bs-tree .nav li > .fa:first-child", function(e){
        var $this = $(this);
        setNavTreeCollapseOrExpand($this, e, $this.closest(".bs-tree"));
    }).on("change.bs-tree", ".bs-tree .nav .checkbox input[type='checkbox']", function(e){
        var $this = $(this);
        setNavTreeCheckbox($this, e, $this.closest(".bs-tree"));
    });
    if(window.addEventListener){
        window.addEventListener("hashchange", function(e){
            loadPageContent();
        }, false);
    }else{
        window["onhashchange"] = function(e){
            loadPageContent();
        };
    }
    loadPageContent($("#bs-sidebar-home").attr("href")||"");
    setQuickNavBarFixedTop();
}(window, document));