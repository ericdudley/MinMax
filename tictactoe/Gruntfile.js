module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
        js: {
            files: {'tictactoe_bundled.js': 'src/*.js' }
        }
    },
    uglify: {
      bundle: {
        files: { '<%= pkg.name %>.min.js':'src/bundled.js' },
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['concat:js']);

};
