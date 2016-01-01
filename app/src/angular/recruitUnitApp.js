'use strict';
/*Initialise app*/
var recruitUnitApp = angular.module('recruitUnitApp', [
  'ngMaterial',
  'ngResource',
  'ngCookies',
  'ngNewRouter',
  'loom.api',
  'app.home'
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
    { path: '/home', component : "home" } //removed 'home: "home"' config as this was causing the controller to be run twice
  ]);
}