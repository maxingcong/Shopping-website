require(["base", "tools", "modules/point"], function($, T, TakeAddress){
    $("#hrlist").delegate(".shadetabs a","click", function(e){
        /*var index = $(this).index();
         $("#hrlist .shadetabs a").removeClass("sel");
         $(this).addClass("sel");
         $("#hrlist .tabcontent").hide();
         $(".tabcontent:eq("+index+")" ,$(this).closest("dl")).show();*/
        var index = $(this).index();
        $(this).addClass("sel").siblings("a").removeClass("sel");
        $(".tabcontent:eq("+index+")" ,$(this).closest("dl")).show().siblings(".tabcontent").hide();
    });
    $("#hrlist .dlist:eq(0) .shadetabs a:eq(0)").click();
    $("#hrlist .dlist:eq(1) .shadetabs a:eq(0)").click();
    $("#hrlist .dlist:eq(2) .shadetabs a:eq(0)").click();
    $("#hrlist .dlist:eq(3) .shadetabs a:eq(0)").click();
    $("#hrlist .dlist:eq(4) .shadetabs a:eq(0)").click();
    $("#hrlist .dlist:eq(5) .shadetabs a:eq(0)").click();
    $("#hrlist .dlist:eq(6) .shadetabs a:eq(0)").click();
});