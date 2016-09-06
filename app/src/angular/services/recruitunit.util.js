'use strict';

angular.module('recruitunit.util',[])
    .factory('recruitUnitUtil', ['$resource', '$location', '$window', 'loomApi', function ($resource, $location, $window, loomApi) {
        
        //Util Service
        var service = {};
        service.Util = {};
        service.Constants = { //I know!
            'DEVELOPER_ROLE': 'developer',
            'RECRUITER_ROLE': 'recruiter'
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
            //now redirect to users home page, where token is checked for
            $location.path("/user/" + username);
            //$location.path("/user/" + username).search({usercreated: "true"}); for reference to add param to url
        }

        service.Util.redirectUserToPath = function(redirectToPath) {
            console.log("redirectUserToPath, redirect to :" + redirectToPath);
            $window.location.assign(redirectToPath);
        }

        return service;

    }]);
