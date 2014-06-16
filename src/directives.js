'use strict';

var chellCms = angular.module('chell-cms');

chellCms.directive('chellWebContent', function () {
    return {
        restrict: 'E',
        controller: 'WebContentController',
        templateUrl: 'templates/web-content.tpl.html'
    };
});

chellCms.directive('chellContentManager', function () {
    return {
        restrict: 'E',
        controller: 'ContentManagerController',
        templateUrl: 'templates/content-manager.tpl.html'
    };
});