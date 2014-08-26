module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      build: {
        options: {
          style: "expanded"
        },
        files: [{
          'build/styles.css': 'public/styles.scss',
        }]
      }
    },

    env: {
      dev: {
        ENV: 'DEVELOPMENT'
      },

      prod: {
        ENV: 'PRODUCTION'
      }
    },

    watch: {
      scss: {
        files: ['public/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true,
        }
      },
      javascript: {
        files: 'public/*.js',
        tasks: ['env:dev', 'preprocess'],
        options: {
          livereload: true,
        }
      },

      html: {
        files: 'public/embed.html',
        tasks: ['copy:html'],
        options: {
          livereload: true,
        }
      },

      index: {
        files: 'public/index.html',
        tasks: ['copy:index'],
        options: {
          livereload: true,
        }
      },
    },

    copy: {
      html: {
        src: 'public/embed.html',
        dest: 'build/embed.html'
      },

      index: {
        src: 'public/index.html',
        dest: 'build/index.html'
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: { // Dictionary of files
          'build/embed.html': 'build/embed.html'
        }
      }
    },

    inline: {
      dist: {
        options: {
          tag: '',
          cssmin: true,
          uglify: true
        },
        src: ['build/embed.html'],
        dest: ['build/']
      }
    },

    clean: {
      release: ["build/script.js", "build/styles.css"]
    },

    preprocess: {
      js: {
        src: 'public/script.js',
        dest: 'build/script.js'
      },
    },
  });

  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['env:prod', 'copy', 'preprocess', 'sass', 'inline', 'htmlmin']);
  grunt.registerTask('dev', ['env:dev', 'copy', 'preprocess', 'sass', 'watch']);

};