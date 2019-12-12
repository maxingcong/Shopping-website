define("modules/quotation-data", function () {
    /*覆膜  laminating
     切角  round_corner
     烫金  hot_stamping
     UV  UV
     切割  cutting
     安装  install
     安装时间  install_time
     模切  die_cutting
     折页类型  folding_type
     折后尺寸  folding_size
     形状  shape
     绳子形状  rope_shape
     穿绳方式  string_type
     装订方式  bind_type
     封面材质  cover_material
     内文材质  page_material
     内文P数  page_count
     发光  lamplight
     背板  back_material*/
    function getItemsBefore(productId) {
        var productName = {
            name: 'productName', //表单名
            attr: '产品名称', //属性名
            text: '如：名片' //提示文字
        }, number = {
            name: 'number', //表单名
            attr: '数量', //属性名
            unit: '盒',
            text: '如：10' //提示文字
        }, productSize = {
            name: 'productSize', //表单名
            attr: '产品尺寸', //属性名
            text: '如：100mm*80mm', //提示文字
            unit: 'mm',
            sign: '*',
            desc: '单位为毫米' //描述信息
        };
        if (productId == 200044) {
            productName.text = '如：名片';
            number.unit = '盒';
            number.desc = '单位为盒，每盒100张';
        } else if (productId == 200047) {
            productName.text = '如：三折页';
            number.unit = '张';
            number.desc = '单位为张';
            productSize.attr = '展开尺寸';
        }
        return [productName, number, productSize];
    }

    var itemsAfter = [{
        name: 'otherRequirements', //表单名
        attr: '其它要求', //属性名
        text: '', //提示文字
        textarea: true
    }];

    function getItems(productId, items) {
        return getItemsBefore(productId).concat(items).concat(itemsAfter);
    }

    return {
        all: [{
            name: 'productName',
            value: '产品名称'
        }, {
            name: 'number',
            value: '产品数量'
        }, {
            name: 'productSize',
            value: '产品尺寸'
        }, {
            name: 'foldingSize',
            value: '折后尺寸'
        }, {
            name: 'material',
            value: '产品材质'
        }, {
            name: 'foldingType',
            value: '折页类型'
        }, {
            name: 'printingMode',
            value: '印刷方式'
        }, {
            name: 'surfaceTreatment',
            value: '表面处理'
        }, {
            name: 'qualityRequirements',
            value: '品质要求'
        }, {
            name: 'bindType',
            value: '装订方式'
        }, {
            name: 'coverMaterial',
            value: '封面材质'
        }, {
            name: 'pageMaterial',
            value: '内文材质'
        }, {
            name: 'pageCount',
            value: '内文P数'
        }, {
            name: 'laminating',
            value: '覆膜'
        }, {
            name: 'roundCorner',
            value: '切角'
        }, {
            name: 'hotStamping',
            value: '烫金'
        }, {
            name: 'uv',
            value: 'UV'
        }, {
            name: 'cutting',
            value: '切割'
        }, {
            name: 'dieCutting',
            value: '模切'
        }, {
            name: 'shape',
            value: '形状'
        }, {
            name: 'ropeShape',
            value: '绳子形状'
        }, {
            name: 'stringType',
            value: '穿绳方式'
        }, {
            name: 'lamplight',
            value: '发光'
        }, {
            name: 'backMaterial',
            value: '背板'
        }, {
            name: 'install',
            value: '安装'
        }, {
            name: 'installTime',
            value: '安装时间'
        }],
        // 名片
        200044: getItems(200044, [{
            name: 'material', //表单名
            attr: '材质', //属性名
            text: '如：300g铜版纸', //提示文字
            values: ['300g铜版纸', '300g荷兰白', '300g珠光冰白', '其它'] //可选值集合
        }, {
            name: 'laminating', //表单名
            attr: '覆膜', //属性名
            unit: 'mm',
            sign: '*',
            values: ['不覆膜', '覆哑膜', '覆光膜'] //可选值集合
        }, {
            name: 'roundCorner', //表单名
            attr: '切角', //属性名
            text: '如：5cm圆角', //提示文字
            values: ['直角', '普通圆角（3cm小圆角）', '精细圆角', '其它'] //可选值集合
        }, {
            name: 'hotStamping', //表单名
            attr: '烫金', //属性名
            text: '如：10', //提示文字
            unit: 'mm',
            sign: '*',
            values: ['不烫金', '单面烫金', '双面烫金', '单面烫银', '双面烫银'] //可选值集合
        }, {
            name: 'uv', //表单名
            attr: 'UV', //属性名
            text: '如：10', //提示文字
            unit: 'mm',
            sign: '*',
            values: ['不加UV', 'UV'] //可选值集合
        }]),
        // 喷绘
        200045: getItems(200045, [{
            name: 'material', //表单名
            attr: '材质', //属性名
            text: '如：铜版纸' //提示文字
        }, {
            name: 'cutting', //表单名
            attr: '切割', //属性名
            values: ['方形', '异形'] //可选值集合
        }, {
            name: 'install', //表单名
            attr: '安装', //属性名
            values: ['无需安装', '低空安装（3m以下）', '高空安装（3米以上）'], //可选值集合
            relation: {
                '无需安装': {installTime: false},
                '低空安装（3m以下）': {installTime: true},
                '高空安装（3米以上）': {installTime: true}
            }
        }, {
            name: 'installTime', //表单名
            attr: '安装时间', //属性名
            values: ['白天', '晚上'] //可选值集合
        }]),
        // 单页
        200046: getItems(200046, [{
            name: 'material', //表单名
            attr: '材质', //属性名
            text: '如：157g铜版纸', //提示文字
            values: ['157g铜版纸', '157g哑粉纸', '200g铜版纸', '250g铜版纸', '300g铜版纸', '其它'] //可选值集合
        }, {
            name: 'printingMode', //表单名
            attr: '印刷方式', //属性名
            text: '如：单面单色', //提示文字
            values: ['单面单色', '单面双色', '单面四色', '双面单色', '双面双色', '双面四色', '其它'] //可选值集合
        }, {
            name: 'surfaceTreatment', //表单名
            attr: '表面处理', //属性名
            text: '如：单面覆光膜', //提示文字
            values: ['单面覆光膜', '单面覆哑膜', '双面覆光膜', '双面覆哑膜', '单面过光油', '单面过哑油', '双面过光油', '双面过哑油', '无', '其它'] //可选值集合
        }, {
            name: 'hotStamping', //表单名
            attr: '烫金', //属性名
            text: '如：10', //提示文字
            unit: 'mm',
            sign: '*',
            values: ['不烫金', '单面烫金', '双面烫金', '单面烫银', '双面烫银'] //可选值集合
        }, {
            name: 'dieCutting', //表单名
            attr: '模切', //属性名
            values: ['方形', '异形'] //可选值集合
        }]),
        //折页
        200047: getItems(200047, [{
            name: 'foldingSize', //表单名
            attr: '折后尺寸', //属性名
            text: '如：100*40', //提示文字
            desc: '单位为毫米' //描述信息
        }, {
            name: 'material', //表单名
            attr: '材质', //属性名
            text: '如：157g铜版纸', //提示文字
            values: ['157g铜版纸', '180g白牛', '200g超感滑面纸', '250g印象超感超白', '其它'],
            desc: '200g及以上必须覆膜、不建议特种纸因为爆线' //描述信息
        }, {
            name: 'foldingType', //表单名
            attr: '折页类型', //属性名
            text: '如：八折', //提示文字
            values: ['二折', '三折', '四折', '五折', '六折', '其它'] //可选值集合
        }, {
            name: 'printingMode', //表单名
            attr: '印刷方式', //属性名
            text: '如：单面单色', //提示文字
            values: ['单面单色', '单面双色', '单面四色', '双面单色', '双面双色', '双面四色', '其它'] //可选值集合
        }, {
            name: 'surfaceTreatment', //表单名
            attr: '表面处理', //属性名
            text: '如：单面覆光膜', //提示文字
            values: ['单面覆光膜', '单面覆哑膜', '双面覆光膜', '双面覆哑膜', '单面过光油', '单面过哑油', '双面过光油', '双面过哑油', '无', '其它'] //可选值集合
        }, {
            name: 'hotStamping', //表单名
            attr: '烫金', //属性名
            text: '如：10', //提示文字
            unit: 'mm',
            sign: '*',
            values: ['不烫金', '单面烫金', '双面烫金', '单面烫银', '双面烫银'] //可选值集合
        }, {
            name: 'dieCutting', //表单名
            attr: '模切', //属性名
            values: ['方形', '异形'] //可选值集合
        }]),
        // 不干胶
        200048: getItems(200048, [{
            name: 'material', //表单名
            attr: '材质', //属性名
            text: '如：80g铜版纸', //提示文字
            values: ['80g铜版纸', '透明', '哑银', '可移书纸', '不可移书纸', '其它'] //可选值集合
        }, {
            name: 'laminating', //表单名
            attr: '覆膜', //属性名
            unit: 'mm',
            sign: '*',
            values: ['不覆膜', '覆哑膜', '覆光膜（常用）'], //可选值集合
            desc: '合板印刷哑膜价格贵一些' //描述信息
        }, {
            name: 'shape', //表单名
            attr: '形状', //属性名
            values: ['方形', '圆形', '其它异形（建议上传附件）'] //可选值集合
        }]),
        // 不干胶
        200049: getItems(200049, [{
            name: 'material', //表单名
            attr: '材质', //属性名
            text: '如：白牛皮', //提示文字
            values: ['白牛皮', '黄牛皮（不建议四色印刷）', '250g铜版纸覆膜', '其它'] //可选值集合
        }, {
            name: 'printingMode', //表单名
            attr: '印刷方式', //属性名
            text: '如：单面单色', //提示文字
            values: ['单面单色', '单面双色', '单面四色', '双面单色', '双面双色', '双面四色', '其它'] //可选值集合
        }]),
        // 手提袋
        200050: getItems(200050, [{
            name: 'material', //表单名
            attr: '材质', //属性名
            text: '如：250g单粉卡', //提示文字
            values: ['250g单粉卡', '250g的白牛', '250g黄牛卡', '300g普通黑卡', '其它']
        }, {
            name: 'printingMode', //表单名
            attr: '印刷方式', //属性名
            text: '如：单面单色', //提示文字
            values: ['单面单色', '单面双色', '单面四色', '双面单色', '双面双色', '双面四色', '其它'] //可选值集合
        }, {
            name: 'surfaceTreatment', //表单名
            attr: '表面处理', //属性名
            text: '如：单面覆光膜', //提示文字
            values: ['单面覆光膜', '单面覆哑膜', '双面覆光膜', '双面覆哑膜', '单面过光油', '单面过哑油', '双面过光油', '双面过哑油', '无', '其它'] //可选值集合
        }, {
            name: 'ropeShape', //表单名
            attr: '绳子形状', //属性名
            text: '如：圆绳', //提示文字
            values: ['扁绳', '圆绳', '绞绳', '其它'] //可选值集合
        }, {
            name: 'stringType', //表单名
            attr: '穿绳方式', //属性名
            text: '如：带扣', //提示文字
            values: ['带扣', '打结', '扁绳热溶胶固定', '其它'] //可选值集合
        }]),
        // 画册
        200051: getItems(200051, [{
            name: 'bindType', //表单名
            attr: '装订方式', //属性名
            text: '如：骑马钉', //提示文字
            values: ['骑马钉', '无线胶装', '穿线胶装', 'YO装', '其它'] //可选值集合
        }, {
            name: 'coverMaterial', //表单名
            attr: '封面材质', //属性名
            text: '如：300g铜版纸', //提示文字
            values: ['300g铜版纸', '300g荷兰白', '300g印象超感超白', '其它'] //可选值集合
        }, {
            name: 'pageMaterial', //表单名
            attr: '内文材质', //属性名
            text: '如：128g铜版纸', //提示文字
            values: ['128g铜版纸', '157g铜版纸', '200g铜版纸', '120g白牛', '其它'], //可选值集合
            desc: '胶装书内文建议200g及以下' //描述信息
        }, {
            name: 'pageCount', //表单名
            attr: '内文P数', //属性名
            text: '如：32P', //提示文字
            unit: 'P',
            sign: '',
            values: ['24P', '28P', '32P', '36P', '40P', '其它'], //可选值集合
            desc: '无线胶装建议24P起、骑马钉建议不超过40P' //描述信息
        }]),
        // 包装
        200074: getItems(200074, [{
            name: 'material', //表单名
            attr: '材质', //属性名
            text: '如：铜版纸' //提示文字
        }]),
        // 广告字
        200075: getItems(200075, [{
            name: 'material', //表单名
            attr: '材质', //属性名
            text: '如：铜版纸' //提示文字
        }, {
            name: 'install', //表单名
            attr: '安装', //属性名
            values: ['无需安装', '低空安装（3m以下）', '高空安装（3米以上）'], //可选值集合
            relation: {
                '无需安装': {installTime: false},
                '低空安装（3m以下）': {installTime: true},
                '高空安装（3米以上）': {installTime: true}
            }
        }, {
            name: 'installTime', //表单名
            attr: '安装时间', //属性名
            values: ['白天', '晚上'] //可选值集合
        }, {
            name: 'lamplight', //表单名
            attr: '发光', //属性名
            values: ['不发光', '发光'] //可选值集合
        }, {
            name: 'backMaterial', //表单名
            attr: '背板', //属性名
            text: '如：铜版纸' //提示文字
        }]),
        // 灯箱
        200076: getItems(200076, [{
            name: 'material', //表单名
            attr: '材质', //属性名
            text: '如：铜版纸' //提示文字
        }, {
            name: 'install', //表单名
            attr: '安装', //属性名
            values: ['无需安装', '低空安装（3m以下）', '高空安装（3米以上）'], //可选值集合
            relation: {
                '无需安装': {installTime: false},
                '低空安装（3m以下）': {installTime: true},
                '高空安装（3米以上）': {installTime: true}
            }
        }, {
            name: 'installTime', //表单名
            attr: '安装时间', //属性名
            values: ['白天', '晚上'] //可选值集合
        }, {
            name: 'lamplight', //表单名
            attr: '发光', //属性名
            values: ['不发光', '发光'] //可选值集合
        }, {
            name: 'backMaterial', //表单名
            attr: '背板', //属性名
            text: '如：铜版纸' //提示文字
        }]),
        // 其他定制
        200055: getItems(200055, [{
            name: 'material', //表单名
            attr: '材质', //属性名
            text: '如：157g铜版纸' //提示文字
        }])
    };
});
