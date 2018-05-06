const gulp = require("gulp");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const outputDir = "./client/build";

gulp.task("sass", function(){
  return gulp.src("./client/style/main.scss", {style: "compressed"})
	  .pipe(sass({
			includePaths: require('node-normalize-scss').includePaths
		}))
	  .pipe(gulp.dest(outputDir))
	  .pipe(cleanCSS({
		    keepSpecialComments: 0
	  }))
	  .pipe(gulp.dest(outputDir));
});

gulp.task('watch', function(){
	gulp.watch(['client/style/**/*.scss'], ['sass']);
});
