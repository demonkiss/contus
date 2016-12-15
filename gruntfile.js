module.exports = function(grunt){

    grunt.initConfig({
        watch: {
            jade: {
                files: ['views/**'],
                // tasks: ['jade'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['public/js/**','models/**/*.js','schemas/**/*.js'],
                //tasks: ['jshint'],
                options: {
                    livereload: true
                }
            }
        },
        nodemon: {
          dev: {
            //script: 'index.js',
            options: {
              file: 'app.js',
              args: [],
              env: {
                PORT: '3000'
              },
              cwd: __dirname,
              ignore: ['node_modules/**','.DS_Store','README.md'],
              ext: 'html,jade,js,css',
              watch: ['./'],
              debug: true,
              delay: 1000,
              legacyWatch: true
            }
          }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');//监听js browser
    grunt.loadNpmTasks('grunt-nodemon');//监听app.js
    grunt.loadNpmTasks('grunt-concurrent');//sass less  满任务编译

    grunt.option('force',true);//语法忽略
    grunt.registerTask('default',['concurrent']);
};
