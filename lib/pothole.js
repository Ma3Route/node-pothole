'use strict';
/**
 * The Pothole
 */


// npm-installed modules
const _ = require('lodash');
const debug = require('debug')('pothole:Pothole');


exports = module.exports = class Pothole {
    constructor(options) {
        this._options = _.defaultsDeep({}, options, {
            window: null,
        });

        // if a valid window has not been defined, throw an error
        // and watch it burn
        if (!(_.isObject(this._options.window)
             && _.isNumber(this._options.window.size)
             && _.isNumber(this._options.window.length))) {
            throw new Error('invalid definition of a window');
        }

        // internal state
        this._started = false;
        this._queue = [];
        this._remaining = -1;
        this._next = -1;
        this._interval = null;

        // some (fun) aliases
        this.sink = this.start;
        this.add = this.enqueue;
    }

    enqueue(func) {
        // if it is not a function, just exit the routine
        if (!_.isFunction(func)) return this;

        // 1. If the queue is NOT empty or we have reached our limit or
        //    the pothole has not been started,
        //    add the function to the queue and STOP. Otherwise proceed.
        // 2. If we have not hit the limit, execute the function
        //    immediately and STOP.
        if (this._queue.length !== 0
            || this._remaining === 0
            || this._started === false) {
            debug('queueing function');
            this._queue.push(func);
        } else {
            debug('executing function immediately');
            func();
            this._remaining--;
        }

        return this;
    }

    stats() {
        return {
            queue: {
                length: this._queue.length,
            },
            window: {
                size: this._options.window.size,
                length: this._options.window.length,
                remaining: this._remaining,
                next: this._next,
            },
        };
    }

    _init() {
        // calculate the (approximate) start of the next window
        this._next = Date.now() + this._options.window.length;

        // reset internal state partially
        this._remaining = this._options.window.size;

        // start executing functions in queue, until no more are available
        // or we reach the limit
        debug('executing backlogged functions');
        while (this._queue.length !== 0 && this._remaining > 0) {
            var func = this._queue.pop();
            func();
            this._remaining--;
        }
    }

    start() {
        debug('initializing internal state and interval');
        this._init();
        this._interval = setInterval(this._init.bind(this), this._options.window.length);
        this._started = true;
        return this;
    }

    stop() {
        debug('stopping interval and marking so');
        clearInterval(this._interval);
        this._started = false;
        return this;
    }
};
