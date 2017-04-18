define([
    'utils/helpers',
    'view/utils/breakpoint'
], function (utils, breakpoint) {

    describe('browser', function () {


        function breakpointClassname(width, height) {
            var mockPlayer = utils.createElement();
            breakpoint(mockPlayer, width, height);
            return mockPlayer.className;
        }

        it('width >= 1280 sets jw-breakpoint-7', function () {
            assert.equal(breakpointClassname(1280), 'jw-breakpoint-7');
        });

        it('width >= 960 sets jw-breakpoint-6', function () {
            assert.equal(breakpointClassname(960), 'jw-breakpoint-6');
        });

        it('width >= 800 sets jw-breakpoint-5', function () {
            assert.equal(breakpointClassname(800), 'jw-breakpoint-5');
        });

        it('width >= 640 sets jw-breakpoint-4', function () {
            assert.equal(breakpointClassname(640), 'jw-breakpoint-4');
        });

        it('width >= 540 sets jw-breakpoint-3', function () {
            assert.equal(breakpointClassname(540), 'jw-breakpoint-3');
        });

        it('width >= 420 sets jw-breakpoint-2', function () {
            assert.equal(breakpointClassname(420), 'jw-breakpoint-2');
        });

        it('width >= 320 sets jw-breakpoint-1', function () {
            assert.equal(breakpointClassname(320), 'jw-breakpoint-1');
        });

        it('width < 320 sets jw-breakpoint-0', function () {
            assert.equal(breakpointClassname(319), 'jw-breakpoint-0');
        });

        it('if height > width jw-orientation-portrait is set', function () {
            assert.equal(breakpointClassname(319, 320), 'jw-breakpoint-0 jw-orientation-portrait');
        });
    });
});
