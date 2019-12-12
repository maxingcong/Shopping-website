({
    // Sea.js 的基础路径
    baseUrl: "./dev/scripts",
    // 模块配置
    paths: {
        "jquery": "jquery",
        "jquery/qrcode": "libs/jquery.qrcode.min",
        "qrcode": "libs/qrcode.min",
        "jcrop": "libs/jcrop.min",
        "plupload": "uploader/plupload.full.min",
        "qiniu/sdk": "uploader/qiniu-sdk",
        "datetimepicker": "libs/jquery.datetimepicker.full",
        "plugins": "libs/plugins",
        "uploader": "uploader/main",
        "design/detail": "design/scripts/category/detail",
        "design/params": "design/scripts/category/params",
        "design/price": "design/scripts/category/price",
        "package/price": "design/scripts/category/package_price",
        "design/product/main": "design/scripts/product/main"
    },
    //配置别名
    map: {
        "*": {
            "base": "jquery"
        }
    },
    /*//注入配置信息
     config: {
     "tool": {
     config: config
     }
     },*/
    //配置非AMD模块
    shim: {
        "qrcode": {
            exports: "QRCode"
        },
        "jquery/qrcode": {
            deps: ["base", "qrcode"]
        },
        "jcrop": {
            deps: ["base"]
        },
        "plupload": {
            deps: ["base"]
        },
        "qiniu/sdk": {
            deps: ["base", "plupload"]
        },
        "location": {
            deps: ["base"]
        },
        "uploadify": {
            deps: ["base"]
        },
        "bmap": {
            exports: "BMap"
        },
        "sinajs": {
            exports: "WB2"
        }
    },
    // 超时时间，默认7秒。
    waitSeconds: 30,

    //optimize: "none",
    optimize: "uglify2", //uglify,uglify2,closure
    optimizeCss: "standard",
    dir: "build/scripts",
    //cssIn: "./src/scripts*.css",
    //out: "path/to/css-optimized.css",
    //name: "utils",
    modules: [
        {
            name: "tools",
            exclude: ["base"]
        },
        {
            name: "index_new",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "portal/all",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "product/pdetail_new",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "product/index",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "inkjet/index",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "digital/index",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "fliggy/index",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "cart/order",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "cart/ordering",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "cart/payment",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "member/odetail",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "order/index",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "order/design",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "order/package",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "uploader",
            exclude: ["base", "tools", "location"]
        },
        {
            name: "portal/200000",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "member/address",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "member/union",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "loaded",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "link-login",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "modules/account_info",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "member/index",
            exclude: ["base", "tools", "uploader", "location", "modules/account_info"]
        },
        {
            name: "member/myintegral",
            exclude: ["base", "tools", "uploader", "location", "modules/account_info"]
        },
        {
            name: "product/detail_install",
            exclude: ["base", "tools", "location", "product/detail"]
        },
        {
            name: "product/detail",
            exclude: ["base", "tools", "location"],
            include: ["product/analysis", "product/params", "product/price"]
        },
        {
            name: "product/detail_com",
            include: ["product/params_com"],
            exclude: ["base", "tools", "location", "product/analysis", "product/params", "product/price", "product/detail"]
        },
        {
            name: "product/detail_stationery",
            include: ["product/params_qty"],
            exclude: ["base", "tools", "location", "product/analysis", "product/params", "product/price", "product/detail"]
        },
        {
            name: "product/detail_sqm",
            include: ["product/params_sqm"],
            exclude: ["base", "tools", "location", "product/analysis", "product/params", "product/price", "product/detail"]
        },
        {
            name: "product/detail_qty",
            include: ["product/params_qty"],
            exclude: ["base", "tools", "location", "product/analysis", "product/params", "product/price", "product/detail"]
        },
        {
            name: "product/detail_100",
            include: ["product/params_100"],
            exclude: ["base", "tools", "location", "product/analysis", "product/params", "product/price", "product/detail"]
        },
        {
            name: "product/detail_201",
            include: ["product/params_201"],
            exclude: ["base", "tools", "location", "product/analysis", "product/params", "product/price", "product/detail"]
        },
        {
            name: "product/detail_200450",
            include: ["product/params_200450"],
            exclude: ["base", "tools", "location", "product/analysis", "product/params", "product/price", "product/detail"]
        },
        {
            name: "product/detail_word",
            include: ["product/params_word"],
            exclude: ["base", "tools", "location", "product/analysis", "product/params", "product/price", "product/detail"]
        },
        {
            name: "card/index",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "card/make",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "design/scripts/index",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "design/scripts/case/index",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "design/scripts/case/mycollection",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "design/scripts/designer/designer",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "design/scripts/category/detail",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "design/scripts/category/detail_com",
            include: ["design/params", "design/price"],
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "design/scripts/category/detail_130",
            include: ["modules/design_quotation"],
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "design/scripts/category/detail_131",
            include: ["design/params", "package/price"],
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "design/product/main",
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "design/scripts/article/detail",
            include: ["modules/design_share"],
            exclude: ["base", "tools", "uploader", "location"]
        },
        {
            name: "design/scripts/contest/index",
            exclude: ["base", "tools", "uploader"]
        }
    ],
    useSourceUrl: false,
    useStrict: false,
    exclude: [
        "libs/"
    ],

    uglify: {
        toplevel: true,
        ascii_only: true,
        beautify: true,
        max_line_length: 1000,

        //How to pass uglifyjs defined symbols for AST symbol replacement,
        //see "defines" options for ast_mangle in the uglifys docs.
        defines: {
            DEBUG: ['name', 'false']
        },

        //Custom value supported by r.js but done differently
        //in uglifyjs directly:
        //Skip the processor.ast_mangle() part of the uglify call (r.js 2.0.5+)
        no_mangle: true
    },

    //If using UglifyJS2 for script optimization, these config options can be
    //used to pass configuration values to UglifyJS2.
    //For possible `output` values see:
    //https://github.com/mishoo/UglifyJS2#beautifier-options
    //For possible `compress` values see:
    //https://github.com/mishoo/UglifyJS2#compressor-options
    uglify2: {
        //Example of a specialized config. If you are fine
        //with the default options, no need to specify
        //any of these properties.
        output: {
            beautify: false
        },
        compress: {
            sequences: false,
            drop_debugger: true,
            drop_console: true,
            global_defs: {
                DEBUG: false
            }
        },
        warnings: true,
        mangle: false
    },

    //If using Closure Compiler for script optimization, these config options
    //can be used to configure Closure Compiler. See the documentation for
    //Closure compiler for more information.
    closure: {
        CompilerOptions: {},
        CompilationLevel: 'SIMPLE_OPTIMIZATIONS',
        loggingLevel: 'WARNING',
        externExportsPath: './extern.js'
    }
})
