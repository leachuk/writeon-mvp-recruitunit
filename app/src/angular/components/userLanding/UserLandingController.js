(function() {
  'use strict';

  angular
    .module('app.user.userLandingController')
    .controller('UserLandingController', Controller)
    .controller('RequireComparisonFormDialogController', DialogController)
    .controller('ContactMeDialogController', DialogController);

  Controller.$inject = [
    '$routeParams',
    '$http',
    '$cookies',
    '$location',
    '$router',
    '$mdDialog',
    '$window',
    '$mdMedia',
    'loomApi',
    'lodash',
    'moment',
    'recruitUnitUtil',
    '$mdPanel',
    'jwtHelper'
  ];

  function Controller($routeParams,$http,$cookies,$location,$router,$mdDialog,$window,$mdMedia,loomApi,lodash,moment,recruitUnitUtil,$mdPanel,jwtHelper) {
    console.log("in UserLandingController");

    //recruitUnitUtil.Util.setTitle("User Landing Page");

    //this.usercreated = $location.search().usercreated; //ref to get param from url
    this.$mdMedia = $mdMedia;
    this.useremail = $routeParams.email;
    this.username = "";
    this.userguid = "";
    this.roles = "";
    this.id = "";
    this.status = "";
    this.myContentListArray = [];
    this.myContentListPassCount = 0;
    this.myContentListFailCount = 0;
    this.userFormUrl = "";
    this.isDeveloper = false;

    this.comparisonFormTemplate = "src/angular/components/userLanding/requireComparisonFormDialog.html";
    this.enableContactMeTemplate = "src/angular/components/userLanding/enableContactMeDialog.html";
    this.disableContactMeTemplate = "src/angular/components/userLanding/disableContactMeDialog.html";
    this.unitTestFormTemplate = "src/angular/components/userLanding/unitTestFormDialog.html";
    this._mdPanel = $mdPanel;
    this.openFrom = 'button';
    this.closeTo = 'button';

    Controller.prototype.showFormDetailDialog = function($event, id, isPass, isPartialPass){
      console.log("in showFormDetailDialog");
      console.log("form id:" + id);
      $mdDialog.show({
        controller: 'FormReadController',
        controllerAs: 'formRead',
        locals: {
          'jobDetailFormId':id,
          'isItemPass': isPartialPass || isPass ? true : false,
          'payFrequencyOptions': [
            {id: "Permanent", value: "annual salary"},
            {id: "Contract", value: "daily rate"}
          ]
        },
        bindToController: true,
        templateUrl: 'src/angular/components/formRead/formReadDialog.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        clickOutsideToClose:true,
        fullscreen: true
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

    Controller.prototype.searchUser = function(searchJson){
      var comparisonRulesDocId = "";
      var localToken = recruitUnitUtil.Util.getLocalUser().token;

      loomApi.Article.getUserTestResults(searchJson, localToken).then(angular.bind(this, function (listMyTestContentResult) {
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

    Controller.prototype.navigateToUserRules = function(useremail){
      recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_USER +  useremail + recruitUnitUtil.Constants.PATH_COMPARISONRULESFORM);
    }

    Controller.prototype.getDeveloperEmailAddress = function(docId, isDeveloper, displayDevEmail){
      if (!isDeveloper && displayDevEmail){
        var localToken = recruitUnitUtil.Util.getLocalUser().token;

        return loomApi.User.getDevEmailFromDocId(docId, localToken).then(angular.bind(this,function(result){
          return typeof result.email !== "undefined" ? result.email : result.message;
        }));
      }
    }

    //check if the user has a comparison test form and is a developer. Show alert dialog if not
    if (recruitUnitUtil.Util.getLocalUser().token !== null) {
      var decodedToken = jwtHelper.decodeToken(recruitUnitUtil.Util.getLocalUser().token);
      if (decodedToken.isComparisonFormEnabled) {
        console.log("User has a comparison form enabled");
      } else if (decodedToken.roles.indexOf(recruitUnitUtil.Constants.DEVELOPER_ROLE) != -1) {
        this.showPanel();
      }
    }
  }

  Controller.prototype.showPanel = function() {
    console.log("in showPanel");
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
      locals: {
        'useremail': this.useremail,
        'navigateToUserRules': this.navigateToUserRules
      },
      position: panelPosition,
      animation: panelAnimation,
      templateUrl: this.comparisonFormTemplate,
      hasBackdrop: true,
      panelClass: 'generic-dialog',
      zIndex: 150,
      clickOutsideToClose: true,
      escapeToClose: true,
      focusOnOpen: true
    }

    this._mdPanel.open(config);
  }

  Controller.prototype.toggleContactMeDialog = function($event, id, displayDevEmail, repeatScope) {
    console.log("in toggleContactMeDialog");

    var panelPosition = this._mdPanel.newPanelPosition()
        .absolute()
        .center();
    var panelAnimation = this._mdPanel.newPanelAnimation();
    panelAnimation.openFrom({top:0, left:0});
    panelAnimation.closeTo({top:document.documentElement.clientHeight, left:0});
    panelAnimation.withAnimation(this._mdPanel.animation.SCALE);

    var config = {
      attachTo: angular.element(document.body),
      controller: DialogController,
      controllerAs: 'contactMeDialog',
      locals: {
        'docId' : id,
        'isDisplayDevEmail': displayDevEmail,
        'isDeveloper' : this.isDeveloper,
        'developerEmailAddress' : this.getDeveloperEmailAddress(id, this.isDeveloper, displayDevEmail),
        itemScope : repeatScope
      },
      bindToController: true,
      position: panelPosition,
      animation: panelAnimation,
      templateUrl: this.enableContactMeTemplate,
      hasBackdrop: true,
      panelClass: 'generic-dialog',
      zIndex: 150,
      clickOutsideToClose: true,
      escapeToClose: true,
      focusOnOpen: true
    }

    this._mdPanel.open(config);
  }

  Controller.prototype.toggleUnitTestFormDialog = function($event, unitTestFormUrl) {
    console.log("in toggleUnitTestFormDialog");

    var panelPosition = this._mdPanel.newPanelPosition()
        .absolute()
        .center();
    var panelAnimation = this._mdPanel.newPanelAnimation();
    panelAnimation.openFrom({top:0, left:0});
    panelAnimation.closeTo({top:document.documentElement.clientHeight, left:0});
    panelAnimation.withAnimation(this._mdPanel.animation.SCALE);

    var config = {
      attachTo: angular.element(document.body),
      controller: DialogController,
      controllerAs: 'unitTestFormDialog',
      locals: {
        'testFormUrl' : unitTestFormUrl
      },
      bindToController: true,
      position: panelPosition,
      animation: panelAnimation,
      templateUrl: this.unitTestFormTemplate,
      hasBackdrop: true,
      panelClass: 'generic-dialog',
      zIndex: 150,
      clickOutsideToClose: true,
      escapeToClose: true,
      focusOnOpen: true
    }

    this._mdPanel.open(config);
  }

  Controller.prototype.canActivate = function($routeParams, recruitUnitUtil, jwtHelper) {
    console.log("in UserLandingController canActivate");

    if (recruitUnitUtil.Util.isLocalUserAvailable()) {
      var token = jwtHelper.decodeToken(recruitUnitUtil.Util.getLocalUser().token);
      var tokenUsername = token.username;
      var tokenRoles = token.roles;
      var requestedUsername = $routeParams.email;

      var serverUrl = recruitUnitUtil.Constants.APP_PROTOCOL + recruitUnitUtil.Constants.APP_HOST + ":" + recruitUnitUtil.Constants.APP_PORT;

      return recruitUnitUtil.Util.isUserAuthenticated(tokenUsername, recruitUnitUtil.Util.getLocalUser().token).then(angular.bind(this, function (result) {
        if (result == false) {
          recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_HOME);// todo: get path from constant;
          recruitUnitUtil.Util.deleteUserAuth();
        } else if (tokenUsername != requestedUsername) {
          recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_USER + tokenUsername);
        } else if (result.success) {
            //set user details returned from the jwt
            this.roles = result.data.roles;
            this.id = result.data.id;
            this.username = result.data.displayName;
            this.userGuid = result.data.userGuid;
            this.userFormUrl = serverUrl + recruitUnitUtil.Constants.PATH_USER + this.userGuid + "/form";

            if (tokenRoles.indexOf("recruiter") != -1){
              var searchJson = {
                "authorEmail": tokenUsername
              };
              return this.searchUser(searchJson);
            } else if (tokenRoles.indexOf("developer") != -1){
              this.isDeveloper = true;
              var searchJson = {
                "submitTo": this.userGuid
              };
              return this.searchUser(searchJson);
            }
        }

      }));
    } else {
      recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_HOME);
    }
  }

  function DialogController(mdPanelRef, loomApi, recruitUnitUtil) {
    this._mdPanelRef = mdPanelRef;


    DialogController.prototype.toggleContactMe = function(docId, repeatScope) {
      console.log("confirmContactMe docId:" + docId);

      var panelRef = this._mdPanelRef;
      var localToken = recruitUnitUtil.Util.getLocalUser().token;

      loomApi.Article.toggleDevEmailDisplay(docId, localToken).then(angular.bind(this,function(result){
        console.log("toggleDevEmailDisplay result:");
        console.log(result);
        repeatScope.item.document.displayDevEmail = result.displayDevEmail;
      }));

      panelRef.close()
    }

    DialogController.prototype.copyUnitTestFormUrl = function(testFormUrl) {
      console.log("copyUnitTestFormUrl testFormUrl:" + testFormUrl);

      var panelRef = this._mdPanelRef;

      // Copies a string to the clipboard. Must be called from within an
      // event handler such as click. May return false if it failed, but
      // this is not always possible. Browser support for Chrome 43+,
      // Firefox 42+, Safari 10+, Edge and IE 10+.
      // IE: The clipboard feature may be disabled by an administrator. By
      // default a prompt is shown the first time the clipboard is
      // used (per session).
      var text = testFormUrl;
      if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);

      } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
          return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
          console.warn("Copy to clipboard failed.", ex);
          return false;
        } finally {
          document.body.removeChild(textarea);
          panelRef.close()
        }
      }

    }
  }

  DialogController.prototype.closePanel = function() {
    console.log("close panel");
    var panelRef = this._mdPanelRef;

    panelRef.close()
  }




})();