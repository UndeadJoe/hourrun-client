App.controller('UsersCtrl', ['$scope', 'Api', '$window', '$rootScope', '$routeParams', '$location',
function($scope, Api, $window, $rootScope, $routeParams, $location){
    $rootScope.pageTitle = "Список пользователей";
    $scope.users = {};
    $scope.roles = {};

    /* INIT */
    (function(){
        getRoles();
        getUsers();
    })();
    /* --INIT */

    function getRoles(){
        Api.userRoles().then(function(resp){
            if($window.checkErrors(resp)) return;
            $scope.roles = resp.roles || [];
        }, $scope.showReqError);
    }

    function getUsers(){
        Api.users().then(function(resp){
            if($window.checkErrors(resp)) return;

            $scope.users = resp.users;

        }, $scope.showReqError);
    }

    function getCurrentUser(){
        Api.userProfile().then(function(resp){
            if($window.checkErrors(resp)) return;

            $scope.user = resp.user;

        }, $scope.showReqError);
    }
}]);