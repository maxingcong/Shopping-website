var gulp = require("gulp");
var browserSync = require("browser-sync");
var fs = require("fs");
//加载gulp-load-plugins插件，并马上运行它
var plugins = require("gulp-load-plugins")(); //调用时原始插件名去掉gulp-前缀，之后再转换为小驼峰命名
var pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
function getConfig(){
    var config = JSON.parse(fs.readFileSync("src/scripts/config.json", "utf-8"));
    var HOSTNAME  = "v43." + config.DOMAIN.DOMAIN;
    var _HOSTNAME = "http://" + HOSTNAME;
    var _HOSTNAME  = "";//"http://wx.ininin.com"; http://m.ininin.com";
    var DOMAIN = {
        UP: "http://up.qiniu.com?v="+pkg.version,
        ACTION: "http://action."+ config.DOMAIN.DOMAIN +"/",
        ROOT: _HOSTNAME + "/",
        APP: _HOSTNAME + "/app/",
        PAY: _HOSTNAME + "/pay/",
        CART: _HOSTNAME + "/cart/",
        ORDER: _HOSTNAME + "/order/",
        MEMBER: _HOSTNAME + "/member/",
        DESIGN: _HOSTNAME + "/design/",
        PRODUCT: _HOSTNAME + "/product/",
        PASSPORT: _HOSTNAME + "/passport/",
        FAQ: _HOSTNAME + "/faq/",
        HELP: _HOSTNAME + "/help/",
        GIFT: _HOSTNAME + "/gift/",
        STYLES: _HOSTNAME + "/themes/css/",
        STYLES_OLD: _HOSTNAME + "/resources/themes/css/",
        SCRIPTS: _HOSTNAME + "/scripts/",
        RESOURCES: _HOSTNAME + "/resources/",
        CLOUD: "http://cloud." + config.DOMAIN.DOMAIN + "/",
        DOMAIN: config.DOMAIN.DOMAIN
    };
    config.DOMAIN = DOMAIN;
    config.VER = 'v='+pkg.version;
    config.VERSION = pkg.version;
    config.author = pkg.author;
    config.copyright = pkg.copyright;
    config.title = pkg.title;
    config.keywords = pkg.keywords;
    config.description = pkg.description;
    fs.writeFileSync("src/scripts/config.json", JSON.stringify(config, null, 4));
    config.HOSTNAME = HOSTNAME;
    return config;
}
var handleErrors = function(err) {
    plugins.notify.onError({
        title:    "Gulp",
        message:  "<%= error.name %>\nfileName: <%= error.fileName %>\nError: <%= error.message %>",
        sound:    "Beep"
    })(err);
    //this.emit('end');
};
/*
 * browserSync 服务器
 * http://www.browsersync.cn/docs/gulp/
 */
gulp.task("build:browserSync", function() {
    browserSync({
        files: "build",
        port: 80,
        host: getConfig().HOSTNAME,
        //proxy: "v41.ininin.com"
        server: {
            baseDir: "build" // Change this to your web root dir
        }
    });
});
//清空文件夹
gulp.task("build:clean", function() {
    return gulp.src("build/", {read: false})
        .pipe(plugins.clean());
});
//压缩图片
gulp.task("build:images", ["build:clean"], function () {
    return gulp.src("src/**/*.{png,jpg,gif,ico,mp3}")
        .pipe(plugins.plumber({errorHandler: handleErrors}))
        .pipe(plugins.watch("src/**/*.{png,jpg,gif,ico,mp3}"))
        .pipe(plugins.imagemin(/*{
         optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
         progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
         interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
         multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
         }*/))
        .pipe(gulp.dest("build"));
});
//编译HTML文件
gulp.task("build:html", ["build:clean"], function () {
    return gulp.src(["src/views/about/**/*.html"])
        .pipe(plugins.plumber({errorHandler: handleErrors}))
        .pipe(plugins.watch(["src/views/about/**/*.html"]))
        .pipe(plugins.fileInclude({
            prefix: "@@",
            basepath: "src"
        }))
        .pipe(plugins.template(getConfig()))
        .pipe(plugins.fileInclude({
            prefix: "@#",
            basepath: "src"
        }))
        /*.pipe(plugins.fileInclude({
            prefix: "@@",
            basepath: "src"
        }))
        .pipe(plugins.fileInclude({
            prefix: "@#",
            basepath: "src"
        }))*/
        .pipe(gulp.dest("build"));
});
//编译CSS文件
gulp.task("build:css", ["build:clean"], function () {
    return gulp.src(["src/**/*.css"])
        .pipe(plugins.plumber({errorHandler: handleErrors}))
        .pipe(plugins.watch("src/**/*.css"))
        .pipe(plugins.fileInclude({
            prefix: "@@",
            basepath: "src"
        }))
        .pipe(gulp.dest("build"));
});
//编译JS文件
gulp.task("build:js", ["build:clean"], function () {
    return gulp.src(["src/**/*.js"])
        .pipe(plugins.plumber({errorHandler: handleErrors}))
        .pipe(plugins.watch("src/**/*.js"))
        .pipe(plugins.fileInclude({
            prefix: "//@",
            basepath: "src",
            context: getConfig()
        }, getConfig()))
        .pipe(gulp.dest("build"));
});
gulp.task("build", ["build:images", "build:html", "build:css", "build:js"]);
gulp.task("test", ["build:browserSync", "build:html", "build:css", "build:images"]);