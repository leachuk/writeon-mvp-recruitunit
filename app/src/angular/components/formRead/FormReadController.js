(function() {
  'use strict';

  angular
    .module('app.user.formReadController')
    .controller('FormReadController', Controller);

  Controller.$inject = [
    '$routeParams',
    '$http',
    '$cookies',
    '$mdDialog',
    'loomApi'
  ];

  //example child router. Component folder structure stays flat
  Controller.$routeConfig = [
    { path: '/create', component: 'testCreate' }
  ];

  function Controller($routeParams, $http, $cookies, $mdDialog, loomApi) {
    console.log("FormReadController instantiated");
    this.formId = $routeParams.id;

    this.article = {
      "jobDescription" : "Job opportunity at Adobe in Sydney. Immediate start",
      "roleType": "Permanent",
      "payBracketLower": 140,
      "payBracketUpper": 160,
      "locationDescription": "Sydney CBD",
      "skills": ['node', 'java', 'html', 'grunt'],
      "submitTo" : "stew.leach@gmail.com",
      "submittedBy" : "recruiter1@gmail.com"
    };

    //make this a reusable service
    var checkAuth = function(username, password){
      var authCookie = $cookies.get("writeon.authtoken"); //put cookie name into config var
      return typeof authCookie != 'undefined' ? authCookie : loomApi.User.signInUser(username, password).then(angular.bind(this, function(result){
        $cookies.put("writeon.authtoken", result.token);
        this.authToken = result.token; //required angular.bind to enable setting of scope variable within promise
      }));
    };

    this.cancelDialog = function() {
      console.log("cancelDialog");
      $mdDialog.hide();
    }
    
  }

})();