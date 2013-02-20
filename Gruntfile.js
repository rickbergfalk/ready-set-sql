module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'), // Loads package.json into grunt so it has those variables available if needed
		concat: {
			options: {
				separator: ';'
			},
			// https://github.com/gruntjs/grunt/wiki/Configuring-tasks 
			dist: {
				files: {
					'public/javascripts/everyone.js': [
						'public/javascripts/vendor/jquery-1.7.1.min.js',
						'public/javascripts/vendor/bootstrap.min.js',
						'public/javascripts/vendor/underscore-min.js',
						'public/javascripts/vendor/codemirror-2.24-sql-runmode.js',
						'public/javascripts/models/lesson.js',
						'public/javascripts/views/lesson-view.js'
					],
					'public/javascripts/editor-addons.js': [
						// TODO - Add jQuery UI here
						'public/javascripts/vendor/marked.js', 
						'public/javascripts/vendor/uuid.js',
						'public/javascripts/views/lesson-list-editor.js',
						'public/javascripts/views/lesson-editor.js'
					]
				}
			}
			//dist: {
			//	src: ['public/javascripts/**/*.js'],
			//	dest: 'dist/<%= pkg.name %>.js'
			//}
			
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			dist: {
				files: {
					//'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
					'public/javascripts/everyone.min.js': ['public/javascripts/everyone.js'],
					'public/javascripts/editor-addons.min.js': ['public/javascripts/editor-addons.js']
				}
			}
		}
	});

	// Load the plugin that provides the concat and uglify task.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	// Default task(s).
	// when running "grunt" or "grunt default" it will run this task
	// specify others if you want I guess...
	// You could specify an uglify task only and run it as "grunt uglify"
	grunt.registerTask('default', ['concat', 'uglify']);

};