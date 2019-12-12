require(["base", "tools", "design/product/main"], function ($, T, DemandMain) {
    var demandMain,
        Demand = {
            init: function(){
                demandMain = DemandMain();
                demandMain.on("get.params", function(param, forms){
                    if (forms["其他信息"]!=="") {
                        param["其他信息"] = forms["其他信息"];
                    }
                    if(forms["画册需求"]!==""){
                        param["画册需求"] = forms["画册需求"];
                    }else{
                        T.msg("请尽可能详细的描述您的画册需求");
                        return false;
                    }
                });
                demandMain.init({
                    required: true,
                    customTemplateName: "other_info",
                    custom: [{
                        attrName: "行业"
                    }, {
                        attrName: "色系"
                    }],
                    namesOrder: ["行业", "色系"],
                    placeholders: {
                        "画册需求": "请尽可能详细的描述您的画册需求，方便我们快速为您服务。",
                        "其他信息": "请填写其他信息"
                    }
                });
            }
        };
    T.Loader(function() {
        Demand.init();
    });
});