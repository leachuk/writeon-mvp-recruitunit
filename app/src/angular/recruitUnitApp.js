'use strict';
/*Initialise app*/
var recruitUnitApp = angular.module('recruitUnitApp', [
  'ngMaterial',
  'ngResource',
  'ngCookies',
  'ngNewRouter',
  'loom.api',
  'app.homeController',
  'app.user.userLandingController',
  'app.user.recruiterLandingController',
  'app.user.developerLandingController',
  'app.user.recruiterAdminController',
  'app.user.developerAdminController',
  'app.testCreate',
  'app.user.formSubmitController'
]).controller('AppController', ['$router', '$mdComponentRegistry', AppController])
.config(['$componentLoaderProvider', '$locationProvider', '$httpProvider', '$mdIconProvider', function($componentLoaderProvider, $locationProvider, $httpProvider, $mdIconProvider){
  $componentLoaderProvider.setTemplateMapping(function (name) {
    return 'src/angular/components/' + name + '/' + name + '.html';
  });
  $locationProvider.html5Mode(true);
  $mdIconProvider
    .iconSet('action', '../../assets/svg-sprite-action.svg', 24)
    .icon('mail', './assets/svg/mail.svg', 24)
    .defaultIconSet('../../assets/svg-sprite-action.svg');
}])
.run(['$http','$templateCache',function($http, $templateCache){
  // Pre-fetch icons sources by URL and cache in the $templateCache...
  // subsequent $http calls will look there first.
  var urls = ['../../assets/svg-sprite-action2.svg'];
  angular.forEach(urls, function(url) {
    $http.get(url, {cache: $templateCache});
    console.log(url);
  });
}])

function AppController($router, $mdComponentRegistry) {
  var sideNav;

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
    { path: '/user/:email/form/:id/submit', component: 'formSubmit' }
  ]);

  AppController.prototype.test = function() {
    console.log("test");
  }

  AppController.prototype.toggleSideNav = function() {
    sideNav.toggle();
  }
}


