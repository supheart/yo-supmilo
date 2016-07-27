var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-clean-css');
var gulpSequence = require('gulp-sequence');//控制任务顺序

gulp.task('sass', function(){
    return gulp.src('./src/public/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/public/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./src/public/sass/*.scss', ['sass']);
});

//压缩nodejs代码
gulp.task('minnode', function(){
    return gulp.src(['src/**/*.js', '!src/public/**/*.js', '!src/configs/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

//压缩html文件
gulp.task('minhtml', function(){
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    return gulp.src('src/**/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist'));
});

//移动静态文件
gulp.task('movefile', function(){
    return gulp.src('src/public/**/*')
        .pipe(gulp.dest('dist/public'));
});

//移动配置文件
gulp.task('moveconfigs', function(){
    return gulp.src('src/configs/**/*')
        .pipe(gulp.dest('dist/configs'));
});

//压缩前端js代码
gulp.task('minjs', function(){
    return gulp.src(['src/public/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist/public'));
});

//压缩css代码
gulp.task('mincss', function () {
    gulp.src('src/**/*.css')
        .pipe(cssmin({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true//类型：Boolean 默认：false [是否保留换行]
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', gulpSequence('movefile', ['moveconfigs', 'minnode', 'minhtml', 'mincss', 'minjs']));

// 将文件移动到共享文件夹
var dirName = 'f:/vymiddle';
gulp.task('pack', function () {
  gulp.src('./dist/**').pipe(gulp.dest(dirName + '/dist'));
  gulp.src('./node_modules/**').pipe(gulp.dest(dirName + '/node_modules'));
  gulp.src('./oauth/**').pipe(gulp.dest(dirName + '/oauth'));
  gulp.src('./package.json').pipe(gulp.dest(dirName));
  gulp.src('./launch.sh').pipe(gulp.dest(dirName));
});
