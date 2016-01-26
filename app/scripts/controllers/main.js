'use strict';

App.controller('MainCtrl', ['$scope', '$timeout', '$location', '$window', '$rootScope', 'Api', 'Storage', '_', 'CONST',
    function($scope, $timeout, $location, $window, $rootScope, Api, Storage, _, CONST){
        var notifyTO = null;
        $rootScope.$location = $location;
        $rootScope.auth = Storage.get('auth', {});
        $scope.notify = {msg: '', show: false, type: ''};

        $scope.selectedCompany = Storage.get('selectedCompany', {});
        $scope.selectedCompanyName = $scope.selectedCompany.name;
        Api.apiUrl(CONST.serverUrl || '');

        $scope.$on('$routeChangeSuccess', function (scope, next, current) {
            $scope.showCompanyName = next.$$route ? !!next.$$route.showCompanyName : false;
        });


        $scope.showNotify = function(msg, type, delay){
            type = type || 'info'; // info | error | success
            delay = delay * 1000 || 0;
            $scope.notify.msg = msg;
            $scope.notify.type = type;
            $scope.notify.show = true;
            notifyTO && $timeout.cancel(notifyTO);
            delay && (notifyTO = $timeout($scope.hideNotify, delay));
        };

        $scope.hideNotify = function(msg, type){
            $scope.notify.show = false;
        };

        $scope.showReqError = function(err){
            $scope.showNotify('Request error! ' + err.statusText + ' [Code ' + err.status + '].', 'error', 5);
        };

        $window.checkErrors = function(resp, show){
            (typeof show === 'undefined') && (show = true);
            if(resp.error){
                if(resp.error.code === 10){
                    $scope.logout();
                    return true;
                }
                var msg = resp.error.message + ' [code '+resp.error.code+']';
                show && $scope.showNotify(msg, 'error', 5);
                return msg;
            }
            return false;
        };


        $scope.logout = function(){
            var role = Storage.get('auth', {})['role'] || [];
            if(_.contains(role, 'superadmin')){
                Api._logout().then(function(resp){

                }, $scope.showReqError).finally(function(){
                    Storage.delete('auth');
                    $rootScope.auth = {};
                    return $location.path('/p/login');
                });
            }else{
                Api.logout().then(function(resp){

                }, $scope.showReqError).finally(function(){
                    Storage.delete('auth');
                    $rootScope.auth = {};
                    return $location.path('login');
                });
            }
        };


        $scope.checkAuth = function(doRedirect){
            $rootScope.auth = Storage.get('auth', {});
            var role = $rootScope.auth.role || [];
            if(doRedirect){
                if(_.contains(role, 'superadmin')){
                    return $location.path('/games');
                }else if(_.contains(role, 'admin')){
                    return $location.path('/games');
                }
            }
        };
    }]);