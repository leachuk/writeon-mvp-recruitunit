(function() {
  'use strict';

  angular
    .module('app.uTestLanding')
    .controller('UTestLandingController', Controller);

  Controller.$inject = [
    '$routeParams'
  ];

  Controller.$routeConfig = [
    { path: '/create', component: 'testCreate' }
  ];

  function Controller($routeParams) {
    console.log("UTestLandingController instantiated");
    this.testId = "foo";
    this.hasChildRoute = typeof $routeParams.childRoute !== 'undefined';
  }

})();