/*
 * assemble-middleware-kssnode
 */
 
'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        curly: true,
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
      all: ['Gruntfile.js', 'index.js']
    },
    assemble: {
      docs: {
        options: {
        	plugins: ['./index.js'],
        	layout: ['test/templates/layouts/default.hbs'],
        	partials: ['test/templates/partials/**/*.hbs'],
          kssnode: {
            page: 'test/templates/pages/styleguide.hbs',
            dest: 'test/dist',
            src: 'test/css'
          }
        },
        files: {
          'test/dist/index.html': ['test/templates/pages/index.hbs']
        }
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
