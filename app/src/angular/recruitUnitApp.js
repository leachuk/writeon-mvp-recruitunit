'use strict';
/*Initialise app*/
var recruitUnitApp = angular.module('recruitUnitApp', [
  'ngMaterial',
  'ngResource',
  'ngCookies',
  'ngNewRouter',
  'loom.api',
  'ngLodash',
  'angularMoment',
  'angular-jwt',
  'app.homeController',
  'app.user.userLandingController',
  'app.user.recruiterLandingController',
  'app.user.developerLandingController',
  'app.user.recruiterAdminController',
  'app.user.developerAdminController',
  'app.testCreate',
  'app.user.formSubmitController',
  'app.user.formReadController',
  'app.user.comparisonRuleController',
  'recruitunit.util'
]).controller('AppController', ['$router', '$mdComponentRegistry', 'loomApi', 'recruitUnitUtil', AppController])
.config(['$componentLoaderProvider', '$locationProvider', '$httpProvider', '$mdIconProvider', function($componentLoaderProvider, $locationProvider, $httpProvider, $mdIconProvider){
  $componentLoaderProvider.setTemplateMapping(function (name) {
    return 'src/angular/components/' + name + '/' + name + '.html';
  });
  $locationProvider.html5Mode(true);
  $mdIconProvider
    .iconSet('action', './assets/svg/action-icons.svg', 24)
    .iconSet('content', './assets/svg/content-icons.svg', 24)
    .iconSet('av', './assets/svg/av-icons.svg', 24)
    .iconSet('navigation', './assets/svg/navigation-icons.svg', 24)
    .iconSet('social', './assets/svg/social-icons.svg', 24)
    .defaultIconSet('./assets/svg/action-icons.svg');
}]);

function AppController($router, $mdComponentRegistry, loomApi, recruitUnitUtil) {
  var sideNav;
  this.user = { //todo: handle when user isn't signed in. Prob create service
    email: window.localStorage.getItem("writeon.username"),
    password: ""
  };
  this.submitmessage = "";
  
  $mdComponentRegistry.when('sidenav-main').then(function(mainSideNav){
    sideNav = mainSideNav;
    //mainSideNav.open();
    //console.log(mainSideNav.isOpen());
  });
  //$mdSidenav('left').open();
  $router.config([
    { path: '/', redirectTo: '/home' },
    { path: '/home', component: 'home' },
    { path: '/developer/:email', components: {default : 'developerLanding', form: 'formSubmit'} },
    { path: '/recruiter/:email', component: 'recruiterLanding' },
    { path: '/admin/recruiter/:email', component: 'recruiterAdmin' },
    { path: '/admin/developer/:email', component: 'developerAdmin' },
    { path: '/user/:email', component: 'userLanding' },
    { path: '/user/:email/comparisonrules', component: 'comparisonRule' },
    { path: '/user/:email/form', component: 'formSubmit' },
    { path: '/user/:email/form/:id', component: 'formRead' }
  ]);

  AppController.prototype.test = function() {
    console.log("test");
  }

  AppController.prototype.toggleSideNav = function() {
    sideNav.toggle();
  }

  //login existing user
  AppController.prototype.signInUser = function(){
    console.log("in signInUser");
    console.log(this.user);

    loomApi.User.signInUser(this.user.email, this.user.password).then(angular.bind(this,function(result, status, headers, config){
      console.log(result);
      console.log(status);
      console.log(headers);
      console.log(config);

      result.success
          ?
          (recruitUnitUtil.Util.persistUserAuth(result.token, this.user.email),
              this.user.email = "",
              this.user.password = "",
              this.submitmessage = "")
          :
          this.submitmessage = "Error. " + result.data.message;
      //console.log(this.submitmessage);
    }));
  };
}


