'use strict';

describe('CmsContent', function() {

    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('chell-cms'));
    // tests start here

    it('should fetch list of content', inject(function(CmsContent) {
        CmsContent.query().then(function(content) {
            expect(content.length).toBe(2);
        });
    }));
});