App.service('Api', ['$resource', 'CONST', '$q', '$http',
function($resource, CONST, $q, $http){
    $http.defaults.withCredentials = true;

    var self = this;

    var _apiUrl;
    self.apiUrl = function(url){
        (typeof url !== 'undefined') && (_apiUrl = url);
        return _apiUrl;
    };

    self.r = function(){
        return $resource(_apiUrl + ':action/:param1/:param2/:param3', {}, {
            usersSession: {method: 'POST', params: {action: 'users', param1: 'login'}},

            gamesList:  {method: 'GET', params: {action: 'games'}},
            game:      {method: 'GET', params: {action: 'games'}},

            gameSettingsSave: {method: 'PUT', params: {action: 'games'}}
        });
    };

    //clean resp data from resource promise object
    function cleanResp(promise){
        var dfd = $q.defer();
        promise.then(function(resp){
            var data = (resp instanceof Array) ? [] : {};
            angular.forEach(resp, function(val, key){
                (typeof key !== 'string' || key.charAt(0) !== '$') && (data[key] = val);
            });
            dfd.resolve(data);
        }, dfd.reject, dfd.notify);

        return dfd.promise;
    }

    function q(method, data, queryParams){
        return cleanResp(self.r()[method](queryParams, data).$promise);
    }

    /* games API */
    self.login = function(email, password){
        return q('usersSession', {email: email, password: password});
    };

    self.games = function(){
        return q('gamesList');
    };

    self.game = function(id){
        return q('game', {}, {param1: id});
    };

    self.gameSettingsObjSave = function(id, data){
        return q('gameSettingsSave', data, {param1: id, param2: 'update'});
    };

}]);