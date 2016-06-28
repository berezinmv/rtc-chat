var gulp = require("gulp");
var gulpUtil = require("gulp-util");
var webpack = require("webpack");
var typescript = require("typescript");
var gulpTypescript = require("gulp-typescript");
var del = require("del");

gulp.task("default", ["build"]);

gulp.task("build", ["build:server", "build:client"]);

gulp.task("build:server", function () {
  var tsProject = gulpTypescript.createProject("tsconfig.json", {
    typescript: typescript
  });
  return gulp.src("src/server/**/*.ts")
    .pipe(gulpTypescript(tsProject))
    .pipe(gulp.dest("build/"));
});

gulp.task("build:client", function (callback) {
  webpack(require("./webpack.config"), function (err, stats) {
    if (err) {
      throw new gulpUtil.PluginError("webpack", err);
    }
    gulpUtil.log("[webpack]", stats.toString({
      errors: true,
      warnings: true,
      chunks: true,
      timings: true
    }));
    callback();
  });
});

gulp.task("clean", function () {
  return del(["build"]);
});
