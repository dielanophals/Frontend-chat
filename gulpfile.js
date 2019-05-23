const {src, dest, watch, parallel} = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

function sass2css(done){
    return src("./sass/style.scss")
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(dest("./css/"))
        .pipe(browserSync.stream())

    done();
}

watch('./sass/**/*.scss', sass2css)

module.exports.default = parallel(sass2css);