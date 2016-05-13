'use strict';
/**
 * Grunt, The Javascript Task Runner
 */


exports = module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    // ES5: To determine where we are running, old (0.x) or new (v4+)
    // Deprecation: remove this line below entirely
    var isNew = process.version.indexOf("v0") === -1;

    grunt.initConfig({
        eslint: {
            // ES5: do not lint in older Nodes 0.x version
            // Deprecation: remove the `if` expression 'wrapping' below
            src: isNew ? ["lib/**/*.js", "Gruntfile.js"] : [],
            test: isNew ?  ["test/**/*.js"] : [],
        },
        mochaTest: {
            test: {
                options: {
                    reporter: "spec",
                    quiet: false,
                    clearRequireCache: false,
                },
                // ES5: use compiled tests!
                // Deprecation: rename '.test/...' -> 'test/...' below
                src: [".test/**/test.*.js"],
            },
        },
    });

    grunt.registerTask("test", ["eslint", "mochaTest"]);
};
