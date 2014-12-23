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
        scope: {}, // This is needed so each instance has its own scope
        templateUrl: 'templates/web-content.tpl.html',
        link: function (scope, element, attrs) {
            scope.$watch('empty', function() {
                if (scope.empty) {
                    element.children('.webcontent').addClass('empty');
                } else {
                    element.children('.webcontent').removeClass('empty');
                }
            });
            scope.inline = function() {
                if (scope.editor) {
                    scope.save(scope.editor.getData());
                    scope.editor.destroy();
                    scope.editor = null;
                    element.find('.content').removeAttr('contenteditable');
                    scope.ok = false;
                } else {
                    element.find('.content').attr('contenteditable', 'true');
                    scope.editor = CKEDITOR.inline(element.find('.content')[0], {startupFocus: true});
                    scope.ok = true;
                }
            };
        }
    };
});