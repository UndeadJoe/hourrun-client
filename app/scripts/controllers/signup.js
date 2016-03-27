App.controller('SignupCtrl', ['$scope', 'Api', '$window', '$routeParams', '$location',
function($scope, Api, $window, $routeParams, $location){
    $scope.data = {};
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
    })();
    /* --INIT */

    function getRoles(){
        Api.userRoles().then(function(resp){
            if($window.checkErrors(resp)) return;
            $scope.roles = resp.roles || [];
        }, $scope.showReqError);
    }

    $scope.signup = function(){

        Api.signup($scope.data).then(function(resp){
            if($window.checkErrors(resp)) return;

        }, $scope.showReqError);
    };
}]);