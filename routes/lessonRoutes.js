var lessons;
var lessonLists;

exports.setLessons = function (les) {
	lessons = les;
};
exports.setLessonLists = function (li) {
	lessonLists = li;
};


// GET /lesson/unlisted
// get unlisted lessons
exports.getUnlisted = function(req, res) {
	// first get listed lessonIds.
	var listedLessonIds = {};
	for (var list in lessonLists.cache) {
		var lessonList = lessonLists.cache[list];
		for (var i = 0; i < lessonList.lessonIds.length; i++) {
			var lessonId = lessonList.lessonIds[i];
			listedLessonIds[lessonId] = lessonId; // just a stupid hash to keep track of the lessonIds that are listed
		}
	}
	// now loop through the lessons cache, and for any lessonId not in the listedLessonIds, list that lesson;
	var unlistedLessons = [];
	for (var lessonId in lessons.cache) {
		if (!listedLessonIds[lessonId]) {
			unlistedLessons.push(lessons.cache[lessonId]);
		}
	}
	// send the unlistedLessons to client
	res.send({
		lesson: unlistedLessons
	});
};


// GET /lesson/listid/:id
// get a lesson by lessonlistid
exports.getByListId = function(req, res) {
	var lessonListId = req.params.id;
	var returnLessons = [];
	var lessonList = lessonLists.get(lessonListId);
	for (var i = 0; i < lessonList.lessonIds.length; i++) {
		var lessonId = lessonList.lessonIds[i];
		var lesson = lessons.get(lessonId);
		if (lesson) returnLessons.push(lesson);
	}
	res.send({
		lesson: returnLessons
	});
};


// GET /lesson/:id/:format?
// get a lesson by lessonlistid
exports.getByLessonId = function(req, res) {
	// get the lesson requested
	var lessonId = req.params.id;
	var format = req.params.format;
	var lesson = lessons.get(lessonId);
	if (lesson) {
		
		// get a lesson order
		// and then get the next lesson details
		var lessonOrder = [];
		var lessonListIdOrder = res.locals.lessonListIdOrder;
		for (var ll = 0; ll < lessonListIdOrder.length; ll++) {
			var lessonListId = lessonListIdOrder[ll];
			var lessonList = lessonLists.get(lessonListId);
			if (lessonList) {
				for (var i = 0; i < lessonList.lessonIds.length; i++) {
					var id = lessonList.lessonIds[i];
					lessonOrder.push(id);
				}
			}
		}
		var lessonIndex = lessonOrder.indexOf(lessonId);
		var nextLessonId = lessonOrder[lessonIndex + 1];
		var nextLesson = lessons.get(nextLessonId);
		if (nextLesson) {
			lesson.nextLessonId = nextLesson.lessonId;
			lesson.nextLessonTitle = nextLesson.lessonTitle;
			lesson.nextLessonListName = "TODO - get this value";
			// TODO: Get the list name of the next lesson. But since we ditched our relational model, this kind of hurts and I don't want to anymore :(
		}
		// Return the stuff
		if (format === 'json') {
			res.json(lesson);
		} else {
			res.render('layoutLessonViewer.ejs', {
				title: 'Learn some SQL',
				lesson: lesson
			});
		}
	} else {
		res.send(500, 'Lesson does not exist');
	}
};


// GET /edit/lesson/:id
// id is optional
// if id is provided, we are editing a lesson, otherwise we're making a new one
exports.editById = function(req, res) {		
	var lessonId = req.params.id;
	if (lessonId) {
		var lesson = lessons.get(lessonId);
		if (lesson) {
			res.render('lesson-editor', {
				title: 'Edit some Lesson',
				lesson: lesson
			});
		} else {
			res.send(500, 'Failed to get that lesson');
		}
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
	var lesson = {
		lessonId: req.params.id,
		lessonTitle: req.body.lessonTitle,
		lessonDescription: req.body.lessonDescription,
		lessonScreens: req.body.lessonScreens
	};
	lessons.save(lesson, function(err) {
		if (err) {
			console.log(err);
			res.send(500, 'Failed to save lesson');
		} else {
			res.send({
				success: true,
				message: 'saved the lesson!'
			});
		}
	});
};
