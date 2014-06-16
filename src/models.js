'use strict';

var chellCms = angular.module('chell-cms');

chellCms.factory('CmsContent', function(CmsAdapter) {
    return {
        query: function() {
            return CmsAdapter.getContentList();
        },
        get: function(id) {
            return CmsAdapter.getContent(id);
        },
        create: function(content) {
            return CmsAdapter.createContent(content);
        },
        update: function(content) {
            return CmsAdapter.updateContent(content);
        },
        remove: function(content) {
            return CmsAdapter.removeContent(content);
        }
    };
});