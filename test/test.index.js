'use strict';
// lib/index.js


// npm-installed modules
const should = require('should');


// own modules
const pothole = require('..');


describe('exported module', function() {
    it('is an instance of a PotholeMux', function() {
        should(pothole).be.an.instanceof(pothole.PotholeMux);
    });

    it('exports a PotholeMux constructor', function() {
        should(pothole.PotholeMux).be.a.Function();
    });

    it('exports a Pothole constructor', function() {
        should(pothole.Pothole).be.a.Function();
    });
});
