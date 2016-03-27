'use strict';

App.controller('LoginCtrl', ['$scope', 'Api', '$window', '$location',
    function($scope, Api, $window, $location){
        $scope.data = {};

        $scope.login = function(){

            Api.login($scope.data.email, $scope.data.password).then(function(resp){
                if($window.checkErrors(resp)){
                    return false;
                }
                return $location.path('/games');
            }, $scope.showReqError);
        };
    }]);