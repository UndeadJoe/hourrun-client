App.controller('ProfileCtrl', ['$scope', 'Api', '$window', '$rootScope', '$routeParams', '$location',
function($scope, Api, $window, $rootScope, $routeParams, $location){
    $scope.user = {};
    $rootScope.pageTitle = "Профиль пользователя";

    /* INIT */
    (function(){
        getUser();
    })();
    /* --INIT */

    function getUser(){
        Api.userProfile().then(function(resp){
            if($window.checkErrors(resp)) return;

            $scope.user = resp.user;

        }, $scope.showReqError);
    }
}]);