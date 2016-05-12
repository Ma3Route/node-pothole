'use strict';
/**
 * Pothole: Unknowingly respect their rate-limits
 */


// own modules
const Pothole = require('./pothole');
const PotholeMux = require('./pothole-mux');


exports = module.exports = new PotholeMux();
exports.Pothole = Pothole;
exports.PotholeMux = PotholeMux;
