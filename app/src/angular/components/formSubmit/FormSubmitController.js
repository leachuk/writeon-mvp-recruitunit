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

    Controller.prototype.submitJobToCandidate = function(){
      console.log("in submitJobToCandidate");
      var authToken = $cookies.get("writeon.authtoken");

      //ToDo: handle if authToken is expired/not available. Redirect to login page?
      if(submitJobFromRecruiter.checkValidity() && typeof authToken != 'undefined'){ //submitJobFromRecruiter is form name
        console.log("model:");
        console.log(this.article);

        loomApi.Article.saveArticle(this.article, 'server/services/recruitunit/articles/recruitUnitContentService.controller.js', authToken).then(angular.bind(this,function(saveResult){
          console.log("result:");
          console.log(saveResult);
          //ToDo: redirect to users homepage after success
          saveResult.success ? this.submitmessage = "Success message" : this.submitmessage = "Error. " + saveResult.message;
        }));
      }
    };

  }

})();