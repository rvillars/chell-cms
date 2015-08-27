'use strict';

angular.module('chell-cms.webContentWidget', ['chell-widget.provider'])
    .config(function (dashboardProvider) {
        dashboardProvider
            .widget('webContent', {
                title: 'WebContent',
                height: '100px',
                description: 'Display CMS web content in a widget',
                templateUrl: 'widgets/webContent/view.tpl.html',
                controller: 'widgetWebContentController',
                config: {}
            });
    })
    .controller('widgetWebContentController', function ($scope, config) {

    });
