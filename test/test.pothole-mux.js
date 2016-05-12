// lib/pothole-mux.js


// npm-installed modules
const should = require('should');


// own modules
const Pothole = require('../lib/pothole');
const PotholeMux = require('../lib/pothole-mux');


// module variables
const p = new PotholeMux();
const genericOpts = { window: { size: 1, length: 1000 } };
function noop() {}


describe('PotholeMux#PotholeMux', function() {
    it('returns an instance, without any needed args', function() {
        var pc = new PotholeMux();
        should(pc).be.an.instanceof(PotholeMux);
    });
});



describe('Pothole#_checkForPothole', function() {
    it('throws an error if pothole is missing', function() {
        should.throws(function() {
            p._checkForPothole('Missing');
        });
    });

    it('returns a Pothole instance if it has been created earlier', function() {
        // add a pothole then check for it
        const label = 'CheckForPothole';
        p.add(label, genericOpts);
        const pc = p._checkForPothole(label);
        should(pc).an.instanceof(Pothole);
    });
});


describe('Pothole#add', function() {
    it('adds a new pothole, if not yet created', function() {
        const pc = p.add('Add', genericOpts);
        should(pc).be.an.instanceof(Pothole);
    });

    it('throws an error if the pothole already exists', function() {
        should.throws(function() {
            p.add('Add', genericOpts);
        });
    });
});


describe('Pothole#enqueue', function() {
    before(function() {
        p.add('Enqueue', genericOpts);
    });

    it('enqueues a function in the corresponding pothole', function(done) {
        p.enqueue('Enqueue', done);
    });

    it('throws if corresponding pothole is missing', function() {
        should.throws(function() {
            p.enqueue('Missing', noop);
        });
    });
});


describe('Pothole#stats', function() {
    var pc;

    before(function() {
        pc = p.add('Stats', genericOpts);
    });

    it('returns stats for a pothole', function() {
        // run some functions through the pothole just to add more
        // 'random'
        pc.enqueue('Stats', noop);
        const stats = p.stats('Stats');
        should.deepEqual(stats, pc.stats());
    });
});


describe('Pothole#stop', function() {
    var pc;

    before(function() {
        pc = p.add('Stop', genericOpts);
    });

    it('returns the stopped pothole', function() {
        should.strictEqual(p.stop('Stop'), pc);
    });

    it('actually stops the pothole', function() {
        // enqueue functions till we hit the limit,
        // then add a function that throws an error in the next window
        // then stop
        p.enqueue('Stop', noop).enqueue('Stop', noop);
        p.enqueue('Stop', function() { throw new Error('failed to stop'); });
        p.stop('Stop');
    });
});
