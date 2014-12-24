'use strict';

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
        scope: {
            contentId: '@?',
            readOnly: '&?'
        },
        templateUrl: 'templates/web-content.tpl.html',
        link: function (scope, element, attrs) {
            scope.$watch('empty', function() {
                if (scope.empty && !scope.readOnly()) {
                    element.children('.webcontent').addClass('empty');
                } else {
                    element.children('.webcontent').removeClass('empty');
                }
            });
            scope.inline = function() {
                element.find('.content').attr('contenteditable', 'true');
                scope.editor = CKEDITOR.inline(element.find('.content')[0], {startupFocus: true});
                scope.backup = scope.editor.getData();
                scope.isInline = true;
            };
            scope.inlineSave = function() {
                scope.save(scope.editor.getData());
                scope.editor.destroy();
                scope.editor = null;
                element.find('.content').removeAttr('contenteditable');
                scope.isInline = false;
            };
            scope.inlineCancel = function() {
                scope.editor.setData(scope.backup);
                scope.editor.destroy();
                scope.editor = null;
                element.find('.content').removeAttr('contenteditable');
                scope.isInline = false;
            };
        }
    };
});