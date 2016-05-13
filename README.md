# pothole

> Unknowingly respect their rate-limits
>
> :construction: **please consider this alpha-quality** :construction:

[![Travis][travis-img]][travis]

[travis]:https://travis-ci.org/Ma3Route/node-pothole
[travis-img]:https://img.shields.io/travis/Ma3Route/node-pothole.svg?style=flat-square


## introduction:

It is probably **not** a great idea to use this module, and here's why:

1. you should strive to **reduce** the number of API hits you do (that must be
   obvious)
1. you should **strategically** use the few number of requests a service
   avails to you
1. this will probably **not** work if you are doing **polling**,
   with your internal state forming part (or whole) of arguments passed
   to the API

However, if you know what you are doing, that is, among other factors,
your application is **not** adversely affected with the requirement to
execute a request in the earliest, allowed point in time, then you
are good to go.

**So how does it work?** Consider the basic rate-limiting scheme
&mdash; *no. of requests allowed in a time period*. For example,
[Github][github] allows
[5,000 authenticated requests per hour][github-rate-limits].
We shall call this time period, a *window*. So you provide *pothole* with
definitions of your window's size (e.g. 5000 requests) and your
window's length (e.g. 1 hour). You subsequently queue functions in it,
as you go (or on-the-fly as the 'cool' kids call it). These
functions will be executed immediately **if** the limit is **not** exceeded.
Should the window be exhausted and no more functions can
be executed without exceeding the set limit, *pothole* will 'sleep'.
More functions are queued up till the current window expires, after which
*pothole* 'wakes up' and starts executing them (in the order they were queued)
and so on... You simply do **not** exceed that limit!

[github]:https://github.com
[github-rate-limits]:https://developer.github.com/v3/#rate-limiting


## installation:

```bash
$ npm install pothole
```


## API:

```js
const pothole = require('pothole');
```

`pothole` consists of two main components:

* [`pothole.Pothole`](#pothole)
* [`pothole.PotholeMux`](#pothole-mux)

You will mainly be interacting with `PotholeMux`, which multiplexes your
functions for different APIs, etc. For this reason, the default export is
a newly-constructed `PotholeMux` instance.

---

<a name="pothole-mux"></a>
### PotholeMux:

This is the multiplexer, using multiple `Pothole`s internally. This allows you
to use *pothole* with different APIs.

* [`new pothole.PotholeMux()`](#mux-constructor)
* [`mux.add()`](#mux-add)
* [`mux.enqueue()`](#mux-enqueue)
* [`mux.stats()`](#mux-stats)
* [`mux.stop()`](#mux-stop)


<a name="mux-constructor"></a>
#### mux = new pothole.PotholeMux();

*pothole* already exports a multiplexer, ready to use. Therefore, you can do:

```js
pothole.enqueue('ma3routeApi', function() {});
```

But you can always create one yourself:

```js
const mux = new pothole.PotholeMux();
```


<a name="mux-add"></a>
#### mux.add(label, options);

Adds a new pothole for a different API. This **must** be invoked before
starting to queue up your functions.

Parameters:

* `label` (String): identifies the pothole your are using
* `options` (Object): passed as is to [`p#Pothole`](#p-constructor)

Returns `this` for chaining.


<a name="mux-enqueue"></a>
#### mux.enqueue(label, func)

Passes the function `func` to the corresponding pothole.

Throws an error if the corresponding `Pothole` is missing.

Parameters:

* `label` (String): identifies the pothole you are using
* `func` (Function): passed as is to [`p.enqueue`](#p-enqueue)

Returns `this` for chaining.


<a name="mux-stats"></a>
#### mux.stats(label)

Returns stats for the corresponding pothole. See [`p.stats()`](#p-stats)
for more details.

Throws an error if the corresponding `Pothole` is missing.


<a name="mux-stop"></a>
#### mux.stop(label)

Stops the corresponding pothole. See [`p.stop()`](#p-stop) for more details.

Throws an error if the corresponding `Pothole` is missing.

Returns `this` for chaining.

---

<a name="pothole"></a>
### Pothole:

This is the low-level component handling much of the heavy lifting.

* [`new pothole.Pothole()`](#p-constructor)
* [`p.start`](#p-start)
* [`p.enqueue()`](#p-enqueue)
* [`p.stats()`](#p-stats)
* [`p.stop()`](#p-stop)


<a name="p-constructor"></a>
#### p = new pothole.Pothole(options)

Returns a new `Pothole` instance, if a valid window is defined.
Otherwise, throws an error.

Parameters:

* `options` (Object):
    * `window` (Object): the window definition
        * `size` (Number): number of requests
        * `length` (Number): length of time in window, in milliseconds


<a name="p-start"></a>
#### p.start()

Start handling functions now.

Returns `this` for chaining.

Alias: `pothole.sink()`


<a name="p-enqueue"></a>
#### p.enqueue(func)

Add function `func` to the queue. The function is invoked immediately, if
the queue is empty, we have *not* hit the limit and the instance has been
started.

Parameters:

* `func` (Function): enqueue the function

Returns `this` so can do chaining.

**Alias**: `pothole.add()`


<a name="p-stats"></a>
#### p.stats()

Get stats on your functions, etc.

Returns:

* `queue` (Object):
    * `length` (Number): number of functions still in queue
* `window` (Object):
    * `size` (Number): number of requests allowed in a window
    * `length` (Number): time period of the window, in milliseconds
    * `remaining` (Number): number of requests remaining, in the current
    window, before hitting limit
    * `next` (Number): start of next window, in UNIX time

For example,

```js
{
    queue: {
        length: 293,
    },
    window: {
        size: 5000,
        length: 3,
        remaining: 3475,
        next: 1462982000463,
    }
}
```


<a name="p-stop"></a>
#### p.stop()

Stop handling functions now.

**Note**: *pothole* can **not** currently guarantee that the next time
you start the instance, the next window will be respected.

Returns `this` for chaining.


## license:

__The MIT License (MIT)__

Copyright (c) 2016 SkyeHi Limited
