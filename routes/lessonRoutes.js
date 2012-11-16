var appDb = require('../lib/appDb');


var precalc = {};
exports.setPrecalc = function(pc) {
	precalc = pc;
};


// PUT /lesson
exports.create = function (req, res) {
	// create a new lesson
	var lesson = req.body;
	
	var sql = "INSERT INTO lesson (title, description, created, updated, screens) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $3)";
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
	
	var sql = "SELECT ll.name AS listName, ll.seq AS listSeq, l.lesson_id AS lessonId, l.title AS lessonTitle, l.description AS lessonDescription, l.seq AS lessonSeq FROM lesson l JOIN lessonlist ll ON l.lessonlist_id = ll.lessonlist_id";
	
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
	var sql = "SELECT l.lesson_id, l.title, l.description FROM lesson l LEFT JOIN lessonlist ll ON l.lessonlist_id = ll.lessonlist_id WHERE ll.lessonlist_id IS NULL";
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
	
	var sql = "SELECT l.lessonlist_id, l.seq, l.lesson_id, l.title, l.description FROM lesson l WHERE l.lessonlist_id = $1 ORDER BY l.seq";
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
	
	var sql = "SELECT lesson_id, title, description, screens FROM lesson WHERE lesson_id = $1";
	var params = [req.params.id];
	var format = req.params.format;
	
	appDb.query(sql, params, function(err, results, fields) {
		if (err) {
			res.send({
				success: false, 
				message: 'query failed to execute'
			});
		} else {
			var lessons = appDb.lesson.translateResults(results);
			if (format === 'json') {
				res.render({
					lesson: lessons[0]
				});
			} else {
				res.render('layoutLessonViewer.ejs', {
					title: 'bam',
					lesson: lessons[0]
				});
			}
		}
	});
};


// GET /edit/lesson/:id
exports.editById = function(req, res) {
	
	var sql = "SELECT lesson_id, title, description, screens FROM lesson WHERE lesson_id = $1";
	var id = req.params.id;
	var params = [req.params.id];
	
	if (id) {
		appDb.query(sql, params, function(err, results, fields) {
			if (err) {
				res.send({
					success: false, 
					message: 'query failed to execute'
				});
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
	
	var sqlUpdateLesson = "UPDATE lesson SET title = $1, description = $2, updated = CURRENT_TIMESTAMP, screens = $3 WHERE lesson_id = $4";	
	var params = [
			lesson.lessonTitle,
			lesson.lessonDescription,
			lesson.lessonScreens,
			req.params.id
		]
	appDb.query(sqlUpdateLesson, params, function(err, results) {
		if (err) console.log(err);
		if (results) console.log(results);
		if (err) {
			res.send({
				success: false, 
				message: 'query failed to execute'
			});
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
