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

    this.formId = "aa7ecbe9092c948606d4b8a8f0001807"; //todo: pass in the id of the users comparison document. Will need a way to initialise a single new document for the user if one doesn't already exist.
    this.article = {"skills": []}; //Need to initialise for md-chips, otherwise an exception is thrown

    var modelId = "server/services/recruitunit/articles/recruitUnitContentService.controller.js";
    var model = "server/models/RecruitUnit.Job.All.js";
    var token = window.localStorage.getItem("writeon.authtoken");//handle no token

    this.article = {
      "model": "RecruitUnitComparisonTest",
      "roleType": {
        "value": ["contract", "permanent"],
        "disabled": true,
        "rule": "assertEqualTo"
      },
      "payBracketLower": {
        "value": 110,
        "disabled": false,
        "rule": "assertGreaterThan"
      },
      "skills": {
        "value": [
          "java",
          "bar"
        ],
        "disabled": false,
        "rule": "assertArrayContains"
      },
      "authorName": "writeonmvpstep1-1@test.com",
      "createdDate": 1463906114820,
      "locationDescription": {
        "value": [
          "sydney",
          "melbourne"
        ],
        "disabled": false,
        "rule": "assertStringContains"
      }
    };

    this.toggleRoleType = function(value){
      var roleTypeValue = this.article.roleType.value;
      var idx = roleTypeValue.indexOf(value);
      if (idx > -1) {
        roleTypeValue.splice(idx, 1);
      }
      else {
        roleTypeValue.push(value);
      };
    }

    this.existsRoleType = function(value){
      var roleTypeValue = this.article.roleType.value;
      return roleTypeValue.indexOf(value) > -1;
    }

    this.disableRoleType = function(){
      this.article.roleType.disabled = !this.article.roleType.disabled;
    }
    this.disablePayBracketLower = function(){
      this.article.payBracketLower.disabled = !this.article.payBracketLower.disabled;
    }
    this.disableSkills = function(){
      this.article.skills.disabled = !this.article.skills.disabled;
    }
    this.disableLocationDescription = function(){
      this.article.locationDescription.disabled = !this.article.locationDescription.disabled;
    }
    
    loomApi.Article.getArticle(this.formId, modelId, model, token).then(angular.bind(this, function(result){
      console.log("get article:");
      console.log(result);
      //this.article = result;
    }));
  }

})();