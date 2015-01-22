/*
 * assemble-middleware-kssnode
 */
 
'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        curly: false,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        loopfunc: true
      },
      all: ['Gruntfile.js', 'index.js', './lib/**/.js']
    },
    assemble: {
      options: {
        plugins: ['./index.js'],
        layout: ['test/templates/layouts/default.hbs'],
        partials: ['test/templates/partials/**/*.hbs']
      },
      docs: {
        options: {
          kssnode: {
            page: 'test/templates/pages/styleguide.hbs', // Handlebars template
            dest: 'test/dist', // Target directory
            src: 'test/css', // Source directory with CSS files
            mask: '*.css' // Optional filetype(s) to parse. Default to '*.css'
          }
        },
        files: [{
          expand: true,
          cwd: 'test/templates/pages',
          src: ['**/*.hbs'],
          dest: 'test/dist'
        }]
      }
    },
    // Before generating new files, remove any files from previous build.
    clean: {
      actual: ['test/dist'],
    },

    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 3000,
          base: 'test/dist',
          keepalive: true,
          open: true
        }
      }
    }
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['jshint', 'clean', 'assemble', 'connect']);
};
