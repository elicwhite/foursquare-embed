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
        tasks: ['copy:javascript'],
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

      demo: {
        files: 'public/demo.html',
        tasks: ['copy:demo'],
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

      demo: {
        src: 'public/demo.html',
        dest: 'build/demo.html'
      },

      javascript: {
        src: 'public/script.js',
        dest: 'build/script.js'
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
  });

  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['copy', 'sass', 'inline', 'htmlmin']);
  grunt.registerTask('dev', ['copy', 'sass', 'watch']);

};