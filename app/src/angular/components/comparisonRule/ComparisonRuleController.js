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
    '$location',
    '$window',
    'loomApi',
    'recruitUnitUtil'
  ];

  //example child router. Component folder structure stays flat
  // Controller.$routeConfig = [
  //   { path: '/create', component: 'testCreate' }
  // ];

  function Controller($routeParams, $http, $cookies, $mdDialog, $location, $window, loomApi, recruitUnitUtil) {
    console.log("ComparisonRuleController instantiated");

    recruitUnitUtil.Util.setTitle("Manage Comparison Rules");

    //redirect depending on user authentication
    console.log("Check User Authentication:");
    var localUser = recruitUnitUtil.Util.getLocalUser();
    if ((typeof localUser.email !== 'undefined' && localUser.email !== null) && (typeof localUser.token !== 'undefined' && localUser.token !== null)){ //check if details are set
      recruitUnitUtil.Util.isUserAuthenticated(localUser.email, localUser.token).then(angular.bind(this,function(result){
        if(!result){ //false
          console.log("Redirecting user to landing page");
          $location.path("/home");
        }
      }));
    } else { // local user details aren't set
      $window.location.assign("/home"); //alternate redirect. location.path failed here.
    }

    this.formId = "aa7ecbe9092c948606d4b8a8f0001807"; //todo: pass in the id of the users comparison document. Will need a way to initialise a single new document for the user if one doesn't already exist.
    this.article = {"skills": []}; //Need to initialise for md-chips, otherwise an exception is thrown

    var controllerId = "server/services/recruitunit/articles/recruitUnitContentService.controller.js";
    var model = "server/models/RecruitUnit.ComparisonTest.js";
    var token = window.localStorage.getItem("writeon.authtoken");//handle no token

    var searchJson = {};
    searchJson.authorName = "writeonmvpstep1-1@test.com"; //todo: pass in username

    this.article = {
      "roleType": {
        "value": ["contract", "permanent"],
        "disabled": false,
        "rule": "assertStringContains"
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
        if (this.article.hasOwnProperty("id")){
          delete this.article._rev;
          loomApi.Article.updateArticle(this.article.id, modelId, modelType, this.article, token).then(angular.bind(this, function (result) {
            console.log("Update result:");
            console.log(result);
            result.success ? this.submitmessage = "Success" : this.submitmessage = "Error. " + result.message;
          }));
        }else {
          loomApi.Article.createArticle(this.article, modelId, modelType, authToken).then(angular.bind(this,function(result){
            console.log("Save result:");
            console.log(result);
            result.success
                ? (this.submitmessage = "Success",
                  this.article = result.data)
                :
                  this.submitmessage = "Error. " + result.message;
          }));
        }
      }
    }

    this.cancelComparisonRuleDocument = function(){
      window.history.back();
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