'use strict';
var chellCms = angular.module('chell-cms');
chellCms.run([
    '$httpBackend',
    function ($httpBackend) {
        var content0 = {
            id: 0,
            title: 'Content Title',
            creationDate: new Date(),
            createdBy: 'User',
            status: 'approved',
            body: '<h2>Content</h2>'
        };
        var content1 = {
            id: 1,
            title: 'Image',
            creationDate: new Date(),
            createdBy: 'User',
            status: 'draft',
            body: '<img alt="" src="http://lorempixel.com/400/200" /></br>This image is also editable'
        };
        var content2 = {
            id: 2,
            title: 'Lorem Ipsum',
            creationDate: new Date(),
            createdBy: 'User',
            status: 'draft',
            body: '<h3>An editable Text</h3><p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>'
        };
        var content3 = {
            id: 3,
            title: 'Footer',
            creationDate: new Date(),
            createdBy: 'Administrator',
            status: 'draft',
            body: '<h3>A readony Text</h3>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
        };
        var mockContent = [
            content0,
            content1,
            content2,
            content3
        ];
        var authenticated = function (headers) {
            return true;
        };
        $httpBackend.whenGET(/cms\/content\/[\d]/).respond(function (method, url, data, headers) {
            if (authenticated(headers)) {
                var id = url.split('/').pop();
                var existingContent = _.find(mockContent, function (aContent) {
                    return aContent.id == id;
                });
                if (!existingContent) {
                    return [404];
                }
                return [
                    200,
                    existingContent
                ];
            } else {
                return [401];
            }
        });
        $httpBackend.whenGET(/cms\/content/).respond(function (method, url, data, headers) {
            return authenticated(headers) ? [
                200,
                mockContent
            ] : [401];
        });
        $httpBackend.whenPOST(/cms\/content/).respond(function (method, url, data, headers) {
            if (authenticated(headers)) {
                var content = JSON.parse(data);
                var currentMaxId = _.max(mockContent, function (aContent) {
                    return aContent.id;
                }).id;
                content.id = ++currentMaxId;
                content.creationDate = new Date();
                mockContent.push(content);
                return [
                    200,
                    content
                ];
            } else {
                return [401];
            }
        });
        $httpBackend.whenPUT(/cms\/content\/[\d]/).respond(function (method, url, data, headers) {
            if (authenticated(headers)) {
                var id = url.split('/').pop();
                var content = JSON.parse(data);
                var existingContent = _.find(mockContent, function (aContent) {
                    return aContent.id == id;
                });
                if (!existingContent) {
                    return [404];
                }
                var index = mockContent.indexOf(existingContent);
                mockContent[index] = content;
                return [
                    200,
                    content
                ];
            } else {
                return [401];
            }
        });
        $httpBackend.whenDELETE(/cms\/content\/[\d]/).respond(function (method, url, data, headers) {
            if (authenticated(headers)) {
                var id = url.split('/').pop();
                var existingContent = _.find(mockContent, function (aContent) {
                    return aContent.id == id;
                });
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
    }
]);