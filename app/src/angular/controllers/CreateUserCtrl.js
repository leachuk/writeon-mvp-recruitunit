'use strict';

angular.module('recruitUnitApp')
  .controller('CreateUserCtrl', CreateUserCtrl);
	
CreateUserCtrl.$inject = ['$http', 'loomApi'];

function CreateUserCtrl($http, loomApi) {
	console.log("in CreateUserCtrl");
	
	this.user = {
		name: "",
		email: "",
		password: ""
	};
	this.submitmessage = "";

	//todo: test this still works when minified.
	CreateUserCtrl.prototype.createNewUser = function(){
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


	



  