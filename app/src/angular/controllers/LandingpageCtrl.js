'use strict';

angular.module('recruitUnitApp')
  .controller('LandingpageCtrl', ['$scope', '$http', 'loomApi', function ($scope, $http, loomApi) {
	var self = this;
  	self.tags = ['foo', 'bar'];
  	console.log("in LandingpageCtrl");

  // 	$scope.submitJob = function(){
		// console.log("submitJob");
  // 	};
	
  }]);