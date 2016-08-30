(function() {
  'use strict';

  angular
    .module('app.user.formSubmitController')
    .controller('FormSubmitController', Controller);

  Controller.$inject = [
    '$routeParams',
    '$location',
    'loomApi',
    'recruitUnitUtil',
    'jwtHelper'
  ];

  //example child router. Component folder structure stays flat
  Controller.$routeConfig = [
    { path: '/create', component: 'testCreate' }
  ];

  function Controller($routeParams, $location, loomApi, recruitUnitUtil) {
    console.log("FormSubmitController instantiated");

    this.authenticatedUser = recruitUnitUtil.Util.getLocalUser();
    this.submitTo = $routeParams.email;
    this.article = {
      "jobDescription" : "",
      "roleType": "",
      "payBracketLower": null,
      "payBracketUpper": null,
      "locationDescription": "",
      "skills": [],
      "submitTo" : this.submitTo,
      "authorEmail" : this.authenticatedUser.email
    };

    //todo: move this outside of the Controller function.
    Controller.prototype.submitJobToCandidate = function(){
      console.log("in submitJobToCandidate");
      var authToken = this.authenticatedUser.token;

      //ToDo: handle if authToken is expired/not available. Redirect to login page?
      if(submitJobFromRecruiter.checkValidity() && typeof authToken != 'undefined'){ //submitJobFromRecruiter is form name
        console.log("model:");
        console.log(this.article);

        var modelId = "server/services/recruitunit/articles/recruitUnitContentService.controller.js";
        var modelType = "server/models/RecruitUnit.Job.All.js";
        loomApi.Article.saveArticle(this.article, modelId, modelType, authToken).then(angular.bind(this,function(saveResult){
          console.log("result:");
          console.log(saveResult);
          //ToDo: redirect to users homepage after success
          saveResult.success ? $location.path("/user/" + this.authenticatedUser.email) : this.submitmessage = "Error. " + saveResult.message;
        }));
      }
    };

  }

  Controller.prototype.canActivate = function(recruitUnitUtil, jwtHelper) {
    console.log("Executing FormSubmitController canActivate");

    var token = jwtHelper.decodeToken(this.authenticatedUser.token);
    var userJobRole = token.jobRole;
    console.log("job role:" + userJobRole);

    //recruitUnitUtil.Util.redirectUserIfNotAuthenticated("/home");
    return userJobRole == 'recruiter2' ? true : false;
  };

  Controller.prototype.canDeactivate = function(recruitUnitUtil, jwtHelper) {
    console.log("Executing FormSubmitController deactivate");
  };

})();