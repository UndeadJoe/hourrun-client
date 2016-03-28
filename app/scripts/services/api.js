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
            usersSession:   {method: 'POST', params: {action: 'users', param1: 'login'}},
            userProfile:    {method: 'GET', params: {action: 'users', param1: 'profile'}},
            signup:         {method: 'POST', params: {action: 'users', param1: 'signup'}},
            logout:         {method: 'GET', params: {action: 'users', param1: 'logout'}},

            gamesList:      {method: 'GET', params: {action: 'games'}},
            game:           {method: 'GET', params: {action: 'games'}},
            gameRemove:     {method: 'DELETE', params: {action: 'games'}},
            newGame:        {method: 'POST', params: {action: 'games'}},
            gameSave:       {method: 'PUT', params: {action: 'games'}},
            gameStart:      {method: 'PUT', params: {action: 'games'}},
            gameRestart:    {method: 'PUT', params: {action: 'games'}},
            gameStop:       {method: 'PUT', params: {action: 'games'}},

            userRoles:      {method: 'GET', params: {action: 'settings', param1: 'roles'}}
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

    self.userProfile = function(){
        return q('userProfile');
    };

    self.signup = function(data){
        return q('signup', data);
    };

    self.logout = function(email){
        return q('logout', {email: email});
    };

    self.games = function(){
        return q('gamesList');
    };

    self.game = function(id){
        return q('game', {}, {param1: id});
    };

    self.gameRemove = function(id){
        return q('gameRemove', {}, {param1: id});
    };

    self.newGame = function(data){
        return q('newGame', data);
    };

    self.gameSettingsObjSave = function(id, data){
        return q('gameSave', data, {param1: id, param2: 'update'});
    };

    self.gameStart = function(id){
        return q('gameStart', {}, {param1: id, param2: 'start'});
    };

    self.gameStop = function(id){
        return q('gameStop', {}, {param1: id, param2: 'stop'});
    };

    self.gameRestart = function(id){
        return q('gameRestart', {}, {param1: id, param2: 'restart'});
    };

    self.gameStop = function(id){
        return q('gameStop', {}, {param1: id, param2: 'stop'});
    };

    self.userRoles = function(){
        return q('userRoles');
    };

}]);