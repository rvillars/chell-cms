'use strict';

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-ngmin');

    /**
     * Load in our build configuration file.
     */
    var userConfig = require('./build.config.js');

    var taskConfig = {
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['src/**/*.js'],
            options: {
                bitwise: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                evil: true,
                forin: true,
                globalstrict: true,
                immed: true,
                latedef: false,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                trailing: true,
                undef: true,
                unused: true,

                camelcase: true,
                indent: 4,
                quotmark: 'single',

                '-W055': true,
                '-W098': true,
                '-W116': true,

                globals: {
                    angular: false,
                    module: false,
                    $: false,
                    window: false,
                    CKEDITOR: false,
                    _: false,
                    console: false,
                    confirm: false
                }
            }
        },
        ngmin: {
            code: {
                files: [
                    {
                        cwd: 'src',
                        src: [ '<%= module_files %>' ],
                        dest: 'build',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            adapters: {
                files: [
                    {
                        cwd: 'src',
                        src: [ '<%= module_adapters %>' ],
                        dest: 'adapters',
                        expand: true,
                        flatten: true
                    }
                ]
            }
        },
        concat: {
            options: {
                separator: ';',
                banner: "'use strict';\n",
                process: function (src, filepath) {
                    return '// Source: ' + filepath + '\n' +
                        src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                }
            },
            build: {
                src: (function () {
                    var cwd = 'build/';
                    var arr = userConfig.module_files;
                    arr = arr.map(function (path) {
                        return cwd + path;
                    });
                    arr.push('build/templates.js');
                    return arr;
                }()),
                dest: '<%= pkg.name %>.js'
            }
        },
        uglify: {
            src: {
                files: {
                    '<%= pkg.name %>.min.js': ['<%= pkg.name %>.js']
                }
            }
        },
        copy: {
            assets: {
                files: [
                    {
                        src: [ '**/*' ],
                        dest: 'assets/',
                        cwd: 'src/assets',
                        expand: true
                    }
                ]
            },
            styles: {
                files: [
                    {
                        src: [ '**/*' ],
                        dest: 'styles/',
                        cwd: 'src/less',
                        expand: true
                    }
                ]
            }
        },
        less: {
            build: {
                files: {
                    'styles/<%= pkg.name %>.css': 'src/less/<%= pkg.name %>.less'
                }
            }
        },
        html2js: {
            build: {
                options: {
                    base: 'src',
                    module: 'templates-<%= pkg.name %>'
                },
                src: [ 'src/templates/**/*.tpl.html' ],
                dest: 'build/templates.js'
            }
        },
        watch: {
            build: {
                files: ['src/**/*'],
                tasks: ['build']
            }
        }
    };

    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

    grunt.registerTask('build', ['jshint', 'ngmin', 'html2js:build', 'concat', 'uglify:src', 'copy', 'less:build']);
    grunt.registerTask('default', ['watch:hint']);

    grunt.registerTask('example', 'Process example .html template', function () {
        grunt.file.copy('src/examples/example1.html', 'examples/example1.html', {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: userConfig.module_dependencies
                    }
                });
            }
        });
        grunt.file.copy('src/examples/example1.js', 'examples/example1.js');
    });

};