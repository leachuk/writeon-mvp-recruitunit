'use strict';

angular.module('recruitUnitApp')
  .controller('SubmitJobCtrl', function ($scope, $http) {
  	$scope.tags = { foo: "bar" };

  	$scope.submitJob = function(){
		console.log("submitJob");
  	};
	
  });