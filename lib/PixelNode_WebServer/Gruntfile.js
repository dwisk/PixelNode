module.exports = function(grunt) {

  // config
  grunt.initConfig({
    // Styles
    less: {
      layout: {
        options: {
          paths: ["libs/**/"]
        },
        files: {
          "public/layout.css": "src/layout/styles.less"
        }
      },
      simulator: {
        options: {
          paths: ["libs/**/"]
        },
        files: {
          "public/simulator.css": "src/simulator/styles.less"
        }
      }
    },

    // Scripts
    concat: {
      libs: {
        src: [
          'build/libs/angular/*.js',
          'build/libs/angular-socket-io/*.js'
        ],
        dest: 'public/libs.min.js',
      },

      simulator: {
        src: [
          'src/simulator/**/*.js'
        ],
        dest: 'public/simulator.js',
      }
    },

    // Bower
    bower: {
        dev: {
            base: 'libs', /* the path to the bower_components directory */
            dest: 'build/libs',
            options: {
                checkExistence: true,
                debugging: true,
                paths: {
                    bowerDirectory: 'libs',
                    bowerrc: '.bowerrc',
                    bowerJson: 'bower.json'
                }
            }
        }
    },

    // Clean
    clean: {
      bower: ['build']
    }
  });

  // we're loading npm tasks from root node_modules
  // TODO: Change when moving the webserver into it's own npm package
  var cwd = process.cwd();
  process.chdir("../../");
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('main-bower-files');
  process.chdir(cwd);

  // register tasks
  grunt.registerTask('default', [
    'less',
    'bower',
    'concat',
    'clean:bower'
  ]);

};