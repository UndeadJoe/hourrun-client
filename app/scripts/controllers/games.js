App.controller('GamesCtrl', ['$scope', 'Api', '$window', '$rootScope', '$routeParams', '$location', 'Storage', '$q', 'Utils',
function($scope, Api, $window, $rootScope, $routeParams, $location, Storage, $q, Utils){
    $scope.games = [];
    $rootScope.pageTitle = "Соревнования";
    $scope.input = {};
    $scope.activeTab = 'parameters';
    $scope.currentId = $routeParams.gameId;
    $scope.currentGame = {}; // more info about selected game

    $scope.gameStatuses = {};
    $scope.gameStatusesArray = [
        {step: 0, status: 'new', ready: false, msg: 'Creating primary DB record', icon: 'glyphicon-file', class: 'status-yellow'},
        {step: 1, status: 'config', ready: false, msg: 'Creating game configuration file', icon: 'glyphicon-cog', class: 'status-yellow'},
        {step: 2, status: 'db', ready: false, msg: 'Creating game DB', icon: 'glyphicon-download-alt', class: 'status-yellow'},
        {step: 3, status: 'jenkins job', ready: false, msg: 'Creating game API', icon: 'glyphicon-wrench', class: 'status-yellow'},
        {step: 4, status: 'created', ready: true, msg: 'Game API ready', icon: 'glyphicon-ok', class: 'status-green'}
    ];

    /* INIT */
    (function(){
        makeGameStatusesObj();
        getGames();
    })();
    /* --INIT */

    function makeGameStatusesObj(){
        angular.forEach($scope.gameStatusesArray, function(item){
            $scope.gameStatuses[item.status] = item;
        });
    }


    function getGames(){
        Api.games().then(function(resp){
            if($window.checkErrors(resp)) return;
            $scope.games = resp.data || [];
            angular.forEach($scope.games, function(game){
                game.newName = game.title;
            });
            $scope.currentId && $scope.selectGame($scope.currentId);
        }, $scope.showReqError);
    }

    $scope.selectGame = function(id){
        var game = Utils.searchInArrayById($scope.games, id);
        if(game){
            Api.game(id).then(function(resp){
                if($window.checkErrors(resp)) return;
                $scope.currentGame = resp.game || {};
                $scope.input.showAddGameAdminForm = false;
                $scope.selectedGameStatus = $scope.gameStatuses[game.status];
                $rootScope.pageTitle = $scope.currentGame.title;

                $scope.$parent.id = $scope.currentGame._id;
                $scope.$parent.title = $scope.currentGame.title;
                $scope.currentGame.loaded = true;
            }, $scope.showReqError);
        }
    };

    $scope.newGame = function(){
        var data = {'title': $scope.newGameTitle};
        $scope.newGameTitle = '';
        $scope.input.showNewGameInput = false;

        $scope.showNotify('Создание соревнования "' + data.title + '"...', 'info', 3);

        Api.newGame(data).then(function(resp){
            if($window.checkErrors(resp)) return;
            $scope.showNotify('"' + data.title + '" создано', 'success', 3);

            $scope.games.push(resp);
        }, $scope.showReqError);
    };

    $scope.startGame = function(id){

        Api.gameStart(id).then(function(resp){
            if(resp.error == null) {
                var data = (resp.result || {});
                $scope.currentGame.startedTime = data.startedTime || $scope.currentGame.startedTime;
                $scope.showNotify('Соревнование "' + $scope.currentGame.title + '" запущено!', 'success', 3);
            }
            else {
                $scope.showNotify('Невозможно запустить соревнование', 'error', 5);
            }

        }, function(resp){
            $scope.showReqError(resp);
        });
    };

    $scope.gameRemove = function(id){

        var game = Utils.searchInArrayById($scope.games, id);

        bootbox.confirm("Удалить соревнование '" + game.title + "'?", function(result) {
            if(game && (result === true)) {
                Api.gameRemove(id).then(function (resp) {
                    if (resp.error == null) {
                        $scope.showNotify('Соревнование "' + game.title + '" удалено', 'success', 3);
                        getGames();
                    }
                    else {
                        $scope.showNotify('Невозможно удалить соревнование', 'error', 5);
                    }

                }, function (resp) {
                    $scope.showReqError(resp);
                });
            }
        });
    };

    $scope.stopGame = function(id){

        Api.gameStop(id).then(function(resp){
            if(resp.error == null) {
                var data = (resp.result || {});
                $scope.currentGame.stoppedTime = data.stoppedTime || $scope.currentGame.stoppedTime;
                $scope.showNotify('Соревнование "' + $scope.currentGame.title + '" остановленно!', 'success', 3);
            }
            else {
                $scope.showNotify('Невозможно остановить соревнование', 'error', 5);
            }

        }, function(resp){
            $scope.showReqError(resp);
        });
    };

    $scope.restartGame = function(id){

        Api.gameRestart(id).then(function(resp){
            if(resp.error == null) {
                $scope.currentGame.startedTime = resp.result.startedTime;
                $scope.currentGame.stoppedTime = resp.result.stoppedTime;
                $scope.showNotify('Соревнование "' + $scope.currentGame.title + '" перезапущено!', 'success', 3);
            }
            else {
                $scope.showNotify('Невозможно повтороно запустить соревнование', 'error', 5);
            }

        }, function(resp){
            $scope.showReqError(resp);
        });
    };

    $scope.saveGame = function(){
        var newSettings = {
            'title': $scope.currentGame.title,
            'distance': $scope.currentGame.distance,
            'duration': $scope.currentGame.duration
        };

        Api.gameSettingsObjSave($scope.currentGame._id,  newSettings).then(function(resp){
            if($window.checkErrors(resp)) return;
            $scope.showNotify('Соревнование "' + $scope.currentGame.title + '" сохранено', 'success', 3);

            $scope.selectGame($scope.currentGame,_id);
        }, $scope.showReqError);
    };
}]);