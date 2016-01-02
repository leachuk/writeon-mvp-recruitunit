'use strict';

angular.module('app.home', [])
  .controller('HomeController', HomeController);

HomeController.$inject = ['$http', 'loomApi'];

function HomeController($http, loomApi) {
  console.log("in HomeController");

  //var self = this;
  this.user = {
    "displayName": "",
    "email": "",
    "password": "",
    "jobRole": ""
  };
  this.submitmessage = "";
  this.roles = ["developer", "recruiter"];

  //todo: test this still works when minified.
  HomeController.prototype.createNewUser = function(){
    console.log("in createNewUser");
    console.log(this.user);

    if(createUser.checkValidity()){ //createUser is form name
      //limitation of angular resource. Any parameters are placed on the url in the request, even for POST.
      //Having a key on the url is bad, so appending to data object.
      this.user.key = "123456789";
      loomApi.User.createNewUser(this.user).then(angular.bind(this,function(result){
        console.log(result);
        result.success ? this.submitmessage = "User created" : this.submitmessage = "Error. " + result.data.message;
      }));
    }
  };
}