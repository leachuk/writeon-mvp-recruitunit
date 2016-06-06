(function() {
  'use strict';

  angular
    .module('app.user.userLandingController')
    .controller('UserLandingController', Controller);

  Controller.$inject = [
    '$routeParams',
    '$http',
    '$cookies',
    '$location',
    '$router',
    '$mdDialog',
    'loomApi'
  ];

  function Controller($routeParams,$http,$cookies,$location,$router,$mdDialog,loomApi) {
    console.log("in UserLandingController");

    //this.usercreated = $location.search().usercreated; //ref to get param from url
    //routeParams
    this.useremail = $routeParams.email;
    this.username = "";
    this.role = "";
    this.id = "";
    this.status = "";

    var token = window.localStorage.getItem("writeon.authtoken");//handle no token

    loomApi.User.getUser(this.useremail, token).then(angular.bind(this,function(result){
      console.log(result);
      if (result.success) {
        this.role = result.data.jobRole;
        this.id = result.data.id;
        this.username = result.data.displayName;
      } else {
        console.log(result.message);
      }
    }));

    //testing comparison. Not to be used on the client as too many requests would be required
    Controller.prototype.compare = function(){
      loomApi.Article.compare("comparisonDocumentTest1","54e36e2ae5b03230adcb77aaa5001059", token).then(angular.bind(this,function(result){
        console.log("Comparison result:");
        console.log(result);
      }));
    }


    Controller.prototype.showFormDetailDialog = function($event, id){
      console.log("in showFormDetailDialog");
      console.log("   form id:" + id);
      $mdDialog.show({
            controller: 'FormReadController',
            controllerAs: 'formRead',
            locals: {'jobDetailFormId':id},
            bindToController: true,
            templateUrl: 'src/angular/components/formRead/formReadDialog.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose:true,
            fullscreen: false
      }).then(function(answer) {
        //this.status = 'You said the information was "' + answer + '".';
      }, function() {
        //this.status = 'You cancelled the dialog.';
      });
    }

    //useremail will equal the submitTo field in 'RecruitUnitJobItem' doc
    Controller.prototype.getUserDocuments = function(){
      console.log(token);
      var modelId = 'server/services/recruitunit/articles/recruitUnitContentService.controller.js';
      loomApi.Article.listAllMyArticles(modelId, token).then(angular.bind(this,function(result){
        console.log("RecruitUnit listAllMyArticles result:");
        console.log(result);
      }));
    }

  }

})();