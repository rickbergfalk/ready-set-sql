var app = {

	session: {
		isSignedIn: 	false,
		email: 			'',
		user_id: 		'',
		userProgress: 	[]
	},
	
	initialize: function () {
				
		// get session info. User might already be logged in.
		$.ajax({
			type: 'get',
			url: '/api/getSession.php',
			success: function(data) {
				// data.user_id, data.email
				if (data.user_id) {
					app.session.isSignedIn = true;
					app.session.user_id = data.user_id;
					app.session.email = data.email;
					
					// render the navigation view / user progress to be safe
					app.renderSession();
				}
			},
			dataType: 'json'
		});
		
	},
	
	renderSession: function () {
		// this is a collection of things to do 
		// specific to whether a user is logged in or not.
		if (app.session.isSignedIn) {
			$('.show-if-signed-in').show();
			$('.hide-if-signed-in').hide();
			app.renderUserProgress(); // TODO - only do this for a certain view?
		} else {
			$('.show-if-signed-in').hide();
			$('.hide-if-signed-in').show();
		}
	},
	
	renderUserProgress: function () {
		
		if (app.session.isSignedIn) {
			$.ajax({
				type: 'get',
				url: '/api/getUserProgress.php',
				success: function(data) {
					/*
						Data.results contains [] of:
							lesson_id, screen_index, percentage
					*/
					var results = data.results;
					app.session.userProgress = data.results;
					for (var i = 0; i < results.length; i++) {
						
						var result = results[i];
						if (result.percentage > 1) {
							result.percentage = 1;
						}
						var percentComplete = (result.percentage * 100) + '%';
						
						var $progressBarContainer = $('#progress-bar-lesson-id-' + result.lesson_id).empty();
						var $lessonCardSubMenu = $('#sub-menu-lesson-id-' + result.lesson_id).empty();
						
						// the DOM that these elements get appended to are in index.ejs
						$('<span class="user-progress">').width(percentComplete).appendTo($progressBarContainer);
						
					}
				},
				dataType: 'json'
			});
		}
	}

};


var AppRouter = Backbone.Router.extend({
	
	resumeLesson: function (lessonId) {
		app.$footer.hide();
		app.menuBar.widen();
		
		// app.session.userProgress [{lesson_id, screen_index, percentage}]
		
		var screenIndex = 0;
		
		
		for (var i = 0; i < app.session.userProgress.length; i++) {
			if (lessonId == app.session.userProgress[i].lesson_id) {
				screenIndex = app.session.userProgress[i].screen_index;
				i = app.session.userProgress.length; // set i to max to exit out of for loop
			}
		}
		
		if (screenIndex === 0) {
			setTimeout(function() {
				app_router.resumeLesson(lessonId);
			}, 300);
			return;
		}
		
		$.ajax({
			type: 'get',
			url: '/json/lesson/' + lessonId + '.json',
			success: function(data, text, jqXHR) {
				
				var myLesson = new Lesson({
										lesson: data ,
										currentScreenIndex: screenIndex
									});
				
				var lessonView = new LessonView({ model: myLesson });
				app.renderView(lessonView);
			},
			dataType: 'json'
		});
		
	}
});

$(function() {
	app.initialize();
	$('.signout-link').click(function() {
		$.ajax({
			type: 'get',
			url: '/api/logout.php',
			success: function (data, textStatus, jqXHR) {
				window.location.href = "/";
			},
			dataType: 'json' // just for formality. empty JSON returned.
		});
	});
});