App.controller('SignupCtrl', ['$scope', 'Api', '$window', '$rootScope', '$routeParams', '$location',
function($scope, Api, $window, $rootScope, $routeParams, $location){
    $scope.data = {};
    $rootScope.pageTitle = "Регистрация";
    $scope.roles = {};

    $scope.data.inviteID = $routeParams['id'] || '';
    $scope.data.name = 'Иван';
    $scope.data.surname = 'Иванов';
    $scope.data.email = 'mail@mail.ru';
    $scope.data.role = 10;
    $scope.data.password = '123';

    /* INIT */
    (function(){
        getRoles();
        if ($routeParams['id']) {
            findInvite();
        }
    })();
    /* --INIT */

    function getRoles(){
        Api.userRoles().then(function(resp){
            if($window.checkErrors(resp)) return;
            $scope.roles = resp.roles || [];
        }, $scope.showReqError);
    }

    function findInvite(){
        Api.findInvite($scope.data.inviteID).then(function(resp){
            if($window.checkErrors(resp) || resp.invite == null) return;

            $scope.data.name = resp.invite.name;
            $scope.data.name = resp.invite.surname;
            $scope.data.email = resp.invite.email;
            $scope.data.role = resp.invite.role;
            $scope.data.password = '';

        }, $scope.showReqError);
    }

    $scope.signup = function(){

        Api.signup($scope.data).then(function(resp){
            if($window.checkErrors(resp)){
                return false;
            }
            return $location.path('/games');
        }, $scope.showReqError);
    };

    $scope.invite = function(){

        Api.invite($scope.data).then(function(resp){
            if($window.checkErrors(resp)) return;

        }, $scope.showReqError);
    };
}]);