var lessons;
var lessonLists;

exports.setLessons = function (les) {
	lessons = les;
};
exports.setLessonLists = function (li) {
	lessonLists = li;
};


// GET /lessonlist
// get a list of *all* lessonlists
exports.getAll = function(req, res) {
	var results = [];
	var lessonListIdOrder = res.locals.lessonListIdOrder;
	for (var i = 0; i < lessonListIdOrder.length; i++) {
		var lessonListId = lessonListIdOrder[i];
		var lessonList = lessonLists.get(lessonListId);
		if (lessonList) results.push(lessonList);
	}
	console.log(results);
	res.send({
		lessonlists: results
	});
};

// POST /lessonlist/id/:id
// save lessonlist by lessonlistId
exports.save = function(req, res) {
	var lessonListId = req.params.id;
	var lessonIds = req.body.lessonIds;
	console.log(lessonListId);
	console.log(lessonIds);
	var lessonList = lessonLists.get(lessonListId);
	if (lessonList) {
		lessonList.lessonIds = lessonIds;
		if (lessonList.lessons) delete lessonList['lessons'];
		lessonLists.save(lessonList, function (err) {
			if (err) res.send(500, "failure saving that lessonlist");
			else res.send({ success: true });
		});
	} else {
		res.send(500, 'Couldnt find lessonlist ' + lessonListId);
	}
};