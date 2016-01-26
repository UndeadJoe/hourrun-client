'use strict';

App.service('Utils', [function(){
    var self = this;

    self.isObjDefined = function(obj, props){
        if(typeof obj === 'undefined'){
            return false;
        }
        (typeof props === 'string') && (props = props.split('.'));
        if(!props || !props.length){
            return true;
        }

        var testObj = obj;
        for(var i = 0, l = props.length; i < l; i++){
            testObj = testObj[props[i]];
            if(typeof testObj === 'undefined'){
                return false;
            }
        }
        return true;
    };

    self.defineObj = function(obj, props, val){
        (typeof obj === 'undefined') && (obj = {});
        (typeof val === 'undefined') && (val = {});
        (typeof props === 'string') && (props = props.split('.'));
        if(!props || !props.length){
            return obj;
        }

        var tmpObj = obj;
        for(var i = 0, l = props.length; i < l; i++){
            (typeof tmpObj[props[i]] === 'undefined') && (tmpObj[props[i]] = (i === l-1) ? val : {});
            tmpObj = tmpObj[props[i]];
        }

        return obj;
    };

    self.getObjVal = function(obj, props, defaultVal, toCase){
        (typeof obj === 'undefined' || !obj) && (obj = {});
        (typeof props === 'string') && (props = props.split('.'));
        toCase = toCase || 0; // -1 - lower, 1 - upper, 0 - as is

        if(!props || !props.length)	return defaultVal;

        var tmpObj = obj;
        for(var i = 0, l = props.length; i < l; i++){
            if(!tmpObj || typeof tmpObj !== 'object' || typeof tmpObj[props[i]] === 'undefined') return defaultVal;
            tmpObj = tmpObj[props[i]];
        }
        if(toCase && typeof tmpObj === 'string'){
            tmpObj = toCase < 0 ? tmpObj.toLowerCase() : tmpObj.toUpperCase();
        }

        return tmpObj;
    };

    self.isObjEmpty = function(obj) {
        if(!obj) return true;

        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    };

    self.searchInArrayById = function(arr, id){
        for(var i = 0, l = arr.length; i < l; i++){
            var item = arr[i];
            if(id === item._id){
                return item;
                break;
            }
        }
        return undefined;
    };
}]);