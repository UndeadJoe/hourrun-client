App.controller('RefereeingCtrl', ['$scope', 'Api', '$window', '$rootScope', '$routeParams', '$location',
function($scope, Api, $window, $rootScope, $routeParams, $location){
    $scope.data = {};
    $rootScope.pageTitle = "Судейство";
    $scope.selectedGameId = $routeParams.gameId;

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