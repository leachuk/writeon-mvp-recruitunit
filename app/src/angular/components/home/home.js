'use strict';

angular.module('app.home', [])
  .controller('HomeController', HomeController);

HomeController.$inject = ['$http', 'loomApi', '$location'];

function HomeController($http, loomApi, $location) {
  console.log("in HomeController");

  //client model maps to server model 'User'
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
      //ToDo: asses if the key is necesssary considering the server can be configured to only accept requests from specific hosts (via config > express.js)
      this.user.key = "123456789";
      loomApi.User.createNewUser(this.user).then(angular.bind(this,function(result){
        console.log(result);
        result.success ? $location.path("/user/" + this.user.email).search({usercreated: "true"}) : this.submitmessage = "Error. " + result.data.message;
      }));
    }
  };
}