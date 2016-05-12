'use strict';
/**
 * Pothole multiplexer
 */


// npm-installed modules
const _ = require('lodash');
const debug = require('debug')('pothole:PotholeMux');


// own modules
const Pothole = require('./pothole');


exports = module.exports = class PotholeMux {
    constructor() {
        this._potholes = {};
        this._start = {};
    }

    /**
     * Throws error if pothole with 'label' is not found.
     *
     * @param {String} label
     * @return {Pothole} the found pothole
     * @throws Error if pothole is missing
     */
    _checkForPothole(label) {
        const pothole = this._potholes[label];
        if (!pothole) {
            throw new Error(`pothole with label '${label}' missing`);
        }
        return pothole;
    }

    /**
     * Add a new pothole
     *
     * @param {String} label
     * @param {Object} options
     * @return {Pothole} the newly-added pothole
     */
    add(label, options) {
        if (this._potholes[label]) {
            throw new Error('pothole already exists');
        }
        debug(`${label}: adding new pothole`);
        this._potholes[label] = new Pothole(options);
        this._start[label] = 1;
        return this._potholes[label];
    }

    /**
     * Enqueue a function.
     *
     * @param {String} label
     * @param {Function} func
     * @return {this}
     */
    enqueue(label, func) {
        const pothole = this._checkForPothole(label);
        if (this._start[label]) {
            debug(`${label}: starting pothole`);
            pothole.start();
            delete this._start[label];
        }
        debug(`${label}: queueing function`);
        pothole.enqueue(func);
        return this;
    }

    /**
     * Get stats on a pothole
     *
     * @param {String} label
     * @return {Object} stats
     */
    stats(label) {
        const pothole = this._checkForPothole(label);
        return pothole.stats();
    }

    /**
     * Stop a pothole.
     *
     * @param {String} label
     * @return {Pothole} the stopped pothole
     */
    stop(label) {
        const pothole = this._checkForPothole(label);
        debug(`${label}: stopping pothole`);
        return pothole.stop();
    }
};
