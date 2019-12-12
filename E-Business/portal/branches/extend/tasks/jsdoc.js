var gulp = require("gulp");
//加载gulp-load-plugins插件，并马上运行它
var plugins = require("gulp-load-plugins")(); //调用时原始插件名去掉gulp-前缀，之后再转换为小驼峰命名

var handleErrors = function(err) {
    plugins.notify.onError({
        title:    "Gulp",
        message:  "<%= error.name %>\nfileName: <%= error.fileName %>\nError: <%= error.message %>",
        sound:    "Beep"
    })(err);
    //this.emit('end');
};

//生成文档
gulp.task("task:jsdoc", function() {
    gulp.src("./docs/", {read: false})
        .pipe(plugins.clean());
    return gulp.src(["./src/**/!(template|template-debug|template-native|template-native-debug).js"])
        .pipe(plugins.plumber({errorHandler: handleErrors}))
        .pipe(plugins.jsdoc.parser({}, "ininin"))
        .pipe(plugins.jsdoc.generator("./docs", {
            path: "ink-docstrap",
            systemName: "ininin.com",
            copyright: "Copyright &copy; 2013-2015 ininin.com. All rights reserved.",
            footer: "",
            dateFormat: "YYYY-M-D",
            "cleverLinks": false,
            "monospaceLinks": false,
            "outputSourceFiles": true,
            "outputSourcePath": true,
            "navType": "vertical",
            "theme": "cerulean",
            "linenums": true,
            "collapseSymbols": false,
            "inverseNav": true,
            "highlightTutorialCode": true
        }));
});