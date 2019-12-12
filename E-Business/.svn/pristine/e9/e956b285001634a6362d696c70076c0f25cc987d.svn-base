define("product/200071", ["base", "tools"], function ($, T) {
    var ProductDetailCustom = T.Module({
        action: CFG_DS.product.get_price,
        template: "product_detail",
        data: {},
        events: {},
        init: function(product, pattr){
            var _this = this;
            var pattrs = String(pattr).split("^");
            product._quantityMinValue = 0; //数量最小值
            product.HAS_SHOW_COUNTER = 0; //是否显示款数
            product.HAS_ONLY_TOTAL_PRICE = 1; //仅总价
            product.HAS_COUNTER_DECLARE = 1; //款数声明
            product.productList = [{
                productId: 200072,
                targetId: 200071,
                categoryId: product.categoryId,
                productName: "工牌"
            }, {
                productId: 200073,
                targetId: 200071,
                categoryId: product.categoryId,
                productName: "挂绳"
            }];
            //工牌1张起印，10张以下统一40元
            _this.setWorkCard(product.productList[0], pattrs[0]||"");
            //挂绳50条起印，可选数量为10的倍数，1000条以下加收108元网版费
            _this.setStrap(product.productList[1], pattrs[1]||"");
            //套装产品
            _this.productList = product.productList;
        },
        setBuyStatus: function(){debugger
            var _this = this;
            var count = 0;
            T.Each(_this.productList, function(i, product){
                if(product.attr&&product.attr[product._quantityName]){
                    count++;
                }
            });
            if(count>0){
                $(".form_btm .submit", _this.$cont).removeClass("dis");
            }else{
                $(".form_btm .submit", _this.$cont).addClass("dis");
            }
        },
        /*
         * 工牌
         */
        setWorkCard: function(product, pattr){
            var _this = this;
            product._quantityAlt = "工牌1张起印，10张以下统一40元"; //数量提示
            product._quantityMinValue = 0; //数量最小值
            product._quantityMaxValue = 100000; //数量最大值
            product._quantityStep = 1; //数量的基数
            product._quantityDivide = 1; //数量必须整除
            product._quantityMulriple = 1; //数量倍数
            product._quantityInputUnit = ""; //数量输入单位
            product._quantityUnit = "个"; //数量单位
            product.HAS_INPUT_QUANTITY = 1; //是否可输入数量
            product.HAS_SINGLE_HIDE = 0; //是否单个属性隐藏
            product.HAS_SHOW_COUNTER = 0; //是否显示款数
            product.params = "";
            var names = ["工牌数量","工牌尺寸","工牌孔位"];
            //属性名匹配字符串
            product.baseInfoName = names[0]+"_"+names[1]+"-"+names[2];//产品选项
            product.namesOrder = [names[0],names[1],names[2]];//属性显示顺序
            //属性值列表
            product.attrs = {};
            product.attrs[names[0]] = [];
            product.attrs[names[1]] = ["85mm*54mm"];
            product.attrs[names[2]] = ["13mm*3mm扁孔", "不打孔"];
            //默认属性
            product.attr = {};
            product.attr[names[0]] = "100";
            //属性图
            product.paramImages = product.paramImages||{};
            product.paramImages[product.attrs[names[2]][0]] = T.DOMAIN.RESOURCES + "products/20007201.jpg";
            //选中属性
            product.changeCounter = function($input, val){
                var $attrs = $input.closest(".attrs");
                if(val>0){
                    $(".val", $attrs).removeClass("dis");
                }else{
                    $(".val", $attrs).addClass("dis");
                }
                _this.setBuyStatus();
            };
        },
        /*
         * 挂绳
         */
        setStrap: function(product, pattr){
            var _this = this;
            product._quantityAlt = "挂绳50条起印，可选数量为10的倍数，1000条以下加收108元网版费"; //数量提示
            product._quantityMinValue = 0; //数量最小值
            product._quantityStartValue = 50; //数量的起始值
            product._quantityMaxValue = 100000; //数量最大值
            product._quantityStep = 10; //数量的基数
            product._quantityDivide = 10; //数量必须整除
            product._quantityMulriple = 1; //数量倍数
            product._quantityInputUnit = ""; //数量输入单位
            product._quantityUnit = "条"; //数量单位
            product.HAS_INPUT_QUANTITY = 1; //是否可输入数量
            product.HAS_SINGLE_HIDE = 0; //是否单个属性隐藏
            product.HAS_SHOW_COUNTER = 0; //是否显示款数
            product.params = "";
            var names = ["挂绳材质","挂绳数量","挂绳尺寸","挂绳颜色","挂绳印刷","包边工艺","挂钩","配卡套"];
            //属性名匹配字符串
            product.baseInfoName = names[0]+"_"+names[1]+"_"+names[2]+"-"+names[3]+"_"+names[4]+"_"+names[5]+"_"+names[6]+"_"+names[7];//产品选项
            product.namesOrder = [names[1],names[2],names[0],names[3],names[4],names[5],names[6],names[7]];//属性显示顺序
            //属性值列表
            product.attrs = {};
            product.attrs[names[0]] = ["涤纶绳热转印", "尼龙绳丝印"];
            product.attrs[names[1]] = [];
            product.attrs[names[2]] = ["900mm*20mm", "900mm*15mm", "900mm*12mm"];
            product.attrs[names[3]] = [];
            product.attrs[names[4]] = [];
            product.attrs[names[5]] = ["铆钉", "不锈钢包扣"];
            product.attrs[names[6]] = ["龙虾扣", "大蛋扣"];
            product.attrs[names[7]] = ["不配卡套", "配卡套"];
            //属性互斥配置，当选中某个属性值时，另一个属性值可用/不可用
            product.mutexConfig = {
                "挂绳材质": {
                    "涤纶绳热转印": {
                        "挂绳颜色": [],
                        "挂绳印刷": ["双面四色印刷"]
                    },
                    "尼龙绳丝印": {
                        "挂绳颜色": ["红色", "黄色", "蓝色", "绿色", "黑色", "橙色"],
                        "挂绳印刷": ["单面白字"]
                    }
                }
            };
            //属性图
            product.paramImages = product.paramImages||{};
            product.paramImages[product.attrs[names[0]][0]] = T.DOMAIN.RESOURCES + "products/20007301.jpg";
            product.paramImages[product.attrs[names[0]][1]] = T.DOMAIN.RESOURCES + "products/20007302.jpg";
            product.paramImages[product.attrs[names[5]][0]] = T.DOMAIN.RESOURCES + "products/20007303.jpg";
            product.paramImages[product.attrs[names[5]][1]] = T.DOMAIN.RESOURCES + "products/20007304.jpg";
            product.paramImages[product.attrs[names[6]][0]] = T.DOMAIN.RESOURCES + "products/20007305.jpg";
            product.paramImages[product.attrs[names[6]][1]] = T.DOMAIN.RESOURCES + "products/20007306.jpg";
            product.paramImages[product.attrs[names[7]][0]] = T.DOMAIN.RESOURCES + "products/20007307.jpg";
            product.paramImages[product.attrs[names[2]][0]] = T.DOMAIN.RESOURCES + "products/20007308.jpg";
            product.paramImages[product.attrs[names[2]][1]] = T.DOMAIN.RESOURCES + "products/20007308.jpg";
            product.paramImages[product.attrs[names[3]][2]] = T.DOMAIN.RESOURCES + "products/20007308.jpg";
            //默认属性
            product.attr = {};
            product.attr[names[1]] = "100";
            product.changeCounter = function($input, val, flag){
                var $attrs = $input.closest(".attrs");
                if(val>0){
                    $(".val", $attrs).removeClass("dis");
                }else{
                    $(".val", $attrs).addClass("dis");
                }
                _this.setBuyStatus();
            };
        }
    });
    return ProductDetailCustom;
});