/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {

    /**
     * These are the dependencies needed for this module and their order
     */
    module_dependencies: [
        // AngularJS
        'bower-components/angular/angular.js',
        'bower-components/angular-resource/angular-resource.js',
        'bower-components/angular-mocks/angular-mocks.js',

        // AnglularUI
        'bower-components/angular-bootstrap/ui-bootstrap-tpls.js',

        // Underscore
        'bower-components/underscore/underscore.js',
        'bower-components/angular-underscore-module/angular-underscore-module.js',
        'bower-components/angular-underscore/angular-underscore.js',

        // Misc
        'bower-components/ng-table/ng-table.js',
        'bower-components/ckeditor/ckeditor.js',
        'bower-components/ckeditor/adapters/jquery.js'
    ],

    /**
     * These are the files needed for this module and their order
     */
    module_files: [
        'module.js',
        'models.js',
        'directives.js',
        'controllers.js'
    ],

    module_adapters: [
        'adapters/*'
    ]
};