'use strict';

angular.module('recruitUnitApp')
  .controller('CreateUserCtrl', CreateUserCtrl);
	
CreateUserCtrl.$inject = ['$http', 'loomApi'];

function CreateUserCtrl($http, loomApi) {
	console.log("in CreateUserCtrl");

	this.loomApi = loomApi;

	this.name = "John Smith";
	this.contacts = [
		{type: 'phone', value: '408 555 1212'},
		{type: 'email', value: 'john.smith@example.org'} 
	];

	CreateUserCtrl.prototype.createNewUser = function(){
		console.log("in createNewUser");
		console.log(this.loomApi);
		this.loomApi.User.createNewUser("recruitunit-2@test.com", "recruitunit user 2", "12345678");
	};
}


	



  