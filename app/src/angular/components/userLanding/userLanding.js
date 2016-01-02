'use strict';

angular.module('app.userLanding', [])
  .controller('UserLandingController', UserLandingController);

UserLandingController.$inject = ['$http', 'loomApi', '$location'];

function UserLandingController($http, loomApi, $location) {
  console.log("in UserLandingController");

  this.usercreated = $location.search().usercreated;
}