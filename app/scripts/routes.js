'use strict';

App.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .when('/games/:selectedId?', {
            templateUrl: 'views/games.html',
            controller: 'GamesCtrl',
            showGameName: true
        })
        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'SignupCtrl'
        })

        .otherwise({
            redirectTo: '/login'
        });
}]);