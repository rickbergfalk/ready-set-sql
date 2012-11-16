
// There is no model or view compilation because we don't need it.
// we are using a pre-rendered template.
	
var SignInView = Backbone.View.extend({
	
	el: '#main-body', 
	
	initialize: function(){
		this.render();
	},
	
	render: function(){
		
	},
	
	events: {
		"click #signin-btn" : 		"signIn",
		"keypress #signin-form" : 	"onReturn"
	},
	
	signIn: function( event ){
		var me = this;
		
		// Button clicked, you can access the element that was clicked with event.currentTarget
		var $email = $("#signin-email");
		var $password = $("#signin-password");
		
		$.ajax({
			type: 'post',
			url: "/api/login.php",
			data: {email: $email.val(), password: $password.val()},
			success: function (data, textStatus, jqXHR) {
				if (data.err) {
					app.session.isSignedIn = false;
					$('#sub-hero').html('incorrect email or password');
					$email.parent().parent().addClass('error').removeClass('success');
					$password.parent().parent().addClass('error').removeClass('success');
				} else {
					window.location.href = "/";
				}
			},
			dataType: 'json'
		});
		
	},
	
	onReturn: function (event) {
		if (event.keyCode == 13) {
			this.signIn(event);
			event.preventDefault();
		}
	}
	
	
});
