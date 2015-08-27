'use strict';

angular.module('chell-cms.webContentWidget', ['chell-widget.provider'])
    .config(function (dashboardProvider) {
        dashboardProvider
            .widget('webConenten', {
                title: 'WebContent',
                description: 'Display CMS Webcontent in a widget',
                templateUrl: 'widgets/webContent/view.tpl.html',
                controller: 'widgetWebContentController',
                config: {
                    webContentId: ''
                },
                edit: {
                    templateUrl: 'templates/content-selection-dialog.tpl.html'
                }
            });
    })
    .controller('widgetWebContentController', function ($scope, $sce, config) {

    });
