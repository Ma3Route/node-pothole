// lib/pothole.js


// npm-installed modules
const should = require('should');


// own modules
const Pothole = require('../lib/pothole');


// module variables
const p = new Pothole({ window: { size: 5, length: 10 } });
function noop() {}
function throws() { throw new Error('test fails'); }


describe('Pothole#Pothole', function() {
    var invalids = [undefined, null, noop, "1", {}, [], true];

    it('throws error if window.size is not a number', function() {
        invalids.forEach(function(i) {
            should.throws(function() {
                new Pothole({ window: { size: i, length: 1 } });
            });
        });
    });

    it('throws error if window.length is not a number', function() {
        invalids.forEach(function(i) {
            should.throws(function() {
                new Pothole({ window: { size: 1, length: i } });
            });
        });
    });
});


describe('Pothole#sink', function() {
    it('is an alias of Pothole#start', function() {
        should.strictEqual(p.sink, p.start);
    });
});


describe('Pothole#add', function() {
    it('is an alias of Pothole#enqueue', function() {
        should.strictEqual(p.add, p.enqueue);
    });
});


describe('Pothole#start', function() {
    var ps;

    beforeEach(function() {
        ps = new Pothole({ window: { size: 2, length: 1000 } });
        ps.start();
    });

    afterEach(function() {
        ps.stop();
    });

    it('starts interval, that executes queued up functions', function(done) {
        // enqueue numerous functions so that we hit the limit
        // then add the last one that is supposed to exit this test case
        var funcs = 100;
        while(funcs-- > 0) {
             ps.enqueue(noop);
        }
        ps.enqueue(done);
    });
});


describe('Pothole#enqueue', function() {
    var invalids = [1, true, {}, [], "1"];
    var pq;

    beforeEach(function() {
        pq = new Pothole({ window: { size: 2, length: 1000 } });
        pq.start();
    });

    afterEach(function() {
        pq.stop();
    });

    it('just returns `this` if it is not passed a function', function() {
        invalids.forEach(function(i) {
            should.doesNotThrow(function() {
                var result = p.enqueue(i);
                should.strictEqual(result, p);
            });
        });
    });

    it('just queues function if pothole has not been started', function() {
        var exp = new Pothole({ window: { size: 2, length: 100 } });
        exp.enqueue(throws);
    });

    it('executes function immediately if queue is empty and we have not hit limit', function(done) {
        pq.enqueue(done);
    });

    it('adds the function to queue if we have hit limit', function() {
        // add two functions, so that we have hit the limit
        // now add a function that throws an error
        pq.enqueue(noop).enqueue(noop);
        pq.enqueue(throws);
    });

    it('adds the function to queue if it is NOT empty', function() {
        // add three functions, so that the 1st two are executed and
        // the last one placed in queue.
        // Then add another function that throws and error
        pq.enqueue(noop).enqueue(noop).enqueue(noop);
        pq.enqueue(throws);
    });
});


describe('Pothole#stop', function() {
    var ps;

    beforeEach(function() {
        ps = new Pothole({ window: { size: 2, length: 1500 } });
        ps.start();
    });

    it('stops the interval', function() {
        // hit the limit then add a function that throws an error
        // to be executed in the next window
        // now stop the pothole so that this function is not executed
        ps.enqueue(noop).enqueue(noop).enqueue(throws);
        ps.stop();
    });

    it('return the instance', function() {
        const result = ps.stop();
        should.strictEqual(result, ps);
    });
});


describe('Pothole#stats', function() {
    var ps;

    beforeEach(function() {
        ps = new Pothole({ window: { size: 2, length: 1500 } });
        ps.start();
    });

    afterEach(function() {
        ps.stop();
    });

    it('returns valid stats', function() {
        // run some function first, to ensure stats are accounted well
        ps.enqueue(noop).enqueue(noop).enqueue(noop);
        const stats = ps.stats();
        should(stats).be.an.Object();
        should(stats).containDeep({
            queue: {
                length: 1,
            },
            window: {
                size: 2,
                length: 1500,
                remaining: 0,
            },
        });
    });
});
