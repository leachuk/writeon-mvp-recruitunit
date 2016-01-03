'use strict';

angular.module('app.testCreate', ['app.testDelete'])
  .controller('TestCreateController', TestCreateController);

TestCreateController.$inject = ['$http', 'loomApi', '$routeParams'];

TestCreateController.$routeConfig = [
  { path: '/', component:'testCreate' },
  { path: '/delete',  component: {'delete': 'testDelete'} }
];

function TestCreateController($http, loomApi, $routeParams) {
  console.log("in TestCreateController");

  //routeParams
  this.useremail = $routeParams.email;
}