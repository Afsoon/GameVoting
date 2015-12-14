/**
 * Created by saidatrahouchecharrouti on 10/11/15.
 */
var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var isTravis = process.env.TRAVIS || false;
var minimist = require('minimist');
var args = minimist(process.argv.slice(2));
var gulpsftp = require('gulp-sftp');


var publics = ['public/**/*.html',
    'public/**/*.js',
    'public/**/*.css',
    'public/**/*.wav'];
var server = ['server/WebSocketsImplementation.js'];
var routes = ['routes/*.js'];
var pack = ['ecosystem.json', 'package.json', 'app.js'];
var test = ['spec/**.js'];
var views = ['views/*.jade'];
var modules = ['modules/*.js'];


gulp.task('default', ['test', 'deploy']);

gulp.task('test', function(){
    return gulp.src(test)
        .pipe(jasmine())
});

//nombre de la tarea, dependencias, funcion. Tambien se puede hacer con stream off
//Si la tarea de la que depende sale con error, no se ejecuta

gulp.task('deploy', ['test'], function(){
    //gulp.src(publics)
        //.pipe(gulpsftp(generatePath('public')));
    gulp.src(server)
        .pipe(gulpsftp(generatePath('server')));
    gulp.src(modules)
        .pipe(gulpsftp(generatePath('modules')));
    gulp.src(pack)
        .pipe(gulpsftp(generatePath('')));
    gulp.src(pack)
        .pipe(gulpsftp(generatePath('')));

});

function generatePath(path){
    return {
        host: '46.101.214.219',
        port: '22',
        user: args.user,
        password: args.password,
        remotePath: '/root/GameVoting/' + path
    };
}