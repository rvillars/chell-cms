'use strict';
// Source: build/locale-en.js
try {
  angular.module('translations');
} catch (e) {
  angular.module('translations', ['pascalprecht.translate']);
}

angular.module('translations').config(['$translateProvider',
  function ($translateProvider) {
    $translateProvider.translations('en', {
      'CHELL_CMS': {
        'CONTENT_LIST': {
          'REMOVE_QUESTION': 'Are you sure?',
          'VIEW_BUTTON': 'View content',
          'EDIT_BUTTON': 'Edit content',
          'DELETE_BUTTON': 'Delete content',
          'CREATE_CONTENT_BUTTON': 'Create content',
          'COLUMN_TITLE': {
            'TITLE': 'Title',
            'CREATION_DATE': 'Creation Date',
            'CONTENT_ID': 'Content ID',
            'ACCESS_RIGHTS': 'Access Rights',
            'STATUS': 'Status',
            'ACTIONS': 'Actions'
          }
        },
        'CONTENT_FORM': {
          'TITLE': 'Title',
          'PH_TITLE': 'Title',
          'ERROR_TITLE': 'A content title is required',
          'CONTENT_ID': 'Content ID',
          'PH_GENERATED': 'Generated',
          'STATUS': 'Status',
          'SAVE_BUTTON': 'Save',
          'CANCEL_BUTTON': 'Cancel'
        }
      }
    });
    $translateProvider.preferredLanguage('en');
  }
]);
;// Source: build/module.js
var chellCms = angular.module('chell-cms', [
    'templates-chell-cms',
    'ngTable',
    'underscore',
    'angular-underscore',
    'ui.bootstrap',
    'ngMockE2E',
    'translations'
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
chellCms.directive('chellContentList', function () {
  return {
    restrict: 'E',
    scope: {
      showCreateButton: '=?',
      createButtonHook: '&?',
      editButtonHook: '&?',
      viewButtonHook: '&?',
      deleteButtonHook: '&?',
      readOnly: '&?'
    },
    controller: 'ContentListController',
    templateUrl: 'templates/content-list.tpl.html'
  };
});
chellCms.directive('chellContentForm', function () {
  return {
    restrict: 'E',
    scope: {
      saveButtonHook: '&?',
      cancelButtonHook: '&?'
    },
    controller: 'ContentFormController',
    templateUrl: 'templates/content-form.tpl.html'
  };
});
chellCms.directive('chellWebContent', function () {
  return {
    restrict: 'E',
    controller: 'WebContentController',
    scope: {},
    templateUrl: 'templates/web-content.tpl.html'
  };
});;// Source: build/controllers.js
var chellCms = angular.module('chell-cms');
chellCms.controller('ContentListController', [
  '$scope',
  '$rootScope',
  '$filter',
  '$modal',
  '$translate',
  'CmsContent',
  'ngTableParams',
  function ($scope, $rootScope, $filter, $modal, $translate, CmsContent, ngTableParams) {
    $scope.content = [];
    CmsContent.query().then(function (content) {
      $scope.content = content;
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: { title: 'asc' }
      }, {
        total: $scope.content.length,
        getData: function ($defer, params) {
          var filteredData = params.filter() ? $filter('filter')($scope.content, params.filter()) : $scope.content;
          var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: {
          $data: {},
          $emit: function () {
          }
        }
      });
    });
    $scope.$on('chellCms.contentCreated', function (event) {
      CmsContent.query().then(function (content) {
        $scope.content = content;
      });
    });
    $scope.$watchCollection('content', function () {
      if ($scope.tableParams) {
        $scope.tableParams.reload();
      }
    });
    $scope.create = function () {
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
        if (!confirm(removeQuestion))
          return;
        CmsContent.remove(content).then(function () {
          $scope.content.splice($scope.content.indexOf(content), 1);
        });
        $scope.deleteButtonHook();
      });
    };
  }
]);
chellCms.controller('ContentFormController', [
  '$scope',
  '$rootScope',
  'CmsContent',
  function ($scope, $rootScope, CmsContent) {
    $scope.editContent = {};
    $scope.config = {};
    $scope.editor = CKEDITOR.appendTo('inputBody', $scope.config, $scope.editContent.body);
    $scope.$on('chellCms.editContent', function (event, content) {
      $scope.editContent = content;
      if ($scope.editor != null) {
        $scope.editor.destroy();
        $scope.editor = $scope.editor = CKEDITOR.appendTo('inputBody', $scope.config, $scope.editContent.body);
      }
    });
    $scope.save = function () {
      $scope.editContent.body = $scope.editor.getData();
      var isNew = $scope.editContent.id == null;
      if (isNew) {
        CmsContent.create($scope.editContent);
      } else {
        CmsContent.update($scope.editContent);
      }
      $scope.cancel();
      $rootScope.$broadcast('chellCms.contentCreated');
      $scope.saveButtonHook();
    };
    $scope.cancel = function () {
      $scope.editContent = {};
      if ($scope.editor != null) {
        $scope.editor.destroy();
        $scope.editor = $scope.editor = CKEDITOR.appendTo('inputBody', $scope.config, $scope.editContent.body);
      }
      if ($scope.contentForm) {
        $scope.contentForm.$setPristine();
      }
      $scope.cancelButtonHook();
    };
  }
]);
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
chellCms.controller('ContentViewModalController', [
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
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.ok = function () {
      $modalInstance.close($scope.contentId);
    };
    $scope.changeSelection = function (content) {
      if ($scope.selectedRow == content) {
        $scope.selectedRow = null;
        $scope.contentId = null;
        return;
      }
      $scope.selectedRow = content;
      $scope.contentId = content.id;
    };
  }
]);;// Source: build/templates.js
angular.module('templates-chell-cms', ['templates/content-form.tpl.html', 'templates/content-list.tpl.html', 'templates/content-selection-dialog.tpl.html', 'templates/content-view-dialog.tpl.html', 'templates/web-content.tpl.html']);

