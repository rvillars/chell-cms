'use strict';
var chellCms = angular.module('chell-cms');

chellCms.run(function($http) {
    $http.defaults.headers.common.Authorization = 'Basic YWRtaW46YWRtaW4=';
});

var host = 'localhost:8082/sling';
var basePath = '/apps/chell-cms/content/';

chellCms.factory('CmsAdapter', function ($http, $q, _) {
    return {
        getContentList: function() {
            var deferred = $q.defer();
            $http.get('http://'+host+basePath+'.harray.1.json').success(function(content){
                deferred.resolve(_.map(content['__children__'], externalToCmsContent)); // jshint ignore:line
            }).error(function(){
                deferred.reject('An error occured while fetching content list');
            });
            return deferred.promise;
        },
        getContent: function(id){
            var deferred = $q.defer();
            $http.get('http://'+host+basePath+id+'.json').success(function(content){
                deferred.resolve(externalToCmsContent(content));
            }).error(function(){
                deferred.reject('An error occured while fetching content');
            });
            return deferred.promise;
        },
        createContent: function(content){
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: 'http://'+host+basePath,
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj) // jshint ignore:line
                        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                    return str.join('&');
                },
                data: {
                    ':operation': 'import',
                    ':contentType': 'json',
                    ':nameHint': content.title,
                    ':content': cmsToExternalContent(content)
                }
            }).success(function(response){
                deferred.resolve(response.path.split('/').pop());
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
    var cmsContent = {};
    cmsContent.title = externalContent.title;
    cmsContent.body = externalContent.body;
    cmsContent.status = externalContent.status;
    cmsContent.id = externalContent['__name__']; // jshint ignore:line
    cmsContent.createdBy = externalContent['jcr:createdBy'];
    cmsContent.creationDate = new Date(Date.parse(externalContent['jcr:created']));
    return cmsContent;
};
var cmsToExternalContent = function(cmsContent) {
    var externalContent = {};
    externalContent.title = cmsContent.title;
    externalContent.body = cmsContent.body;
    externalContent.status = cmsContent.status;
    return externalContent;
};

