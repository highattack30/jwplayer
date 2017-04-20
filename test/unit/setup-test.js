define([
    'test/underscore',
    'jquery',
    'api/api',
], function (_, $, Api) {

    describe('Setup', function () {

        it('fails when playlist is not an array', function (done) {

            var readyHandler = function () {
                assert.ok(false, 'setup should not succeed');
            };

            var errorHandler = function (message) {
                assert.ok(message, 'setup failed with message: ' + message);
            };

            var model = {};
            testSetup(done, model, readyHandler, errorHandler, assert);

            model = { playlist: '' };
            testSetup(done, model, readyHandler, errorHandler, assert);

            model = { playlist: 1 };
            testSetup(done, model, readyHandler, errorHandler, assert);

            model = { playlist: true };
            testSetup(done, model, readyHandler, errorHandler, assert);
        });

        it('fails if playlist is empty', function (done) {
            var model = {
                playlist: []
            };

            testSetup(done, model, function () {
                assert.ok(false, 'setup should not succeed');
            }, function (message) {
                assert.ok(message, 'setup failed with message: ' + message);
            }, assert);
        });

        it('fails when playlist items are filtered out', function (done) {
            var model = {
                playlist: [{ sources: [{ file: 'file.foo' }] }]
            };

            var playlist;
            testSetup(done, model, function () {
                // 'this' is the api instance
                playlist = this.getPlaylist();
                assert.deepEqual(playlist, [], 'playlist is an empty array');
                assert.ok(false, 'setup should not succeed');
            }, function (message) {
                playlist = this.getPlaylist();
                assert.deepEqual(playlist, [], 'playlist is an empty array');
                assert.ok(message, 'setup failed with message: ' + message);
            }, assert);
        });

        it('succeeds when model.playlist.sources is valid', function (done) {
            var model = {
                playlist: [{ sources: [{ file: 'http://playertest.longtailvideo.com/mp4.mp4' }] }]
            };

            testSetup(done, model, function () {
                assert.ok(true, 'setup ok');
            }, function (message) {
                assert.ok(false, 'setup failed with message: ' + message);
            });
        });

        it('modifies config', function (done) {
            var options = {
                file: 'http://playertest.longtailvideo.com/mp4.mp4',
                aspectratio: '4:3',
                width: '100%'
            };
            var optionsOrig = _.extend({}, options);

            var model = options;

            testSetup(done, model, function () {
                assert.ok(true, 'setup ok');
                assert.notEqual(options, optionsOrig, 'config was modified');
            }, function (message) {
                assert.ok(true, 'setup failed with message: ' + message);
                assert.notEqual(options, optionsOrig, 'config was modified');
            });
        });

        function testSetup(done, model, success, error) {
            var container = createContainer('player-' + Math.random().toFixed(12).substr(2));
            var api = new Api(container, _.noop);
            api.setup(model);

            api.on('ready', function () {
                clearTimeout(timeout);
                success.call(api);
                try {
                    api.remove();
                } catch (e) {
                    assert.notOk(e.toString());
                }
            });
            api.on('setupError', function (e) {
                clearTimeout(timeout);
                error.call(api, e.message);
                try {
                    api.remove();
                } catch (evt) {
                    assert.notOk(evt.toString());
                }
            });
            var timeout = setTimeout(function () {
                assert.notOk('Setup timed out');
                try {
                    api.remove();
                } catch (e) {
                    assert.notOk(e.toString());
                }
            }, 8000);
            done();
            return api;
        }

        function createContainer(id) {
            var container = $('<div id="' + id + '"></div>')[0];
            return container;
        }

    });
});
