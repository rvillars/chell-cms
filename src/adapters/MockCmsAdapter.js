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

var content0 = {
    id: 0,
    title: 'Welcome Page',
    creationDate: new Date(),
    accessRights: 'User',
    status: 'approved',
    body: '<h1>A welcome page</h1>'
};
var content1 = {
    id: 1,
    title: 'Image',
    creationDate: new Date(),
    accessRights: 'User',
    status: 'draft',
    body: '<img alt="" style="padding-left: 90px;" src="http://lorempixel.com/400/200" />'
};
var content2 = {
    id: 2,
    title: 'Lorem Ipsum',
    creationDate: new Date(),
    accessRights: 'User',
    status: 'draft',
    body: '<h1>A Lorem Ipsum Text</h1><p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>'
};
var content3 = {
    id: 3,
    title: 'Footer',
    creationDate: new Date(),
    accessRights: 'User',
    status: 'draft',
    body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
};

var mockContent = [content0, content1, content2, content3];

// *** Mappings ***
// --- Content ---
var externalToCmsContent = function(externalContent) {
    var cmsContent = externalContent; //replace with mapping
    return cmsContent;
};
var cmsToExternalContent = function(cmsContent) {
    var externalContent = cmsContent; //replace with mapping
    return externalContent;
};

// *** Mock Backend ***
chellCms.run(function($httpBackend, $base64) {

    var authenticated = function(headers) {
        if (headers.Authorization == 'Basic '+$base64.encode('chellAdmin'+':'+'chellAdmin') ||
            headers.Authorization == 'Basic '+$base64.encode('chellUser'+':'+'chellUser')) {
            return true;
        }
        return false;
    };

    // --- Content ---
    $httpBackend.whenGET(/cms\/content\/[\d]/).respond(function(method, url, data, headers) {
        if (authenticated(headers)) {
            var id = url.split('\/').pop();
            var existingContent = _.find(mockContent, function(aContent) {return aContent.id == id;});
            if (!existingContent) {
                return [404];
            }
            return [200, existingContent];
        } else {
            return [401];
        }
    });

    $httpBackend.whenGET(/cms\/content/).respond(function(method, url, data, headers) {
        return authenticated(headers) ? [200, mockContent] : [401];
    });

    $httpBackend.whenPOST(/cms\/content/).respond(function(method, url, data, headers) {
        if (authenticated(headers)) {
            var content = JSON.parse(data);
            var currentMaxId = _.max(mockContent, function(aContent) {return aContent.id;}).id;
            content.id = ++currentMaxId;
            content.creationDate = new Date();
            mockContent.push(content);
            return [200, content];
        } else {
            return [401];
        }
    });

    $httpBackend.whenPUT(/cms\/content\/[\d]/).respond(function(method, url, data, headers) {
        if (authenticated(headers)) {
            var id = url.split('\/').pop();
            var content = JSON.parse(data);
            var existingContent = _.find(mockContent, function(aContent) {return aContent.id == id;});
            if (!existingContent) {
                return [404];
            }
            var index = mockContent.indexOf(existingContent);
            mockContent[index] = content;
            return [200, content];
        } else {
            return [401];
        }
    });

    $httpBackend.whenDELETE(/cms\/content\/[\d]/).respond(function(method, url, data, headers) {
        if (authenticated(headers)) {
            var id = url.split('\/').pop();
            var existingContent = _.find(mockContent, function(aContent) {return aContent.id == id;});
            if (!existingContent) {
                return [404];
            }
            var index = mockContent.indexOf(existingContent);
            mockContent.splice(index, 1);
            return [200];
        } else {
            return [401];
        }
    });
});


