
/* 	View : Screen List (and Screen List Item)
	================================================== */

	var ScreenList = function ($ul) {
		var screenList = this;
		var $ul = $ul;
		var liCount = 0;
		var screenListItems = {};
		var screenEditor = false;
		this.currentScreenListItem = false;
		
		this.getScreenArray = function () {
			
		};
		
		var ScreenListItem = function (screen) {
			var screenListItem = this;
			var screen = screen;
			screen.screenTitle = screen.screenTitle || "New Screen";
			var id = "lesson-screen-" + liCount;
			var $li = $('<li id="' + id + '"></li>').appendTo($ul);
			var $a = $('<a></a>').appendTo($li);
			var $spanCount = $('<span>' + liCount + '</span>').appendTo($a);
			var $spanDash = $('<span> - </span>').appendTo($a);
			var $spanScreenTitle = $('<span>' + screen.screenTitle + '</span>').appendTo($a);
			var $close = $('<span class="close">&times;</span>').appendTo($a);
			liCount = liCount + 1;
			
			// events
			$close.click(function (event) {
				event.stopPropagation();
				// remove this list item from all the places,
				screenList.remove(screenListItem);
				// refresh sortable
			});
			
			// mark tab as active when clicked
			$a.click(function(e) {
				// remove active from any other field marked active
				$ul.find('.active').removeClass('active');
				$li.addClass('active');
			});
			
			// methods
			this.getId = function () {return id};
			this.click = function (f) {$a.click(f)};
			this.getScreen = function () {return screen};
			this.setScreen = function (s) {screen = s};
			this.getText = function () {return $spanScreenTitle.text()};
			this.setText = function (t) {$spanScreenTitle.text(t)};
			this.setSpanCount = function (n) {$spanCount.text(n)};
			this.getScreenNumber = function () {
				var screenList = $ul.sortable('toArray');
				return _.indexOf(screenList, this.getId());
			};
			
		}
		
		this.remove = function (screenListItem) {
			if (screenListItem == screenList.currentScreenListItem) {
				screenList.currentScreenListItem = undefined;
			}
			//alert('removing ' + screenListItem.getScreen().screenTitle);
			var id = screenListItem.getId();
			delete screenListItems[id];
			$('#' + id).remove();
			this.refreshSortable();
			this.updateScreenNumbers();
		};
		
		this.addScreen = function (screen) {
			var screenListItem = new ScreenListItem(screen);
			screenListItems[screenListItem.getId()] = screenListItem;
			this.refreshSortable();
			this.updateScreenNumbers();
			return screenListItem;
		}
		
		this.updateScreenNumbers = function () {
			// get the current ordering of the sortable list
			var screenList = $ul.sortable('toArray');
			// update list items titles
			$.each(screenListItems, function (i, screenListItem) {
				var screenNumber = _.indexOf(screenList, screenListItem.getId());
				screenListItem.setSpanCount(screenNumber);
			});
		}
				
		$ul.sortable({axis: 'y'}).disableSelection();
		
		this.onSortStop = function (f) {
			$ul.bind('sortstop', f);
		};
		
		this.refreshSortable = function () {
			$ul.sortable('refresh');
		}
	};