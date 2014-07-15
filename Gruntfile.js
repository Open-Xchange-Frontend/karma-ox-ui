'use strict';

module.exports = function (grunt) {
    grunt.config.merge({
        bump: {
            options: {
                createTag: false,
                push: false
            }
        }
    });
    grunt.loadNpmTasks('grunt-bump');

    grunt.registerTask('default', []);
};

