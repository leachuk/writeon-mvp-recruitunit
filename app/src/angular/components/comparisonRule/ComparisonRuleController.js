(function() {
  'use strict';

  angular
    .module('app.user.comparisonRuleController')
    .controller('ComparisonRuleController', Controller);

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
    console.log("ComparisonRuleController instantiated");

    this.formId = "aa7ecbe9092c948606d4b8a8f0001807";
    this.article = {"skills": []}; //Need to initialise for md-chips, otherwise an exception is thrown

    var modelId = "server/services/recruitunit/articles/recruitUnitContentService.controller.js";
    var model = "server/models/RecruitUnit.Job.All.js";
    var token = window.localStorage.getItem("writeon.authtoken");//handle no token

    loomApi.Article.getArticle(this.formId, modelId, model, token).then(angular.bind(this, function(result){
      console.log("get article:");
      console.log(result);
      this.article = result;
    }));
  }

})();