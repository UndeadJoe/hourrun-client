'use strict';

App.controller('LoginCtrl', ['$scope', 'Api', '$window', '$rootScope', '$location',
    function($scope, Api, $window, $rootScope, $location){
        $scope.data = {};
        $rootScope.pageTitle = "Вход в систему";

        $scope.login = function(){

            Api.login($scope.data.email, $scope.data.password).then(function(resp){
                if($window.checkErrors(resp)){
                    return false;
                }
                return $location.path('/games');
            }, $scope.showReqError);
        };
    }]);