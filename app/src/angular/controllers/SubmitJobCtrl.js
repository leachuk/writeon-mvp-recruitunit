'use strict';

angular.module('recruitUnitApp')
  .controller('SubmitJobCtrl', SubmitJobCtrl);

SubmitJobCtrl.$inject = ['$http', '$cookies', 'loomApi'];

function SubmitJobCtrl($http, $cookies, loomApi) {
  console.log("in SubmitJobCtrl");

  var self = this;
  self.article = {
    "jobDescription" : "",
    "roleType": "",
    "payBracketLower": null,
    "payBracketUpper": null,
    "locationDescription": "",
    "skills": ['node', 'java', 'html', 'grunt']
  };
  var sampleDoc = {
    "_id": "RecruitUnit Article 6",
    "authorEmail": "writeonmvpstep1-1@test.com",
    "authorName": "writeonmvpstep1-1@test.com"
  };

  self.submitmessage = "message placeholder";

  //abstract to an client util service
  var checkResponseForReAuth = function(result){

    if(result.error = "unauthorized"){

    } else {

    }
  }

  var checkAuth = function(username, password){
    var authCookie = $cookies.get("writeon.authtoken"); //put cookie name into config var
    return typeof authCookie != 'undefined' ? authCookie : loomApi.User.signInUser(username, password).then(angular.bind(this, function(result){
      $cookies.put("writeon.authtoken", result.token);
      self.authToken = result.token; //required angular.bind to enable setting of scope variable within promise
    }));
  };
  self.authToken = checkAuth("writeonmvpstep1-1@test.com", "12345678");

  SubmitJobCtrl.prototype.submitJobToCandidate = function(){
    console.log("in submitJobForm");

    if(submitJobFromRecruiter.checkValidity()){ //submitJobFromRecruiter is form name
      console.log("model:");
      console.log(self.article);

      loomApi.Article.createArticle(self.article, 'server/services/recruitunit/articles/recruitUnitContentService.controller.js', self.authToken).then(angular.bind(this,function(saveResult){
        console.log("result:");
        console.log(saveResult);
        saveResult.success ? self.submitmessage = "Success message" : self.submitmessage = "Error. " + saveResult.message;
      }));
    }
  };
}