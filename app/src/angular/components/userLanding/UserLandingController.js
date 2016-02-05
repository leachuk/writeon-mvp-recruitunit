(function() {
  'use strict';

  angular
    .module('app.user.userLandingController')
    .controller('UserLandingController', Controller);

  Controller.$inject = [
    '$routeParams',
    '$http',
    '$cookies',
    '$location',
    'loomApi'
  ];

  function Controller($routeParams,$http,$cookies,$location,loomApi) {
    console.log("in UserLandingController");

    this.usercreated = $location.search().usercreated;
    //routeParams
    this.useremail = $routeParams.email;
    //this.testid = $routeParams.testid;
  }

})();