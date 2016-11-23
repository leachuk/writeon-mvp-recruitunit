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

  function Controller($routeParams, $http, $cookies, $mdDialog, $location, $window, loomApi, recruitUnitUtil) {
    console.log("ComparisonRuleController instantiated");

    recruitUnitUtil.Util.setTitle("Manage Comparison Rules");

    this.article = {"skills": []}; //Need to initialise for md-chips, otherwise an exception is thrown

    var localUser = recruitUnitUtil.Util.getLocalUser();
    var controllerId = "server/services/recruitunit/articles/recruitUnitContentService.controller.js";
    var model = "server/models/RecruitUnit.ComparisonTest.js";
    var token = window.localStorage.getItem("writeon.authtoken");//handle no token

    var searchJson = {};
    searchJson.authorEmail = localUser.email;

    this.article = { //initialise comparison rules article model
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
      "authorEmail": localUser.email,
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

      if(comparisonRuleForm.checkValidity()){ //comparisonRuleForm is form name
        console.log("model:");
        console.log(this.article);

        var authToken = recruitUnitUtil.Util.getLocalUser().token;
        var authEmail = recruitUnitUtil.Util.getLocalUser().email;
        var modelId = "server/services/recruitunit/articles/recruitUnitContentService.controller.js";
        var modelType = "server/models/RecruitUnit.ComparisonTest.js";
        if (this.article.hasOwnProperty("id")){//there is an existing comparisontest form, so update.
          delete this.article._rev;
          loomApi.Article.updateArticle(this.article.id, modelId, modelType, this.article, authToken).then(angular.bind(this, function (result) {
            console.log("Update result:");
            console.log(result);
            result.success ? recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_USER + authEmail) : this.submitmessage = "Error. " + result.message;
          }));
        }else {
          loomApi.Article.createArticle(this.article, modelId, modelType, authToken).then(angular.bind(this,function(result){
            console.log("Save result:");
            console.log(result);
            result.success
                ? (this.submitmessage = "Success",
                  this.article = result.data,
                  loomApi.User.updateUser(authEmail, {"isComparisonFormEnabled": true}, authToken).then(angular.bind(this,function(updateUserResult){
                    if (updateUserResult.success){
                      recruitUnitUtil.Util.deleteUserAuth();
                      recruitUnitUtil.Util.persistUserAuth(updateUserResult.token, authEmail);
                      recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_USER + authEmail);
                    }
                  }))
                  )
                :
                  this.submitmessage = "Error. " + result.message;
          }));
        }
      }
    }

    this.cancelComparisonRuleDocument = function(){
      window.history.back();
    }

  }

  Controller.prototype.canActivate = function(loomApi, $routeParams, recruitUnitUtil, jwtHelper) {
    console.log("in ComparisonRuleController canActivate");

    if (recruitUnitUtil.Util.isLocalUserAvailable()) {
      var decodedToken = jwtHelper.decodeToken(recruitUnitUtil.Util.getLocalUser().token);
      var tokenUsername = decodedToken.username;
      this.isComparisonFormEnabled = decodedToken.isComparisonFormEnabled;
      var requestedUsername = $routeParams.email;

      var controllerId = "server/services/recruitunit/articles/recruitUnitContentService.controller.js";
      var model = "server/models/RecruitUnit.ComparisonTest.js";
      var searchJson = {};
      searchJson.authorEmail = requestedUsername;

      return recruitUnitUtil.Util.isUserAuthenticated(tokenUsername, recruitUnitUtil.Util.getLocalUser().token).then(angular.bind(this, function (result) {
        if (result == false) {
          recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_HOME);// todo: get path from constant;
          recruitUnitUtil.Util.deleteUserAuth();
        } else if (tokenUsername != requestedUsername) {
          recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_USER + tokenUsername);
        } else if (result.success) {
          if (this.isComparisonFormEnabled) { //update the default form if it exists
            loomApi.Article.search(controllerId, model, searchJson, recruitUnitUtil.Util.getLocalUser().token).then(angular.bind(this, function (searchResult) {
              console.log("get search:");
              console.log(searchResult);
              if (searchResult.length > 0) {
                this.article = searchResult[0];
              }
              //this.article = searchResult;
            }));
          }

          return true;
        }
      }));
    } else {
      recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_HOME);
    }
  }

})();