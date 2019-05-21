import argv from "yargs";
import gulp from "gulp";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import pug from "gulp-pug";
import browserify from "browserify";
import babelify from "babelify";
import source from "vinyl-source-stream";
import uglify from "gulp-uglify";
import gulpif from "gulp-if";
import plumber from "gulp-plumber";
import browserSync from "browser-sync";

const server = browserSync.create();

gulp.task("sass", () => {
  gulp
    .src("./dev/scss/styles.scss")
    .pipe(plumber())
    .pipe(
      sass({
        outputStyle: "compact"
      })
    )
    .pipe(
      autoprefixer({
        browsers: ["last 3 versions"]
      })
    )
    .pipe(gulp.dest("./public/css"))
    .pipe(server.stream());
});

gulp.task("pug", () => {
  gulp
    .src("./dev/pug/*.pug")
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest("./public/"));
});

gulp.task("babel", () => {
  const options = {
    entries: "./dev/js/scripts.js", // Entry point
    extensions: [".js"], // consider files with these extensions as modules
    paths: ["./dev/js/"] // This allows relative imports in require, with './scripts/' as root
  };
  browserify(options)
    .transform(babelify)
    .bundle()
    .on("error", function(err) {
      console.error(err);
      this.emit("end");
    })
    .pipe(source("scripts.min.js"))
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulp.dest("./public/js"));
});

gulp.task("default", () => {
  server.init({ server: "./public" });

  gulp.watch("./dev/scss/styles.scss", ["sass"]);
  gulp.watch("./dev/pug/*.pug", ["pug"]).on("change", server.reload);
  gulp.watch("./dev/js/*.js", ["babel"]).on("change", server.reload);
});
