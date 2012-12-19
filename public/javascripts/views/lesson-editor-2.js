

var screens = [];


var ScreenCard = function (screen, $beforeElement, lessonEditor) {
	this.screen = screen || {};
	
	var screenId = uuid.v4();
	this.screenId = screenId;
	
	var templateHtml = $('#lesson-screen-editor-template').html();
	var $screenCard = $(templateHtml);
	this.$screenCard = $screenCard;
	
	if ($beforeElement) {
		$beforeElement.before($screenCard);
	} else {
		$('#screen-cards').append($screenCard);
		
	}
	
	var $screenText = $screenCard.find('.screen-text').attr('id', screenId).val(this.screen.screenText || '');
	var $sqlExample = $screenCard.find('.sql-example').text(this.screen.sqlExample || '');
	var $sqlTarget = $screenCard.find('.sql-target').text(this.screen.sqlTarget || '');
	var $startingSql = $screenCard.find('.starting-sql').text(this.screen.startingSql || '');
	var $keepSql = $screenCard.find('.keep-sql');
	
	if (this.screen.keepSql) {
		$keepSql.prop("checked", true);
	} else {
		$keepSql.prop("checked", false);
	}
	
	var tinyMCEOptions = {
		//mode : "textareas",
		// or
		//mode : "specific_textareas",
		//editor_selector: "mceEditor",
		
		mode: "exact",
		elements: screenId,
		
		//width: 400,
		height: "400",
		
		// General options
		theme : "advanced",
		plugins : "style,table,advhr,advimage,advlink,inlinepopups,media,paste,noneditable,save",
		
		// Theme options
		theme_advanced_buttons1 : "bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect",
		theme_advanced_buttons2 : "bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,image,code",
		theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		
		// Example content CSS (should be your site CSS)
		content_css : "/stylesheets/bootstrap.css",
		
		save_enablewhendirty : true,
		save_onsavecallback : function() {
			lessonEditor.saveLesson();
		}
	};
	
	tinyMCE.init(tinyMCEOptions);
	
	
	// - codemirror boxes
	var codeMirrorOptions = {
		lineNumbers: false, 
		indentWithTabs : true,
		matchBrackets: true,
		indentUnit: 4,
		mode: "text/x-mysql",
		theme: "monokai",
		tabMode: "indent"//,					// TODO: update this?
		//extraKeys: {"Tab": "indentAuto"}
	};
	var cmSqlExample = CodeMirror.fromTextArea($sqlExample.get(0), codeMirrorOptions);
	var cmStartingSql = CodeMirror.fromTextArea($startingSql.get(0), codeMirrorOptions);
	var cmSqlTarget =   CodeMirror.fromTextArea($sqlTarget.get(0), codeMirrorOptions);
	
	
	this.getScreenData = function () {
		this.screen.screenText = tinyMCE.get(screenId).getContent(); // $screenText.val();
		this.screen.keepSql = $keepSql.is(':checked');
		this.screen.sqlTarget = cmSqlTarget.getValue();
		this.screen.sqlExample = cmSqlExample.getValue();
		this.screen.startingSql = cmStartingSql.getValue();
		return this.screen;
	}
	
	
	
	var insertNewCardBefore = function() {
		// create a new card, before this one.
		// This involves creating a new card, and specifying the element we need to place it before
		var newScreenCard = new ScreenCard({}, $screenCard, lessonEditor);
		
		// We also need to add this item to the array of screens
		// loop through the screens, 
		// find the one with the ID we're dealing with, 
		// and then insert this new card
		var screensLength = screens.length;
		for (var i = 0; i < screensLength; i++) {
			if (screens[i].screenId === screenId) {
				// this is this screen, so we need to splice the new screen in before it
				screens.splice(i, 0, newScreenCard);
			}
		}
	}
	var $insertNew = $screenCard.find('.btn-insert-new');
	$insertNew.click(insertNewCardBefore);
	
	var $btnDeleteCard = $screenCard.find('.btn-delete-card');
	$btnDeleteCard.click(function() {
		var screensLength = screens.length;
		for (var i = 0; i < screensLength; i++) {
			if (screens[i].screenId === screenId) {
				// this is this screen, so we need to splice the new screen in before it
				screens.splice(i, 1);
				break;
			}
		}
		$screenCard.fadeOut($screenCard.remove	);
	});
	
}

	
	
	
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
	
	// for each lesson screen, build the form
	for (s in lesson.lessonScreens) {
		var screen = lesson.lessonScreens[s];
		screens.push(new ScreenCard(screen, null, lessonEditor));
	}
	
	$('#btn-add-lesson-screen').click(function() {
		screens.push(new ScreenCard(null, null, lessonEditor));
	});
	
	var saveLesson = function () {
	
		var screenArray = [];
		
		// Loop through screens and get the data
		for (var s = 0; s < screens.length; s++) {
			var screen = screens[s].getScreenData();
			screen.screenNumber = s;
			//screen.screenNumber = screenListItems[listItem].getScreenNumber();	// TODO: screens should maybe have some sort of sequence. This is clunky
			screenArray.push(screen);
		}
		
		screenArray.sort(function(a, b) {
			return a.screenNumber - b.screenNumber;
		});
		
		
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
				success: function() {
					$('#main-body').css({'background-color': '#ACD894'});
					setTimeout(function() {
						$('#main-body').animate({backgroundColor: '#FAFAFA'}, 1000);
					}, 400);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
					alert(jqXHR.responseText);
					console.log(textStatus);
					console.log(errorThrown);
				},
				dataType: 'json'
			});
		} else {
			$.ajax({
				type: 'put',
				url: '/lesson',
				data: lessonUpdate,
				success: function() {
					alert('created');
					window.location.href = "/edit/";
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(jqXHR);
					alert(jqXHR.responseText);
					console.log(textStatus);
					console.log(errorThrown);
				},
				dataType: 'json'
			});
		}
			
	}
	var $btnSaveLesson = $('#btn-save-lesson').click(saveLesson);
	this.saveLesson = saveLesson;
	
	document.addEventListener("keydown", function(e) {
		if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
			e.preventDefault();
			saveLesson();
		}
	}, false);
	
}