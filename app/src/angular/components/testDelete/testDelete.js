'use strict';

angular.module('app.testDelete', [])
  .controller('TestDeleteController', TestDeleteController);

TestDeleteController.$inject = ['$http', 'loomApi'];

function TestDeleteController($http, loomApi) {
  console.log("in TestDeleteController");

  this.loaded=true;
}