angular.module("templates/content-form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/content-form.tpl.html",
    "<div>\n" +
    "    <form id=\"contentForm\" name=\"contentForm\" novalidate ng-submit=\"contentForm.$valid && save()\">\n" +
    "        <fieldset>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"form-group col-md-6 required\" ng-class=\"{ 'has-error' : contentForm.inputTitle.$invalid && !contentForm.inputTitle.$pristine }\">\n" +
    "                    <label for=\"inputTitle\" class=\"control-label\">{{'CHELL_CMS.CONTENT_FORM.TITLE' | translate}}</label>\n" +
    "                    <input class=\"form-control\" id=\"inputTitle\" name=\"inputTitle\" placeholder=\"{{'CHELL_CMS.CONTENT_FORM.PH_TITLE' | translate}}\" required\n" +
    "                           ng-model=\"editContent.title\" autofocus/>\n" +
    "                    <p ng-show=\"contentForm.inputTitle.$invalid && !contentForm.inputTitle.$pristine\" class=\"help-block\">{{'CHELL_CMS.CONTENT_FORM.ERROR_TITLE' | translate}}</p>\n" +
    "                </div>\n" +
    "                <div class=\"form-group col-md-6\">\n" +
    "                    <label for=\"inputContentId\" class=\"control-label\">{{'CHELL_CMS.CONTENT_FORM.CONTENT_ID' | translate}}</label>\n" +
    "                    <input class=\"form-control\" id=\"inputContentId\" placeholder=\"{{'CHELL_CMS.CONTENT_FORM.PH_GENERATED' | translate}}\" readonly=\"true\"\n" +
    "                           ng-model=\"editContent.id\"/>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div id=\"inputBody\"></div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label for=\"inputStatus\">{{'CHELL_CMS.CONTENT_FORM.STATUS' | translate}}</label>\n" +
    "                <select class=\"form-control\" id=\"inputStatus\" ng-model=\"editContent.status\" ng-value=\"'approved'\">\n" +
    "                    <option>approved</option>\n" +
    "                    <option>draft</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </fieldset>\n" +
    "        <button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"contentForm.$invalid\">{{'CHELL_CMS.CONTENT_FORM.SAVE_BUTTON' | translate}}</button>\n" +
    "        <button class=\"btn btn-default\" ng-click=\"cancel()\">{{'CHELL_CMS.CONTENT_FORM.CANCEL_BUTTON' | translate}}</button>\n" +
    "    </form>\n" +
    "</div>");
}]);

