'use strict';

var chellCms = angular.module('chell-cms');

chellCms.controller('ContentListController', function ($scope, $rootScope, $filter, $modal, $translate, CmsContent, ngTableParams) {

    $scope.content = [];

    CmsContent.query().then(function (content) {
        $scope.content = content;
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                title: 'asc'
            }
        }, {
            total: $scope.content.length, // length of data
            getData: function ($defer, params) {
                var filteredData = params.filter() ? $filter('filter')($scope.content, params.filter()) : $scope.content;
                var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
                params.total(orderedData.length); // used to update paginator
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            $scope: { $data: {}, $emit: function () {
            } }
        });
    });

    $scope.$on('chellCms.contentCreated', function(event) {
        CmsContent.query().then(function (content) {
            $scope.content = content;
        });
    });

    $scope.$watchCollection('content', function () {
        if ($scope.tableParams) {
            $scope.tableParams.reload();
        }
    });

    $scope.create = function() {
        $scope.createButtonHook();
    };

    $scope.view = function (content) {
        $scope.modalInstance = $modal.open({
            templateUrl: 'templates/content-view-dialog.tpl.html',
            backdrop: false,
            controller: 'ContentViewModalController',
            windowClass: 'modal-wide',
            resolve: {
                content: function () {
                    return content;
                }
            }
        });
        $scope.viewButtonHook();
    };

    $scope.edit = function (content) {
        $rootScope.$broadcast('chellCms.editContent', content);
        $scope.editButtonHook();
    };

    $scope.remove = function (content) {
        $translate('CHELL_CMS.CONTENT_LIST.REMOVE_QUESTION').then(function (removeQuestion) {
            if (!confirm(removeQuestion)) return;
            CmsContent.remove(content).then(function () {
                $scope.content.splice($scope.content.indexOf(content), 1);
            });
            $scope.deleteButtonHook();
        });
    };
});

chellCms.controller('ContentFormController', function ($scope, $rootScope, CmsContent) {

    $scope.editContent = {};

    $scope.editorConfig = {
        extraPlugins: 'divarea'
    };

    $scope.$on('chellCms.editContent', function(event, content) {
        $scope.editContent = content;
    });

    $scope.save = function () {
        var isNew = $scope.editContent.id == null;
        if (isNew) {
            CmsContent.create($scope.editContent).then(function() {
                $rootScope.$broadcast('chellCms.contentCreated');
                $scope.cancel();
                $scope.saveButtonHook();
            });
        } else {
            CmsContent.update($scope.editContent).then(function() {
                $rootScope.$broadcast('chellCms.contentCreated');
                $scope.cancel();
                $scope.saveButtonHook();
            });
        }
    };

    $scope.cancel = function () {
        $scope.editContent = {};

        if ($scope.contentForm) {
            $scope.contentForm.$setPristine();
        }

        $scope.cancelButtonHook();
    };
});

chellCms.controller('WebContentController', function($scope, $rootScope, $sce, $modal, $attrs, CmsContent) {

    $scope.contentId = $attrs.contentId;
    $scope.empty = true;

    $scope.editorConfig = {
        extraPlugins: 'divarea'
    };

    if ($scope.contentId != null) {
        CmsContent.get($scope.contentId).then(function (content) {
            $scope.content = content;
            $scope.empty = false;
        });
    }

    $scope.select = function() {
        $scope.modalInstance = $modal.open({
            templateUrl: 'templates/content-selection-dialog.tpl.html',
            backdrop: 'false',
            keyboard: 'true',
            controller: 'ContentSelectionModalController',
            windowClass: 'modal-wide',
            resolve: {
                content: function () {
                    return $scope.content;
                }
            }
        });
        $scope.modalInstance.result.then(function (contentId) {
            $scope.contentId = contentId;
            CmsContent.get($scope.contentId).then(function (content) {
                $scope.content = content;
                $scope.empty = false;
            });
        });
    };

    $scope.save = function(body) {
        $scope.content.body = body;
        CmsContent.update($scope.content).then(function() {
            $rootScope.$broadcast('chellCms.contentCreated');
        });
    };

    $scope.edit = function() {
        $scope.modalInstance = $modal.open({
            templateUrl: 'templates/content-edit-dialog.tpl.html',
            backdrop: 'false',
            keyboard: 'true',
            controller: 'ContentEditModalController',
            windowClass: 'modal-wide',
            resolve: {
                content: function () {
                    return $scope.content;
                }
            }
        });
        $scope.modalInstance.result.then(function (content) {
            $scope.content = content;
            CmsContent.update($scope.content).then(function() {
                $rootScope.$broadcast('chellCms.contentCreated');
            });
        });
    };

    $scope.toTrusted = function(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
});

chellCms.controller('ContentViewModalController', function ($scope, $modalInstance, $sce, content) {

    $scope.content = content;

    $scope.toTrusted = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

chellCms.controller('ContentSelectionModalController', function ($scope, $modalInstance, content) {

    if (content != null) {
        $scope.selectedRow = content;
        $scope.contentId = content.id;
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.close($scope.contentId);
    };

    $scope.changeSelection = function(content) {

        // unselect on second click
        if ($scope.selectedRow == content) {
            $scope.selectedRow = null;
            $scope.contentId = null;
            return;
        }

        // select new
        $scope.selectedRow = content;
        $scope.contentId = content.id;
    };
});

chellCms.controller('ContentEditModalController', function ($scope, $modalInstance, content) {

    $scope.editContent = content;
    $scope.editorConfig = {
        extraPlugins: 'divarea'
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function () {
        $modalInstance.close($scope.editContent);
    };

});