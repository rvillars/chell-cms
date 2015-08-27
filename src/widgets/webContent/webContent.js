'use strict';

angular.module('chell-cms.webContentWidget', ['chell-widget.provider'])
    .config(function (dashboardProvider) {
        dashboardProvider
            .widget('webContent', {
                title: 'WebContent',
                description: 'Display CMS Webcontent in a widget',
                templateUrl: 'widgets/webContent/view.tpl.html',
                controller: 'widgetWebContentController',
                config: {
                    webContentId: ''
                },
                edit: {
                    templateUrl: 'templates/content-selection-dialog.tpl.html',
                    controller: 'ContentSelectionModalController'
                }
            });
    })
    .controller('widgetWebContentController', function ($scope, $sce, config) {

    });
