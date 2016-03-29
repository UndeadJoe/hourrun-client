App.controller('UsersCtrl', ['$scope', '$route', 'Api', '$window', '$rootScope', '$routeParams', '$location',
function($scope, $route, Api, $window, $rootScope, $routeParams, $location){
    $rootScope.pageTitle = "Список пользователей";
    $scope.users = {};
    $scope.user = {};
    $scope.roles = {};

    /* INIT */
    (function(){
        //getRoles();
        if ($route.current.showUserProfile) {
            getCurrentUser();
        }
        else {
            getUsers();
        }
    })();
    /* --INIT */

    function getRoles(){
        Api.userRoles().then(function(resp){
            if($window.checkErrors(resp)) return;
            $scope.roles = resp.roles || [];
        }, $scope.showReqError);
    }

    function getUsers(){
        Api.userList().then(function(resp){
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

    $scope.saveProfile = function(){

    };
}]);