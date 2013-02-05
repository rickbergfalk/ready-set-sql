var SqlRunner = require('../lib/sql-runner');
var sqlRunner = new SqlRunner({
						sqlFolderPath: 		'./sql/', 
						connectionString: 	process.env.DATABASE_URL,
						encoding: 			'utf8', // this is the default, and is not necessary
						cache: 				true // TODO: Support not caching sql file contents. (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'Production') 
					});

/* ==============================================
	Lesson
================================================= */ 

var Lesson = function (options) {
	this.lessonId			= options.lessonId;
	this.lessonTitle 		= options.lessonTitle 		|| 'New Lesson';
	this.lessonDescription 	= options.lessonDescription || 'This is a new lesson yo';
	this.lessonScreens 		= options.lessonScreens 	|| "[]"; 
	this.lessonListId 		= options.lessonListId;
	this.lessonSeq 			= options.lessonSeq;
	this.nextLessonId 		= options.nextLessonId;
	this.nextLessonTitle 	= options.nextLessonTitle;
	this.nextLessonListName = options.nextLessonListName;
};

var mapToLessons = function (results) {
	var lessons = [];
	results.forEach(function(record) {
		var lesson = {
			lessonId 			: record.lesson_id,
			lessonTitle 		: record.title,
			lessonDescription 	: record.description,
			lessonScreens 		: JSON.parse(record.screens || "[]"),
			lessonListId		: record.lessonlist_id,
			lessonSeq			: record.seq,
			nextLessonId 		: record.nextlesson_id,
			nextLessonTitle 	: record.nextlesson_title,
			nextLessonListName	: record.nextlesson_listname
		};
		lessons.push(new Lesson(lesson));
	});
	return lessons
}


var lessonsDb = {
	create: function (lesson, callback) {
		var params = [
				lesson.title,
				lesson.description,
				lesson.screens
			];
		sqlRunner.runSql('lesson - create some thing.sql', params, mapToLessons, function (err, lessons) {
			// got lessons here
		});
	},
	getById: function (id, callback) {
		
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
