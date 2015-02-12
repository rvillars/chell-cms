/*jshint globalstrict: true*/
'use strict';

var chellCmsExample1 = angular.module('chell-cms-example1', [
    'chell-cms',
    'ngMockE2E'
]);

chellCmsExample1.controller('ExampleContentController', function($scope) {
    $scope.detail = false;
    $scope.list = true;

    $scope.showDetail = function() {
        $scope.detail = true;
        $scope.list = false;
    };

    $scope.showList = function() {
        $scope.detail = false;
        $scope.list = true;
    };

    $scope.readOnly = function() {
        return true;
    };

    $scope.currentUser = function() {
        return 'testUser';
    };
});

chellCmsExample1.run(function run($httpBackend) {
    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
});