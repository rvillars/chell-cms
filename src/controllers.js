'use strict';

var chellCms = angular.module('chell-cms');

chellCms.controller('WebContentController', function ($scope, $sce, $modal, $attrs, CmsContent) {

    $scope.contentId = $scope.$eval($attrs.contentId);
    CmsContent.get($scope.contentId).then(function (content) {
        $scope.content = content;
    });

    $scope.edit = function () {
        $scope.modalInstance = $modal.open({
            templateUrl: 'templates/content-selection-dialog.tpl.html',
            backdrop: 'false',
            keyboard: 'true',
            controller: 'CmsSelectionModalController',
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
            });
        });
    };

    $scope.save = function () {
        if (!($scope.editor))return;
        $scope.content = $scope.editor.getData();
        $scope.editor.destroy();
        $scope.editor = null;
    };

    $scope.toTrusted = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
});

chellCms.controller('ContentManagerController', function ($scope, ngTableParams, CmsContent, $modal) {

    $scope.list = true;
    $scope.detail = false;

    $scope.contentList = [];
    $scope.editContent = {};

    $scope.editor = null;
    $scope.config = {};

    $scope.$watchCollection('contentList', function () {
        if ($scope.tableParams) {
            $scope.tableParams.reload();
        }
    });

    CmsContent.query().then(function (contentList) {
        $scope.contentList = contentList;
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10           // count per page
        }, {
            total: $scope.contentList.length, // length of data
            getData: function ($defer, params) {
                $defer.resolve($scope.data = $scope.contentList.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            $scope: { $data: {}, $emit: function(){} }
        });
    });

    $scope.create = function () {
        $scope.edit({});
    };

    $scope.view = function (content) {
        $scope.modalInstance = $modal.open({
            templateUrl: 'templates/content-view-dialog.tpl.html',
            backdrop: 'false',
            keyboard: 'true',
            controller: 'CmsViewModalController',
            windowClass: 'modal-wide',
            resolve: {
                content: function () {
                    return content;
                }
            }
        });
    };

    $scope.edit = function (content) {
        $scope.editContent = content;

        if ($scope.editor) return;
        $scope.editor = CKEDITOR.appendTo('inputBody', $scope.config, $scope.editContent.body);

        $scope.showDetail();
    };

    $scope.remove = function (content) {
        if (!confirm('Are you sure?')) return;
        CmsContent.remove(content).then(function () {
            $scope.contentList.splice($scope.contentList.indexOf(content), 1);
        });
    };

    $scope.save = function () {
        $scope.editContent.body = $scope.editor.getData();
        var isNew = $scope.editContent.id == null;
        if (isNew) {
            CmsContent.create($scope.editContent).then(function(content) {
                $scope.contentList.push(content);
            });
        } else {
            CmsContent.update($scope.editContent).then(function(content) {});
        }

        if ($scope.editor != null) {
            $scope.editor.destroy();
            $scope.editor = null;
        }

        $scope.cancel();
    };

    $scope.cancel = function () {
        $scope.editContent = {};

        if ($scope.editor != null) {
            $scope.editor.destroy();
            $scope.editor = null;
        }

        $scope.showList();
    };

    $scope.showList = function () {
        $scope.list = true;
        $scope.detail = false;
    };

    $scope.showDetail = function () {
        $scope.list = false;
        $scope.detail = true;
    };
});

chellCms.controller('CmsViewModalController', function ($scope, $modalInstance, $sce, content) {

    $scope.content = content;

    $scope.toTrusted = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

chellCms.controller('CmsSelectionModalController', function ($scope, $modalInstance, content) {

    $scope.selectedRow = content;
    $scope.contentId = content.id;
    $scope.selectedRow.$selected = true;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.close($scope.contentId);
    };

    $scope.changeSelection = function(content) {
        if ($scope.selectedRow) {
            $scope.selectedRow.$selected = false;
        }
        $scope.selectedRow=content;
        $scope.contentId = content.id;
    };
});