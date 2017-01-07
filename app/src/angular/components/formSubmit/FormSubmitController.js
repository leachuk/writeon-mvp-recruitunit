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

  function Controller($routeParams, $location, loomApi, recruitUnitUtil, jwtHelper) {
    console.log("FormSubmitController instantiated");
    recruitUnitUtil.Util.setTitle("Submit Form Page");

    var authToken = recruitUnitUtil.Util.getLocalUser().token;
    var token = jwtHelper.decodeToken(authToken);
    var tokenUsername = token.username;
    var tokenRoles = token.roles;
    this.isDeveloper = tokenRoles.indexOf(recruitUnitUtil.Constants.RECRUITER_ROLE) == -1;
    this.authenticatedUser = recruitUnitUtil.Util.getLocalUser();
    this.submitTo = $routeParams.guid;

    if(!this.isDeveloper) {
      loomApi.User.getUserFromGuid($routeParams.guid, authToken).then(angular.bind(this, function (result) {
        this.user = result;
      }));
    }
    this.payFrequencyOptions = [
      {id: "Permanent", value: "annual salary"},
      {id: "Contract", value: "daily rate"}
    ];
    this.article = {
      "jobDescription" : "",
      "roleType": "",
      "payBracketLower": null,
      "payBracketUpper": null,
      "locationDescription": "",
      "skills": [],
      "submitTo" : this.submitTo,
      "authorEmail" : this.authenticatedUser.email,
      "published" : true
    };

    Controller.prototype.submitJobToCandidate = function(){
      console.log("in submitJobToCandidate");
      var authToken = recruitUnitUtil.Util.getLocalUser().token;

      if(submitJobFromRecruiter.checkValidity() && typeof authToken != 'undefined'){ //submitJobFromRecruiter is form name
        console.log("model:");
        console.log(this.article);

        loomApi.Article.createJobSubmission(this.article, authToken).then(angular.bind(this,function(saveResult){
          console.log("result:");
          console.log(saveResult);

          saveResult.success ? $location.path("/user/" + this.authenticatedUser.email) : this.submitmessage = "Error. " + saveResult.message;
        }));
      }
    };

  }

  //only activate controller if user role is 'recruiter'
  Controller.prototype.canActivate = function(recruitUnitUtil, jwtHelper) {
    var token = jwtHelper.decodeToken(recruitUnitUtil.Util.getLocalUser().token); //todo: handle no token
    var userRoles = token.roles;
    var tokenUsername = token.username;

    return recruitUnitUtil.Util.isUserAuthenticated(tokenUsername, recruitUnitUtil.Util.getLocalUser().token).then(angular.bind(this,function(result) {
      if (result == false) {
        recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_HOME);
      } else if (result.success) {
        this.userName = tokenUsername;
        return true;
      }
    }));
  }

})();