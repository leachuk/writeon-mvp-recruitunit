'use strict';

angular.module('recruitunit.util',[])
    .factory('recruitUnitUtil', ['$resource', function ($resource) {
        
        //Util Service
        var service = {};
        service.Util = {};

        service.Util.setTitle = function(title){
            document.title = "Recruit Unit - " + title;
        }

        return service;

    }]);
