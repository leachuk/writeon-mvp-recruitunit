'use strict';

angular.module('recruitUnitApp')
  .controller('SignInUserCtrl', SignInUserCtrl);
	
SignInUserCtrl.$inject = ['$http', 'loomApi'];

function SignInUserCtrl($http, loomApi) {
	console.log("in SignInUserCtrl");
	
	this.user = {
		email: "",
		password: ""
	};
	this.submitmessage = "";

	//todo: test this still works when minified.
	SignInUserCtrl.prototype.signInUser = function(){
		console.log("in signInUser");
		console.log(this.user);

		if(signInUser.checkValidity()){ //signInUser is form name
			loomApi.User.signInUser(this.user.email, this.user.password).then(angular.bind(this,function(result){
				console.log(result);
				result.success ? this.submitmessage = "User signed in successfully" : this.submitmessage = "Error. " + result.message;
			}));
		}
	};
}


	



  