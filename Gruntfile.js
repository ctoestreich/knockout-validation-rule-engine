'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        yeoman: {
            app: 'app',
            dist: 'dist'
        },
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        clean: {
            files: ['dist']
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['bower_components/requirejs/require.js', '<%= concat.dist.dest %>'],
                dest: 'dist/js/require.js'
            }
        },
        htmlmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: ['*.html', 'views/**/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/js/require.min.js'
            },
            ruleEngine: {
                src: 'app/js/knockout-rule-engine.js',
                dest: 'build/knockout-rule-engine.min.js'
            }
        },
        qunit: {
            all: {
                options: {
                    timeout: 10000,
                    urls: [
                        'http://localhost:8002/test/index.html',
                        'http://localhost:8002/test/inline.html'
                    ]
                }
            }
        },
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            app: {
                options: {
                    jshintrc: 'app/js/.jshintrc'
                },
                src: ['app/**/knockout-rule-engine.js', 'app/**/validation-addons.js', 'app/**/rules.js', 'app/**/filters.js']
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/**/*.js']
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: '<%= jshint.src.src %>',
                tasks: ['jshint:src', 'qunit']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'qunit']
            }
        },
        requirejs: {
            compile: {
                options: {
                    name: 'config',
                    mainConfigFile: 'app/js/config.js',
                    out: '<%= concat.dist.dest %>',
                    optimize: 'none'
                }
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            'js/jquery.min.js',
                            'js/bootstrap.min.js',
                            'css/*.css'
                        ]
                    },
                    {
                        expand: true,
                        flatten: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: 'build',
                        src: [
                            'js/knockout-rule-engine.js'
                        ]
                    }
                ]
            }
        },
        connect: {
            development: {
                options: {
                    keepalive: true,
                    port: 8001
                }
            },

            test: {
                options: {
                    port: 8002
                }
            },
            production: {
                options: {
                    keepalive: true,
                    port: 8000,
                    middleware: function (connect, options) {
                        return [
                            // rewrite requirejs to the compiled version
                            function (req, res, next) {
                                if (req.url === '/app/index.html') {
                                    req.url = '/dist/index.html';
                                }
                                next();
                            },
                            connect.static(options.base)
                        ];
                    }
                }
            }
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Default task.
//    grunt.registerTask('default', ['jshint', 'qunit', 'clean', 'htmlmin', 'requirejs', 'concat', 'uglify']);
    grunt.registerTask('default', ['jshint', 'connect:test', 'qunit', 'clean', 'htmlmin', 'requirejs', 'concat', 'copy', 'uglify', 'uglify:ruleEngine']);
    grunt.registerTask('preview', ['connect:development']);
    grunt.registerTask('preview-live', ['default', 'connect:production']);

};
