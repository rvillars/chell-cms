/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {

    /**
     * These are the dependencies needed for this module and their order
     */
    module_dependencies: {
        js: [
            // AngularJS
            'bower-components/jquery/dist/jquery.js',
            'bower-components/angular/angular.js',
            'bower-components/angular-resource/angular-resource.js',
            'bower-components/angular-mocks/angular-mocks.js',

            // AnglularUI
            'bower-components/angular-bootstrap/ui-bootstrap-tpls.js',

            // Underscore
            'bower-components/underscore/underscore.js',
            'bower-components/angular-underscore-module/angular-underscore-module.js',
            'bower-components/angular-underscore/angular-underscore.js',

            //Angular-Translate
            'bower-components/angular-translate/angular-translate.js',

            // Misc
            'bower-components/ng-table/ng-table.js',
            'bower-components/ng-ckeditor/libs/ckeditor/ckeditor.js',
            'bower-components/ng-ckeditor/libs/ckeditor/adapters/jquery.js',
            'bower-components/ng-ckeditor/ng-ckeditor.js'
        ],
        css: [
            'bower-components/ng-table/ng-table.css',
            'bower-components/bootstrap/dist/css/bootstrap.css'
        ]
    },

    /**
     * These are the files needed for this module and their order
     */
    module_files: [
        'locale-en.js',
        'module.js',
        'models.js',
        'directives.js',
        'controllers.js',
        'widgets/**/*.js'
    ],

    module_adapters: [
        'adapters/*'
    ]
};