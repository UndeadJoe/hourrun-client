App.controller('SignupCtrl', ['$scope', 'Api', '$window', '$rootScope', '$routeParams', '$location',
function($scope, Api, $window, $rootScope, $routeParams, $location){
    $scope.data = {};
    $rootScope.pageTitle = "Регистрация";
    $scope.roles = {};

    $scope.data.inviteID = $routeParams['id'] || '';
    $scope.disableCode = ($routeParams['id'] != null); // Disable changes when invite exists
    $scope.disableRole = false;
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
            $scope.data.surname = resp.invite.surname;
            $scope.data.email = resp.invite.email;
            $scope.data.role = resp.invite.role;
            $scope.data.password = '';
            $scope.disableRole = (resp.invite.role != null); // Disable changes when role exists in invite

        }, $scope.showReqError);
    }

    $scope.signup = function(){

        Api.signup($scope.data).then(function(resp){
            if(resp.user == null){
                $scope.showNotify('Ошибка регистрации пользователя', 'error', 5);
                return false;
            }
            else {
                $scope.showNotify('Регистрация прошла успешно!', 'success', 3);
                return $location.path('/games');
            }
        }, $scope.showReqError);
    };

    $scope.invite = function(){

        Api.invite($scope.data).then(function(resp){
            if($window.checkErrors(resp)) return;

        }, $scope.showReqError);
    };
}]);