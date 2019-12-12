var CFG = CFG||{};
CFG.API = {//数据源配置
    sendcode: 'in_user/create_back_code',
    checkcode: 'in_user/check_code',
    login: 'in_supplier/supplier/login',
    register: 'in_supplier/supplier/insert_supplier', //添加供应商
    check_username: 'in_supplier/supplier/check_username', //检查手机号码唯一性
    check_companyname: 'in_supplier/supplier/check_companyname', //检查公司名称唯一性
    update_password: 'in_supplier/supplier/update_password', //修改密码
    update_password_by_code: 'in_supplier/supplier/update_password_by_code', //未登录时修改密码
    manager_info: 'in_supplier/supplier/manager_info', //获取生产拓展经理信息
    logout: 'in_supplier/supplier/logout',
    supplier: {
        supplier_detail: 'in_supplier/supplier/detail', //供应商详情
        update_supplier: 'in_supplier/supplier/update_supplier' //编辑供应商
    },
    product: {
        physics_product_category: 'in_product_new/physics/category_query', //获取物理产品分类
        physics_product_list: 'in_product_new/physics/product_list', //获取物理产品列表
        physics_product_detail: 'in_product_new/physics/product_query', //获取物理产品详情
        physics_upload_excel: 'in_product_new/physics/upload_excel', //物理产品导入Excel
        supplier_product: 'in_supplier/supplier_product/list', //获取可供应产品
        supplier_product_update_all: 'in_supplier/supplier_product/update_all', //更改接单状态
        supplier_product_insert: 'in_supplier/supplier_product/insert', //新增可供应产品
        supplier_product_update: 'in_supplier/supplier_product/update', //编辑可供应产品
        supplier_product_detail: 'in_supplier/supplier_product/detail', //获取可供应产品详情
        delete_supplier_product: 'in_supplier/supplier_product/delete_supplier_product', //删除供应商产品
        delivery_list_for_product: 'in_supplier/delivery/delivery_list_for_product', //查询供应商的配送方式
        paper_price_query: 'in_product_new/page_price/query_page_price',  //查询纸张吨价
        paper_price_add: 'in_product_new/page_price/add_page_price', //新增纸张吨价
        paper_price_delete: 'in_product_new/page_price/delete_page_price',  //删除纸张吨价
        paper_price_update: 'in_product_new/page_price/modify_page_price',  //修改纸张吨价
        print_machine_query: 'in_product_new/printer_size/query_printer_size',  //查询打印机尺寸
        general_paper_query: 'in_product_new/supplier_using_page/query_supplier_using_page', //常用上机纸查询
        general_paper_add: 'in_product_new/supplier_using_page/add_supplier_using_page', //启用常用上机纸
        general_paper_delete: 'in_product_new/supplier_using_page/delete_supplier_using_page', //停用常用上机纸
        print_price_query:'in_product_new/print_price/query_print_price',  //查询印刷费
        print_price_update: 'in_product_new/print_price/update_print_price',  //更新印刷费
        printer_add: 'in_product_new/printer_size/add_printer_size',  //增加印刷机
        printer_update: 'in_product_new/printer_size/update_printer_size',  //增加印刷机
        printer_del: 'in_product_new/printer_size/delete_printer_size'  //删除印刷机
    },
    delivery: {
        support_mode_list: 'in_supplier/delivery/get_support_delivery_mode', //查询供应商支持的配送方式集合
        mode_template_list: 'in_supplier/delivery/delivery_mode_template_list', //查询配送方式模板集合
        find_mode_template: 'in_supplier/delivery/find_delivery_mode_template', //查询配送方式模板详情
        save_mode_template: 'in_supplier/delivery/save_mode_template', //保存配送方式模板
        edit_mode_template: 'in_supplier/delivery/edit_mode_template', //编辑配送方式模板
        update_disable_status_all: 'in_supplier/delivery/update_disable_status_all', //启用/禁用运费模板
        replace_point_list: 'in_product_new/delivery/replace_point_list', //代发货点列表
        update_supplier_replace_point: 'in_supplier/delivery/update_supplier_replace_point' //修改供应商代发货点
    },
    order: {
        //order_list: 'in_order/order_supplier_query_list', //订单列表
        order_list: 'in_supplier/supplier/order_supplier_query_list', //订单列表
        query_one: 'in_order/order_supplier_query_one', //订单详情
        update: 'in_order/order_product_ibo_update', //更改订单商品状态
        index: 'in_order/order_supplier_statis', //首页数据
        product_info: 'in_order/production_distribution_info_query', // 生产配送--商品信息查询
        sort_out: 'in_order/sorting_goods_for_pdm_console', // 生产配送--分拣
        query_deliver: 'in_order/query_production_deliver', // 生产配送--发货信息查询
        update_deliver: 'in_order/update_production_deliver', // 生产配送--发货
        export_production: 'in_order/export_production_distribution' //生产配送--商品信息导出Excel
    },
    invoice: 'in_supplier/account/send_invoice', //发票寄送
    account: {
        account_info: 'in_supplier/account/info', //首页现金账户信息
        account_apply: 'in_supplier/account/apply', //申请提现
        account_list: 'in_supplier/account/list' //现金账户列表
    },
    msg: {
        msg_list: 'in_supplier/notification/select_supplier_notifiction_list', //消息列表
        msg_readed: 'in_supplier/notification/notifiction_readed', //消息标记为已读
        msg_detail: 'in_supplier/notification/select_notification_by_id' //消息详情
    },
    statistic: 'in_order/supplier_order_statistic', //数据统计
    order_query: 'in_order/supplier_order_query' //订单查询
};
//发票
CFG.INVOICE = {
    //发票类型
    TYPE: {
        1: "普通发票（纸质）",
        2: "增值税专用发票"
    },
    //发票抬头
    TITLE: {
        1: "个人",
        2:"单位"
    },
    //发票内容
    CONTENT: {
        1:"办公用品",
        2:"办公用品",
        3:"耗材",
        4:"名片",
        5:"宣传用品",
        6:"设计费",
        7:"画册",
        8:"运费"},
    STATUS: {
        Draft:"待审核",
        NotPass:"审核不通过",
        Pass:"审核通过"
    }
};
//配送方式
CFG.DELIVERY_METHOD = {
    2: "上门自提",
    4: "物流发货",
    5: "工厂取货",
    16: "专车配送",
    17: "普通快递",
    18: "加急快递"
};
//物流计价方式
CFG.LOGISTICS_PRICE_TYPE = {
    "Weight": "按重量",
    "Number": "按件数",
    "Acreage": "按面积",
    "Volume": "按体积"
};
/*/配送模式
CFG.DELIVERY_MODE = {
    2: "上门自提",
    4: "物流发货",
    5: "工厂取货",
    16: "专车配送",
    17: "普通快递",
    18: "加急快递"
};*/
//配送时间
CFG.TAKE_DATE_LIST = [{
    dateId: 1,
    name: "仅工作日送货",
    desc: "（周一至周五）"
},{
    dateId: 2,
    name: "工作日、双休日均可送货",
    desc: "（周一至周六）"
}];
CFG.TAKEDATE = {
    "1": CFG.TAKE_DATE_LIST[0].name + CFG.TAKE_DATE_LIST[0].desc,
    "2": CFG.TAKE_DATE_LIST[1].name + CFG.TAKE_DATE_LIST[1].desc
};
//物流公司
CFG.LOGISTICS = [
    {
        "key": "shentong",
        "name": "申通快递"
    },
    {
        "key": "yuantong",
        "name": "圆通速递"
    },
    {
        "key": "shunfeng",
        "name": "顺丰速运"
    },
    {
        "key": "youshuwuliu",
        "name": "优速物流"
    },
    {
        "key": "ems",
        "name": "EMS"
    },
    {
        "key": "ems",
        "name": "中国邮政"
    },
    {
        "key": "tiantian",
        "name": "天天快递"
    },
    {
        "key": "yunda",
        "name": "韵达快递"
    },
    {
        "key": "zhongtong",
        "name": "中通速递"
    },
    {
        "key": "longbanwuliu",
        "name": "龙邦物流"
    },
    {
        "key": "zhaijisong",
        "name": "宅急送"
    },
    {
        "key": "quanyikuaidi",
        "name": "全一快递"
    },
    {
        "key": "huitongkuaidi",
        "name": "汇通速递"
    },
    {
        "key": "minghangkuaidi",
        "name": "民航快递"
    },
    {
        "key": "yafengsudi",
        "name": "亚风速递"
    },
    {
        "key": "kuaijiesudi",
        "name": "快捷速递"
    },
    {
        "key": "tiandihuayu",
        "name": "华宇物流"
    },
    {
        "key": "zhongtiewuliu",
        "name": "中铁快运"
    },
    {
        "key": "ups",
        "name": "UPS"
    },
    {
        "key": "dhl",
        "name": "DHL"
    },
    {
        "key": "other",
        "name": '其他'
    }
];