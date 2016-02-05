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
  'app.testCreate',
  'app.user.formSubmitController'
]).controller('AppController', ['$router', AppController])
.config(['$componentLoaderProvider', '$locationProvider', '$httpProvider', function($componentLoaderProvider, $locationProvider, $httpProvider){
  $componentLoaderProvider.setTemplateMapping(function (name) {
    return 'src/angular/components/' + name + '/' + name + '.html';
  });
  $locationProvider.html5Mode(true);
}])

function AppController($router) {
  $router.config([
    { path: '/', redirectTo: '/home' },
    { path: '/home', component : 'home' },
    { path: '/user/:email', component: 'userLanding' },
    { path: '/user/:email/form/:id/submit', component: 'formSubmit' }
  ]);
}