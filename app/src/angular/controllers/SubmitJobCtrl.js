'use strict';

angular.module('recruitUnitApp')
  .controller('SubmitJobCtrl', ['$scope', '$http', function ($scope, $http) {
	var self = this;
  	self.tags = ['foo', 'bar'];
  	console.log("tags:" + self.tags);

  // 	$scope.submitJob = function(){
		// console.log("submitJob");
  // 	};
	
  }]);