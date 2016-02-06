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

    //this.usercreated = $location.search().usercreated; //ref to get param from url
    //routeParams
    this.useremail = $routeParams.email;
    this.role = "";
    this.id = "";

    var token = window.localStorage.getItem("writeon.authtoken");//handle no token
    loomApi.User.getUser(this.useremail, token).then(angular.bind(this,function(result){
      console.log(result);
      if (result.success) {
        this.role = result.data.jobRole;
        this.id = result.data.id;
      } else {
        console.log(result.message);
      }
    }));
  }

})();