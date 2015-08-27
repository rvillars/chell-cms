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
                    webContentId: '1'
                },
                edit: {
                    templateUrl: 'widgets/webContent/edit.tpl.html'
                }
            });
    })
    .controller('widgetWebContentController', function ($scope, config) {

    });
