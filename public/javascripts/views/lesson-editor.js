
/* 	View : Lesson Editor
	================================================== */
	
	var LessonEditor = function (id, lesson) {
		
		
		var lessonEditor = this;
		
		var $el = $('#' + id);
		
		var lesson = {
			lessonId 			: lesson.lessonId || false,
			lessonTitle			: lesson.lessonTitle || "New Lesson",
			lessonDescription 	: lesson.lessonDescription || "",
			lessonScreens		: lesson.lessonScreens || []
		}
		
		var screenEditor = false;
		
		// api
		this.saveScreenEditor = function () {
			// saves whatever is in the current screenEditor. 
			// this should be called before the screenEditor is changed or removed
			if (screenEditor && screenList.currentScreenListItem) {
				screenList.currentScreenListItem.setScreen(screenEditor.getScreenData());
			}
		}
		
		// render
		
		var $lessonScreenList = $("#lesson-screen-list");
		var $btnAddLessonScreen = $("#btn-add-lesson-screen");
		
		var screenList = new ScreenList($lessonScreenList);
		screenList.onSortStop(function () {
			screenList.updateScreenNumbers();
			if (screenEditor && screenList.currentScreenListItem) {
				screenEditor.setLegendNumber(screenList.currentScreenListItem.getScreenNumber());
			}
		});
		
		var onListItemClick = function (screenListItem) {
			// LOAD SCREEN EDITOR
			// first, grab the data in the present editor if one exists
			// we'll assign it back to the list item that is currently being edited.
			lessonEditor.saveScreenEditor();
			
			// update the new currently being edited screen list item
			// render the new screen editor with the new screen data from the click event
			screenList.currentScreenListItem = screenListItem;
			screenEditor = new ScreenEditor('lesson-screen-editor', screenListItem);
		};
		
		// create a list item button/tab for each lesson screen
		$.each(lesson.lessonScreens, function (i, screen) {
			var screenListItem = screenList.addScreen(screen);
			screenListItem.click(function () {
				onListItemClick(screenListItem);
			});
		});
		
		// if we click the add button, we need to do the same thing
		$btnAddLessonScreen.click(function () {
			var screenListItem = screenList.addScreen({});
			screenListItem.click(function () {
				onListItemClick(screenListItem);
			});
		});
		
		var saveLesson = function () {
			lessonEditor.saveScreenEditor();
			
			screenArray = screenList.getScreenArray();
			
			var lessonUpdate = {
				lessonId: 		lesson.lessonId,
				lessonTitle:	$('#lesson-title').val(),
				lessonDescription: $('#lesson-description').val(),
				lessonScreens: 	JSON.stringify(screenArray)
			}
			
			if (lesson.lessonId) {
				$.ajax({
					type: 'post',
					url: '/lesson/' + lesson.lessonId,
					data: lessonUpdate,
					success: function() {alert('saved')},
					dataType: 'json'
				});
			} else {
				$.ajax({
					type: 'put',
					url: '/lesson',
					data: lessonUpdate,
					success: function() {alert('created')},
					dataType: 'json'
				});
			}
				
		}
		var $btnSaveLesson = $('#btn-save-lesson').click(saveLesson);
		
	}