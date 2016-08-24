'use strict';

angular.module('recruitunit.util',[])
    .factory('recruitUnitUtil', ['$resource', '$location', 'loomApi', function ($resource, $location, loomApi) {
        
        //Util Service
        var service = {};
        service.Util = {};

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
            return loomApi.User.getUser(username, token).then(angular.bind(this,function(result){
                return new Promise(function(resolve, reject) {
                    if (result.success) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                });

            })).catch(function(err) {
               console.log("Exception: isUserAuthenticated");
            });

        }

        service.Util.persistUserAuth = function(token, username){
            window.localStorage.setItem("writeon.authtoken", token);
            window.localStorage.setItem("writeon.username", username);
            //now redirect to users home page, where token is checked for
            $location.path("/user/" + username);
            //$location.path("/user/" + username).search({usercreated: "true"}); for reference to add param to url
        }

        return service;

    }]);
