/*global module:false*/
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.
    clean: ['dist/'],
    esformatter: {
      src: '*.js'
    },
    uglify: {
      dist: {
        src: 'jquery.imgcrop.js',
        dest: 'dist/jquery.imgcrop.min.js'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-esformatter');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task.
  grunt.registerTask('default', ['clean', 'esformatter', 'uglify']);

};
