'use strict';

App.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/login', {
            templateUrl: 'views/users/login.html',
            controller: 'LoginCtrl'
        })
        .when('/games/:gameId?', {
            templateUrl: 'views/games.html',
            controller: 'GamesCtrl',
            showGameTitle: true
        })
        .when('/games/:gameId/judging', {
            templateUrl: 'views/judging.html',
            controller: 'JudgingCtrl',
            showGameTitle: true
        })
        .when('/signup', {
            templateUrl: 'views/users/signup.html',
            controller: 'SignupCtrl'
        })
        .when('/profile', {
            templateUrl: 'views/users/profile.html',
            controller: 'ProfileCtrl'
        })
        .otherwise({
            redirectTo: '/login'
        });
}]);