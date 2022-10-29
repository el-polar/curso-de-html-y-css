const { src, dest, watch, series, parallel } = require("gulp");

// CSS y SASS
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const cssnano = require("cssnano");

// Imagenes
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

function css(done) {
    src("src/scss/app.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "compressed" }))
        .on("error", function (err) {
            console.log(err.message);
        })
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write("."))
        .pipe(dest("build/css"));

    done();
}

function images() {
    return src("src/img/**/*")
        .pipe(imagemin({ optimizationLevel: 3 }))
        .pipe(dest("build/img"));
}

function js() {
    return src("src/js/**/*.js").pipe(dest("build/js"));
}

function html() {
    return src("*.html").pipe(dest("build"));
}

function versionWebp() {
    const opciones = {
        quality: 50,
    };
    return src("src/img/**/*.{png,jpg}")
        .pipe(webp(opciones))
        .pipe(dest("build/img"));
}

function versionAvif() {
    const opciones = {
        quality: 50,
    };
    return src("src/img/**/*.{png,jpg}")
        .pipe(avif(opciones))
        .pipe(dest("build/img"));
}

function dev() {
    watch("src/scss/**/*.scss", css);
    watch("src/img/**/*", images);
    watch("src/js/**/*.js", js);
    watch("*.html", html);
}

exports.dev = dev;
exports.default = series(js, html, images, versionWebp, versionAvif, css);
