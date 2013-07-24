/*
	Target usage:
	
	// read a lesson from lesson cache
	var myLesson = lessons.get("the-name-of-the-file"); 

	// save a lesson to disk
	// update lesson cache
	lessons.save(myLesson, function (err) {
		
	});

============================================================================ */

var path = require('path');
var fs = require('fs');
var LESSON_PATH = path.resolve("./data/lessons");

var lessons = {
	cache: {},
	get: function (lessonId) {
		return lessons.cache[lessonId];
	},
	save: function (lesson, cb) {
		var filename = LESSON_PATH + "/" + lesson.lessonId + ".json";
		fs.writeFile(filename, JSON.stringify(lesson, null, 2), {encoding: 'utf8'}, function (err) {
			if (err) {
				cb(err);
			} else {
				lessons.cache[lesson.lessonId] = lesson;
				cb();
			}
		});
	},
	loadLessons: function() {
		lessons.cache = {};
		var fileList = fs.readdirSync(LESSON_PATH);
		fileList.forEach(function(filename) {
			var extname = path.extname(filename);
			var filenameNoExt = filename.replace(extname, '');
			var fileJson = fs.readFileSync((LESSON_PATH + "/" + filename), {encoding: 'utf8'});
			var lesson;
			try {
				var lesson = JSON.parse(fileJson);
			} 
			catch (e) {
				console.log(e);
			}
			lessons.cache[filenameNoExt] = lesson;
		});
	}
};
module.exports = lessons;

lessons.loadLessons();



var Lesson = function (options) {
	this.lessonId			= options.lessonId;
	this.lessonTitle 		= options.lessonTitle 		|| 'New Lesson';
	this.lessonDescription 	= options.lessonDescription || 'This is a new lesson';
	this.lessonScreens 		= options.lessonScreens 	|| []; 
	this.lessonListId 		= options.lessonListId;
	this.lessonSeq 			= options.lessonSeq;
	this.nextLessonId 		= options.nextLessonId;
	this.nextLessonTitle 	= options.nextLessonTitle;
	this.nextLessonListName = options.nextLessonListName;
};

