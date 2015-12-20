'use strict';

angular.module('recruitUnitApp')
  .controller('CreateUserCtrl', CreateUserCtrl);
	
CreateUserCtrl.$inject = ['$http', 'loomApi'];

function CreateUserCtrl($http, loomApi) {
	console.log("in CreateUserCtrl");

	var self = this;
	self.user = {
		"id": "",
		"name": "",
		"email": "",
		"password": ""
	};
	this.submitmessage = "";

	//todo: test this still works when minified.
	CreateUserCtrl.prototype.createNewUser = function(){
		console.log("in createNewUser");
		console.log(this.user);

		if(createUser.checkValidity()){ //createUser is form name
			//update createNewUser method to pass in json obj which maps to the server model
			self.user.id = "org.couchdb.user:" + self.user.name;
			loomApi.User.createNewUser(self.user).then(angular.bind(this,function(result){
				console.log(result);
				result.success ? this.submitmessage = "User created" : this.submitmessage = "Error. " + result.data.message;
			}));
		}
	};
}


	



  