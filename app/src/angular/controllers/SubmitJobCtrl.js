'use strict';

angular.module('recruitUnitApp')
  .controller('SubmitJobCtrl', SubmitJobCtrl);

SubmitJobCtrl.$inject = ['$http', 'loomApi'];

function SubmitJobCtrl($http, loomApi) {
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

  //abstract to an auth API service, in loomApi
  var doAuth = function(username, password){
    var data = {};
    data.username = username;
    data.password = password;
    //console.log(data);

    //this is generating the hash on the server (so extra data can be added to the token), could also be done on the client using Base64Service.encode
    //url will be replaced by config in loom.api service
    $http.post('http://localhost:9000/api/users/signin', data).
      success(function(outdata, status, headers, config) {
        //console.log(outdata);
        window.localStorage.setItem("writeon.authtoken", outdata.token);
        return outdata.token;
      }).
      error(function(data, status, headers, config) {
        console.log("Invalid login attempt: " + data);
        //submitJobFromRecruiter.$setValidity("unauthorised", false); //need to find how to $setValidity in angular2
        return data;
      });
  };

  SubmitJobCtrl.prototype.submitJobToCandidate = function(){
    console.log("in submitJobForm");

    var localAuthHash = window.localStorage.getItem("writeon.authtoken");
    var authHash = localAuthHash != null ? localAuthHash : doAuth("writeonmvpstep1-1@test.com", "12345678");//how to persist name/password??

    if(submitJobFromRecruiter.checkValidity()){ //submitJobFromRecruiter is form name
      console.log("model:");
      console.log(self.article);

      loomApi.Article.saveArticle(sampleDoc, authHash).then(angular.bind(this,function(result){
        console.log("result:");
        console.log(result);
        result.success ? self.submitmessage = "Success message" : this.submitmessage = "Error. " + result.message;
      }));
    }
  };
}