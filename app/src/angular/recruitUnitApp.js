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
  'app.homeController',
  'app.user.userLandingController',
  'app.user.recruiterLandingController',
  'app.user.developerLandingController',
  'app.user.recruiterAdminController',
  'app.user.developerAdminController',
  'app.testCreate',
  'app.user.formSubmitController',
  'app.user.formReadController',
  'app.user.comparisonRuleController'
]).controller('AppController', ['$router', '$mdComponentRegistry', AppController])
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

function AppController($router, $mdComponentRegistry) {
  var sideNav;
  this.user = { //todo: handle when user isn't signed in. Prob create service
    email: window.localStorage.getItem("writeon.username")
  };

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
    { path: '/user/:email/comparison', component: 'comparisonRule' },
    { path: '/user/:email/form/:id/submit', component: 'formSubmit' },
    { path: '/user/:email/form/:id', component: 'formRead' }
  ]);

  AppController.prototype.test = function() {
    console.log("test");
  }

  AppController.prototype.toggleSideNav = function() {
    sideNav.toggle();
  }
}


