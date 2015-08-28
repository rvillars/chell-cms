'use strict';

angular.module('chell-cms.webContentWidget', ['chell-widget.provider'])
    .config(function (dashboardProvider) {
        dashboardProvider
            .widget('webContent', {
                title: 'WebContent',
                description: 'Display CMS web content in a widget',
                templateUrl: 'widgets/webContent/view.tpl.html',
                controller: 'widgetWebContentController',
                config: {
                    webContentId: ''
                },
                edit: {
                    templateUrl: 'widgets/webContent/edit.tpl.html'
                }
            });
    })
    .controller('widgetWebContentController', function ($scope, config) {

    })
    .controller('widgetWebContentEditController', function ($scope) {
        $scope.changeSelection = function(content) {

            // unselect on second click
            if ($scope.selectedRow == content) {
                $scope.selectedRow = null;
                $scope.contentId = null;
                $scope.config.webContentId = null;
                return;
            }

            // select new
            $scope.selectedRow = content;
            $scope.contentId = content.id;
            $scope.config.webContentId = content.id;
        };
    });
