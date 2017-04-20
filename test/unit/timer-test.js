define([
    'utils/timer'
], function (timer) {

    describe('timer', function () {

        it('timer start/end test', function () {
            var time = new timer();
            time.start('test');
            time.end('test');

            var dump = time.dump();
            assert.equal(dump.counts.test, 1, 'test has been called once');
            assert.equal(typeof dump.sums.test, 'number', 'sum is a number');

            var invalidEnd = time.end('notStarted');
            assert.notOk(invalidEnd, 'function that has not yet started should have no end time');
        });

        it('timer tick test', function (done) {
            var time = new timer();

            time.tick('event1');

            setTimeout(function () {
                time.tick('event2');

                var between = time.between('event1', 'event2');
                assert.ok(between > 5 && between < 30000, 'between tick time is correctly calculated');

                between = time.between('no', 'value');
                assert.equal(between, null, 'invalid tick events returns null');
            }, 10);
            done();
        });

    });
});
