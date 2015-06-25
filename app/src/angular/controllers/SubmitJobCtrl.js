'use strict';

angular.module('recruitUnitApp')
  .controller('SubmitJobCtrl', function ($scope, $http) {
	var self = this;
  	self.tags = ['foo', 'bar'];

  	$scope.submitJob = function(){
		console.log("submitJob");
  	};
	
  });