angular.module("templates/content-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/content-list.tpl.html",
    "<div>\n" +
    "    <table ng-table=\"tableParams\" show-filter=\"true\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" template-pagination=\"custom/pager/content\" class=\"table table-striped table-bordered\"\n" +
    "           id=\"contentDatatable\">\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"content in $data\">\n" +
    "            <td data-title=\"'CHELL_CMS.CONTENT_LIST.COLUMN_TITLE.TITLE' | translate\" filter=\"{'title': 'text'}\" sortable=\"'title'\" ng-bind=\"content.title\"></td>\n" +
    "            <td data-title=\"'CHELL_CMS.CONTENT_LIST.COLUMN_TITLE.CREATION_DATE' | translate\" sortable=\"'creationDate'\" ng-bind=\"content.creationDate | date:'dd.MM.yyyy'\"></td>\n" +
    "            <td data-title=\"'CHELL_CMS.CONTENT_LIST.COLUMN_TITLE.CONTENT_ID' | translate\" sortable=\"'id'\" ng-bind=\"content.id\"></td>\n" +
    "            <td data-title=\"'CHELL_CMS.CONTENT_LIST.COLUMN_TITLE.ACCESS_RIGHTS' | translate\" sortable=\"'accessRights'\" ng-bind=\"content.accessRights\"></td>\n" +
    "            <td data-title=\"'CHELL_CMS.CONTENT_LIST.COLUMN_TITLE.STATUS' | translate\" sortable=\"'status'\" class=\"center\">\n" +
    "                <span class=\"badge\" ng-bind=\"content.status\"/>\n" +
    "            </td>\n" +
    "            <td data-title=\"'CHELL_CMS.CONTENT_LIST.COLUMN_TITLE.ACTIONS' | translate\" class=\"center\">\n" +
    "                <div class=\"btn-group btn-group-sm\">\n" +
    "                    <a class=\"btn btn-default\" rel=\"tooltip\" title=\"{{'CHELL_CMS.CONTENT_LIST.VIEW_BUTTON' | translate}}\" ng-click=\"view(content)\">\n" +
    "                        <i class=\"glyphicon glyphicon-zoom-in icon-white\"></i>\n" +
    "                    </a>\n" +
    "                    <a class=\"btn btn-default\" rel=\"tooltip\" title=\"{{'CHELL_CMS.CONTENT_LIST.EDIT_BUTTON' | translate}}\" ng-click=\"edit(content)\" ng-hide=\"readOnly()\">\n" +
    "                        <i class=\"glyphicon glyphicon-edit icon-white\"></i>\n" +
    "                    </a>\n" +
    "                    <a class=\"btn btn-default\" rel=\"tooltip\" title=\"{{'CHELL_CMS.CONTENT_LIST.DELETE_BUTTON' | translate}}\" ng-click=\"remove(content)\" ng-hide=\"readOnly()\">\n" +
    "                        <i class=\"glyphicon glyphicon-trash icon-white\"></i>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "    <script type=\"text/ng-template\" id=\"custom/pager/content\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-4\">\n" +
    "                <button class=\"btn btn-default\" ng-show=\"$parent.$parent.showCreateButton && !$parent.$parent.readOnly()\" ng-click=\"$parent.$parent.create()\"><i style=\"padding-right: 10px\" class=\"glyphicon glyphicon-edit\"></i>{{'CHELL_CMS.CONTENT_LIST.CREATE_CONTENT_BUTTON'\n" +
    "                    | translate}}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4\">\n" +
    "                <div class=\"btn-group center-block\">\n" +
    "                    <button class=\"btn btn-default center-block\" ng-click=\"params.page(page.number)\" ng-class=\"{'disabled': !page.active}\" ng-repeat=\"page in pages\" ng-switch=\"page.type\">\n" +
    "                        <div ng-switch-when=\"prev\" ng-click=\"params.page(page.number)\">&laquo;</div>\n" +
    "                        <div ng-switch-when=\"first\" ng-click=\"params.page(page.number)\"><span ng-bind=\"page.number\"></span></div>\n" +
    "                        <div ng-switch-when=\"page\" ng-click=\"params.page(page.number)\"><span ng-bind=\"page.number\"></span></div>\n" +
    "                        <div ng-switch-when=\"more\" ng-click=\"params.page(page.number)\">&#8230;</div>\n" +
    "                        <div ng-switch-when=\"last\" ng-click=\"params.page(page.number)\"><span ng-bind=\"page.number\"></span></div>\n" +
    "                        <div ng-switch-when=\"next\" ng-click=\"params.page(page.number)\">&raquo;</div>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4\">\n" +
    "                <div ng-if=\"params.settings().counts.length\" class=\"ng-table-counts btn-group pull-right\">\n" +
    "                    <button type=\"button\" ng-class=\"{'active':params.count() == 10}\" ng-click=\"params.count(10)\" class=\"btn btn-default\">10</button>\n" +
    "                    <button type=\"button\" ng-class=\"{'active':params.count() == 25}\" ng-click=\"params.count(25)\" class=\"btn btn-default\">25</button>\n" +
    "                    <button type=\"button\" ng-class=\"{'active':params.count() == 50}\" ng-click=\"params.count(50)\" class=\"btn btn-default\">50</button>\n" +
    "                    <button type=\"button\" ng-class=\"{'active':params.count() == 100}\" ng-click=\"params.count(100)\" class=\"btn btn-default\">100</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </script>\n" +
    "</div>");
}]);

