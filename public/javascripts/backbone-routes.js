var AppRouter = Backbone.Router.extend({
	
	routes: {
		"/lesson" 							: "editor",
		"/lesson/" 							: "editor",
		"/lesson/:lessonId" 				: "editor",
		"/view/lesson/:lessonId" 			: "viewLesson",
		"/" 								: "lessonListEditor",
		""									: "lessonListEditor",
		"*actions" 							: "defaultRoute" // Backbone will try match the route above first
    },
	
	viewLesson: function (lessonId) {
		
		$.ajax({
			type: 'get',
			url: '/lesson/id/' + lessonId,
			success: function(data, text, jqXHR) {
			
				var myLesson = new Lesson({
										lesson: data.lesson[0],
										currentScreenIndex: 0
									});
				
				var lessonView = new LessonView({ model: myLesson });
			},
			dataType: 'json'
		});		
	},
	
	editor: function (lessonId) {
		if (lessonId) {
			$.ajax({
				type: 'get',
				url: '/lesson/id/' + lessonId,
				success: function(data, text, jqXHR) {
					// load lesson-level details
					var lessonEditor = new LessonEditor("main-body", data.lesson[0]);
				},
				dataType: 'json'
			});
		} else {
			var lessonEditor = new LessonEditor("main-body", {});
		}
			
		
	},
	
	lessonListEditor: function () {
		var listEditor = new LessonListEditorView();
	},
	
	defaultRoute: function (actions) {
		// This is a client side 404.
		// Just forward to homepage for now
		app_router.navigate("/", true);
	}
});


// Initiate the router
var app_router = new AppRouter;

// Start Backbone history a neccesary step for bookmarkable URL's
Backbone.history.start();



