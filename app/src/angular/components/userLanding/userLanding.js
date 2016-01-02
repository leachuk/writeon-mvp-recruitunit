'use strict';

angular.module('app.userLanding', [])
  .controller('UserLandingController', UserLandingController);

UserLandingController.$inject = ['$http', 'loomApi', '$location', '$routeParams'];

function UserLandingController($http, loomApi, $location, $routeParams) {
  console.log("in UserLandingController");

  this.usercreated = $location.search().usercreated;
  //routeParams
  this.useremail = $routeParams.email;
}