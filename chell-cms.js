'use strict';
// Source: build/module.js
var chellCms = angular.module('chell-cms', [
    'templates-chell-cms',
    'ngTable',
    'underscore',
    'angular-underscore',
    'ui.bootstrap',
    'base64',
    'ngMockE2E'
  ]);;// Source: build/models.js
var chellCms = angular.module('chell-cms');
chellCms.factory('CmsContent', [
  'CmsAdapter',
  function (CmsAdapter) {
    return {
      query: function () {
        return CmsAdapter.getContentList();
      },
      get: function (id) {
        return CmsAdapter.getContent(id);
      },
      create: function (content) {
        return CmsAdapter.createContent(content);
      },
      update: function (content) {
        return CmsAdapter.updateContent(content);
      },
      remove: function (content) {
        return CmsAdapter.removeContent(content);
      }
    };
  }
]);;// Source: build/directives.js
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
});;// Source: build/controllers.js
var chellCms = angular.module('chell-cms');
chellCms.controller('WebContentController', [
  '$scope',
  '$sce',
  '$modal',
  '$attrs',
  'CmsContent',
  function ($scope, $sce, $modal, $attrs, CmsContent) {
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
      if (!$scope.editor)
        return;
      $scope.content = $scope.editor.getData();
      $scope.editor.destroy();
      $scope.editor = null;
    };
    $scope.toTrusted = function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };
  }
]);
chellCms.controller('ContentManagerController', [
  '$scope',
  'ngTableParams',
  'CmsContent',
  '$modal',
  function ($scope, ngTableParams, CmsContent, $modal) {
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
        page: 1,
        count: 10
      }, {
        total: $scope.contentList.length,
        getData: function ($defer, params) {
          $defer.resolve($scope.data = $scope.contentList.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: {
          $data: {},
          $emit: function () {
          }
        }
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
      if ($scope.editor)
        return;
      $scope.editor = CKEDITOR.appendTo('inputBody', $scope.config, $scope.editContent.body);
      $scope.showDetail();
    };
    $scope.remove = function (content) {
      if (!confirm('Are you sure?'))
        return;
      CmsContent.remove(content).then(function () {
        $scope.contentList.splice($scope.contentList.indexOf(content), 1);
      });
    };
    $scope.save = function () {
      $scope.editContent.body = $scope.editor.getData();
      var isNew = $scope.editContent.id == null;
      if (isNew) {
        CmsContent.create($scope.editContent).then(function (content) {
          $scope.contentList.push(content);
        });
      } else {
        CmsContent.update($scope.editContent).then(function (content) {
        });
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
  }
]);
chellCms.controller('CmsViewModalController', [
  '$scope',
  '$modalInstance',
  '$sce',
  'content',
  function ($scope, $modalInstance, $sce, content) {
    $scope.content = content;
    $scope.toTrusted = function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }
]);
chellCms.controller('CmsSelectionModalController', [
  '$scope',
  '$modalInstance',
  'content',
  function ($scope, $modalInstance, content) {
    $scope.selectedRow = content;
    $scope.contentId = content.id;
    $scope.selectedRow.$selected = true;
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.ok = function () {
      $modalInstance.close($scope.contentId);
    };
    $scope.changeSelection = function (content) {
      if ($scope.selectedRow) {
        $scope.selectedRow.$selected = false;
      }
      $scope.selectedRow = content;
      $scope.contentId = content.id;
    };
  }
]);;// Source: build/templates.js
angular.module('templates-chell-cms', ['templates/content-manager.tpl.html', 'templates/content-selection-dialog.tpl.html', 'templates/content-view-dialog.tpl.html', 'templates/web-content.tpl.html']);

angular.module("templates/content-manager.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/content-manager.tpl.html",
    "<div ng-controller=\"ContentManagerController\">\n" +
    "    <div ng-show=\"list\">\n" +
    "        <button class=\"btn btn-primary btn-xs\" ng-click=\"create()\"><i style=\"padding-right: 10px\" class=\"glyphicon glyphicon-edit\"></i>Create Content</button>\n" +
    "        <table ng-table=\"tableParams\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"table table-striped table-bordered\" id=\"datatable\">\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"content in data\">\n" +
    "                <td data-title=\"'Title'\">{{content.title}}</td>\n" +
    "                <td data-title=\"'Creation Date'\" class=\"center\">{{content.creationDate | date:'dd.MM.yyyy'}}</td>\n" +
    "                <td data-title=\"'Content ID'\" class=\"center\">{{content.id}}</td>\n" +
    "                <td data-title=\"'Access Rights'\" class=\"center\">{{content.accessRights}}</td>\n" +
    "                <td data-title=\"'State'\" class=\"center\">\n" +
    "                    <span class=\"badge\">{{content.status}}</span>\n" +
    "                </td>\n" +
    "                <td data-title=\"'Actions'\" class=\"center\">\n" +
    "                    <div class=\"btn-group btn-group-sm\">\n" +
    "                        <button class=\"btn btn-default\" title=\"View\" ng-click=\"view(content)\">\n" +
    "                            <i class=\"glyphicon glyphicon-zoom-in icon-white\"></i>\n" +
    "                        </button>\n" +
    "                        <button class=\"btn btn-default\" title=\"Edit\" ng-click=\"edit(content)\">\n" +
    "                            <i class=\"glyphicon glyphicon-edit icon-white\"></i>\n" +
    "                        </button>\n" +
    "                        <button class=\"btn btn-default\" title=\"Delete\" ng-click=\"remove(content)\">\n" +
    "                            <i class=\"glyphicon glyphicon-trash icon-white\"></i>\n" +
    "                        </button>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <div ng-show=\"detail\">\n" +
    "        <form id=\"userProfile\">\n" +
    "            <fieldset>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"inputUserId\">Content ID</label>\n" +
    "                    <input class=\"form-control\" id=\"inputUserId\" placeholder=\"Automatically generated\" readonly=\"true\" ng-model=\"editContent.id\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"inputTitle\">Title</label>\n" +
    "                    <input class=\"form-control\" id=\"inputTitle\" placeholder=\"Title\" required=\"true\" ng-model=\"editContent.title\">\n" +
    "                </div>\n" +
    "                <div id=\"inputBody\"/>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"inputStatus\">Status</label>\n" +
    "                    <select class=\"form-control\" id=\"inputStatus\" ng-model=\"editContent.status\" ng-value=\"'approved'\">\n" +
    "                        <option>approved</option>\n" +
    "                        <option>draft</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </fieldset>\n" +
    "            <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"save()\">Save</button>\n" +
    "            <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/content-selection-dialog.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/content-selection-dialog.tpl.html",
    "<div class=\"modal-header\">\n" +
    "    <button class=\"close\" ng-click=\"cancel()\">×</button>\n" +
    "    <h3>Select Content</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\" ng-controller=\"ContentManagerController\">\n" +
    "    <table ng-table=\"tableParams\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"table table-striped table-bordered\" id=\"datatable\">\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"content in data\"\n" +
    "            ng-click=\"content.$selected = !content.$selected; changeSelection(content)\"\n" +
    "            ng-class=\"{'active': content.$selected}\">\n" +
    "            <td data-title=\"'Title'\">{{content.title}}</td>\n" +
    "            <td data-title=\"'Creation Date'\" class=\"center\">{{content.creationDate | date:'dd.MM.yyyy'}}</td>\n" +
    "            <td data-title=\"'Content ID'\" class=\"center\">{{content.id}}</td>\n" +
    "            <td data-title=\"'Access Rights'\" class=\"center\">{{content.accessRights}}</td>\n" +
    "            <td data-title=\"'State'\" class=\"center\">\n" +
    "                <span class=\"badge\">{{content.status}}</span>\n" +
    "            </td>\n" +
    "            <td data-title=\"'Actions'\" class=\"center\">\n" +
    "                <div class=\"btn-group btn-group-sm\">\n" +
    "                    <button class=\"btn btn-default\" title=\"View\" ng-click=\"view(content)\">\n" +
    "                        <i class=\"glyphicon glyphicon-zoom-in icon-white\"></i>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn\" ng-click=\"cancel()\">Cancel</button>\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\">Save</button>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("templates/content-view-dialog.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/content-view-dialog.tpl.html",
    "<div class=\"modal-header\">\n" +
    "    <button class=\"close\" ng-click=\"cancel()\">×</button>\n" +
    "    <h3>{{content.title}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <div ng-bind-html=\"toTrusted(content.body)\"></div>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"cancel()\">Close</button>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("templates/web-content.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/web-content.tpl.html",
    "<div class=\"webcontent\">\n" +
    "    <a visibility-role-id=\"101\" class=\"btn btn-xs\" id=\"webcontent-edit-button\" ng-hide=\"editor\" ng-click=\"edit()\" style=\"float: right;\"><i class=\"glyphicon glyphicon-edit\"></i></a>\n" +
    "    <div ng-bind-html=\"toTrusted(content.body)\"></div>\n" +
    "    <button class=\"btn btn-primary\" ng-show=\"editor\" ng-click=\"save()\"><i style=\"padding-right: 10px\" class=\"glyphicon glyphicon-check\"></i>Save</button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);
