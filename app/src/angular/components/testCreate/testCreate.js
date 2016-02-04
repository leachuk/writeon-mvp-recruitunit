'use strict';

angular.module('app.testCreate', [])
  .controller('TestCreateController', Controller);

Controller.$inject = ['$http', 'loomApi', '$routeParams'];

function Controller($http, loomApi, $routeParams) {
  console.log("in TestCreateController");

  //routeParams
  this.useremail = $routeParams.email;

  this.currentRoute =  "TestCreateController";
}