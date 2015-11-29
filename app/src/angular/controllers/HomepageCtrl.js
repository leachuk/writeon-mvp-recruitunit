'use strict';

angular.module('recruitUnitApp')
  .controller('HomepageCtrl', HomepageCtrl);
	
HomepageCtrl.$inject = ['$http', 'loomApi'];

function HomepageCtrl($http, loomApi) {
	console.log("in HomepageCtrl");
	
	this.user = {
		name: "",
		email: "",
		password: "",
		role: ["recruiter", "candidate"]
	};
	this.submitmessage = "";

	//todo: test this still works when minified.
	HomepageCtrl.prototype.createNewUser = function(){
		console.log("in createNewUser");
		console.log(this.user);

		if(createUser.checkValidity()){ //createUser is form name
			loomApi.User.createNewUser(this.user.email, this.user.name, this.user.password).then(angular.bind(this,function(result){
				console.log(result);
				result.success ? this.submitmessage = "User created" : this.submitmessage = "Error. " + result.message;
			}));
		}
	};
}