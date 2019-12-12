//http://www.cnblogs.com/2050/p/4198792.html
var gulp = require("gulp");
/*var requireDir = require("require-dir");
//加载任务
var tasks = requireDir("./tasks");
//默认任务
gulp.task("default", ["build:browserSync","build"]);
//发布任务
//gulp.task("dist", ["task:dist"]);
//生成文档
gulp.task("jsdoc", ["task:jsdoc"]);*/
var plugins = require("gulp-load-plugins")();
//压缩HTML
gulp.task("minify:html", function() {
    return gulp.src("dev/**/*.html")
        .pipe(plugins.watch("dev/**/*.html"))
        .pipe(plugins.htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("build"))
});
//压缩图片
gulp.task("minify:image", function () {
    return gulp.src("dev/**/*.{png,jpg,gif,ico,mp3}")
        .pipe(plugins.watch("dev/**/*.{png,jpg,gif,ico,mp3}"))
        .pipe(plugins.imagemin(/*{
         optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
         progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
         interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
         multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
         }*/))
        .pipe(gulp.dest("build"));
});
//压缩CSS
gulp.task("minify:css", function() {
    return gulp.src("dev/**/*.css")
        .pipe(plugins.watch("dev/**/*.css"))
        .pipe(plugins.cleanCss({
            compatibility: "ie8"
        }))
        .pipe(gulp.dest("build"));
});
gulp.task("default", ["minify:html"/*, "minify:image"*/, "minify:css"]);

//node r.js -o r.build.js