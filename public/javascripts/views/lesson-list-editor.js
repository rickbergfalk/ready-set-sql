
/* 	View : Lesson List Editor
	================================================== */
	
var LessonListEditorView = function () {
	var me = this;
	this.el = $('#main-body');
	
	this.model = {}; // not sure yet
	this.lists = [];
	this.unlistedLessons = [];
	this.listLessons = [];
	this.listLessonIds = [];
	this.currentListId = undefined;
	
	this.initialize = function () {
		this.renderLists();
		this.renderUnlistedLessons();
	};
	
	this.renderLists = function () {
		/* =============================================== 	
			Get All Lesson Lists
					
			data.lessonlists: [{
				lessonlist_id,
				name,
				seq,
				is_visible
			}]
		================================================== */
		$.ajax({
			type: 'get',
			url: '/lessonlist',
			success: function(data, textStatus, jqXHR) {
				
				var $ul = $('#lesson-lists');
				
				$.each(data.lessonlists, function (i, lessonList) {
					var $li = $('<li></li>').appendTo($ul);
					var $a = $('<a>' + lessonList.name + '</a>').appendTo($li);
					
					$a.click(function(e) {
						e.preventDefault();
						$(this).tab('show');
						
						var $ul = $('#list-lessons').empty();
						me.listLessons = [];
						me.currentListId = lessonList.lessonlist_id;
						
						/* ===============================================
							data.lesson: [{
								lessonId,
								lessonTitle,
								lessonDescription,
								lessonListId,
								lessonSeq
							}]
						================================================== */
						$.ajax({
							type: 'get',
							url: '/lesson/listid/' + lessonList.lessonlist_id,
							success: function(data, textStatus, jqXHR) {
								
								me.listLessons = data.lesson;
								
								$.each(data.lesson, function(i, lesson) {
									
									$li = $('<li id="' + lesson.lessonId + '"></li>').appendTo($ul);
									$a = $('<a>' + lesson.lessonTitle + '</a>').appendTo($li);
									$a2 = $('<a class="pull-right" href="/edit/lesson/' + lesson.lessonId + '">edit</a>').appendTo($a);
									
								});
								
								$( "#list-lessons, #unlisted-lessons" ).sortable({
									connectWith: ".connectedSortable",
									stop: function(event, ui) { 
										me.listLessonIds = $ul.sortable('toArray'); // this will return a list of element Ids, which for us will be lesson Ids.
										me.save();
									}
								}).disableSelection();
								
							},
							error: function (jqXHR, textStatus, errorThrown) {
								//console.log(jqXHR);
								alert(jqXHR.responseText);
								//console.log(textStatus);
								//console.log(errorThrown);
							},
							dataType: 'json'
						});
					});
				});
				
				// if lessonlists were returned cache it
				if (data.lessonlists && data.lessonlists.length) {
					me.lists = data.lessonlists;
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//console.log(jqXHR);
				alert(jqXHR.responseText);
				//console.log(textStatus);
				//console.log(errorThrown);
			},
			dataType: 'json'
		});
		
	}
	
	this.renderUnlistedLessons = function () {
		/* ===============================================
			data.lesson: [{
				lessonId 			
				lessonTitle 		
				lessonDescription 
			}]
		================================================== */
		$.ajax({
			type: 'get',
			url: '/lesson/unlisted',
			success: function(data, textStatus, jqXHR) {
				var $ul = $('#unlisted-lessons');
				
				$.each(data.lesson, function (i, lesson) {
					// var $li = $('<li id="' + lesson.lessonId + '"><a>' + lesson.lessonTitle + '</a></li>').appendTo($ul);
					
					var $li = $('<li id="' + lesson.lessonId + '"></li>').appendTo($ul);
					var $a = $('<a>' + lesson.lessonTitle + '</a>').appendTo($li);
					var $a2 = $('<a class="pull-right" href="/edit/lesson/' + lesson.lessonId + '">edit</a>').appendTo($a);
				});
				
				if (data.lesson && data.lesson.length) {
					me.unlistedLessons = data.lesson;
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//console.log(jqXHR);
				alert(jqXHR.responseText);
				//console.log(textStatus);
				//console.log(errorThrown);
			},
			dataType: 'json'
		});
	}
	
	this.save = function () {
		$.ajax({
			type: 'post',
			url: '/lessonlist/id/' + me.currentListId,
			data:  {lessonIds: me.listLessonIds},
			error: function() {
				alert('uh-oh. Save Failed...');
			},
			dataType: 'json'
		});
	}
	
	$('#save-button').click(me.save);
	
	this.initialize();
}
