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

    var controllerId = "server/services/recruitunit/articles/recruitUnitContentService.controller.js";
    var model = "server/models/RecruitUnit.ComparisonTest.js";
    var token = window.localStorage.getItem("writeon.authtoken");//handle no token

    var searchJson = {};
    searchJson.authorName = "writeonmvpstep1-1@test.com"; 

    this.article = {
      "roleType": {
        "value": ["contract", "permanent"],
        "disabled": false,
        "rule": "assertEqualTo"
      },
      "payBracketLower": {
        "value": 0,
        "disabled": false,
        "rule": "assertGreaterThan"
      },
      "skills": {
        "value": [],
        "disabled": false,
        "rule": "assertArrayContains"
      },
      "authorName": "writeonmvpstep1-1@test.com",
      "createdDate": Date.now(),
      "locationDescription": {
        "value": [],
        "disabled": false,
        "rule": "assertStringContains"
      },
      "published": true
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

    this.submitComparisonRuleDocument = function(){
      console.log("in submitComparisonRuleDocument");

      var authToken = $cookies.get("writeon.authtoken");

      //ToDo: handle if authToken is expired/not available. Redirect to login page?
      if(comparisonRuleForm.checkValidity() && typeof authToken != 'undefined'){ //comparisonRuleForm is form name
        console.log("model:");
        console.log(this.article);

        var modelId = "server/services/recruitunit/articles/recruitUnitContentService.controller.js";
        var modelType = "server/models/RecruitUnit.ComparisonTest.js";
        loomApi.Article.saveArticle(this.article, modelId, modelType, authToken).then(angular.bind(this,function(saveResult){
          console.log("result:");
          console.log(saveResult);
          //ToDo: redirect to users homepage after success
          saveResult.success ? this.submitmessage = "Success message" : this.submitmessage = "Error. " + saveResult.message;
        }));
      }
    }

    loomApi.Article.search(controllerId, model, searchJson, token).then(angular.bind(this, function(result){
      console.log("get search:");
      console.log(result);
      if (result.length > 0){
        this.article = result[0];
      }
      //this.article = result;
    }));

    // loomApi.Article.getArticle(this.formId, modelId, model, token).then(angular.bind(this, function(result){
    //   console.log("get article:");
    //   console.log(result);
    //   //this.article = result;
    // }));
  }

})();