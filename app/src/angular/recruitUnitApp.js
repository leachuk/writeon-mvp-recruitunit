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
.config(['$componentLoaderProvider', function($componentLoaderProvider){
  $componentLoaderProvider.setTemplateMapping(function (name) {
    return 'src/angular/components/' + name + '/' + name + '.html';
  });
}])

function AppController($router) {
  $router.config([
    { path: '/', redirectTo: '/home' },
    { path: '/home', component:{ home :'home' } }
  ]);
}