(function() {
  'use strict';

  angular
    .module('app.homeController')
    .controller('HomeController', Controller);

  Controller.$inject = [
    '$routeParams',
    '$router',
    '$location',
    '$http',
    '$cookies',
    'loomApi',
    'recruitUnitUtil'
  ];

  function Controller($routeParams, $router, $location, $http, $cookies, loomApi, recruitUnitUtil) {
    console.log("in HomeController");

    this.roles = ['developer', 'recruiter'];

    recruitUnitUtil.Util.setTitle("Home");

    //redirect depending on user authentication
    //console.log("Check User Authentication:");
    // var localUser = recruitUnitUtil.Util.getLocalUser();
    // if ((typeof localUser.email !== 'undefined' && localUser.email !== null) && (typeof localUser.token !== 'undefined' && localUser.token !== null)){ //check if details are set
    //   recruitUnitUtil.Util.isUserAuthenticated(localUser.email, localUser.token).then(angular.bind(this,function(result){
    //     if(result){ //true
    //       console.log("Redirecting user to landing page");
    //       $location.path("/user/" + localUser.email);
    //     }
    //   }));
    // }

    //todo: test this still works when minified.
    Controller.prototype.createNewUser = function(){
      console.log("in createNewUser");
      console.log(this.user);

      if(createUser.checkValidity()){ //createUser is form name
        //limitation of angular resource. Any parameters are placed on the url in the request, even for POST.
        //Having a key on the url is bad, so appending to data object.
        //ToDo: asses if the key is necesssary considering the server can be configured to only accept requests from specific hosts (via config > express.js)
        this.user.key = "123456789";

        loomApi.User.createNewUser(this.user, 'server/services/recruitunit/users/recruitUnitUserService.controller.js').then(angular.bind(this,function(result){
          console.log(result);
          result.success
            ?
              loomApi.User.signInUser(this.user.email, this.user.password).then(angular.bind(this,function(result, status, headers, config){
                result.success
                  ?
                  (recruitUnitUtil.Util.persistUserAuth(result.token, this.user.email),
                   $location.path("/user/" + this.user.email))
                  :
                  this.submitmessage = "Error. " + result.data.message;
                //console.log(this.submitmessage);
              }))
            :
              this.submitmessage = "Error. " + result.data.message;
        }));
      }
    };

  }

})();