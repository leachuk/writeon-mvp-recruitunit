'use strict';

angular.module('recruitUnitApp')
  .controller('CreateUserCtrl', CreateUserCtrl);
	
CreateUserCtrl.$inject = ['$http', 'loomApi'];

function CreateUserCtrl($http, loomApi) {
	console.log("in CreateUserCtrl");

	var self = this;
	self.user = {
		"displayName": "",
		"email": "",
		"password": ""
	};
	this.submitmessage = "";

	//todo: test this still works when minified.
	CreateUserCtrl.prototype.createNewUser = function(){
		console.log("in createNewUser");
		console.log(this.user);

		if(createUser.checkValidity()){ //createUser is form name
			//limitation of angular resource. Any parameters are placed on the url in the request, even for POST.
			//Having a key on the url is bad, so appending to data object.
			self.user.key = "123456789";
			loomApi.User.createNewUser(self.user).then(angular.bind(this,function(result){
				console.log(result);
				result.success ? this.submitmessage = "User created" : this.submitmessage = "Error. " + result.data.message;
			}));
		}
	};
}


	



  