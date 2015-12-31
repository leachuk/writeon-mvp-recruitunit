angular.module('app.home', [])
  .controller('HomeController', [function () {
    console.log("in HomeController");
    this.name = 'Friend';
  }]);