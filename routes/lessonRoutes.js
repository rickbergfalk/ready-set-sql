var appDb = require('../lib/appDb');
var FileStrings = require('../lib/file-strings');
var sqls = new FileStrings({directory: './sql/'}); 

var precalc = {};
exports.setPrecalc = function(pc) {
	precalc = pc;
};


// PUT /lesson
exports.create = function (req, res) {
	// create a new lesson
	var lesson = req.body;
	
	var sql = sqls.get('lesson - create new.sql');
	var params = [
			lesson.lessonTitle,
			lesson.lessonDescription,
			lesson.lessonScreens
		];
	
	appDb.query(sql, params, function(err, results, fields) {
		if (err) {
			res.send({
				success: false, 
				message: 'query failed to execute'
			});
		} else {
			res.send({
				success: true
			});
		}
		
		// refresh the lesson lists on homepage
		precalc.refreshLessonLists();
	});
	
};


// GET /lesson
exports.getAll = function(req, res) {
	// get a list of *all* lessons
	
	var sql = sqls.get('lesson - get all.sql');
	appDb.query(sql, [], function(err, results, fields) {
		if (err) {
			res.send({
				success: false, 
				message: 'query failed to execute'
			});
		} else {
			res.send({
				success: true,
				lesson: results
			});
		}
	});
};


// GET /lesson/unlisted
exports.getUnlisted = function(req, res) {
	// get unlisted lessons
	
	var sql = sqls.get('lesson - get unlisted.sql');
	appDb.query(sql, [], function(err, results, fields) {
		if (err) {
			res.send({ success: false });
		} else {
			res.send({
				success: true,
				lesson: appDb.lesson.translateResults(results)
			});
		}
	});
};


// GET /lesson/listid/:id
exports.getByListId = function(req, res) {
	// get a lesson by lessonlistid
	
	var sql = sqls.get('lesson - get by lessonlist_id.sql');
	var params = [req.params.id];
	
	appDb.query(sql, params, function(err, results, fields) {
		if (err) {
			res.send({
				success: false, 
				message: 'query failed to execute'
			});
		} else {
			res.send({
				success: true,
				lesson: appDb.lesson.translateResults(results)
			});
		}
	});
};


// GET /lesson/:id/:format?
exports.getByLessonId = function(req, res) {
	// get a lesson by lessonlistid
	
	var sql = sqls.get('lesson - get by lesson_id.sql');		
	var params = [req.params.id];
	var format = req.params.format;
	
	appDb.query(sql, params, function(err, results, fields) {
		if (err) {
			res.send(500, 'query failed to execute');
		} else {
			var lessons = appDb.lesson.translateResults(results);
			if (format === 'json') {
				res.render({
					lesson: lessons[0]
				});
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
exports.editById = function(req, res) {
	
	var sql = sqls.get('lesson - get by lesson_id.sql');		
	var id = req.params.id;
	var params = [req.params.id];
	
	if (id) {
		appDb.query(sql, params, function(err, results, fields) {
			if (err) {
				res.send(500, 'query failed to execute');
			} else {
				var lessons = appDb.lesson.translateResults(results);
				res.render('lesson-editor-2', {
					title: 'Edit some Lesson',
					lesson: lessons[0]
				});
			}
		});	
	} else {
		// this is a new lesson
		res.render('lesson-editor-2', {
			title: 'Edit some Lesson',
			lesson: {}
		});
	}	
};


// POST /lesson/:id
exports.save = function(req, res) {
	// save a lesson by ID
	var lesson = req.body;
	
	var sqlUpdateLesson = sqls.get('lesson - save lesson.sql');
	var params = [
			lesson.lessonTitle,
			lesson.lessonDescription,
			lesson.lessonScreens,
			req.params.id
		];
	appDb.query(sqlUpdateLesson, params, function(err, results) {
		if (err) console.log(err);
		if (results) console.log(results);
		if (err) {
			res.send(500, 'query failed to execute');
		} else {
			res.send({
				success: true,
				message: 'saved the lesson!'
			});
		}
		// refresh the lesson lists on homepage
		precalc.refreshLessonLists();
	});
};
