'use strict';
var chellCms = angular.module('chell-cms');

var host = 'undefined';

chellCms.factory('CmsAdapter', function ($http, $q, _) {
    return {
        getContentList: function() {
            var deferred = $q.defer();
            $http.get('http://'+host+'/cms/content').success(function(content){
                deferred.resolve(_.map(content, externalToCmsContent));
            }).error(function(){
                deferred.reject('An error occured while fetching content list');
            });
            return deferred.promise;
        },
        getContent: function(id){
            var deferred = $q.defer();
            $http.get('http://'+host+'/cms/content/'+id).success(function(content){
                deferred.resolve(externalToCmsContent(content));
            }).error(function(){
                deferred.reject('An error occured while fetching content');
            });
            return deferred.promise;
        },
        createContent: function(content){
            var deferred = $q.defer();
            $http.post('http://'+host+'/cms/content', cmsToExternalContent(content)).success(function(content){
                deferred.resolve(externalToCmsContent(content));
            }).error(function(){
                deferred.reject('An error occured while updating content');
            });
            return deferred.promise;
        },
        updateContent: function(content){
            var deferred = $q.defer();
            $http.put('http://'+host+'/cms/content/'+content.id, cmsToExternalContent(content)).success(function(content){
                deferred.resolve(externalToCmsContent(content));
            }).error(function(){
                deferred.reject('An error occured while updating content');
            });
            return deferred.promise;
        },
        removeContent: function(content){
            var deferred = $q.defer();
            $http({method: 'DELETE', url: 'http://'+host+'/cms/content/'+content.id}).success(function(){
                deferred.resolve();
            }).error(function(){
                deferred.reject('An error occured while deleting content');
            });
            return deferred.promise;
        }
    };
});
var externalToCmsContent = function(externalContent) {
    var cmsContent = externalContent; //replace with mapping
    return cmsContent;
};
var cmsToExternalContent = function(cmsContent) {
    var externalContent = cmsContent; //replace with mapping
    return externalContent;
};
