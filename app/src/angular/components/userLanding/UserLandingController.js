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
    '$window',
    'loomApi',
    'lodash',
    'moment',
    'recruitUnitUtil'
  ];

  function Controller($routeParams,$http,$cookies,$location,$router,$mdDialog,$window,loomApi,lodash,moment,recruitUnitUtil) {
    console.log("in UserLandingController");


    Controller.prototype.canActivate = function() {
      console.log("Executing UserLandingController canActivate");
      return true;
    };

    recruitUnitUtil.Util.setTitle("User Landing Page");

    //redirect depending on user authentication
    recruitUnitUtil.Util.redirectUserIfNotAuthenticated("/home");

    //this.usercreated = $location.search().usercreated; //ref to get param from url
    //routeParams
    this.useremail = $routeParams.email;
    this.username = "";
    this.role = "";
    this.id = "";
    this.status = "";
    this.myContentListArray = [];
    this.myContentListPassCount = 0;
    this.myContentListFailCount = 0;

    var comparisonRulesDocId = "";
    var controllerId = "server/services/recruitunit/articles/recruitUnitContentService.controller.js";
    var rulesModel = "server/models/RecruitUnit.ComparisonTest.js";
    var jobItemModel = "server/models/RecruitUnit.Job.All.js";
    var token = window.localStorage.getItem("writeon.authtoken");//handle no token
    var searchJson = {};
    searchJson.authorName = this.useremail;

    loomApi.User.getUser(this.useremail, token).then(angular.bind(this,function(result){
      console.log(result);
      if (result.success) {
        this.role = result.data.jobRole;
        this.id = result.data.id;
        this.username = result.data.displayName;

        loomApi.Article.search(controllerId, rulesModel, searchJson, token).then(function(result){
          console.log("get search:");
          console.log(result);
          if (result.length > 0){
            comparisonRulesDocId = result[0].id;//todo: handle no id
            return loomApi.Article.listMyTestContent(controllerId, comparisonRulesDocId, token);
          }
        }).then(angular.bind(this,function(listMyTestContentResult){
          if (typeof listMyTestContentResult !== 'undefined') {
            this.myContentListArray = lodash.sortBy(listMyTestContentResult, 'document.createdDate').reverse();
            this.myContentListPassCount = lodash.filter(listMyTestContentResult, {'testResult': {'isPass': true}}).length + lodash.filter(listMyTestContentResult, {'testResult': {'isPartialPass': true}}).length;
            this.myContentListFailCount = listMyTestContentResult.length - this.myContentListPassCount;
          }
        }));


        //useremail param will equal the submitTo field in 'RecruitUnitJobItem' doc

        // loomApi.Article.listMyTestContent(controllerId, comparisonRulesDocId, token).then(angular.bind(this,function(result){
        //   this.myContentList = lodash.sortBy(result,'document.createdDate').reverse();
        //   this.myContentListPassCount = lodash.filter(result, {'testResult':{'isPass':true}}).length + lodash.filter(result, {'testResult':{'isPartialPass':true}}).length;
        //   this.myContentListFailCount = result.length - this.myContentListPassCount;
        // }));
      } else {
        console.log(result.message);
      }
    }));

    Controller.prototype.showFormDetailDialog = function($event, id, isPass, isPartialPass){
      console.log("in showFormDetailDialog");
      console.log("   form id:" + id);
      $mdDialog.show({
            controller: 'FormReadController',
            controllerAs: 'formRead',
            locals: {'jobDetailFormId':id, 'isItemPass': isPartialPass || isPass ? true : false},
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

    Controller.prototype.formatUnixDateToNow = function(unixTime){
      return moment.unix(unixTime).from();
    }

    Controller.prototype.deleteItem = function(docId, index){
      console.log("delete id:" + docId + ",index:" + index);
      //todo: ensure the update can only change the users own document
      loomApi.Article.updateArticle(docId, controllerId, jobItemModel, {"published": false}, token).then(angular.bind(this,function(result){
        console.log("Delete result:");
        console.log(result);
        if (result.success){
          this.myContentList.splice(index, 1);
        }
      }));
    }

    Controller.prototype.viewItem = function(id){
      //console.log("view id:" + id);
      $location.path("/user/" + this.useremail + "/form/" + id);
    }

  }

})();