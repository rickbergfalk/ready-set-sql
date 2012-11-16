
// There is no model or view compilation because we don't need it.
// we are using a pre-rendered template.
	
var RegisterView = Backbone.View.extend({
	
	el: '#main-body', 
	
	$email: {},
	$password: {},
	$confirmPassword: {},
	$emailMessage: {},
	$passwordMessage: {},
	emailIsValid: false,
	passwordIsValid: false,
	
	isEmail: function (email) {
		var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		return regex.test(email);
	},
	
	initialize: function(){
		this.render();
	},
	
	render: function(){
		var me = this;
		
		//this.$el.html( templates.contentRegister );
		//$('#main-body').html(me.$el);
		
		this.$email = $('#register-email');
		this.$password = $('#register-password');
		this.$confirmPassword = $('#register-confirm-password');
		this.$emailMessage = $('#email-message');
		this.$passwordMessage = $('.password-message');
	},
	
	events: {
		"click #sign-up-btn"				: "register"
	},
	
	markEmailValid: function () {
		this.$email.parent().parent().addClass('success').removeClass('error');
		this.emailIsValid = true;
		this.$emailMessage.text('');
	},
	
	markEmailInvalid: function (msg) {
		this.$email.parent().parent().addClass('error').removeClass('success');
		this.emailIsValid = false;
		if (msg) this.$emailMessage.text(msg);
	},
	
	validateEmail: function (event) {
		if (this.isEmail(this.$email.val())) {
			this.markEmailValid();
		} else {
			this.markEmailInvalid('(not valid email)');
		}
	},
	
	markPasswordValid: function () {
		this.$password.parent().parent().removeClass('error').addClass('success');
		this.$confirmPassword.parent().parent().removeClass('error').addClass('success');
		this.passwordIsValid = true;
		this.$passwordMessage.text('');
	},
	
	markPasswordInvalid: function (msg) {
		this.$password.parent().parent().addClass('error').removeClass('success');
		this.$confirmPassword.parent().parent().addClass('error').removeClass('success');
		this.passwordIsValid = false;
		if (msg) this.$passwordMessage.text(msg);
	},
	
	validatePasswords: function (event) {
		if (this.$password.val().length < 2) {
			this.markPasswordInvalid('(too short)');
		} else if (this.$password.val() !== this.$confirmPassword.val()) {
			this.markPasswordInvalid('(does not match)');
		} else {
			this.markPasswordValid();
		}
	},
	
	register: function (event) {
		var me = this;
		
		this.validateEmail();
		this.validatePasswords();
		
		if (this.passwordIsValid && this.emailIsValid) {
			
			// check to see if email is available
			$.ajax({
				type: 'post',
				url: '/api/emailAvailable.php',
				data: {email: me.$email.val()},
				success: function (data) {
					
					if (data.available) {
						
						// sign up
						$.ajax({
							type: 'post',
							url: '/api/register.php',
							data: {email: me.$email.val(), password: me.$password.val()},
							success: function (data) {
								if (data.err) {
									alert(data.err);
								} else {
									window.location.href = "/";
								}
							},
							dataType: 'json'
						});
						
					} else {
						// email is not available
						me.markEmailInvalid('(already in use)');
						alert('Sorry, but that email is already in use.');
					}
					
				},
				dataType: 'json'
			});		
			
		} else if (!this.passwordIsValid) {
			// passwords don't match.
			this.$confirmPassword.focus();
			
		} else if (!this.emailIsValid) {
			// email isn't good
			this.$email.focus();
			
		} else {
			// should never get here, but you never know
			alert('Please fill out the form correctly');
			
		}
	}
	
});
