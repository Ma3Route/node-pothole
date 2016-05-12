/**
 * Grunt, The Javascript Task Runner
 */


exports = module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        eslint: {
            src: ["Gruntfile.js", "lib/**/*.js"],
            test: ["test/**/*.js"],
        },
        mochaTest: {
            test: {
                options: {
                    reporter: "spec",
                    quiet: false,
                    clearRequireCache: false,
                },
                src: ["test/**/test.*.js"],
            },
        },
    });

    grunt.registerTask("test", ["eslint", "mochaTest"]);
};
