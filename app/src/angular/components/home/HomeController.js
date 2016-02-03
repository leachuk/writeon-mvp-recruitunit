(function() {
  'use strict';

  angular
    .module('app.homeController')
    .controller('HomeController', Controller);

  Controller.$inject = [
    '$routeParams',
    '$http',
    '$cookies',
    'loomApi'
  ];

  function Controller($routeParams, $http, $cookies, loomApi) {
    console.log("in HomeController");

    //client model maps to server model 'User'
    this.user = {
      email: "",
      password: ""
    };
    this.submitmessage = "";
    this.roles = ["developer", "recruiter"];

    //todo: test this still works when minified.
    Controller.prototype.createNewUser = function(){
      console.log("in createNewUser");
      console.log(this.user);

      if(createUser.checkValidity()){ //createUser is form name
        //limitation of angular resource. Any parameters are placed on the url in the request, even for POST.
        //Having a key on the url is bad, so appending to data object.
        //ToDo: asses if the key is necesssary considering the server can be configured to only accept requests from specific hosts (via config > express.js)
        this.user.key = "123456789";
        loomApi.User.createNewUser(this.user).then(angular.bind(this,function(result){
          console.log(result);
          result.success ? $location.path("/user/" + this.user.email).search({usercreated: "true"}) : this.submitmessage = "Error. " + result.data.message;
        }));
      }
    };

    //login existing user
    Controller.prototype.signInUser = function(){
      console.log("in signInUser");
      console.log(this.user);
      //ToDo: fix result.data.message so it's consistent.
      loomApi.User.signInUser(this.user.email, this.user.password).then(angular.bind(this,function(result){
        console.log(result);
        result.success ? this.submitmessage = "User signed in successfully" : this.submitmessage = "Error. " + result.data.message;
        console.log(this.submitmessage);
      }));
    };
  }

})();