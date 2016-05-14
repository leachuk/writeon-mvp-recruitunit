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

    Controller.prototype.showFormDetailDialog = function($event, id){
      console.log("in showFormDetailDialog");
      console.log("   form id:" + id);
      $mdDialog.show({
            controller: DialogController,
            templateUrl:'./formReadDialog.html',
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

    var DialogController = function($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }
  }

})();