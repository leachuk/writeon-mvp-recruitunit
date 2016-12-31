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
                   recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_USER + this.user.email))
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