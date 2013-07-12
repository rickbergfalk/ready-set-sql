/* =========================================================================
	Cool SqlRunner helper
	Runs SQL queries stored in .sql files. 
	Has a hook for a mapping/tranformation function to translate the pg result.rows object into something more helpful.
============================================================================ */ 

var SqlRunner = require('../lib/sql-runner');
var sqlRunner = new SqlRunner({
						sqlFolderPath: 		'./sql/', 
						connectionString: 	process.env.DATABASE_URL,
						encoding: 			'utf8', // this is the default, and is not necessary
						cache: 				true // TODO: Support not caching sql file contents. (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'Production') 
					});

					
/* =========================================================================
	Lesson
	Object and Map Function(s)
	
	Instead of creating some sort of API, I'm just going to 
	wing it from here on out, building out the various pieces as necessary.
	Building out a Lesson API* didn't feel right - it felt like a lot of 
	cruft I wasn't going to use for this project. 
	Perhaps for bigger projects it'll make more sense.
	
	The main thing here though is to have a "standard" Lesson object, 
	so we can standardize the property names a bit.
	
	* By API, I mean a more formal and consistent method of persisting 
	and getting Lessons from the database (data access layer?). Initially I 
	was thinking about building stuff like the following, 
	but decided against it because it felt like an unnecessary layer:
	
		- lessons.getById(id, function(err, lesson) {})
		- lessons.create(lesson, function(err) {})
		- lessons.getByListId(listId, function(err, lessons) {})
		- lessons.updateLesson(lesson, function(err) {})
		
	These things would be more testable however...
============================================================================ */ 

var Lesson = function (options) {
	this.lessonId			= options.lessonId;
	this.lessonTitle 		= options.lessonTitle 		|| "";
	this.lessonDescription 	= options.lessonDescription || "";
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


// PUT /lesson
// create a new lesson
exports.create = function (req, res) {
	var lesson = req.body;
	var params = [
			lesson.lessonTitle,
			lesson.lessonDescription,
			lesson.lessonScreens
		];
	sqlRunner.runSqlFromFile('lesson - create new.sql', params, null, function(err, lessons) {
		if (err) {
			res.send(500, 'Failed to create new lesson');
		} else {
			res.send({
				success: true
			});
		}
	});
};


// GET /lesson
// get a list of *all* lessons
// I don't think this is actually used anywhere... (would be on home screen, but it has its own thing going on)
exports.getAll = function(req, res) {
	sqlRunner.runSqlFromFile('lesson - get all.sql', [], mapToLessons, function(err, lessons) {
		if (err) {
			res.send(500, 'Failed to get all lessons');
		} else {
			res.send({
				lesson: lessons
			});
		}
	});
};


// GET /lesson/unlisted
// get unlisted lessons
exports.getUnlisted = function(req, res) {
	sqlRunner.runSqlFromFile('lesson - get unlisted.sql', [], mapToLessons, function(err, lessons) {
		if (err) {
			res.send(500, 'Failed to get unlisted lessons');
		} else {
			res.send({
				success: true,
				lesson: lessons
			});
		}
	});
};


// GET /lesson/listid/:id
// get a lesson by lessonlistid
exports.getByListId = function(req, res) {
	var params = [req.params.id];
	sqlRunner.runSqlFromFile('lesson - get by lessonlist_id.sql', params, mapToLessons, function(err, lessons) {
		if (err) {
			res.send(500, 'Failed to get lessons for that lesson list');
		} else {
			res.send({
				success: true,
				lesson: lessons
			});
		}
	})
};


// GET /lesson/:id/:format?
// get a lesson by lessonlistid
exports.getByLessonId = function(req, res) {
	var params = [req.params.id];
	var format = req.params.format;
	sqlRunner.runSqlFromFile('lesson - get by lesson_id.sql', params, mapToLessons, function(err, lessons) {
		if (err) {
			res.send(500, 'Failed to get that lesson');
		} else {
			if (format === 'json') {
				res.json(lessons[0]);
			} else {
				res.render('layoutLessonViewer.ejs', {
					title: 'Learn some SQL',
					lesson: lessons[0]
				});
			}
		}
	});
};


// GET /edit/lesson/:id
// id is optional
// if id is provided, we are editing a lesson, otherwise we're making a new one
exports.editById = function(req, res) {		
	var id = req.params.id;
	var params = [id];
	if (id) {
		sqlRunner.runSqlFromFile('lesson - get by lesson_id.sql', params, mapToLessons, function(err, lessons) {
			if (err) {
				res.send(500, 'Failed to get that lesson');
			} else {
				res.render('lesson-editor', {
					title: 'Edit some Lesson',
					lesson: lessons[0]
				});
			}
		});
	} else {
		res.render('lesson-editor', {
			title: 'Create New Lesson',
			lesson: {}
		});
	}	
};


// POST /lesson/:id
// save a lesson by ID
// After updating a lesson we must refresh the lesson list on the homepage.
exports.save = function(req, res) {
	var lesson = req.body;
	var params = [
			lesson.lessonTitle,
			lesson.lessonDescription,
			lesson.lessonScreens,
			req.params.id
		];
	sqlRunner.runSqlFromFile('lesson - save lesson.sql', params, null, function(err, results) {
		if (err) console.log(err);
		if (results) console.log(results);
		if (err) {
			res.send(500, 'Failed to save lesson');
		} else {
			res.send({
				success: true,
				message: 'saved the lesson!'
			});
		}
	});
};
