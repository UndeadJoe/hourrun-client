App.controller('ProfileCtrl', ['$scope', 'Api', '$window', '$routeParams', '$location',
function($scope, Api, $window, $routeParams, $location){
    $scope.user = {};

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