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
    'recruitUnitUtil',
    '$resource'
  ];

  function Controller($routeParams,$http,$cookies,$location,$router,$mdDialog,$window,loomApi,lodash,moment,recruitUnitUtil) {
    console.log("in UserLandingController");

    recruitUnitUtil.Util.setTitle("User Landing Page");

    //this.usercreated = $location.search().usercreated; //ref to get param from url
    this.useremail = $routeParams.email;
    this.username = "";
    this.role = "";
    this.id = "";
    this.status = "";
    this.myContentListArray = [];
    this.myContentListPassCount = 0;
    this.myContentListFailCount = 0;

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

    Controller.prototype.deleteItem = function(docId, index){
      console.log("delete id:" + docId + ",index:" + index);
      //todo: ensure the update can only change the users own document
      loomApi.Article.updateArticle(docId, controllerId, jobItemModel, {"published": false}, token).then(angular.bind(this,function(result){
        console.log("Delete result:");
        console.log(result);
        if (result.success){
          this.myContentListArray.splice(index, 1);
        }
      }));
    }

    Controller.prototype.formatUnixDateToNow = function(unixTime){
      return moment.unix(unixTime).from();
    }

    Controller.prototype.viewItem = function(id){
      //console.log("view id:" + id);
      $location.path("/user/" + this.useremail + "/form/" + id);
    }
  }

  Controller.prototype.canActivate = function($routeParams, recruitUnitUtil, jwtHelper, loomApi, lodash) {
    console.log("in UserLandingController canActivate");

    var token = jwtHelper.decodeToken(recruitUnitUtil.Util.getLocalUser().token); //todo: handle no token
    var tokenUsername = token.username;
    var requestedUsername = $routeParams.email;

    return recruitUnitUtil.Util.isUserAuthenticated(tokenUsername, recruitUnitUtil.Util.getLocalUser().token).then(angular.bind(this,function(result){
      if (result == false){
        recruitUnitUtil.Util.redirectUserToPath("/home");// todo: get path from constant;
      } else if (tokenUsername != requestedUsername) {
        recruitUnitUtil.Util.redirectUserToPath("/user/" + tokenUsername);
      } else if (result.success) {
          var comparisonRulesDocId = "";
          var controllerId = "server/services/recruitunit/articles/recruitUnitContentService.controller.js";
          var rulesModel = "server/models/RecruitUnit.ComparisonTest.js";
          var jobItemModel = "server/models/RecruitUnit.Job.All.js";
          var searchJson = {};
          var localToken = recruitUnitUtil.Util.getLocalUser().token;
          searchJson.authorName = requestedUsername;

          this.role = result.data.jobRole;
          this.id = result.data.id;
          this.username = result.data.displayName;

          loomApi.Article.search(controllerId, rulesModel, searchJson, localToken).then(function(result){
            console.log("get search:");
            console.log(result);
            if (result.length > 0){
              comparisonRulesDocId = result[0].id;//todo: handle no id
              return loomApi.Article.listMyTestContent(controllerId, comparisonRulesDocId, localToken);
            }
          }).then(angular.bind(this,function(listMyTestContentResult){
            if (typeof listMyTestContentResult !== 'undefined') {
              this.myContentListArray = lodash.sortBy(listMyTestContentResult, 'document.createdDate').reverse();
              this.myContentListPassCount = lodash.filter(listMyTestContentResult, {'testResult': {'isPass': true}}).length + lodash.filter(listMyTestContentResult, {'testResult': {'isPartialPass': true}}).length;
              this.myContentListFailCount = listMyTestContentResult.length - this.myContentListPassCount;

              return true; //return canActivate state once results are available
            }
          }));
      }

    }));
  }

})();