angular.module("templates/content-selection-dialog.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/content-selection-dialog.tpl.html",
    "<div class=\"modal-header\">\n" +
    "    <button class=\"close\" ng-click=\"cancel()\">×</button>\n" +
    "    <h3>Select Content</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\" ng-controller=\"ContentListController\">\n" +
    "    <table ng-table=\"tableParams\" show-filter=\"true\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" template-pagination=\"custom/pager/content\" class=\"table table-striped table-bordered\"\n" +
    "           id=\"contentDatatable\">\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"content in $data\"\n" +
    "            ng-click=\"changeSelection(content)\"\n" +
    "            ng-class=\"{'active': content.id === contentId}\">\n" +
    "            <td data-title=\"'CHELL_CMS.CONTENT_LIST.COLUMN_TITLE.TITLE' | translate\" filter=\"{'title': 'text'}\" sortable=\"'title'\" ng-bind=\"content.title\"></td>\n" +
    "            <td data-title=\"'CHELL_CMS.CONTENT_LIST.COLUMN_TITLE.CREATION_DATE' | translate\" sortable=\"'creationDate'\" ng-bind=\"content.creationDate | date:'dd.MM.yyyy'\"></td>\n" +
    "            <td data-title=\"'CHELL_CMS.CONTENT_LIST.COLUMN_TITLE.CONTENT_ID' | translate\" sortable=\"'id'\" ng-bind=\"content.id\"></td>\n" +
    "            <td data-title=\"'CHELL_CMS.CONTENT_LIST.COLUMN_TITLE.ACCESS_RIGHTS' | translate\" sortable=\"'accessRights'\" ng-bind=\"content.accessRights\"></td>\n" +
    "            <td data-title=\"'CHELL_CMS.CONTENT_LIST.COLUMN_TITLE.STATUS' | translate\" sortable=\"'status'\" class=\"center\">\n" +
    "                <span class=\"badge\" ng-bind=\"content.status\"/>\n" +
    "            </td>\n" +
    "            <td data-title=\"'CHELL_CMS.CONTENT_LIST.COLUMN_TITLE.ACTIONS' | translate\" class=\"center\">\n" +
    "                <div class=\"btn-group btn-group-sm\">\n" +
    "                    <a class=\"btn btn-default\" rel=\"tooltip\" title=\"{{'CHELL_CMS.CONTENT_LIST.VIEW_BUTTON' | translate}}\" ng-click=\"view(content)\">\n" +
    "                        <i class=\"glyphicon glyphicon-zoom-in icon-white\"></i>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "    <script type=\"text/ng-template\" id=\"custom/pager/content\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-4\">\n" +
    "                <button class=\"btn btn-default\" ng-show=\"$parent.$parent.showCreateButton && !$parent.$parent.readOnly()\" ng-click=\"$parent.$parent.create()\"><i style=\"padding-right: 10px\" class=\"glyphicon glyphicon-edit\"></i>{{'CHELL_CMS.CONTENT_LIST.CREATE_CONTENT_BUTTON'\n" +
    "                    | translate}}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4\">\n" +
    "                <div class=\"btn-group center-block\">\n" +
    "                    <button class=\"btn btn-default center-block\" ng-click=\"params.page(page.number)\" ng-class=\"{'disabled': !page.active}\" ng-repeat=\"page in pages\" ng-switch=\"page.type\">\n" +
    "                        <div ng-switch-when=\"prev\" ng-click=\"params.page(page.number)\">&laquo;</div>\n" +
    "                        <div ng-switch-when=\"first\" ng-click=\"params.page(page.number)\"><span ng-bind=\"page.number\"></span></div>\n" +
    "                        <div ng-switch-when=\"page\" ng-click=\"params.page(page.number)\"><span ng-bind=\"page.number\"></span></div>\n" +
    "                        <div ng-switch-when=\"more\" ng-click=\"params.page(page.number)\">&#8230;</div>\n" +
    "                        <div ng-switch-when=\"last\" ng-click=\"params.page(page.number)\"><span ng-bind=\"page.number\"></span></div>\n" +
    "                        <div ng-switch-when=\"next\" ng-click=\"params.page(page.number)\">&raquo;</div>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4\">\n" +
    "                <div ng-if=\"params.settings().counts.length\" class=\"ng-table-counts btn-group pull-right\">\n" +
    "                    <button type=\"button\" ng-class=\"{'active':params.count() == 10}\" ng-click=\"params.count(10)\" class=\"btn btn-default\">10</button>\n" +
    "                    <button type=\"button\" ng-class=\"{'active':params.count() == 25}\" ng-click=\"params.count(25)\" class=\"btn btn-default\">25</button>\n" +
    "                    <button type=\"button\" ng-class=\"{'active':params.count() == 50}\" ng-click=\"params.count(50)\" class=\"btn btn-default\">50</button>\n" +
    "                    <button type=\"button\" ng-class=\"{'active':params.count() == 100}\" ng-click=\"params.count(100)\" class=\"btn btn-default\">100</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </script>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn\" ng-click=\"cancel()\">Cancel</button>\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\" ng-disabled=\"!contentId\">Save</button>\n" +
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
