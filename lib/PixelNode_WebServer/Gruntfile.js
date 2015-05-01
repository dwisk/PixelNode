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
      input: {
        options: {
          paths: ["libs/**/"]
        },
        files: {
          "public/input.css": "src/input/styles.less"
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

      input: {
        src: [
          'src/input/**/*.js'
        ],
        dest: 'public/input.js',
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
    },

    // Watch
    watch: {
        sass: {
          // We watch and compile sass files as normal but don't live reload here
          files: ['src/*/*.js','src/*/*.less'],
          tasks: ['default'],
        },
        livereload: {
          // Here we watch the files the sass task will compile to
          // These files are sent to the live reload server after sass compiles to them
          options: { livereload: true },
          files: [
            'public/**/*',
            'src/*/*.jade'
          ]
        }
      }
  });

  // we're loading npm tasks from root node_modules
  // TODO: Change when moving the webserver into it's own npm package
  var cwd = process.cwd();
  process.chdir("../../");
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
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