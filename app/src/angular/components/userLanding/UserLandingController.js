(function() {
  'use strict';

  angular
    .module('app.user.userLandingController')
    .controller('UserLandingController', Controller)
    .controller('RequireComparisonFormDialogController', DialogController);

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
    '$mdPanel'
  ];

  function Controller($routeParams,$http,$cookies,$location,$router,$mdDialog,$window,loomApi,lodash,moment,recruitUnitUtil,$mdPanel) {
    console.log("in UserLandingController");

    recruitUnitUtil.Util.setTitle("User Landing Page");

    //this.usercreated = $location.search().usercreated; //ref to get param from url
    this.useremail = $routeParams.email;
    this.username = "";
    this.roles = "";
    this.id = "";
    this.status = "";
    this.myContentListArray = [];
    this.myContentListPassCount = 0;
    this.myContentListFailCount = 0;

    this.template = "src/angular/components/userLanding/requireComparisonFormDialog.html";
    this._mdPanel = $mdPanel;
    this.openFrom = 'button';
    this.closeTo = 'button';

    Controller.prototype.showPanel = function() {
      console.log("in showPanel()");
      var panelPosition = this._mdPanel.newPanelPosition()
          .absolute()
          .center();

      var panelAnimation = this._mdPanel.newPanelAnimation();
      panelAnimation.openFrom({top:0, left:0});
      panelAnimation.closeTo({top:document.documentElement.clientHeight, left:0});
      panelAnimation.withAnimation(this._mdPanel.animation.SCALE);

      var config = {
        attachTo: angular.element(document.body),
        controller: 'RequireComparisonFormDialogController',
        controllerAs: 'requireComparisonFormDialog',
        position: panelPosition,
        animation: panelAnimation,
        templateUrl: this.template,
        hasBackdrop: true,
        panelClass: 'demo-dialog-example',
        zIndex: 150,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: true
      }

      this._mdPanel.open(config);
    }

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
      var controllerId = "server/services/recruitunit/articles/recruitUnitContentService.controller.js";
      var jobItemModel = "server/models/RecruitUnit.Job.All.js";
      var localToken = recruitUnitUtil.Util.getLocalUser().token;
      loomApi.Article.updateArticle(docId, controllerId, jobItemModel, {"published": false}, localToken).then(angular.bind(this,function(result){
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

    Controller.prototype.searchDeveloper = function(searchJson){
      var comparisonRulesDocId = "";
      var controllerId = "server/services/recruitunit/articles/recruitUnitContentService.controller.js";
      var rulesModel = "server/models/RecruitUnit.ComparisonTest.js";
      var localToken = recruitUnitUtil.Util.getLocalUser().token;

      loomApi.Article.search(controllerId, rulesModel, searchJson, localToken).then(function (result) {
        console.log("get search:");
        console.log(result);
        if (result.length > 0) {
          comparisonRulesDocId = result[0].id;//todo: handle no id
          return loomApi.Article.listMyTestContent(controllerId, comparisonRulesDocId, localToken);
        }
      }).then(angular.bind(this, function (listMyTestContentResult) {
        if (typeof listMyTestContentResult !== 'undefined') {
          this.myContentListArray = lodash.sortBy(listMyTestContentResult, 'document.createdDate').reverse();
          this.myContentListPassCount = lodash.filter(listMyTestContentResult, {'testResult': {'isPass': true}}).length + lodash.filter(listMyTestContentResult, {'testResult': {'isPartialPass': true}}).length;
          this.myContentListFailCount = listMyTestContentResult.length - this.myContentListPassCount;

          return true; //return canActivate state once results are available
        }
      }));
    }

    Controller.prototype.searchRecruiter = function(searchJson){
      var comparisonRulesDocId = "";
      var controllerId = "server/services/recruitunit/articles/recruitUnitContentService.controller.js";
      var rulesModel = "server/models/RecruitUnit.ComparisonTest.js";
      //var jobItemModel = "server/models/RecruitUnit.Job.All.js";
      var localToken = recruitUnitUtil.Util.getLocalUser().token;

      loomApi.Article.getUserTestResults(controllerId, searchJson.authorEmail, localToken).then(angular.bind(this, function (listMyTestContentResult) {
        console.log("getUserTestResults:");
        console.log(listMyTestContentResult);
        if (typeof listMyTestContentResult !== 'undefined') {
          this.myContentListArray = lodash.sortBy(listMyTestContentResult, 'document.createdDate').reverse();
          this.myContentListPassCount = lodash.filter(listMyTestContentResult, {'testResult': {'isPass': true}}).length + lodash.filter(listMyTestContentResult, {'testResult': {'isPartialPass': true}}).length;
          this.myContentListFailCount = listMyTestContentResult.length - this.myContentListPassCount;

          return true; //return canActivate state once results are available
        }
      }));
    }
  }

  Controller.prototype.canActivate = function($routeParams, recruitUnitUtil, jwtHelper) {
    console.log("in UserLandingController canActivate");

    if (recruitUnitUtil.Util.isLocalUserAvailable()) {
      var token = jwtHelper.decodeToken(recruitUnitUtil.Util.getLocalUser().token);
      var tokenUsername = token.username;
      var tokenRoles = token.roles;
      var requestedUsername = $routeParams.email;

      return recruitUnitUtil.Util.isUserAuthenticated(tokenUsername, recruitUnitUtil.Util.getLocalUser().token).then(angular.bind(this, function (result) {
        if (result == false) {
          recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_HOME);// todo: get path from constant;
          recruitUnitUtil.Util.deleteUserAuth();
        } else if (tokenUsername != requestedUsername) {
          recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_USER + tokenUsername);
        } else if (result.success) {
            this.roles = result.data.roles;
            this.id = result.data.id;
            this.username = result.data.displayName;
            if (tokenRoles.indexOf("recruiter") != -1){
              var searchJson = {
                "authorEmail": requestedUsername
              };
              return this.searchRecruiter(searchJson);
            } else if (tokenRoles.indexOf("developer") != -1){
              var searchJson = {
                "authorEmail": requestedUsername
              };
              return this.searchDeveloper(searchJson);
            }
        }

      }));
    } else {
      recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_HOME);
    }
  }

  function DialogController(mdPanelRef) {
    this._mdPanelRef = mdPanelRef;
  }

  DialogController.prototype.closePanel = function() {
    console.log("close panel");
    var panelRef = this._mdPanelRef;

    panelRef.close()
  }

})();