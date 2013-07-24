/*
	Target usage:
	
	// read a lesson from lesson cache
	var myLesson = lessonLists.get("the-name-of-the-file"); 

	// save a lessonList to disk
	// update lessonList cache
	lessons.save(myLesson, function (err) {
		
	});

============================================================================ */

var path = require('path');
var fs = require('fs');
var DATA_PATH = path.resolve("./data/lesson-lists");

var lessonLists = {
	cache: {},
	get: function (lessonListId) {
		return lessonLists.cache[lessonListId];
	},
	save: function (lessonList, cb) {
		var filename = DATA_PATH + "/" + lessonList.listId + ".json";
		fs.writeFile(filename, JSON.stringify(lessonList, null, 2), {encoding: 'utf8'}, function (err) {
			if (err) {
				cb(err);
			} else {
				lessonLists.cache[lessonList.listId] = lessonList;
				cb();
			}
		});
	},
	load: function() {
		lessonLists.cache = {};
		var fileList = fs.readdirSync(DATA_PATH);
		fileList.forEach(function(filename) {
			var extname = path.extname(filename);
			var filenameNoExt = filename.replace(extname, '');
			var fileJson = fs.readFileSync((DATA_PATH + "/" + filename), {encoding: 'utf8'});
			var parsedJson;
			try {
				var parsedJson = JSON.parse(fileJson);
			} 
			catch (e) {
				console.log(e);
			}
			lessonLists.cache[filenameNoExt] = parsedJson;
		});
	}
};
module.exports = lessonLists;

lessonLists.load();
