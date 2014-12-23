'use strict';
var chellCms = angular.module('chell-cms');

var host = 'localhost:9200';
var basePath = '/chell-cms/content/';

chellCms.factory('CmsAdapter', function ($http, $q, _) {
    return {
        getContentList: function() {
            var deferred = $q.defer();
            $http.get('http://'+host+basePath+'_search?size=1000').success(function(content){
                deferred.resolve(_.map(content.hits.hits, externalToCmsContent));
            }).error(function(){
                deferred.reject('An error occured while fetching content list');
            });
            return deferred.promise;
        },
        getContent: function(id){
            var deferred = $q.defer();
            $http.get('http://'+host+basePath+id).success(function(content){
                deferred.resolve(externalToCmsContent(content));
            }).error(function(){
                deferred.reject('An error occured while fetching content');
            });
            return deferred.promise;
        },
        createContent: function(content){
            var deferred = $q.defer();
            $http.post('http://'+host+basePath+'?refresh=true', cmsToExternalContent(content)).success(function(response){
                deferred.resolve(response.id);
            }).error(function(){
                deferred.reject('An error occured while updating content');
            });
            return deferred.promise;
        },
        updateContent: function(content){
            var deferred = $q.defer();
            $http.put('http://'+host+basePath+content.id+'?refresh=true', cmsToExternalContent(content)).success(function(response){
                deferred.resolve(response.id);
            }).error(function(){
                deferred.reject('An error occured while updating content');
            });
            return deferred.promise;
        },
        removeContent: function(content){
            var deferred = $q.defer();
            $http({method: 'DELETE', url: 'http://'+host+basePath+content.id}).success(function(){
                deferred.resolve();
            }).error(function(){
                deferred.reject('An error occured while deleting content');
            });
            return deferred.promise;
        }
    };
});
var externalToCmsContent = function(externalContent) {
    var cmsContent = {};
    cmsContent.title = externalContent._source.title;
    cmsContent.body = externalContent._source.body;
    cmsContent.status = externalContent._source.status;
    cmsContent.id = externalContent._id;
    cmsContent.accessRights = externalContent._source.accessRights;
    cmsContent.creationDate = externalContent._source.creationDate;
    return cmsContent;
};
var cmsToExternalContent = function(cmsContent) {
    var externalContent = {};
    externalContent.title = cmsContent.title;
    externalContent.body = cmsContent.body;
    externalContent.status = cmsContent.status;
    externalContent.creationDate = new Date();
    externalContent.accessRights = 'none';
    return externalContent;
};

