App.controller('PGamesCtrl', ['$scope', 'Api', '$window', '$routeParams', '$location', 'Storage', '$q', 'Utils',
function($scope, Api, $window, $routeParams, $location, Storage, $q, Utils){
    $scope.games = [];
    $scope.input = {};
    $scope.activeTab = 'parameters';
    $scope.selectedGame = {}; //selected game in nav list
    $scope.selectedGameId = $routeParams.selectedId;
    $scope.selectedGameStatus = {};
    $scope.currentGame = {}; // more info about selected game
    $scope.newSettings = {}; // settings for update

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
    };


    function getGames(){
        Api.games().then(function(resp){
            if($window.checkErrors(resp)) return;
            $scope.games = resp.data || [];
            angular.forEach($scope.games, function(game){
                game.newName = game.title;
            });
            $scope.selectedGameId && $scope.selectGame($scope.selectedGameId);
        }, $scope.showReqError);
    };

    $scope.selectGame = function(id){
        var game = Utils.searchInArrayById($scope.games, id);
        if(game){
            Api.game(id).then(function(resp){
                if($window.checkErrors(resp)) return;
                $scope.currentGame = resp.game || {};
            }, $scope.showReqError);

            $scope.input.showAddGameAdminForm = false;
            $scope.selectedGame = game;
            $scope.selectedGameId = id;
            $scope.selectedGameStatus = $scope.gameStatuses[game.status];
            $scope.$parent.selectedGameName = game.title;
            $scope.$parent.selectedGameId = id;

            $scope.newSettings.title = game.title;
            $scope.newSettings.distance = game.distance;
            $scope.newSettings.duration = game.duration;
            $scope.loadGame(game);
        }
    };

    $scope.saveGame = function(){
        $scope.showNotify('Сохраняю "' + $scope.selectedGame.title + '"...', 'info', 3);

        Api.gameSettingsObjSave($scope.selectedGameId,  $scope.newSettings).then(function(resp){
            if($window.checkErrors(resp)) return;
            $scope.showNotify('"' + $scope.selectedGame.title + '" сохранено', 'success', 3);
            $scope.$parent.selectedGameName = $scope.selectedGame.title;
        }, $scope.showReqError);
    };

    $scope.loadGame = function(game) {
        //Api.apiUrl('');
        if (!game || !game._id) return;

        game.loaded = true;
        game.settings = {};
        game.admins = [];
        $scope.selectedGame = game;
        Storage.set('selectedGame', game);

        var auth = Storage.get('auth', {});

        var loginReq = Api.login(auth.email, auth.password).then(function(resp){
            if($window.checkErrors(resp) || game._id !== loginReq.gameId){
                return;
            }

            /*var adminsReq = Api.gameAdministrators().then(function(resp){
                if($window.checkErrors(resp) || game._id !== adminsReq.gameId) return;
                game.admins = resp.data;
                angular.forEach(game.admins, function(admin){
                    admin.newEmail = admin.email;
                });
            }, $scope.showReqError);
            adminsReq.gameId = game._id;*/

            /*$q.all([settingsReq, adminsReq]).then(function(){
                game.loaded = true;
            }).finally(function(){
                $scope.loadStatus.game = false;
            });*/

        }, function(resp){
                $scope.showReqError(resp);
            });
        loginReq.gameId = game._id;
    };
}]);