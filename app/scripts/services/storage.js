'use strict';

App.service('Storage', ['$rootScope', function($rootScope) {
    this.isLS = ('localStorage' in window && window.localStorage !== null);
    if(!('appSettings' in $rootScope)){
        $rootScope.appSettings = {};
    }
    var self = this;

    var getUniqKey = function(key){
        (typeof key === 'undefined') && (key = false);
        var uniqKey = self.get('auth', {})['_id'];
        if(typeof uniqKey !== 'undefined'){
            return (key === false) ? uniqKey : key + '_' + uniqKey;
        }else{
            return key;
        }
    };

    self.get = function(key, defaultVal, isUniq){
        (typeof defaultVal === 'undefined') && (defaultVal = null);
        key = key || 'settings';
        isUniq && (key = getUniqKey(key));
        if(self.isLS){
            if(localStorage[key]){
                try{
                    return JSON.parse(localStorage[key]);
                }catch(e){
                    return defaultVal;
                }
            }else{
                return defaultVal;
            }
        }else{
            return $rootScope.appSettings[key] ? JSON.parse($rootScope.appSettings[key]) : defaultVal;
        }
    };

    self.set = function(key, value, append, isUniq){
        (typeof append === 'undefined') && (append = true);
        key = key || 'settings';
        isUniq && (key = getUniqKey(key));
        var settings = self.get(key) || {};
        if((typeof value === 'object') && append){
            for(var i in value) if(value.hasOwnProperty(i)){
                settings[i] = value[i];
            }
        }else{
            settings = value;
        }
        if(typeof settings !== 'undefined' && settings !== 'undefined'){
            if(self.isLS){
                localStorage[key] = JSON.stringify(settings);
            }else{
                $rootScope.appSettings[key] = JSON.stringify(settings);
            }
        }
        return this;
    };

    self.delete = function(key, settingsKey, isUniq){
        isUniq && (key = getUniqKey(key));
        var settings = self.get(key);
        if(settingsKey){
            if(typeof settings === 'object' && settings !== null){
                delete(settings[settingsKey]);
                self.set(settings, key, false);
            }
        }else{
            self.isLS ? localStorage.removeItem(key) : delete($rootScope.appSettings[key]);
        }
        return this;
    };

    self.clearAll = function() {
        self.isLS ? localStorage.clear() : ($rootScope.appSettings = {});
        return this;
    };
}]);