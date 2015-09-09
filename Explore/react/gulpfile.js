var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var reactify = require('reactify'); 
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');

var jsSrcPath = './src/main.js';
var jsDestPath = './dest/';


// var bundler = browserify({
//     entries: jsSrcPath,
//     transform: [reactify],
//     debug: true,
//     cache: {},
//     packageCache: {},
//     fullPaths: true
// });

// gulp.task('browserify', function() {
//     var watcher  = watchify(bundler);

//     return watcher.on('update', function () {
//             var updateStart = Date.now();
//             console.log('Updating!');

//             // Create new bundle that uses the cache for high performance
//             watcher.bundle()
//                 .pipe(source(jsSrcPath))
//                 // This is where you add uglifying etc.
//                 .pipe(gulp.dest(jsDestPath));

//             console.log('Updated!', (Date.now() - updateStart) + 'ms');
//         })
//         // Create the initial bundle when starting the task
//         .bundle()
//         .pipe(source('main.js'))
//         .pipe(gulp.dest(jsDestPath));
// });

// add custom browserify options here
var customOpts = {
    entries: jsSrcPath,
    transform: [babelify, reactify],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
};

var babelifyConf = {
    stage: 0
};

var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)); 

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('browserify', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dest'));
}

gulp.task('default', ['browserify']);