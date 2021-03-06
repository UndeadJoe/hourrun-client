'use strict';

module.exports = function(grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin',
        ngtemplates: 'grunt-angular-templates',
        cdnify: 'grunt-google-cdn'
    });

    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: 'www',
        config: grunt.option("config") || 'local'
    };

    // 1. Всё конфигурирование тут
    //noinspection JSAnnotator
    grunt.initConfig({

        conf: appConfig,

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: '<%= conf.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= conf.app %>/images',
                javascriptsDir: '<%= conf.app %>/scripts',
                fontsDir: '<%= conf.app %>/styles/fonts',
                importPath: '<%= conf.app %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n',
                noLineComments: true
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= conf.dist %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true,
                    force: true
                }
            }
        },

        // Automatically inject Bower components into the app
        'bower-install': {
            app: {
                html: '<%= conf.app %>/index.html',
                ignorePath: '<%= conf.app %>/'
            }
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 30 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= conf.dist %>/*',
                        '!<%= conf.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= conf.app %>/index.html'],
                ignorePath: /\.\.\//
            },
            test: {
                devDependencies: true,
                src: '<%= karma.unit.configFile %>',
                ignorePath: /\.\.\//,
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        },

        useminPrepare: {
            html: '<%= conf.app %>/index.html',
            options: {
                dest: '<%= conf.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= conf.dist %>/{,*/}*.html'],
            css: ['<%= conf.dist %>/styles/{,*/}*.css'],
            js: ['<%= conf.dist %>/scripts/{,*/}*.js'],
            options: {
                assetsDirs: [
                    '<%= conf.dist %>',
                    '<%= conf.dist %>/images',
                    '<%= conf.dist %>/styles'
                ],
                patterns: {
                    js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= conf.app %>',
                    dest: '<%= conf.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '*.html',
                        'views/{,*/}*.html',
                        //'images/{,*/}*.{webp}',
                        'styles/fonts/{,*/}*.*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= conf.dist %>/images',
                    src: ['generated/*']
                }, {
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    dest: '<%= conf.dist %>/scripts',
                    src: ['*.js']
                }, {
                    expand: true,
                    cwd: '<%= conf.app %>/bower_components/bootstrap/fonts',
                    dest: '<%= conf.dist %>/fonts',
                    src: ['*']
                }, {
                    expand: true,
                    cwd: '<%= conf.app %>/bower_components/font-awesome/fonts',
                    dest: '<%= conf.dist %>/fonts',
                    src: ['*']
                }]
            }
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        }

    });

    // Меняем текущий конфиг на выбранный
    grunt.registerTask('setConfig', function(){
        var config = grunt.option('config') || 'local',
            path = grunt.config('conf.app') + '/scripts/constants.js',
            fl = grunt.file.read(path, {encoding: 'utf8'});

        fl = fl.replace(/(config\:)([\d\w\'\" ]+)(,*)$/igm, "$1 '" + config + "'$3");
        grunt.file.write(path, fl, {encoding: 'utf8'});
    });

    grunt.registerTask('build', [
        'clean:dist',
        'setConfig',
        'wiredep',
        'useminPrepare',
        'compass:dist',
        'autoprefixer',
        'concat',
        'copy:dist',
        'cssmin',
        'usemin'
    ]);

    grunt.registerTask('default', [
        //'newer:jshint',
        //'newer:jscs',
        //'test',
        'build'
    ]);


};