'use strict';

angular.module('recruitUnitApp')
  .controller('SubmitJobCtrl', ['$scope', '$http', 'loomApi', function ($scope, $http, loomApi) {
	var self = this;
  	self.tags = ['foo', 'bar'];
  	console.log("tags:" + self.tags);

  // 	$scope.submitJob = function(){
		// console.log("submitJob");
  // 	};
	
  }]);