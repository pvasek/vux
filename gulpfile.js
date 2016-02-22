var gulp = require("gulp");
var fs = require("fs");
var del = require("del");
var ts = require('gulp-typescript');
var shell = require('gulp-shell')
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

gulp.task('clean', function () {
    return del([
        './dist/ts/**/*'
    ]);
});

gulp.task('ts', ['clean'], function() {
    console.log('loading tsconfig project...')
    var tsProject = ts.createProject('tsconfig.json');
    console.log('tsconfig loaded')
  
    return tsProject
        .src()
        .pipe(ts(tsProject))
        .pipe(gulp.dest('./dist/ts'));
});

gulp.task('test:watch', ['test'], function() {
    gulp.watch(['**/*.ts'], ['test']);
});

gulp.task('test-plugin', function() {
    return gulp.src(['./dist/ts/**/**/__tests__/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', function(err) { 
            gutil.log(err); 
            this.emit('end') 
        });
});

gulp.task('test', ['ts'], shell.task([
  'mocha ./dist/ts/**/**/__tests__/*.js',
]));
