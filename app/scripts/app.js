'use strict';

// Declare app level module which depends on views, and components
window.App = angular.module('hourrunAdmin', [
  'ngResource',
  'ngRoute'
]).config(['$provide', function($provide) {
  return $provide.decorator('$rootScope', [
    '$delegate', function($delegate) {
      $delegate.safeApply = function(fn) {
        var phase = $delegate.$$phase;
        if (phase === "$apply" || phase === "$digest") {
          (fn && typeof fn === 'function') && fn();
        } else {
          $delegate.$apply(fn);
        }
      };
      return $delegate;
    }
  ]);
}]).factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
}).run(['$rootScope', '$location', function($rootScope, $location){
  $rootScope.$location = $location;
  if(document.documentMode){
    $rootScope.isIE = true;
    angular.element('body').addClass('ie');
  }
}]);
