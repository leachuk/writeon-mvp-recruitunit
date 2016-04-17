(function() {
  'use strict';

  angular
    .module('app.user.formSubmitController')
    .controller('FormSubmitController', Controller);

  Controller.$inject = [
    '$routeParams',
    '$http',
    '$cookies',
    'loomApi'
  ];

  //example child router. Component folder structure stays flat
  Controller.$routeConfig = [
    { path: '/create', component: 'testCreate' }
  ];

  function Controller($routeParams,$http,$cookies,loomApi) {
    console.log("FormSubmitController instantiated");
    this.formId = $routeParams.id;

    this.article = {
      "jobDescription" : "",
      "roleType": "",
      "payBracketLower": null,
      "payBracketUpper": null,
      "locationDescription": "",
      "skills": ['node', 'java', 'html', 'grunt'],
      "submitTo" : "",
      "submittedBy" : ""
    };

    var checkAuth = function(username, password){
      var authCookie = $cookies.get("writeon.authtoken"); //put cookie name into config var
      return typeof authCookie != 'undefined' ? authCookie : loomApi.User.signInUser(username, password).then(angular.bind(this, function(result){
        $cookies.put("writeon.authtoken", result.token);
        this.authToken = result.token; //required angular.bind to enable setting of scope variable within promise
      }));
    };
    this.authToken = checkAuth("writeonmvpstep1-1@test.com", "12345678");

    Controller.prototype.submitJobToCandidate = function(){
      console.log("in submitJobToCandidate");

      if(submitJobFromRecruiter.checkValidity()){ //submitJobFromRecruiter is form name
        console.log("model:");
        console.log(this.article);

        loomApi.Article.saveArticle(this.article, 'server/services/recruitunit/articles/recruitUnitContentService.controller.js', this.authToken).then(angular.bind(this,function(saveResult){
          console.log("result:");
          console.log(saveResult);
          saveResult.success ? this.submitmessage = "Success message" : this.submitmessage = "Error. " + saveResult.message;
        }));
      }
    };
  }

})();