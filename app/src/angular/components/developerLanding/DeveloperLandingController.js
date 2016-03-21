(function() {
  'use strict';

  angular
    .module('app.user.developerLandingController')
    .controller('DeveloperLandingController', Controller);

  Controller.$inject = [
    '$routeParams',
    '$http',
    '$cookies',
    '$location',
    'loomApi'
  ];

  function Controller($routeParams,$http,$cookies,$location,loomApi) {
    console.log("in DeveloperLandingController");

    //this.usercreated = $location.search().usercreated; //ref to get param from url
    //routeParams
    var token = window.localStorage.getItem("writeon.authtoken");//handle no token
    this.submitmessage = "";
    this.loggedinuser = {};
    this.loggedinuser.email = window.localStorage.getItem("writeon.username");
    this.loggedinuser.role = "";
    this.useremail = $routeParams.email;
    this.role = "";
    this.id = "";

    this.article = {
      "jobDescription" : "",
      "roleType": "",
      "payBracketLower": null,
      "payBracketUpper": null,
      "locationDescription": "",
      "skills": ['node', 'java', 'html', 'grunt']
    };


    loomApi.User.getSpecifiedUser(this.useremail, token).then(angular.bind(this,function(result){
      console.log(result);
      if (result.success) {
        this.role = result.data.jobRole;
        this.id = result.data.id;
      } else {
        console.log(result.message);
      }
    }));

    loomApi.User.getUser(this.loggedinuser.email, token).then(angular.bind(this,function(result){
      console.log(result);
      if (result.success) {
        this.loggedinuser.role = result.data.jobRole;
      } else {
        console.log(result.message);
      }
    }));

    Controller.prototype.submitJobToCandidate = function() {
      console.log("in submitJobToCandidate");

      if (submitJobFromRecruiter.checkValidity()) { //submitJobFromRecruiter is form name
        console.log("model:");
        console.log(this.article);

        loomApi.Article.saveArticle(this.article, 'server/services/recruitunit/articles/recruitUnitContentService.controller.js', token).then(angular.bind(this, function (saveResult) {
          console.log("result:");
          console.log(saveResult);
          saveResult.success ? this.submitmessage = "Success message" : this.submitmessage = "Error. " + saveResult.message;
        }));
      }
    }

  }


})();