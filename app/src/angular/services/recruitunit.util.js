'use strict';

angular.module('recruitunit.util',[])
.factory('recruitUnitUtil', ['$resource', '$location', '$window', 'loomApi', function ($resource, $location, $window, loomApi) {

    //Util Service
    var service = {};
    service.Util = {};
    service.Constants = { //I know, not really constant,  but it'll do given the lack of alternative!
        'DEVELOPER_ROLE': 'developer',
        'RECRUITER_ROLE': 'recruiter',
        'PATH_HOME': '/home',
        'PATH_USER': '/user/',
        'PATH_COMPARISONRULESFORM': '/comparisonrules'
    };

    service.Util.setTitle = function(title){
        document.title = "Recruit Unit - " + title;
    }

    service.Util.getLocalUser = function(){
        var user = {
            email: window.localStorage.getItem("writeon.username"),
            token: window.localStorage.getItem("writeon.authtoken")
        };

        return user;
    }

    service.Util.isUserAuthenticated = function(username, token){
        return loomApi.User.getUser(username, token).then(function(result){
            return new Promise(function(resolve, reject) {
                if (result.success) {
                    resolve(result);
                } else {
                    reject(false);
                }
            });
        }).catch(function(err) {
            console.log("Exception: isUserAuthenticated");
            return false;
        });

    }

    service.Util.persistUserAuth = function(token, username){
        window.localStorage.setItem("writeon.authtoken", token);
        window.localStorage.setItem("writeon.username", username);
    }

    service.Util.deleteUserAuth = function(){
        window.localStorage.removeItem("writeon.authtoken");
        window.localStorage.removeItem("writeon.username");
    }

    service.Util.redirectUserToPath = function(redirectToPath) {
        console.log("redirectUserToPath, redirect to :" + redirectToPath);
        $window.location.assign(redirectToPath);
    }

    service.Util.isLocalUserAvailable = function(){
        var localUser = this.getLocalUser();

        return (typeof localUser.email !== 'undefined' && localUser.email !== null) && (typeof localUser.token !== 'undefined' && localUser.token !== null);
    }

    return service;

}]);
