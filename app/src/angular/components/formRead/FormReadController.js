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
    console.log("jobDetailFormId passed in from dialog controller:" + this.jobDetailFormId);

    this.formId = $routeParams.id == null ? this.jobDetailFormId : $routeParams.id;
    this.article = {"skills": []}; //Need to initialise for md-chips, otherwise an exception is thrown
    this.payFrequencyOptions = [
      {id: "Permanent", value: "annual salary"},
      {id: "Contract", value: "daily rate"}
    ];

    var modelId = "server/services/recruitunit/articles/recruitUnitContentService.controller.js";
    var model = "server/models/RecruitUnit.Job.All.js";
    var token = window.localStorage.getItem("writeon.authtoken");//handle no token

    loomApi.Article.getArticle(this.formId, modelId, model, token).then(angular.bind(this, function(result){
      console.log("get article:");
      console.log(result);
      this.article = result;
    }));
    
    //make this a reusable service
    var checkAuth = function(username, password){ //ToDo: does this need refactoring to use local storage rather than cookie?
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