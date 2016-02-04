(function() {
  'use strict';

  angular
    .module('app.homeController')
    .controller('HomeController', Controller);

  Controller.$inject = [
    '$routeParams',
    '$location',
    '$http',
    '$cookies',
    'loomApi'
  ];

  function Controller($routeParams, $location, $http, $cookies, loomApi) {
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

      loomApi.User.signInUser(this.user.email, this.user.password).then(angular.bind(this,function(result, status, headers, config){
        console.log(result);
        console.log(status);
        console.log(headers);
        console.log(config);
        result.success ? persistAuth(result.token, this.user.email) : this.submitmessage = "Error. " + result.data.message;
        //console.log(this.submitmessage);
      }));
    };

    //private functions. Probably move to a service
    var persistAuth = function(token, username){
      window.localStorage.setItem("writeon.authtoken", token);
      window.localStorage.setItem("writeon.username", username);
      //now redirect to users home page, where token is checked for
      window.location = "/user/" + username; //will prob need to change this to come from header referer
    }
  }

})();