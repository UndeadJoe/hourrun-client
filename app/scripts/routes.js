'use strict';

App.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'PLoginCtrl'
        })
        .when('/games/:selectedId?', {
            templateUrl: 'views/games.html',
            controller: 'PCompaniesCtrl',
            showCompanyName: true
        })
        .when('/restore/?', {
            templateUrl: 'views/restore.html',
            controller: 'RestoreCtrl'
        })

        .otherwise({
            redirectTo: '/login'
        });
}]);