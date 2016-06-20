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
    'loomApi',
    'lodash',
    'moment'
  ];

  function Controller($routeParams,$http,$cookies,$location,$router,$mdDialog,loomApi,lodash,moment) {
    console.log("in UserLandingController");

    //this.usercreated = $location.search().usercreated; //ref to get param from url
    //routeParams
    this.useremail = $routeParams.email;
    this.username = "";
    this.role = "";
    this.id = "";
    this.status = "";
    this.myContentList = {};
    this.myContentListPassCount = 0;
    this.myContentListFailCount = 0;

    var token = window.localStorage.getItem("writeon.authtoken");//handle no token

    loomApi.User.getUser(this.useremail, token).then(angular.bind(this,function(result){
      console.log(result);
      if (result.success) {
        this.role = result.data.jobRole;
        this.id = result.data.id;
        this.username = result.data.displayName;

        //useremail param will equal the submitTo field in 'RecruitUnitJobItem' doc
        var modelId = 'server/services/recruitunit/articles/recruitUnitContentService.controller.js';
        loomApi.Article.listMyTestContent(modelId, token).then(angular.bind(this,function(result){
          this.myContentList = result;
          this.myContentListPassCount = lodash.filter(result, {'testResult':{'isPass':true}}).length + lodash.filter(result, {'testResult':{'isPartialPass':true}}).length;
          this.myContentListFailCount = result.length - this.myContentListPassCount;
        }));
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


  }

})();