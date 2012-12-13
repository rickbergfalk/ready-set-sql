var appDb = require('../lib/appDb');
var FileStrings = require('../lib/file-strings');
var sqls = new FileStrings({directory: './sql/'}); 

/* ==============================================
	Lesson
================================================= */ 

var Lesson = function (options) {
	this.id 			= options.lessonId;
	this.title 			= options.lessonTitle 		|| 'New Lesson';
	this.description 	= options.lessonDescription || 'This is a new lesson yo';
	this.screens 		= options.lessonScreens 	|| "[]"; 
	// not part of the table, but relevant & may be mapped in from query
	this.lessonSeq;
	this.listSeq;
	this.listName;
	this.listId;
};


var lessonsDb = {
	// receives results as is from database
	// creates an array of lesson objects
	mapResults: function(results) {
		// loop through results, and map to an array of Lesson objects
		// add in the handy fields, that aren't necessarily part of the Lesson object.
		return new Lesson();
	},
	create: function (lesson, callback) {
		var sql = sqls.get('lesson - create some thing.sql');
		var params = [
				lesson.title,
				lesson.description,
				lesson.screens
			];
		runquery(sql, params, function (err, results) {
			callback(err);
		});	
	},
	getById: function (id, callback) {
		runquery(sqls.get('lesson - get by id.sql');, [id], function (err, results) {
			resultLessons = lessonsDb.mapResults(results);
			callback(err, resultLessons);
		});
	},
	getNextLesson: function (id, callback) {
		// actually, the next lesson crap can stay in the get by id part.
		// it'll still be an ugly query here - do we want that up front or later?
	},
	save: function (lesson, callback) {
		runquery(sqls.get('lesson - save.sql'), [], function (err, results) {
			callback(err);
		});
	},
	getAllWithLists: function (callback) {
		runquery(sqls.get('lesson - get all.sql'), [], function (err, results) {
			callback(err, lessonsDb.mapResults(results));
		});
	}
}



// new lesson
var newLesson = new Lesson(options);
lessonsDb.create(newLesson, function(err) {
	console.log('created')
});

// update lesson
var updateLesson = new Lesson(options);
lessonsDb.save(lesson, function(err) {
	console.log('saved');
});

// get a lesson
lessonsDb.getById(id, function (err, lessons) {
	var lesson = lessons[0];
});

// get a big lesson list
lessonsDb.getAllWithLists(function (err, lessons) {
	return lessons
});



/* ==============================================
	List
================================================= */ 

var List = function () {
	this.id 			= 1;
	this.seq 			= 1;
	this.name 			= '';
	this.description 	= '';
	this.lessonIds 		= [1, 2, 3]; // seq can be derived
};

var listDb = {
	mapResults: function () {
		
	},
	create: function () {
		
	},
	updateList: function () {
		
	},
	updateListLessons: function () {
		
	},
	update: function () {
		// this could be the combined updateList and updateListLessons
	}
	getById: function (id, callback) {
		
	}
};
