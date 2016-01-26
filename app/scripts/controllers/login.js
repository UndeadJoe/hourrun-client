'use strict';

App.controller('PLoginCtrl', ['$scope', 'Api', '$window', '$location', 'Storage', '$rootScope',
    function($scope, Api, $window, $location, Storage, $rootScope){
        $scope.data = {};

        $scope.login = function(){
            Api._login($scope.data.email, $scope.data.password).then(function(resp){
                if($window.checkErrors(resp)){
                    return false;
                }
                var auth = angular.extend({password: $scope.data.password}, resp);
                $rootScope.auth = resp;
                Storage.set('auth', auth, false);
                return $location.path('/games');
            }, $scope.showReqError);
        };


        $scope.checkAuth(true);
    }]);